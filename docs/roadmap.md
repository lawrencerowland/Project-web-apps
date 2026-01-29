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
