"""Refresh the Open Graph image from invitation.json using Python and Pillow."""

from datetime import datetime
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "public/assets"
config = json.loads((ROOT / "src/invitation.json").read_text(encoding="utf-8"))
couple, event = config["couple"], config["event"]
width, height = 1200, 630
canvas = Image.new("RGB", (width, height))
draw = ImageDraw.Draw(canvas)
for y in range(height):
    t = y / height
    draw.line((0, y, width, y), fill=(round(24 - t*9), round(51 - t*18), round(37 - t*13)))

grain = Image.open(ASSETS / "textures/grain.png").convert("RGBA")
grain.putalpha(grain.getchannel("A").point(lambda v: v // 3))
for x in range(0, width, grain.width):
    for y in range(0, height, grain.height):
        canvas.paste(grain, (x, y), grain)

gold, light = "#be985b", "#e8cd95"
for inset in (17, 23):
    draw.rounded_rectangle((inset, inset, width-inset, height-inset), radius=15, outline=gold, width=1)

flowers = Image.open(ASSETS / "botanical/hibiscus.webp").convert("RGBA")
flowers.thumbnail((490, 290), Image.Resampling.LANCZOS)
canvas.paste(flowers, (-15, height-flowers.height+10), flowers)
top = flowers.rotate(180)
canvas.paste(top, (width-top.width+15, -9), top)

def font(name, size):
    return ImageFont.truetype(ASSETS / "fonts" / (name + ".woff2"), size)

def centered(text, y, face, size, color, max_width=860):
    selected = font(face, size)
    while draw.textlength(text, font=selected) > max_width and size > 12:
        size -= 1
        selected = font(face, size)
    draw.text((width//2, y), text, font=selected, fill=color, anchor="mm")

serif = "cormorant-garamond-latin-500-normal"
script = "great-vibes-latin-400-normal"
seal = Image.open(ASSETS / "seal/burgundy-wax.webp").convert("RGBA")
seal.thumbnail((116, 116), Image.Resampling.LANCZOS)
canvas.paste(seal, ((width-seal.width)//2, 49), seal)
centered(couple["initials"], 108, script, 37, light, max_width=76)
centered("An Invitation to Celebrate", 208, serif, 35, light)
centered(couple["brideName"] + " & " + couple["groomName"], 310, script, 119, "#f8eed8", max_width=930)

for direction in (-1, 1):
    draw.line((600+direction*17, 388, 600+direction*118, 388), fill=gold, width=1)
draw.polygon([(600,382),(606,388),(600,394),(594,388)], outline=light, width=1)
centered(event["title"], 442, serif, 35, light)
date = datetime.fromisoformat(event["date"].replace("Z", "+00:00"))
centered(f"{date.day} {date.strftime('%B %Y')}", 492, serif, 28, "#f8eed8")
centered("L U X E L A N C E R", 565, serif, 15, gold)

output = ROOT / "public" / config["socialImage"].lstrip("/")
output.parent.mkdir(parents=True, exist_ok=True)
canvas.save(output, quality=91, optimize=True, progressive=True)
