from app.services.rag_engine import RAGService
from app.core.database import AsyncSessionLocal

# We need a way to get a DB session inside the tool
async def get_db_session():
    async with AsyncSessionLocal() as session:
        yield session

async def retrieve_docs_tool(query: str):
    """
    Retrieves relevant documentation chunks for a specific technical query/error.
    """
    async with AsyncSessionLocal() as db:
        rag = RAGService(db)
        return await rag.retrieve_context(query)

async def analyze_logs_tool(query_params: str):
    """
    MOCK: Analyzes system logs for errors matching the query.
    """
    return ["Log line 245: Connection Refused", "Log line 246: Retrying..."]

async def validate_config_tool(merchant_id: str):
    """
    MOCK: Checks merchant configuration for common errors.
    """
    return {"valid": False, "error": "Webhook Secret missing"}

TOOLS = [retrieve_docs_tool, analyze_logs_tool, validate_config_tool]
