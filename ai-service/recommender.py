"""
SneakAI Recommendation Engine v2
Improved content-based filtering with normalized feature vectors and cosine similarity.
Supports larger datasets with weighted multi-dimensional scoring.
"""

import json
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MultiLabelBinarizer, MinMaxScaler
from pathlib import Path


class SneakerRecommender:
    def __init__(self, data_path: str = None):
        if data_path is None:
            data_path = str(Path(__file__).parent / "data" / "sneakers.json")

        with open(data_path, "r") as f:
            self.sneakers = json.load(f)

        print(f"Loaded {len(self.sneakers)} sneakers")
        self._build_feature_matrix()

    def _build_feature_matrix(self):
        """Build normalized feature vectors for all sneakers."""
        n = len(self.sneakers)

        # ─── Extract unique values ──────────────────
        self.all_brands = sorted(set(s["brand"] for s in self.sneakers))
        self.all_styles = sorted(set(s["style"] for s in self.sneakers))
        self.all_categories = sorted(set(s.get("category", "Other") for s in self.sneakers))
        self.all_colors = self._extract_color_features()

        # ─── Brand one-hot (weight: 3x) ────────────
        self.brand_map = {b: i for i, b in enumerate(self.all_brands)}
        brand_onehot = np.zeros((n, len(self.all_brands)))
        for i, s in enumerate(self.sneakers):
            brand_onehot[i, self.brand_map[s["brand"]]] = 1

        # ─── Style one-hot (weight: 3x) ────────────
        self.style_map = {s: i for i, s in enumerate(self.all_styles)}
        style_onehot = np.zeros((n, len(self.all_styles)))
        for i, s in enumerate(self.sneakers):
            style_onehot[i, self.style_map[s["style"]]] = 1

        # ─── Category one-hot (weight: 1x) ─────────
        self.category_map = {c: i for i, c in enumerate(self.all_categories)}
        category_onehot = np.zeros((n, len(self.all_categories)))
        for i, s in enumerate(self.sneakers):
            category_onehot[i, self.category_map.get(s.get("category", "Other"), 0)] = 1

        # ─── Color features (weight: 2x) ───────────
        color_features = np.zeros((n, len(self.all_colors)))
        for i, s in enumerate(self.sneakers):
            sneaker_color = s.get("color", "").lower()
            for j, color_name in enumerate(self.all_colors):
                if color_name in sneaker_color:
                    color_features[i, j] = 1

        # ─── Tech features multi-label (weight: 1x)
        self.mlb = MultiLabelBinarizer()
        feature_encoded = self.mlb.fit_transform(
            [s.get("features", []) for s in self.sneakers]
        )

        # ─── Normalized price (weight: 2x) ─────────
        prices = np.array([s["price"] for s in self.sneakers]).reshape(-1, 1)
        self.price_scaler = MinMaxScaler()
        price_norm = self.price_scaler.fit_transform(prices)

        # ─── Normalized rating (weight: 1.5x) ──────
        ratings = np.array([s.get("rating", 0) for s in self.sneakers]).reshape(-1, 1)
        self.rating_scaler = MinMaxScaler()
        rating_norm = self.rating_scaler.fit_transform(ratings)

        # ─── Combine with weights ───────────────────
        self.feature_matrix = np.hstack([
            brand_onehot * 3.0,
            style_onehot * 3.0,
            category_onehot * 1.0,
            color_features * 2.0,
            feature_encoded * 1.0,
            price_norm * 2.0,
            rating_norm * 1.5,
        ])

        # Normalize each row to unit length for better cosine similarity
        norms = np.linalg.norm(self.feature_matrix, axis=1, keepdims=True)
        norms[norms == 0] = 1
        self.feature_matrix_normalized = self.feature_matrix / norms

        print(f"Feature matrix: {self.feature_matrix.shape} ({self.feature_matrix.shape[1]} features)")

    def _extract_color_features(self):
        """Extract all unique color keywords from the dataset."""
        color_words = set()
        base_colors = {'black', 'white', 'red', 'blue', 'green', 'grey', 'gray', 'silver',
                       'purple', 'orange', 'yellow', 'pink', 'brown', 'cream', 'navy', 'gold'}
        for s in self.sneakers:
            c = s.get("color", "").lower()
            for word in c.replace("/", " ").replace("-", " ").split():
                if word in base_colors:
                    color_words.add(word)
        return sorted(color_words)

    def _build_user_vector(self, preferences: dict) -> np.ndarray:
        """Build a user preference vector matching the feature space."""
        vec = np.zeros(self.feature_matrix.shape[1])
        offset = 0

        # Brand preferences
        brand_size = len(self.all_brands)
        pref_brands = preferences.get("brands", [])
        if pref_brands:
            for b in pref_brands:
                if b in self.brand_map:
                    vec[offset + self.brand_map[b]] = 3.0
        else:
            vec[offset:offset + brand_size] = 1.0  # No preference = equal weight
        offset += brand_size

        # Style preferences
        style_size = len(self.all_styles)
        pref_styles = preferences.get("styles", [])
        if pref_styles:
            for s in pref_styles:
                if s in self.style_map:
                    vec[offset + self.style_map[s]] = 3.0
        else:
            vec[offset:offset + style_size] = 1.0
        offset += style_size

        # Category (neutral)
        cat_size = len(self.all_categories)
        vec[offset:offset + cat_size] = 0.5
        offset += cat_size

        # Color preferences
        color_size = len(self.all_colors)
        pref_colors = [c.lower() for c in preferences.get("colors", [])]
        if pref_colors:
            for j, color_name in enumerate(self.all_colors):
                if color_name in pref_colors:
                    vec[offset + j] = 2.0
        else:
            vec[offset:offset + color_size] = 0.5
        offset += color_size

        # Features (neutral)
        feat_size = len(self.mlb.classes_)
        vec[offset:offset + feat_size] = 0.5
        offset += feat_size

        # Price preference (normalized budget)
        budget = preferences.get("budget", 300)
        budget_norm = self.price_scaler.transform([[budget]])[0][0]
        vec[offset] = budget_norm * 2.0
        offset += 1

        # Rating (prefer high)
        vec[offset] = 1.5
        offset += 1

        return vec

    def recommend(self, preferences: dict, top_n: int = 5) -> list:
        """Get sneaker recommendations based on user preferences."""
        user_vec = self._build_user_vector(preferences).reshape(1, -1)

        # Normalize user vector
        norm = np.linalg.norm(user_vec)
        if norm > 0:
            user_vec_norm = user_vec / norm
        else:
            user_vec_norm = user_vec

        # Compute cosine similarity
        similarities = cosine_similarity(user_vec_norm, self.feature_matrix_normalized)[0]

        # Budget penalty: heavily penalize items over budget
        budget = preferences.get("budget", 10000)
        for i, s in enumerate(self.sneakers):
            if s["price"] > budget:
                over_ratio = s["price"] / budget
                similarities[i] *= max(0.1, 1.0 - (over_ratio - 1.0) * 0.5)

        # Color boost for exact matches
        pref_colors = [c.lower() for c in preferences.get("colors", [])]
        if pref_colors:
            for i, s in enumerate(self.sneakers):
                sc = s.get("color", "").lower()
                for c in pref_colors:
                    if c in sc:
                        similarities[i] *= 1.25

        # Trending/new boost
        for i, s in enumerate(self.sneakers):
            if s.get("isTrending"):
                similarities[i] *= 1.05
            if s.get("isNew"):
                similarities[i] *= 1.03

        # Rank and return top N
        ranked_idx = np.argsort(similarities)[::-1][:top_n]

        results = []
        for idx in ranked_idx:
            sneaker = self.sneakers[idx].copy()
            sneaker["similarity_score"] = round(float(similarities[idx]), 4)
            results.append(sneaker)

        return results
