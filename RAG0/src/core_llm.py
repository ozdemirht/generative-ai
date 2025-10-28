###
#
###
import os

from io import StringIO
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate

###
import logging

logger = logging.getLogger(os.path.splitext(os.path.basename(__file__))[0])
logging.basicConfig(filename=f"./logs/{os.path.splitext(os.path.basename(__file__))[0]}.log", filemode='w',encoding='utf-8', level=logging.DEBUG)

###
class MyLLMSession:
    def __init__(self, name, api_key, model_name, prompt):
        """
        Initialize the LLM session instance, TODO Builder or Factory

        :param name: Name of LLM
        :type name: str
        :param api_key: API key from OpenAI/Gemini/Claude/...
        :type api_key: str
        :param model_name: Model to be utilized, @Valid
        :type model_name: str
        :param prompt: Injecting PromptTemplate, @Valid
        :type prompt: PromptTemplate
        """
        self.name = name
        self.OPENAI_API_KEY = api_key
        self.model_name = model_name
        self.prompt = prompt
        self.QA_CHAIN_PROMPT = PromptTemplate.from_template(template=prompt)
        self.temperature = 0.1
        logger.debug(f"self.temperature = {self.temperature}")
        logger.debug(f"self.OPENAI_API_KEY = {self.OPENAI_API_KEY}")
        logger.debug(f"self.model_name = {self.model_name}")

    def greet(self):
        return f"Hello, my name is {self.name}."

    def get_details(self):
        return f"I am {self.name} and using {self.model_name} for your questions."

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
            with st.spinner("Cleaning...", show_time=True):
                text = self.clean_text(stringio.read())
            st.success("Data cleaning completed!")

            # Break it into chunks
            with st.spinner("Chunking...", show_time=True):
                chunks = self.chunk_text(text)
                #st.write("Chunks:")
            st.write("Chunking completed!")

            logger.debug("\nChunking DONE\n")
            logger.debug(f"\nChunks\n{chunks[:10]}")
            ##logger.debug(f"\nNumber of Chunks\n{size(chunks)}")
            logger.debug(f"OPENAI_API_KEY = {self.OPENAI_API_KEY}")

            chunks = chunks[:5] ## cost control during development
            # Embedding and loading to vector store
            with st.spinner("Embedding and loading to vector store...", show_time=True):
                self.embeddings = OpenAIEmbeddings(openai_api_key=self.OPENAI_API_KEY)
                self.vector_store = FAISS.from_texts(chunks, self.embeddings)
            st.write("Embedding and loading to vector store completed!")

            # Let's configure an LLM
            with st.spinner("Initializing LLM Client...", show_time=True):
                self.llm = ChatOpenAI(
                    openai_api_key=self.OPENAI_API_KEY,
                    temperature=self.temperature,
                    max_tokens=1000,
                    model_name=self.model_name,
                )
            st.write("Initializing LLM Client completed!")
            logger.debug("\nLLM is ready!\n")

        return True

    def get_completion(self, user_question):
        response = ""

        # Find Matching chunks - cosine similarity is used - IMPORTANT STEP
        match = self.vector_store.similarity_search(user_question)

        docs_content = "\n\n".join(doc.page_content for doc in match)

        logger.debug(f"\nquestion => {user_question}")
        logger.debug(f"\ncontext => {docs_content}")

        # Fill in the prompt template
        messages = self.QA_CHAIN_PROMPT.invoke({"question": user_question, "context": docs_content})
        # this is the message it will send to LLM
        logger.debug(f"\n Message2LLM => {messages}")

        # Remote/Local - LLM Provider - Model
        # Returns completion for the given prompt
        response = self.llm.invoke(messages)

        return response

###
