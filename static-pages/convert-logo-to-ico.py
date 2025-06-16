#!/usr/bin/env python3
try:
    from PIL import Image
    
    # Open the logo file
    img = Image.open('assets/images/logo-final.png')
    
    # Convert to RGBA if not already
    img = img.convert('RGBA')
    
    # Resize to standard favicon sizes
    sizes = [(16, 16), (32, 32), (48, 48)]
    
    # Save as ICO with multiple sizes
    img.save('favicon.ico', format='ICO', sizes=sizes)
    print("Successfully created favicon.ico from logo-final.png")
    
except ImportError:
    print("PIL not available, copying PNG as ICO")
    import shutil
    shutil.copy('assets/images/logo-final.png', 'favicon.ico')

except Exception as e:
    print(f"Error: {e}")
    # Fallback: just copy the PNG
    import shutil
    shutil.copy('assets/images/logo-final.png', 'favicon.ico')