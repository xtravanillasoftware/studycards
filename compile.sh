#!/bin/bash

# Directory containing JavaScript files
js_dir="./public"

# Check if the directory exists
if [ ! -d "$js_dir" ]; then
    echo "Error: Directory '$js_dir' not found."
    exit 1
fi

tsc
echo "TypeScript components compiled."

rm ./public/main.js

npm run transpile
echo "JavaScript files transpiled to public"

# Delete JavaScript files
echo "Deleting JavaScript files from $js_dir ..."
find "$js_dir" -type f -name '*.js' ! -name 'main.js' -delete

echo "JavaScript files deleted successfully."
