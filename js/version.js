// Version Display Module
// Loads version from site.config.js and displays it in the footer

/**
 * Initialize version display
 * Reads version from site.config.js and updates the footer
 */
export function initVersion() {
  // Load site config
  fetch('./config/site.config.js')
    .then(response => response.text())
    .then(configText => {
      // Extract version from config file
      const versionMatch = configText.match(/version:\s*['"]([^'"]+)['"]/);

      if (versionMatch && versionMatch[1]) {
        const version = versionMatch[1];
        updateVersionDisplay(version);
      }
    })
    .catch(error => {
      console.warn('Could not load version from config:', error);
    });
}

/**
 * Update version display in footer
 * @param {string} version - Version string (e.g., "6.4.5")
 */
function updateVersionDisplay(version) {
  const versionElement = document.getElementById('site-version');

  if (versionElement) {
    // Add 'v' prefix if not present
    const displayVersion = version.startsWith('v') ? version : `v${version}`;
    versionElement.textContent = displayVersion;
  }
}
