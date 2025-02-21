#!/bin/bash

# Create backup directory if it doesn't exist
mkdir -p ../backup

# Get current timestamp
timestamp=$(date +%Y%m%d%H%M%S)

# Create tar.gz archive excluding node_modules
cd ..
tar --exclude='myprj/node_modules' \
    --exclude='myprj/.git' \
    -czf "backup/myprj-${timestamp}.tar.gz" \
    myprj/

echo "Backup created: backup/myprj-${timestamp}.tar.gz"