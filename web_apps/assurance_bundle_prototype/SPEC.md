# Assurance Bundle Prototype Spec

## Purpose
Build a credible, explainable, and auditable service that turns an AI task automation prototype into an assurance-first offering. The focus is on **evidence**: replay proof, rule receipts, and lineage mapping. This spec defines what the prototype must demonstrate within 90 days and what artifacts, data, and behaviors are required to sell proof of good behavior rather than just automation.

## Product framing
- **Bundle name (working):** Assurance Bundle
- **Value proposition:** “We provide reproducible evidence that automated work followed known rules and can be replayed deterministically.”
- **Three-artifact bundle:**
  1. **Replay Proof:** Rebuild an exact prior result on demand.
  2. **Rule Receipts:** Verifiable record of every rule checked and outcome.
  3. **Lineage Map:** A navigable map of what happened, when, why, and by whom/what.

## Core outcomes (90-day target)
1. **Replayable flow:** One critical flow can replay deterministically from stored inputs.
2. **Pre-flight rule checks:** Rule violations are flagged before results are delivered.
3. **Trace-to-insight loop:** Run logs highlight drift patterns and inform improvements.

## Non-goals (for this prototype)
- Broad multi-tenant support beyond a single demo environment.
- Full enterprise policy management UI.
- Advanced real-time analytics or predictive modeling.

## Personas and stakeholders
- **Buyer (Enterprise Risk/Compliance):** needs auditability, evidence, and replay.
- **Ops/Engineering:** needs reliability and deterministic retries.
- **Product/AI Builder:** needs fast iteration with clear guardrails.

## System overview
The prototype is an orchestration layer on top of existing repo-centric automation. It introduces a workflow engine for reliability, a policy gate for rules, and standardized events for lineage and process mining.

### Key components
- **Workflow engine (reliability):** retries, deterministic replay, step tracking.
- **Policy engine (rules):** executable must/never rules, pre-flight and post-flight checks.
- **Event log (lineage):** standardized schema for every step and decision.
- **Lineage map (UI view):** nodes + edges showing the run history.
- **Process mining layer (insights):** identifies common paths and drift.

## Prototype scope
### One critical flow (example)
- **Flow name:** “End-to-end task automation run.”
- **Input artifacts:** repository state, run configuration, and user approval.
- **Output artifacts:** final output bundle (e.g., reports, patches) and audit bundle.
- **Determinism requirement:** re-run with same inputs yields same output and same receipts.

### Failure recovery
- If a step fails, the system retries based on a deterministic policy and records each attempt.
- If retries fail, the system records an explicit failure state with recovery guidance.

## Three-artifact bundle
### 1) Replay Proof
**Definition:** An artifact that allows reconstruction of a past run using captured inputs and workflow decisions.

**Must include:**
- Input snapshot references (repo commit, config, parameters).
- Workflow step list with timestamps and environment metadata.
- Hash of output bundle and hash of replay bundle.

**Verification steps:**
- Re-run the workflow with stored inputs.
- Verify output hash matches original.
- Record a "replay success" receipt.

### 2) Rule Receipts
**Definition:** A record of each rule checked, its evaluation context, and outcome.

**Must include:**
- Rule ID, description, version, and evaluation time.
- Input context used to evaluate the rule.
- Result (pass/fail), rationale, and responsible policy set.

**Sample rules (prototype):**
- **Data boundary:** Only allowed repositories or datasets are touched.
- **Human approval:** Certain steps require explicit approval token.
- **Change size:** No output exceeding defined size threshold.

### 3) Lineage Map
**Definition:** A map of entities and actions in the run.

**Must include:**
- Nodes: run, step, artifact, rule check, actor, decision.
- Edges: caused_by, produced, depends_on, approved_by, evaluated_by.

**UI needs:**
- Timeline of steps with status.
- Expandable nodes for rule checks and their outputs.
- Filter to show anomalies and rule failures.

## Data model (minimum viable schema)
### Run
- id
- start_time / end_time
- initiator
- status
- input_snapshot_ref
- output_bundle_ref

### Step
- id
- run_id
- name
- status
- attempt
- start_time / end_time
- inputs
- outputs

### RuleReceipt
- id
- run_id
- step_id (optional)
- rule_id
- rule_version
- context_ref
- result
- rationale
- evaluated_at

### Artifact
- id
- run_id
- type (input/output/log)
- hash
- storage_ref

### LineageEdge
- from_id
- to_id
- relation_type
- timestamp

## Event log schema
Every component emits a consistent event record:
- event_id
- event_type (run_started, step_completed, rule_evaluated, replay_started, replay_completed)
- timestamp
- run_id
- step_id (optional)
- payload (structured key/value)

## Workflow engine requirements
- Deterministic replay from stored input snapshot.
- Step-level retries with exponential backoff.
- Clear run state transitions (queued → running → success/failure).

## Policy engine requirements
- Execute rule checks before and after key steps.
- Rules versioned and traceable in receipts.
- Fail fast on critical rules; warn on non-critical rules.

## Process mining requirements
- Compute top N path variants.
- Identify high-failure variants.
- Emit drift alerts when variant distribution shifts.

## Explainability and auditability
- Every decision must be tied to evidence (rule receipt, lineage edge).
- Users can trace an output back to inputs and rules.
- Replay proof has a stable, human-readable explanation.

## HTML front-end (prototype UI)
### Pages (single-page is acceptable)
1. **Overview**: value proposition + 3 artifacts.
2. **Replay Proof**: timeline + replay action.
3. **Rule Receipts**: list of rules with outcomes.
4. **Lineage Map**: simplified graph view.
5. **Process Variants**: bar chart for variants + drift alerts.

### Interaction requirements
- Click a run to see its receipts, replay status, and lineage.
- Expand a rule to see its evaluation context.
- Toggle “show anomalies” to highlight red paths.

## Risks & mitigations
- **Risk:** Replay fails due to missing inputs. **Mitigation:** require snapshot capture at run start.
- **Risk:** Rule definitions drift from actual behavior. **Mitigation:** versioned rules + testing.
- **Risk:** Overhead slows workflows. **Mitigation:** keep receipt capture minimal for prototype.

## Success metrics
- Replay success rate > 90% for selected flow.
- < 5% runs without receipts.
- Mean-time-to-recover reduced by at least 30%.

## Milestones
1. **Week 1-2:** Schema + event log standardization.
2. **Week 3-5:** Workflow engine integrated for one flow.
3. **Week 6-7:** Policy engine and rule receipts.
4. **Week 8-9:** Lineage map + process mining.
5. **Week 10-12:** Replay proof demo + metrics.

## Deliverables
- **Replay bundle** (inputs + steps + output hash).
- **Rule receipts bundle** (machine-readable log).
- **Lineage map view** (interactive HTML prototype).
- **Variant chart** (simple visual summary).

## Open questions
- Which workflow engine will be used first (Temporal vs. lightweight)?
- Which rule engine will be chosen (OPA vs. Cedar)?
- Where will artifacts and logs be stored (local vs. S3-like)?

