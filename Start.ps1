$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
# CHUCK reads public data from the fetcher container with a shared token; create one on first start.
if (-not ((Test-Path .env) -and (Select-String -Path .env -Pattern '^HF_PUBLIC_DATA_TOKEN=.{32,}' -Quiet))) {
  $bytes = New-Object byte[] 24
  [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
  Add-Content -Path .env -Value ('HF_PUBLIC_DATA_TOKEN=' + (($bytes | ForEach-Object { $_.ToString('x2') }) -join ''))
}
docker compose up -d --build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Host 'HF Propagation JP: http://localhost:18082'
