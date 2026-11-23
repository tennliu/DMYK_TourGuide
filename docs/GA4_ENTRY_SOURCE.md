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
- Existing `DMYKMetrics` bridge tracks `language_select`, `map_open`, `share_click`, and `share_complete`, with `district_id` and `selected_language` event params.
- This site's existing share feature deliberately produces a **clean URL without UTM** so shared traffic isn't falsely counted as NFC.
- No page redirect, URL rewrite, or changes to the `v=18` query flag are required.

## Classification and limitations
- `onsite / nfc` is **identified NFC entry** when GA4 receives a session originating from the tagged URL.
- `?v=18` by itself is a **legacy untagged entry**, *not confirmed QR*. This URL has been used by printed QR, test NFC, and potentially direct/share traffic.
- NFC tap counts and physical QR scans cannot be measured directly by GA4; it measures qualifying site visits.
- A tagged URL can be copied, forwarded, or manually opened, so the source is **declared by the URL**, not verified by the physical medium.
- In the GA4 reports, look for **Session manual source / medium** (not the browser language or the first-user source). Labels are case-sensitive.
- Preview views can enter the same GA4 property; separate using hostname or a separate QA property if needed.
- The GA4 candidate is on GitHub branch `feature/ga4-tracking-20261120`; `main` is unaffected until reviewed merge.

## Smoke test after deployment
1. Reprogram sample NFC with the tagged URL above; open it on a phone.
2. Confirm the guide looks and behaves as usual, including all seven language buttons, map iframe and share.
3. In Google Tag Assistant, verify `page_view`'s `page_location` retains `utm_source=onsite&utm_medium=nfc&utm_campaign=dmyk_tourguide`.
4. In GA4 Realtime / DebugView, verify the session and `page_view` appear; allow report processing before judging source attribution.
5. Test the legacy `?v=18` printed QR URL separately. It should work and should **not** be labeled `onsite/nfc` solely because it contains `v=18`.
6. Compare GA4 **Traffic acquisition → Session manual source / medium** after processing; expect `onsite / nfc` for tagged NFC sessions.
7. Test in a fresh browsing session (or private mode) to prevent a pre-existing session from hiding the attribution distinction.

## Source of truth
Google Analytics Help — manual UTM tagging and session traffic attribution:
- https://support.google.com/analytics/answer/11242870?hl=en
- https://support.google.com/analytics/answer/12923437
- https://support.google.com/analytics/answer/10917952
