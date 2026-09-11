#!/usr/bin/env bash
#
# Publish to npm from CI. Used by .github/workflows/release.yml via the
# `changesets/action` `publish` input.
#
# Why not `changeset publish`? Changesets runs `pnpm publish` in a pnpm repo,
# and pnpm does not implement npm Trusted Publishing (OIDC). The npm CLI does,
# so this script publishes with `npm publish` (which authenticates through OIDC
# when the job has `id-token: write`) and then creates the git tag and GitHub
# Release itself.
#
# Authentication:
#   - Preferred: npm Trusted Publishing (OIDC) — no secret required.
#   - Fallback: NPM_TOKEN / NODE_AUTH_TOKEN secret.
#
# Prereleases go out under the `alpha` dist-tag so they never move `latest`.
#
set -euo pipefail

has_oidc() {
  [[ -n "${ACTIONS_ID_TOKEN_REQUEST_URL:-}" && -n "${ACTIONS_ID_TOKEN_REQUEST_TOKEN:-}" ]]
}

has_token() {
  [[ -n "${NODE_AUTH_TOKEN:-}" || -n "${NPM_TOKEN:-}" ]]
}

if ! has_oidc && ! has_token; then
  echo "No npm auth available (no OIDC, no NPM_TOKEN) — skipping publish."
  exit 0
fi

PKG_NAME="$(node -p "require('./package.json').name")"
PKG_VERSION="$(node -p "require('./package.json').version")"
TAG="alpha"

if npm view "${PKG_NAME}@${PKG_VERSION}" version >/dev/null 2>&1; then
  echo "${PKG_NAME}@${PKG_VERSION} is already published — nothing to do."
  exit 0
fi

echo "Publishing ${PKG_NAME}@${PKG_VERSION} with npm (dist-tag: ${TAG})…"
# `prepublishOnly` builds dist/ before the tarball is packed.
npm publish --access public --tag "${TAG}"

VERSION_TAG="v${PKG_VERSION}"
echo "Creating git tag ${VERSION_TAG}…"
if git rev-parse -q --verify "refs/tags/${VERSION_TAG}" >/dev/null; then
  echo "Tag ${VERSION_TAG} already exists — skipping."
else
  git tag "${VERSION_TAG}"
  git push origin "${VERSION_TAG}"
fi

if command -v gh >/dev/null 2>&1; then
  echo "Creating GitHub Release ${VERSION_TAG}…"
  gh release create "${VERSION_TAG}" \
    --title "${VERSION_TAG}" \
    --generate-notes
fi
