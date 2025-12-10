// UI Interactions Module
import { trapFocus, scrollToTop } from './utils.js';

// Store last focused element for modals
let lastFocusedElement = null;

// Header Scroll Effect
export function initHeader() {
  const header = document.getElementById('page-header');
  if (!header) return;

  function handleHeaderScroll() {
    if (window.pageYOffset > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();
}

// Smooth Scroll Navigation Handler
export function initSmoothNavigation() {
  const navItems = document.querySelectorAll('.nav-item, .skip-link');
  const logoLink = document.querySelector('.header-logo');

  navItems.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      // Handle home/main link - remove hash and scroll to top
      if (href === '#main') {
        e.preventDefault();
        window.history.pushState('', document.title, window.location.pathname + window.location.search);
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        return;
      }

      // Handle other section links with smooth scroll
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          // Update URL hash
          window.history.pushState(null, null, href);

          // Smooth scroll to target
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // Handle logo click - remove hash and scroll to top if on same page
  if (logoLink) {
    logoLink.addEventListener('click', (e) => {
      const logoHref = logoLink.getAttribute('href');
      const currentLocation = window.location.origin + window.location.pathname;

      // If logo points to current page or root, prevent default and remove hash
      if (logoHref === currentLocation || logoHref === window.location.origin || logoHref === '/') {
        e.preventDefault();
        window.history.pushState('', document.title, window.location.pathname + window.location.search);
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    });
  }

  // Handle browser back/forward buttons
  window.addEventListener('popstate', () => {
    const hash = window.location.hash;
    if (hash) {
      const targetElement = document.querySelector(hash);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  });
}

// Mobile Menu
export function initMobileMenu() {
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navbar = document.querySelector('.navbar');
  const navItems = document.querySelectorAll('.nav-item');
  const menuOverlay = document.getElementById('menuOverlay');

  if (!mobileMenuToggle) return;

  const closeMenu = () => {
    mobileMenuToggle.classList.remove('active');
    navbar.classList.remove('active');
    document.body.classList.remove('menu-open');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    if (menuOverlay) menuOverlay.classList.remove('active');
  };

  mobileMenuToggle.addEventListener('click', () => {
    const isActive = mobileMenuToggle.classList.toggle('active');
    navbar.classList.toggle('active');
    document.body.classList.toggle('menu-open');
    mobileMenuToggle.setAttribute('aria-expanded', isActive);
    if (menuOverlay) menuOverlay.classList.toggle('active');
  });

  // Close menu when clicking on overlay
  if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMenu);
  }

  // Swipe gesture to close menu
  let touchStartX = 0;
  let touchEndX = 0;

  navbar.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  navbar.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchEndX - touchStartX > 100) { // Swipe right > 100px
      closeMenu();
    }
  }, { passive: true });

  // Close menu when clicking nav items
  navItems.forEach((item) => {
    item.addEventListener('click', closeMenu);
    // Add loaded class after animation completes
    item.addEventListener('animationend', () => {
      item.classList.add('loaded');
    }, { once: true });
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navbar.classList.contains('active')) {
      closeMenu();
    }
  });
}

// Scroll Progress Indicator
export function initScrollProgress() {
  const scrollProgress = document.getElementById('scrollProgress');
  if (!scrollProgress) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    scrollProgress.style.width = progress + '%';
  }, { passive: true });
}

// Certification Modal
export function initCertModal() {
  // Event delegation for cert badges
  document.addEventListener('click', (e) => {
    const certBadge = e.target.closest('.cert-badge');
    if (certBadge) {
      openCertModal(
        certBadge.dataset.certTitle,
        certBadge.dataset.certDesc,
        certBadge.dataset.certLevel,
        certBadge.dataset.certYear,
        certBadge.dataset.certIcon
      );
    }
  });
  
  // Close modal handlers
  const certModal = document.getElementById('certModal');
  if (certModal) {
    certModal.addEventListener('click', (e) => {
      if (e.target.id === 'certModal') {
        closeCertModal();
      }
    });
    
    const closeBtn = certModal.querySelector('.cert-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeCertModal);
    }
  }
  
  function openCertModal(title, desc, level, year, icon) {
    lastFocusedElement = document.activeElement;
    
    const modal = document.getElementById('certModal');
    document.getElementById('certModalTitle').textContent = title;
    document.getElementById('certModalDesc').textContent = desc;
    document.getElementById('certModalLevel').textContent = level;
    document.getElementById('certModalYear').textContent = year;
    document.getElementById('certModalIcon').className = `cert-modal-icon ${icon}`;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    
    // Trap focus and focus first element
    trapFocus(modal);
    setTimeout(() => {
      const closeBtn = modal.querySelector('.cert-modal-close');
      if (closeBtn) closeBtn.focus();
    }, 100);
  }

  function closeCertModal() {
    const modal = document.getElementById('certModal');
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    
    // Return focus to trigger element
    if (lastFocusedElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  }
  
  // Expose for backward compatibility
  window.openCertModal = openCertModal;
  window.closeCertModal = closeCertModal;
}

// Sticky CTA Mobile
export function initStickyCTA() {
  const stickyCta = document.getElementById('stickyCta');
  if (!stickyCta) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 800) {
      stickyCta.classList.add('show');
    } else {
      stickyCta.classList.remove('show');
    }
  }, { passive: true });
}

// Back to Top Button
export function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    scrollToTop();
  });
}

// Loading Screen - Dynamic based on page load
export function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  if (!loadingScreen) return;

  const hideScreen = () => {
    loadingScreen.classList.add('hidden');
    setTimeout(() => loadingScreen.remove(), 400);
  };

  // Always show loading screen for at least 500ms
  const minLoadTime = 500;
  const startTime = Date.now();

  const hideWithDelay = () => {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, minLoadTime - elapsed);
    setTimeout(hideScreen, remaining);
  };

  if (document.readyState === 'complete') {
    hideWithDelay();
  } else {
    window.addEventListener('load', hideWithDelay, { once: true });
  }
}

// Global Escape Key Handler for Modals
export function initModalEscapeHandler() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const certModal = document.getElementById('certModal');
      const projectModal = document.getElementById('projectModal');
      
      if (certModal && certModal.classList.contains('active')) {
        window.closeCertModal();
      }
      if (projectModal && projectModal.classList.contains('active')) {
        window.closeProjectModal();
      }
    }
  });
}
