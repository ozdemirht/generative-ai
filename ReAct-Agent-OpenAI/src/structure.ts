import { type Thread } from 'openai/resources/beta/threads/threads'
import {openai, polygonRestClient} from './index.js'
import { sleep } from "modern-async";
import axios from 'axios';

// TOOL Description
export const getLastStocksTrade ={
    name: 'getLastStocksTrade',
    description: 'Get the last trade price of a stock',
    parameters: {
        type: 'object',
        properties: {
            symbol: {   
                type: 'string', 
                description: 'The stock symbol of the stock you want to get the last trade price for'
            }               
        },
        required: ['symbol']
    }
}

// TOOL Description
export const getEmailByName ={
    name: 'getEmailByName',
    description: 'Get an email address by name',
    parameters: {
        type: 'object',
        properties: {
            name: {
                type: 'string', 
                description: 'The name of the person whose email address you want to retrieve'
            }
        },
        required: ['name']
    }
}

// This function adds user messages to a given thread object (needs thread object and message body)
export const addMessageToThread = async (thread: Thread, body: string) => {

    const message = await openai.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: body
    })
    return message.id
}

// This is the crux of the tool-calling logic.
// Essentially, this model handles a "run" - or single execution of the the model. It retrieves the status of the run, given the latest user message
// and then has different logic depending on that status of the run. If the run requires functions to be parsed, it parses those functions and returns the output
// to the thread. At the end, it returns the latest message to the user once it decides that the run is completed.
export const getModelResponse = async (latestMessageID: string, runID: string, threadID: string) => {

    while (true) {

        const run = await openai.beta.threads.runs.retrieve(threadID, runID)

        console.log("OpenAI.Log>"+run.status)

        switch (run.status) {
        
        case "failed":
            console.log('Run failed')
            return
        case "cancelled":
            console.log('Run cancelled')
            return
        case "completed":
            const responseMessages = await openai.beta.threads.messages.list(threadID, {after: latestMessageID, order: 'asc'})

            for (const message of responseMessages.data) {
                const firstContent = message.content?.[0]
                if (firstContent && firstContent.type === 'text' && firstContent.text?.value) {
                    console.log(firstContent.text.value)
                } else {
                    console.log('No text')
                }
            
            }
            return
        case "requires_action":
            if(run.required_action) {

                let toolsToCall = run.required_action.submit_tool_outputs.tool_calls
                const toolOutputArray = []

                for (const tool of toolsToCall) {

                    let toolCallID = tool.id
                    let functionName = tool.function.name
                    let functionArgs = tool.function.arguments
                    let output
                    console.log('Calling tool: '+functionName)
                    console.log('Calling args: '+functionArgs)

                    if(functionName === 'getEmailByName') {

                        console.log('Calling tool: name : '+JSON.parse(functionArgs).name)
                        output = { 'email': JSON.parse(functionArgs).name+'99@companyx.com' }
                    } else if(functionName === 'getLastStocksTrade') {    
                        console.log('Calling tool: symbol: '+JSON.parse(functionArgs).symbol)
                        const val = "AAPL" //JSON.parse(functionArgs).symbol
                        //const url = "https://api.massive.com/v3/reference/tickers/"+val+"?apiKey="+process.env.POLYGON_API_KEY
                        //const response = await axios.get(url)

                        //const url = "https://financialmodelingprep.com/stable/quote?symbol="+val+"&apiKey=AUMpPluEGt2oHHhngcApxVsmQzZEd9tX"
                        //const response = await axios.get(url)

                        output = { 'last_trade_price': 155.5 }
                        // This is a mock output, in a real scenario t his would be fetched from a stock market API
                    }
                toolOutputArray.push({tool_call_id: toolCallID, output: JSON.stringify(output)})
                await openai.beta.threads.runs.submitToolOutputs(threadID, runID, { tool_outputs: toolOutputArray})
                }

            await sleep(1000)
            }
        }
    }
}