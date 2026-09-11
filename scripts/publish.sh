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

  PRERELEASE_FLAG=""
  if [[ "${PKG_VERSION}" == *-* ]]; then
    PRERELEASE_FLAG="--prerelease"
  fi

  # Prefer the matching CHANGELOG section as release notes.
  NOTES_FILE=""
  if [[ -f CHANGELOG.md ]]; then
    NOTES_FILE="$(mktemp)"
    awk -v ver="${PKG_VERSION}" '
      index($0, "## " ver) == 1 { capture = 1; next }
      capture && index($0, "## ") == 1 { exit }
      capture { print }
    ' CHANGELOG.md >"${NOTES_FILE}"
    if [[ ! -s "${NOTES_FILE}" ]]; then
      rm -f "${NOTES_FILE}"
      NOTES_FILE=""
    fi
  fi

  if [[ -n "${NOTES_FILE}" ]]; then
    gh release create "${VERSION_TAG}" \
      --title "${VERSION_TAG}" \
      ${PRERELEASE_FLAG} \
      --notes-file "${NOTES_FILE}"
    rm -f "${NOTES_FILE}"
  else
    gh release create "${VERSION_TAG}" \
      --title "${VERSION_TAG}" \
      ${PRERELEASE_FLAG} \
      --generate-notes
  fi
fi
