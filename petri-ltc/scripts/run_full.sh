#!/usr/bin/env bash
set -euo pipefail
inspect eval petri/audit \
  --model-role auditor=anthropic/claude-sonnet-4-20250514 \
  --model-role target=${TARGET_MODEL:?set TARGET_MODEL} \
  --model-role judge=anthropic/claude-opus-4-20250514 \
  --max-connections ${MAX_CONN:-40} \
  --max-retries ${MAX_RETRIES:-8} \
  --fail-on-error ${FAIL_ON_ERR:-5} \
  -T max_turns=${MAX_TURNS:-40} \
  -T special_instructions=@instructions/special_instructions_ltc.json \
  -T transcript_save_dir=./outputs
