# GitHub Mirror Setup

## Goal

Mirror the quartz repo from Gitea to GitHub, but exclude the `content/` directory so private notes are never visible on the public GitHub mirror.

The Gitea instance is private and holds the full repo including content. GitHub (`github.com/IkeLyons/quartz`) is public and should only show the site code.

## Approach

Gitea's built-in push mirror can't filter paths, so it was replaced with a Gitea Actions workflow that runs `git filter-repo` to strip `content/` from the full commit history before pushing to GitHub. Because `filter-repo` is deterministic, commits GitHub already has produce the same SHA and aren't re-uploaded — only new commits go over the wire on each run.

## One-time Setup Steps

### 1. Generate SSH key pair

```bash
ssh-keygen -t ed25519 -C "gitea-github-mirror" -f ~/.ssh/github_mirror_key -N ""
```

### 2. Add public key to GitHub

Repo → **Settings → Deploy keys → Add deploy key**
- Title: `Gitea Mirror`
- Key: contents of `~/.ssh/github_mirror_key.pub`
- Allow write access: yes

### 3. Add private key to Gitea as a secret

Repo → **Settings → Secrets → Add secret**
- Name: `MIRROR_KEY`
- Value: contents of `~/.ssh/github_mirror_key`

### 4. Disable the Gitea built-in push mirror

Repo → **Settings → Mirror** — remove the GitHub push mirror entry so it doesn't conflict with the workflow.

### 5. Create the workflow

See `.gitea/workflows/mirror-github.yml`.

## Notes

- The `content/` directory is stripped from the entire history on first run — old content commits are removed from GitHub retroactively.
- The private key is stored only in Gitea secrets and never committed to the repo.
- If you need to rotate the key, generate a new pair, update the GitHub deploy key, and update the Gitea secret.
