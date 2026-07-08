# KVARC-S website

Production website for `kvarcs.uz`, built with Next.js App Router.

## Local commands

```bash
pnpm install
pnpm run dev
pnpm run lint
pnpm run typecheck
pnpm run build
```

## Vercel deployment

Vercel detects the project as Next.js. The repository uses `pnpm-lock.yaml`; keep pnpm as the package manager.

Required environment variables:

```bash
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

Set them in Vercel Project Settings -> Environment Variables. Do not commit real tokens to GitHub.

Recommended production domain:

```text
kvarcs.uz
www.kvarcs.uz
```
