# Hollow Sun — QA and player acceptance checks

## Changes under test
- Ordinary dialogue and investigation do not advance combat or cause enemy return fire.
- Persuasion uses Presence. Failure does not trigger a combat roll or retaliatory attack.
- Questions, refusals and hypothetical dialogue mentioning violence are protected from being treated as attacks.
- Valid physical attacks still use Combat and allow enemy retaliation. Invalid or out-of-range attacks do not roll.
- Checks with guaranteed code access, completed recruitment and other resolved interactions avoid unnecessary dice.
- Player skill and attack checks have a centred animated d20, bonus, difficulty and success/failure display. The overlay shows the engine’s existing result and waits for Continue. Space reveals, then continues. Reduced-motion settings disable tumbling.
- NPC conversations outside combat use large portraits, a location backdrop, a wide current-dialogue panel, separate history, suggested replies and free-text input.

## Verified
19 automated checks passed: seven focused conversation/combat scenarios and twelve existing game scenarios, including peaceful and combat campaign completion, save validation, species bonuses, movement and proximity.

Browser acceptance walkthrough passed at the current desktop viewport: character creation, tutorial progression, walking to Nyx, ordinary dialogue without a check, recruiting Nyx with a centred Presence roll, continuing to apply the result, opening separate dialogue history, returning to the conversation and closing to explore. The portrait layout and dice result were visually inspected.

Browser combat check also passed: attacking Korr opened a Combat roll and caused enemy retaliation; then saying “Hello” produced standard dialogue with no dice overlay, no additional enemy attacks, health unchanged at 22/36 and round unchanged at 2. The final Vercel production build passed. Deployment source copies match the tested source.

## Remaining acceptance coverage
These are developer-run acceptance checks, not colleague sign-off. Mobile devices, multiple browsers, reduced-motion playback and live AI interpretation of every possible free-text phrase have not been exhaustively tested. Speech playback was outside this pass.

Suggested colleague retest: talk to Korr during combat and confirm health and round remain unchanged; attempt persuasion and confirm only Presence is shown; attack and confirm a Combat roll followed by enemy retaliation; check both successful and failed dice results; read long NPC dialogue and return from history.


## Transparent portrait update
Conversation portraits now use real alpha cutouts extracted from the original atlases. Original RGB colours and image dimensions were verified unchanged. Proportional rendering and cell clipping prevent stretching or neighbouring-character bleed. Card borders and name ribbons were removed. The Nyx/player conversation was visually verified in the browser, and the Vercel production build passed.
