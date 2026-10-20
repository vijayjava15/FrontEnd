# Chatbot Law

A React application for Chatbot Law. PDF document upload is one feature, available at `/upload`, which sends a PDF to the Spring DocumentController and displays success or failure. The root route shows a minimal entry page linking to document upload; chatbot functionality is not implemented yet.

## Run

Start your Spring backend, then run:

```bash
npm install
cp .env.example .env
npm run dev
```

Open the local URL printed by Vite, followed by `/upload`.

The frontend posts multipart form data to `/api/documents` with the field `file`. Optional `title` and `author` parameters are omitted. A successful response must contain the uploaded document's `id` and `fileName`. Spring ProblemDetail `detail` messages are displayed on failure, including upload size and missing-file errors. HTTP errors, unexpected responses, network failures, and requests exceeding 60 seconds show failure.

Vite proxies `/api` to `http://localhost:8080` during development. Change `API_PROXY_TARGET` in `.env` if the backend runs elsewhere. If the backend uses a context path, include it in `VITE_UPLOAD_API_URL`, and adjust the proxy prefix in `vite.config.js` to match. Restart Vite after changing configuration.

You may also set `VITE_UPLOAD_API_URL` to a full backend URL. In that case, the backend must allow the frontend origin through CORS. No authorization header is added because the supplied controller does not specify one. Do not put secret keys in Vite environment variables, which are public browser configuration.

## Production

```bash
npm run build
npm run preview
```

Deploy `dist/` and configure your host to serve `index.html` for `/upload`. Route `/api/*` to your Spring backend; the development proxy is not part of the production build. Alternatively, set a full API URL before building and configure backend CORS.

## Project structure

- `src/index.jsx`: React startup and global styles.
- `src/App.jsx`: React Router routes (`/`, `/upload`, and the 404 fallback).
- `src/layouts/AppLayout.jsx`: shared header, navigation, page outlet, and footer.
- `src/pages/`: separate page components.
- `src/services/documents.js`: upload API request and response handling.
- `src/styles/`: global and upload styles.

To add a page, create a component in `src/pages/`, import it in `src/App.jsx`, and add a `<Route path="your-path" element={<YourPage />} />` inside the layout route, before the `*` fallback. Add a `NavLink` in `AppLayout.jsx` if it belongs in the main navigation. Production hosting should serve `index.html` for frontend routes while routing `/api/*` to the backend.
