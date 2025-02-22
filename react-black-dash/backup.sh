#!/bin/bash

# Create backup directory if it doesn't exist
mkdir -p ../backup

# Get current timestamp
timestamp=$(date +%Y%m%d%H%M%S)

# Create tar.gz archive excluding node_modules
cd ..
tar --exclude='react-black-dash/node_modules' \
    --exclude='react-black-dash/.git' \
    -czf "backup/react-black-dash-${timestamp}.tar.gz" \
    react-black-dash/

echo "Backup created: backup/react-black-dash-${timestamp}.tar.gz"