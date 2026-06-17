#!/bin/bash
# Mock manifest generator
VERSION=$1
CHANNEL=$2
cat <<EOF
{
  "releaseId": "$(uuidgen)",
  "version": "$VERSION",
  "channel": "$CHANNEL",
  "createdAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "commitSha": "$GITHUB_SHA"
}
EOF
