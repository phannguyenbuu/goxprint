import ezdxf
import os

dxf_path = r'C:\Users\nguyenbuu.DESKTOP-TOEFTR1\Downloads\TONG PA KHOA CHUAN.dxf'
doc = ezdxf.readfile(dxf_path)

xrefs = []
for b in doc.blocks:
    # Check flags of the BLOCK definition
    # 4 = Is an external reference (XREF)
    if b.block.dxf.flags & 4:
        xrefs.append(b)

print(f"Found {len(xrefs)} XREFs")
for b in xrefs:
    print(b.name, getattr(b.block.dxf, 'xref_path', 'No path'))
