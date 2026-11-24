# DMYK TourGuide — GA4 entrance/source attribution

## Scope
- **Printed QR (already distributed; unchanged for its planned one-year lifespan):**
  `https://tennliu.github.io/DMYK_TourGuide/?v=18`
- **Test and future NFC:**
  `https://tennliu.github.io/DMYK_TourGuide/?v=18&utm_source=onsite&utm_medium=nfc&utm_campaign=dmyk_tourguide`
- Both open the same DMYK TourGuide page; UTM values identify NFC *traffic* in GA4, not the hardware action itself.

## Implementation
- GA4 tag ID: `GTM-5K542JSS`, destination measurement ID: `G-EF6HEKVW9T`.
- GA4 automatically reads `utm_source`, `utm_medium`, and `utm_campaign` from landing URLs; **do not** create a duplicate `entry_method` event or manually fire a second `page_view`.
- **GoMaps Analytics v2** records `experience_visit`, browser-specific `experience_first_visit`, `map_open`, `share_click`, and `share_complete`. Events carry `district_id=DMYK`, `experience_id=dmyk_tourguide`, and `entry_point`. Map/share actions also carry `selected_language`. The older `language_select` event is retired in v2; language use is reported from `map_open`.
- `experience_first_visit` is based on first visit recorded in the browser's localStorage for this experience, not the GA4 built-in `first_visit`. Clearing storage or changing devices can count a returning person as new.
- This site's existing share feature deliberately produces a **clean URL without UTM** so shared traffic isn't falsely counted as NFC.
- No page redirect, URL rewrite, or changes to the `v=18` query flag are required.

## Classification and limitations
- `onsite / nfc` is **identified NFC entry** when GA4 receives a session originating from the tagged URL.
- `entry_point=qr` when `utm_medium=qr`; `entry_point=nfc` when `utm_medium=nfc`; other UTM values are `other`; untagged entries are `unknown`.
- `?v=18` by itself is a **legacy untagged entry**, *not confirmed QR*. This URL has been used by printed QR, test NFC, and potentially direct/share traffic.
- NFC tap counts and physical QR scans cannot be measured directly by GA4; it measures qualifying site visits.
- A tagged URL can be copied, forwarded, or manually opened, so the source is **declared by the URL**, not verified by the physical medium.
- In the GA4 reports, look for **Session manual source / medium** (not the browser language or the first-user source). Labels are case-sensitive.
- Preview views can enter the same GA4 property; separate using hostname or a separate QA property if needed.
- v2 changed only TourGuide `metrics.js` and its script URL cache version. The 7 map URLs, app.js, CSS, and printed QR `?v=18` stay unchanged.
- Keep the v1 events and Event Map ID dimension in GA4 for history. New event names are **not** retroactive; date comparisons must distinguish the cutover.

## Smoke test after deployment
1. Reprogram sample NFC with the tagged URL above; open it on a phone.
2. Confirm the guide looks and behaves as usual, including all seven language buttons, map iframe and share.
3. In Google Tag Assistant, verify `page_view`'s `page_location` retains `utm_source=onsite&utm_medium=nfc&utm_campaign=dmyk_tourguide`; verify `experience_visit` with `experience_id=dmyk_tourguide` and `entry_point=nfc`.
4. In GA4 Realtime / DebugView, verify `experience_visit`, `map_open`, `share_click`, and `share_complete` when triggered. `experience_first_visit` should appear **only** once per browser/experience. Allow report processing before judging source attribution.
5. Test the legacy `?v=18` printed QR URL separately. It should work and should **not** be labeled `onsite/nfc` solely because it contains `v=18`.
6. Compare GA4 **Traffic acquisition → Session manual source / medium** after processing; expect `onsite / nfc` for tagged NFC sessions.
7. Test in a fresh browsing session (or private mode) to prevent a pre-existing session from hiding the attribution distinction.

## Source of truth
Google Analytics Help — manual UTM tagging and session traffic attribution:
- https://support.google.com/analytics/answer/11242870?hl=en
- https://support.google.com/analytics/answer/12923437
- https://support.google.com/analytics/answer/10917952
