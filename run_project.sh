#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd "$DIR"

echo "======================================================================"
echo "  MULTI-LEVEL BUDGET TRACKER ANALYTICS"
echo "  Data Visualization Lab Project — NIE Mysuru"
echo "======================================================================"
echo ""

if [ -f ".venv/bin/python" ]; then
    PYTHON_CMD=".venv/bin/python"
elif [ -f "venv/bin/python" ]; then
    PYTHON_CMD="venv/bin/python"
else
    PYTHON_CMD="python3"
fi

echo "Using Python: $($PYTHON_CMD --version) at $PYTHON_CMD"
echo "Launching Fullstack Application and Dashboard..."
echo "Open http://127.0.0.1:5000 in your browser."
echo ""
exec "$PYTHON_CMD" run_project.py

