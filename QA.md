# QA status

The current two-area demo is packaged for Vercel. This export is not a live deployment.

## Passed

- Local Vercel-edition production smoke test: page returns 200, configuration returns no key, cross-origin AI requests return 403 and missing-key requests return 401.

- Production builds for the original preview and the standard Next.js Vercel export.
- Next.js compilation and TypeScript checks.
- Twelve deterministic gameplay checks: reachable interactions, map boundaries, proximity enforcement, diplomatic ending, access-code route, complete boss combat route, duplicate reward prevention, healing/inventory limits, endgame gating, save validation, species stats/health/rolls and opening attack ranges.
- Palette checks: clothing pixels change; human skin, violet skin and head regions are excluded from recolouring.
- Redis adapter tests with mocked responses: permitted request, exhausted quota, absent configuration and invalid/error response. Failure closes access to shared AI.
- Browser inspection of creator ordering, species lore, background detail, gender-linked portraits and clothing-only olive palette. Dialogue-history navigation and cutscene transitions checked during this session.
- Dependency audit: zero reported vulnerabilities after upgrading the export to Next.js 16.3.4.

## Limits and outstanding work

- The game still begins on the concourse. The requested ship start and additional market area were blocked by automatic approval review reporting the Codex usage limit. Concept artwork exists separately; it is not wired into the game.
- Species prejudice is supplied to the AI as setting context. It has not been verified with a live AI playthrough of every species/gender combination. Rules-mode first greetings also vary by identity and stats.
- Shared AI on Vercel needs the owner's OpenAI and Redis environment variables. No real Vercel deployment or live Redis connection was available for this QA pass.
- Diagonal controls were changed to held-key movement; an exhaustive hands-on keyboard and mobile-device pass remains outstanding.
- Earlier live OpenAI plan/narration checks passed, but final identity-conditioned dialogue has not been tested against the live service.
- Saves remain browser-local and do not transfer between localhost and the production domain.

Do not interpret this report as completion of the blocked map expansion or an exhaustive end-to-end certification.
