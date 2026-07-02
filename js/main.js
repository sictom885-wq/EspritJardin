const header = document.getElementById('site-header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, {passive:true});
}

const burger = document.querySelector('.burger');
const nav = document.querySelector('header nav');

if (burger && nav) {
  burger.setAttribute('type', 'button');
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-label', 'Ouvrir le menu');

  const closeMenu = () => {
    nav.classList.remove('is-open');
    header?.classList.remove('nav-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Ouvrir le menu');
  };

  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    header?.classList.toggle('nav-open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    burger.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('in'); });
}, {threshold:0.12});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

document.querySelectorAll('a[href^="#"], a[href*="index.html#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (link.classList.contains('filter-btn')) return;

    const url = new URL(link.href, window.location.href);
    if (url.pathname !== window.location.pathname || !url.hash) return;

    const target = document.querySelector(url.hash);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.pushState(null, '', url.hash);
  });
});

// Défilement doux vers les ancres de thème (page réalisations)
document.querySelectorAll('.filter-btn[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Affichage du message d'erreur formulaire (retour contact.php)
if (window.location.search.includes('erreur=1')) {
  const err = document.getElementById('form-error');
  if (err) err.style.display = 'block';
}

// Bandeau cookies RGPD (Google Fonts + carte satellite Esri)
(function () {
  if (localStorage.getItem('ejc-cookie-notice-seen')) return;

  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.innerHTML = `
    <p>Ce site utilise des polices Google et un fond de carte satellite Esri, qui peuvent transmettre votre adresse IP à ces services tiers. Aucun cookie publicitaire n'est utilisé.
      <a href="mentions-legales.html">En savoir plus</a>
    </p>
    <button type="button" class="btn btn-primary cookie-banner-btn">J'ai compris</button>
  `;
  document.body.appendChild(banner);
  requestAnimationFrame(() => banner.classList.add('show'));

  banner.querySelector('.cookie-banner-btn').addEventListener('click', () => {
    localStorage.setItem('ejc-cookie-notice-seen', '1');
    banner.classList.remove('show');
    setTimeout(() => banner.remove(), 400);
  });
})();
