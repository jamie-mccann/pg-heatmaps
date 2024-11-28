import os
from pathlib import Path

DATA_PATH = (
    Path(os.environ.get("DATA_PATH"))
    or Path(__file__).parent.parent / "example_data"
)
