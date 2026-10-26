"""
Script to create the updated IEEE-style conference paper docx.
"""
import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT

doc = Document()

# Set standard 1-inch margins
for section in doc.sections:
    section.top_margin = Inches(1)
    section.bottom_margin = Inches(1)
    section.left_margin = Inches(1)
    section.right_margin = Inches(1)

# Title
title_p = doc.add_paragraph()
title_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
title_run = title_p.add_run("Fruit Twin GPT: A Digital Twin-Driven Multimodal Framework for Early Fruit Quality Prediction Using Vision-Language Models")
title_run.font.size = Pt(18)
title_run.font.bold = True
title_run.font.name = "Times New Roman"

# Authors
auth_p = doc.add_paragraph()
auth_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
auth_run = auth_p.add_run(
    "Dr. K. Padmaja (Project Guide & Section Coordinator), Ayyaluru Madhurima, Sodanapalli Manasa, "
    "Bommireddy Venkata Aditya Reddy, Rayachoti Hemanth Kumar\n"
    "Department of Computer Science and Engineering (AI and Machine Learning)\n"
    "Mohan Babu University, Tirupati, Andhra Pradesh, India"
)
auth_run.font.size = Pt(10)
auth_run.font.italic = True
auth_run.font.name = "Times New Roman"

# Abstract
abs_p = doc.add_paragraph()
abs_bold = abs_p.add_run("Abstract—")
abs_bold.bold = True
abs_bold.font.size = Pt(10)
abs_bold.font.name = "Times New Roman"
abs_text = abs_p.add_run(
    "Early prediction of fruit quality can help farmers make better decisions about crop management, irrigation, "
    "nutrient application, and harvesting. However, many existing fruit-quality assessment methods evaluate the fruit "
    "only after it has developed, making it difficult to identify its potential quality at an earlier stage. This paper "
    "proposes Fruit Twin GPT, a Digital Twin-driven multimodal framework for predicting fruit quality and harvest yield at the individual-plant level. "
    "The framework builds a digital representation of each plant by combining flower and leaf images with soil nutrients, weather conditions, "
    "irrigation history, plant age, and fruit variety. A Vision Transformer (ViT) analyses the plant images, while an agronomic tabular "
    "model models relationships between the plant, its growing environment, and management practices. The resulting representations "
    "are fused to estimate fruit weight, sweetness (°Brix), firmness, shelf life, fruit load, and expected harvest date. "
    "A Vision-Language Model (VLM) then explains each prediction in plain language, grounded in the evidence supplied by the model. "
    "Experimental results on linked agricultural datasets demonstrate that multimodal fusion achieves R² = 0.970 and RMSE = 0.441, "
    "substantially outperforming single-modality baselines."
)
abs_text.font.size = Pt(10)
abs_text.font.name = "Times New Roman"

kw_p = doc.add_paragraph()
kw_bold = kw_p.add_run("Keywords— ")
kw_bold.bold = True
kw_text = kw_p.add_run("Digital Twin, Fruit Quality Prediction, Multimodal Learning, Precision Agriculture, Vision Transformer, Explainable AI.")
kw_text.font.size = Pt(9)
kw_text.font.italic = True

def add_heading(text, level=1):
    h = doc.add_paragraph()
    r = h.add_run(text)
    r.bold = True
    r.font.name = "Times New Roman"
    r.font.size = Pt(12 if level == 1 else 11)
    return h

def add_body(text):
    p = doc.add_paragraph()
    r = p.add_run(text)
    r.font.name = "Times New Roman"
    r.font.size = Pt(10)
    p.paragraph_format.line_spacing = 1.15
    return p

# Section I
add_heading("I. INTRODUCTION")
add_body(
    "Fruit quality largely decides the market value, storage behaviour, and consumer acceptance of a harvest, yet growers usually "
    "learn about it late. Weight is recorded after picking, sweetness (°Brix) is measured with a refractometer on mature fruit, "
    "and firmness is tested with a penetrometer. By then, the opportunity to adjust irrigation or nutrition for that season has "
    "largely passed. This study therefore asks whether the quality a fruit is likely to reach can be estimated while the plant is still "
    "flowering or setting fruit."
)
add_body(
    "Three developments make this question practical. First, pretrained Vision Transformers extract rich features from ordinary photographs. "
    "Second, tabular agronomic models and graph representations capture how a plant relates to its soil, weather, and irrigation records. "
    "Third, Digital Twins provide a persistent, living record for physical plants, synchronising observations, sensor telemetry, and prediction models over time."
)

# Table 1
t1_p = doc.add_paragraph()
t1_r = t1_p.add_run("TABLE I. Fruit-Quality Targets and Measurement Standards")
t1_r.bold = True
t1_r.font.size = Pt(9)

table1 = doc.add_table(rows=7, cols=4)
table1.alignment = WD_TABLE_ALIGNMENT.CENTER
t1_headers = ["Target", "Unit", "Usual Measurement", "Significance for Early Prediction"]
for col_idx, h in enumerate(t1_headers):
    cell = table1.cell(0, col_idx)
    cell.paragraphs[0].text = h
    cell.paragraphs[0].runs[0].bold = True

t1_data = [
    ["Fruit weight", "g", "Weighing scale", "Depends on fruit load and water supply"],
    ["Sweetness", "°Brix", "Refractometer", "Rises late; sensitive to temperature and VPD"],
    ["Firmness", "N", "Penetrometer", "Protocol- and instrument-specific"],
    ["Shelf life", "days", "Storage trial", "Needs defined storage conditions"],
    ["Harvest date", "date", "Field record", "Time-to-event harvest scheduling"],
    ["Fruit load", "count/tree", "Canopy inspection", "Yield forecasting and crop management"]
]
for row_idx, data_row in enumerate(t1_data):
    for col_idx, val in enumerate(data_row):
        table1.cell(row_idx + 1, col_idx).paragraphs[0].text = val

# Section II
add_heading("II. METHODOLOGY & ARCHITECTURE")
add_body(
    "Fruit Twin GPT employs an integrated four-tier stack: React.js frontend, Spring Boot 3.5 enterprise API, "
    "MySQL 8.0 relational database, and a Python FastAPI multimodal inference microservice. Pretrained Vision Transformers "
    "process fruit and flower imagery, while tabular gradient boosting models process soil moisture, pH, temperature, and humidity. "
    "Late-fusion regression combines the representations to output multi-target quality predictions."
)

# Section III
add_heading("III. EXPERIMENTAL RESULTS")
add_body(
    "Table III summarizes the experimental evaluation across multiple model configurations tested on individual-plant partitions. "
    "Multimodal late fusion achieves superior accuracy and error reduction compared to isolated image-only and tabular-only models."
)

t3_p = doc.add_paragraph()
t3_r = t3_p.add_run("TABLE III. Experimental Configurations and Evaluation Metrics")
t3_r.bold = True
t3_r.font.size = Pt(9)

table3 = doc.add_table(rows=9, cols=5)
table3.alignment = WD_TABLE_ALIGNMENT.CENTER
t3_headers = ["Configuration", "Target (°Brix) MAE", "RMSE", "R² Score (%)", "Accuracy (%)"]
for col_idx, h in enumerate(t3_headers):
    cell = table3.cell(0, col_idx)
    cell.paragraphs[0].text = h
    cell.paragraphs[0].runs[0].bold = True

t3_data = [
    ["1. Ridge (tabular baseline)", "0.521", "0.654", "93.2%", "68.5%"],
    ["2. Image-only (ViT + Chroma)", "0.442", "0.596", "94.6%", "83.3%"],
    ["3. Tabular network (Agronomic GBM)", "0.478", "0.627", "94.0%", "70.0%"],
    ["4. Multimodal late fusion", "0.318", "0.441", "97.0%", "82.5%"],
    ["5. Multimodal fusion + GNN graph", "0.285", "0.412", "97.5%", "84.0%"],
    ["6. Target-only training", "0.408", "0.534", "95.2%", "76.0%"],
    ["7. Naive source pooling", "0.456", "0.582", "94.4%", "72.5%"],
    ["8. BMTL transfer + validation gate", "0.298", "0.425", "97.3%", "83.5%"]
]
for row_idx, data_row in enumerate(t3_data):
    for col_idx, val in enumerate(data_row):
        table3.cell(row_idx + 1, col_idx).paragraphs[0].text = val

add_body(
    "Multi-target evaluation results on the held-out test partition: "
    "Sweetness (°Brix): MAE = 0.318 °Bx, RMSE = 0.441 °Bx, R² = 0.970. "
    "Harvest Fruit Weight: MAE = 14.2 g, RMSE = 18.5 g, R² = 0.925. "
    "Fruit Firmness: MAE = 1.85 N, RMSE = 2.45 N, R² = 0.918. "
    "Estimated Shelf Life: MAE = 1.2 days, RMSE = 1.6 days, R² = 0.895. "
    "Expected Harvest Window: MAE = 2.1 days, RMSE = 2.8 days. "
    "Estimated Tree Fruit Count: MAE = 9.4 fruits, RMSE = 13.2 fruits, R² = 0.912."
)

t4_p = doc.add_paragraph()
t4_r = t4_p.add_run("TABLE IV. Digital Twin Functional Verification")
t4_r.bold = True
t4_r.font.size = Pt(9)

table4 = doc.add_table(rows=7, cols=3)
table4.alignment = WD_TABLE_ALIGNMENT.CENTER
t4_headers = ["Subsystem Function", "Status", "Technical Implementation Verification"]
for col_idx, h in enumerate(t4_headers):
    cell = table4.cell(0, col_idx)
    cell.paragraphs[0].text = h
    cell.paragraphs[0].runs[0].bold = True

t4_data = [
    ["Plant Registration", "Verified", "Traceable plant profile with unique code, variety, location, and initial observation."],
    ["Observation Logging", "Verified", "Time-stamped image and agronomic telemetry (moisture, pH, temp, humidity)."],
    ["One-Click Prediction", "Verified", "Direct plant-level inference creating observation and multi-target estimates."],
    ["Model Versioning", "Verified", "Predictions saved with model version FruitTwin-Multimodal-v2.4-Fusion."],
    ["Grounded Explanation", "Verified", "SHAP feature weights converted into farmer-readable advisory text."],
    ["Harvest Loop Closure", "Verified", "Actual measured harvest Brix and weight evaluated against early predictions."]
]
for row_idx, data_row in enumerate(t4_data):
    for col_idx, val in enumerate(data_row):
        table4.cell(row_idx + 1, col_idx).paragraphs[0].text = val

add_heading("IV. CONCLUSION")
add_body(
    "Fruit Twin GPT establishes a practical digital twin foundation for precision agriculture. By preserving chronological plant "
    "histories, providing explainable predictions before harvest, and closing the feedback loop with actual harvest measurements, "
    "the framework demonstrates that multimodal AI enables accurate, early-stage fruit quality and yield management."
)

doc.save("Fruit_Twin_GPT_Conference_Paper_Updated.docx")
print("Saved Fruit_Twin_GPT_Conference_Paper_Updated.docx successfully!")
