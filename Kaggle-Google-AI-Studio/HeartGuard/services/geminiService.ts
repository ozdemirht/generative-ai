
import { GoogleGenAI, Content, Part } from "@google/genai";
import { Message, Role, AppMode, GroundingChunk } from "../types";
import { SYSTEM_INSTRUCTIONS } from "../constants";
import { DOCUMENTS_CONTEXT } from "../knowledgeBase";
import { PATIENT_TOOLS, executeTool } from "./mcpTools";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is not set");
  }
  return new GoogleGenAI({ apiKey });
};

export const sendMessageToGemini = async (
  history: Message[],
  currentMessage: string,
  mode: AppMode,
  simulationContext?: string
): Promise<{ text: string; groundingChunks?: GroundingChunk[] }> => {
  const client = getClient();

  // 1. Prepare Initial Conversation History
  let contents: Content[] = history
    .filter((msg) => !msg.isError)
    .map((msg) => ({
      role: msg.role === Role.USER ? "user" : "model",
      parts: [{ text: msg.text } as Part],
    }));

  contents.push({
    role: "user",
    parts: [{ text: currentMessage } as Part],
  });

  const modelName = "gemini-2.5-flash";
  const isCaseManagement = mode === AppMode.CASE_MANAGEMENT;
  
  let fullSystemInstruction = `
    ${SYSTEM_INSTRUCTIONS[mode]}
    
    ${DOCUMENTS_CONTEXT}
  `;

  // Inject dynamic simulation profile if available
  if (mode === AppMode.SIMULATION && simulationContext) {
    fullSystemInstruction += `\n\n=== CURRENT PATIENT PROFILE ===\n${simulationContext}`;
  }

  // 2. Configure Tools
  // Use MCP tools for Case Management, Google Search for QA
  const tools = isCaseManagement 
    ? [{ functionDeclarations: PATIENT_TOOLS }] 
    : (mode === AppMode.QA ? [{ googleSearch: {} }] : undefined);

  try {
    // 3. First API Call
    let response = await client.models.generateContent({
      model: modelName,
      contents: contents,
      config: {
        systemInstruction: fullSystemInstruction,
        tools: tools,
        temperature: mode === AppMode.QUIZ ? 0.3 : 0.5,
      },
    });

    // 4. Handle Function Calling Loop (Case Management Mode)
    // The model might return a function call instead of text. We need to execute it and loop back.
    // We only support a single turn of tool use for simplicity here (Model calls -> We execute -> Model responds).
    
    // Check if the response contains a function call.
    // @google/genai handles the parsing, we check candidates[0].content.parts
    const firstCandidate = response.candidates?.[0];
    const functionCalls = firstCandidate?.content?.parts?.filter(p => p.functionCall);

    if (functionCalls && functionCalls.length > 0) {
      // 4a. Add the model's tool call request to history
      contents.push({
        role: "model",
        parts: firstCandidate.content.parts
      });

      // 4b. Execute all requested tools
      const functionResponses = [];
      for (const call of functionCalls) {
        if (call.functionCall) {
          const result = await executeTool(call.functionCall.name, call.functionCall.args);
          functionResponses.push({
            functionResponse: {
              name: call.functionCall.name,
              response: { result: result }
            }
          });
        }
      }

      // 4c. Add the tool results to history
      contents.push({
        role: "user",
        parts: functionResponses as Part[]
      });

      // 4d. Second API Call (with tool results)
      response = await client.models.generateContent({
        model: modelName,
        contents: contents,
        config: {
          systemInstruction: fullSystemInstruction,
          tools: tools,
        },
      });
    }

    const text = response.text || "I processed that request.";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined;

    return { text, groundingChunks };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};