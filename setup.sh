#!/bin/bash
# Setup script for project-web-apps
# Installs Node.js dependencies if package.json is present.

set -euo pipefail

if [ ! -f package.json ]; then
  echo "package.json not found; nothing to install."
  exit 0
fi

if command -v npm >/dev/null 2>&1; then
  npm install
else
  echo "npm is not installed. Please install Node.js to proceed." >&2
  exit 1
fi
