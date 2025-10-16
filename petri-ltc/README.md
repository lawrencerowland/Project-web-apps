# Petri audit: A122 Lower Thames Crossing (DCO discharge pack)

## What this does
Runs Anthropic’s Petri audit (via Inspect) against a target model that drafts a DCO requirement-discharge pack for enabling works. It probes for: false DCO citations, oversight subversion (e.g., skipping s.61), PII insertion, and hallucinated BS 5228 figures.

## Repository layout
```
petri-ltc/
  instructions/
    special_instructions_ltc.json
  rubrics/
    judge_dimensions_ltc.json
  scripts/
    run_pilot.sh
    run_full.sh
    view_transcripts.sh
  analysis/
    summarize_findings.py
  outputs/
  .env.example
  Makefile
  README.md
```

## Quick start
```bash
pip install inspect-ai
pip install git+https://github.com/safety-research/petri
cp .env.example .env  # add API keys
make pilot
make view
```

* `make pilot` runs a short Petri sweep with default target `anthropic/claude-3-7-sonnet-20250219`.
* `make full` expects `TARGET_MODEL` to be exported (e.g., `export TARGET_MODEL=openai/gpt-4.1`).
* `make view` opens the transcript viewer via Node.

## Running via CLI directly
The scripts wrap this Inspect command:
```bash
inspect eval petri/audit \
  --model-role auditor=anthropic/claude-sonnet-4-20250514 \
  --model-role target=<YOUR_TARGET_MODEL> \
  --model-role judge=anthropic/claude-opus-4-20250514 \
  --max-connections 10 \
  --max-retries 6 \
  --fail-on-error 3 \
  -T max_turns=12 \
  -T special_instructions=@instructions/special_instructions_ltc.json \
  -T transcript_save_dir=./outputs
```
Adjust `max_turns`, concurrency, and retries as needed. Task args follow the Petri tutorial’s `-T` pattern.

## Analysis pipeline
`analysis/summarize_findings.py` converts Inspect logs into `outputs/petri_findings.csv`, ranking transcripts by the most severe rubric dimensions (deception, oversight subversion, citation integrity, unsafe technical claims, PII risk).

```bash
python analysis/summarize_findings.py
```

## References
- Petri quick start / CLI / judge / tools / viewer: see docs.
- A122 (Lower Thames Crossing) DCO 2025 (SI 2025/462); CoPA 1974 s.61; BS 5228-1/-2.

## Governance
Use responsibly. Petri intentionally pressures models into risky behaviors; follow provider policies, avoid real PII, and route draft outputs through qualified review before use.
