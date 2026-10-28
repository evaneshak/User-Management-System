# 02 — Two-person video demo script (target: 12–18 minutes)

Use a fresh dedicated demo database and record on the day you seed. Seed first, then follow the order below so the expected result sets stay predictable. Partner A is the repo owner/backend speaker; Partner B is the frontend/queries speaker. Both should practice transitions. Every click refers to the actual Userspace UI. Keep the API terminal open. Use a real GitHub repo and real commits; do not pretend the prepared project already has collaboration history.

## Before recording

- Confirm XAMPP Apache/MySQL running, `npm start` active, and health JSON says API/database `ok`.
- Confirm six seed accounts exist and `john` has userid `john`; seed's demo-only password is `DemoPass123!`.
- Open tabs: app URL, phpMyAdmin `web_app.Users`, your real GitHub repo/PR, and VS Code with `sql.txt` and source tree.
- Confirm both partner accounts accepted collaboration invite, GitHub auth works, microphones/screen-recording permission works, and recording software captures both voices and the whole browser/terminal. Verify video upload/public or unlisted link access before Canvas submission.
- If earlier practice changed john's `signintime`, do not claim the initial never-signed-in result. Use a fresh **separate** demo database for the recording, or state the changed result honestly. Never wipe a shared DB.

## Scene 1 — Intro and stack (1 minute)

**Screen/operator:** A opens the app header and sidebar, then health endpoint tab. **A says:** “This is Userspace, our own User Management System. Apache serves vanilla HTML, CSS, and JavaScript; Express on port 5050 handles the API; MySQL stores users. `userid` is the username primary key.” **B says:** “The numbered UI follows the professor's ten functions. Searches show exactly which records match, with stable date and userid ordering.” Expected screen: green API/database status, search mode 03 selected.

## Scene 2 — Schema and SQL (1.5 minutes)

**Screen/operator:** A opens phpMyAdmin → `web_app` → `Users` → **Structure**, then VS Code `database/schema.sql` and root `sql.txt`. **A says:** “`username` is unique; `password_hash` holds bcrypt hashes, salary is DECIMAL, registration is DATE, and a never-signed-in user has NULL `signintime`.” **B says:** “`sql.txt` lists the actual application templates; user values go into placeholders, including login, ranges, and reference userid.” Expected: six demo rows if Browse is opened; no plaintext passwords in the table.

## Scene 3 — Git collaboration (2–3 minutes)

**Screen/operator:** A shows real GitHub repository URL and terminal in owner clone. A runs `git remote -v`, `git status`, `git branch -a`, and, if a genuine owner edit is ready, `git add README.md`, `git commit -m "Document local backend setup"`, `git push -u origin feature/backend`. **A says:** “This folder and its `.git` history are local. `origin` points to our GitHub remote. `add` stages a real change, `commit` records it locally, and `push` publishes the branch.” **Screen/operator:** B shows partner clone and runs `git fetch origin`, `git branch -a`, `git pull origin main`, `git status`. B shows a real README/frontend note change, then `git add README.md`, `git commit -m "Document verified search UI"`, `git push -u origin feature/frontend`. **B says:** “I cloned the owner's repository after accepting the invite. Fetch downloaded remote branch information without changing files. Pull fetched and integrated main. I pushed my own branch and opened a PR.” A shows actual PR review/merge page if completed. Expected: genuine terminal output and actual branches; if a PR is not merged, say so. Follow full steps in guide 03 before recording, and avoid duplicate demo commits if they already happened.

## Scene 4 — Search 03–10 in rubric order (5–7 minutes)

**Screen/operator:** B returns to **Search users**. For each mode, click its numbered button on the left, enter the values, click **Run query**, point to the result count/table, and use the line below. Search before creating/login so outputs match the fresh six-account seed.

| # | Exact click and input | Expected result | Speaker line |
|---|---|---|---|
| 03 | **03 Name search** → First name `Ma`, last blank → **Run query**; repeat last name `Chen`, first blank | `maya` each time | **B:** “Either optional filter works. Partial text is safely bound and wildcard characters typed by users are escaped.” |
| 04 | **04 Find by userid** → `john` → **Run query** | One row: john / John Carter | **A:** “John is the actual userid, not merely the first name.” |
| 05 | **05 Salary range** → min `54000`, max `72000.50` → **Run query** | john, maya, nina, zoe | **B:** “BETWEEN includes both salary endpoints; DECIMAL preserves cents.” |
| 06 | **06 Age range** → min `24`, max `35` → **Run query** | john, maya, nina, zoe | **A:** “These inclusive integer endpoints select ages 24 through 35.” |
| 07 | **07 Registered after** → reference `john` → **Run query** | nina, omar, liam, zoe | **B:** “After means `registerday > john's DATE`. Maya registered on the same day, so she is excluded.” |
| 08 | **08 Never signed in** → **Run query** | john, maya, nina, liam, zoe | **A:** “The SQL tests `signintime IS NULL`; Omar has a seeded sign-in and is absent.” |
| 09 | **09 Same registration day** → reference `john` → **Run query** | john, maya | **B:** “The reference user is included because both dates equal john's date.” |
| 10 | **10 Registered today** → **Run query** | liam, zoe | **A:** “MySQL `CURDATE()` decides today using the database server's timezone.” |

The results are sorted by registration DATE then userid, so salary/age ranges appear as john, maya, nina, zoe despite their values. If the DB clock crosses midnight after seeding, explain and reseed a fresh demo database before recording.

## Scene 5 — Registration 01 and sign-in 02 (2–3 minutes)

**Screen/operator:** B clicks **Register user**. Enter userid `ava2026`, password `AvaDemo123!`, first `Ava`, last `Stone`, salary `59000.00`, age `26`; click **Create user**. Expected: “Created ava2026.” **B says:** “All fields are validated; userid is unique and the database records today automatically. The backend stores a bcrypt hash.” A clicks **Search users → 04 Find by userid**, enters `ava2026`, runs query and points to today's date.

**Screen/operator:** A clicks **Sign in**. First use userid `' OR '1'='1` and password `wrongpass`; click **Verify credentials**. Expected: validation/authentication error, no login. **A says:** “This nonharmful injection attempt cannot alter our query; the backend uses bound values and compares bcrypt hashes. A failed attempt never changes sign-in time.” Then enter `john` / `wrongpass`; expect “Invalid userid or password.” To prove no update, go to **04 Find by userid** for `john` and show **Never**. Return to **Sign in**, enter `john` / `DemoPass123!`, click **Verify credentials**. Expected: success text explicitly says **no session**. **B says:** “Only a successful credential check updates `signintime`. This demo does not create a persistent authenticated session.” Re-run **04** for `john` and point to the new time; optional **08** now excludes john. Do not call the success notice a session.

## Scene 6 — Source and wrap-up (1 minute)

**Screen/operator:** B shows VS Code tree: `Frontend`, `Backend/src/routes`, `controllers`, `services`, `middleware`, `database`, `docs`, tests, root `sql.txt`; A briefly opens `Backend/src/services/userService.js`. **B says:** “The UI sends API requests; controllers validate; the service runs parameterized SQL; database dates and NULLs drive the results.” **A says:** “We submit the video URL in Canvas, `sql.txt` separately, and a ZIP containing source and README, excluding `.env`, `node_modules`, and `.git`.” End by showing the real GitHub PRs if both have merged.
