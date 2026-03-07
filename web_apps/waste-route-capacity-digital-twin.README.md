# Waste Route & Capacity Digital Twin

This self-contained HTML prototype models a decommissioning waste route as a finite-buffer flow line:

Characterization → Segregation → Size reduction → Packaging → Assay → Interim storage → Transport / disposal

## What it is for

It is an intuition tool, not a licensing-grade model. Its purpose is to make visible:

- which stage is actually governing throughput,
- when assay is only the *visible symptom* of a downstream transport/storage limit,
- how conservative classification inflates route load,
- how early segregation can substitute for brute-force capacity,
- how small outages create queue explosions in a finite-buffer system.

## Improved request this tool answers

Build a self-contained interactive **Waste Route & Capacity Digital Twin** for a nuclear decommissioning programme.  
Model the end-to-end waste pipeline as a finite-buffer queueing line with:
- characterization, segregation, size reduction, packaging, assay, interim storage, and transport/disposal,
- a rework loop from assay back to packaging,
- optional early segregation / clean release,
- optional conservative classification that reduces rework but inflates packaged volume,
- planned outages and stochastic stress testing.

Let the user vary daily inbound flow, stage capacities, storage buffer, policy choices, and disruption rates.  
Show queue trajectories, average utilization, bottleneck-attribution by pressure-days, lead time, no-place-to-go days, and stress-test percentiles.  
Add a recommendation panel that names the highest-leverage interventions rather than merely reporting status.

## Assumptions worth keeping in mind

- Units are generic “package-equivalent” units.
- FIFO queues are used throughout.
- Interim storage is finite and can block assay.
- Early segregation reduces downstream mass by the clean-release fraction.
- Conservative classification increases downstream packaged volume but lowers assay rework.
- The “dominant bottleneck” is a pressure index, not a metaphysical truth.

## How to use it

Open the HTML file in any modern browser.
Start with:
1. Baseline balanced
2. 10-day transport outage
3. Conservative classification
4. Late segregation
5. Add capacity & buffer

Watch how the bottleneck chart changes when you alter only one variable.
The main management lesson is usually: **do not optimise upstream work in ignorance of downstream routing.**

## UK RWI example button added

The updated HTML includes a one-click example case sourced, where possible, from the UK Radioactive Waste & Materials Inventory public database.

Example loaded:
- Waste stream: **2X26 — Disposal of LLW from SIXEP**
- Site: **Sellafield**
- Evidence-based values used:
  - stock at 1 April 2022 = **0 m³**
  - annual future arisings = **38.0 m³/year**
  - forecast span = **2022/23 to 2057/58**
  - total future arisings = **1,366.3 m³**
  - the stream is stated to meet **LLWR WAC** and to be consigned to **LLWR in the year of generation**

Mapping into the toy model:
- 1 model unit = **0.1 m³**
- 260 workdays = **1 model year**
- inbound = **1.46 units/day**

Still illustrative:
- stage capacities,
- buffer storage,
- outage assumptions,
- Monte Carlo variability settings.

These remain assumptions because the public inventory records waste volumes and routing metadata, not operational throughput capacities.
