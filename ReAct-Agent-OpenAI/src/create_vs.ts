import dotenv from 'dotenv';
import OpenAI from 'openai';
import * as fs from 'fs';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const fileStreams = ["./Company-Policies-X.md"].map((path) =>
  fs.createReadStream(path),
);

// Create a vector store including our two files.
let vectorStore = await openai.vectorStores.create({
  name: "Financial Statement",
});

console.log(vectorStore.id)  // vs_693ca11765dc8191b6817a35a7c4cf20

