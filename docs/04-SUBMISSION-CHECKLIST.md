# 04 — Submission checklist

The professor asks for **three deliverables**:

1. **Video URL in Canvas.** Upload the recording to a service allowed by your course; verify the link while signed out or in a private window. Use public or unlisted access as required. Paste the full working URL into Canvas. The video should show all 10 functions, SQL results, and the two-person Git workflow.
2. **`sql.txt`.** Upload the root `sql.txt` separately. It contains the schema and the SQL templates actually used, with `?` placeholders for bound values.
3. **ZIP of all source code and README.** Include the whole project structure: `README.md`, `sql.txt`, `.gitignore`, `Frontend`, `Backend` source, `Backend/package.json`, `Backend/package-lock.json`, `Backend/.env.example`, `Backend/tests`, `database`, and all five `docs` files. Exclude `Backend/.env`, every `node_modules`, `.git`, local logs, and `coverage`.

## Safe ZIP steps

**Windows File Explorer:** Before zipping, in the project folder turn on **View → Show → Hidden items**. Delete or temporarily move `Backend/node_modules`; confirm `Backend/.env` is not selected. Select only `README.md`, `sql.txt`, `.gitignore`, `Frontend`, `Backend`, `database`, and `docs`; right-click → **Compress to ZIP file** (or **Send to → Compressed (zipped) folder**). Open the ZIP and verify it contains `.env.example` and `package-lock.json`, and does not contain `.env` or `node_modules`. If using Git, do not select `.git`.

**macOS Finder:** Press **Command+Shift+.** to show hidden files. Temporarily move `Backend/node_modules` outside the project or build a clean copy. Select the same seven items named above, then right-click → **Compress 7 Items**. Rename the archive `user-management-project.zip`. Open it and inspect the file list. Ensure `.git`, `.env`, and logs are absent. Return any temporarily moved `node_modules` afterward if desired; `npm install` can recreate it.

**Cross-platform command option from project root with Git installed:** `git archive --format=zip --output=../user-management-project.zip HEAD` only packages tracked committed files. Use it only after verifying the final commit contains all expected work; it does not include uncommitted changes.

## Final sanity check

Extract the ZIP to a new folder. Verify `Backend/.env.example`, lockfile, `database/schema.sql`, `database/seed.js`, `Frontend/index.html`, `sql.txt`, and docs are present. Follow the extracted README/Setup guide on a demo database. Confirm the health endpoint and all 10 cases. Upload `sql.txt` separately even though it is also inside the ZIP. Check Canvas shows the video URL and both file uploads before submitting.
