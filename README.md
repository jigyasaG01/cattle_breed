# Cattle Breed Analyzer

A web application that identifies **Indian cattle breeds** and estimates **Body Condition Score (BCS)** from a photograph using deep learning. Upload an image of cattle and the system returns the predicted breed along with a body condition assessment (fat, moderate, or thin).

## What It Does

The app runs two independent image-classification models on every uploaded photo:

1. **Breed Identification** — classifies the animal into one of 12 Indian cattle breeds:
   Bhadawari, Gir, Hariana, Kankrej, Mehsana, Murrah, Nagori, Rathi, Red Sindhi, Sahiwal, Surti, Tharparkar.

2. **Body Condition Scoring** — assesses the animal's physical condition as **fat**, **moderate**, or **thin**, which is a practical indicator of nutrition and health status.

Both predictions include a confidence percentage so you can gauge how certain the model is.

## How It Works

### Models

Both models are built on **ResNet-18** (a convolutional neural network) using **transfer learning** from ImageNet pre-trained weights. The backbone is frozen and only the final fully-connected classification layer is trained on the cattle-specific datasets.

| Model | Architecture | Output Classes | Training Epochs | Saved Weights |
|-------|-------------|---------------|----------------|---------------|
| Breed | ResNet-18 | 12 breeds | 20 | `rajasthan_cattle_modell.pth` |
| BCS | ResNet-18 | 3 conditions | 10 | `bcs_model.pth` |

### Image Preprocessing

- **Breed model**: Resize to 224x224, convert to tensor, normalize with ImageNet mean/std `([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])`.
- **BCS model**: Resize to 224x224, convert to tensor (no normalization).

### Architecture

```
Browser (index.html + ui.js)
   │
   │  POST /api/predict  (multipart image upload)
   ▼
Flask Backend (app.py)
   ├── Breed Model  →  breed name + confidence
   └── BCS Model    →  condition label + confidence
   │
   │  JSON response
   ▼
Browser displays results
```

The Flask server loads both `.pth` weight files at startup, serves the frontend from `static/`, and exposes a single `POST /api/predict` endpoint that accepts an image and returns JSON with both predictions.

## Project Structure

```
cattle_breed/
├── app.py                          # Flask backend — loads models, serves API
├── requirements.txt                # Python dependencies
├── rajasthan_cattle_modell.pth     # Trained breed classification weights
├── bcs_model.pth                   # Trained BCS classification weights
├── static/
│   ├── index.html                  # Frontend page
│   ├── styles.css                  # UI styling (dark theme)
│   └── ui.js                       # Frontend logic — upload, API calls, results
├── predictionf.ipynb               # Training notebook for breed model
├── bcs.ipynb                       # Training notebook for BCS model
├── rajasthan_cattle_dataset.zip    # Breed dataset (12 breeds, train/test split)
└── bcs dataaa.zip                  # BCS dataset (fat/moderate/thin)
```

## Setup

### Prerequisites

- Python 3.9+
- pip

### 1. Clone the repository

```bash
git clone https://github.com/jigyasaG01/cattle_breed.git
cd cattle_breed
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

This installs PyTorch, torchvision, Flask, flask-cors, and Pillow.

### 3. Ensure model weights are present

The app needs two weight files in the project root:

- `rajasthan_cattle_modell.pth` (breed model)
- `bcs_model.pth` (BCS model)

If they are missing, you can retrain them by running the Jupyter notebooks:

```bash
# For breed model
jupyter notebook predictionf.ipynb

# For BCS model
jupyter notebook bcs.ipynb
```

The notebooks will train the models and save the `.pth` files to the current directory.

### 4. Run the application

```bash
python app.py
```

The server starts at **http://localhost:5000**.

### 5. Use the app

1. Open http://localhost:5000 in your browser.
2. Click the upload area (or drag-and-drop) to select a cattle image.
3. Click **Analyze Image**.
4. View the predicted breed and body condition score with confidence percentages.

## API Reference

### `POST /api/predict`

Upload an image for analysis.

**Request**: `multipart/form-data` with a field named `image` containing the image file.

**Response** (JSON):

```json
{
  "breed": "Kankrej",
  "breed_confidence": 99.07,
  "bcs": "moderate",
  "bcs_confidence": 83.66
}
```

## Datasets

- **Breed dataset** (`rajasthan_cattle_dataset.zip`): 12 Indian cattle breeds with train/test splits, ~50+ images per breed.
- **BCS dataset** (`bcs dataaa.zip`): 238 images labeled as fat (55), moderate (129), or thin (54).

## Tech Stack

- **Backend**: Python, Flask, PyTorch, torchvision
- **Frontend**: HTML, CSS, JavaScript (vanilla)
- **Models**: ResNet-18 with transfer learning
