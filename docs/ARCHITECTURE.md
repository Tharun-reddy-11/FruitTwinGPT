# Initial architecture

The intended production boundary is:

`React/Vite frontend -> Spring Boot API -> MySQL`

`Spring Boot API -> FastAPI ML service -> versioned model/preprocessing artifacts`

The current increment implements only the frontend shell and demo workspace. It does not pretend that absent backend, database, or model services exist. Future service contracts should persist plant ownership, timestamped observations, image metadata, model version, input snapshot, prediction, uncertainty, and later harvest outcome as immutable history.
