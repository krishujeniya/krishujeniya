#!/bin/bash
set -euo pipefail

read -r -p "Enter File Name: " a
if [[ -z "$a" ]]; then
    echo "Error: File name cannot be empty." >&2
    exit 1
fi

touch -- "$a"
echo "File Created" 
echo "-----------------------------------"
echo "File Content" 
printf "My name is AI\nline 1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9\nline10\n" > "$a"
cat -- "$a"
