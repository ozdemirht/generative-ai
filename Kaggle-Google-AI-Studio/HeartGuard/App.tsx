import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { HeartPulse, RotateCcw } from 'lucide-react';
import { AppMode, Message, Role, SimulationProfile } from './types';
import { sendMessageToGemini } from './services/geminiService';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import ModeSelector from './components/ModeSelector';
import { INITIAL_SUGGESTIONS, SIMULATION_PROFILES } from './constants';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [mode, setMode] = useState<AppMode>(AppMode.QA);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSimProfile, setCurrentSimProfile] = useState<SimulationProfile | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleModeChange = (newMode: AppMode) => {
    if (newMode !== mode) {
      setMode(newMode);
      setMessages([]); 
      setCurrentSimProfile(null);
      
      let welcomeText = "";
      if (newMode === AppMode.LEARNING) welcomeText = "Welcome to the Hypertension Learning Path! I am here to train you on the WHO Guidelines and mHypertension strategies. Shall we start with **Module 1: Diagnosis & Initiation**?";
      if (newMode === AppMode.QUIZ) welcomeText = "Welcome to the Hypertension Knowledge Quiz! I'll ask you a series of questions. Type 'Ready' to start.";
      if (newMode === AppMode.SIMULATION) {
        // Pick a random profile
        const randomProfile = SIMULATION_PROFILES[Math.floor(Math.random() * SIMULATION_PROFILES.length)];
        setCurrentSimProfile(randomProfile);
        welcomeText = `**Entering Patient Simulation.**\n\nPatient: **${randomProfile.name}**\nAge: ${randomProfile.age}\nBP: ${randomProfile.bp}\n\nScenario: ${randomProfile.scenario}\n\nStart the consultation when you are ready.`;
      }
      if (newMode === AppMode.QA) welcomeText = "Ask me anything about hypertension guidelines, prevention, or management.";
      if (newMode === AppMode.CASE_MANAGEMENT) welcomeText = "Entering **Patient Records System**. I can help you register patients, log vitals, and schedule check-ins. All data is saved locally on this device.\n\nType *'List my patients'* or *'I have a new patient'* to begin.";
      
      if (welcomeText) {
         setMessages([{
            id: uuidv4(),
            role: Role.MODEL,
            text: welcomeText,
            timestamp: new Date()
         }]);
      }
    }
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: Message = {
      id: uuidv4(),
      role: Role.USER,
      text: text,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Create simulation context string if applicable
      let simContext = undefined;
      if (mode === AppMode.SIMULATION && currentSimProfile) {
        simContext = `
        Name: ${currentSimProfile.name}
        Age: ${currentSimProfile.age}
        BP: ${currentSimProfile.bp}
        Background: ${currentSimProfile.scenario}
        Personality: ${currentSimProfile.personality}
        BEHAVIORAL RULES:
        ${currentSimProfile.behavioralRules}
        `;
      }

      const response = await sendMessageToGemini(messages, text, mode, simContext);
      
      const botMsg: Message = {
        id: uuidv4(),
        role: Role.MODEL,
        text: response.text,
        timestamp: new Date(),
        groundingChunks: response.groundingChunks
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: uuidv4(),
        role: Role.MODEL,
        text: "I'm having trouble connecting to the service. Please try again.",
        timestamp: new Date(),
        isError: true
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: uuidv4(),
        role: Role.MODEL,
        text: "Hello! I am **HeartGuard**, your AI assistant for hypertension care. I can provide current guidelines, run training quizzes, or roleplay patient scenarios.",
        timestamp: new Date()
      }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col h-screen bg-orange-50 text-slate-900 font-sans">
      
      {/* Header - Gradio Style */}
      <header className="flex-none border-b border-orange-200 bg-orange-50 px-4 py-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-teal-600 rounded-lg text-white shadow-sm">
             <HeartPulse size={24} />
           </div>
           <div>
             <h1 className="font-bold text-xl text-slate-900 leading-tight">HeartGuard</h1>
             <p className="text-xs text-orange-800/60 font-medium">Hypertension CHW Assistant</p>
           </div>
        </div>
        
        <ModeSelector currentMode={mode} onModeChange={handleModeChange} />
      </header>

      {/* Main Container */}
      <main className="flex-1 overflow-hidden relative flex flex-col max-w-5xl mx-auto w-full">
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-hide">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          
          {isLoading && (
            <div className="flex justify-start w-full">
                <div className="flex items-center gap-2 px-4 py-3 bg-white/50 border border-orange-100 rounded-2xl rounded-tl-none text-orange-400 text-sm">
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-75" />
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-150" />
                </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />

          {/* Empty State / Suggestions */}
          {messages.length === 1 && !isLoading && (
             <div className="mt-8">
               <p className="text-sm font-semibold text-orange-900/40 uppercase tracking-wider mb-3">Suggested Actions</p>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {INITIAL_SUGGESTIONS.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(suggestion)}
                      className="text-left px-4 py-3 rounded-lg border border-orange-200 hover:border-teal-500 hover:bg-white hover:text-teal-700 transition-all text-sm text-slate-600 bg-white/60"
                    >
                      {suggestion}
                    </button>
                  ))}
               </div>
             </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-orange-50 border-t border-orange-200">
           <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
           
           <div className="flex justify-between items-center mt-2 px-1">
              <span className="text-[10px] text-orange-900/40">
                Generated content may be inaccurate. Verify with a doctor.
              </span>
              <button 
                onClick={() => setMessages([])}
                className="flex items-center gap-1 text-xs text-orange-900/40 hover:text-red-500 transition-colors"
                title="Clear History"
              >
                <RotateCcw size={12} />
                Clear
              </button>
           </div>
        </div>
      </main>
    </div>
  );
};

export default App;