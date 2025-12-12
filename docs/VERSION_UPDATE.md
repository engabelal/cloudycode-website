# Version Update Guide

This guide explains how to update the version number across the CloudyCode website.

## Quick Update (2 Files Only!)

To update the version, you only need to modify **2 files**:

### 1. Update `config/site.config.js`

```javascript
// Version
// IMPORTANT: When updating this version, also update CACHE_VERSION in sw.js
// This is the single source of truth for the site version displayed in the footer
version: '6.4.5',  // ← Change this
```

### 2. Update `sw.js`

```javascript
// IMPORTANT: Keep this version in sync with config/site.config.js
const CACHE_VERSION = 'v6.4.5';  // ← Change this (with 'v' prefix)
```

**That's it!** The footer version will automatically update from `site.config.js`.

## How It Works

### Centralized Version System

The version is defined in one place and automatically propagates:

```
config/site.config.js (version: '6.4.5')
         ↓
    js/version.js (reads and displays)
         ↓
    Footer (#site-version element)
```

### Automatic Footer Update

The `version.js` module:
1. Fetches `config/site.config.js`
2. Extracts the version number
3. Updates the footer element `#site-version`
4. Runs on every page load

### Service Worker Cache

The service worker needs a separate version for cache busting:
- Located in `sw.js` as `CACHE_VERSION`
- Must be updated manually to invalidate old caches
- Should match `site.config.js` version

## Files Involved

| File | Purpose | Auto-Update? |
|------|---------|--------------|
| `config/site.config.js` | **Primary version source** | No - Manual |
| `sw.js` | Service worker cache version | No - Manual |
| `js/version.js` | Version display logic | N/A |
| `index.html` | Footer with `#site-version` ID | Yes - Auto |

## Version Format

- **site.config.js**: Without 'v' prefix → `'6.4.5'`
- **sw.js**: With 'v' prefix → `'v6.4.5'`
- **Footer display**: With 'v' prefix → `v6.4.5`

The `version.js` module automatically adds the 'v' prefix if missing.

## Testing

After updating the version:

1. **Hard refresh** the browser (`Cmd+Shift+R` / `Ctrl+Shift+F5`)
2. Check the footer shows the new version
3. Verify service worker updates (DevTools → Application → Service Workers)

## Future Enhancement

Consider creating a build script to sync versions automatically:

```bash
# Proposed npm script
npm run version:bump -- 6.4.6
```

This could:
1. Update `config/site.config.js`
2. Update `sw.js`
3. Update `package.json`
4. Create a git tag

## Troubleshooting

**Footer not updating?**
- Clear browser cache and hard refresh
- Check browser console for errors
- Verify `version.js` is loaded in `main.js`

**Service worker not updating?**
- Make sure you changed `CACHE_VERSION` in `sw.js`
- Use DevTools to manually unregister the old service worker
- Wait a few seconds for the new worker to activate

## Notes

- The version system was implemented to solve the problem of updating version in multiple places
- Previously, version had to be updated in footer HTML, config, and service worker separately
- Now, only 2 files need updating (config and service worker)
- Footer updates automatically from config
