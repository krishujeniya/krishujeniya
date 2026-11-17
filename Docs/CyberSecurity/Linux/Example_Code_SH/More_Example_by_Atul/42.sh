#!/bin/bash
set -euo pipefail

input_file="file1.txt"
if [[ ! -f "$input_file" ]]; then
    echo "Creating practice input file: $input_file"
    printf "Hello from Linux Practice File 1\n" > "$input_file"
fi

echo "Content of $input_file:"
cat -- "$input_file"
echo ""

output_file="copy.txt"
if [[ -e "$output_file" ]]; then
    read -r -p "Warning: '$output_file' exists. Overwrite? [y/N]: " confirm
    if [[ "$confirm" != [yY] && "$confirm" != [yY][eE][sS] ]]; then
        echo "Operation cancelled."
        exit 0
    fi
fi

echo "Copying $input_file to $output_file..."
cat -- "$input_file" > "$output_file"
echo "Content of copied file ($output_file):"
cat -- "$output_file"
