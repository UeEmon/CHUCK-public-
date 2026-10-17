$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
docker compose up -d --build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Host 'HF Propagation JP: http://localhost:18082'
