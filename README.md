# Maeve by Maman

The IVF companion that finally gets it. A bilingual (EN/FR) digital-health MVP
built for the couples journey through IVF.

Built with Next.js 16 (App Router) + Supabase + Claude, deployed on Vercel.

> **📒 Full build & handoff doc (Notion):** the canonical reference for picking
> this project up — architecture, credentials, schema, gotchas, and roadmap —
> lives at https://app.notion.com/p/3837b3f79646813c8f45fab01c0f8539
> (DigitalFlow TeamSpace → "Maeve by Maman — Build & Handoff Doc").

## What's in the MVP

- **Couples journey** — invite-code pairing, a one-way partner "emotional brief"
  (Claude-generated), and patient-controlled sharing levels.
- **The Portals** — Vent / Cry / Laugh / Humour, private or community posts.
- **Track It** — hormone logging with plain-language interpretation (Claude).
- **Schedule It** — injections, monitoring, trigger windows.
- **Learn** — how-to video library + Claude-powered "what-if" answers.
- **Consent-first** — minimum-viable-data onboarding with an audit trail.
- **Bilingual** — full English/French toggle, persisted per visitor.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Styling | Tailwind v4 + Fraunces/Inter |
| Auth + DB | Supabase (email/password + magic link, RLS) |
| AI | Anthropic Claude (`claude-sonnet-4-6`) |
| Hosting | Vercel |

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=        # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Supabase anon/publishable key
ANTHROPIC_API_KEY=               # Claude API key (partner nudges, what-if, interpret)
NEXT_PUBLIC_SITE_URL=            # e.g. https://maeve.vercel.app (for magic-link redirects)
```

The app runs without these set (it shows a friendly "connect Supabase" state and
the AI features fall back to curated content), so you can deploy first and wire
keys after.

## Database

SQL lives in `supabase/migrations/`:

- `0001_init.sql` — tables, RLS policies, the `connect_with_code` pairing
  function, and the new-user profile trigger.
- `0002_seed_videos.sql` — seed how-to library (swap URLs for Maman's own
  clinician-reviewed videos before launch).

Apply both to the Supabase project (SQL editor or MCP), then set the env vars.

## Develop

```
npm install
npm run dev      # http://localhost:3000
npm run build    # production build / typecheck
```

## Notes for launch

- Disable Supabase email confirmation for the smoothest demo sign-up, or keep it
  on and the app handles the confirm-email flow.
- The how-to video URLs are placeholders pending Maman's own content.
- AI responses are explicitly framed as information, not medical advice.
