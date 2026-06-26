@echo off
setlocal
cd /d "%~dp0"
echo ====================================================
echo PrintAgent Watchdog (Update ^& Emergency)
echo ====================================================

:loop
rem --- 1. KIỂM TRA UPDATE ---
if exist "printagent.update.exe" (
    echo [Watchdog] Found update file. Applying...
    rem Tắt tiến trình cũ để mở khóa file
    taskkill /F /IM printagent.exe >nul 2>&1
    taskkill /F /IM agent_loader.exe >nul 2>&1
    timeout /T 3 /nobreak >nul
    
    rem Thay thế file
    if exist "printagent.exe" (
        rename "printagent.exe" "printagent.bak.exe" >nul 2>&1
    )
    rename "printagent.update.exe" "printagent.exe"
    
    rem Xóa file backup cũ
    del /f /q "printagent.bak.exe" >nul 2>&1
    
    rem Khởi động lại
    start /B "" "printagent.exe"
    echo [Watchdog] Update applied successfully.
)

rem --- 2. KIỂM TRA RESTART KHẨN CẤP (API) ---
powershell -NoProfile -Command "try { $s=Get-Content 'settings.json' -ErrorAction Stop | ConvertFrom-Json; $url=$s.api_url; if(!$url){$url=$s.polling.url}; if(!$url){$url='https://agentapi.quanlymay.com'}; $url=$url.TrimEnd('/'); $url=$url -replace '/api$', ''; $hostName=$env:COMPUTERNAME; $res=Invoke-RestMethod -Uri \"$url/api/agent/watchdog-check?hostname=$hostName\" -TimeoutSec 10 -ErrorAction Stop; if($res -match 'RESTART') { Write-Host \"$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') RESTART SIGNAL RECEIVED!\"; Stop-Process -Name 'printagent' -Force -ErrorAction SilentlyContinue; Stop-Process -Name 'agent_loader' -Force -ErrorAction SilentlyContinue; Start-Sleep -Seconds 3; if(Test-Path 'printagent.exe') { Start-Process -FilePath 'printagent.exe' -WindowStyle Hidden; Write-Host 'Agent restarted.' } } } catch { }"

rem Lặp lại sau mỗi 60 giây
timeout /t 60 /nobreak >nul
goto loop
