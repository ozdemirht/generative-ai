# Chat with your book (LLM with RAG)

## Introduction

Documents are downloaded from https://www.gutenberg.org/, Project Gutenberg is an online library of more than 75,000 free eBooks. 
Objective is to build a Q&A chatbot that allows user to load a book then talk about a book with LLM. 

It is based on Retrieval Augmented Generation (RAG). UI is based on streamlit, 
LangChain is leveraged to define processing pipelines. 

It will look also look at from operational perspective (especially cost and token usage).
Where we decide to place a function will have a long term impact. 

![Streamlit UI](./img/UI_main_screen_v1.png)

## Pipeline
 1. Ingestion
     1. Document Loading 
     1. Data Cleaning (regex, NLTK, spaCy, etc.)
     1. Chunking
     1. Embedding
     1. Store chunks to vector database 
1. Q&A Session (Inferencing)
    1. Accept user query
    1. Select relevant context from vector database
    1. Generate a prompt, containing instructions, context, and user's question
    1. Invoke LLM to generate a response
    1. Present response to user
    1. Update memory and wait for the next question (goto 2.i)

## Ingestion

![RAG Ingestion Flow](./img/RAG-ingestion-flow.png)

### Data Cleaning


### Chunking
This process splits the document into chunks that will be embedded (transformed to vector representation).
There needs to be some linkage between chunks.
The **content characteristics** (e.g., unstructured vs structured) is an important consideration when deciding chunking strategy. 

A good splitter for the content at hand will highly likely to produce better relevant data. That will directly impact the quality of completion. 

Conclusion: There are many options. 

### Embedding
- OpenAI - model selection trade-off cost - accuracy
- Local - model selection trade-off latency - accuracy

Note: Very large documents ingestion via streaming 

Conclusion: There are many options & architectural compositions.

### Memory/Context Maintenance
- Local 
- Claude   

### Prompt
Prompt quality is very important for quality completion. 
LangChain hub has some tested prompts. 


### Submitting a user query (Inferencing)

When the system is building a context, 
a) it should be relevant to the given query, and 
b) it should not waste token budget and be aware of context_window size. 

The bigger context increases tokens/query and latency because LLM needs to process more 
(because time complexity is not linear with respect to the number of tokens). 

![RAG Inferencing Flow](./img/RAG-inferencing.png)

#### Select relevant data from Vector Database by using a user query
- **Maximum Marginal Reference** (retrieve diverse context document chunks)
- Compression (ContextualCompressionRetriever)
- SelfQueryRetriever

#### Update Memory if needed

- Summarize memory to stay within context_window constraint.

#### Invoke with context and user query
Here, the system finally calls LLM to obtain a response. 

## Cost 
The cost of operation has several components
 1. Ingestion
    1. If the application is using LLM Provider for embedding, then there will be a cost for these tokens. 
    2. For instance, assuming 1k tokens = 750 words, then for each chunk, it is possible to calculate the number of tokens needed.
    3. Then, the aggregation of tokens of each chunk gives the total tokens for the ingested document. 
    4. Then, based on the text embedding model used, it can be calculated.
    5. For instance, text-embedding-3-small costs 0.03/1M and text-embedding-3-large costs 0.13/1M tokens.
 1. Inferencing 
    1. Embedding of user's prompt. If the service is using LLM provider, then there will. 
    2. Number of input and output tokens in each call
    2. Input tokens is determined by the tokenized form of prompt that system submits to LLM provider. For instance, RAG prompt has 3 parts; instructions, context, and user's prompt/question. 
    3. Output tokens is determined by the system when calling to LLM provider. Application can limit the number of tokens to be generated. This is a parameter in API call. 

![Shows Token Consumption](./img/UI-main_screen_v2.png)

[Calculate-Number-of-Tokens.ipynb](./src/Calculate-Number-of-Tokens.ipynb) shows how to calculate token cost. 

## Summary
The number of configurations when building ingestion and Q&A steps are considerable.  

Architecture choices will depend on the application. 
The cost running some steps in owned infrastructure vs hiring LLM providers for jobs to be done. 

## Details

### Setup

'''
pip install langchain
pip install langchain-openai
pip install faiss-cpu
'''

### UI


## References
 1. [OPENAI Pricing](https://platform.openai.com/docs/pricing)
 1. [Navigating OpenAI Embeddings API Pricing: Token Count vs. API Calls](https://community.openai.com/t/navigating-openai-embeddings-api-pricing-token-count-vs-api-calls/289081)
 1. [From Tokens to Costs: Embedding Estimation with OpenAI API](https://mindfulcto.com/from-tokens-to-costs-embedding-estimation-with-openai-api-8c535753a479)
## Q&A

### Is there a difference between predict, generate, completion in LLM?
