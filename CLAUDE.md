# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CloudyCode is a static portfolio website for a DevOps & Cloud Engineer, hosted on GitHub Pages. Built with vanilla HTML5, CSS3, and ES6 JavaScript modules with PWA capabilities. The site features modern animations, responsive design, accessibility compliance, and performance optimization (Lighthouse 95+).

**Live Site**: https://cloudycode.dev

## File Structure

```
cloudycode-website/
├── animations/          # Lottie animation JSON files
│   ├── cloud-animation.json
│   ├── cloud-computing.json
│   └── scroll-animation.json
├── config/             # Site configuration
│   └── site.config.js
├── css/                # Stylesheets
│   ├── main.css
│   ├── main.min.css
│   └── ...
├── docs/               # Documentation files
│   ├── DESIGN_ENHANCEMENTS.md
│   ├── DESIGN_STRATEGY_PRO.md
│   ├── IMPLEMENTATION_GUIDE.md
│   └── ...
├── fonts/              # Local web fonts
├── images/             # Images and icons
├── js/                 # JavaScript modules
│   ├── main.js
│   ├── animations.js
│   ├── ui.js
│   └── ...
├── index.html          # Main page
├── manifest.json       # PWA manifest
├── sw.js              # Service worker
├── CLAUDE.md          # This file
└── README.md          # Project readme
```

## Development Commands

### Local Development
```bash
# Start local development server
npm run dev
# OR
python3 -m http.server 8000

# Then visit http://localhost:8000
```

### Deployment
- Deployment happens automatically via GitHub Pages on push to `main` branch
- No build step required (static site)

## Architecture

### Module System
The site uses **ES6 modules** (not CommonJS). All JavaScript files are interconnected through imports/exports:

- **main.js**: Main entry point - imports and orchestrates all modules
- **utils.js**: Shared utilities (observers, scroll management)
- **animations.js**: Animation initialization (particles, typing effect, AOS, Lottie)
- **ui.js**: UI components (header, mobile menu, modals, scroll progress, loading screen)
- **error-handler.js**: Global error handling and network monitoring
- **pwa.js**: Service worker registration and PWA functionality
- **projects.js**: Portfolio projects data and modal interactions
- **keyboard-nav.js**: Keyboard navigation for accessibility

### Critical Architecture Patterns

#### 1. Service Worker (sw.js)
- **Cache Strategy**: Network-first with cache fallback
- **Version Control**: Uses `CACHE_VERSION` constant (`v6.0`)
- **Critical Assets**: Defined in `CRITICAL_ASSETS` array
- When modifying cached resources, update `CACHE_VERSION` in sw.js

#### 2. Performance Optimization
- **Critical CSS**: Inlined in index.html `<style>` tag (lines 46-48)
- **Non-critical CSS**: Loaded with `media="print" onload="this.media='all'"` pattern
- **Preloading**: Critical images preloaded (avatar.webp, cloudycode-light.webp)
- When adding new critical styles, update the inline CSS block

#### 3. Animation System
- **AOS (Animate On Scroll)**: Used for scroll-triggered animations
- **Lottie**: JSON-based animations (cloud-animation.json, cloud-computing.json, scroll-animation.json)
- **Particles.js**: Background particle effects
- **Custom Typing Effect**: Implemented in animations.js

#### 4. Configuration
- **config/site.config.js**: Central configuration for site metadata, social links, SEO, analytics
- Update this file for site-wide configuration changes

### HTML Structure
- **index.html**: Single-page application with all sections
- **offline.html**: PWA offline fallback page
- Sections: Hero, About, Skills, Projects, Certifications, Contact
- Accessibility: Skip links, ARIA labels, semantic HTML

### CSS Organization
- **css/main.css**: Primary stylesheet (unminified source)
- **css/main.min.css**: Minified production version
- **css/project-modal.css**: Project modal specific styles
- **css/aos.css**: Animation library styles
- **css/fontawesome-subset.css**: Icon subset
- **css/fonts-local.css**: Local font declarations

### PWA Features
- **manifest.json**: PWA manifest configuration
- **sw.js**: Service worker for offline capability
- **pwa.js**: Registration and update notifications
- Icons: icon-192.png, icon-512.png

## GitHub Actions Workflows

### Lighthouse CI (.github/workflows/lighthouse.yml)
- Runs on push/PR to main branch
- Tests performance against production URL
- Ensures 95+ Lighthouse scores

### Broken Links Check (.github/workflows/broken-links.yml)
- Runs weekly (Sunday midnight) or manually
- Checks all HTML and Markdown files for broken links

## Important Implementation Notes

### When Adding New Features
1. **CSS Changes**: Update both main.css and regenerate main.min.css
2. **JavaScript Modules**: Use ES6 import/export syntax consistently
3. **Service Worker**: Increment CACHE_VERSION and update CRITICAL_ASSETS if needed
4. **Images**: Use WebP format with fallbacks, optimize for performance
5. **Accessibility**: Maintain ARIA labels, keyboard navigation, skip links

### Design System
- **Primary Color**: `#7127ba` (--purple)
- **Light Purple**: `#a362ff` (--purple-light)
- **Dark Purple**: `#1a0b2e` (--purple-dark)
- **Background**: `#11071f` (--background)
- **Gradients**: Defined in CSS custom properties
- **Fonts**: Plus Jakarta Sans, Preahvihear, Inter

### Project Data Structure
Projects are defined in **js/projects.js** with:
- icon, title, desc (short description)
- category (cicd, serverless, infrastructure, etc.)
- problem, solution, techStack, results (for modal display)
- link (GitHub repository URL)

### Version Management
Current version: **6.1.0** (defined in package.json and config/site.config.js)

## Branch Strategy
- **main**: Production branch (auto-deploys to GitHub Pages)
- **uat/dev**: Development/staging branch

## Commit Requirements
- Per project instructions: commit each change separately
- Follow conventional commit format when possible
- Test locally before pushing

## Common Modifications

### Adding a New Project
1. Edit `js/projects.js` - add project object to `allProjects` array
2. Follow existing data structure (icon, title, desc, category, etc.)
3. Test modal functionality locally

### Updating Site Configuration
1. Edit `config/site.config.js`
2. Changes automatically reflected site-wide

### Modifying Animations
1. For scroll animations: Edit AOS attributes in HTML or animations.js
2. For Lottie: Update JSON files or references in animations.js
3. For typing effect: Modify `initTypingEffect()` in animations.js

### Updating Service Worker
1. Increment `CACHE_VERSION` in sw.js
2. Update `CRITICAL_ASSETS` array if adding/removing cached files
3. Test offline functionality after changes
