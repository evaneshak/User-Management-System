# 03 — Real two-person GitHub collaboration

These commands assume the finished folder is your **own** project and Git has not yet been initialized here. Do not initialize inside the professor's repository. Choose a real GitHub URL at creation time; replace `YOUR-ACCOUNT`/`YOUR-REPO` below. Never commit `Backend/.env`, `node_modules`, `.git`, or logs. Check `.gitignore` first. The folder supplied by Codex had no Git repository or remote; no collaboration history has been performed for you.

## Owner, machine A

1. On GitHub, create a **new empty repository** named `user-management-project` under the owner's account. Do not add a GitHub README or `.gitignore` because local versions exist. In GitHub **Settings → Collaborators → Add people**, invite partner's actual account. Partner accepts the invitation.
2. In the project root terminal, inspect before initializing: `git status` (expected “not a git repository” only if still fresh), and `ls` on macOS/Linux or `Get-ChildItem` on PowerShell. Then initialize: `git init`; `git branch -M main`; `git status`; `git add README.md sql.txt .gitignore Frontend Backend database docs`; `git status`. Verify `Backend/.env` and `Backend/node_modules` do not appear staged. Commit: `git commit -m "Build user management project"`.
3. Add the URL you created: `git remote add origin https://github.com/YOUR-ACCOUNT/YOUR-REPO.git`; inspect with `git remote -v`; push: `git push -u origin main`. GitHub authentication may open a browser or require a credential manager. Do not paste a token into screenshots or docs.
4. Make a real owner contribution on a branch: `git switch -c feature/backend`; edit the README to add a true setup note discovered on your computer (for example your actual XAMPP htdocs path, without secrets); `git status`; `git add README.md`; `git commit -m "Document local backend setup"`; `git push -u origin feature/backend`. Open a PR from `feature/backend` to `main` on GitHub, review it, and merge. Only say this happened after it actually does.

## Partner, machine B

1. Accept the GitHub invitation. In the parent `htdocs` folder, run `git clone https://github.com/YOUR-ACCOUNT/YOUR-REPO.git`. If `user-management-project` already exists, clone to another empty location or move that old copy aside first; do not overwrite it. Enter it with `cd user-management-project`; inspect `git remote -v` and `git status`.
2. Fetch the owner's branch: `git fetch origin`; inspect `git branch -a`. **Fetch downloads commits and branch information but leaves working files unchanged.** Switch to main and integrate: `git switch main`; `git pull origin main`. **Pull fetches then integrates into the current branch.**
3. Create a separate branch: `git switch -c feature/frontend`. Make a genuine frontend or README change, such as a short README note describing a UI detail you actually verified. Then run `git status`; `git add README.md` (or the real changed frontend file); `git commit -m "Document verified search UI"`; `git push -u origin feature/frontend`.
4. Open a PR from `feature/frontend` to `main`. Owner reviews and merges. On both machines: `git switch main`; `git fetch origin`; `git pull origin main`; `git status`. Confirm clean status and that both contributions appear in GitHub commits/PRs. If Git reports a conflict, stop, discuss the affected file, edit the conflict markers together, test, `git add <resolved-file>`, and commit. Do not force push main.

## Commands to explain on camera

`git remote -v` identifies the GitHub remote; local repository is `.git` and files on your machine, remote repository is GitHub. `git clone URL` makes a new local copy. `git fetch origin` only downloads remote metadata/commits. `git pull origin main` integrates current remote main. `git status` shows changed/staged files. `git add FILE` stages selected files. `git commit -m "message"` records a local snapshot. `git push -u origin BRANCH` uploads that branch. All URL examples must be replaced by the real repository URL; do not claim pushes/merges before observing them.
