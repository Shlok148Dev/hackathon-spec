import os
import json
from typing import List, Dict, Any
from sqlalchemy.orm import Session
# from app.core.database import get_db, SessionLocal # Unused in fallback mode
import glob
import asyncio
from app.core.llm import embed_text

# Fallback in-memory storage for hackathon (switch to DB if time permits)
_doc_chunks = []

def ingest_docs(docs_path: str = "./data/docs"):
    """
    Read markdown files, chunk by H2 headers, embed, store in memory.
    For hackathon: In-memory is faster than DB writes. Scale to pgvector if needed.
    """
    global _doc_chunks
    
    if not os.path.exists(docs_path):
        # Create sample docs if folder doesn't exist
        os.makedirs(docs_path, exist_ok=True)
        with open(f"{docs_path}/webhooks.md", "w") as f:
            f.write("""## Webhook SSL Configuration
When migrating to headless, SSL certificates must be renewed.
Error: SSLHandshakeError indicates certificate mismatch.
Fix: Renew cert at Settings > Webhooks > Advanced.""")

    _doc_chunks = []  # Reset
    
    for md_file in glob.glob(f"{docs_path}/*.md"):
        try:
            with open(md_file, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Simple chunking by H2 headers
            sections = content.split('## ')
            for section in sections[1:]:  # Skip first (usually title)
                lines = section.strip().split('\n')
                title = lines[0]
                body = '\n'.join(lines[1:])
                
                chunk_text = f"{title}\n{body}"
                
                try:
                    # Generate embedding
                    embedding = embed_text(chunk_text)
                    
                    _doc_chunks.append({
                        "id": f"{os.path.basename(md_file)}_{title[:20]}",
                        "content": chunk_text[:1000],  # Limit size
                        "embedding": embedding,
                        "source": md_file
                    })
                except Exception as e:
                    print(f"Warning: Could not embed chunk: {e}")
                    # Add without embedding as fallback
                    _doc_chunks.append({
                        "id": f"{os.path.basename(md_file)}_{title[:20]}",
                        "content": chunk_text[:1000],
                        "embedding": None,
                        "source": md_file
                    })
        except Exception as e:
            print(f"Error reading file {md_file}: {e}")
    
    print(f"RAG: Ingested {len(_doc_chunks)} chunks from {docs_path}")
    return len(_doc_chunks)

def cosine_similarity(vec1, vec2):
    """Calculate cosine similarity between two vectors"""
    if vec1 is None or vec2 is None:
        return 0.0
    
    dot_product = sum(a * b for a, b in zip(vec1, vec2))
    magnitude1 = sum(a * a for a in vec1) ** 0.5
    magnitude2 = sum(a * a for b in vec2) ** 0.5
    
    if magnitude1 == 0 or magnitude2 == 0:
        return 0.0
    
    return dot_product / (magnitude1 * magnitude2)

def keyword_score(query: str, content: str) -> float:
    """Simple keyword matching score"""
    query_words = set(query.lower().split())
    content_words = set(content.lower().split())
    
    if not query_words:
        return 0.0
    
    matches = len(query_words.intersection(content_words))
    return matches / len(query_words)

def keyword_retrieval(query: str, top_k: int = 3) -> List[Dict]:
    """Pure keyword fallback"""
    global _doc_chunks
    
    scored = []
    for chunk in _doc_chunks:
        score = keyword_score(query, chunk["content"])
        scored.append((score, chunk))
    
    scored.sort(reverse=True, key=lambda x: x[0])
    
    return [
        {
            "id": chunk["id"],
            "content": chunk["content"],
            "score": score,
            "source": chunk["source"]
        }
        for score, chunk in scored[:top_k]
    ]

async def retrieve_context(query: str, top_k: int = 3) -> List[Dict]:
    """
    Retrieve relevant documentation chunks for a query.
    Uses embedding similarity if available, keyword fallback if not.
    Async wrapper for compatibility.
    """
    global _doc_chunks
    
    # Lazy load if empty
    if not _doc_chunks:
        ingest_docs()
    
    try:
        # Get query embedding
        # Run in thread/executor if needed, but for hackathon sync is fine for this call
        # or await to_thread if strictly async needed
        query_embedding = embed_text(query)
        
        # Score all chunks
        scored_chunks = []
        for chunk in _doc_chunks:
            if chunk["embedding"]:
                score = cosine_similarity(query_embedding, chunk["embedding"])
            else:
                # Fallback: keyword matching
                score = keyword_score(query, chunk["content"])
            
            scored_chunks.append((score, chunk))
        
        # Sort by score descending
        scored_chunks.sort(reverse=True, key=lambda x: x[0])
        
        # Return top_k
        return [
            {
                "id": chunk["id"],
                "content": chunk["content"],
                "score": score,
                "source": chunk["source"]
            }
            for score, chunk in scored_chunks[:top_k]
        ]
        
    except Exception as e:
        print(f"RAG Error: {e}, using keyword fallback")
        # Emergency fallback
        return keyword_retrieval(query, top_k)

# Initialize on module load
try:
    ingest_docs()
    print("✅ RAG Engine initialized")
except Exception as e:
    print(f"⚠️ RAG init warning (non-critical): {e}")
