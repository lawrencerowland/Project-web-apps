#!/usr/bin/env bash
set -euo pipefail
inspect eval petri/audit \
  --model-role auditor=anthropic/claude-sonnet-4-20250514 \
  --model-role target=${TARGET_MODEL:-anthropic/claude-3-7-sonnet-20250219} \
  --model-role judge=anthropic/claude-opus-4-20250514 \
  --max-connections ${MAX_CONN:-10} \
  --max-retries ${MAX_RETRIES:-6} \
  --fail-on-error ${FAIL_ON_ERR:-3} \
  -T max_turns=${MAX_TURNS:-15} \
  -T special_instructions=@instructions/special_instructions_ltc.json \
  -T transcript_save_dir=./outputs
