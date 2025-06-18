#!/usr/bin/env python3
from PIL import Image, ImageDraw
import os

# Create a 32x32 favicon
size = 32
image = Image.new('RGBA', (size, size), (0, 0, 0, 0))
draw = ImageDraw.Draw(image)

# Colors matching your brand
navy = (30, 41, 59)      # #1e293b
teal = (74, 222, 128)    # #4ade80  
silver = (226, 232, 240) # #e2e8f0

# Background circle
draw.ellipse([2, 2, 30, 30], fill=navy, outline=teal, width=2)

# Transparency circles (overlapping)
draw.ellipse([6, 8, 18, 20], outline=teal, width=2)
draw.ellipse([14, 8, 26, 20], outline=teal, width=2)

# Center connection dot
draw.ellipse([14, 12, 18, 16], fill=teal)

# Dollar sign
draw.line([14, 22, 14, 28], fill=silver, width=2)
draw.line([18, 22, 18, 28], fill=silver, width=2)
draw.line([12, 25, 20, 25], fill=silver, width=2)

# Save as ICO file
image.save('favicon.ico', format='ICO', sizes=[(16, 16), (32, 32)])
print("Favicon created: favicon.ico")