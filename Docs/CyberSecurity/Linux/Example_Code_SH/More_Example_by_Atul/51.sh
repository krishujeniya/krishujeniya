#!/bin/bash
set -euo pipefail

read -r -p "Enter Filename: " file
if [[ ! -f "$file" ]]; then
    echo "Error: File '$file' not found." >&2
    exit 1
fi

character=$(wc -c < "$file")
word=$(wc -w < "$file")
line=$(wc -l < "$file")

echo "Total Characters in $file: $character"
echo "Total Words in $file: $word"
echo "Total Lines in $file: $line"
