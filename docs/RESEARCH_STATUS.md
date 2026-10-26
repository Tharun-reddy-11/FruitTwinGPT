# Research and data validation status

## Verified research scope

- The base paper implements balanced multi-source transfer for tabular fruit-quality regression; it does not itself provide a plant-linked early-image multimodal predictor.
- The proposed project materials specify a plant-level Digital Twin and comparisons between tabular, image, and fused models.
- No dataset in the workspace has been verified as linking plant identifiers, early observations/images, and later measured harvest outcomes.
- Node.js 22.14.0 and npm 10.9.2 are available.
- Java 26.0.1 is available.
- Python and Maven are not available on PATH, so the ML and Spring Boot services are not yet executable in this environment.

## Claims not currently supportable

There is no verified plant identifier linking observations to images and later harvest labels. Therefore no scientifically valid quality target, model score, multimodal comparison, or real-time prediction claim can be made. The API and UI demo path are intentionally synthetic and separately labeled.

## Required next data package

At minimum, provide a dataset manifest with source/license, crop and cultivar, plant/plot identifiers, growth-stage timestamps, image paths, structured observation units, target label definition, harvest timestamp, and a documented train/validation/test grouping strategy. The first model should be selected only after that inventory confirms whether the target is regression, classification, or forecasting.
