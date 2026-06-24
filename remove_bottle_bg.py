from PIL import Image

input_path = r"C:\Users\ROHIT\.gemini\antigravity-ide\brain\d5d7f3dd-8208-472f-8256-c31f5c582208\media__1782267746689.jpg"
output_path = r"C:\Users\ROHIT\Desktop\XVII\XVIII-FRONTEND\public\images\hero-bottle-cutout.png"

try:
    img = Image.open(input_path).convert("RGBA")
    pixels = img.load()
    w, h = img.size

    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            brightness = (r + g + b) / 3.0
            
            # The bottle is precisely in the center.
            # We strictly cut off anything outside x=[0.33w, 0.67w] and y=[0.23h, 0.92h]
            if x < w * 0.33 or x > w * 0.67:
                pixels[x, y] = (0, 0, 0, 0)
            elif y < h * 0.22 or y > h * 0.92:
                pixels[x, y] = (0, 0, 0, 0)
            else:
                # Even inside the bounding box, we might have dark background corners
                # because the bottle is cylindrical. Let's do a simple dark removal for the very edges
                dist_from_center_x = abs(x - w / 2.0)
                # Max distance is roughly w * 0.17
                if dist_from_center_x > w * 0.14 and brightness < 35:
                    pixels[x, y] = (0, 0, 0, 0)

    img.save(output_path)
    print("Saved hero-bottle-cutout.png")
except Exception as e:
    print(f"Error: {e}")
