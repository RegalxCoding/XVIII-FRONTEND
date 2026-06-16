from PIL import Image

img = Image.open(r"C:\Users\ROHIT\.gemini\antigravity-ide\brain\141ab91d-a15c-4323-9234-2aa7e547415f\hero_coffee_straight_1781617631512.png").convert("RGBA")
pixels = img.load()
w, h = img.size

for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        brightness = (r + g + b) / 3.0
        max_c = max(r, g, b)
        min_c = min(r, g, b)
        saturation = max_c - min_c

        if brightness > 240 and saturation < 20:
            pixels[x, y] = (0, 0, 0, 0)
        elif brightness > 200 and saturation < 35:
            factor = (brightness - 200) / 40.0
            alpha = int(255 * (1 - factor))
            pixels[x, y] = (r, g, b, alpha)

img.save(r"c:\Users\ROHIT\Desktop\XVII\XVIII-FRONTEND\public\images\hero-coffee-cutout.png")
print("Done!")
