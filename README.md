# Hollow Sun — Vercel edition

An original browser space-opera RPG: free movement, character creation, species modifiers, animated characters, story cutscenes, free-text AI dialogue, dice-based encounters and branching endings.

## Deploy on Vercel

1. Put the contents of this folder in a GitHub repository. Include the artwork in `public/art` and the lockfile. Do not upload any secrets.
2. In Vercel, choose **Add New → Project**, import that repository, and select **Next.js**. The root directory is the directory containing this README and `package.json`. Use Node.js 22.x and the default build settings; do not set a static output directory.
3. Create an Upstash Redis database (available through the Vercel Marketplace or Upstash console). Copy its REST URL and standard REST token into the environment variables below. Redis preserves the shared daily allowance across Vercel function instances; no database migration is needed.
4. Add these variables in Vercel's project settings before deploying:

| Variable | Value |
| --- | --- |
| `OPENAI_API_KEY` | Your own OpenAI API key |
| `OPENAI_MODEL` | `gpt-4.1-mini` |
| `AI_DAILY_REQUEST_LIMIT` | `600` (optional; default 600, range 20–2000) |
| `UPSTASH_REDIS_REST_URL` | Your Redis HTTPS REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Your Redis standard REST token |

5. Deploy. If you add or change variables afterwards, redeploy. Enable them for Production; also enable Preview if you want AI in preview deployments.
6. Open the deployment, create a captain, approach Nyx and send a message. The header should show **AI CONNECTED**. If shared AI says it is unavailable, check both Redis variables and the database connection.
7. To let anyone with the link play, check Vercel's Deployment Protection settings for your production deployment and remove any access restriction you do not want. Share the production URL.

Your key is deliberately absent from this folder. Add it directly to Vercel; never add `NEXT_PUBLIC_` to any of the secret variable names. Friends use your shared AI account and need no key or invite code.

The allowance counts AI requests, not dollars: suggested actions, approaches and recognised common questions make zero dialogue requests. Unrecognised or creative free-text turns make two dialogue requests (interpretation and narration). A connection test makes one request. Optional voices make an additional speech request on a cache miss. Requests that fail may still count. It resets at midnight UTC. Shared AI fails closed if Redis is unavailable. With no host key, built-in rules mode remains playable and players can optionally connect their own key for the current tab.

## Run locally

Install Node.js 22.x, open a terminal in this folder and run:

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Fill `.env.local` only if you want AI locally. Visit http://localhost:3000. To verify a production build:

```sh
npm run typecheck
npm run build
npm start
```

## AI dialogue voices

Use **AI voices** in the game header to enable optional OpenAI-generated speech. Nyx, Brakk, PIP, Korr and Veyra have distinct voice profiles. This uses `gpt-4o-mini-tts` through the existing `OPENAI_API_KEY`; no extra environment variables are required. Your API project must allow that model. Speech uses your API budget and shared daily request allowance. Up to 32 spoken lines are cached in tab memory by speaker and text, so repeats and replays reuse audio. Refreshing the page clears this cache. Closing the conversation or muting stops playback. If the browser blocks autoplay, use the dialogue speaker button. These are AI-generated voices, not human recordings.

## Tutorial and shop

New captains receive a player-paced tutorial after the arrival cutscene: Sol’s transmission, the stakes, key characters and movement/dialogue controls. Replay it from How to play.

Use the shopping-bag button to walk to Brakk’s stall and open the shop. Purchases spend credits and apply immediately. Weapon upgrades improve ranged damage, armour improves defense, and tools improve Tech, Presence or Insight checks. Equipment is included in your manual save. The shop is a storefront screen on the concourse, not an additional walkable map.

Read `STORY-BRIEF.md` for the one-page explanation and `STORY.md` for the longer outline and endings.

## Controls and saves

Follow the gold “Start here” marker or press “Walk to Nyx” to begin. The guidance strip updates as you discover leads; other routes remain open. Talk, Inspect and Travel markers are always visible. Clicking a Travel marker walks you to the exit and changes areas.

Click the ground or hold WASD / arrow keys to move; combined keys move diagonally. Click an NPC to approach, or press E nearby. Dialogue appears word by word; Space reveals the rest when you are not typing. Dialogue history is separate from the current exchange.

Manual saves live in each player's browser on that domain. This is a single-player game with individual adventures, not synchronized multiplayer. Localhost saves do not automatically transfer to the Vercel domain. This export contains the current game code and art, not your browser's saved adventure.

## What changed for Vercel

This is a standalone Next.js App Router project. Cloudflare/Vinext, D1 bindings, Sites authentication and hosting metadata were removed from the export. The game API uses server environment variables and Redis for its atomic daily request counter. The original workspace remains separate.

## References

- [Vercel environment variables](https://vercel.com/docs/environment-variables)
- [Vercel function duration](https://vercel.com/docs/functions/configuring-functions/duration)
- [Upstash Redis REST connection](https://upstash.com/docs/redis/features/restapi)

## Hybrid dialogue

Standard replies retain authored story facts, identity reactions and deterministic dice checks. The dialogue label shows Standard or AI. Only exact supported phrases use standard replies; qualifications, compound requests and unusual free text go to AI when connected. Both paths use the same game rules. Voices are optional and billed separately on cache misses.

## Conversation and dice presentation

NPC conversations outside combat use a portrait-led scene and a wide dialogue panel. Close the conversation to explore. Skill checks and player attacks open a centred d20 result; Space reveals the roll and then continues. Normal questions have no dice overlay. Conversation and persuasion do not trigger enemy return fire or advance combat rounds. Valid attacks retain normal combat turns.
