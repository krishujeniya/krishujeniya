#!/bin/bash
set -euo pipefail

read -r -p "Enter Source File 1: " a
read -r -p "Enter Target File 2: " b

if [[ ! -f "$a" ]]; then
    echo "Error: Source file '$a' does not exist." >&2
    exit 1
fi

if [[ -e "$b" ]]; then
    read -r -p "Warning: '$b' already exists. Overwrite? [y/N]: " confirm
    if [[ "$confirm" != [yY] && "$confirm" != [yY][eE][sS] ]]; then
        echo "Copy cancelled to prevent overwriting existing file."
        exit 0
    fi
fi

cp -- "$a" "$b"
echo "---------------------- File 1 ----------------"
cat -- "$a"
echo "---------------------- File 2 ----------------"
cat -- "$b"
