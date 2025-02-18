#!/bin/bash

# Create backup directory if it doesn't exist
BACKUP_DIR="/workspace/db-ready/backups"
mkdir -p "$BACKUP_DIR"

# Create timestamped backup file
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/react-client-openid_$TIMESTAMP.tar.gz"

# Create tar archive excluding node_modules, dist, and other build/cache directories
tar --exclude='node_modules' \
    --exclude='.git' \
    --exclude='dist' \
    --exclude='build' \
    --exclude='.cache' \
    --exclude='coverage' \
    --exclude='backup' \
    -czf "$BACKUP_FILE" \
    .

# Set permissions
chmod 644 "$BACKUP_FILE"

echo "Backup created successfully at: $BACKUP_FILE"
