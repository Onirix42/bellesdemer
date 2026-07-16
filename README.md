# Belles de Mer — Site vitrine

Vitrine d'artiste de Karyn Vignola : bijoux nord-côtiers uniques inspirés de la mer,
créés à Rivière-au-Tonnerre (Minganie, Côte-Nord, Québec).

Site 100 % statique (HTML/CSS/JS), sans dépendances à installer — conçu pour être
hébergé gratuitement sur **GitHub Pages** en remplacement de Shopify.

## Structure

```
Nouveau Site/
├── index.html            Page unique (héros, galerie, atelier, points de vente)
├── base.css              Socle CSS commun
├── style.css             Design « Côte-Nord » (clair + sombre)
├── app.js                Interactions : galerie, visionneuse, carte, thème, langue
├── galerie-data.js       Liste des photos de la galerie (généré)
├── lang/
│   ├── fr.js             Tous les textes en français
│   └── en.js             Tous les textes en anglais
├── assets/               Logo, favicon, photos optimisées (héros, atelier)
├── Galerie/              Photos des bijoux, par catégorie
│   ├── Bagues/
│   ├── Boucles d'oreilles/
│   ├── Bracelets/
│   ├── Pendentifs/
│   └── Atelier/          Photos de Karyn au travail et de la plage
└── outils/
    └── generer-galerie.sh   Régénère galerie-data.js
```

## Ajouter ou changer des photos

1. Déposer les photos (`.jpg`, `.jpeg`, `.png`, `.webp`) dans le bon sous-dossier de `Galerie/`.
2. Depuis la racine du site, exécuter :

   ```bash
   ./outils/generer-galerie.sh
   ```

3. Recharger la page — les nouvelles photos apparaissent dans la bonne catégorie.

Conseil : exporter les photos en « Grande » (~1280 px) depuis Photos sur Mac pour garder
le site rapide.

## Modifier les textes (français / anglais)

Tous les textes du site vivent dans deux fichiers jumeaux :

- `lang/fr.js` — version française (langue par défaut)
- `lang/en.js` — version anglaise

Pour corriger un texte : ouvrir le fichier, modifier la valeur entre guillemets à droite
des deux-points, enregistrer, recharger la page. Les clés (à gauche) doivent rester
identiques dans les deux fichiers. Le bouton EN/FR dans l'entête permet aux visiteurs de
changer de langue ; leur choix est mémorisé par le navigateur.

## Modifier les points de vente

La liste des boutiques (noms, villes, adresses, coordonnées GPS) se trouve dans le
fichier `app.js` (constante `POINTS_DE_VENTE`). Les descriptions des boutiques sont dans
`lang/fr.js` et `lang/en.js` (clés `pdv.xxx.desc`).

## Tester en local

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Mise en ligne sur GitHub Pages (après approbation de Karyn)

1. Créer un dépôt GitHub (ex. `bellesdemer`).
2. Pousser le contenu de ce dossier à la racine du dépôt.
3. Dans les réglages du dépôt : Pages → Source → branche `main`, dossier `/ (root)`.
4. Configurer le domaine personnalisé `bellesdemer.com` (fichier `CNAME` + DNS chez le
   registraire : enregistrement `A`/`ALIAS` vers GitHub Pages).
5. Résilier l'abonnement Shopify une fois le domaine migré.
