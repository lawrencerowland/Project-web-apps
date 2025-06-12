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

## Local Development

Once you have downloaded or bundled the required vendor files, you can serve the
`Project-web-apps` directory with a simple static file server:

```bash
python3 -m http.server
```

Navigate to `http://localhost:8000/index.html` in your browser to view the
examples. After the dependencies are bundled locally, internet access is no
longer required to use the site.
