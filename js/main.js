// ===== Header scroll effect =====
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('header--scrolled', window.scrollY > 50);
});

// ===== Mobile menu =====
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  nav.classList.toggle('open');
  document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
});

// Close menu on link click
nav.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    nav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ===== Fade-in on scroll =====
const fadeElements = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Stagger animation for sibling elements
      const parent = entry.target.parentElement;
      const siblings = parent.querySelectorAll('.fade-in');
      let delay = 0;

      siblings.forEach((sibling, i) => {
        if (sibling === entry.target) {
          delay = i * 100;
        }
      });

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, Math.min(delay, 400));

      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.08,
  rootMargin: '0px 0px -60px 0px'
});

fadeElements.forEach(el => observer.observe(el));

// ===== Counter animation =====
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('.number-item__value, .hero__stat-value');
      counters.forEach(counter => {
        const text = counter.textContent;
        const match = text.match(/(\d[\d,\.]*)/);
        if (!match) return;

        const target = parseInt(match[1].replace(/[,\.]/g, ''));
        const suffix = text.replace(match[1], '');
        const duration = 2000;
        const start = performance.now();

        const animate = (currentTime) => {
          const elapsed = currentTime - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(target * eased);

          if (counter.querySelector('sup')) {
            counter.innerHTML = current + '<sup>+</sup>';
          } else {
            counter.textContent = current + suffix;
          }

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            if (counter.querySelector('sup')) {
              counter.innerHTML = target + '<sup>+</sup>';
            } else {
              counter.textContent = target + suffix;
            }
          }
        };

        requestAnimationFrame(animate);
      });

      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const numberSections = document.querySelectorAll('.hero__stats-inner');
numberSections.forEach(section => counterObserver.observe(section));

// ===== Smooth parallax for hero =====
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const scrollY = window.scrollY;
  const heroHeight = hero.offsetHeight;

  if (scrollY < heroHeight) {
    const bg = hero.querySelector('.hero__bg img');
    if (bg) {
      bg.style.transform = `scale(1.1) translateY(${scrollY * 0.15}px)`;
    }
  }
});

// ===== Contact form =====
const form = document.getElementById('contactForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nome = form.nome.value.trim();
  const telefone = form.telefone.value.trim();
  const cidade = form.cidade.value.trim();
  const produto = form.produto.value;
  const mensagem = form.mensagem.value.trim();

  let text = `Ola! Meu nome e ${nome}.%0A`;
  text += `Cidade: ${cidade}%0A`;
  text += `Telefone: ${telefone}%0A`;
  if (produto) text += `Produto: ${produto}%0A`;
  if (mensagem) text += `Mensagem: ${mensagem}%0A`;

  window.open(`https://wa.me/5555996026298?text=${text}`, '_blank');
});

// ===== Phone mask =====
const telefoneInput = document.getElementById('telefone');

telefoneInput.addEventListener('input', (e) => {
  let v = e.target.value.replace(/\D/g, '');
  if (v.length > 11) v = v.slice(0, 11);
  if (v.length > 6) {
    v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
  } else if (v.length > 2) {
    v = `(${v.slice(0,2)}) ${v.slice(2)}`;
  } else if (v.length > 0) {
    v = `(${v}`;
  }
  e.target.value = v;
});

// ===== Active nav link on scroll =====
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 120;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav__link[href="#${id}"]`);

    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        link.classList.add('nav__link--active');
      } else {
        link.classList.remove('nav__link--active');
      }
    }
  });
});
