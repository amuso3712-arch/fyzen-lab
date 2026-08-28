# Project tools

`qa/` contains one-off Playwright, audit, and patch utilities used during development verification. These files are not required by the production runtime and are kept outside the public client tree.

`notes/` contains investigation findings and manual QA notes. Runtime code should remain in `client/`, `server/`, `shared/`, and `drizzle/`.

Run QA scripts from the project root after checking their relative paths. Production verification is standardized in the root commands documented in `DEPLOYMENT.md`.
