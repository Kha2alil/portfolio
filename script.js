/* ============================================================
   kha2lil Portfolio — JavaScript
   Features: Custom cursor, Scroll animations, Skill bars,
   Theme toggle, Navbar, Mobile menu, Form, Progress bar
   ============================================================ */

(function () {
  'use strict';

  /* =====================
     CUSTOM CURSOR
  ===================== */
  const cursor = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursorTrail');

  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;

  if (cursor && cursorTrail && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    function animateTrail() {
      trailX += (mouseX - trailX) * 0.15;
      trailY += (mouseY - trailY) * 0.15;
      cursorTrail.style.left = trailX + 'px';
      cursorTrail.style.top = trailY + 'px';
      requestAnimationFrame(animateTrail);
    }
    animateTrail();

    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      cursorTrail.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
      cursorTrail.style.opacity = '1';
    });
  }

  /* =====================
     THEME TOGGLE
  ===================== */
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  const savedTheme = localStorage.getItem('kha2lil-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('kha2lil-theme', next);

      // Smooth color transition flash
      const flash = document.createElement('div');
      flash.style.cssText = `
        position: fixed; inset: 0; z-index: 9998; pointer-events: none;
        background: ${next === 'light' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'};
        animation: flashFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      `;
      const style = document.createElement('style');
      style.textContent = '@keyframes flashFade { from { opacity: 1; } to { opacity: 0; } }';
      document.head.appendChild(style);
      document.body.appendChild(flash);
      setTimeout(() => {
        flash.remove();
        style.remove();
      }, 400);
    });
  }

  /* =====================
     NAVBAR
  ===================== */
  const navbar = document.getElementById('navbar');
  const navProgress = document.getElementById('navProgress');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navLinkItems = document.querySelectorAll('.nav-link');

  // Scroll effects
  function updateNavbar() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollY / docHeight) * 100;

    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (navProgress) navProgress.style.width = progress + '%';
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // Scroll to hash target on page load (for cross-page navigation like index.html#about)
  if (window.location.hash) {
    window.addEventListener('load', () => {
      const target = document.querySelector(window.location.hash);
      if (target) {
        const navHeight = navbar ? navbar.offsetHeight : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  }

  // Active nav link based on current page
  const pageName = window.location.pathname.split('/').pop() || 'index.html';
  navLinkItems.forEach(link => {
    const page = link.getAttribute('data-page');
    if (page) {
      const linkPage = link.getAttribute('href').split('/').pop().split('#')[0];
      if (linkPage === pageName) {
        link.classList.add('active');
      }
    }
  });



  // Mobile hamburger
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    navLinkItems.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* =====================
     SCROLL REVEAL
  ===================== */
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* =====================
     SKILL BARS ANIMATION
  ===================== */
  const skillFills = document.querySelectorAll('.skill-fill');
  localStorage.removeItem('kha2lil-skills-animated');

  const skillsSection = document.querySelector('.skills-section');
  if (skillsSection && skillFills.length) {
    skillFills.forEach(fill => fill.style.width = '0%');

    const skillSectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        skillFills.forEach(fill => {
          const targetClass = Array.from(fill.classList).find(cls => cls.startsWith('w-'));
          if (targetClass) fill.style.width = targetClass.replace('w-', '') + '%';
        });
        skillSectionObserver.disconnect();
      });
    }, { threshold: 0.1 });

    skillSectionObserver.observe(skillsSection);
  }

  /* =====================
     SMOOTH SCROLL
  ===================== */
  document.querySelectorAll('.nav-link').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      const hashIndex = href.indexOf('#');
      if (hashIndex === -1) return;
      const pagePart = href.slice(0, hashIndex) || 'index.html';
      const hashPart = href.slice(hashIndex);
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      if (pagePart === currentPage && hashPart.length > 1) {
        e.preventDefault();
        const target = document.querySelector(hashPart);
        if (target) {
          const navHeight = navbar ? navbar.offsetHeight : 80;
          const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  /* =====================
     CONTACT FORM
  ===================== */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('name')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const message = document.getElementById('message')?.value.trim();

      if (!name || !email || !message) return;

      const originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Sending...</span>';
      submitBtn.disabled = true;

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          submitBtn.innerHTML = '<span>Message Sent!</span>';
          submitBtn.style.background = 'var(--success)';
          contactForm.reset();
          setTimeout(() => {
            submitBtn.innerHTML = originalHTML;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
          }, 3000);
        } else {
          throw new Error('Form submission failed');
        }
      } catch {
        submitBtn.innerHTML = '<span>Failed — try emailing directly</span>';
        submitBtn.style.background = 'var(--warning)';
        setTimeout(() => {
          submitBtn.innerHTML = originalHTML;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 4000);
      }
    });
  }

  /* =====================
     INPUT FOCUS EFFECTS
  ===================== */
  const inputs = document.querySelectorAll('.form-input');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.closest('.form-group')?.querySelector('.form-label')?.style.setProperty('color', 'var(--accent)');
    });
    input.addEventListener('blur', () => {
      input.closest('.form-group')?.querySelector('.form-label')?.style.removeProperty('color');
    });
  });

  /* =====================
     TYPING EFFECT FOR HERO BADGE
  ===================== */
  const badge = document.querySelector('.hero-badge');
  if (badge) {
    const text = badge.textContent.trim();
    const dot = badge.querySelector('.badge-dot');
    const textNode = badge.lastChild;
    if (textNode && textNode.nodeType === Node.TEXT_NODE) {
      textNode.textContent = '';
      let i = 0;
      const fullText = ' Available for opportunities';
      function typeChar() {
        if (i < fullText.length) {
          textNode.textContent = fullText.slice(0, ++i);
          setTimeout(typeChar, 30 + Math.random() * 25);
        }
      }
      setTimeout(typeChar, 1000);
    }
  }

  /* =====================
     PARALLAX ORBS
  ===================== */
  const orbs = document.querySelectorAll('.hero-orb');
  if (orbs.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          orbs.forEach((orb, i) => {
            const speed = 0.1 + i * 0.03;
            orb.style.transform = `translateY(${scrollY * speed}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* =====================
     CARD TILT ON HOVER
  ===================== */
  function addTilt(selector, intensity = 8) {
    document.querySelectorAll(selector).forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transition = 'transform 0.1s ease';
        card.style.transform = `translateY(-5px) rotateX(${-y * intensity}deg) rotateY(${x * intensity}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.transform = '';
      });
    });
  }

  addTilt('.service-card', 6);
  addTilt('.skill-category', 4);

  /* =====================
     PROJECT CARD GLOW
  ===================== */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');
    });
  });

  /* =====================
     PROJECT MODALS
  ===================== */
  function setupModal(modalId, closeId, projectSelector, resetFn) {
    const overlay = document.getElementById(modalId);
    const closeBtn = document.getElementById(closeId);
    if (!overlay || !closeBtn) return;

    function open() {
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (resetFn) resetFn();
    }

    function close() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    document.querySelectorAll(projectSelector).forEach(card => {
      card.addEventListener('click', open);
    });

    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) close();
    });
  }

  // Dzire modal setup
  setupModal('projectModal', 'modalClose', '[data-project="dzire"]', () => {
    const roleTabs = document.getElementById('roleTabs');
    const modalScreenshot = document.getElementById('modalScreenshot');
    const modalScreenshotFallback = document.getElementById('modalScreenshotFallback');
    if (!roleTabs || !modalScreenshot) return;

    const roleImageMap = {
      visitor: 'assets/dzire-hero.png',
      student: 'assets/dzire-student.png',
      teacher: 'assets/dzire-teacher.png',
      admin: 'assets/dzire-admin.png',
    };

    function switchRole(role) {
      roleTabs.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
      const tab = roleTabs.querySelector(`[data-role="${role}"]`);
      if (tab) tab.classList.add('active');
      modalScreenshot.src = roleImageMap[role] || roleImageMap.visitor;
    }

    modalScreenshot.addEventListener('error', () => {
      modalScreenshot.style.display = 'none';
      if (modalScreenshotFallback) {
        modalScreenshotFallback.style.display = 'block';
        const role = roleTabs.querySelector('.role-tab.active')?.getAttribute('data-role') || 'visitor';
        modalScreenshotFallback.innerHTML = `<p>Add screenshot to <code>assets/dzire-${role}.png</code></p>`;
      }
    });

    modalScreenshot.addEventListener('load', () => {
      modalScreenshot.style.display = 'block';
      if (modalScreenshotFallback) modalScreenshotFallback.style.display = 'none';
    });

    roleTabs.addEventListener('click', (e) => {
      const tab = e.target.closest('.role-tab');
      if (!tab || tab.classList.contains('active')) return;
      switchRole(tab.getAttribute('data-role'));
    });

    switchRole('visitor');
  });

  // Text Analyzer modal setup
  setupModal('textAnalyzerModal', 'taModalClose', '[data-project="text-analyzer"]');

  /* =====================
     STAT NUMBER COUNTER
  ===================== */
  const statNums = document.querySelectorAll('.stat-num');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        const num = parseFloat(text);
        const suffix = text.replace(/[\d.]/g, '');

        if (!isNaN(num) && num > 1) {
          let start = 0;
          const duration = 1000;
          const startTime = performance.now();

          function tick(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(ease * num);
            el.textContent = current + suffix;
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = num + suffix;
          }
          requestAnimationFrame(tick);
        }
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => counterObserver.observe(el));

  /* =====================
     SECTION HIGHLIGHT PULSE
  ===================== */
  // Pulse accent color border on active timeline items
  const activeTimeline = document.querySelector('.timeline-item.active');
  if (activeTimeline) {
    const content = activeTimeline.querySelector('.timeline-content');
    if (content) {
      content.style.borderLeft = '2px solid var(--accent)';
      content.style.paddingLeft = 'var(--space-md)';
      content.style.marginLeft = 'calc(-1 * var(--space-md) - 2px)';
    }
  }

  /* =====================
     BLOG RENDERER
  ===================== */
  const blogPosts = [
    {
      title: "Building This Portfolio: A Case Study",
      excerpt: "Design decisions, CSS architecture, and the philosophy behind every pixel of this very site.",
      date: "May 2026",
      tags: ["CSS", "Design", "Project"],
      link: "blog-building-this-portfolio.html"
    }
  ];

  const blogGrid = document.getElementById('blogGrid');

  function renderBlogPosts() {
    if (!blogGrid) return;

    if (blogPosts.length === 0) {
      blogGrid.innerHTML = '<p class="blog-empty">No posts yet. Coming soon.</p>';
      return;
    }

    blogGrid.innerHTML = blogPosts.map(post => `
      <article class="blog-card reveal-up">
        <div class="blog-card-tags">
          ${post.tags.map(tag => `<span class="blog-card-tag">${tag}</span>`).join('')}
        </div>
        <h3 class="blog-card-title">${post.title}</h3>
        <p class="blog-card-excerpt">${post.excerpt}</p>
        <div class="blog-card-footer">
          <span class="blog-card-date">${post.date}</span>
          <a href="${post.link}" class="blog-card-link" title="Read full article">
            Read
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </article>
    `).join('');
  }

  renderBlogPosts();

  // Re-observe newly added blog cards
  const blogCards = document.querySelectorAll('#blogGrid .reveal-up');
  blogCards.forEach(el => revealObserver.observe(el));

  /* =====================
     JOURNEY FILTERS
  ===================== */
  const journeyFilters = document.querySelector('.journey-filters');
  const timelineItems = document.querySelectorAll('.timeline-item');

  if (journeyFilters && timelineItems.length) {
    journeyFilters.addEventListener('click', (e) => {
      const btn = e.target.closest('.journey-filter');
      if (!btn || btn.classList.contains('active')) return;

      journeyFilters.querySelectorAll('.journey-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      timelineItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  console.log('%c kha2lil', 'color: #d4a843; font-size: 2rem; font-weight: 800; font-family: monospace;');
  console.log('%c Portfolio crafted with precision & passion.', 'color: #8b8897; font-family: monospace;');
})();
