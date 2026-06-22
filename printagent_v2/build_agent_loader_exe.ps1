$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
Set-Location $root

Write-Host "Stopping running printagent.exe instances..." -ForegroundColor Yellow
Get-Process printagent -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

if ($Clean) {
    Remove-Item -Recurse -Force "build","dist" -ErrorAction SilentlyContinue
}

$venvPath = Join-Path $root ".build-venv"
if (-not (Test-Path $venvPath)) {
    python -m venv $venvPath
}
$venvPython = Join-Path $venvPath "Scripts\python.exe"

Write-Host "Installing/checking dependencies..." -ForegroundColor Cyan
& $venvPython -m pip install --upgrade pip | Out-Null
& $venvPython -m pip install -r requirements.txt pyinstaller | Out-Null

Write-Host "Packaging latest agent_core.zip..." -ForegroundColor Cyan
& $venvPython pack_agent_core.py

Write-Host "Running PyInstaller with agent_loader.spec..." -ForegroundColor Cyan
& $venvPython -m PyInstaller --clean agent_loader.spec

# Copy agent_core.zip to dist/ so the loader finds it immediately
if (Test-Path "agent_core.zip") {
    Copy-Item "agent_core.zip" "dist\" -Force
    Write-Host "Copied agent_core.zip to dist/" -ForegroundColor Green
}

# Do not copy settings.json to dist/, as printagent will auto-generate it if missing

# Create dist/storage/data directories
New-Item -ItemType Directory -Force -Path "dist\storage\data" | Out-Null

Write-Host "Running PyInstaller with printagentinstall.spec..." -ForegroundColor Cyan
& $venvPython -m PyInstaller --clean printagentinstall.spec

Write-Host "Build completed: $root\dist\printagent.exe and $root\dist\printagentinstall.exe" -ForegroundColor Green
