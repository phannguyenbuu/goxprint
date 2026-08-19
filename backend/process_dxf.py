import ezdxf
from ezdxf.addons import Importer
import os
import sys

def main():
    host_dxf_path = r'C:\Users\nguyenbuu.DESKTOP-TOEFTR1\Downloads\TONG PA KHOA CHUAN.dxf'
    road_dxf_path = r'C:\Users\nguyenbuu.DESKTOP-TOEFTR1\Downloads\GPMB DUONG HO PA KHOA\DXF\road_recover.dxf'
    output_dxf_path = r'C:\Users\nguyenbuu.DESKTOP-TOEFTR1\Downloads\TONG PA KHOA CHUAN_FIXED.dxf'

    print("Loading host document...")
    try:
        host_doc = ezdxf.readfile(host_dxf_path)
    except Exception as e:
        print(f"Error reading host file: {e}")
        return

    print("Loading road_recover document...")
    try:
        road_doc = ezdxf.readfile(road_dxf_path)
    except Exception as e:
        print(f"Error reading road_recover file: {e}")
        return

    # Delete proxy objects from road_doc to avoid errors
    proxies = [e for e in road_doc.entities if e.dxftype() == 'ACAD_PROXY_ENTITY']
    for p in proxies:
        road_doc.entitydb.delete_entity(p)
    print(f"Removed {len(proxies)} proxy objects from road_recover.")

    # Create a new block in the host document
    block_name = "ROAD_RECOVER_INTERNAL"
    if block_name in host_doc.blocks:
        print("Block already exists, deleting old one...")
        host_doc.blocks.delete_block(block_name)
    
    new_block = host_doc.blocks.new(name=block_name, base_point=(0, 0, 0))
    print(f"Created block {block_name}.")

    print("Importing entities into the new block...")
    importer = Importer(road_doc, host_doc)
    # import all entities from road_doc modelspace into the new block
    importer.import_entities(road_doc.modelspace(), target_layout=new_block)
    importer.finalize()

    # Find XREF blocks
    xref_names = set()
    for b in host_doc.blocks:
        if getattr(b.block.dxf, 'flags', 0) & 4:
            xref_names.add(b.name)
    print(f"Found XREF blocks: {xref_names}")

    # Process all INSERT entities across all layouts
    inserts_deleted = 0
    inserts_updated = 0

    for layout in host_doc.layouts:
        # Find all INSERT entities
        inserts = layout.query('INSERT')
        for ins in inserts:
            ref_name = ins.dxf.name
            if ref_name in xref_names:
                if ref_name == 'road_recover':
                    # Update to point to the new block
                    ins.dxf.name = block_name
                    inserts_updated += 1
                else:
                    # Delete other XREF inserts
                    layout.delete_entity(ins)
                    inserts_deleted += 1

    print(f"Updated {inserts_updated} road_recover INSERTs.")
    print(f"Deleted {inserts_deleted} other XREF INSERTs.")

    print(f"Saving to {output_dxf_path}...")
    host_doc.saveas(output_dxf_path)
    print("Done!")

if __name__ == '__main__':
    main()
