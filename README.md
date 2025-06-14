# Project-web-apps

A collection of small web app examples.

## Setup

Install Node.js dependencies and build the browser bundles before serving the site:

```bash
npm install
npm run build
```

## Testing

After installing dependencies, execute:

```bash
npm test
```

This will run a simple check that `index.html` exists.

## Local Development

Once you have downloaded or bundled the required vendor files, you can serve the
`Project-web-apps` directory with a simple static file server:

```bash
python3 -m http.server
```

Navigate to `http://localhost:8000/index.html` in your browser to view the
examples. After the dependencies are bundled locally, internet access is no
longer required to use the site.
