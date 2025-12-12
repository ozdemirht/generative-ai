import dotenv from 'dotenv';
import OpenAI from 'openai';
import * as fs from 'fs';

dotenv.config();

const assistantID = process.env.ASSISTANT_ID || '';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


// List vector stores
const vectorStores = await openai.vectorStores.list();
console.log(vectorStores);

const vectorStoreID = 'vs_693ca11765dc8191b6817a35a7c4cf20';

//await openai.beta.assistants.update(assistantID, {
//  tool_resources: { file_search: { vector_store_ids: [vectorStoreID] } },
//});
