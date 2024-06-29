# MLOps Project with ZenML, MLflow, Cookiecutter, Docker, GitHub Actions, and DVC 🚀

This project demonstrates how to set up a Machine Learning Operations (MLOps) pipeline using ZenML for orchestration, MLflow for experiment tracking, Cookiecutter for project structure, Docker for containerization, GitHub/GitHub Actions for CI/CD, and DVC (Data Version Control) for managing data versions.

### Step-by-Step Guide 📝

#### 1. Install Required Tools

- **Python**: Ensure Python is installed on your system.
- **Cookiecutter**: Install Cookiecutter for generating project templates.
  ```bash
  pip install cookiecutter
  ```
- **ZenML**: Install ZenML for orchestration.
  ```bash
  pip install zenml
  ```
- **MLflow**: Install MLflow for experiment tracking.
  ```bash
  pip install mlflow
  ```
- **Docker**: Install Docker for containerization.
  - Follow instructions from [Docker](https://docs.docker.com/get-docker/) based on your operating system.

#### 2. Generate Project Structure with Cookiecutter

Use Cookiecutter to create a structured MLOps project:
```bash
cookiecutter https://github.com/cookiecutter-data-science
```

Follow the prompts to customize your project structure, ensuring it includes directories and files suitable for an MLOps workflow.

#### 3. Initialize ZenML and MLflow

Initialize ZenML in your project:
```bash
cd your_project_directory
zenml init
```

Initialize MLflow in your project:
```bash
mlflow init .mlflow
```

#### 4. Set Up Python Virtual Environment

Create a Python virtual environment:
```bash
python -m venv venv
```

Activate the virtual environment:
- On Windows:
  ```bash
  venv\Scripts\activate
  ```
- On macOS/Linux:
  ```bash
  source venv/bin/activate
  ```

#### 5. Integrate Docker for Containerization

Create a Dockerfile in your project directory (`Dockerfile`) for containerizing your application. Here’s a basic example:
```Dockerfile
# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . .

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Make port 80 available to the world outside this container
EXPOSE 80

# Define environment variable
ENV NAME World

# Run app.py when the container launches
CMD ["python", "app.py"]
```

#### 6. Set Up GitHub Repository and Actions for CI/CD

- Create a new repository on GitHub.
- Push your local project to this repository:
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  git remote add origin <repository_url>
  git push -u origin main
  ```
- Set up GitHub Actions for CI/CD by creating a workflow file (`main.yml`) in `.github/workflows/` directory. Example:
  
  ```yaml
  name: CI/CD Pipeline

  on:
    push:
      branches:
        - main

  jobs:
    build:
      runs-on: ubuntu-latest

      steps:
        - name: Checkout repository
          uses: actions/checkout@v2

        - name: Set up Python
          uses: actions/setup-python@v2
          with:
            python-version: '3.x'

        - name: Install dependencies
          run: |
            python -m pip install --upgrade pip
            pip install -r requirements.txt

        - name: Run tests
          run: pytest

        - name: Build Docker image
          run: docker build -t myimage .

        - name: Push Docker image to registry
          run: |
            docker tag myimage:latest <registry_url>/myimage:latest
            docker push <registry_url>/myimage:latest
  ```

#### 7. Integrate DVC (Data Version Control)

Initialize DVC in your project for managing data versions:
```bash
dvc init
```

Follow DVC's documentation to set up data pipelines and manage datasets.
