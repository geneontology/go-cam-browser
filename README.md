# GO-CAM Browser

Static site for exploring GO-CAM models.

## Development

This project uses [Vite](https://vitejs.dev/) as the build tool and development server. To get started, clone the repository and install dependencies:

```bash
npm install
```

To start the development server, run:

```bash
npm run dev
```

This will start the server at `http://localhost:5173` by default. You can open this URL in your browser to view the application.

## Configuration

Basic configuration can be set in `src/config.tsx`. This file allows you to specify which fields of the indexed GO-CAM models to display by default, how to render them, which should be searchable, and which should be faceted.

## Data

The application is driven by a JSON file containing indexed GO-CAM models. Currently, the file is served as a static file from this project's `public` directory. For more information on how this file is generated see additional documentation [here](docs/data.md).

If the format of this file changes, be sure to update the `IndexedGoCam` type in `src/types.ts` and the field configurations in `src/config.tsx`.

