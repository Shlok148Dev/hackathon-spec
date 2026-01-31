# ML Pipeline Architecture

## Component 1: Feature Engineering Pipeline
```python
class TicketFeatureExtractor:
    def extract(self, raw_ticket: dict) -> FeatureVector:
        # Text features
        tfidf = TfidfVectorizer(max_features=100)
        text_vec = tfidf.fit_transform([raw_ticket['description']])
        
        # Categorical
        migration_stage = self.encode_categorical(
            raw_ticket['merchant']['migration_stage']
        )
        
        # Temporal
        hours_since_migration = (
            datetime.now() - raw_ticket['merchant']['migration_date']
        ).total_seconds() / 3600
        
        return np.concatenate([text_vec, migration_stage, hours_since_migration])
```
Component 2: Model Registry (Mock for 18h)
Since we can't train, we use:
Zero-shot: Gemini 1.5 Pro with engineered prompts
Few-shot: 10 examples embedded in prompt context
Metric: Accuracy on holdout test of 20 synthetic tickets must be >0.80
Component 3: RAG Pipeline Detail
Chunking: Markdown headers (H2) as boundaries
Embedding: text-embedding-004 (768 dims)
Index: IVFFlat on pgvector (lists=100)
Retrieval:
Initial: Cosine similarity top-5
Rerank: Cross-encoder (optional, use dot product if time short)
Injection: Top-3 chunks added to Gemini prompt context
