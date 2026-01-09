#!/bin/bash
set -e

if [ -z "$VICTORZHOU_PROD_2025" ] || [ -z "$VICTORZHOU_SSH_KEY" ]; then
  echo "Error: Required env vars not set."
  echo "  VICTORZHOU_PROD_2025 - server address"
  echo "  VICTORZHOU_SSH_KEY   - path to SSH key"
  exit 1
fi

SERVER="vzhou@$VICTORZHOU_PROD_2025"
REMOTE_DIR="/home/vzhou/victorzhou.com"

# Build locally
npm run build

# Sync public/ to public-live/ on server
rsync -avz --delete \
  -e "ssh -i $VICTORZHOU_SSH_KEY" \
  public/ \
  "$SERVER:$REMOTE_DIR/public-live/"

# Sync server/ folder``
rsync -avz --delete \
  -e "ssh -i $VICTORZHOU_SSH_KEY" \
  server/ \
  "$SERVER:$REMOTE_DIR/server/"

# Sync package files for server dependencies
rsync -avz \
  -e "ssh -i $VICTORZHOU_SSH_KEY" \
  package.json package-lock.json \
  "$SERVER:$REMOTE_DIR/"

# Install express
ssh -i "$VICTORZHOU_SSH_KEY" "$SERVER" \
  "source ~/.nvm/nvm.sh && cd $REMOTE_DIR && npm install express"

echo ""
echo "---"
echo "Deploy complete. Run server restart manually if needed."
