$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
Set-Location $root

Write-Host "Stopping running printagent.exe and gox_ftp_server.exe instances..." -ForegroundColor Yellow
Get-Process printagent -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Get-Process gox_ftp_server -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

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

Write-Host "Compiling printagent.exe (Main Agent)..." -ForegroundColor Cyan
& $venvPython -m PyInstaller --clean --noconfirm --name printagent --onefile --icon=logo1.ico agent\main.py

Write-Host "Compiling GoxDriverService.exe (Driver Service)..." -ForegroundColor Cyan
& $venvPython -m PyInstaller --clean --noconfirm --name GoxDriverService --onefile --uac-admin --icon=logo1.ico gox_driver_service\main.py

Write-Host "Compiling gox_ftp_server.exe (FTP Worker)..." -ForegroundColor Cyan
& $venvPython -m PyInstaller --clean --noconfirm --name gox_ftp_server --onefile --icon=logo1.ico ftp_main.py

Write-Host "Compiling printagentinstall.exe (Installer)..." -ForegroundColor Cyan
& $venvPython -m PyInstaller --clean --noconfirm --name printagentinstall --onefile --uac-admin --icon=logo1.ico installer.py

Write-Host "Build completed: $root\dist\printagent.exe, gox_ftp_server.exe and printagentinstall.exe, and GoxDriverService.exe" -ForegroundColor Green
