#! /usr/bin/env sh

set -euo pipefail

poetry run uvicorn plantgenie_heatmaps.main:app --host 0.0.0.0 --port 80
