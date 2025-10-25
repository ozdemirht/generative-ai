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


### Embedding
- OpenAI - model selection trade-off cost - accuracy
- Local - model selection trade-off latency - accuracy

Very large documents ingestion via streaming 

### Memory/Context Maintenance
- Local 
- Claude   

### Submitting a user query

#### Select relevant data from Vector Database by using a user query
- **Maximum Marginal Reference** (retrieve diverse context document chunks)
- Compression (ContextualCompressionRetriever)
- SelfQueryRetriever

#### Update Memory if needed

- Summarize memory to stay within context_window constraint.

#### Invoke with context and user query

## References
