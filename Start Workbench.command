#!/bin/zsh
set -e
mfc_project_dir="$(cd -- "$(dirname -- "$0")" && pwd)"
cd -- "$mfc_project_dir"
if ! command -v npm >/dev/null 2>&1; then
  printf '%s\n' 'Node.js/npm is not available in this terminal. See README.md for setup.'
  read -r 'mfc_close?Press Return to close.'
  exit 1
fi
printf '%s\n' 'MFC workbench: http://127.0.0.1:5173' 'Keep this window open. Press Ctrl+C to stop.'
npm run dev -- --port 5173 --strictPort --open
