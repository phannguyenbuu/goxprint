import fitz
from PIL import Image
import os

pdf_file = r"test_dpi.pdf"
if not os.path.exists(pdf_file):
    pdf_file = r"test_cmyk.pdf"

doc = fitz.open(pdf_file)
page = doc[0]
W_pt = page.rect.width
H_pt = page.rect.height

dpi = 300
W_calc = int((W_pt / 72.0) * dpi)
H_calc = int((H_pt / 72.0) * dpi)

W = ((W_calc + 15) // 16) * 16
H = ((H_calc + 15) // 16) * 16

scale_x = W / W_pt
scale_y = H / H_pt

# Method 1: Tiled / Stripped rendering
max_strip_bytes = 20000000  # small limit to force multiple strips (20MB)
strip_height_px = max(1000, max_strip_bytes // (W * 3))
strip_height_pt = strip_height_px / scale_y

img_tiled = Image.new("RGB", (W, H))
y_pt = 0.0
y_px = 0

print(f"Rendering tiled with strip height {strip_height_px} px...")
while y_px < H:
    h_px_clip = min(strip_height_px, H - y_px)
    h_pt_clip = h_px_clip / scale_y
    
    # We define the clip Rect
    clip = fitz.Rect(0, y_pt, W_pt, y_pt + h_pt_clip)
    
    matrix = fitz.Matrix(scale_x, scale_y)
    pix = page.get_pixmap(matrix=matrix, clip=clip, colorspace=fitz.csRGB)
    
    strip_img = Image.frombuffer("RGB", [pix.width, pix.height], pix.samples_mv, "raw", "RGB", 0, 1)
    img_tiled.paste(strip_img, (0, y_px))
    
    y_pt += h_pt_clip
    y_px += h_px_clip

# Method 2: Standard full rendering
print("Rendering standard...")
matrix = fitz.Matrix(scale_x, scale_y)
pix_full = page.get_pixmap(matrix=matrix, colorspace=fitz.csRGB)
img_full = Image.frombuffer("RGB", [pix_full.width, pix_full.height], pix_full.samples_mv, "raw", "RGB", 0, 1)

# Compare images
import numpy as np
arr_tiled = np.array(img_tiled)
arr_full = np.array(img_full)

diff = np.abs(arr_tiled.astype(int) - arr_full.astype(int))
print(f"Max pixel difference: {diff.max()}")
print(f"Average pixel difference: {diff.mean()}")

assert diff.max() == 0, "Images are different!"
print("SUCCESS: Tiled rendering is identical to standard rendering!")
doc.close()
