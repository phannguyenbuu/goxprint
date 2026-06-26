Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
currentFolder = fso.GetParentFolderName(WScript.ScriptFullName)
WshShell.CurrentDirectory = currentFolder
' Chạy file watchdog.bat ở chế độ ẩn (số 0 ở cuối)
WshShell.Run chr(34) & "watchdog.bat" & Chr(34), 0
Set WshShell = Nothing
