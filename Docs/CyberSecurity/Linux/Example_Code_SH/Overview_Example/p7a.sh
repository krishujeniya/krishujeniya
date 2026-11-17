#!/bin/bash
set -euo pipefail

PRACTICE_DIR=$(mktemp -d -t practice_p7a_XXXXXX)
cd "$PRACTICE_DIR"
echo "Working in temporary practice sandbox: $PRACTICE_DIR"

echo "(i)"
read -r -p "Enter Directory Name: " fn
if [[ -z "$fn" ]]; then
    echo "Directory name cannot be empty." >&2
    exit 1
fi
mkdir -- "$fn"
echo "Directory created"
echo "List of Directory:"
ls -la
echo "----------------------------------"

echo "(ii)"
read -r -p "Rename Directory: " rename
if [[ -z "$rename" ]]; then
    echo "New directory name cannot be empty." >&2
    exit 1
fi
mv -- "$fn" "$rename"
echo "List of Directory:"
ls -la
echo "----------------------------------"

echo "(iii)"
read -r -p "Remove Directory: " rm_dir
if [[ -d "$rm_dir" ]]; then
    rmdir -- "$rm_dir"
    echo "Directory Removed"
else
    echo "Directory does not exist: $rm_dir" >&2
fi
echo "List of Directory:"
ls -la

cd - >/dev/null
rm -rf "$PRACTICE_DIR"
