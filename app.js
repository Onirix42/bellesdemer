/* ============================================================
   Belles de Mer — Interactions
   ============================================================ */

/* ---------- Langue (FR par défaut, EN disponible) ----------
   Les textes vivent dans lang/fr.js et lang/en.js.            */
let langueActive = 'fr';
try {
  const memo = localStorage.getItem('bdm-langue');
  if (memo === 'fr' || memo === 'en') langueActive = memo;
} catch (e) {
  /* stockage indisponible : on reste en français */
}

function t(cle) {
  const dicos = window.TRADUCTIONS || {};
  const actif = dicos[langueActive] || {};
  const fr = dicos.fr || {};
  return actif[cle] != null ? actif[cle] : fr[cle] != null ? fr[cle] : cle;
}

function appliquerTraductions() {
  document.documentElement.lang = langueActive;
  document.title = t('meta.titre');
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', t('meta.description'));

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    el.innerHTML = t(el.getAttribute('data-i18n-html'));
  });
  document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
    el.setAttribute('alt', t(el.getAttribute('data-i18n-alt')));
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
  });

  const bouton = document.querySelector('[data-lang-toggle]');
  if (bouton) {
    bouton.textContent = langueActive === 'fr' ? 'EN' : 'FR';
    bouton.setAttribute('aria-label', t('a11y.changer-langue'));
  }
}

function changerLangue(langue) {
  langueActive = langue;
  try {
    localStorage.setItem('bdm-langue', langue);
  } catch (e) {
    /* ignorer */
  }
  appliquerTraductions();
  document.dispatchEvent(new CustomEvent('languechange'));
}

(function () {
  const bouton = document.querySelector('[data-lang-toggle]');
  bouton &&
    bouton.addEventListener('click', () => {
      changerLangue(langueActive === 'fr' ? 'en' : 'fr');
    });
  appliquerTraductions();
})();

/* ---------- Thème clair / sombre ---------- */
(function () {
  const bouton = document.querySelector('[data-theme-toggle]');
  const racine = document.documentElement;
  let mode = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  appliquer(mode);

  function appliquer(m) {
    racine.setAttribute('data-theme', m);
    if (!bouton) return;
    bouton.setAttribute('aria-label', t('a11y.mode-sombre'));
    bouton.innerHTML =
      m === 'dark'
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }

  bouton &&
    bouton.addEventListener('click', () => {
      mode = mode === 'dark' ? 'light' : 'dark';
      appliquer(mode);
    });
  document.addEventListener('languechange', () => appliquer(mode));
})();

/* ---------- En-tête au défilement ---------- */
(function () {
  const entete = document.getElementById('entete');
  let dernierY = 0;
  addEventListener(
    'scroll',
    () => {
      const y = scrollY;
      entete.classList.toggle('header--scrolled', y > 8);
      entete.classList.toggle('header--hidden', y > 480 && y > dernierY);
      dernierY = y;
    },
    { passive: true }
  );
})();

/* ---------- Apparitions au défilement ---------- */
(function () {
  const obs = new IntersectionObserver(
    (entrees) => {
      entrees.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('est-visible');
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll('.reveal').forEach((el) => obs.observe(el));
})();

/* ---------- Galerie ---------- */
(function () {
  const conteneurTabs = document.querySelector('.galerie-tabs');
  const grille = document.getElementById('galerie-grille');
  if (!conteneurTabs || !grille || typeof GALERIE_CATEGORIES === 'undefined') return;

  let categorieActive = GALERIE_CATEGORIES[0].dossier;

  function libelle(cat) {
    return t('cat.' + cat.dossier);
  }

  function construireOnglets() {
    conteneurTabs.innerHTML = '';
    GALERIE_CATEGORIES.forEach((cat) => {
      const tab = document.createElement('button');
      tab.className = 'galerie-tab';
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', cat.dossier === categorieActive ? 'true' : 'false');
      tab.id = 'tab-' + cat.id;
      const nb = (GALERIE_IMAGES[cat.dossier] || []).length;
      tab.textContent = libelle(cat) + (nb ? ' (' + nb + ')' : '');
      tab.addEventListener('click', () => {
        categorieActive = cat.dossier;
        conteneurTabs
          .querySelectorAll('.galerie-tab')
          .forEach((b) => b.setAttribute('aria-selected', b === tab ? 'true' : 'false'));
        afficher();
      });
      conteneurTabs.appendChild(tab);
    });
  }

  function afficher() {
    grille.innerHTML = '';
    const cat = GALERIE_CATEGORIES.find((c) => c.dossier === categorieActive);
    const images = GALERIE_IMAGES[categorieActive] || [];
    grille.classList.toggle('est-vide', !images.length);
    const nomCat = libelle(cat);
    const nomCatPhrase = langueActive === 'fr' ? nomCat.toLowerCase() : nomCat;

    if (!images.length) {
      const vide = document.createElement('div');
      vide.className = 'galerie-empty';
      vide.innerHTML =
        '<svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="24" cy="24" r="18"/><path d="M24 24c-2-7.5-1.5-14 0-17.5C25.5 10 26 16.5 24 24Z"/><path d="M24 24c7.5-2 14-1.5 17.5 0C38 25.5 31.5 26 24 24Z"/><path d="M24 24c2 7.5 1.5 14 0 17.5C22.5 38 22 31.5 24 24Z"/><path d="M24 24c-7.5 2-14 1.5-17.5 0C10 22.5 16.5 22 24 24Z"/></svg>' +
        '<h3>' + t('galerie.vide.titre').replace('{categorie}', nomCatPhrase) + '</h3>' +
        '<p>' + t('galerie.vide.texte').replace('{categorie}', nomCatPhrase) + '</p>';
      grille.appendChild(vide);
      return;
    }

    images.forEach((nom, i) => {
      const bouton = document.createElement('button');
      bouton.className = 'galerie-item';
      bouton.setAttribute(
        'aria-label',
        t('galerie.agrandir').replace('{n}', i + 1).replace('{categorie}', nomCat)
      );
      const img = document.createElement('img');
      img.src = encodeURI('Galerie/' + categorieActive + '/' + nom);
      img.alt = t('galerie.alt-item').replace('{categorie}', nomCat);
      img.loading = 'lazy';
      img.decoding = 'async';
      bouton.appendChild(img);
      bouton.addEventListener('click', () => ouvrirVisionneuse(img.src, nomCat));
      grille.appendChild(bouton);
    });
  }

  construireOnglets();
  afficher();
  document.addEventListener('languechange', () => {
    construireOnglets();
    afficher();
  });
})();

/* ---------- Visionneuse ---------- */
const visionneuse = document.getElementById('visionneuse');
const visionneuseImg = document.getElementById('visionneuse-img');
const visionneuseLegende = document.getElementById('visionneuse-legende');
const visionneuseFermer = document.getElementById('visionneuse-fermer');

function ouvrirVisionneuse(src, legende) {
  visionneuseImg.src = src;
  visionneuseImg.alt = t('visionneuse.alt').replace('{legende}', legende);
  visionneuseLegende.textContent = legende;
  visionneuse.classList.add('est-ouverte');
  visionneuseFermer.focus();
}

function fermerVisionneuse() {
  visionneuse.classList.remove('est-ouverte');
  visionneuseImg.removeAttribute('src');
}

visionneuseFermer.addEventListener('click', fermerVisionneuse);
visionneuse.addEventListener('click', (e) => {
  if (e.target === visionneuse) fermerVisionneuse();
});
addEventListener('keydown', (e) => {
  if (e.key === 'Escape') fermerVisionneuse();
});

/* ---------- Points de vente ----------
   Les descriptions sont dans lang/fr.js et lang/en.js
   (clés « pdv.xxx.desc »).                             */
const POINTS_DE_VENTE = [
  {
    cle: 'pdv.atelier',
    nom: 'Atelier Belles de Mer — chez Karyn',
    ville: 'Rivière-au-Tonnerre',
    adresse: '578, rue Jacques-Cartier, Rivière-au-Tonnerre, QC G0G 2L0',
    lat: 50.27527,
    lng: -64.78956,
    atelier: true,
  },
  {
    cle: 'pdv.musee',
    nom: 'Musée régional de la Côte-Nord',
    ville: 'Sept-Îles',
    lat: 50.2116,
    lng: -66.3786,
  },
  {
    cle: 'pdv.mariniere',
    nom: 'La Marinière du Nord',
    ville: 'Rivière-au-Tonnerre',
    lat: 50.2833,
    lng: -64.7728,
  },
  {
    cle: 'pdv.deriveuses',
    nom: 'Les Dériveuses',
    ville: 'Havre-Saint-Pierre',
    lat: 50.2417,
    lng: -63.5996,
  },
  {
    cle: 'pdv.artisans',
    nom: 'Place des artisans',
    ville: 'Havre-Saint-Pierre',
    lat: 50.2437,
    lng: -63.6045,
  },
  {
    cle: 'pdv.ilot',
    nom: 'L’Îlot Souvenirs — Boutique du Terroir Chez Julie',
    ville: 'Havre-Saint-Pierre',
    lat: 50.2405,
    lng: -63.5952,
  },
  {
    cle: 'pdv.ceramiques',
    nom: 'Céramiques Natashkuan',
    ville: 'Natashquan',
    lat: 50.1866,
    lng: -61.8102,
  },
];

/* Cartes des boutiques */
(function () {
  const conteneur = document.getElementById('boutiques');
  if (!conteneur) return;

  function afficherBoutiques() {
    conteneur.innerHTML = '';
    POINTS_DE_VENTE.forEach((p) => {
      const carte = document.createElement('article');
      carte.className = 'boutique' + (p.atelier ? ' boutique--atelier' : '');
      const requete = encodeURIComponent(
        p.adresse ? p.adresse : p.nom.replace(/—.*$/, '').trim() + ', ' + p.ville + ', QC'
      );
      carte.innerHTML =
        '<div>' +
        '<p class="boutique-ville">' + p.ville + '</p>' +
        '<h3>' + p.nom + '</h3>' +
        '<p>' + t(p.cle + '.desc') + '</p>' +
        (p.adresse ? '<p class="boutique-adresse">' + p.adresse + '</p>' : '') +
        '</div>' +
        '<a class="boutique-lien" href="https://www.google.com/maps/search/?api=1&query=' +
        requete +
        '" target="_blank" rel="noopener noreferrer">' + t('pdv.voir-carte') +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 17 17 7M9 7h8v8"/></svg></a>';
      conteneur.appendChild(carte);
    });
  }

  afficherBoutiques();
  document.addEventListener('languechange', afficherBoutiques);
})();

/* Carte Leaflet */
addEventListener('DOMContentLoaded', () => {
  if (typeof L === 'undefined' || !document.getElementById('carte')) return;

  const carte = L.map('carte', { scrollWheelZoom: false });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© les contributeurs <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
  }).addTo(carte);

  const groupe = [];
  POINTS_DE_VENTE.forEach((p) => {
    const icone = L.divIcon({
      className: '',
      html:
        '<svg width="30" height="30" viewBox="0 0 24 24" fill="' +
        (p.atelier ? '#a98d5f' : '#1f5d7a') +
        '" stroke="#faf8f3" stroke-width="1"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Z"/><circle cx="12" cy="9" r="2.6" fill="#faf8f3"/></svg>',
      iconSize: [30, 30],
      iconAnchor: [15, 28],
    });
    const marqueur = L.marker([p.lat, p.lng], { icon: icone }).addTo(carte);
    marqueur.bindPopup('<strong>' + p.nom + '</strong><br>' + p.ville);
    groupe.push([p.lat, p.lng]);
  });

  carte.fitBounds(groupe, { padding: [36, 36] });
});
