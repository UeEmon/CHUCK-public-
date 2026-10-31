#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"
# CHUCK reads public data from the fetcher container with a shared token; create one on first start.
if ! grep -q '^HF_PUBLIC_DATA_TOKEN=.\{32,\}' .env 2>/dev/null; then
  printf 'HF_PUBLIC_DATA_TOKEN=%s\n' "$(od -An -tx1 -N24 /dev/urandom | tr -d ' \n')" >> .env
fi
docker compose up -d --build
printf '\nHF Propagation JP: http://localhost:%s\n' "${HF_PORT:-18082}"
