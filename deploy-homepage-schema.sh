#!/bin/bash

# Database schema deployment script for homepage tables
# This script should be run against your Supabase instance

# Set your variables here
SUPABASE_URL="your-supabase-url"
SUPABASE_KEY="your-supabase-service-key"

echo "Deploying homepage database schema..."

# Check if psql is installed
if ! command -v psql &> /dev/null
then
    echo "PostgreSQL client (psql) is not installed. Please install it first."
    exit 1
fi

# Extract connection details from Supabase URL
# Example URL: postgresql://postgres:password@db.yourproject.supabase.co:5432/postgres
DB_URI=$(echo $SUPABASE_URL | sed 's/postgresql:\/\///')
DB_USER=${DB_URI%%:*}
DB_PASSWORD=$(echo $DB_URI | sed 's/.*://' | sed 's/@.*//')
DB_HOST=$(echo $DB_URI | sed 's/.*@//' | sed 's/:.*//')
DB_PORT=$(echo $DB_URI | sed 's/.*://' | sed 's/\/.*//')
DB_NAME=$(echo $DB_URI | sed 's/.*\///')

# Deploy schema
psql "host=$DB_HOST port=$DB_PORT dbname=$DB_NAME user=$DB_USER password=$DB_PASSWORD" -f homepage-schema.sql

echo "Schema deployment complete!"
