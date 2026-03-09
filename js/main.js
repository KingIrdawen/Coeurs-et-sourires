/* =============================================
   ASSOCIATION COEURS ET SOURIRES
   Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* -------- Dynamic header positioning (alert banner aware) -------- */
  const alertBanner = document.querySelector('.alert-banner');
  const navbar = document.querySelector('.navbar');

  function getAlertHeight() {
    return alertBanner ? alertBanner.offsetHeight : 0;
  }

  function updateHeaderPositions() {
    if (!navbar) return;
    const alertH = getAlertHeight();
    const navH = 80; // fixed nav height

    // Reposition navbar below alert banner
    navbar.style.top = alertH + 'px';

    // Reposition mobile dropdown below navbar
    const navLinks = document.querySelector('.nav-links');
    if (navLinks && window.innerWidth <= 900) {
      navLinks.style.top = (alertH + navH) + 'px';
    } else if (navLinks) {
      navLinks.style.top = '';
    }

    // Adjust hero/page-hero top margin to avoid overlap
    const hero = document.querySelector('.hero');
    if (hero) hero.style.marginTop = alertH + 'px';

    const pageHero = document.querySelector('.page-hero');
    if (pageHero) pageHero.style.paddingTop = (alertH + navH + 40) + 'px';
  }

  updateHeaderPositions();
  window.addEventListener('resize', updateHeaderPositions, { passive: true });

  /* -------- Navbar scroll effect -------- */
  if (navbar) {
    function handleScroll() {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* -------- Mobile nav toggle -------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      // Re-sync dropdown position when opened
      updateHeaderPositions();
      const spans = navToggle.querySelectorAll('span');
      if (navLinks.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  /* -------- Active nav link -------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* -------- Scroll animations (IntersectionObserver) -------- */
  const fadeElements = document.querySelectorAll('.fade-in');
  if (fadeElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    fadeElements.forEach(el => observer.observe(el));
  }

  /* -------- Animated counters -------- */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 2000;
    const start = performance.now();
    const suffix = el.getAttribute('data-suffix') || '';

    function update(time) {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.floor(eased * target);
      el.textContent = current.toLocaleString('fr-FR') + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));
  }

  /* -------- FAQ accordion -------- */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', function () {
      const item = this.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      // Toggle current
      if (!isOpen) item.classList.add('open');
    });
  });

  /* -------- Donation amount selector -------- */
  document.querySelectorAll('.donation-amount-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.donation-amount-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  /* -------- Cookie Banner -------- */
  const COOKIE_KEY = 'cs_cookie_consent';
  const banner = document.getElementById('cookieBanner');

  if (banner) {
    const accepted = localStorage.getItem(COOKIE_KEY);
    if (!accepted) {
      setTimeout(() => banner.classList.add('show'), 1200);
    }

    const btnAccept = document.getElementById('cookieAccept');
    const btnRefuse = document.getElementById('cookieRefuse');
    const btnSettings = document.getElementById('cookieSettings');

    if (btnAccept) {
      btnAccept.addEventListener('click', () => {
        localStorage.setItem(COOKIE_KEY, 'accepted');
        banner.classList.remove('show');
      });
    }

    if (btnRefuse) {
      btnRefuse.addEventListener('click', () => {
        localStorage.setItem(COOKIE_KEY, 'refused');
        banner.classList.remove('show');
      });
    }

    if (btnSettings) {
      btnSettings.addEventListener('click', () => {
        window.location.href = 'politique-cookies.html';
      });
    }
  }

  /* -------- Smooth scroll for anchor links -------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 90;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* -------- Contact form (front-end validation) -------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
      btn.disabled = true;

      // Simulate (replace with real backend call)
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Message envoyé !';
        btn.style.background = '#4caf50';
        contactForm.reset();
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }, 1500);
    });
  }

  /* -------- Ciel étoilé animé (hero page d'accueil) -------- */
  (function initHeroStars() {
    const canvas = document.getElementById('heroStars');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const hero = canvas.closest('.hero');

    // ── Générer les étoiles ──────────────────────────────────────
    const STAR_COUNT = 240;
    let stars = [];

    function buildStars() {
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        const isBright  = Math.random() < 0.08;   // 8 % d'étoiles lumineuses
        const isSporadic = Math.random() < 0.13;  // 13 % scintillent sporadiquement

        // Répartition : concentrées en haut du ciel, moins vers l'horizon
        const yRaw = Math.random();
        const y    = Math.pow(yRaw, 1.6) * 0.80;  // 0..0.80 (evite l'horizon chaud)

        // Couleurs d'étoiles : blanc, bleu-blanc, ivoire chaud
        const palette = [
          [255, 255, 255],   // blanc pur
          [200, 220, 255],   // bleu-blanc (étoile chaude)
          [255, 245, 200],   // ivoire (étoile froide)
          [255, 230, 180],   // doré doux
        ];
        const color = palette[Math.floor(Math.random() * palette.length)];

        stars.push({
          x:             Math.random(),
          y,
          r:             isBright ? (Math.random() * 1.4 + 1.6) : (Math.random() * 0.9 + 0.3),
          baseOp:        Math.random() * 0.45 + (isBright ? 0.45 : 0.20),
          twinkleSpeed:  Math.random() * 1.4 + 0.3,
          twinkleAmp:    Math.random() * 0.20 + 0.06,
          phase:         Math.random() * Math.PI * 2,
          color,
          isBright,
          isSporadic,
          // Minuterie de scintillement sporadique
          sporadicTimer:  isSporadic ? (Math.random() * 7 + 3) : 0,
          sporadicActive: false,
          sporadicLife:   0,
        });
      }
    }

    // ── Redimensionnement ────────────────────────────────────────
    function resize() {
      canvas.width  = hero ? hero.offsetWidth  : window.innerWidth;
      canvas.height = hero ? hero.offsetHeight : window.innerHeight;
      buildStars();
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // ── Boucle d'animation ───────────────────────────────────────
    let t    = 0;
    let last = performance.now();

    function draw(now) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t   += dt;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach(function (s) {
        // Scintillement de base (sinus doux)
        let op = s.baseOp + Math.sin(t * s.twinkleSpeed + s.phase) * s.twinkleAmp;

        // Scintillement sporadique : flash bref et aléatoire
        if (s.isSporadic) {
          s.sporadicTimer -= dt;
          if (s.sporadicActive) {
            s.sporadicLife -= dt;
            if (s.sporadicLife <= 0) {
              s.sporadicActive = false;
              s.sporadicTimer  = Math.random() * 8 + 4; // pause 4-12 s
            } else {
              // Flash : courbe en cloche sur la durée du flash
              const prog = s.sporadicLife / 0.45;
              op = 0.95 * Math.sin(prog * Math.PI);
            }
          } else if (s.sporadicTimer <= 0) {
            s.sporadicActive = true;
            s.sporadicLife   = 0.3 + Math.random() * 0.35; // flash 0.3-0.65 s
          }
        }

        // Fondu vers l'horizon (zone chaude en bas)
        const horizonFade = Math.min(1, (0.76 - s.y) / 0.10);
        op = Math.max(0, Math.min(1, op)) * Math.max(0, horizonFade);
        if (op < 0.02) return;

        const x = s.x * canvas.width;
        const y = s.y * canvas.height;
        const [r, g, b] = s.color;

        // ── Point central ──
        ctx.beginPath();
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + op + ')';
        ctx.fill();

        // ── Halo doux pour les étoiles brillantes ──
        if (s.r > 1.3 && op > 0.25) {
          const gR  = s.r * 5;
          const grd = ctx.createRadialGradient(x, y, 0, x, y, gR);
          grd.addColorStop(0, 'rgba(' + r + ',' + g + ',' + b + ',' + (op * 0.38) + ')');
          grd.addColorStop(1, 'rgba(' + r + ',' + g + ',' + b + ',0)');
          ctx.beginPath();
          ctx.arc(x, y, gR, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }

        // ── Petite croix de diffraction pour les étoiles très lumineuses ──
        if (s.isBright && op > 0.55) {
          const len = s.r * 6 * op;
          ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + (op * 0.35) + ')';
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(x - len, y); ctx.lineTo(x + len, y);
          ctx.moveTo(x, y - len); ctx.lineTo(x, y + len);
          ctx.stroke();
        }
      });

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  })();

  /* -------- Back to top -------- */
  const backTop = document.getElementById('backTop');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.style.opacity = window.scrollY > 400 ? '1' : '0';
      backTop.style.pointerEvents = window.scrollY > 400 ? 'auto' : 'none';
    }, { passive: true });

    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});
