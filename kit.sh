#!/usr/bin/env bash
set -e
if [ "$1" = "setup" ]
then
    echo "🔌    REXR SETUP     🔌"
    echo "----------------------------------"
    echo "📝 Copying configuration files..."
    cp config/env.example ./.env
    echo "⛏ Installing dependencies..."
    yarn
    echo "✅ Setup complete. Happy coding ♥️."
fi
