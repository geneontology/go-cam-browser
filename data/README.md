# GO-CAM Browser Data Generator

Python scripts for generating GO-CAM browser data from Minerva JSON files.

## Local Usage

### Prerequisites

* [uv](https://docs.astral.sh/uv/)

### Setup

From the `data` directory, install dependencies:

```bash
uv sync
```

### Running the Script

Run the data generation script with uv:

```bash
uv run main.py --help
```

#### Example: Download, index, and generate data.json

```bash
uv run main.py --download
```

This will download the latest GO-CAMs in Minerva format, convert them to LinkML format, and generate the `data.json` file. The Minerva files will be stored in the default `data/input/minerva` directory, and the output `data.json` file will be written to the default `data/output` directory.

#### Example: Generate data.json from existing Minerva files

```bash
uv run main.py
```

This assumes that the Minerva format files already exist in the default `data/input/minerva` directory. It will skip the downloading and indexing steps.

## Docker Usage

### Building the Docker Image

From the `data` directory:

```bash
docker build -t geneontology/go-cam-browser-data-generator .
```

### Running with Docker

The Docker image expects two bind mounts:

1. A directory containing Minerva JSON files (for `--minerva-directory`)
2. A directory where the output `data.json` file will be written (for `--output-directory`)

#### Example: Generate data.json from existing Minerva files

```bash
docker run --rm \
  -v /path/to/minerva/files:/data/minerva:ro \
  -v /path/to/output:/data/output \
  geneontology/go-cam-browser-data-generator \
  --minerva-directory /data/minerva \
  --output-directory /data/output
```

#### Example: Download, index, and generate data.json

```bash
docker run --rm \
  -v /path/to/minerva/files:/data/minerva \
  -v /path/to/output:/data/output \
  geneontology/go-cam-browser-data-generator \
  --download \
  --minerva-directory /data/minerva \
  --output-directory /data/output
```

#### View help

```bash
docker run --rm geneontology/go-cam-browser-data-generator --help
```
