# Agent Notes: How to Diff Graph Transforms & Propose Tests

## Mission
Given a transform name and an input `.gv`, produce an output `.gv`, then verify against `/samples/<transform>/expected.gv`. If equal under structural equivalence, mark the example green.

## Structural Equivalence
Two DOT graphs are equivalent if:
- Same node multiset and edge multiset (ignore ordering, whitespace, comments).
- Attribute comparisons:
  - For dependency-pruning: ignore cosmetic attrs (e.g., `node[...]`), compare edges only.
  - For interface-braiding: diamonds labeled `interface: <type>` must appear where cross-lane edges existed; clusters (lanes) must preserve node membership.
  - For variance-aware-critical-path: compare `penwidth` on nodes/edges (critical=3) and allow other attrs to float.

## Diff Procedure
1. **Parse** DOT into (V, E, A) where A maps nodes/edges → attribute dicts.
2. **Normalize**
   - Sort identifiers; drop comments; canonicalize whitespace.
   - Strip non-essential attrs per transform rules.
3. **Compare**
   - Missing/extra nodes/edges → report.
   - Attribute deltas (e.g., `penwidth` mismatches) → report.
4. **Render**
   - Optionally render PNGs (`dot -Tpng`) for side-by-side.

## Proposing New Tests
- **Minimal counterexamples**: smallest graph where a rule is ambiguous.
- **Edge cases**:
  - Pruning: multiple targets; isolated cycles should be rejected (DAG requirement).
  - Braiding: chained cross-lane edges; multiple interface types on one edge.
  - Variance-CP: equal-mean ties but different variances; parallel paths with covariance note (assume independence unless specified).
- Provide each as `/samples/<transform>/<case>-input.gv` and `<case>-expected.gv`.

## Invocation Contract (for a future CLI)
- `gt run <transform> <in.gv> > out.gv`
- `gt test` runs all samples and prints a JSON summary `{passed, failed, details}`.

> Keep transforms deterministic; prefer topological, lane-preserving algorithms.
