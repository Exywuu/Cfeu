# HELLFEST 2027 — « Le Centième Feu »

> **Concept indépendant et non officiel. Édition anniversaire 2027 entièrement fictive.**
> Ce prototype n'a été ni commandé, ni validé, ni produit par le Hellfest ou sa société.
> Il ne remplace pas le site officiel, ne crée aucune transaction et ne collecte aucune donnée personnelle.

Prototype d'expérience web expérientiel réalisé pour l'épreuve « Live Experience 2027 — Creative Web Experience Challenge 01 ».

---

## 1. Lancer le prototype

**Option 1 — serveur fourni (recommandé)**

```bash
cd hellfest-2027
node serve.js          # http://localhost:4177/
node serve.js 8080     # autre port
```

**Option 2 — ouverture directe**

`index.html` s'ouvre directement dans un navigateur (`file://`). Les scripts sont des scripts
classiques, sans modules ni requêtes réseau : le prototype fonctionne hors ligne.

Aucun `npm install`, aucune dépendance, aucun service payant, aucune API, aucun compte,
aucune clé. La seule ressource téléchargée à la construction est le sous-ensemble latin
de trois polices libres (SIL OFL), embarqué dans `assets/fonts/`.

---

## 2. Le choix de candidat

Les cinq organisations ont été étudiées sur leurs sources publiques. Comparaison brève :

| Candidat | Nature réelle | Univers | Force du système visuel | Faiblesse numérique Repérée |
|---|---|---|---|---|
| **Shen Yun** | Compagnie théâtrale itinérante (danse classique chinoise + orchestre) | Impérial, Tried, patronage, projection patentée | Palette impériale (pourpre, or, parchemin), typographie serif élégante | Contenu rendu en JS, programme non indexé, parcours « ticket d'abord » |
| **Cirque du Soleil** | Groupe de cirque théâtral (tournée + résidences) | Mondes thématiques fermés, acrobatie, Scenario | Très fort, mais très contraint : identité lourde, sept verticales concurrentes | Accueil = moteur de recherche, pas de récit ; pas d'archive ni de timeline |
| **Country Jam** | Festival country local (ranch, Colorado) | Americana, road trip, coucher de soleil, camping | Palette solaire, typographie western lisible | Site générique (WordPress), contenu figé, **aucun programme horaire** |
| **Hellfest** | Festival metal (Clisson, Loire-Atlantique) | Monumental, feu, os, six scènes, place publique, communauté « Hellbangers » | **Le plus cohérent** : type gravé, os / sang / noir, symbole fort, monde habité | Contenu fractionné entre site et application ; horaires hors site ; peu de récit |
| **Lollapalooza Stockholm** | Édition locale d'une franchise mondiale | Carnaval urbain, collage, lollipop | Flexible, collage graphique, lignée iconique | Site quasi mort (page d'attente), pas de programmation ni d'historique |

### Pourquoi Hellfest

Ce n'est ni l'organisation la plus célèbre (Cirque du Soleil), ni la plus riche en actifs
(Shen Yun), ni la plus simple (Country Jam). C'est celle dont **l'univers se prête le mieux
à une expérience numérique originale** :

1. **Un monde déjà construit.** Clisson Rock City n'est pas un décor de festival : c'est une
   place publique avec un marché, une entrée, des zones, des noms de scènes. Un site
   « de festival » classique doit inventer cette spatialité ; ici, elle existe.
2. **Six scènes, six identités sonores et visuelles.** Warzone n'est pas Valley n'est pas
   Temple : la marque possède une vraie taxonomie, donc un vrai terrain d'expérimentation
   (et une autre de limites : il ne faut pas les confondre).
3. **Un rituel communautaire réel.** Le « Hellbanger » n'est pas un artefact marketing : c'est une
   communauté auto-nommée. C'est matière à narration, pas à catalogue.
4. **Des failles numériques nettes.** Les horaires vivent dans l'application, l'histoire
   n'existe nulle part, le site n'explique pas « ce que ça fait » d'être là. Un prototype
   d'expérience a donc un vrai sujet, et pas seulement un beau formulaire de billetterie.
5. **Un sujet qui demande de la curiosité, pas du spectaculaire.** L'enjeu n'est pas de faire
   « gros » : c'est de faire **`entrer`** dans un lieu hostile et immersif. C'est exactement le
   terrain d'un directeur artistique, d'un concepteur d'expérience interactive, d'un designer
   UX, d'un développeur et d'un stratège de marque réunis sur un même prototype.

**La question qui a fait basculer le projet** : le Hellfest compte ses éditions, pas ses
ans — et son nom lui-même (« hell ») ne raconte rien d'exploitable sur le web. L'écart
« festival / site web » était le vrai sujet de conception.

### Ce que l'on a réellement observé du site officiel

L'inspection mobile/desktop a été faite **par la structure technique, pas par l'image** :

- `hellfest.fr` sert **une application unique**, identique pour les user-agents mobile et
  desktop (347 784 octets dans les deux cas). Il n'existe **pas** de version mobile séparée.
- La feuille de style principale (`entry.DRSX6o_s.css`) contient 99 règles `@media` avec
  des points de rupture à 768, 1 440 et 1 500 px.
- Elle ne contient **aucune** règle `prefers-reduced-motion` : les animations du site
  officiel ne sont pas désactivables par le réglage système. C'est l'occurrence retenue
  pour justifier l'existence d'un vrai réglage « mouvement réduit » dans ce prototype.
- **Limite assumée** : le navigateur de vérification exposait une fenêtre de 0 × 0 pixel
  lorsqu'une capture était demandée. Aucune comparaison visuelle du rendu officiel n'a
  donc pu être faite, sur mobile comme sur desktop. Ce qui est ci-dessus est une mesure
  de fichiers, pas une lecture d'écran.

---

## 3. L'édition fictive : « Le Centième Feu »

**Hellcity ne compte pas les années : elle compte les feux.**

Le centième feu s'allume en 2027. Pour l'occasion, les Portes s'ouvrent **à l'envers** :
on entre par la dernière scène, on descend, et on ne remonte pas les mêmes qu'on est descendu.

La règle (entièrement inventée, explicitement présentée comme telle) tient en trois gestes :

1. **Entrer à l'envers** — la descente est l'inverse du programme habituel.
2. **Récolter** — chaque scène visitée retient une étincelle ; six scènes, six étincelles.
3. **Descendre** — une septième scène, absente de tout plan officiel, ne s'ouvre qu'aux
   porteurs des six étincelles.

**Éléments inventés** : le titre, la règle, la septième scène « La Fosse », les dates
(19–22 août 2027), la programmation (42 groupes), les passes et les tarifs, les archives
postérieures à 2006, les témoignages, les chiffres.
**Éléments vérifiés et réutilisés** : la création en 2006 à Clisson, les six scènes et leurs
familles musicales, le Hellcity Square, la communauté « Hellbangers », l'existence d'une
édition 2027 — qui est **réelle et de juin** : ce concept est volontairement distinct, et
la mention en est affichée dans l'interface et dans « La Colonne ».

---

## 4. Les trois modes de découverte

### A · La Descente — expérience immersive principale
`#/descente` — plein écran, sept scènes, **un rite par scène** :

| Scène | Rite | Équivalent clavier |
|---|---|---|
| Hellstage | Scanner le laissez-passer | Entrée / Espace sur le scanner |
| Mainstages | Viser trois balises | Tab jusqu'à chaque balise, Entrée |
| Warzone | Décoller trois affiches abrégées sur douze | Tab + Entrée sur les affiches |
| Valley | Maintenir le souffle (5 respirations en alternative) | Espace maintenu, ou bouton « cinq respirations » |
| Altar | Frapper le marqueur dans le cercle (mode fixe en mouvement réduit) | Espace / Entrée |
| Temple | Retourner cinq bougies | Tab + Entrée |
| **La Fosse** | Finale : le Centième Feu s'allume | — |

Chaque scène a sa palette, sa géométrie de décor (dégradés CSS, SVG), son rythme. La Fosse
reste verrouillée tant que les six étincelles ne sont pas récoltées.

### B · Archives de Minuit — seconde découverte, radicalement différente
`#/archives` — une frise horizontale de huit chapitres (2006 → 2027) : un récit **par la
durée** là où la Descente est **spatiale**. Chaque chapitre a son emblème SVG généré, sa
palette, son texture sonore. La frise se parcourt au clavier (flèches gauche et droite
chapitre par chapitre, Origine et Fin pour les extrémités, Page Haut et Page Bas par
deux chapitres) comme au doigt et à la souris ; le chapitre courant est annoncé dans un
`role="status"`. Le visiteur peut y laisser un **fragment de souvenir**, stocké
localement et jamais transmis.

### C · Pratique — accès direct
`#/pratique` et `#/programme` — programme par jour et par scène (filtres, 68 rendez-vous),
« Mon festival » (programme personnel, local), **Les lieux** (dix repères de Clisson Rock
City, chacun rattaché à une scène ou à un service), passes et panier **simulé**, accès et
transports, modalités de participation, accessibilité, FAQ.

### La Colonne — la transparence comme partie du produit
`#/colonne` — ce qui est vérifié (avec sources), ce qui est inventé, ce que je n'ai pas pu
accéder, comment le prototype est construit, et les réglages de confort.

---

## 5. Fonctionnalités réellement implémentées

- Routage par ancre, six vues, navigation au clavier complète.
- **Descente** : sept rites interactifs distincts, progression persistante en session,
  verrou de la Fosse, navigation clavier, `Échap` pour quitter, focus déplacé à chaque scène.
- **Archives** : frise horizontale à défilement natif, navigation clavier chapitre par
  chapitre, chapitre courant détecté au scroll, bascule de texture sonore, mur local
  de témoignages (jamais transmis).
- **Programme** : 4 jours × 6 scènes, 68 rendez-vous fictifs, filtres, ajout au programme
  personnel (localStorage), vidage.
- **Pratique** : 4 passes, panier de démonstration, total calculé, validation simulée.
- **Colonne** : réglages « mouvement réduit », « contraste renforcé », « ambiance sonore ».
- **Pratique** : dix lieux fictifs (la Place, le Seuil, les Deux Tours, le Mur, la Vallée,
  l'Autel, le Temple, la Fosse, le Camp, la Navette) servant de repères dans la Descente.
- Ambiance sonore **entièrement synthétisée** (Web Audio : oscillateurs, filtres, bruit,
  compresseur) — aucun fichier audio, aucun morceau protégé, **éteinte par défaut**.
- Aucun visuel importé : tout est généré (SVG, Canvas, CSS). Aucun logo, aucune affiche,
  aucune photographie reprise.

---

## 6. Accessibilité

- Lien d'évitement, `aria-live` sur la progression, `role="status"` sur les annonces.
- Focus toujours visible (`:focus-visible`, contour 3 px ambre) ; chaque rite a son
  équivalent clavier ; `Échap` ferme la Descente.
- **Mouvement réduit** : respect du réglage système *et* d'un réglage applicatif — les
  transitions, pulsations et parallaxes sont neutralisées, le rite rythmique passe en
  version fixe, rien n'est perdu d'information.
- **Contraste renforcé** disponible en un clic ; palette de base testée à ≥ 4,5:1 sur le corps de texte.
- Son optionnel, éteint par défaut, coupable d'un clic ; toute l'information est portée par le texte.
- Aucun compte, aucune collecte ; le stockage est local et effaçable (panier, programme, préférences, fragments).

---

## 7. Structure du projet

```
hellfest-2027/
├── index.html              squelette, en-tête, pied de page, mentions
├── serve.js                serveur statique sans dépendance
├── README.md               ce document
├── SESSION.md              bilan de session (environnement, tests, limites)
└── assets/
    ├── css/main.css        système de design, décors par scène, responsive
    ├── fonts/              Rye, Oswald, Barlow — sous-ensembles latins (SIL OFL)
    └── js/
        ├── data.js         tout le contenu : scènes, artistes, programme, archives, FAQ
        ├── audio.js        moteur sonore procédural (Web Audio)
        ├── app.js          routeur, vues, outils pratiques, homepage
        └── modes.js        Mode A (Descente) et Mode B (Archives)
```

---

## 8. Crédits et licences

- **Polices** : Rye, Oswald, Barlow — SIL Open Font License 1.1, sous-ensembles latins
  redistribués dans `assets/fonts/`.
- **Code, textes, visuels, sons** : création originale de ce prototype.
- **Hellfest** est une marque de son détenteur. Ce prototype n'est ni officiel, ni
  commandité, ni affilié. Aucune ressource de l'organisation (logo, affiche, photo,
  vidéo, morceau, slogan, code graphique) n'a été reproduite.

---

## 9. Limites connues

- La billetterie est une **simulation** : aucun paiement, aucun envoi, aucun compte.
- Le son est une **synthèse abstraite**, pas un rendu de l'ambiance réelle du festival.
- La programmation est **inventée** ; elle ne reflète aucune intention de l'organisation.
- Le prototype n'a pas été testé sur un appareil physique ni dans un second navigateur
  (voir `SESSION.md` pour le détail exact de ce qui a été vérifié).
- Aucune capture d'écran n'a pu être produite : le navigateur de vérification exposait une
  fenêtre de 0 × 0 pixel. La mise en page a été contrôlé par mesures géométriques
  (débordement horizontal, positions, tailles de cibles) plutôt que visuellement.
- La comparaison mobile/desktop du site officiel porte sur sa structure technique
  uniquement ; aucune comparaison visuelle du rendu officiel n'a été réalisée.
