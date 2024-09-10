# Stage 1: Build the React frontend
FROM node:20.17.0-alpine AS frontend-builder

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY plantgenie_heatmaps/pg-react-frontend/package*.json ./
COPY plantgenie_heatmaps/pg-react-frontend/tsconfig.json ./
COPY plantgenie_heatmaps/pg-react-frontend/vite.config.ts ./

# Install dependencies and build the frontend
RUN yarn install --frozen-lockfile
COPY plantgenie_heatmaps/pg-react-frontend ./
RUN yarn build

# Stage 2: Set up the FastAPI backend with Poetry, copy over the react frontend
FROM python:3.12-slim-bullseye

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libffi-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy the FastAPI app code
COPY ./ /app/

# Install Poetry and project dependencies
RUN pip install poetry && \
    poetry config virtualenvs.create false && \
    poetry install --no-dev

RUN rm -rf /app/plantgenie_heatmaps/pg-react-frontend
RUN mkdir /app/plantgenie_heatmaps/pg-react-frontend
COPY --from=frontend-builder /app/dist /app/plantgenie_heatmaps/pg-react-frontend/dist

EXPOSE 80

CMD ["poetry", "run", "uvicorn", "plantgenie_heatmaps.main:app", "--host", "0.0.0.0", "--port", "80"]
