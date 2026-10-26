$serviceRoot = Join-Path $PSScriptRoot "..\ml-service"
$venvPython = Join-Path $serviceRoot ".venv\Scripts\python.exe"
if (-not (Test-Path -LiteralPath $venvPython)) { py -3.12 -m venv (Join-Path $serviceRoot ".venv") }
& $venvPython -m pip install -r (Join-Path $serviceRoot "requirements.txt")
Push-Location $serviceRoot
try { & $venvPython -m uvicorn app.main:app --reload --port 8000 } finally { Pop-Location }
