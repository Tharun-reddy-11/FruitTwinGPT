param([string]$EnvFile)

if ([string]::IsNullOrWhiteSpace($EnvFile)) {
  $EnvFile = Join-Path $PSScriptRoot "..\.env"
}

if (-not (Test-Path -LiteralPath $EnvFile)) { throw "Environment file not found: $EnvFile. Copy .env.example to .env, set the MySQL credentials, and provide a random JWT_SECRET with at least 32 characters." }
Get-Content -LiteralPath $EnvFile | ForEach-Object {
  if ($_ -match '^\s*([^#=\s]+)=(.*)$') {
    $name=$matches[1]; $value=$matches[2].Trim('"'); Set-Item -Path "Env:$name" -Value $value
  }
}
Push-Location "$PSScriptRoot\..\backend"
try { mvn.cmd spring-boot:run } finally { Pop-Location }
