#!/bin/bash
set -euo pipefail

read -r -p "Enter Name: " file
if [[ -d "$file" ]]; then
    echo "It is a Directory. Contents of Directory are:"
    ls -la -- "$file"
elif [[ -f "$file" ]]; then
    echo "It is a File. Content of File is:"
    cat -- "$file"
else
    echo "Path not found: $file"
fi
