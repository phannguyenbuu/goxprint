$ErrorActionPreference = "Stop"

# Get current script path
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

Write-Host "Creating/Checking virtual environment..." -ForegroundColor Cyan
$venvPath = Join-Path $root ".build-venv"
if (-not (Test-Path $venvPath)) {
    python -m venv $venvPath
}
$venvPython = Join-Path $venvPath "Scripts\python.exe"
$venvPip = Join-Path $venvPath "Scripts\pip.exe"
$pyinstallerExe = Join-Path $venvPath "Scripts\pyinstaller.exe"

Write-Host "Installing dependencies in virtual environment..." -ForegroundColor Cyan
& $venvPython -m pip install --upgrade pip | Out-Null
& $venvPython -m pip install requests pymupdf==1.27.2.3 pillow pyinstaller pystray psutil | Out-Null

Write-Host "Re-creating dist directory..." -ForegroundColor Cyan
if (-not (Test-Path "dist")) {
    New-Item -ItemType Directory -Path "dist" | Out-Null
}

Write-Host "Zipping agent_core folder into dist/toolx_core.zip..." -ForegroundColor Cyan
if (Test-Path "dist\toolx_core.zip") {
    Remove-Item -Force "dist\toolx_core.zip" -ErrorAction SilentlyContinue
}
# Compress agent_core
Compress-Archive -Path "agent_core" -DestinationPath "dist\toolx_core.zip" -Force

Write-Host "Compiling toolxagent_v1.5.2.exe with PyInstaller..." -ForegroundColor Cyan
if (Test-Path "dist\toolxagent_v1.5.2.exe") {
    Remove-Item -Force "dist\toolxagent_v1.5.2.exe" -ErrorAction SilentlyContinue
}

# Run PyInstaller with loader.py, adding the assets folder and the fallback toolx_core.zip
$pyinstallerArgs = @(
    "--noconfirm",
    "--clean",
    "--onefile",
    "--noconsole",
    "--name", "toolxagent_v1.5.2",
    "--add-data", "agent_core/assets;assets",
    "--add-data", "dist/toolx_core.zip;.",
    "agent/loader.py"
)

& $pyinstallerExe @pyinstallerArgs

Write-Host "Build completed successfully!" -ForegroundColor Green
Write-Host "Executable generated at: $root\dist\toolxagent_v1.5.2.exe" -ForegroundColor Green
Write-Host "Core zip generated at: $root\dist\toolx_core.zip" -ForegroundColor Green
