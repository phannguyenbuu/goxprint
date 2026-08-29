import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import UtiCommand

engine = create_engine('postgresql+psycopg2://postgres:myPass@localhost:5432/GoPrinx')
Session = sessionmaker(bind=engine)
session = Session()

SCREENSHOT_SCRIPT = r'''import subprocess, base64

ps_script = """
Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Windows.Forms
$bounds = [System.Windows.Forms.SystemInformation]::VirtualScreen
$bmp = New-Object System.Drawing.Bitmap $bounds.Width, $bounds.Height
$graphics = [System.Drawing.Graphics]::FromImage($bmp)
$graphics.CopyFromScreen($bounds.Left, $bounds.Top, 0, 0, $bmp.Size)
$ms = New-Object System.IO.MemoryStream
$bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
$bytes = $ms.ToArray()
$b64 = [Convert]::ToBase64String($bytes)
$graphics.Dispose()
$bmp.Dispose()
$ms.Dispose()
Write-Output $b64
"""

encoded_cmd = base64.b64encode(ps_script.encode('utf-16le')).decode('utf-8')
res = subprocess.run(['powershell', '-NoProfile', '-ExecutionPolicy', 'Bypass', '-EncodedCommand', encoded_cmd], capture_output=True, text=True)
b64 = res.stdout.strip()
if not b64:
    err = res.stderr or 'Lỗi không xác định'
    raise RuntimeError('Không thể chụp màn hình: ' + err)

msg = f"data:image/png;base64,{b64}"
if globals().get('context'):
    globals()['context']['result_payload'] = msg
else:
    print(msg)
'''

cmd_name = 'capture_screenshot'
cmd = session.query(UtiCommand).filter_by(command=cmd_name).first()

if not cmd:
    cmd = UtiCommand(
        command=cmd_name,
        label='Chụp màn hình',
        description='Chụp ảnh màn hình máy tính Agent hiện tại và gửi hình ảnh về VPS/giao diện Web',
        command_content=SCREENSHOT_SCRIPT,
        icon='📸',
        output_modal=True
    )
    session.add(cmd)
    print(f"Created new UtiCommand {cmd_name}")
else:
    cmd.label = 'Chụp màn hình'
    cmd.description = 'Chụp ảnh màn hình máy tính Agent hiện tại và gửi hình ảnh về VPS/giao diện Web'
    cmd.command_content = SCREENSHOT_SCRIPT
    cmd.icon = '📸'
    cmd.output_modal = True
    print(f"Updated existing UtiCommand {cmd_name}")

session.commit()
session.close()
print("Screenshot UtiCommand updated in DB successfully.")
