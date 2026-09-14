# Hollow Sun — QA and player acceptance checks

Updated 14 September 2026.

## Current update
The opening is now a playable tutorial aboard the Wayfarer. Players walk to the comms console to receive Sol’s transmission, collect supplies and optionally practise a safe systems check before disembarking into Meridian Hangar. Brakk’s Salvage has its own explorable interior, and the hangar lift leads to Veyra’s Throne Room. Each area has its own interactables and return route.

Core NPC dialogue, backgrounds and arrivals were rewritten with shorter, more natural speech. AI narration instructions now favour concrete actions and character concerns. Existing immersion boundaries, authored responses for common dialogue, combat separation, transparent portraits and animated checks remain in place.

## Automated verification
- New-area checks passed: ship start, departure requirements, one-time supplies, harmless failed practice check, travel between all four areas, return routes, save validation and reachable interactables.
- Twelve game checks passed: peaceful, code and combat routes; final boss resolution; movement boundaries and proximity; reward deduplication; healing limits; ending requirements; save validation; species modifiers; and attack range.
- Seven conversation/combat checks passed: ordinary conversation and persuasion do not trigger attacks or advance combat, while valid attacks still resolve combat.
- Guidance, shop and equipment checks passed, including purchasing, insufficient funds, ownership, medkit limits and actual equipment bonuses.
- Immersion checks passed for six off-topic or instruction-changing inputs and eight valid roleplay inputs, plus generated-output checks.
- Export checks passed for clothing colour isolation and mocked Redis quota handling, including missing configuration and storage failures.
- Final Vercel production build passed, including TypeScript validation.

## Browser walkthrough
A fresh captain began aboard the ship. Walking to the comms console played the transmission and advanced guidance. Collecting supplies increased medkits from three to four. The optional systems check displayed a centred Tech roll and completed without damage. The ramp led to Meridian Hangar.

The shop entrance opened a separate map. Walking to Brakk opened trading. Buying a medkit reduced credits from 80 to 60 and increased medkits from four to five. Leaving through the door returned to the hangar with the purchase retained. The lift then opened Veyra’s Throne Room and its arrival dialogue.

The ship and shop were visually inspected. A background scaling issue found during QA was corrected so their painted floors align with movement and interaction markers.

Earlier browser checks also verified conversation history, proportional transparent portraits, an off-topic redirect, and conversation during combat without extra damage or combat rounds.

## Limits and colleague acceptance
These are developer-run checks, not colleague sign-off. Live AI responses and voice playback were not retested in this pass. Mobile layouts, multiple browsers and every possible free-text input have not been exhaustively tested. AI boundaries reduce drift but cannot guarantee every response stays in-world.

Recommended colleague retest: start a new captain, complete the ship tutorial without help, buy an item, return to the hangar and find the throne-room lift. Confirm Sol’s problem and Veyra’s demands are clear. Then try peaceful and combat approaches, including conversation during a fight.
