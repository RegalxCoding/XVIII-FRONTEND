from PIL import Image

input_path = r"C:\Users\ROHIT\.gemini\antigravity-ide\brain\d5d7f3dd-8208-472f-8256-c31f5c582208\tilted_cup_greenscreen_1782267494714.png"
output_path = r"C:\Users\ROHIT\Desktop\XVII\XVIII-FRONTEND\public\images\hero-tilted-cup.png"

try:
    img = Image.open(input_path).convert("RGBA")
    pixels = img.load()
    w, h = img.size

    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            
            # 1. Background removal
            if g > 150 and r < 120 and b < 120:
                # Strong green background
                pixels[x, y] = (0, 0, 0, 0)
            elif g > r * 1.1 and g > b * 1.1 and g > 60:
                # Edge/fringe pixels
                greenness = g - max(r, b)
                alpha = max(0, int(255 - greenness * 3.5))
                
                # 2. Spill suppression (fix green reflection)
                new_g = int(max(r, b) * 0.9 + g * 0.1) # heavily suppress green to match other channels
                pixels[x, y] = (r, new_g, b, alpha)
            else:
                # 3. Fix green spill on the rest of the image (like the black saucer)
                if g > r and g > b:
                    # If green is the dominant color, neutralize it
                    new_g = int((r + b) / 2)
                    pixels[x, y] = (r, new_g, b, a)

    img.save(output_path)
    print("Saved hero-tilted-cup.png with spill suppression")
except Exception as e:
    print(f"Error: {e}")
