# PROCESS — Daybreak / HELLFEST 2027 « Le Centième Feu »

Journal de réalisation détaillé. Le [README](../README.md) reste la porte d'entrée : ce document
descend dans le détail de la recherche, des décisions, de l'architecture, des vérifications et
des défauts.

**Convention du projet** : le contenu du produit est en français ; les journaux d'expérience
sont en anglais (`hellfest-2027/SESSION.md`). Ce document est un journal de processus destiné à
un jury francophone : il est en français.

**Rien dans ce document n'est reconstitué a posteriori.** Chaque affirmation renvoie soit à un
fichier du dépôt, soit à une commande exécutée, soit à une capture datée. Les éléments que
l'agent n'a pas pu obtenir sont déclarés comme tels, y compris quand ils font défaut au dossier.

---

## Sommaire

1. [Déroulé de la réalisation](#1-déroulé-de-la-réalisation)
2. [Recherche : méthode et résultats par candidat](#2-recherche--méthode-et-résultats-par-candidat)
3. [Décisions et changements de direction](#3-décisions-et-changements-de-direction)
4. [Architecture technique](#4-architecture-technique)
5. [Journal de vérification](#5-journal-de-vérification)
6. [Défauts trouvés et corrections](#6-défauts-trouvés-et-corrections)
7. [Les visuels : ce qui existe et ce qui n'existe pas](#7-les-visuels--ce-qui-existe-et-ce-qui-manque)
8. [Ressources, licences, provenance](#8-ressources-licences-provenance)
9. [Limites et ce qui reste à faire](#9-limites-et-ce-qui-reste-à-faire)

---

## 1. Déroulé de la réalisation

| Étape | Nature | Durée / date |
|---|---|---|
| 1. Lecture du brief | Le brief est un fichier d'attachement fourni avec la demande | avant 17:33 |
| 2. Recherche | Deux agents de recherche parallèles ont consulté les sites officiels des cinq candidats | avant 17:40 (non mesurable précisément) |
| 3. Choix et cadrage | Choix de Hellfest ; définition de l'invariant narratif et des trois modes | idem |
| 4. Construction | Écriture du code : `index.html`, `main.css`, `data.js`, `audio.js`, `app.js`, `modes.js`, `serve.js` | 17:40:52 → 18:05 |
| 5. Tests | Campagne de tests pilotés dans le navigateur intégré | 18:05 → 18:14 |
| 6. Corrections | 12 défauts corrigés (dont 2 bloquants), re-test | 18:10 → 18:14 |
| 7. Documentation technique | `hellfest-2027/README.md` et `hellfest-2027/SESSION.md` | jusqu'à 18:16:17 |
| 8. Passe de documentation | Capture d'images via Chrome headless + CDP, audit visuel, rédaction de ce document et du README racine | 18:16:17 → 18:46 |

**Fenêtre mesurée sur horodatages de fichiers** : premier artefact 17:40:52 → build final
18:16:17, soit **35 min 25 s**. La phase de recherche qui précède n'est pas mesurable
indépendamment ; le début de session est placé à ≈ 17:33, ce qui porte le **total de la phase de
construction à ≈ 43 minutes**, sous la limite de 90 minutes du brief.

La passe de documentation (étape 8) est une **seconde session**, distincte de la construction.
Elle n'a modifié **aucun fichier du prototype** — les horodatages de `hellfest-2027/` s'arrêtent
à 18:16:17, fin de la session de construction ; seuls `docs/`, `tools/` et le README racine ont
été écrits. Elle a toutefois mis au jour un défaut de rendu que les contrôles programmatiques
n'avaient pas vu ([§6](#6-défauts-trouvés-et-corrections)).

---

## 2. Recherche : méthode et résultats par candidat

### 2.1 Méthode commune

- Requêtes HTTP directes (`GET`/`HEAD`) sur les sites officiels, puis lecture du HTML rendu,
  des feuilles de style, des plans de site, des fichiers JSON et des communiqués de presse.
- Quand le contenu d'une page était **rendu côté client** ou **vide**, recours à des sources
  publiques complémentaires : encyclopédie, communiqués officiels, kit de presse, archives web.
- Pour `hellfest.fr`, mesure de la feuille de style officielle : nombre de règles `@media`, points
  de rupture, poids du payload, présence éventuelle de `prefers-reduced-motion`.
- Consultation du site avec un agent utilisateur mobile **et** desktop pour comparer les réponses.

**Tout cela a été fait le 27 octobre 2026.**

### 2.2 Hellfest — l'organisation retenue

**Accès : complet.**

| Élément consulté | Ce qui en a été tiré |
|---|---|
| `hellfest.fr/en` (page d'accueil) | Historique, mentions de l'édition 2027 annoncée (17–20 juin 2027, 300+ artistes), mentions de fréquentation |
| `hellfest.fr/en/experience-1` | Hellcity Square, communautés, description de l'expérience sur place |
| FAQ officielle | Questions pratiques et éléments de contexte sur l'organisation |
| `entry.DRSX6o_s.css` | 99 règles `@media`, points de rupture 768 / 1 440 / 1 500 px, **absence de `prefers-reduced-motion`**, variables de marque |
| PNG de logo |L’existence constatée, **non réutilisé** dans le prototype |
| Réponses HTTP avec agent mobile et desktop | **Payload identique** (347 784 octets dans les deux cas) : une seule application, pas de site mobile séparé |

**Ce qui a été constaté et non réutilisé** : le logo officiel, la palette propre du site, les
visuels de programme et les textes de marque. Le prototype n'en reprend aucun élément.

### 2.3 Shen Yun

**Accès : partiel.** `shenyun.org` redirige ; le corps des pages est rendu côté client.
L'extraction s'est faite depuis les **communiqués officiels**, le **JSON de la FAQ** et les
**variables CSS**.

**Limite** : la programmation **2027 renvoie « no results »** — impossible de documenter une
édition future à partir du site.

**Éléments retenus pour la comparaison** :organisation très structurée (compagnies, spectacles
itinérants, dates de tournée), mais un discours institutionnel et normatif sans ancrage festif
narratif ; pas de « public » identifiable de la même manière que pour un festival de metal.

### 2.4 Cirque du Soleil

**Accès : partiel.** Plan de site de **217 URL**, variables CSS brutes, métadonnées de spectacles,
kit de presse officiel.

**Limite** : les pages spectacles sont **pratiquement vides de contenu éditorial** : le discours
y est très marketing, peu exploitable pour construire un récit de festival.

**Éléments retenus** : une identité très graphique et très codifiée (mais protégée et donc
exclue), une logique de tournée internationale qui n'a pas d'équivalent dans un festival de
plateau.

### 2.5 Country Jam

**Accès : oui, en direct.** Récupération directe du site.

**Limite** : le site **sert encore le contenu 2025** ; l'état 2026 est signalé comme **non
vérifié** face au site officiel.

**Éléments retenus** : format de festival multi-scènes, identités visuelles de scène, logique de
« pass » et de 주차 — cohérente avec le choix d'un pass unique, mais l'organisation est un pays
à plusieurs — ce qui n'apporte pas de contraste au récit retenu.

### 2.6 Lollapalooza Stockholm

**Accès : non, en direct.** Le site en ligne est une **page de garde**. La structure visuelle a
été reconstituée à partir d'**instantanés Wayback** (2022, 2023, 2026).

**Limite** : ni programmation, ni billetterie, ni historique à inspecter. Un candidat que l'on ne
peut pas lire en ligne ne peut pas être évalué sur son contenu — c'est précisément ce qui a été
déclaré, et c'est la raison de son écart.

**Éléments retenus** : format « festival de ville » multi-scènes avec une identité très urbaine,
proche d'Hellfest sur la structure — d'où une vraie hésitation, tranchée par le critère
suivant.

### 2.7 Synthèse : ce qui a départagé les cinq

| Critère | Shen Yun | Cirque | Country Jam | **Hellfest** | Lollapalooza Sth. |
|---|---|---|---|---|---|
| Contenu en ligne exploitable | partiel | partiel | oui | **oui** | non |
| Possibilité de construire un récit de durée | faible | faible | moyenne | **forte** | faible (archivé) |
| Scènes distinctes,supports d'interactions | oui | oui | oui | **oui** | oui |
| Ancrage communautaire nommé | non | non | partiel | **oui** (« Hellbangers ») | non |
| Accessibilité technique à l'observation | non | non | oui | **oui** | non |
| Proximité avec un invariant « on entre par la fin » | faible | faible | faible | **forte** (la Fosse) | faible |

**Trois éléments ont porté la décision** : la présence d'une **Fosse centrale** qui s'ouvre en
dernier (invariant narratif directement exploitable), l'existence d'une **communauté nommée et
datée** (qui rend « Archives de Minuit » légitime), et le fait que le site officiel, étant une
application unique avec des animations non désactivables, offrait un **écart de conception
concret** contre lequel le prototype pouvait seURITY.

---

## 3. Décisions et changements de direction

Chaque ligne décrit une décision, sa conséquence **observable** dans le livrable, et la façon de
la vérifier. Il ne s'agit pas d'un verbatim de raisonnement, mais d'un historique vérifiable.

| # | Décision | Conséquence observable | Vérification |
|---|---|---|---|
| 1 | Choisir Hellfest malgré un accès unequal à l'information | Le comparatif documente explicitement l'accès unequal, y compris pour le candidat retenu | [§2](#2-recherche--méthode-et-résultats-par-candidat) |
| 2 | Inventer une **date volontairement décalée** de l'édition réelle (19–22 août contre 17–20 juin) | Aucune confusion possible entre le concept et l'édition 2027 réellement annoncée | Mention « 2027 fictif » dans l'interface, [§8 du README](../README.md#8-ce-qui-est-réellement-implémenté) |
| 3 | Concevoir trois modes **de nature différente** (verticale jouée / horizontale contemplative / pratique) et non trois variantes d'un même écran | Mode B initialement vertical, **abandonné** au profit d'une frise horizontale | Frise à défilement horizontal, capture `06-archives-frise.png` |
| 4 | Ne réutiliser **aucun** visuel protégé | Tous les graphismes sont procéduraux : SVG, Canvas, CSS | Aucun fichier image dans le dépôt à part les captures ; aucune requête externe |
| 5 | Réserver la **billetterie** à une simulation sans compte ni paiement | Panier et passes étiquetés « simulation » | Tests « Mode C — passes et panier » |
| 6 | Rendre le son **optionnel et éteint par défaut** | Aucun son n'est supposé acquis ; l'ambiance est un bouton explicite | Test « Mode B — son », `aria-pressed` |
| 7 | Réécrire la détection de la frappe rythmique **sur l'horloge** plutôt que sur `requestAnimationFrame` | Le rite reste juste quand l'onglet est en arrière-plan | Test « Mode A — rythme hors rAF » |
| 8 | Ajouter un **réglage applicatif** de mouvement réduit, en plus du réglage système | Les animations se réduisent même si le système ne le demande pas | Test « Mouvement réduit » |
| 9 | Faire du bandeau d'avertissement un **élément permanent** de toutes les routes | La non-officialité est visible sur chaque écran | Capture `01-accueil-desktop.png` |
| 10 | Intégrer « La Colonne » **dans le produit** plutôt que dans un fichier annexe | La transparence fait partie de l'expérience, accessible depuis la navigation | Capture `12-colonne-verifie.png` |
| 11 | Consigner les **mesures de structure** du site officiel, pas des impressions visuelles | La comparaison mobile/desktop est déclarée comme structurelle dans le produit | Section « Ce que je n'ai pas pu accéder » de la Colonne |
| 12 | Ne pas modifier le prototype pendant la passe de documentation | Le défaut du marqueur de l'Autel est **documenté, pas corrigé** | [§6](#6-défauts-trouvés-et-corrections) |

---

## 4. Architecture technique

### 4.1 Vue d'ensemble

```
index.html
  ├── <header class="site-head">  bandeau d'avertissement + navigation
  ├── <main id="main" tabindex="-1">  ← contenu de la vue courante (remplacé à chaque route)
  ├── <div class="toast" role="status">  notifications
  └── <script> data.js → audio.js → app.js → modes.js
```

**Ordre de chargement imposé** : `data.js` définit le contenu et quelques utilitaires de rendu
(`Craft`), `audio.js` le moteur de synthèse, `app.js` le routeur et les vues, `modes.js` les
modes A et B. Les deux derniers fichiers exposent leurs modules via des IIFE et un objet global
`App`, ce qui évite toute dépendance de modules ES et permet l'ouverture en `file://`.

### 4.2 Fichiers

| Fichier | Lignes | Rôle |
|---|---|---|
| `index.html` | 88 | Squelette, bandeau, navigation, points d'ancrage, chargement des scripts |
| `assets/css/main.css` | 562 | Système de variables, mise en page, composants, adaptations par largeur, `prefers-reduced-motion`, `prefers-contrast`, impression |
| `assets/js/data.js` | 262 | Tout le contenu éditorial : scènes, chapitres, programme, FAQ, passes, lieux, colonnes de la Colonne |
| `assets/js/audio.js` | 164 | Moteur de synthèse Web Audio : oscillateurs, filtre biquad, bruit façonné, compresseur,Activation explicite |
| `assets/js/app.js` | 667 | Routeur par ancre, vues (accueil, pratique, programme, Colonne), outils pratiques (programme personnel, panier), confort |
| `assets/js/modes.js` | 596 | Mode A (Descente : scènes, rites, verrou de la Fosse) et mode B (Archives : frise, son, mur local) |
| `serve.js` | 43 | Serveur statique sans dépendance, avec garde anti-traversée de chemin |
| `tools/capture.mjs` | 325 | Script de capture CDP (documentation, hors prototype) |

### 4.3 Points techniques notables

- **Routeur.** Trois formes de hash sont distinguées : `#/route`, `#/route#ancre` et `#id`
  (ancre intra-page). Le routeur transfère le focus vers la cible et compense la hauteur de
  l'en-tête collant via une variable `--head-h` recalculée au redimensionnement.
- **Isolation des vues.** Toutes les requêtes DOM des vues sont limitées à `#main`. Cette
  restriction est une correction : une requête globale `[data-scene]` atteignait `<body>` et la
  scène de la Descente ([§6](#6-défauts-trouvés-et-corrections)).
- **Particules.** Le canvas de l'accueil est un système de particules (90 maximum, DPR plafonné à
  2) ; la boucle d'animation et le listener de redimensionnement sont annulés à chaque sortie de
  la vue.
- **Synthèse sonore.** Deux oscillateurs, un bruit filtré et un compresseur, le tout assemblé à
  la demande. Aucun fichier audio n'est livré.
- **Persistance.** Trois clés `localStorage` : préférences de confort, programme personnel,
  fragments du mur local.
- **Coût réseau à l'exécution : zéro.** Les seules URL absolues du code livré sont les
  déclarations d'espace de noms XML SVG — des identifiants, pas des chargements.

---

## 5. Journal de vérification

Le détail des tests figure dans [README §13](../README.md#13-vérifications-exécutées). Ce
journal décrit **la méthode** et ce qu'elle a permis — ou non — d'établir.

### 5.1 Contraintes de l'environnement de test, et leurs effets

| Contrainte | Effet sur la méthode | Ce qui a été fait |
|---|---|---|
| L'onglet du navigateur intégré s'exécute avec `visibilityState: hidden` | `setTimeout` est ralenti (~300 ms) et les animations de défilement sont différées | Attentes actives plutôt que temporisées ; défilement instantané pour les assertions de géométrie |
| La fenêtre du navigateur intégré n'expose **aucune surface visible** (`viewport 0×0`) | **Aucune capture d'écran** n'était possible ; la revue visuelle était impossible | Passe de documentation : Chrome **headless** piloté en CDP, avec viewport explicite |
| Chrome headless exécute `requestAnimationFrame` normalement | Le marqueur de l'Autel pouvait être observé et **mesuré** | Mesure de `marker.style.left` : **−163 %** pour une piste de 519 px |
| Les captures antérieures étaient **impossibles** | La première revue visuelle du projet a eu lieu **après** la livraison | 15 captures, relues à l'œil, une anomalie de rendu détectée |

### 5.2 Ce que les contrôles programmatiques ne couvrirent pas

Les contrôles de la phase de construction étaient **structurels et géométriques** : présence des
éléments, attributs ARIA, dimensions, débordements, absence d'erreur console. Un élément peut
respecter toutes ces contraintes et être **visuellement faux** — c'est exactement le cas du
marqueur : il est bien dans le DOM, il est bien positionné par le CSS, aucune erreur n'est
signalée, et il est rendu hors de la piste.

**Enseignement retenu** : un audit d'accessibilité et de géométrie ne remplace pas une revue
visuelle. Les captures automatisées rendent cette revue possible et reproductible ; c'est la
principale amélioration àightedarder pour la suite du projet.

### 5.3 Reproductibilité des captures

```bash
node hellfest-2027/serve.js 4177      # terminal 1
node tools/capture.mjs docs/images    # terminal 2
```

Le script : lance Chrome headless, ouvre une cible CDP, pour chaque image définit la taille de
viewport et l'émulation tactile, navigue vers la route, attend le chargement des polices,
exécute les interactions réelles du site (clics, saisies), puis capture le PNG. Les résultats des
rites sont **affichés dans la sortie** du script : la chaîne complète produit
`scan=1 → balises=2 → mur=3 → souffle=4 → autel=5 → bougies=6 → fosse=ouverte`.

---

## 6. Défauts trouvés et corrections

### 6.1 Défauts corrigés pendant la construction

| # | Défaut | Gravité | Correction |
|---|---|---|---|
| 1 | La détection de la frappe rythmique dépendait de `requestAnimationFrame` : en onglet d'arrière-plan, le rite devenait injouable | Bloquant (mode A) | Détection recalculée sur l'horloge à l'instant de la frappe ; variante à cible fixe pour le mouvement réduit |
| 2 | La fermeture (touche `Échap`, bouton) poussait l'historique sans re-rendre la vue, laissant un écran vide | Bloquant (mode A) | Fermeture routée par le hash |
| 3 | La grille du programme plaçait cinq enfants dans trois colonnes, repoussant le bouton d'ajout | Visuel | Grille corrigée en quatre colonnes, avec surcharge mobile |
| 4 | Sémantique `role="tab"` incomplète sur le sélecteur de jour | Accessibilité | Converti en groupe de boutons avec `aria-pressed` |
| 5 | Caractères corrompus dans les sources (fragments CJK / cyrilliques, restes d'anglais) | Qualité | Détectés par recherche automatisée, supprimés |
| 6 | Le routeur ne rendait **rien** pour la route par défaut : le hash vide tombait dans la branche « ancre » | Bloquant | Route par défaut traitée explicitement |
| 7 | Les ancres internes étaient cassées : un clic de section renvoyait à l'accueil, et `route#ancre` rendait la page sans défiler | Majeur | Distinction `#/route`, `#/route#ancre` et `#id`, avec transfert de focus |
| 8 | La vue Archives ne se montait **qu'une fois** : la seconde visite affichait une page blanche | Bloquant | Le module s'appuie désormais sur le DOM et reconstruit au retour |
| 9 | Requêtes DOM **globales** : `[data-scene]` atteignait `<body>` et la scène de la Descente, déclenchant un `TypeError` hors vue | Majeur (silencieux) | Toutes les requêtes de vue sont limitées à `#main` |
| 10 | `aria-valuenow` écrit sur le remplissage de la barre au lieu de l'élément `role="progressbar"` | Accessibilité | Attribut déplacé sur le bon élément |
| 11 | La frise des Archives **annonçait** une navigation clavier inexistante | Accessibilité / honnêteté | `←`, `→`, `Début`, `Fin`, `Page↑/↓` implémentés et testés |
| 12 | Fuite de la boucle `requestAnimationFrame` et du listener `resize` des braises à chaque rendu de l'accueil | Performance | Annulation explicite à la sortie de la vue |
| 13 | Cible tactile des balises à 23 × 23 px effectifs, sous le minimum de 24 px | Accessibilité | Balises portées à 22 px CSS (≈ 31 px effectifs) |
| 14 | Le bouton « effacer mes fragments » ne réagissait pas sur un mur vide | Mineur | Bouton explicitement `disabled` quand la liste est vide |

### 6.2 Défaut trouvé pendant la passe de documentation — **non corrigé**

| Élément | Détail |
|---|---|
| **Objet** | Rite de l'Autel (frappe rythmique), mode A, scène 5 |
| **Symptôme** | Le marqueur n'est pas visible dans la piste. Mesure : `marker.style.left = -163.074 %`, `computed left = -844.109 px`, pour une piste de 519 px s'étendant de x = 51 à x = 570. Le marqueur est donc rendu **hors du champ**, à gauche. |
| **Cause** | La boucle de rendu utilise l'horodatage de `requestAnimationFrame` (temps depuis le chargement de la page, quelques milliers de ms), alors que l'origine du calcul est `Date.now()` (temps Unix, ≈ 1,79 × 10¹² ms). L'écart mesuré entre les deux horloges est de **1 793 122 869 587 ms**. La valeur calculée pour le rendu est donc **−1,227** (soit −122,7 %), au lieu d'une position dans `[0, 1]`. |
| **Portée réelle** | La **détection** de la frappe utilise `Date.now()`, donc la fenêtre de validation est correcte : le rite s'achève et l'étincelle est récoltée (vérifié : `3 / 3`). C'est uniquement le **rendu** qui est faux. Le joueur ne voit pas où frapper ; la variante « mouvement réduit » (cible fixe) reste, elle, correctement affichée. |
| **Pourquoi il n'est pas corrigé** | La consigne reçue pour cette passe était de **ne pas modifier le prototype**, sauf correction indispensable au lancement. Ce défaut n'empêche pas le lancement : il n'affecte ni le chargement, ni la navigation, ni les cinq autres rites. Il est donc **documenté et signalé**, pas corrigé. |
| **Correction envisagée** | Utiliser la même base temporelle dans les deux chemins — par exemple `posAt(Date.now())` dans la boucle de rendu, ou `performance.now()` comme origine pour `t0` — de façon à ce que la position affichée et la fenêtre de validation partagent la même horloge. |
| **Capture associée** | `docs/images/04-descente-rite-autel.png` montre l'état réel, défaut compris. |

### 6.3 Corrections apportées à la documentation elle-même

| Correction | Détail |
|---|---|
| Fragments de caractères non latins dans ce document et dans le README | Détectés par recherche automatisée après rédaction, corrigés (6 occurrences) |
| Anglicismes résiduels dans le texte français | Corrigés (`conduite`, `uneMark`, `sansSupport`) |
| Chemins d'images | Tous vérifiés comme relatifs et existants ; le dossier de travail **n'est pas encore un dépôt Git** (`git rev-parse` renvoie une erreur), les chemins ont donc été validés par résolution explicite, pas par `git lfs` ou un equivalent d'aperçu |

---

## 7. Les visuels : ce qui existe et ce qui manque

### 7.1 Ce qui n'existe pas

**Aucun croquis, aucune maquette, aucun wireframe, aucun moodboard, aucun storyboard, aucune
maquette d'interface et aucune capture antérieure au développement n'a été produit dans ce
projet.** C'est un fait, pas une omission de documentation.

La conception s'est faite **directement dans le code** : le concept a été formulé en décisions
structurelles (quatre modes de découverte, un invariant narratif, une direction artistique
typéographique et colorimétrique), puis immédiatement traduit en vues, en scène et en rites.
Aucun support de brouillon n'a été produit entre les deux.

**Conséquence à assumer** : il n'existe pas de « parcours de conception » documenté par des
visuels antérieurs au code. Les seules images du dépôt sont des **captures de l'état final**.

### 7.2 Ce qui existe : 15 captures authentiques du prototype final

Elles ont été produites le **27 octobre 2026**, dans **Google Chrome en mode headless**, piloté
par le protocole **Chrome DevTools** (script [`tools/capture.mjs`](../tools/capture.mjs)), après
exécution réelle des interactions du site. Le détail, image par image, figure dans
[README §9.7](../README.md#97-récapitulatif-des-visuels).

| Image | Interaction réellement exécutée pour la produire |
|---|---|
| `01-accueil-desktop` | Chargement simple de la route d'accueil |
| `02-descente-rite-seuil` | Clic sur le scanner (`#scan-line`) → « 1 / 6 étincelles » |
| `03-descente-rite-balises` | Clic sur le scanner, navigation vers la scène 2, clic sur les trois balises → « 2 / 6 » |
| `04-descente-rite-autel` | Navigation jusqu'à la scène 5, frappes répétées jusqu'à « 3 / 3 » → étincelle récoltée (défaut de rendu visible) |
| `05-descente-fosse-finale` | **Chaîne complète des six rites** → « 6 / 6 », Fosse ouverte |
| `06-archives-frise` | Chargement de la route et défilement jusqu'à la frise |
| `07-archives-mur-local` | **Saisie réelle** d'un fragment puis soumission du formulaire → 1 fragment rendu |
| `08-programme-filtres` | Clic sur le 3ᵉ jour puis sur un filtre de scène → 21 créneaux |
| `09-pratique-passes-simulees` | Défilement jusqu'à la section des passes |
| `10-pratique-acces` | Défilement jusqu'à « Accès & transports » |
| `11-pratique-accessibilite` | Défilement jusqu'à « Accessibilité » |
| `12-colonne-verifie` | Défilement jusqu'à « A · Ce qui est vérifié » |
| `13-mobile-accueil` | Rendu en 390 × 844 CSS px, émulation tactile, DPR 2 |
| `14-mobile-menu` | Idem, plus un clic sur « Menu » |
| `15-mobile-programme` | Programme en 390 × 844 CSS px |

### 7.3 Écarts entre l'intention et le rendu final

En l'absence de maquette, la seule comparaison possible est **intention → résultat**. Les écarts
constatés :

| Intention | Rendu final | Écart et traitement |
|---|---|---|
| Mode B : un récit vertical de cartes | Frise horizontale | **Écart voulu et assumé** : la durée se traverse, elle ne se lit pas. C'est la décision qui a le plus transformé le projet. |
| Un rite rythmique lisible | Marqueur rendu hors piste | **Écart non voulu**, defect documenté en [§6.2](#62-défaut-trouvé-pendant-la-passe-de-documentation--non-corrigé). |
| Un programme dense en quatre jours | 68 rendez-vous affichés, grille compacte | Conforme, mais lisible uniquement au-dessus de 768 px ; sur mobile la grille s'empile et la lisibilité baisse (constaté sur la capture `15`). |
| Une ambiance sonore enveloppante | Synthèse volontairement minimaliste | Choix : la bande sonore ne doit jamais être supposée acquise ni concurrencer le contenu. |

---

## 8. Ressources, licences, provenance

### 8.1 Polices embarquées

| Famille | Fichiers | Licence vérifiée | Source |
|---|---|---|---|
| Rye | `rye-400.woff2` | `license: "OFL"` dans `METADATA.pb` | <https://github.com/google/fonts/tree/main/ofl/rye> |
| Oswald | `oswald-400.woff2`, `oswald-500.woff2`, `oswald-700.woff2` | `license: "OFL"` dans `METADATA.pb` | <https://github.com/google/fonts/tree/main/ofl/oswald> |
| Barlow | `barlow-400.woff2`, `barlow-500.woff2`, `barlow-600.woff2` | `license: "OFL"` dans `METADATA.pb` | <https://github.com/google/fonts/tree/main/ofl/barlow> |

**SIL Open Font License 1.1** — texte intégral dans [`docs/licenses/OFL-1.1.txt`](licenses/OFL-1.1.txt).
Copyrights : Rye © 2011 Sorkin Type Co (*Reserved Font Name « Rye »*) ; Oswald © 2016 The Oswald
Project Authors ; Barlow © 2017 The Barlow Project Authors.

Sous-ensembles latins uniquement, **169 Ko** au total, embarqués dans
`hellfest-2027/assets/fonts/`.

### 8.2 Aucune autre ressource externe

- **Aucune image** dans le prototype : les graphismes sont des SVG en ligne, des dégradés CSS et
  un canvas de particules.
- **Aucun fichier audio** : le son est synthétisé par l'API Web Audio.
- **Aucune bibliothèque** : pas de `package.json`, pas de `node_modules`.
- **Aucune ressource distante** au chargement : les polices sont embarquées.

### 8.3 Sources consultées

Voir [README §11.2](../README.md#112-sources-consultées-pour-létude-des-cinq-organisations) pour
le tableau complet et les dates. Toutes les consultations datent du **27 octobre 2026**.

### 8.4 Ce qui n'est pas réutilisé

Aucun logo, affiche, photographie, vidéo, morceau musical, slogan, texte de marque ou code
graphique des organisations étudiées. Les seuls éléments empruntés sont des **noms propres
d'organisations et de lieux**, et des **faits d'histoire publique**, tous cités avec leur source
dans « La Colonne » du produit.

---

## 9. Limites et ce qui reste à faire

### 9.1 Limites de la méthode

| Limite | Conséquence |
|---|---|
| L'onglet de test intégré n'exposait aucune surface visible | Pas de revue visuelle possible pendant la construction ; un défaut de rendu a pu subsister jusqu'à la dernière passe |
| Les tests n'ont porté que sur Chromium | Comportements Safari / Firefox / Edge inconnus |
| Aucun appareil physique | Cibles tactiles vérifiées par mesure, pas au doigt |
| Aucune sortie de lecteur d'écran | L'accessibilité est vérifiée **structurellement**, pas à l'oreille |
| La recherche web a porté sur les sites au moment de la consultation | Les contenus officiels évoluent ; les dates de consultation sont indiquées |

### 9.2 Limites du produit

- Panier et billetterie : **simulation** assumée, sans transaction.
- Programme, groupes, horaires, dates, lieu, fréquentation : **fiction**, marquée comme telle
  dans l'interface.
- Bande sonore : **synthèse abstraite**, pas une restitution d'ambiance réelle.
- Rite de l'Autel : jouable mais **visuellement défectueux** ([§6.2](#62-défaut-trouvé-pendant-la-passe-de-documentation--non-corrigé)).
- Pas d'export du programme personnel ni des fragments.
- Pas de mode hors ligne ni d'application installable.
- Frise des Archives non adaptée au très petit écran (elle reste horizontale).

### 9.3 Suite possible, par priorité

1. Corriger l'horloge du marqueur de l'Autel, puis rejouer la capture `04`.
2. Ajouter des **tests de non-régression sur le rendu** : position du marqueur dans la piste,
   largeur des cibles tactiles, contraste calculé des textes secondaires.
3. Rejouer la campagne de captures sur **Firefox** et **Safari**, et sur un téléphone réel.
4. Produire un **esquisse de parcours** — neuf écrans, trois modes — en le présentant
   explicitement comme une reconstruction tardive et non comme une preuve antérieure.
5. Mesurer et publier un **budget de performance** : poids total, requêtes, temps de premier
   rendu.
6. Ajouter l'export local du programme personnel et des fragments.
