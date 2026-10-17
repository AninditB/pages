# Ship the "Book a call" removal to the live site

## Why it still shows
The removal is already done in code (commit `8eb543d`, plan `2026-10-15-archive-book-a-call.md`), but it never reached `main`, which is the only branch GitHub Pages deploys:

- `8eb543d Archive the Book a call page` sits on local `unify-reuse-css` and was **never pushed** (branch is "ahead 1").
- PR AninditB/pages#2 ("Unify and reuse CSS") was merged into `unified-ui-ux`, **not `main`**. So `main` is still at `51faf2f` and still contains `frontend/schedule.html`, `schedule.js`, `schedule.css` and both nav links.

Nothing in the code needs to change. The work is getting the existing commits onto `main`.

## Steps
1. **Sanity check locally** before shipping: `python -m http.server 8000`, open `/frontend/` and `/frontend/resume.html` at desktop and 375px. Confirm no "Book a call" in the header or mobile nav, and `/frontend/schedule.html` is 404. Run `node scripts/sync-shell.mjs --check`.
2. **Push the branch:** `git push origin unify-reuse-css`.
3. **Open a PR from `unify-reuse-css` into `main`** (base must be `main` this time). It carries both the CSS refactor (`12dabaa`) and the archive commit (`8eb543d`), 21 files.
4. **Merge the PR.** The `deploy-pages.yml` workflow runs on the push to `main`; wait for it to pass (it also runs the shell `--check`).
5. **Verify the live site** at `https://aninditb.github.io/`: no "Book a call" in either nav, `/schedule.html` returns 404. Hard-refresh, since Pages caches for ~10 minutes.
6. **Tidy up:** delete the stale `unified-ui-ux` and `unify-reuse-css` branches on GitHub once merged.

## Optional: protect `main`
GitHub's "your main branch is unprotected" banner means anyone with write access (including you by accident) can force-push over `main`, delete it, or merge without checks. A ruleset for `main` that blocks force pushes and deletion, and requires a PR, would also have stopped the PR #2 mistake from going unnoticed only if combined with the habit of checking the base branch. Set it under Settings → Rules → Rulesets → New branch ruleset → target `main` → enable "Restrict deletions", "Block force pushes", and optionally "Require a pull request before merging". Do this after step 4 so it doesn't block this merge if you merge without review.

## Out of scope
- No changes to `archive/schedule/`; it stays as the restore point.
