param(
	[ValidateSet("preview", "build")]
	[string]$Mode = "preview"
)

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = Resolve-Path (Join-Path $ScriptDir "..")
$WebDir = Join-Path $RootDir "web"

if ($Mode -eq "build") {
	Write-Host "==> Building React app..."
	Push-Location $WebDir
	npm run build
	Pop-Location

	Write-Host "==> Building mdBook..."
	Push-Location $RootDir
	mdbook build
	Pop-Location

	Write-Host "==> Build done."
	exit 0
}

Write-Host "==> Starting preview services..."
Write-Host "   - mdBook: http://localhost:3000"
Write-Host "   - React : http://localhost:5173"

$bookCmd = "Set-Location '$RootDir'; mdbook serve"
$webCmd = "Set-Location '$WebDir'; npm run dev"

Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", $bookCmd | Out-Null
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", $webCmd | Out-Null

Write-Host "==> Preview started in two new PowerShell windows."