# -*- mode: python ; coding: utf-8 -*-
# PyInstaller spec for GoxDriverService.exe

a = Analysis(
    ['main.py'],
    pathex=['.'],
    binaries=[],
    datas=[],
    hiddenimports=[
        'win32serviceutil',
        'win32service',
        'win32event',
        'win32pipe',
        'win32file',
        'win32security',
        'pywintypes',
        'servicemanager',
        'requests',
        'zipfile',
        'json',
        'threading',
        'subprocess',
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[
        'torch', 'torchvision', 'sklearn', 'scipy', 'matplotlib',
        'pandas', 'cv2', 'PIL', 'IPython', 'jupyter',
    ],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='GoxDriverService',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,   # Service needs console=True for win32serviceutil
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
