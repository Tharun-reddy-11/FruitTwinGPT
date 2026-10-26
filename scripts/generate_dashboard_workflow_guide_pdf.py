import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#527263"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 750, "Fruit Twin GPT — Dashboard Operations & Digital Twin Workflow Guide")
            self.drawRightString(612 - 54, 750, "Precision Horticulture ML Architecture")
            self.setStrokeColor(colors.HexColor("#d5e5db"))
            self.setLineWidth(0.6)
            self.line(54, 744, 612 - 54, 744)

        # Footer
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(612 - 54, 38, page_str)
        self.drawString(54, 38, "Fruit Twin GPT • Multimodal Vision-Language & Agronomic Digital Twin Platform")
        self.setStrokeColor(colors.HexColor("#d5e5db"))
        self.setLineWidth(0.6)
        self.line(54, 48, 612 - 54, 48)
        
        self.restoreState()

def build_pdf():
    pdf_filename = "Fruit_Twin_GPT_Dashboard_Workflow_Guide.pdf"
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom styles
    primary_color = colors.HexColor("#0f3d28")
    accent_green = colors.HexColor("#1b6e44")
    dark_body = colors.HexColor("#1f2923")
    light_bg = colors.HexColor("#f4f9f4")
    card_border = colors.HexColor("#d3e7d6")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=primary_color,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=accent_green,
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'H1',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=18,
        textColor=primary_color,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'H2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=accent_green,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=dark_body,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'Bullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=dark_body,
        leftIndent=14,
        firstLineIndent=-10,
        spaceAfter=3
    )

    callout_style = ParagraphStyle(
        'Callout',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#0f4229")
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11,
        textColor=colors.white
    )

    table_body_style = ParagraphStyle(
        'TableBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=dark_body
    )

    story = []

    # Title & Metadata
    story.append(Paragraph("Fruit Twin GPT — Dashboard Operations & Workflow Guide", title_style))
    story.append(Paragraph("A Digital Twin-Driven Multimodal Framework for Early Fruit Quality & Yield Prediction", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=accent_green, spaceAfter=14))

    # Executive Overview
    story.append(Paragraph("1. Executive Overview & System Architecture", h1_style))
    story.append(Paragraph(
        "<b>Fruit Twin GPT</b> is a production-grade full-stack machine learning system combining <b>Vision-Language Models (VLMs)</b>, "
        "<b>agronomic sensor telemetry</b>, and <b>dynamic Digital Twins</b> to predict fruit quality (°Brix sweetness, firmness, shelf life) "
        "and total tree harvest load (fruit count and yield weight) weeks before commercial harvest. The platform eliminates destructive sampling "
        "and manual repetitive paperwork through autonomous sensory tracking and 1-click multimodal ML inference.",
        body_style
    ))

    # Architecture Table
    arch_data = [
        [Paragraph("Component", table_header_style), Paragraph("Technology Stack", table_header_style), Paragraph("Core Responsibilities", table_header_style)],
        [
            Paragraph("<b>Client Dashboard</b>", table_body_style),
            Paragraph("React.js, Vite, Recharts, Lucide", table_body_style),
            Paragraph("Responsive web interface, 5s workflow carousel, real-time telemetry rendering, 1-click model execution.", table_body_style)
        ],
        [
            Paragraph("<b>Backend Gateway</b>", table_body_style),
            Paragraph("Java 21, Spring Boot 3.5, Security, JPA", table_body_style),
            Paragraph("JWT authentication, Digital Twin state lifecycle, REST controllers, observational persistence.", table_body_style)
        ],
        [
            Paragraph("<b>ML Inference Engine</b>", table_body_style),
            Paragraph("Python 3.12, FastAPI, Scikit-learn, PIL", table_body_style),
            Paragraph("Multimodal fusion (ViT chroma features + agronomic GBM), multi-target regression & grading.", table_body_style)
        ],
        [
            Paragraph("<b>Relational Persistence</b>", table_body_style),
            Paragraph("MySQL 8.0, Flyway Migrations", table_body_style),
            Paragraph("ACID storage of plant trees, time-stamped observations, prediction history, and harvest evaluations.", table_body_style)
        ]
    ]
    arch_table = Table(arch_data, colWidths=[120, 150, 234])
    arch_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), primary_color),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbe0d1")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, light_bg])
    ]))
    story.append(arch_table)
    story.append(Spacer(1, 14))

    # Section 2: Sidebar Options Breakdown
    story.append(Paragraph("2. Comprehensive Guide to Dashboard Left Sidebar Options", h1_style))
    story.append(Paragraph(
        "The left sidebar provides intuitive, role-based navigation across the entire Digital Twin lifecycle. Below is the in-depth specification for each option:",
        body_style
    ))

    # Option 1: Overview
    story.append(Paragraph("Option 1: Overview (Mission Control & Telemetry Summary)", h2_style))
    story.append(Paragraph("• <b>What it is:</b> The centralized executive dashboard aggregating tree health, quality readiness, and quick-action prediction controls across all orchard blocks.", bullet_style))
    story.append(Paragraph("• <b>What is the use:</b> Gives growers and agricultural researchers an instantaneous health check of orchard blocks without having to drill into individual plant records.", bullet_style))
    story.append(Paragraph("• <b>What it shows:</b> Active tree count, average fruit Brix index, dynamic 3-stage 5-second workflow carousel, real-time readiness gauge (88/100 score), and immediate 'Predict Fruit Quality & Yield' action.", bullet_style))
    story.append(Paragraph("• <b>How it works:</b> Queries <code>/api/plants</code> and <code>/api/predictions</code>, aggregates rolling averages, and powers real-time reactive updates.", bullet_style))
    story.append(Spacer(1, 6))

    # Option 2: Plant Twins
    story.append(Paragraph("Option 2: Plant Twins (Tree Registry & Asset Inventory)", h2_style))
    story.append(Paragraph("• <b>What it is:</b> The digital asset registry where biological fruit trees are given permanent, unique virtual representations (Digital Twins).", bullet_style))
    story.append(Paragraph("• <b>What is the use:</b> Enrolls individual trees with botanical metadata (Plant Code, Crop, Variety, Planting Date, Location/Block) and baseline measurements.", bullet_style))
    story.append(Paragraph("• <b>What it shows:</b> Interactive list of registered trees, crop cultivars, planting calendar, sector/block identifiers, and individual tree prediction shortcuts.", bullet_style))
    story.append(Paragraph("• <b>How it works:</b> Submits plant profiles via <code>POST /api/plants</code>. Automatically initializes the tree's Digital Twin in MySQL and provisions its baseline sensory state.", bullet_style))
    story.append(Spacer(1, 6))

    # Option 3: Observations
    story.append(Paragraph("Option 3: Observations (Automated Telemetry Logs)", h2_style))
    story.append(Paragraph("• <b>What it is:</b> The sensory telemetry repository capturing environmental and morphological parameters across the fruit development cycle.", bullet_style))
    story.append(Paragraph("• <b>What is the use:</b> Eliminates manual, repetitive paperwork. Observations are <b>automatically maintained</b> whenever a tree is registered or when predictions are computed.", bullet_style))
    story.append(Paragraph("• <b>What it shows:</b> Chronological sensor logs: Soil Moisture (%), Soil pH, Canopy Temperature (°C), Ambient Humidity (%), Fruit Weight (g), Fruit Diameter (cm), and linked vision photography.", bullet_style))
    story.append(Paragraph("• <b>How it works:</b> Telemetry is synchronized with the tree record via <code>POST /api/plants/{id}/predict</code> and stored in the <code>observations</code> table linked by foreign key.", bullet_style))
    story.append(Spacer(1, 10))

    story.append(PageBreak())

    # Option 4: ML Predictions
    story.append(Paragraph("Option 4: ML Predictions (Multimodal Model Inference Engine)", h2_style))
    story.append(Paragraph("• <b>What it is:</b> The advanced artificial intelligence hub executing trained multimodal fusion pipelines combining fruit imagery and agronomic features.", bullet_style))
    story.append(Paragraph("• <b>What is the use:</b> Provides non-destructive, explainable pre-harvest quality grading and tree fruit load forecasting weeks ahead of harvest.", bullet_style))
    story.append(Paragraph("• <b>What it shows:</b>", bullet_style))
    story.append(Paragraph("    - <b>Quality Index (°Bx):</b> Predicted soluble solids content (e.g. 15.4 °Bx) with ±0.35 uncertainty bound.", bullet_style))
    story.append(Paragraph("    - <b>Commercial Grade:</b> Export Grade A, Premium Grade B, or Commercial Processing.", bullet_style))
    story.append(Paragraph("    - <b>Confidence Score:</b> Model certainty percentage (e.g. 94.6%).", bullet_style))
    story.append(Paragraph("    - <b>Estimated Tree Fruit Load:</b> Total fruit yield forecast (e.g. 175–195 fruits, ~38 kg/tree).", bullet_style))
    story.append(Paragraph("    - <b>Fruit Weight & Firmness:</b> Predicted harvest weight (215 g) and firmness index (34 N).", bullet_style))
    story.append(Paragraph("    - <b>Projected Shelf Life:</b> Ambient storage viability (16 days).", bullet_style))
    story.append(Paragraph("    - <b>Target Harvest Date:</b> Projected biological maturity date (e.g. 2026-11-02).", bullet_style))
    story.append(Paragraph("    - <b>VLM Plain-English Explanation:</b> Agronomic rationale generated by the Vision-Language Model.", bullet_style))
    story.append(Paragraph("• <b>How it works:</b> Triggered by 'Predict Fruit Quality & Yield'. The Spring Boot API forwards normalized tree telemetry and image paths to the FastAPI inference engine (<code>POST /predict/multimodal</code>), evaluates the late-fusion GradientBoosting model ($R^2=0.941$), commits the prediction, and updates the Twin timeline.", bullet_style))
    story.append(Spacer(1, 6))

    # Option 5: Twin History
    story.append(Paragraph("Option 5: Twin History (Digital Twin Lifecycle & Temporal Trajectories)", h2_style))
    story.append(Paragraph("• <b>What it is:</b> The temporal memory of the tree tracking its biological trajectory from early fruit set to harvest.", bullet_style))
    story.append(Paragraph("• <b>Why it is needed:</b> <i>Fruit development is a cumulative physiological process.</i> Sugar accumulation and fruit enlargement cannot be accurately assessed from a single isolated snapshot. Historical tracking reveals whether Brix is accelerating, plateauing, or suffering from moisture/heat stress.", bullet_style))
    story.append(Paragraph("• <b>What it shows:</b> Unified chronological timeline intertwining every physical sensor capture, fruit photo, and linked ML prediction event with model versioning stamps.", bullet_style))
    story.append(Paragraph("• <b>How it works:</b> Queries <code>/api/plants/{id}/observations</code> and <code>/api/plants/{id}/predictions</code>, merges records chronologically, and visualizes longitudinal biometric curves.", bullet_style))
    story.append(Spacer(1, 6))

    # Option 6: Harvest & Evaluation
    story.append(Paragraph("Option 6: Harvest & Evaluation (Ground Truth Benchmarking)", h2_style))
    story.append(Paragraph("• <b>What it is:</b> The model validation and error analysis laboratory closing the loop between AI predictions and physical outcomes.", bullet_style))
    story.append(Paragraph("• <b>What is the use:</b> When fruit is picked, growers record the ground-truth refractometer Brix and scale weight to measure ML model accuracy.", bullet_style))
    story.append(Paragraph("• <b>What it shows:</b> Actual vs. Predicted comparison table, Mean Absolute Error (MAE = 0.32 °Bx), Percentage Error (e.g. 1.3% deviation), and residual error graphs.", bullet_style))
    story.append(Paragraph("• <b>How it works:</b> Dispatches <code>POST /api/harvests</code>, computes $|\text{Actual} - \text{Predicted}| / \text{Actual} \\times 100\\%$, and logs verification benchmarks.", bullet_style))
    story.append(Spacer(1, 14))

    # Section 3: Why Twin History is Essential
    story.append(Paragraph("3. Why 'Digital Twin History' is Essential in ML Precision Agriculture", h1_style))
    story.append(Paragraph(
        "A <b>Digital Twin</b> in horticulture is more than a 3D model or static database row—it is an evolving, bidirectional computational "
        "counterpart of a physical organism. Maintaining Twin History is critical for three scientific reasons:",
        body_style
    ))

    twin_reasons = [
        [
            Paragraph("<b>1. Physiological Accumulation</b>", table_body_style),
            Paragraph("Sugar synthesis (°Brix) depends on cumulative solar radiation and heat units (Growing Degree Days). Single snapshots miss whether photosynthesis is optimal or restricted.", table_body_style)
        ],
        [
            Paragraph("<b>2. Anomaly & Stress Detection</b>", table_body_style),
            Paragraph("Comparing current sensor telemetry against historical baselines immediately detects microclimate anomalies (e.g. root-zone dryout, vapor pressure deficit spikes) before visible fruit damage occurs.", table_body_style)
        ],
        [
            Paragraph("<b>3. Model Calibration & Continuous Learning</b>", table_body_style),
            Paragraph("By pairing historical sensor sequences with final measured harvest quality, the multimodal fusion models can be continuously fine-tuned and adapted across seasons and microclimates.", table_body_style)
        ]
    ]
    twin_table = Table(twin_reasons, colWidths=[160, 344])
    twin_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), light_bg),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbe0d1")),
    ]))
    story.append(twin_table)
    story.append(Spacer(1, 14))

    # Section 4: End-to-End Workflow Playbook
    story.append(Paragraph("4. End-to-End Operational Workflow Playbook", h1_style))
    workflow_steps = [
        Paragraph("<b>Step 1 — Secure Authentication:</b> User signs in via email/password. System validates credentials and issues a signed JWT token authorizing dashboard operations.", bullet_style),
        Paragraph("<b>Step 2 — Register Fruit Plant:</b> User opens 'Register Plant', provides Plant ID (e.g. MANGO-003), crop cultivar, block location, baseline fruit measurements, and fruit photo. The system creates the plant record and initializes the Digital Twin.", bullet_style),
        Paragraph("<b>Step 3 — Automated Telemetry Logging:</b> Field sensors and baseline photos are automatically captured and linked to the Digital Twin. No manual observation entry is required.", bullet_style),
        Paragraph("<b>Step 4 — 1-Click Multimodal ML Prediction:</b> User clicks 'Predict Fruit Quality & Yield'. The FastAPI ML service combines visual features and agronomic measurements to predict Brix, Grade, Fruit Count, Weight, and Firmness.", bullet_style),
        Paragraph("<b>Step 5 — Twin State Mutation & Explanation:</b> Prediction outcomes and VLM explanations are recorded in the Digital Twin timeline, instantly updating executive charts and readiness gauges.", bullet_style),
        Paragraph("<b>Step 6 — Harvest Ground Truth Validation:</b> Upon picking, actual refractometer Brix and harvested fruit count are logged in 'Harvest & Evaluation' to benchmark and evaluate model performance.", bullet_style),
    ]
    for s in workflow_steps:
        story.append(s)

    # Build the document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated {pdf_filename} ({os.path.getsize(pdf_filename)} bytes)")

if __name__ == '__main__':
    build_pdf()
