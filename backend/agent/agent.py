from dotenv import load_dotenv
from agent.tools import *
import os

from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_openai import ChatOpenAI
from langchain.agents import AgentType, initialize_agent, Tool
from agent.crud_tools import *
# from agent.context import generate_agent_context
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.text_splitter import CharacterTextSplitter

load_dotenv()


# def create_db_context_index():
#     text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
#     full_context = generate_agent_context()
#     texts = text_splitter.split_text(full_context)
#
#     embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
#     db_context = FAISS.from_texts(texts, embeddings)
#     return db_context

 

def ag(user_message, user_id):
    base_llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", google_api_key=os.environ["GOOGLE_API_KEY"])
    summarization_llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", google_api_key=os.environ["GOOGLE_API_KEY"])

    tools = [
        Tool.from_function(func=get_user_details, name="get_user_details",
            description="Retrieves details of a specific user from the database. Requires: user_id (integer)"),
        Tool.from_function(func=search_wikipedia, name="search_wikipedia",
            description="Searches Wikipedia for information. Requires: search_term (string)"),
        Tool.from_function(func=get_expenses_for_user, name="get_expenses_for_user",
            description="Retrieves all expenses for a user. Requires: user_id (integer)"),
        Tool.from_function(func=get_products_for_user, name="get_products_for_user",
            description="Retrieves all products for a user. Requires: user_id (integer)"),
        Tool.from_function(func=calculate_profit_loss, name="calculate_profit_loss",
            description="Calculates total profit or loss for a user. Requires: user_id (integer)"),
        Tool.from_function(func=get_weekly_sales, name="get_weekly_sales",
            description="Calculates total sales for a user for the current week. Requires: user_id (integer)"),
        Tool.from_function(func=get_weekly_profit_loss, name="get_weekly_profit_loss",
            description="Calculates total profit or loss for a user for the current week. Requires: user_id (integer)"),

        
        Tool.from_function(func=calculate_monthly_taxes, name="calculate_monthly_taxes",
            description="Calculates monthly taxes for a user. Returns a list of 12 tax amounts. Requires: user_id (integer)."),
        Tool.from_function(func=calculate_monthly_sales, name="calculate_monthly_sales",
            description="Calculates monthly sales for a user. Returns a list of dictionaries with 'month' and 'sales'. Requires: user_id (integer)."),
        Tool.from_function(func=calculate_monthly_profit_loss, name="calculate_monthly_profit_loss",
            description="Calculates monthly profit or loss for a user. Returns a list with 'month' and 'profit_loss'. Requires: user_id (integer)."),

        Tool.from_function(func=analyze_sales_performance_orm, name="analyze_sales_performance_orm",
            description="Analyzes sales data to identify top and bottom-performing products. No input required"),
        Tool.from_function(func=get_sales, name="get_sales",
            description="Retrieves all sales data of a user. Requires: user_id (integer)"),
        Tool.from_function(func=get_taxes_for_user, name="get_taxes_for_user",
            description="Retrieves all tax records for a user. Requires: user_id (integer)"),
        Tool.from_function(func=get_general_user_data, name="get_general_user_data",
            description="Fetches products, sales, expenses, and monthly taxes for a user.USE THIS ONLY WHEN THE PROVIDED TOOLS CAN'T ANSWER THE REQUEST YOU'VE BEEN GIVEN. Requires: user_id (integer)."),
    ]

    agent1 = initialize_agent(
        tools,
        base_llm,
        AgentType.ZERO_SHOT_REACT_DESCRIPTION,
        verbose=True
    )

    # db_context = create_db_context_index()

    try:
        augmented_prompt = f"""
        You are an AI business assistant that helps business owners manage finances, sales, taxes, income, and profit.

        **Capabilities:**
        - Analyze sales data
        - Calculate taxes and generate reports
        - Provide financial insights
        - Present data in visual charts and graphs
        - Answer business-related queries concisely and professionally

        **User Expectations:**
        - Be precise and data-driven.
        - Offer actionable insights.
        - Ask for missing arguments instead of assuming values.
        - Ensure function calls use correct arguments.
        - Never return the direct database queried info instead get the meaning out of it then return that

        **Function Execution Guidelines:**
        - Extract function arguments from user input accurately.
        - If an argument is missing, ask the user for it DON'T CALL ANY TOOL.
        - Pass arguments directly as values and don't add their names (e.g., `1, 0.05`).
        - Validate that date arguments are in 'YYYY-MM-DD' format.
        - Convert numbers to the correct type (integer/float).

        **Example Tool Calls:**
        - `get_user_details(123)`
        - `calculate_taxes_for_user(456, 0.07)`
        - `calculate_taxes_by_date_range(789, 0.06, "2024-01-01", "2024-01-31")`

        **User's request:** {user_message}
        **User ID:** {user_id}


        """

        prompt = agent1.invoke({"input": augmented_prompt})
        agent_output = prompt['output']

        # Validate and execute tool calls
        

        return agent_output

    except Exception as e:
        print(f"Error in agent: {e}")
        return f"Can't answer that question for now please write another Prompt"


 