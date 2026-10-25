param([switch]$Restart)
$ErrorActionPreference = 'Stop'
$siteDirectory = $PSScriptRoot
$storageDirectory = Join-Path $siteDirectory 'storage'
New-Item -ItemType Directory -Force -Path $storageDirectory | Out-Null
$pidFile = Join-Path $storageDirectory 'preview.pid'
if (Test-Path -LiteralPath $pidFile) {
    $previewPid = [int](Get-Content -LiteralPath $pidFile)
    $previewProcess = Get-CimInstance Win32_Process -Filter "ProcessId=$previewPid" -ErrorAction SilentlyContinue
    if ($previewProcess -and $previewProcess.Name -eq 'node.exe' -and $previewProcess.CommandLine -match 'server\.mjs') {
        if ($Restart) { Stop-Process -Id $previewPid } else { Write-Output 'Preview already running: http://127.0.0.1:4173/'; exit }
    }
}
$nodePath = (Get-Command node).Source
$preview = Start-Process -FilePath $nodePath -ArgumentList 'server.mjs' -WorkingDirectory $siteDirectory -WindowStyle Hidden -RedirectStandardOutput (Join-Path $storageDirectory 'preview.log') -RedirectStandardError (Join-Path $storageDirectory 'preview-error.log') -PassThru
$preview.Id | Set-Content -LiteralPath $pidFile
for ($attempt = 0; $attempt -lt 10; $attempt++) {
    Start-Sleep -Milliseconds 700
    try { $response = Invoke-WebRequest 'http://127.0.0.1:4173/api/session' -TimeoutSec 3; if ($response.StatusCode -eq 200) { Write-Output 'Website: http://127.0.0.1:4173/'; Write-Output 'Admin: http://127.0.0.1:4173/admin/'; exit } } catch {}
}
throw 'Preview did not respond. Check storage/preview-error.log.'
