$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
Set-Location $root

Write-Host "Stopping running toolxagent.exe instances..." -ForegroundColor Yellow
Get-Process toolxagent -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

if ($Clean) {
    Remove-Item -Recurse -Force "build","dist" -ErrorAction SilentlyContinue
}

$venvPath = Join-Path $root ".build-venv"
if (-not (Test-Path $venvPath)) {
    python -m venv $venvPath
}
$venvPython = Join-Path $venvPath "Scripts\python.exe"

Write-Host "Installing dependencies..." -ForegroundColor Cyan
& $venvPython -m pip install -r requirements.txt pyinstaller | Out-Null

Write-Host "Compiling toolxagent.exe..." -ForegroundColor Cyan
& $venvPython -m PyInstaller --clean --noconfirm --name toolxagent --windowed --onefile --icon=logo1.ico agent_core\main.py

Write-Host "Build completed: $root\dist\toolxagent.exe" -ForegroundColor Green
