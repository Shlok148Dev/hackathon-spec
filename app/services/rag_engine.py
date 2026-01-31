import re
import logging
from typing import List, Dict
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text, select
from app.core.llm import embed_text
from app.core.models import DocumentationChunk

logger = logging.getLogger(__name__)

class RAGService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def ingest_file(self, content: str, source_url: str):
        """Chunks markdown by H2 headers and stores embeddings."""
        # Simple H2 chunking
        chunks = re.split(r'(^##\s+.*$)', content, flags=re.MULTILINE)
        
        # Determine title from H1 if possible, else 1st line
        # Logic: chunks[0] is intro. chunks[1] is H2 header, chunks[2] is content, etc.
        
        current_chunk = ""
        header = "Introduction"
        
        # Process logic (simplified for Hackathon)
        processed_chunks = []
        
        # If no H2, take whole file
        if len(chunks) < 2:
            processed_chunks.append({"header": "General", "text": content})
        else:
             # chunks[0] is preamble
            if chunks[0].strip():
                processed_chunks.append({"header": "Introduction", "text": chunks[0]})
            
            # Iterate pairs of Header + Content
            for i in range(1, len(chunks), 2):
                header = chunks[i].strip().replace("#", "").strip()
                text_content = chunks[i+1] if i+1 < len(chunks) else ""
                processed_chunks.append({"header": header, "text": header + "\n" + text_content})

        count = 0
        for item in processed_chunks:
            embedding = embed_text(item['text'])
            
            doc_chunk = DocumentationChunk(
                content=item['text'],
                embedding=embedding,
                metadata_json={"header": item['header']},
                source_url=source_url
            )
            self.db.add(doc_chunk)
            count += 1
            
        await self.db.commit()
        return count

    async def retrieve_context(self, query: str, top_k: int = 3) -> List[Dict]:
        """Retrieves relevant docs using vector similarity."""
        query_embedding = embed_text(query)
        
        # Use pgvector l2_distance or cosine operator
        # Operator <-> is L2 distance, <=> is cosine distance (if normalized)
        # We'll use cosine (<=>) as standard for text embeddings
        
        stmt = select(DocumentationChunk).order_by(
            DocumentationChunk.embedding.cosine_distance(query_embedding)
        ).limit(top_k)
        
        result = await self.db.execute(stmt)
        chunks = result.scalars().all()
        
        return [
            {"content": c.content, "source": c.source_url, "score": "N/A"} 
            for c in chunks
        ]
