-- export_vray_datasmith_from_max.ms
-- This MaxScript automates opening a .max file and exporting its VRay data to a Datasmith .udatasmith file.
-- Adjust the paths if needed.
(
local sourceFile = "D:/Dropbox/Public/EVERMOTION/ARCHMODELS/Archmodels 85/038_Vray.max"
local exportDir  = "D:/Dropbox/3DLib/Indoor/3-European style 46/002/datasmith"

-- Ensure the export directory exists
if not doesFileExist exportDir then makeDir exportDir

-- Open the source .max file
loadMaxFile sourceFile useFileUnits:true

-- Wait for the file to load completely


-- Construct the output Datasmith filename (same base name, .udatasmith)
local baseName = getFilenameFile sourceFile
local outFile = exportDir + "/" + baseName + ".udatasmith"

-- Use VRay's Datasmith exporter (if VRay plugin is loaded)
if (classof VRayExporter != undefined) then (
    local vrayExporter = VRayExporter()
    vrayExporter.setOutputFile outFile
    vrayExporter.exportAll()
    format "[export_vray_datasmith_from_max] Exported % to %\n" sourceFile outFile
) else (
    format "[export_vray_datasmith_from_max] VRayExporter not available. Ensure VRay plugin is loaded.\n"
)
)