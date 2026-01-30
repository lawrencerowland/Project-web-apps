# Project-web-apps

A collection of small web app examples.

## Setup

Run the `setup.sh` script to install Node.js dependencies before running tests:

```bash
./setup.sh
```

## Testing

After running the setup script, execute:

```bash
npm test
```

This will run a simple check that `index.html` exists.

## Graph Transforms scaffold

The living graph-transform app now includes a DAG/fibration scaffold with a roadmap, samples, and agent notes for diffing Graphviz transforms. The source files live in `docs/living-graph-transform-roadmap.md`, `samples/`, and `.ai/agent-notes.md`, with the UI embedded in `web_apps/living-graph-transform-system.html` under the “DAG / Fibration Scaffold” tab.
