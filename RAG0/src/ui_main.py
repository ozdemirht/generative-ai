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

## Core Interface to LLM
from core_llm import MyLLMSession
###
# ui_constants.py
CHAT_MESSAGE = "How can I help?"

###
#QA_CHAIN_PROMPT = PromptTemplate.from_template(template=prompt)
#vector_store = None
#llm = None

def get_completion(st, prompt):
    full_response = "Not ready!"
    if st and st.session_state.llm:
        st.session_state.llm.set_temperature(st.session_state.temperature)
        full_response = st.session_state.llm.get_completion(prompt)
        print(f"\nFull response => {full_response.response_metadata['token_usage']}")
        st.session_state.token_counter_completions += full_response.response_metadata['token_usage'][
            'completion_tokens']
        st.session_state.token_counter_prompt += full_response.response_metadata['token_usage']['prompt_tokens']
        st.session_state.token_counter_total += full_response.response_metadata['token_usage']['total_tokens']

    return full_response

### UI
# prompt = hub.pull("rlm/rag-prompt")
prompt = """
You are an assistant for question-answering tasks. 
Use the following pieces of retrieved context to answer the question. 
If you don't know the answer, just say that 'you do not know'. 
If the retrieved context is not sufficient, just say that 'there is not enough context'. 
Use three sentences maximum and keep the answer concise.
Context: {context} 
Question: {question}
Answer:
"""

# Load environment variables from the .env file
load_dotenv()
# Access the variables
# API_KEY
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
## $0.05/1M tokens gpt-5-mini $0.25/1M tokens
model_name = os.getenv("OPENAI_MODEL_NAME","gpt-5-nano")

st.title("Chat with your book - www.gutenberg.org")

with st.sidebar:
    st.title("Your Documents")
    uploaded_file = st.file_uploader(" Upload a TXT file and start asking questions", type="txt")
    st.session_state.uploaded_file = uploaded_file
    msg_length = 0
    if "messages" in st.session_state and st.session_state.messages:
        msg_length = len(st.session_state.messages)
    st.markdown(f"Messages: {msg_length}")
    # Temperature Configuration
    st.session_state.temperature = st.slider(
        "Temperature controls creativity",
        min_value=0.0,
        max_value=1.0,
        value=0.1,
        step=0.05,
        help="Lower(0.0): more based on given data, Higher(1.0): attempts to be creative"
    )
    # Model Configuration - COST!
    st.session_state.model_option = st.selectbox(
        "LLM Model",
        ["gpt-5-nano $0.05/1M", "gpt-5-mini $0.25/1M"],
        index=0
    )
    if "token_monitor" in st.session_state and st.session_state.token_monitor:
        msg_length = len(st.session_state.messages)
        st.markdown(f"Completion Tokens: {st.session_state.token_counter_completions}")
        st.markdown(f"Prompt Tokens....: {st.session_state.token_counter_prompt}")
        st.markdown(f"Total Tokens.....: {st.session_state.token_counter_total}")
        st.markdown(f"Estimated Cost...: {st.session_state.token_counter_total*(0.05/1000000)}\u00A2")


# use st.session_state
if "llm" not in st.session_state:
    llm = MyLLMSession("OpenAI", 22, OPENAI_API_KEY, model_name=model_name, prompt=prompt)
    st.session_state.llm = llm

# monitor token usage
if "token_monitor" not in st.session_state:
    st.session_state.token_monitor = True
    st.session_state.token_monitor_start = time.time()
    st.session_state.token_counter_completions = 0
    st.session_state.token_counter_prompt = 0
    st.session_state.token_counter_total = 0

# use st.session_state
if "llm" in st.session_state and st.session_state.llm:
    if "uploaded_file" in st.session_state and st.session_state.uploaded_file:
        if "uploaded_file_done" not in st.session_state:
            st.session_state.llm.load_file(uploaded_file,st=st)
            st.session_state.uploaded_file_done = True

# Initialize chat history
if "messages" not in st.session_state:
    st.session_state.messages = [{"role": "assistant", "content": "Let's start chatting! 👇"}]

# Display chat messages from history on app rerun
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Accept user input
if prompt := st.chat_input(CHAT_MESSAGE):
    if "llm" not in st.session_state:
        llm = MyLLMSession("OpenAI", 22, OPENAI_API_KEY, "gpt-5-nano", prompt=prompt)
        st.session_state.llm = llm

    if "uploaded_file" in st.session_state:
        if "uploaded_file_done" in st.session_state and st.session_state.llm:
            # Add user message to chat history
            st.session_state.messages.append({"role": "user", "content": prompt})

            # Display user message in chat message container
            with st.chat_message("user"):
                st.markdown(prompt)

            # Display assistant response in chat message container
            with st.chat_message("assistant"):
                message_placeholder = st.empty()
                full_response = get_completion(st, prompt)
                print(f"\nFull response => {full_response}")
                print(f"\nFull response => {full_response.content}")
                # what needs to be added to chat
                message_placeholder.markdown(full_response.content)
            # Add assistant response to chat history
            if st.session_state.messages:
                st.session_state.messages.append({"role": "assistant", "content": full_response.content})
        else:
            with st.chat_message("assistant"):
                st.markdown("Load a file to Vector store!")
    else:
        with st.chat_message("assistant"):
            st.markdown("Load a file first!")
