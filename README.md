# Quartz v5

> “[One] who works with the door open gets all kinds of interruptions, but [they] also occasionally gets clues as to what the world is and what might be important.” — Richard Hamming

Quartz is a set of tools that helps you publish your [digital garden](https://jzhao.xyz/posts/networked-thought) and notes as a website for free.

🔗 Read the documentation and get started: https://quartz.jzhao.xyz/

[Join the Discord Community](https://discord.gg/cRFFHYye7t)

## Sponsors

<p align="center">
  <a href="https://github.com/sponsors/jackyzha0">
    <img src="https://cdn.jsdelivr.net/gh/jackyzha0/jackyzha0/sponsorkit/sponsors.svg" />
  </a>
</p>

---

## Site-specific notes

This repo is customized for [blog.ikelyons.com](https://blog.ikelyons.com). Notes below cover local changes that aren't part of upstream Quartz.

### Development environment

Node is only available inside the Nix dev shell. Always enter it first:

```sh
nix develop
```

### npm scripts

| Command | What it does |
|---|---|
| `npm run build` | Build the site to `public/` |
| `npm run dev` | Start the dev server on port 8181 with hot reload |

Both commands automatically rebuild any local plugins before running.

### Local plugins

Community plugins live in `.quartz/plugins/` and are managed by Quartz — don't edit them directly. For customizations that would be overwritten by plugin updates, create a local plugin instead.

Local plugins live in `plugins/<name>/` at the repo root. Quartz symlinks each one into `.quartz/plugins/<name>/` at build time. Each local plugin is a TypeScript project built with `tsup` — the compiled `dist/` output is what Quartz actually loads.
