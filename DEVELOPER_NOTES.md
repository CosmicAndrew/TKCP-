
# Developer Notes - Expected Console Warnings

## Expected Warnings (Safe to Ignore)

### 1. HubSpot Analytics/Banner Scripts Blocked
**Message:** "GET https://js-na2.hs-banner.com/... net::ERR_BLOCKED_BY_CLIENT"

**Cause:** Ad blockers, privacy extensions, or Enhanced Tracking Protection

**Impact:** None. Core behavioral tracking and lead capture still work.

**Action:** Disable ad blockers during testing for cleaner console.

---

### 2. Tailwind CDN Warning
**Message:** "cdn.tailwindcss.com should not be used in production"

**Cause:** Using Tailwind CDN instead of build process

**Impact:** Slight performance impact. System fully functional.

**Action:** Can be optimized later by installing Tailwind as dependency.

---

### 3. Audio Play Failures
**Message:** "Audio play failed: DOMException"

**Cause:** Invalid audio data in button feedback

**Impact:** None. No audio is expected/needed.

**Action:** Audio feedback code has been removed to clear this warning.

---

### 4. Favicon Blocking
**Message:** "A resource is blocked by OpaqueResponseBlocking"

**Cause:** CORS or file path issues with favicon

**Impact:** Cosmetic only. Favicon may not show in browser tab.

**Action:** Can be fixed by verifying favicon file paths exist in the public directory.

---

## What to Watch For (Real Issues)

### ❌ STOP if you see:
- "⚠️ HubSpot tracking code not loaded" (indicates tracking script failed)
- "HubSpot submission network error" (indicates contact creation failed)
- No "✅ Tracked HubSpot event" messages (indicates events not firing)

### ✅ GOOD if you see:
- "✅ Tracked HubSpot event: [event name]" (events working)
- "[Meta Pixel Event]: [event name]" (Meta tracking working)
- "[Google Analytics 4 Event]: [event name]" (GA4 working)
