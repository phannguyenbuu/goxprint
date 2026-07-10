import os
import sys
import time
from pathlib import Path

# Add agent directory to path
sys.path.append(str(Path(__file__).resolve().parent / "agent"))

from main import ToolxAgentApp

class DummyApp:
    def __init__(self):
        pass

def test():
    pdf_file = r"D:\Dropbox\_Documents\Goxprint\printagent_v2\backend\static\scans\default_B0_8B_92_4B_99_DD_192_168_1_1\phannguyenbuugmail.com\HTX_Compiled_Documents.pdf"
    output_tiff = "test_output.tif"
    output_preview = "test_output.jpg"
    
    if not os.path.exists(pdf_file):
        print(f"Error: Sample PDF not found at {pdf_file}")
        return
        
    print("Testing RGB to CMYK vector rendering using LittleCMS...")
    
    # Instantiate app or call render method directly
    # We will simulate the render call using ToolxAgentApp's method
    app = DummyApp()
    # Mock some methods if needed or just use functions.
    # Since render_pdf_to_tiff is a method of ToolxAgentApp, let's call it via class:
    try:
        success = ToolxAgentApp.render_pdf_to_tiff(
            self=app,
            pdf_path=pdf_file,
            tiff_path=Path(output_tiff),
            preview_path=Path(output_preview),
            dpi=300,
            colorspace="cmyk",
            compression="lzw",
            max_pixels=int(96 * 0.8 * 1024**3 / 4) # 96 GB limit
        )
        if success and os.path.exists(output_tiff) and os.path.exists(output_preview):
            print("SUCCESS! TIFF and preview JPEG rendered successfully.")
            print(f"TIFF Size: {os.path.getsize(output_tiff) / (1024**2):.2f} MB")
            print(f"Preview Size: {os.path.getsize(output_preview) / (1024):.2f} KB")
            
            # Clean up
            os.remove(output_tiff)
            os.remove(output_preview)
        else:
            print("FAILURE: Rendering completed but files were not generated or success flag was False.")
    except Exception as e:
        print(f"ERROR: Rendering failed with exception: {e}")

if __name__ == "__main__":
    test()
