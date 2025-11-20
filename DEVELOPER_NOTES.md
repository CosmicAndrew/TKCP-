
# Developer Notes - Expected Console Warnings

## Expected Warnings (Safe to Ignore)

### 1. Blocked Resources (net::ERR_BLOCKED_BY_CLIENT)
**Message:** `GET https://js-na2.hs-banner.com/... net::ERR_BLOCKED_BY_CLIENT` (and similar HubSpot scripts)

**Cause:** Ad blockers (uBlock Origin, etc.), privacy extensions, or browser Enhanced Tracking Protection (Firefox/Safari).

**Impact:** None. Core behavioral tracking and lead capture (via `22563653.js`) load successfully. Auxiliary banner and analytics scripts are non-critical.

**Action:** Disable ad blockers during testing for a cleaner console. In production, this is normal behavior for users with privacy tools.

---

### 2. Tailwind CDN Warning
**Message:** `cdn.tailwindcss.com should not be used in production`

**Cause:** We are currently using the Tailwind Play CDN for development speed and simplicity.

**Impact:** Minimal performance overhead. The system functions perfectly.

**Action:** No action required at this stage. Optimization to a build process can be done when traffic scales.

---

### 3. Favicon / OpaqueResponseBlocking
**Message:** `A resource is blocked by OpaqueResponseBlocking`

**Cause:** Can occur when browser security policies block certain icon fetches or when local dev environments handle static assets differently.

**Impact:** Cosmetic only. Favicon might not appear in some contexts.

**Action:** Ensure favicon files exist in the public directory.

---

## What to Watch For (Real Issues)

### ❌ STOP if you see:
- `⚠️ HubSpot tracking code not loaded` (indicates tracking script failed completely)
- `HubSpot submission network error` (indicates contact creation failed)
- No `✅ Tracked HubSpot event` messages in console during testing

### ✅ GOOD if you see:
- `✅ Tracked HubSpot event: [event name]` (events working)
- `[Meta Pixel Event]: [event name]` (Meta tracking working)
