#!/bin/bash
set -euo pipefail

read -r -p "Enter File Name: " a
if [[ ! -f "$a" ]]; then
    echo "Error: File '$a' not found." >&2
    exit 1
fi

echo "Content in $a:"
cat -- "$a"
echo "Number of Characters:"
wc -m < "$a"
echo "Number of Words:"
wc -w < "$a"
echo "Number of Lines:"
wc -l < "$a"
