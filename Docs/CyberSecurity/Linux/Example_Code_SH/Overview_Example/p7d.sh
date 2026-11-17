#!/bin/bash
set -euo pipefail

read -r -p "Enter File Name: " a
read -r -p "Enter Search Pattern: " b

if [[ ! -f "$a" ]]; then
    echo "Error: File '$a' not found." >&2
    exit 1
fi

if grep -F -- "$b" "$a"; then
    echo "Found"
else
    echo "Pattern not found"
fi
