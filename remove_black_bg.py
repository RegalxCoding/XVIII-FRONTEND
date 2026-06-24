from PIL import Image

# Open the newly generated bean image
input_path = r"C:\Users\ROHIT\.gemini\antigravity-ide\brain\d5d7f3dd-8208-472f-8256-c31f5c582208\coffee_bean_1782267176700.png"
output_path = r"C:\Users\ROHIT\Desktop\XVII\XVIII-FRONTEND\public\images\bean-cutout.png"

img = Image.open(input_path).convert("RGBA")
pixels = img.load()
w, h = img.size

for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        brightness = (r + g + b) / 3.0
        max_c = max(r, g, b)
        min_c = min(r, g, b)
        saturation = max_c - min_c

        # Remove black background
        if brightness < 20 and saturation < 20:
            pixels[x, y] = (0, 0, 0, 0)
        elif brightness < 60 and saturation < 30:
            factor = (brightness - 20) / 40.0
            alpha = int(255 * factor)
            pixels[x, y] = (r, g, b, alpha)

img.save(output_path)
print("Saved bean-cutout.png")
