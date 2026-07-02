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

const photoItems = document.querySelectorAll([
  '.showroom-bento .bento-item',
  '.gallery-item',
  '.real-card .img-wrap',
  '.sf-card',
  '.sf-index-card .img-wrap',
  '.pourquoi-img'
].join(','));

if (photoItems.length) {
  const lightbox = document.createElement('div');
  lightbox.className = 'photo-lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Photo agrandie');
  lightbox.innerHTML = `
    <button type="button" class="photo-lightbox-close" aria-label="Fermer la photo agrandie">×</button>
    <img src="" alt="">
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('img');
  const closeButton = lightbox.querySelector('.photo-lightbox-close');

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    document.body.classList.remove('lightbox-open');
    lightboxImg.removeAttribute('src');
  };

  const openLightbox = (item) => {
    const image = item.querySelector('img');
    if (!image) return;
    lightboxImg.src = image.currentSrc || image.src;
    lightboxImg.alt = image.alt;
    lightbox.classList.add('is-open');
    document.body.classList.add('lightbox-open');
    closeButton.focus();
  };

  photoItems.forEach((item) => {
    item.classList.add('photo-zoom');
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `Agrandir : ${item.querySelector('img')?.alt || 'photo'}`);

    item.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      openLightbox(item);
    });
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.stopPropagation();
        openLightbox(item);
      }
    });
  });

  closeButton.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
  });
}

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
