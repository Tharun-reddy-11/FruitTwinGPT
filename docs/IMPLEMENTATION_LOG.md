# Implementation log

## 2026-10-22

- Reviewed the supplied conference paper and base BMTL paper. The base work is a tabular balanced transfer method; it is not an early-image model. The project materials require plant-linked early observations and later harvest labels for the proposed multimodal evaluation.
- Created the Spring Boot persistence/API foundation, including JWT authentication, MySQL/Flyway schema, plant ownership enforcement, observation and harvest records, Twin history, OpenAPI, and a controlled ML-service call.
- Created the FastAPI ML boundary. Research inference is deliberately unavailable without a versioned trained artifact; demo inference is synthetic and explicitly labelled.
- Rebuilt the React experience: landing page, image-backed hero, workflow marquee that pauses on hover, authentication flow, responsive dashboard, live demo signal, Recharts visualizations, plant views, observation dialog, feedback toasts, and mobile navigation.
- Moved the Vite/React application from the repository root into `frontend/`, preserving its source, dependencies, and production bundle. Added a separately labelled `datasets/demo/linked_plant_harvest_demo.csv` fixture for UI/API contract testing only.
- Reworked the React experience from a static demonstration into an API-backed workspace: account registration/login, authenticated plant listing, plant registration, observation persistence, plant timeline display, prediction-history display, and connection/error states. The landing hero now uses the user-supplied fruit-growth image; the workflow uses four fixed image-hover cards; the dashboard carousel uses the three user-supplied fruit images.
- Fixed a MySQL startup failure reported from STS: entity fields now explicitly map to the existing Flyway snake-case columns (including `harvest_records.firmness_n`). Installed the pinned ML dependencies in `ml-service/.venv`; the linked development fixture now passes `scripts/validate_dataset.py`.
- Added the default local Spring profile. It generates an in-memory signing key only when a local run omits `JWT_SECRET`, so STS can start securely for local development. Non-local deployments continue to reject a missing or short secret.
- Refined the landing hero by removing its grid overlay, reducing the navigation height, and constraining the text column. Account registration now stores the required full name and workspace name through Flyway migration `V2__add_user_profile.sql`, validates password confirmation in the browser, and gives a visible password-length requirement.
- Fixed the authentication failure from the running STS log: token issuance now supplies an HS256 JWS header to the symmetric JWT encoder. Added an integration test that registers an account and asserts that a Bearer access token is returned. Refined the hero to preserve the complete supplied fruit image at the right edge rather than cropping it as a full-bleed cover image.
- Fixed client session restoration: an authenticated browser session now opens the user workspace after login and after a page refresh. Only explicit sign-out returns the user to the landing page.
- `npm run build` passed. `mvn test` passed with Flyway migration applied to H2. ML endpoint tests passed (3 tests).

## Outstanding for real deployment

- Configure MySQL and environment secrets.
- Deploy the authenticated frontend-to-API integration with production HTTPS, CORS, and environment-specific configuration.
- Configure and start MySQL plus the Spring Boot API before using authentication and persistence from the browser. The frontend defaults to `http://localhost:8080`, configurable through `VITE_API_URL`.
- Keep MySQL credentials and the 32+ character JWT secret in the ignored root `.env` file or in STS Run Configuration environment variables; no credentials are kept in the source configuration.
- Obtain and document a licensed, plant-linked dataset meeting the data contract.
- Train, validate, version, and register model artifacts; only then enable research inference and report evaluation results.
- Install `ml-service/requirements.txt` into the selected ML environment before running `scripts/validate_dataset.py`; the current virtual environment does not contain `pandas`.
