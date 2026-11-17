

# MLOps Project with ZenML, MLflow, UV, Docker, GitHub Actions, and DVC 🚀

* [Algorithms](https://github.com/RaviPatel04/machine-learning/tree/main)

This project demonstrates a modern **MLOps pipeline setup** using:

* **ZenML** for orchestration
* **MLflow** for experiment tracking
* **UV** (from Astral) for ultra-fast Python environment management
* **Docker** for containerization
* **GitHub Actions** for CI/CD automation
* **DVC (Data Version Control)** for tracking and versioning datasets

No Cookiecutter templates here — the structure is built directly with UV and Python.

---

### Step-by-Step Guide 🧩

#### 1. Install Required Tools

Ensure you have these installed:

* **Python ≥ 3.9**
* **UV (Python environment manager)**

  ```bash
  pip install uv
  ```
* **Docker**
  [Install Docker](https://docs.docker.com/get-docker/)
* **Git**
  [Install Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

Then install core libraries:

```bash
uv pip install zenml mlflow dvc
```

---

#### 2. Create and Manage Environment with UV

Instead of virtualenv or venv, use UV to manage isolated Python environments — it’s faster and dependency-resolved natively.

Create a new environment:

```bash
uv venv .venv
```

Activate it:

* On macOS/Linux:

  ```bash
  source .venv/bin/activate
  ```
* On Windows:

  ```bash
  .venv\Scripts\activate
  ```

Install dependencies from a requirements file (if you have one):

```bash
uv pip install -r requirements.txt
```

Or install interactively as you go:

```bash
uv pip install zenml mlflow dvc scikit-learn pandas numpy
```

Freeze them:

```bash
uv pip freeze > requirements.txt
```

---

#### 3. Initialize ZenML and MLflow

Initialize your orchestration and experiment tracking tools:

```bash
zenml init
mlflow ui
```

ZenML will create a `.zen` folder, while MLflow’s UI will be available locally at [http://localhost:5000](http://localhost:5000).

---

#### 4. Data Versioning with DVC

Initialize DVC:

```bash
dvc init
```

Track datasets:

```bash
dvc add data/raw_dataset.csv
git add data/.gitignore data/raw_dataset.csv.dvc
git commit -m "Track dataset with DVC"
```

Push datasets to remote storage (e.g., Google Drive, S3, etc.):

```bash
dvc remote add -d storage <remote_url>
dvc push
```

---

#### 5. Containerize with Docker

Create a `.dockerignore` to avoid copying raw datasets, virtual environments, VCS directories, and secrets into image layers:

```dockerignore
.git
.gitignore
.env*
.venv
__pycache__
*.pyc
data/
*.dvc
tests/
```

Create a production `Dockerfile` with minimal surface and a non-root user:

```Dockerfile
FROM python:3.10-slim

WORKDIR /app

# Run as non-privileged application user
RUN groupadd -g 1000 appgroup && \
    useradd -u 1000 -g appgroup -s /bin/sh -m appuser

# Install dependencies in cached layer
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy only production runtime files
COPY src/ ./src/
COPY main.py .

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 8080

CMD ["python", "main.py"]
```

Build and run, binding explicitly to the loopback interface (`127.0.0.1`):

```bash
docker build -t mlops-pipeline:v1.0.0 .
docker run -d --rm -p 127.0.0.1:8080:8080 --name mlops-service mlops-pipeline:v1.0.0
```

---

#### 6. Automate with GitHub Actions (CI/CD)

Create `.github/workflows/main.yml` with pinned action versions, immutable image tagging, and least-privilege tokens:

```yaml
name: MLOps CI/CD Pipeline

on:
  push:
    branches: [ "main" ]

permissions:
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          persist-credentials: false

      - name: Set up Python
        uses: actions/setup-python@42375524e23c412d93fb67b49958b491fce71c38 # v5.4.0
        with:
          python-version: '3.10'

      - name: Install UV
        run: pip install uv==0.5.20

      - name: Install Dependencies
        run: uv pip install --system -r requirements.txt

      - name: Run Tests
        run: pytest

      - name: Build Docker Image with Commit SHA Tag
        run: |
          IMAGE_TAG="${GITHUB_SHA::7}"
          docker build -t <registry_url>/mlops-pipeline:"$IMAGE_TAG" .
          docker push <registry_url>/mlops-pipeline:"$IMAGE_TAG"
```

This workflow automates your CI/CD steps: testing, building, and pushing Docker images.

---

#### 7. Optional: Integrate MLflow + ZenML + DVC in Your Pipeline

You can create a ZenML pipeline like `pipelines/training_pipeline.py`:

```python
from zenml.pipelines import pipeline
from zenml.steps import step

@step
def load_data():
    import pandas as pd
    return pd.read_csv("data/raw_dataset.csv")

@step
def train_model(data):
    from sklearn.linear_model import LinearRegression
    model = LinearRegression()
    X, y = data.iloc[:, :-1], data.iloc[:, -1]
    model.fit(X, y)
    return model

@pipeline
def training_pipeline(load_data, train_model):
    data = load_data()
    train_model(data)

if __name__ == "__main__":
    training_pipeline(load_data=load_data(), train_model=train_model()).run()
```

Run and track experiments through MLflow + ZenML.

---

#### 8. Version Control Everything

Commit and push your project:

```bash
git init
git add .
git commit -m "Initial MLOps project setup with UV"
git branch -M main
git remote add origin <repo_url>
git push -u origin main
```
