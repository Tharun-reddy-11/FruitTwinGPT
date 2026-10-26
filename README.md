# FruitTwinGPT

Research-oriented, plant-level Digital Twin for early fruit-quality experiments. The application persists an observation timeline and prediction history without treating development fixtures or unvalidated models as scientific evidence.

## Architecture

`React/Vite dashboard -> Spring Boot API -> MySQL`

`Spring Boot API -> FastAPI ML service -> versioned, validated model artifacts`

The React frontend is API-backed for registration/login, user-owned plants, observations, plant timelines, and prediction history. The ML service refuses research inference unless a versioned trained model is added.

## Prerequisites

- Node.js 20+ and npm
- Java 21+ and Maven 3.9+
- Python 3.11 or 3.12
- MySQL 8+

## Development

```powershell
# frontend (from the repository root)
Set-Location frontend
npm install
npm run dev

# ML service (from ml-service)
python -m pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# API: first, from the project root
Copy-Item .env.example .env
# Set DB_URL, DB_USERNAME and DB_PASSWORD. A local-only, in-memory JWT key is generated when JWT_SECRET is omitted.
# For a persistent local session or any deployment, set a unique random JWT_SECRET of 32+ characters.
# In STS, add these values under Run Configurations > Environment.
.\scripts\run-api.ps1
```

The API applies Flyway migration `V1__initial_schema.sql` at start-up. Browse OpenAPI at `http://localhost:8080/docs`.

New accounts require a full name, workspace name, valid email address, matching password confirmation, and a password of at least 12 characters. Flyway applies the account-profile migration automatically at API startup.

The PowerShell scripts load the local `.env` only for the API process; the file is ignored by Git. STS starts with the safe local profile by default. Its temporary signing key changes at restart; set `JWT_SECRET` for persistent sessions. Start the ML service with `.\scripts\run-ml.ps1`.

## Dataset requirements

Real research training requires linked records: `plant_id`, early observation date and stage, correctly dated image reference, structured features available at that date, and later harvest labels such as °Brix or weight. Split experiments by plant/plot (and preferably season) to prevent leakage. Run `scripts/validate_dataset.py your_records.csv` before training.

## Checks

```powershell
Set-Location frontend; npm run build
Set-Location backend; mvn test
Set-Location ..\ml-service; .\.venv\Scripts\python.exe -m unittest discover -s tests
```

## Validation status

The attached research materials support the proposed architecture and define the key data gap: no supplied research dataset has been verified as linking early images and observations to later per-plant harvest outcomes. Accordingly, no real model, performance score, or claim of quality prediction is included in this repository. Development fixtures are excluded from training and evaluation.

## User interface

The Vite application is located in `frontend/`, opens at `http://localhost:5173`, and includes a landing page, fixed image-hover workflow cards, authentication screens, responsive Digital Twin dashboard, visual charts, observation dialog, and authenticated API calls. Start MySQL, the API, and the ML service before using the complete workflow.
