# ML service

Run with Python 3.11 or 3.12 after installing `requirements.txt`.

```powershell
python -m pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

No model is bundled. Research mode returns `409 MODEL_UNAVAILABLE`; demo mode is synthetic and excluded from evaluation.

Run checks with `python -m unittest discover -s tests` after installing `requirements-dev.txt`.
