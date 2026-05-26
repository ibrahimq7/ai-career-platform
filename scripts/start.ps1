param(
  [int]$Port = 8000,
  [string]$HostAddress = "127.0.0.1"
)

$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
$Frontend = Join-Path $Root "frontend"
$Backend = Join-Path $Root "backend\project\resume_backend"
$VenvPython311 = Join-Path $Backend "venv311\Scripts\python.exe"
$VenvPython = Join-Path $Backend "venv\Scripts\python.exe"

function Import-DotEnv {
  param([string]$Path)

  if (-not (Test-Path $Path)) {
    return
  }

  Get-Content $Path | ForEach-Object {
    $Line = $_.Trim()
    if (-not $Line -or $Line.StartsWith("#") -or -not $Line.Contains("=")) {
      return
    }

    $Parts = $Line.Split("=", 2)
    $Name = $Parts[0].Trim()
    $Value = $Parts[1].Trim().Trim('"').Trim("'")

    if ($Name) {
      [Environment]::SetEnvironmentVariable($Name, $Value, "Process")
    }
  }
}

if (Test-Path $VenvPython311) {
  $Python = $VenvPython311
} elseif (Test-Path $VenvPython) {
  $Python = $VenvPython
} else {
  $Python = "python"
}

Import-DotEnv (Join-Path $Backend ".env")

Write-Host "Building frontend..." -ForegroundColor Cyan
npm --prefix $Frontend run build

Write-Host "Starting AI Career Platform at http://${HostAddress}:${Port}" -ForegroundColor Green
Write-Host "FastAPI will serve both /api/* and the React app from frontend/dist." -ForegroundColor DarkGray

& $Python -m uvicorn --app-dir $Backend app.resume_parser.main:app --host $HostAddress --port $Port
