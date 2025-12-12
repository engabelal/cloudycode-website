#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./build.sh v2
#   ./build.sh 2025.12.12
#
# Builds and pushes:
#   engabelal/cloudycode-dev-preview:arm-<version>
#   engabelal/cloudycode-dev-preview:amd-<version>

VERSION="${1:-}"
if [[ -z "${VERSION}" ]]; then
  echo "ERROR. Provide version only. Example. ./build.sh v2"
  exit 1
fi

IMAGE="engabelal/cloudycode-dev-preview"
DOCKERFILE="docker/Dockerfile"
CONTEXT="."

# Ensure buildx is available
docker buildx version >/dev/null 2>&1 || { echo "ERROR. docker buildx not available."; exit 1; }

# Ensure a builder exists and is selected
if ! docker buildx inspect cloudycode-builder >/dev/null 2>&1; then
  docker buildx create --name cloudycode-builder --use >/dev/null
else
  docker buildx use cloudycode-builder >/dev/null
fi

docker buildx inspect --bootstrap >/dev/null

echo "Building and pushing ARM64. Tag ${IMAGE}:arm-${VERSION}"
docker buildx build \
  --platform linux/arm64 \
  -t "${IMAGE}:arm-${VERSION}" \
  -f "${DOCKERFILE}" \
  "${CONTEXT}" \
  --push

echo "Building and pushing AMD64. Tag ${IMAGE}:amd-${VERSION}"
docker buildx build \
  --platform linux/amd64 \
  -t "${IMAGE}:amd-${VERSION}" \
  -f "${DOCKERFILE}" \
  "${CONTEXT}" \
  --push

echo "Done."
