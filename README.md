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

Google Analytics is enabled when `VITE_GOOGLE_TAG_ID` is set. The production env file sets the deployed tag ID; local development leaves it unset by default.

## Data

The application is driven by a search docs JSON file containing indexed GO-CAM models. The URL for that file is controlled by the [Vite environment variable](https://vite.dev/guide/env-and-mode) `VITE_SEARCH_DOCS_URL`.

Default values are committed in env files:

- `.env` is used for local development and points to the latest GO data release through (i.e. `https://current.geneontology.org`).
- `.env.production` is used for production builds and points to a specific dated GO release URL (i.e. `https://release.geneontology.org/YYYY-MM-DD`).

> [!IMPORTANT]
> After a new GO release is published, the minimum required change is to update the URL in `.env.production` to point to the new release.
>
> If the format of the search docs JSON file changed in the new GO release, the change to `.env.production` should be accompanied by corresponding application changes.

To develop against a local search docs file, put the file in the `public` directory and override the URL in `.env.local`. For example:

```bash
cp /path/to/go-cam-browser-search-docs.json public/local-search-docs.json
```

Then create `.env.local`:

```env
VITE_SEARCH_DOCS_URL=/local-search-docs.json
```

`.env.local` is ignored by git, so it can be used for local development without changing the default project configuration. Files in `public` are served from the site root by Vite, so `public/local-search-docs.json` is available at `/local-search-docs.json` when running `npm run dev`.

Run `npm run check:search-docs` to validate the production search docs URL against the app's Zod schema before deployment. This check defaults to Vite's `production` mode and also runs in the GitHub Pages deployment workflow. To validate another mode, pass it after `--`, for example `npm run check:search-docs -- --mode development`.

If the format of the search docs JSON file changes, be sure to update the Zod schema in `src/indexedGoCamSchema.ts` and the field configurations in `src/config.tsx`.
