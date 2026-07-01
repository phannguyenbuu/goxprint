<#
.SYNOPSIS
    Install / Uninstall GoxDriverService Windows Service
    Chạy script này 1 lần duy nhất với quyền Administrator
    Sau đó service tự chạy khi Windows khởi động - không cần UAC

.USAGE
    # Cài mới:
    .\install_gox_driver_service.ps1

    # Gỡ cài:
    .\install_gox_driver_service.ps1 -Uninstall
#>
param(
    [switch]$Uninstall,
    [string]$ServiceExePath = "$PSScriptRoot\GoxDriverService.exe"
)

$ServiceName    = "GoxDriverService"
$ServiceDisplay = "Gox Driver Service"
$ServiceDesc    = "GoPrinx driver installation helper. Runs as SYSTEM to install printer drivers without UAC prompts."

# --- Check Admin ---
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "ERROR: Must run as Administrator!" -ForegroundColor Red
    Write-Host "Right-click this script → Run as Administrator" -ForegroundColor Yellow
    exit 1
}

function Stop-GoxService {
    $svc = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
    if ($svc -and $svc.Status -eq 'Running') {
        Write-Host "Stopping $ServiceName..." -ForegroundColor Yellow
        Stop-Service -Name $ServiceName -Force
        Start-Sleep -Seconds 2
    }
}

# ─── Uninstall ───
if ($Uninstall) {
    Write-Host "=== Uninstalling $ServiceName ===" -ForegroundColor Cyan
    Stop-GoxService

    # Unregister via sc.exe or the exe itself
    if (Test-Path $ServiceExePath) {
        & $ServiceExePath remove
    } else {
        sc.exe delete $ServiceName | Out-Null
    }

    Write-Host "Uninstalled." -ForegroundColor Green
    exit 0
}

# ─── Install ───
Write-Host "=== Installing $ServiceName ===" -ForegroundColor Cyan

# ─── Windows Defender Exclusions & OpenSSH Client ───
Write-Host "Configuring Windows Defender exclusions..." -ForegroundColor Yellow
try {
    Add-MpPreference -ExclusionPath "$env:APPDATA\GoxPrintAgent" -ErrorAction SilentlyContinue
    Add-MpPreference -ExclusionProcess "printagent.exe" -ErrorAction SilentlyContinue
    Write-Host " Windows Defender exclusions configured." -ForegroundColor Green
} catch {
    Write-Host " Failed to configure Windows Defender exclusions: $_" -ForegroundColor Red
}

Write-Host "Checking OpenSSH Client..." -ForegroundColor Yellow
try {
    $cap = Get-WindowsCapability -Online -Name 'OpenSSH.Client*' -ErrorAction SilentlyContinue
    if ($cap -and $cap.State -ne 'Installed') {
        Write-Host "Installing OpenSSH Client..." -ForegroundColor Yellow
        Add-WindowsCapability -Online -Name $cap.Name -ErrorAction SilentlyContinue
        Write-Host " OpenSSH Client installed successfully." -ForegroundColor Green
    } else {
        Write-Host " OpenSSH Client is already installed." -ForegroundColor Green
    }
} catch {
    Write-Host " Failed to check/install OpenSSH Client: $_" -ForegroundColor Red
}


if (-not (Test-Path $ServiceExePath)) {
    Write-Host "ERROR: GoxDriverService.exe not found at: $ServiceExePath" -ForegroundColor Red
    Write-Host "Build it first: pyinstaller GoxDriverService.spec" -ForegroundColor Yellow
    exit 1
}

# Stop existing instance if running
Stop-GoxService

# Remove old registration if exists
$existing = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
if ($existing) {
    Write-Host "Removing old registration..."
    & $ServiceExePath remove 2>&1 | Out-Null
    Start-Sleep -Seconds 1
}

# Install the service (pywin32 registers it via the exe)
Write-Host "Registering service..." -ForegroundColor Yellow
& $ServiceExePath install

if ($LASTEXITCODE -ne 0) {
    Write-Host "pywin32 install failed. Trying sc.exe..." -ForegroundColor Yellow
    sc.exe create $ServiceName binPath= "`"$ServiceExePath`"" start= auto obj= LocalSystem DisplayName= $ServiceDisplay
    sc.exe description $ServiceName $ServiceDesc
}

# Set description and recovery options
sc.exe description $ServiceName $ServiceDesc | Out-Null
sc.exe failure $ServiceName reset= 86400 actions= restart/5000/restart/10000/restart/30000 | Out-Null

# Start service
Write-Host "Starting service..." -ForegroundColor Yellow
Start-Service -Name $ServiceName
Start-Sleep -Seconds 3

$svc = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
if ($svc -and $svc.Status -eq 'Running') {
    Write-Host "" 
    Write-Host "=== GoxDriverService installed and running! ===" -ForegroundColor Green
    Write-Host "Status  : $($svc.Status)"
    Write-Host "RunAs   : LocalSystem (SYSTEM)"
    Write-Host "Pipe    : \\.\pipe\GoxDriverService"
    Write-Host ""
    Write-Host "printagent.exe will now use this service for driver installation." -ForegroundColor Cyan
    Write-Host "No UAC prompts will appear for driver installation." -ForegroundColor Cyan
} else {
    Write-Host "WARNING: Service may not have started correctly." -ForegroundColor Yellow
    Write-Host "Check Event Viewer > Windows Logs > Application for errors." -ForegroundColor Yellow
    sc.exe query $ServiceName
}
