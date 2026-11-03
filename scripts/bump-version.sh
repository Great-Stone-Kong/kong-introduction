#!/usr/bin/env bash
# VERSION := YYYY.MM.DD.<unix_epoch_sec_hex> (local date · lowercase hex)
set -euo pipefail
cd "$(dirname "$0")/.."
v="$(date +%Y.%m.%d).$(printf '%x' "$(date +%s)")"
printf '%s\n' "$v" > VERSION
echo "$v"
