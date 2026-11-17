#!/bin/bash
set -euo pipefail

read -r -p "Enter File Name: " fn
if [[ -f "$fn" ]]; then
    cat -- "$fn"
else
    echo "Error: File '$fn' does not exist." >&2
    exit 1
fi
