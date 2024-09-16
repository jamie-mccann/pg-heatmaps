# Stage 1: Build the React frontend
FROM node:20.17.0-alpine AS frontend-builder

WORKDIR /app

# Copy only package files to leverage Docker cache
COPY plantgenie_heatmaps/pg-react-frontend/package*.json ./
COPY plantgenie_heatmaps/pg-react-frontend/tsconfig.json ./
COPY plantgenie_heatmaps/pg-react-frontend/vite.config.ts ./

# Install dependencies and build the frontend
RUN yarn install --frozen-lockfile
COPY plantgenie_heatmaps/pg-react-frontend ./
RUN yarn build

# Stage 2: Set up the FastAPI backend with Poetry
FROM python:3.12-slim-bullseye

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libffi-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY pyproject.toml poetry.lock README.md ./

RUN pip install poetry && \
    poetry config virtualenvs.create false && \
    poetry install --only main --no-root --no-directory

COPY plantgenie_heatmaps/ /app/plantgenie_heatmaps/
RUN poetry install --only-root

# remove unnecessary react frontend folder (built in frontend-builder)
RUN rm -rf /app/plantgenie_heatmaps/pg-react-frontend/{*,.*}
# Copy over React build
COPY --from=frontend-builder /app/dist /app/plantgenie_heatmaps/pg-react-frontend/dist

EXPOSE 80

CMD ["poetry", "run", "uvicorn", "plantgenie_heatmaps.main:app", "--host", "0.0.0.0", "--port", "80"]
