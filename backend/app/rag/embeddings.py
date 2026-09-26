import os
import math
import hashlib
from typing import List
import httpx
from app.core.config import settings

class EmbeddingService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model = settings.GEMINI_EMBEDDING_MODEL

    def get_embeddings(self, texts: List[str]) -> List[List[float]]:
        if not texts:
            return []

        # If Gemini API key is configured, use Gemini Embeddings API
        if self.api_key:
            try:
                return self._call_gemini_embeddings(texts)
            except Exception as e:
                # Log error and fall back gracefully
                print(f"Gemini embedding error: {e}. Falling back to deterministic code embeddings.")

        # Deterministic offline fallback embedding vector (size 128)
        return [self._compute_dense_vector(t) for t in texts]

    def _call_gemini_embeddings(self, texts: List[str]) -> List[List[float]]:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:batchEmbedContents?key={self.api_key}"
        requests_payload = [{"model": f"models/{self.model}", "text": text} for text in texts]
        payload = {"requests": requests_payload}

        with httpx.Client(timeout=30.0) as client:
            resp = client.post(url, json=payload)
            resp.raise_for_status()
            data = resp.json()
            return [emb["values"] for emb in data.get("embeddings", [])]

    def _compute_dense_vector(self, text: str, dim: int = 128) -> List[float]:
        """Generates a normalized deterministic dense embedding vector from code tokens."""
        vector = [0.0] * dim
        tokens = text.lower().replace("(", " ").replace(")", " ").replace(".", " ").replace(":", " ").split()
        for token in tokens:
            h = int(hashlib.md5(token.encode("utf-8")).hexdigest(), 16)
            idx = h % dim
            val = ((h >> 8) % 100) / 100.0 - 0.5
            vector[idx] += val

        # L2 Normalize
        norm = math.sqrt(sum(x * x for x in vector))
        if norm > 0:
            vector = [x / norm for x in vector]
        return vector

embedding_service = EmbeddingService()
