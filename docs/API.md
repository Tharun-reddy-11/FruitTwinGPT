# API contract summary

All protected API routes require `Authorization: Bearer <access-token>`.

| Route | Purpose |
| --- | --- |
| `POST /api/auth/register` | Create a user and return a short-lived JWT |
| `POST /api/auth/login` | Authenticate and return a JWT |
| `GET, POST /api/plants` | Read/create the caller's plants |
| `GET, POST /api/plants/{id}/observations` | Read/add timestamped observations for an owned plant |
| `POST /api/plants/{id}/harvests` | Record measured harvest outcomes |
| `GET /api/plants/{id}/twin` | Retrieve plant, observations, predictions, and harvest timeline |
| `POST /api/predictions` | Send an owned observation to the ML service and persist its response |

The ML service has `/health`, `/models`, and `/predict/multimodal`. Research requests return a failure rather than a fabricated answer until a validated model artifact is installed. API documentation is available at `/docs` when the backend is running.
