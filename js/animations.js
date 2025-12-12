// Animations Module
import { safeExecute, isLibraryLoaded } from './error-handler.js';

// Animation Constants
const TYPING_CONFIG = {
  TYPE_SPEED: 50,
  DELETE_SPEED: 25,
  PAUSE_DURATION: 3000,
  NEXT_TEXT_DELAY: 500,
  INITIAL_DELAY: 1500
};

const PARTICLES_CONFIG = {
  PARTICLE_COUNT: 50,
  DENSITY_AREA: 800,
  MOVE_SPEED: 0.5,
  PARTICLE_SIZE: 3,
  OPACITY: 0.6
};

const AOS_CONFIG = {
  DURATION: 800,
  OFFSET: 100
};

const OBSERVER_CONFIG = {
  THRESHOLD: 0.3,
  ROOT_MARGIN: '0px'
};

export const IMAGE_ERROR_RECHECK_DELAY = 1000;

// Typing Effect
export function initTypingEffect() {
  return safeExecute(() => {
    const typedTextSpan = document.querySelector('.typed-text');
    if (!typedTextSpan) return;

  const texts = [
    'Structured, stable, and effortlessly alive',
    'Built for scale, designed for reliability',
    'Automated, resilient, and brilliantly efficient'
  ];
  
  // Respect reduced motion preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    typedTextSpan.textContent = texts[0];
    return;
  }
  
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentText = texts[textIndex];
    
    if (!isDeleting && charIndex < currentText.length) {
      typedTextSpan.textContent += currentText.charAt(charIndex);
      charIndex++;
      setTimeout(type, TYPING_CONFIG.TYPE_SPEED);
    } else if (isDeleting && charIndex > 0) {
      typedTextSpan.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      setTimeout(type, TYPING_CONFIG.DELETE_SPEED);
    } else if (!isDeleting && charIndex === currentText.length) {
      setTimeout(() => {
        isDeleting = true;
        type();
      }, TYPING_CONFIG.PAUSE_DURATION);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      setTimeout(type, TYPING_CONFIG.NEXT_TEXT_DELAY);
    }
  }

    setTimeout(type, TYPING_CONFIG.INITIAL_DELAY);
  }, null, 'Typing Effect');
}

// Particles.js Configuration
export function initParticles() {
  if (!isLibraryLoaded('particlesJS')) {
    console.warn('Particles.js not loaded, skipping animation');
    return;
  }
  
  // Respect prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    console.log('Particles disabled due to prefers-reduced-motion');
    return;
  }
  
  return safeExecute(() => {

  particlesJS('particles-js', {
    particles: {
      number: {
        value: PARTICLES_CONFIG.PARTICLE_COUNT,
        density: {
          enable: true,
          value_area: PARTICLES_CONFIG.DENSITY_AREA
        }
      },
      color: {
        value: '#ffffff'
      },
      shape: {
        type: 'circle'
      },
      opacity: {
        value: PARTICLES_CONFIG.OPACITY,
        random: true
      },
      size: {
        value: PARTICLES_CONFIG.PARTICLE_SIZE,
        random: true
      },
      line_linked: {
        enable: false
      },
      move: {
        enable: true,
        speed: PARTICLES_CONFIG.MOVE_SPEED,
        direction: 'none',
        random: true,
        straight: false,
        out_mode: 'out'
      }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: {
          enable: false
        },
        onclick: {
          enable: false
        },
        resize: true
      }
    },
    retina_detect: true
    });
  }, null, 'Particles.js');
}

// AOS Initialization
export function initAOS() {
  if (!isLibraryLoaded('AOS')) {
    console.warn('AOS library not loaded, skipping animations');
    return;
  }
  
  return safeExecute(() => {

  AOS.init({
    duration: AOS_CONFIG.DURATION,
    easing: 'ease-out',
    once: true,
    offset: AOS_CONFIG.OFFSET,
      disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    });
  }, null, 'AOS');
}

// Fade-in Sections Observer
export function initFadeInSections() {
  return safeExecute(() => {
    const fadeInSections = document.querySelectorAll('.fade-in-section');
  
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          
          // Lazy load images in section
          const lazyImages = entry.target.querySelectorAll('img[data-src]');
          lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          });
          
          sectionObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: OBSERVER_CONFIG.THRESHOLD, rootMargin: OBSERVER_CONFIG.ROOT_MARGIN }
  );

    fadeInSections.forEach((section) => sectionObserver.observe(section));
  }, null, 'Fade-in Sections');
}

// What I Do Section Animation
export function initWhatIDoAnimation(observer) {
  return safeExecute(() => {
    const whatIDoImage = document.querySelector('.what-i-do-image');
  const whatIDoText = document.querySelector('.what-i-do-text');
  const onpremImage = document.querySelector('.what-i-do-image-onprem');
  const onpremText = document.querySelector('.what-i-do-text-onprem');

  if (whatIDoImage) observer.observe(whatIDoImage);
  if (whatIDoText) observer.observe(whatIDoText);
    if (onpremImage) observer.observe(onpremImage);
    if (onpremText) observer.observe(onpremText);
  }, null, 'What I Do Animation');
}

/**
 * Terminal Animation - Simulates terminal commands
 */
export function initTerminalAnimation() {
  return safeExecute(() => {
    const typedCommandEl = document.querySelector('.typed-command');
    const outputEl = document.querySelector('.terminal-output');

    if (!typedCommandEl || !outputEl) return;

    const commands = [
      {
        cmd: 'whoami',
        output: 'Ahmed Belal\nSenior Systems & Cloud Infrastructure Engineer | DevOps & Automation'
      },
      {
        cmd: 'cat /etc/profile',
        output: '12+ years automating enterprise-scale environments\nHigh-availability solutions with 99.9% uptime\nMulti-cloud architect across KSA and Egypt'
      },
      {
        cmd: 'ls -la /skills/',
        output: 'drwxr-xr-x  aws/          drwxr-xr-x  kubernetes/\ndrwxr-xr-x  azure/        drwxr-xr-x  terraform/\ndrwxr-xr-x  docker/       drwxr-xr-x  ansible/\ndrwxr-xr-x  linux/        drwxr-xr-x  ci-cd/'
      },
      {
        cmd: 'docker compose ps',
        output: 'SERVICE              STATUS       UPTIME\naws-infrastructure   healthy      365 days\nkubernetes-cluster   healthy      180 days\nci-cd-pipeline      healthy      90 days'
      },
      {
        cmd: 'kubectl get pods -n production',
        output: 'NAME                    READY   STATUS    RESTARTS\napi-deployment-7d9f8    2/2     Running   0\ndb-statefulset-0        1/1     Running   0\nmonitoring-stack-5c8    1/1     Running   0'
      },
      {
        cmd: 'git log --oneline -4',
        output: 'a3f5d2b Multi-cloud disaster recovery implemented\nc7e9b1a Kubernetes resource optimization\n2d4f8e3 Terraform AWS VPC automation\n9b1c6a5 GitLab CI/CD pipeline enhancement'
      },
      {
        cmd: 'curl https://cloudycode.dev/status',
        output: '✓ Infrastructure: Operational (99.97% uptime)\n✓ All services healthy | Zero incidents\n✓ Multi-region deployment active'
      }
    ];

    let currentCommand = 0;

    function typeCommand(text, callback) {
      let i = 0;
      typedCommandEl.textContent = '';
      typedCommandEl.innerHTML = '';
      const cursorEl = document.querySelector('.cursor-terminal');

      // Hide cursor during typing
      if (cursorEl) cursorEl.style.display = 'none';

      function typeNextChar() {
        if (i < text.length) {
          const char = text[i];
          const currentText = text.substring(0, i + 1);

          // Create inline typing cursor
          typedCommandEl.innerHTML = currentText + '<span class="typing-cursor"></span>';

          i++;

          // Variable typing speed for realism
          let delay = 50 + Math.random() * 30; // 50-80ms base

          // Slower after spaces and punctuation
          if (char === ' ') delay += 20;
          if (char === '/' || char === '-' || char === '.') delay += 15;

          setTimeout(typeNextChar, delay);
        } else {
          // Typing complete - remove inline cursor, no cursor on command line
          typedCommandEl.textContent = text;
          setTimeout(callback, 500);
        }
      }

      typeNextChar();
    }

    function showOutput(text, callback) {
      outputEl.textContent = text;
      setTimeout(callback, 3000);
    }

    function runNextCommand() {
      if (currentCommand >= commands.length) {
        currentCommand = 0;
      }

      const { cmd, output } = commands[currentCommand];

      // Clear previous content
      typedCommandEl.textContent = '';
      outputEl.textContent = '';

      typeCommand(cmd, () => {
        showOutput(output, () => {
          currentCommand++;
          setTimeout(runNextCommand, 1000);
        });
      });
    }

    // Start animation
    setTimeout(runNextCommand, 1000);
  }, null, 'Terminal Animation');
}

/**
 * Counter Animation - Animates numbers counting up
 */
export function initCounters() {
  return safeExecute(() => {
    const counters = document.querySelectorAll('[data-target]');
    if (counters.length === 0) return;

    // Skip animation when users prefer reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      counters.forEach(counter => counter.textContent = counter.getAttribute('data-target'));
      return;
    }

    const animateCounter = (counter) => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          // Handle decimals properly
          if (target % 1 !== 0) {
            counter.textContent = current.toFixed(1);
          } else {
            counter.textContent = Math.floor(current);
          }
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };

      updateCounter();
    };

    // Trigger on scroll into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.textContent === '0') {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5
    });

    counters.forEach(counter => observer.observe(counter));
  }, null, 'Counter Animation');
}
