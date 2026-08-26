param (
    [string]$remoteHost = "100.73.10.37",
    [string]$username = "root",
    [string]$password = "H@2026"
)

$wshell = New-Object -ComObject wscript.shell;

# 1. SCP
Write-Host "Running SCP..."
$process1 = Start-Process -FilePath "scp" -ArgumentList "-o StrictHostKeyChecking=no", "D:\Dropbox\_Documents\Goxprint\GoxAgent\agent\utils\scanner.py", "$username@$remoteHost`:/opt/GoxAgent/agent/utils/scanner.py" -PassThru
Start-Sleep -Seconds 2
if ($process1.HasExited -eq $false) {
    $wshell.SendKeys("$password~")
}
$process1.WaitForExit()

Write-Host "Running SCP for polling_bridge.py..."
$process1a = Start-Process -FilePath "scp" -ArgumentList "-o StrictHostKeyChecking=no", "D:\Dropbox\_Documents\Goxprint\GoxAgent\agent\services\polling_bridge.py", "$username@$remoteHost`:/opt/GoxAgent/agent/services/polling_bridge.py" -PassThru
Start-Sleep -Seconds 2
if ($process1a.HasExited -eq $false) {
    $wshell.SendKeys("$password~")
}
$process1a.WaitForExit()
Write-Host "SCP finished."

# 2. SSH
Write-Host "Running SSH..."
$process2 = Start-Process -FilePath "ssh" -ArgumentList "-o StrictHostKeyChecking=no", "$username@$remoteHost", "`"systemctl restart goxagent`"" -PassThru
Start-Sleep -Seconds 2
if ($process2.HasExited -eq $false) {
    $wshell.SendKeys("$password~")
}
$process2.WaitForExit()
Write-Host "SSH finished. Restarted goxagent!"
