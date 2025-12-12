import dotenv from 'dotenv';
import OpenAI from 'openai';
import { type Thread } from 'openai/resources/beta/threads/threads';
import {addMessageToThread, getModelResponse, getEmailByName} from './structure.js';
//import {addMessageToThread, getModelResponse} from './structure.js';
import inquirer  from 'inquirer';
import { restClient } from '@massive.com/client-js';

dotenv.config();


export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

const assistantID = process.env.ASSISTANT_ID || '';
export const polygonAPIKey = process.env.POLYGON_API_KEY || '';


export const polygonRestClient = restClient(polygonAPIKey, 'https://api.massive.com');

const vectorStoreID = 'vs_693ca11765dc8191b6817a35a7c4cf20'; 

//const getLastStocksTrade = async (symbol) => {
//    return await rest.getLastStocksTrade(symbol);
//}

// This function updates the assistant model we established in Task3.
// We can now change the prompt/tools through our code rather than the playground
const updateAssistant = async () => {
    if (assistantID) {
        await openai.beta.assistants.update(assistantID, {
         instructions:  'You are CourseraTestbot and you can only answer questions about Typescript or LLMS/Generative AI.'+
        'You can also answer questions about the policies within Company Z, and you can use the uploaded file as reference for those.'+
        'If you asked about company policies, use file_search on your vector store to get the policy details and citation.'+
        'If you asked about something that is prohibited by the policies of Company Z, you must say "I cannot answer." and inform the user and provide the policy details and citation.'+
        'If you asked about company email address, extract name and use getEmailByName function to get the email address of the person.'+
        'If you asked about stock data, extract symbol and use getLastStocksTrade function to get the latest stock data from Polygon API.'+
        'Your answers must be a paragraph at most, and cannot contain any actual code. YOU CANNOT ANSWER QUESTIONS ABOUT ANYTHING ELSE.',
            tools: [
                {'type': 'file_search'},
                {'type':'function', 'function': {'name': 'getLastStocksTrade', 'description': 'Get stock data of given symbol from Polygon API'}},
                {'type':'function', 'function': {'name': 'getEmailByName', 'description': 'Get email by name'}}    
            ],
            tool_resources: { file_search: { vector_store_ids: [vectorStoreID] } },
        });
    }
};

// This is function creates a new thread (conversation session) which we can add to our assistant
const createThread = async () => {
    const thread = await openai.beta.threads.create();
    return thread;
};

// This is the main function that polls the user for input and returns the response of the assistant to the user and adds both user and ai messages to the thread
const main = async (thread: Thread) => {

    if(assistantID) {

        while(true) {

            const answer = await inquirer.prompt([

                {
                    type: 'input',
                    name: 'user_query',
                    message: 'What would you like to ask?'
                }
            ])

            if (answer.user_query === 'exit') {
                break
            }
            
            console.log('\n')
            const msgID = await addMessageToThread(thread, answer.user_query)
            const run = await openai.beta.threads.runs.create(thread.id, {
                assistant_id: assistantID
            })

            await getModelResponse(msgID, run.id, thread.id)
            console.log('\n')
        }

    }

}

// Here we update the assistant based on our new defined parameters (above) and start the conversation with the assistant if a thread is created successfully
updateAssistant()
const thread = createThread().then((thread) => {
    try {
        main(thread)
    } catch (error) {
        console.log('Error: Could not initialize conversation loop as thread was not created due to below error.\n')
        console.log(error)
    }
})