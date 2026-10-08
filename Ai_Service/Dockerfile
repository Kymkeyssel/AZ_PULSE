FROM python:3.12-slim

WORKDIR /app

# Mise à jour de pip
RUN pip install --no-cache-dir --upgrade pip

# Copie des dépendances
COPY requirements.txt .

# Installation des dépendances
RUN pip install --no-cache-dir -r requirements.txt python-multipart

# Copie du code
COPY ./app /app/app

# Exposition du port
EXPOSE 8000

# Commande de lancement (avec uvicorn pour FastAPI)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
