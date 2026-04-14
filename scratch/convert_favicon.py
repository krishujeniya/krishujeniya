
from PIL import Image
import os

source_path = '/home/ai/Documents/projects/krishujeniya/public/images/img1120.png'
target_path = '/home/ai/Documents/projects/krishujeniya/public/favicon.ico'

if os.path.exists(source_path):
    img = Image.open(source_path)
    # Favicon usually contains multiple sizes: 16x16, 32x32, 48x48
    icon_sizes = [(16, 16), (32, 32), (48, 48), (64, 64)]
    img.save(target_path, format='ICO', sizes=icon_sizes)
    print(f"Successfully converted {source_path} to {target_path}")
else:
    print(f"Source file {source_path} not found")
