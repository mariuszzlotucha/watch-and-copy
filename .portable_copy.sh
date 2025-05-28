#!/bin/bash

# === CONFIGURATION ===
OUTPUT_FILE="all_code_combined.txt"

# Delete old output file if it exists
rm -f "$OUTPUT_FILE"

echo "Collecting file contents (excluding tests and $OUTPUT_FILE)..."

# Find all files, excluding tests and the output file
find . -type f ! -path "*/test/*" ! -path "*/tests/*" ! -name "$OUTPUT_FILE" | while read -r file; do
    echo ">>> FILE: $file" >> "$OUTPUT_FILE"
    cat "$file" >> "$OUTPUT_FILE"
    echo -e "\n\n" >> "$OUTPUT_FILE"
done

echo "Done. All contents written to $OUTPUT_FILE"
