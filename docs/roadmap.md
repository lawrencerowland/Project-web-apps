# Graph Transforms Roadmap

**Goal.** Package three minimal, decisive transforms on directed acyclic graphs (DAGs) used in project control:
1) Dependency pruning (strip non-influential edges wrt chosen outputs).
2) Interface braiding (collapse/rewire cross-team handoffs as typed “interfaces”).
3) Variance‑aware critical path (CPM over durations with variance to surface probabilistic drivers).

**Why DAGs + fibrations?** DAG = tasks & precedence. Fibrations (intuitively: “structured projections”) let us view one graph over another (e.g., tasks over workstreams) and reason about interface morphisms.

**MVP path.**
- **M0:** Ship samples/ with input/expected .gv and a README badge that turns green when one example per transform passes.
- **M1:** Add a tiny CLI `gt` with `gt run <transform> <in.gv> > out.gv`.
- **M2:** Add Gephi presets + PNG renders for side‑by‑side diffs.
- **M3:** Optional: program slice for fibrations (object mapping: tasks → lanes; morphisms: interface edges), plus JSON schema for interface types.

**Acceptance (M0).** Each transform: one green example. README shows a “Tests: 3 passing” badge. `/.ai/agent-notes.md` explains how ChatGPT should diff graphs and propose tests.

---

# Living Graph Transform — Feature Fit & Spec (Graph-First Change Propagation)

## Current app features to preserve
- Interactive D3 rescheduler with rewrite rules and stepwise propagation (slip + ES/EF).
- Graph‑Transform Sandbox for testing rewrites locally.
- DAG / Fibration Scaffold roadmap content.
- Agent Scenario Explorer content.

## Suitability assessment (from the proposed feature list)

### Suitable to add (fits the app’s living-graph transform premise)
1. **Unified property‑graph model (product + process + org + cost).**  
   Works with the app’s “living graph” framing by extending node/edge typing and attributes without changing the rewrite engine concept.
2. **Change = rule (LHS → RHS + NAC/PAC) with receipt + lineage.**  
   A direct extension of the current rewrite log: capture match, transform, and computed impact as a structured receipt artifact.
3. **Typed local propagation (neighborhood‑bounded).**  
   Aligns with the existing propagation controls and makes “rules + adjacency” explicit.
4. **Dashboards for each change (delta subgraph, propagation trace, risk/float deltas).**  
   Pairs cleanly with the current log/panel UI while providing new readouts.
5. **Quick win: finish‑phase design change guardrails.**  
   The model already focuses on schedule perturbations and would benefit from narrowly scoped change rules.
6. **Quick win: cross‑tool sync demo (Revit ↔ Tekla via graph server).**  
   Suitable as a demo/adapter module, provided it is kept as a thin integration layer.

### Not suitable (or needs careful scope control)
1. **Full CPM network recalculation replacement.**  
   The app’s value is selective propagation; replacing it with full‑network CPM would undercut the premise.
2. **Heavyweight BIM/IFC ETL inside the browser.**  
   Best kept as a server‑side pipeline or a pre‑processing step; the web app should load already‑graphified data.
3. **Vendor‑specific sync logic baked into core rules.**  
   Keep integration in adapters to avoid locking the transform engine to a single tool’s semantics.

## Spec for adding the suitable features (non‑breaking plan)

### 1) Data model extension (backwards‑compatible)
**Goal:** Keep existing nodes/edges while introducing typed property‑graph entities.
- **Node types:** `product`, `process`, `org`, `cost`, `constraint`, `change`.
- **Edge types:** `depends_on`, `interfaces_with`, `assigned_to`, `incurs_cost`, `constrains`, `supersedes`.
- **Versioning:** add `version_id`, `timestamp`, `source_system`, `lineage` to all entities.
- **Compatibility:** existing graph nodes remain valid as `process` nodes by default.

**Acceptance:** Current rescheduler view renders with no migration required; new types render with distinct badges/colors but do not change existing logic.

### 2) Change‑as‑rule representation
**Goal:** Encode change as a small rewrite rule with receipts.
- **Rule schema:** `id`, `author`, `LHS`, `RHS`, `NAC`, `PAC`, `intent`, `scope_tags`.
- **Receipt schema:** `rule_id`, `matched_nodes`, `matched_edges`, `touched_nodes`, `touched_edges`, `calc_deltas`, `trace_edges`, `signature`.
- **Signature:** lightweight hash over `(rule_id + matched + deltas)` for demo purposes.

**Acceptance:** Applying any rule yields a JSON receipt visible in the log panel and exportable.

### 3) Typed propagation engine
**Goal:** Recalculate only in typed neighborhoods; preserve existing scheduling logic.
- **Traversal control:** add a “propagation profile” selector (e.g., `beam→connection→sequence→crew`).
- **Scope limits:** max hops and edge‑type whitelist to cap impact.
- **Outputs:** recompute only for affected subgraphs (ES/EF and cost/float deltas).

**Acceptance:** Applying the same change under two profiles yields different scopes in the trace panel.

### 4) UI dashboards (three artifacts per change)
**Goal:** Add change‑specific visual artifacts without removing existing panels.
- **Local delta subgraph:** highlight LHS/RHS + touched nodes.
- **Propagation trace:** edge‑typed breadcrumbs with hop counts.
- **Risk/float delta table:** before/after float, cost exposure, and confidence range.

**Acceptance:** After a change, the UI shows all three artifacts; existing log remains intact.

### 5) Quick‑win demos
**Finish‑phase guardrails:** ship 2–3 rules that represent finish‑phase design changes, show tight propagation.  
**Cross‑tool sync demo:** provide a sample JSON import from a “Revit/Tekla” adapter with a single change rule and receipt.

**Acceptance:** Two demo presets load from a selector without breaking base examples.

## Implementation checklist (non‑breaking order)
1. **Extend schema + render badges** (no logic changes).  
2. **Add rule + receipt data structures** and surface receipts in UI.  
3. **Introduce typed propagation profiles** (default to current behavior).  
4. **Add dashboards** for delta subgraph/trace/table.  
5. **Ship demo presets** and short README snippet for each.
