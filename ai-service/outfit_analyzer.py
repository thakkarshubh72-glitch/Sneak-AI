from PIL import Image
import numpy as np
from sklearn.cluster import KMeans
import mimetypes

class OutfitAnalyzer:
    def __init__(self):
        # Predefined style palettes for simple heuristic classification
        # RGB centroids
        self.style_profiles = {
            "streetwear": np.array([
                [20, 20, 20],      # Black
                [230, 230, 230],   # White
                [200, 50, 50],     # Red accent
                [50, 50, 200]      # Blue accent
            ]),
            "minimalist": np.array([
                [240, 240, 240],   # Off-white
                [200, 200, 200],   # Light grey
                [100, 100, 100],   # Grey
                [220, 210, 190]    # Beige
            ]),
            "sporty": np.array([
                [30, 30, 30],      # Dark grey
                [20, 50, 200],     # Vibrant Blue
                [220, 220, 20],    # Neon Yellow/Green
                [220, 50, 50]      # Vibrant Red
            ]),
            "techwear": np.array([
                [10, 10, 10],      # Pure Black
                [40, 40, 40],      # Charcoal
                [80, 90, 80],      # Olive Drab
                [50, 50, 60]       # Dark Navy
            ])
        }
        
    def rgb_to_hex(self, rgb):
        return '#{:02x}{:02x}{:02x}'.format(int(rgb[0]), int(rgb[1]), int(rgb[2]))
        
    def extract_colors(self, image_bytes, num_colors=3):
        import io
        try:
            # Load image and resize for faster processing
            img = Image.open(io.BytesIO(image_bytes))
            img = img.convert('RGB')
            img = img.resize((150, 150))
            
            # Convert to numpy array and reshape
            data = np.array(img).reshape(-1, 3)
            
            # Use KMeans to find dominant colors
            kmeans = KMeans(n_clusters=num_colors, random_state=42, n_init='auto')
            kmeans.fit(data)
            
            # Get cluster centers (dominant colors) and labels
            colors = kmeans.cluster_centers_
            labels = kmeans.labels_
            
            # Count the frequency of each color to sort them
            counts = np.bincount(labels)
            sorted_indices = np.argsort(counts)[::-1]
            
            dominant_colors = colors[sorted_indices]
            
            # Convert to hex strings
            hex_colors = [self.rgb_to_hex(c) for c in dominant_colors]
            return dominant_colors, hex_colors
        except Exception as e:
            print(f"Error extracting colors: {e}")
            return None, ["#000000", "#FFFFFF", "#888888"]

    def classify_style(self, extracted_colors):
        # Simple heuristic: find the style profile that is "closest" to the extracted colors
        # Calculate minimum distance from extracted colors to each profile
        if extracted_colors is None or len(extracted_colors) == 0:
            return "streetwear" # default
            
        best_style = "streetwear"
        min_distance = float('inf')
        
        for style, profile in self.style_profiles.items():
            total_dist = 0.0
            for color in extracted_colors:
                # Find distance to closest color in profile
                dists = np.linalg.norm(profile - color, axis=1)
                total_dist += np.min(dists)
                
            if total_dist < min_distance:
                min_distance = total_dist
                best_style = style
                
        return best_style

outfit_analyzer = OutfitAnalyzer()
