import streamlit as st
import random
import time
from dotenv import load_dotenv
import os

from io import StringIO
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate

###

###
class MyLLMSession:
    def __init__(self, name, age, api_key, model_name, prompt):
        self.name = name
        self.age = age
        self.OPENAI_API_KEY = api_key
        self.model_name = model_name
        self.prompt = prompt
        self.QA_CHAIN_PROMPT = PromptTemplate.from_template(template=prompt)
        self.temperature = 0.1

    def greet(self):
        return f"Hello, my name is {self.name}."

    def get_details(self):
        return f"{self.name} is {self.age} years old and works as a ."

    def set_temperature(self, temperature):
        self.temperature = temperature

    def get_temperature(self):
        return self.temperature

    def convert_to_lowercase(self,text):
        lowercased_text = text.lower()
        return lowercased_text

    def clean_text(self, text):
        result = self.convert_to_lowercase(text).replace("\r\n", "\n").replace("\n\n", "\n")
        result = result.replace("_", "")  # .replace("\n", " ")
        return result

    def chunk_text(self, text):
        text_splitter = RecursiveCharacterTextSplitter(
            separators="\n",
            chunk_size=1000,
            chunk_overlap=150,  ## linking consecutive chunks
            length_function=len
        )
        chunks = text_splitter.split_text(text)
        return chunks

    def load_file(self, uploaded_file, st):
        if uploaded_file is not None:
            stringio = StringIO(uploaded_file.getvalue().decode("utf-8"))

            # data cleaning
            #text = convert_to_lowercase(stringio.read()).replace("\r\n", "\n").replace("\n\n", "\n")
            #text = text.replace("_", "")  # .replace("\n", " ")

            text = self.clean_text(stringio.read())
            # Break it into chunks
            """
            text_splitter = RecursiveCharacterTextSplitter(
                separators="\n",
                chunk_size=1000,
                chunk_overlap=150,  ## linking consecutive chunks
                length_function=len
            )
            chunks = text_splitter.split_text(text)
            """
            chunks = self.chunk_text(text)
            st.write("Chunks:")
            st.write(chunks)

            print("\nChunks\n")
            print(chunks[:10])
            chunks = chunks[:5]
            self.embeddings = OpenAIEmbeddings(openai_api_key=self.OPENAI_API_KEY)
            self.vector_store = FAISS.from_texts(chunks, self.embeddings)
            print("\nVector store is ready!\n")
            # Let's configure an LLM
            self.llm = ChatOpenAI(
                openai_api_key=self.OPENAI_API_KEY,
                temperature=self.temperature,
                max_tokens=1000,
                model_name=model_name,
            )
            print("\nLLM is ready!\n")

        return True

    def get_completion(self, user_question):
        response = ""

        match = self.vector_store.similarity_search(user_question)

        docs_content = "\n\n".join(doc.page_content for doc in match)

        print(f"\nquestion => {user_question}")
        print(f"\ncontext => {docs_content}")

        messages = self.QA_CHAIN_PROMPT.invoke({"question": user_question, "context": docs_content})
        print(f"\n Message2LLM => {messages}")

        response = self.llm.invoke(messages)

        return response

###
#OPENAI_API_KEY = "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"
model_name = "gpt-5-nano"  ## $0.05/1M tokens gpt-5-mini $0.25/1M tokens
# prompt = hub.pull("rlm/rag-prompt")
prompt = """
You are an assistant for question-answering tasks. 
Use the following pieces of retrieved context to answer the question. 
If you don't know the answer, just say that you don't know. 
Use three sentences maximum and keep the answer concise.
Context: {context} 
Question: {question}
Answer:
"""
QA_CHAIN_PROMPT = PromptTemplate.from_template(template=prompt)
vector_store = None
llm = None

def convert_to_lowercase(text):
    lowercased_text = text.lower()
    return lowercased_text

def load_file(uploaded_file):
    if uploaded_file is not None:
        stringio = StringIO(uploaded_file.getvalue().decode("utf-8"))
        # st.write(stringio)

        # data cleaning
        text = convert_to_lowercase(stringio.read()).replace("\r\n", "\n").replace("\n\n", "\n")
        text = text.replace("_", "")  # .replace("\n", " ")
        # st.write(text)

        # Break it into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            separators="\n",
            chunk_size=1000,
            chunk_overlap=150,  ## linking consecutive chunks
            length_function=len
        )
        chunks = text_splitter.split_text(text)
        st.write("Chunks:")
        st.write(chunks)

        print("\nChunks\n")
        print(chunks[:10])
        chunks = chunks[:5]
        embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)
        vector_store = FAISS.from_texts(chunks, embeddings)
        print("\nVector store is ready!\n")
        # Let's configure an LLM
        llm = ChatOpenAI(
            openai_api_key=OPENAI_API_KEY,
            temperature=0,
            max_tokens=1000,
            model_name=model_name,
        )
        print("\nLLM is ready!\n")

    return True

def get_completion(user_question):
    response = ""

    match = vector_store.similarity_search(user_question)

    docs_content = "\n\n".join(doc.page_content for doc in match)

    print(f"\nquestion => {user_question}")
    print(f"\ncontext => {docs_content}")

    messages = QA_CHAIN_PROMPT.invoke({"question": user_question, "context": docs_content})
    print(f"\n Message2LLM => {messages}")

    response = llm.invoke(messages, temperature=self.temperature)

    return response

###
