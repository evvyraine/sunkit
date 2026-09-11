#!/usr/bin/env bash
#
# Publish to npm from CI. Used by .github/workflows/release.yml via the
# `changesets/action` `publish` input.
#
# Requires an npm token in one of:
#   - NODE_AUTH_TOKEN (set by actions/setup-node with registry-url)
#   - NPM_TOKEN      (repository secret)
#
# Without a token the release is skipped so the workflow stays green until the
# secret is configured. Prereleases are published under the `alpha` tag so they
# never move `latest`.
#
set -euo pipefail

if [[ -z "${NODE_AUTH_TOKEN:-}" && -z "${NPM_TOKEN:-}" ]]; then
  echo "No npm token configured (set NPM_TOKEN) — skipping publish."
  exit 0
fi

echo "Publishing with changesets (dist-tag: alpha)…"
pnpm changeset publish --tag alpha
