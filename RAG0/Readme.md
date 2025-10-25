# Chat with your book (LLM with RAG)

## Introduction

Documents are downloaded from https://www.gutenberg.org/, Project Gutenberg is an online library of more than 75,000 free eBooks. 
Objective is to build a Q&A chatbot that allows user to load a book then talk about a book with LLM. 

It is based on Retrieval Augmented Generation (RAG). UI is based on streamlit, 
LangChain is leveraged to define processing pipelines. 

It will look also look at from operational perspective (especially cost and token usage).
Where we decide to place a function will have a long term impact. 

## Pipeline
 1. Ingestion
     1. Document Loading 
     1. Data Cleaning (regex, NLTK, spaCy, etc.)
     1. Chunking
     1. Embedding
     1. Store chunks to vector database 
1. Q&A Session
    1. Accept user query
    1. Select relevant context from vector database
    1. Generate a prompt, containing instructions, context, and user's question
    1. Invoke LLM to generate a response
    1. Present response to user
    1. Update memory and wait for the next question (goto 2.i)

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


### Submitting a user query

When the system is building a context, 
a) it should be relevant to the given query, and 
b) it should not waste token budget and be aware of context_window size. 

The bigger context increases tokens/query and latency because LLM needs to process more 
(because time complexity is not linear with respect to the number of tokens). 

#### Select relevant data from Vector Database by using a user query
- **Maximum Marginal Reference** (retrieve diverse context document chunks)
- Compression (ContextualCompressionRetriever)
- SelfQueryRetriever

#### Update Memory if needed

- Summarize memory to stay within context_window constraint.

#### Invoke with context and user query
Here, the system finally calls LLM to obtain a response. 

## Summary
The number of configurations when building ingestion and Q&A steps are considerable.  

## Details

### Setup

### UI


## References

## Q&A

### Is there a difference between predict, generate, completion in LLM?
