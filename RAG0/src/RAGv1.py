#
# Install necessary packages
#
# pip install streamlit
# pip install PyPDF2
# pip install langchain
# pip install langchain-text-splitters
# pip install langchain-classic
# pip install langchain-openai
#  pip install faiss-cpu --force-reinstall
#  pip install faiss-gpu
# pip install
#

# Import
import streamlit as st
from io import StringIO
import os
from dotenv import load_dotenv

# from PyPDF2 import PdfReader
# from langchain import hub
from langchain_text_splitters import RecursiveCharacterTextSplitter

from langchain_community.vectorstores import FAISS
# from langchain.chains import RetrievalQA

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.prompts import PromptTemplate
from langchain_core.documents import Document

from langchain_classic.chains.question_answering import load_qa_chain
from langchain_classic.chains import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain

from langchain_openai import OpenAI
from langchain_openai import OpenAIEmbeddings
from langchain_openai import ChatOpenAI

from langgraph.graph import START, StateGraph
from typing_extensions import List, TypedDict


def test():
    st.title("Hello Streamlit-er 👋")
    st.markdown(
        """ 
        This is a playground for you to try Streamlit and have fun. 

        **There's :rainbow[so much] you can build!**

        We prepared a few examples for you to get started. Just 
        click on the buttons above and discover what you can do 
        with Streamlit. 
        """
    )

    if st.button("Send balloons!"):
        st.balloons()


def read_file_txt(file_path):
    try:
        with open(file_path, 'r') as file:
            content = file.read()
            return content
    except FileNotFoundError:
        print(f"Error: The file '{file_path}' was not found.")
    except Exception as e:
        print(f"An error occurred: {e}")


def convert_to_lowercase(text):
    lowercased_text = text.lower()
    return lowercased_text


# Define state for application
class State(TypedDict):
    question: str
    context: List[Document]
    answer: str


# Define application steps
def retrieve(state: State):
    retrieved_docs = vector_store.similarity_search(state["question"])
    return {"context": retrieved_docs}


def generate(state: State):
    docs_content = "\n\n".join(doc.page_content for doc in state["context"])
    messages = prompt.invoke({"question": state["question"], "context": docs_content})
    response = llm.invoke(messages)
    return {"answer": response.content}


##=========================================
load_dotenv()
OPENAI_API_KEY = os.getenv(OPENAI_API_KEY,"NO API KEY FOUND")
model_name = "gpt-5-nano"  ## $0.05/1M tokens gpt-5-mini $0.25/1M tokens

# Upload PDF files
st.header("My first Chatbot")
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
print(f"Prompt: {prompt}")

# Build prompt
template1 = """Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer. Use three sentences maximum. Keep the answer as concise as possible. Always say "thanks for asking!" at the end of the answer. 
Context: {context}
Question: {question}
Helpful Answer:"""

QA_CHAIN_PROMPT = PromptTemplate.from_template(template=prompt)
"""
QA_CHAIN_PROMPT = ChatPromptTemplate.from_messages(
    [
        ("system", "You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know. Use three sentences maximum and keep the answer concise."),
        ("user", "Context: {context}\nQuestion: {question}\n Answer: "),         # <--- "question" and "context" will be filled in here
    ]
)
"""

with st.sidebar:
    st.title("Your Documents")
    uploaded_file = st.file_uploader(" Upload a PDf file and start asking questions", type="txt")

# text = file ##read_file_txt(file)
st.write(" ")

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
    # generate embedding
    embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)

    # creating vector store - FAISS, Facebook …
    # embeddings by OpenAI
    # Initialize FAISS
    # store chunks and embeddings
    vector_store = FAISS.from_texts(chunks, embeddings)
    print("\nVector store - ready!\n")

    # Let's configure an LLM
    llm = ChatOpenAI(
        openai_api_key=OPENAI_API_KEY,
        temperature=0,
        max_tokens=1000,
        model_name=model_name,
    )

    # Compile application and test
    # graph_builder = StateGraph(State).add_sequence([retrieve, generate])
    # graph_builder.add_edge(START, "retrieve")
    # graph = graph_builder.compile()

    i = 1
    while True:
        # get user question - UI UI
        print("\nUser question - ready!\n")
        try:

            user_question = "What is the name of this book?"
            user_question = st.text_input("Type Your question here", placeholder="What is the name of this book?",
                                      key=f"user_question")
            i += 1
            print(f"\nquestion => {user_question}")

            if user_question in ["exit", "by", "quit"]:
                break

            # Semantic Search
            match = vector_store.similarity_search(user_question)
            # st.write(match)

            # output completion
            # chain -> take the question, get relevant document, pass it to the LLM, generate the output
            # chain = load_qa_chain(llm, chain_type="stuff")
            # chain = create_stuff_documents_chain(llm, QA_CHAIN_PROMPT)
            """
            document_chain = create_stuff_documents_chain(llm, QA_CHAIN_PROMPT)
            retriever = vector_store.as_retriever()  # Your existing retriever
            chain = create_retrieval_chain(retriever, document_chain)
            chain = RetrievalQA.from_chain_type(
                llm,
                retriever=vector_store.as_retriever(),
                return_source_documents=True,
                chain_type_kwargs={"prompt": QA_CHAIN_PROMPT}
            )
            response = chain.invoke({"input":user_question})
            """
            docs_content = docs_content = "\n\n".join(doc.page_content for doc in match)

            print(f"\nquestion => {user_question}")
            print(f"\ncontext => {docs_content}")

            messages = QA_CHAIN_PROMPT.invoke({"question": user_question, "context": docs_content})
            print(f"\n Message2LLM => {messages}")

            response = llm.invoke(messages)

            st.write(response)
            print(f"\n{user_question} => {response}")

        except st.errors.StreamlitDuplicateElementKey as e:
            print(e)

print("\nThank you for using Streamlit.")
