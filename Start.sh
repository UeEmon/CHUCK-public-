#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"
docker compose up -d --build
printf '\nHF Propagation JP: http://localhost:%s\n' "${HF_PORT:-18082}"
