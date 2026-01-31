import google.generativeai as genai
from app.core.config import get_settings
from functools import lru_cache

settings = get_settings()

@lru_cache()
def configure_genai():
    """Configures the Gemini API client once."""
    genai.configure(api_key=settings.GEMINI_API_KEY)

def get_model(model_name: str = "gemini-2.0-flash-001"):
    """Returns a configured GenerativeModel instance."""
    configure_genai()
    return genai.GenerativeModel(model_name)

def embed_text(text: str, model: str = "models/text-embedding-004"):
    """Embeds text using the specified model."""
    configure_genai()
    result = genai.embed_content(
        model=model,
        content=text,
        task_type="retrieval_document"
    )
    return result['embedding']
