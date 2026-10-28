# Userspace — User Management System
This is a edit for the git demo

A class project implementing all 10 required database functions with Apache-served vanilla HTML/CSS/JS, an Express API, and MySQL/MariaDB. `userid` means the `Users.username` primary key. The API validates credentials but does **not** establish a persistent authenticated session or protected account area.

## Start here

Read [docs/01-SETUP-AND-RUN.md](docs/01-SETUP-AND-RUN.md) for the full Windows/macOS XAMPP walkthrough. In short: place this **whole folder** in XAMPP `htdocs`, start Apache/MySQL, run `database/schema.sql` in phpMyAdmin, copy `Backend/.env.example` to `Backend/.env`, then:

```sh
cd Backend
npm install
npm start
```

Check <http://localhost:5050/api/health> for `{"api":"ok","database":"ok"}`. Open <http://localhost/user-management-project/Frontend/index.html>. To populate a **fresh dedicated demo database**, run `CONFIRM_DEMO_SEED=YES npm run seed` on macOS/Linux, or `$env:CONFIRM_DEMO_SEED="YES"; npm run seed` in PowerShell. Seed runs only when `DB_NAME=web_app` and no demo usernames already exist. It does not overwrite records.

## Features and endpoints

| # | Function | Endpoint |
|---|---|---|
| 1 | Register | `POST /api/users/register` |
| 2 | Verify credentials / successful sign-in time | `POST /api/auth/login` |
| 3 | First/last name literal partial match | `GET /api/users/search/names?firstname=...&lastname=...` |
| 4 | Exact userid | `GET /api/users/search/userid?userid=...` |
| 5 | Inclusive salary range | `GET /api/users/search/salary?min=...&max=...` |
| 6 | Inclusive age range | `GET /api/users/search/age?min=...&max=...` |
| 7 | After reference user | `GET /api/users/search/after?userid=john` |
| 8 | Never signed in | `GET /api/users/search/never` |
| 9 | Same day as reference | `GET /api/users/search/same-day?userid=john` |
| 10 | Today | `GET /api/users/search/today` |

All search responses are `{ "count": N, "users": [...] }`, ordered by `registerday ASC, username ASC`, capped at 200. The cap is visible in the UI; no pagination is provided. Password hashes are never in search responses. A failed login does not update `signintime`. `after` means **strictly later DATE**, so users registered on john's day are excluded. `same-day` includes john. `today` is MySQL `CURDATE()` in the database session timezone.

## Seed account guide

All six seed accounts use the **demo-only** password `DemoPass123!`. Relative dates are computed by MySQL `CURDATE()` when seeding. Once seeded, dates remain fixed; run the demo the same day for exact “today” expectations.

| userid | Name | Salary | Age | Registration | Initial sign-in |
|---|---|---:|---:|---|---|
| john | John Carter | 65000.00 | 30 | today − 7 days | Never |
| maya | Maya Chen | 72000.50 | 28 | today − 7 days | Never |
| nina | Nina Patel | 54000.00 | 24 | today − 3 days | Never |
| omar | Omar Reed | 88000.00 | 41 | yesterday | yesterday at 09:00 DB time |
| liam | Liam Brooks | 46000.25 | 22 | today | Never |
| zoe | Zoe Diaz | 61000.00 | 35 | today | Never |

For predictable video results, seed a fresh `web_app` and perform searches before signing in as john. After a successful john login, the “never signed in” list loses john. Rerunning the seed stops without changing sign-in times; to reset, use a separate fresh demo DB with explicit instructor/student consent, not a production database.

## Implementation notes

`Backend/src/config/db.js` creates a mysql2 promise pool; services hold parameterized SQL; controllers validate inputs; routes map endpoints; middleware returns sanitized errors. Registration uses bcryptjs cost 12 and `CURDATE()`. Search uses bound parameters, including escaped LIKE patterns. CORS allows localhost and 127.0.0.1 origins for Apache development. Do not deploy this demo as a public user directory; search endpoints are intentionally open for assignment demonstration.

## Guides

- [Setup and run](docs/01-SETUP-AND-RUN.md)
- [Two-person video script](docs/02-VIDEO-DEMO-SCRIPT.md)
- [GitHub partner workflow](docs/03-GITHUB-PARTNER-WORKFLOW.md)
- [Submission checklist](docs/04-SUBMISSION-CHECKLIST.md)
- [Test cases](docs/05-TEST-CASES.md)

## Tests

From `Backend`, run `npm test` (Node built-in test runner). These tests use mocked DB calls and cannot alter a real database. Live MySQL checks must be completed locally using the test guide. The SQL inventory is in root `sql.txt`; safe creation SQL is in `database/schema.sql`.
