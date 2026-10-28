# 05 — Test cases and expected results

Use a fresh dedicated `web_app` with six demo accounts seeded **today**. Run search cases before a successful john login, so `john` remains in the never-signed-in set. If you run a case on another day, `CURDATE()` and the registered-today result may differ. The list order is always registration date ascending, then userid ascending. All endpoints return at most 200 rows. Automated unit tests (`cd Backend`, `npm test`) use mocked DB calls only; manually verify the live DB using this sheet.

| # | UI section / input | Expected userids and explanation |
|---|---|---|
| 1 | Register user: `ava2026`, password `AvaDemo123!`, Ava Stone, salary `59000.00`, age `26` | Success message. Search userid `ava2026` returns one row with today's database date. Retry same userid → clear duplicate error (HTTP 409). This adds a seventh account and changes case 8/10 results, so perform this **after** base search screenshots or use a fresh database. |
| 2 | Sign in: `john` / `DemoPass123!` | Success, `john` now has last sign-in time. Run invalid password first and verify userid search still says `Never`; incorrect password returns a generic error. After success, john leaves case 8. |
| 3 | Name search: firstname `Ma`, lastname blank; then firstname blank, lastname `Chen` | Each returns `maya`. Both fields `Ma` + `Chen` also return `maya`. Blank/blank is rejected. A literal `%` or `_` is escaped, not treated as an arbitrary wildcard. |
| 4 | Find by userid: `john` | One row: John Carter, 65000.00, age 30, registration today − 7 days. `missinguser` returns zero rows. |
| 5 | Salary minimum `54000`, maximum `72000.50` | `john, maya, nina, zoe` in stable date/userid order. Both endpoints are included. Minimum greater than maximum is rejected. |
| 6 | Age minimum `24`, maximum `35` | `john, maya, nina, zoe`; endpoints included. Fractional or reversed age range rejected. |
| 7 | Registered after reference userid `john` | `nina, omar, liam, zoe`. `maya` is on john's same DATE and is excluded. Unknown reference gives 404 error. |
| 8 | Never signed in | Initially `john, maya, nina, liam, zoe`. `omar` has a seeded sign-in. After john login, expected `maya, nina, liam, zoe`. |
| 9 | Same day as reference userid `john` | `john, maya`. The reference user is **included**. Unknown reference gives 404. |
| 10 | Registered today | Initially `liam, zoe`; after case 1 registration it also includes `ava2026` (ordered by userid among today's users). Uses MySQL `CURDATE()` and DB timezone. |

## Injection, validation, and service failures

1. On Sign in, enter userid `' OR '1'='1` and any password. The field is invalid as a userid or authentication fails; no user is signed in and no `signintime` changes. A valid-looking nonexistent userid with wrong password also fails. SQL uses `?` bindings; bcrypt compares a stored hash only after lookup.
2. Try a name `%' OR '1'='1` in Name search. It is treated as literal text with escaped `%`; it cannot change the WHERE clause. Result is empty unless that text is in a stored name.
3. Register a duplicate `john`, missing first name, salary `-1`, salary `12.345`, age `121`, and age `25.5`; each should be rejected. Check no row changed.
4. Search salary `max < min`, age `max < min`, and blank name filters. Each yields a readable validation error, not SQL or stack traces.
5. Stop MySQL while the API is running. Health should return `{"api":"ok","database":"unavailable"}` with HTTP 503; searches show a helpful service error. Restart MySQL and click the sidebar retry button.
6. Stop the API. The sidebar says it is offline and actions show a start-backend message. Restart it with `npm start`.
7. Inspect browser developer tools Network responses and result table: no `password_hash` anywhere in search or login responses. The sign-in response says no session was created.

## SQL review

Open root `sql.txt` and compare the bound templates with `Backend/src/services/userService.js` and `database/seed.js`. `registerday > ?` is strict DATE comparison; `registerday = ?` includes john; `signintime IS NULL` is used for never signed in; `CURDATE()` is used for today. If you need screenshots in phpMyAdmin, execute a **read-only** example such as `SELECT username, registerday FROM Users ORDER BY registerday, username;` in a demo DB; that screenshot query is illustrative and is not an application query.
