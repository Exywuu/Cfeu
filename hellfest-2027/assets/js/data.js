/* =========================================================================
   HELLFEST 2027 — « Le Centième Feu »
   DONNÉES DE CONTENU.
   Convention de marquage :
     status 'verifie' → information factuelle relevée sur une source publique
     status 'fiction'  → invention créative propre à ce concept
   Aucun contenu réel de billetterie, aucun actif protégé repris.
   ========================================================================= */

const DATA = {
  meta: {
    title: 'Le Centième Feu',
    year: 2027,
    dates: '19 — 22 août 2027',
    place: 'Clisson (Loire-Atlantique) · Clisson Rock City',
    edition: 'Édition anniversaire fictive',
    tagline: 'Hellcity ne compte pas les années. Elle compte les feux.',
    claim: 180000,
    scenes: 6,
    secretScene: 'La Fosse',
    notice: 'Concept indépendant et non officiel. Édition anniversaire 2027 entièrement fictive.'
  },

  /* ---------------------------------------------------------------------
     LES SIX SCÈNES RÉELLES (vérifiées) + LA FOSSE (fiction)
     --------------------------------------------------------------------- */
  scenes: [
    {
      id: 'hellstage', name: 'Hellstage', order: 1, kind: 'Seuil — scène d’entrée de Hellcity Square',
      real: true, accent: '#ff7a18', ink: '#f1e5c0',
      fiction: 'Scène d’ouverture : trois artistes locaux par soir, l’entrée du village, et le scanner de billet.',
      prompt: 'Frôlez le seuil. Faites passer votre laissez-passer.',
      artists: ['PREMIER FEU', 'LOCALX EN FEU', 'LES TROIS HEURES', 'SCÈNE OUVERTE', 'CHANTIER', 'PETIT FEU']
    },
    {
      id: 'mainstage', name: 'Mainstages', order: 2, kind: 'Les deux grandes scènes jumelles',
      real: true, accent: '#e5212d', ink: '#ffe9d0',
      fiction: 'Les deux tours Ego et Inferno montent et descendent en alternance, décalées d’un quart d’heure.',
      prompt: 'Visez les trois balises avec le faisceau.',
      artists: ['VELVORNE', 'SÉVÉRIE', 'RØSTKAMMER', 'CARNAGE FAMILY', 'ASHES OF MARS', 'SIXIÈME TOUR', 'HÉLÈNE NOIRE', 'ORTHODOXE 88']
    },
    {
      id: 'warzone', name: 'Warzone', order: 3, kind: 'Punk, hardcore, crossover',
      real: true, accent: '#ff4d2e', ink: '#ffd9c9',
      fiction: 'Le Mur : 64 affiches xéroxées collées chaque matin. Les vraies sont lesabbrévées en trois lettres.',
      prompt: 'Trouvez les trois affichesabbrégées.',
      artists: ['CASSE-TÊTE', 'TRENTE ET UN', 'VESTIAIRE ROUGE', 'PESTICIDE', 'MONTÉE DE FIÈVRE', 'RATATONK', 'LA MAIN DANS LE MOTEUR']
    },
    {
      id: 'valley', name: 'Valley', order: 4, kind: 'Stoner, doom, post-metal',
      real: true, accent: '#8f7fd6', ink: '#ded6ff',
      fiction: 'La Vallée est une fosse en contrebas. L’air y est plus lourd. On y respire plus lentement.',
      prompt: 'Maintenez. Respirez jusqu’à ce que la brume se lève.',
      artists: ['MØLTCRAYON', 'PIERRE LENTE', 'VALLÉE MORTE', 'KALF', 'NUAGE ACIDE', 'DOUZE TONNES', 'SÈVE NOIRE']
    },
    {
      id: 'altar', name: 'Altar', order: 5, kind: 'Death, grind, brutal',
      real: true, accent: '#c9c0a6', ink: '#f4ecd4',
      fiction: 'L’Autel n’a pas de public assis. Le décor est un os. Il faut frapper en rythme pour l’ouvrir.',
      prompt: 'Frappez le centre. Trois fois.',
      artists: ['OSSUAIRE 9', 'GRIMDIGNE', 'FOIE DE FER', 'MOUTON SACRÉ', 'VISCÈRES', 'TROU NOIR', 'ABATTAGE']
    },
    {
      id: 'temple', name: 'Temple', order: 6, kind: 'Black metal, pagan, rituel',
      real: true, accent: '#9ad3c8', ink: '#e6fff9',
      fiction: 'On y entre pieds nus. Les bougies sont retournées, la mèche en bas. La tradition des Six Portes.',
      prompt: 'Retournez les cinq bougies.',
      artists: ['TROMPETTE NOIRE', 'CENDRE VIVE', 'CERCLE NOIR', 'HIVERNE', 'LOUANGE POUR RIEN', 'VEILLE DES CENDRES']
    },
    {
      id: 'fosse', name: 'La Fosse', order: 7, kind: 'Scène supplémentaire — dernière porte',
      real: false, accent: '#ffc061', ink: '#fff3d6',
      fiction: 'La Fosse n’existe sur aucun plan officiel. Elle s’ouvre au Centième Feu, aux seuls porteurs des six étincelles. On y descend, on n’en remonte pas : on en sort transformé.',
      prompt: 'Le Centième Feu est allumé. Descendez.',
      artists: ['LE CENTIÈME FEU', 'ANCIENNE MESURE', 'SILENCE DES CENDRES']
    }
  ],

  /* ---------------------------------------------------------------------
     GRILLE HORAIRE FICTIVE
     --------------------------------------------------------------------- */
  days: [
    { id: 'j1', label: 'Jour 1', date: 'mer. 19 août', note: 'Ouverture des Portes' },
    { id: 'j2', label: 'Jour 2', date: 'jeu. 20 août', note: 'La Nuit Blanche' },
    { id: 'j3', label: 'Jour 3', date: 'ven. 21 août', note: 'Jour du plus grand affluence' },
    { id: 'j4', label: 'Jour 4', date: 'sam. 22 août', note: 'Clôture — les Portes se ferment' }
  ],

  /* grille : scène → jours → heures. Le rotation d’artistes est déterministe. */
  grid: {
    hellstage: { j1: ['16:00', '17:15', '18:30'], j2: ['17:00', '18:30'], j3: ['16:00', '17:15', '18:30'], j4: ['17:00', '18:30'] },
    mainstage: { j1: ['19:00', '20:45', '22:30'], j2: ['18:30', '20:00', '21:45', '23:30'], j3: ['18:30', '20:00', '21:45', '23:30'], j4: ['19:00', '20:45', '22:30'] },
    warzone:  { j1: ['17:30', '19:00', '20:30'], j2: ['17:00', '18:30', '20:00', '21:30'], j3: ['17:30', '19:00', '20:30'], j4: ['17:30', '19:00', '20:30'] },
    valley:   { j1: ['18:00', '19:30'], j2: ['18:30', '20:15', '22:00'], j3: ['18:00', '19:30', '21:15', '22:45'], j4: ['18:30', '20:15', '22:00'] },
    altar:    { j1: ['17:00', '18:30'], j2: ['17:30', '19:00', '20:30'], j3: ['17:00', '18:30', '20:00', '21:30'], j4: ['17:30', '19:00'] },
    temple:   { j1: ['21:00'], j2: ['19:30', '21:15'], j3: ['19:00', '20:45', '22:30'], j4: ['19:30', '21:15'] }
  },

  /* tête d’affiche choisie pour la dernière plage de chaque scène et jour */
  headliners: {
    hellstage: { j1: 'LOCALX EN FEU', j2: 'SCÈNE OUVERTE', j3: 'PREMIER FEU', j4: 'PETIT FEU' },
    mainstage: { j1: 'VELVORNE', j2: 'RØSTKAMMER', j3: 'CARNAGE FAMILY', j4: 'SÉVÉRIE' },
    warzone: { j1: 'TRENTE ET UN', j2: 'PESTICIDE', j3: 'VESTIAIRE ROUGE', j4: 'MONTÉE DE FIÈVRE' },
    valley: { j1: 'PIERRE LENTE', j2: 'NUAGE ACIDE', j3: 'KALF', j4: 'VALLÉE MORTE' },
    altar: { j1: 'OSSUAIRE 9', j2: 'GRIMDIGNE', j3: 'FOIE DE FER', j4: 'MOUTON SACRÉ' },
    temple: { j1: 'TROMPETTE NOIRE', j2: 'CERCLE NOIR', j3: 'HIVERNE', j4: 'CENDRE VIVE' }
  },

  genres: {
    hellstage: ['rock local', 'punk garage', 'hardcore'], mainstage: ['metal', 'metalcore', 'industrial metal'],
    warzone: ['punk', 'hardcore', 'crossover'], valley: ['stoner', 'doom', 'post-metal'],
    altar: ['death metal', 'grind', 'brutal'], temple: ['black metal', 'pagan', 'rituel noise']
  },

  /* ---------------------------------------------------------------------
     PASSES (simulation, aucun service réel)
     --------------------------------------------------------------------- */
  passes: [
    { id: 'quatre', name: 'Pass Quatre Feux', price: 412, note: '4 jours · 6 scènes · camping inclus',
      list: ['Les quatre jours, toutes scènes', 'Camping sur le site (emplacement 4 pers.)', 'Entrée Hellstage illimitée', 'Navette gare ↔ festival'] },
    { id: 'sillage', name: 'Pass Sillage', price: 168, note: '4 jours · hors camping',
      list: ['Les quatre jours, toutes scènes', 'Camping en option (supplément)', 'Accès Hellcity Square', 'Navette gare ↔ festival'] },
    { id: 'braise', name: 'Pass Braise', price: 96, note: '1 jour · à l’unité',
      list: ['Une journée, toutes scènes', 'Entrée Hellstage illimitée', 'Sans camping', 'Navette gare ↔ festival'] },
    { id: 'cendre', name: 'Pass Cendre', price: 48, note: 'Jeudi d’ouverture · Hellcity uniquement',
      list: ['Accès Hellcity Square', 'Scène d’ouverture incluse', 'Accès au Mur', 'Sans camping, sans navette'] }
  ],

  /* ---------------------------------------------------------------------
     LES LIEUX (fiction) — le site de Clisson Rock City, inventé
     --------------------------------------------------------------------- */
  venues: [
    { n: 'La Place', k: 'Hellcity Square', s: 'Le centre de tout : marché de nuit, stands de tatouage, ATM, food-trucks, et la scène d’ouverture qui borde le vide central. Ouverte avant l’aube, fermée à la dernière braise.', fic: true },
    { n: 'Le Seuil', k: 'Hellstage', s: 'L’entrée du village. Trois files, un scanner, un poing à serrer. C’est ici qu’on conquiert son bracelet d’entrée, fictif et nominatif.', fic: true },
    { n: 'Les Deux Tours', k: 'Mainstages', s: 'Deux mâts de quarante-deux mètres séparés par une place. Ils montent et descendent en alternance : on entend un groupe pendant qu’on voit l’autre. L’acoustique change à chaque bascule.', fic: true },
    { n: 'Le Mur', k: 'Warzone', s: 'Le pignon sud de la place, tapissé d’affiches xéroxées changées chaque matin à six heures. Trois d’entre elles sont abrégées. Les autres portent un nom entier.', fic: true },
    { n: 'La Vallée', k: 'Valley', s: 'Une fosse naturelle de douze mètres sous le niveau de la place. On y descend par une rampe de terre battue. Le son y arrive étouffé, l’air plus lourd, la poussière suspended.', fic: true },
    { n: 'L’Autel', k: 'Altar', s: 'Un hangar de tôle, un trou dans le sol, un os de quatre mètres planté au centre. Aucun public assis. Trois frappes justes ouvrent la grille.', fic: true },
    { n: 'Le Temple', k: 'Temple', s: 'Une grange basse en pierre, à l’écart du circuit, où l’on entre pieds nus. Les bougies sont retournées, la mèche en bas. Interdit aux appareils photo.', fic: true },
    { n: 'La Fosse', k: 'scène fictive', s: 'Sous l’Autel. Un cylindre de béton de huit mètres de diamètre, sans gradins, sans nom sur aucune porte, sans entrée visible depuis le site. Seuls ceux qui portent les six étincelles la trouvent. Elle n’existe sur aucun plan.', fic: true },
    { n: 'Le Camp', k: 'camping', s: 'Quatre-vingts hectares de prairie derrière la RN 148. Emplacements de quatre personnes, zones dégradées bruyantes, douches tièdes, un seul point d’eau potable. Les poêles à bois sont interdites.', fic: true },
    { n: 'La Navette', k: 'transports', s: 'Six bus électriques de la gare de Clisson au site, toutes les vingt minutes de quinze heures à trois heures du matin. Arrêt unique, terminus : « Clisson Rock City ».', fic: true }
  ],

  /* ---------------------------------------------------------------------
     FAQ
     --------------------------------------------------------------------- */
  faq: [
    { q: 'Est-ce une vraie édition du Hellfest ?',
      a: 'Non. Rien sur ce site n’est commandité, validé ou produit par le Hellfest ou par sa société. « Le Centième Feu » est une édition anniversaire entièrement fictive, imaginée pour un exercice de création. Le Hellfest a par ailleurs annoncé de son côté une édition 2027 qui se tiendra du 17 au 20 juin 2027 à Clisson — cet événement-là est distinct de celui décrit ici, qui se fictionne du 19 au 22 août 2027.' },
    { q: 'Peut-on vraiment acheter un pass ?',
      a: 'Non. Le panier est une démonstration : il enregistre votre sélection dans votre navigateur (localStorage), sans paiement, sans compte, sans envoi de donnée. Rien ne part sur un serveur.' },
    { q: 'Les artistes du programme existent-ils ?',
      a: 'Non. Tous les groupes, les titres et les horaires de « Le Centième Feu » sont des créations fictives. Les noms de scènes, la ville, la structure du festival et le vocabulaire Hellbanger s’appuient, eux, sur des éléments publics vérifiables — voir « La Colonne ».' },
    { q: 'D’où vient la règle du Centième Feu ?',
      a: 'De nulle part : c’est une règle inventée pour ce concept. Elle sert de colonne vertébrale à l’expérience de « La Descente » : on traverse les scènes dans l’ordre, on y récolte une étincelle, et la septième scène — La Fosse — ne s’ouvre qu’une fois les six étincelles réunies.' },
    { q: 'Le son est-il nécessaire à l’expérience ?',
      a: 'Non. Il est éteint par défaut et se pilote depuis « Archives de Minuit ». Les deux modes immersifs sont entièrement fonctionnels sans son ; les documents audio sont générés à la volée par l’interface, sans aucun morceau enregistré ni protégé.' },
    { q: 'Puis-je naviguer au clavier uniquement ?',
      a: 'Oui. Toutes les interactions de « La Descente » ont un équivalent clavier : Espace ou Entrée pour valider, Tab pour changer de cible, flèches pour les cibles qui le permettent. Le focus est toujours visible.' },
    { q: 'J’aireduced motion activé sur mon système : que change-t-il ?',
      a: 'Les transitions, les pulsations et les parallaxes sont neutralisées. Le grain de la trame est allégé, le halo des braises est figé, et toutes les informations restent accessibles sans animation. Rien n’est perdu : lesSix Portes s’ouvrent toujours.' },
    { q: 'Y a-t-il des données personnelles collectées ?',
      a: 'Aucune. Le seul stockage est local à votre navigateur : votre programme personnel (« Mon festival »), votre panier de démonstration, le son activé ou non, et les éventuels témoignages que vous choisissez d’écrire — qui restent sur votre machine et peuvent être effacés d’un clic.' }
  ],

  /* ---------------------------------------------------------------------
     INFOS PRATIQUES (2027 = fiction)
     --------------------------------------------------------------------- */
  practical: {
    access: [
      { t: 'En train', d: 'Gare de Clisson à 10 min à pied du site. Navettes Navette à traction électrique, toutes les 20 min, de 15h à 3h du matin, sur présentation du pass. Arrêt unique : « Clisson Rock City ».', fic: true },
      { t: 'En voiture', d: 'Aire de stationnement sur la RN 148, 1 800 places, 25 €/24 h, gratuit pour les Pass Quatre Feux et Sillage. Le site est à 20 min en voiture de la sortie 15 de l’A83.', fic: true },
      { t: 'En covoiturage', d: 'Zone de dépose-minute devant l’entrée nord, 15 places, réallocation continue par un agent. L’accès en covoiturage (4 personnes minimum) ouvre droit à un tarif de camping réduit.', fic: true },
      { t: 'À vélo', d: '28 rackings éclairés sur le pourtour du Hellcity Square. Verrouillage gratuit sur présentation d’un pass.', fic: true }
    ],
    accessiblity: [
      { t: 'Handicap visuel', d: 'Les six scènes sont dotées d’un guidage audio alternatif sur demande au poste d’accueil (casque et bouton poussoir, sans frais). Un parcours « Son » de la Descente décrit chaque scène à voix haute.' },
      { t: 'Handicap moteur', d: 'Cheminements de plain-pied ou de pente douce entre l’entrée et les scènes, rampes d’accès, aires de repos regulières et banquettes réservées.' },
      { t: 'Surdité', d: 'Le programme du festival est publié en format texte et en format « FM » (fréquence de régie dédiée) : tout changement d’horaire est annoncé en simultané sur les panneaux et dans l’application.' },
      { t: 'Fatigue et seniors', d: 'Chaînes de cinq minutes entre chaque scène, bancs ombragés dans le Hellcity Square, plateau-repas « Fatigue » réservé en ligne sur présentation d’un justificatif.' },
      { t: 'Neurodiversité', d: 'Un espace calme ouvert 24 h/24 hors zone sonore, casques anti-bruit loanés gratuitement au poste d’accueil, et créneaux de programming annoncés avec 15 min d’avance.' }
    ]
  },

  /* ---------------------------------------------------------------------
     ARCHIVES DE MINUIT — récit temporel
     --------------------------------------------------------------------- */
  archives: [
    { year: '2006', title: 'La naissance dans les cendres', status: 'verifie',
      text: 'Le Hellfest est créé à Clisson, en Loire-Atlantique, à la suite de l’arrêt de Furyfest. L’organisation s’installe durablement dans une ville qui ne l’attendait pas. Le nom, la ville et l’année sont vérifiables ; tout ce qui suit dans ces archives relève de la fiction.',
      quote: 'On est arrivés avec une scène et une cave. Le reste, on l’a fait dans le bruit.', witness: 'Témoignage — recréé pour ce concept',
      sound: 'drone', accent: '#8a8a8a' },
    { year: '2009', title: 'Hellcity Square', status: 'fiction',
      text: 'Le festival invente une place publique : le Hellcity Square, cœur de marché, de tatouage, de gueules et de brocante, ouvert avant l’aube. C’est là que la communauté s’est nommée elle-même — les Hellbangers.',
      quote: 'Le camp, c’est où on dort. La place, c’est où on existe.', witness: 'Témoignage — recréé pour ce concept',
      sound: 'noise', accent: '#c8873a' },
    { year: '2012', title: 'Les Six Portes', status: 'fiction',
      text: 'Six scènes plutôt que trois. Le public cesse de courir après un son et commence à choisir un quartier : le gore à l’Autel, la brume dans la Vallée, les dents sales à la Warzone.',
      quote: 'On ne descend plus dans le gore. On y va, et on en revient.', witness: 'Témoignage — recréé pour ce concept',
      sound: 'drone', accent: '#8f7fd6' },
    { year: '2016', title: 'La Nuit Blanche', status: 'fiction',
      text: 'Une nuit entière sans curfew et sans éclairage sur les pistes, où l’on naviguait à la lampe frontale. Le festival apprend que l’obscurité est aussi un décor.',
      quote: 'On ne se voyait pas. On s’entendait. C’est plus fort.', witness: 'Témoignage — recréé pour ce concept',
      sound: 'air', accent: '#9ad3c8' },
    { year: '2019', title: 'L’Année des Braises', status: 'fiction',
      text: 'La météo bascule : vent d’est, poussière rouge, ciel orange. Les photos de cette édition deviennent la mémoire visuelle du festival — un grain chaud sur des visages noirs de poussière.',
      quote: 'On est rentrés avec une braise dans la poche. On a gardé le pot.', witness: 'Témoignage — recréé pour ce concept',
      sound: 'air', accent: '#ff7a18' },
    { year: '2022', title: 'Les Portes rouvrent', status: 'verifie',
      text: 'Après deux années d’arrêt, le festival rouvre ses portes. Le retour est observé publiquement ; les chiffres et les détails de cette page relèvent toutefois de la fiction.',
      quote: 'Deux ans d’attente, et on a refait la queue à 4 h du matin comme si de rien n’était.', witness: 'Témoignage — recréé pour ce concept',
      sound: 'noise', accent: '#e5212d' },
    { year: '2025', title: 'Les Portes s’élargissent', status: 'fiction',
      text: 'Six scènes, une place qui ne désemplit plus. Le festival commence à parler d’un « dedans » et d’un « dehors » — un dehors qui dure toute la nuit.',
      quote: 'Le dehors, c’est le festival aussi. On dort mal, on reste debout, c’est comme ça.', witness: 'Témoignage — recréé pour ce concept',
      sound: 'drone', accent: '#ff4d2e' },
    { year: '2027', title: 'Le Centième Feu', status: 'fiction',
      text: 'Hellcity ne compte pas les années : elle compte les feux. Cent feux allumés depuis 2006. Le centième s’allume en août 2027, et pour l’occasion les Portes s’ouvrent à l’envers : on entre par la dernière scène et on descend jusqu’à la Fosse.',
      quote: 'On ne descend pas pour voir un groupe. On descend parce qu’on l’a mérité.', witness: 'Témoignage — recréé pour ce concept',
      sound: 'fire', accent: '#ffc061' }
  ],

  /* ---------------------------------------------------------------------
     LA COLONNE — séparation vérifié / fiction / hypothèse
     --------------------------------------------------------------------- */
  colophon: {
    verified: [
      { t: 'Hellfest est un festival créé en 2006 à Clisson (Loire-Atlantique), à la suite de l’arrêt de Furyfest.', s: 'hellfest.fr — page « The Festival » / Wikipédia (vérifié en ligne)' },
      { t: 'Les six scènes : Mainstages 1 et 2, Warzone, Valley, Altar, Temple, plus Hellstage à l’entrée. Chaque scène porte une identité musicale qui lui est propre.', s: 'hellfest.fr — grille de programmation officielle' },
      { t: 'Le festival s’est arrêté en 2020 et 2021, puis a repris en 2022. Il revendique plusieurs centaines de milliers de spectateurs par édition.', s: 'hellfest.fr — page d’accueil et Wikipédia' },
      { t: 'L’existence d’un « Hellcity Square » (marché, ATMs, tatouage) et d’une communauté de fidèles auto-désignée « Hellbangers ».', s: 'hellfest.fr — page « Experience », Wikipédia' },
      { t: 'Hellfest a annoncé de son côté une édition 2027 du 17 au 20 juin 2027 à Clisson, avec 300+ artistes.', s: 'hellfest.fr — page d’accueil (consultée en ligne)' },
      { t: 'Le site officiel est une application unique, servie à l’identique pour les user-agents mobile et desktop (347 784 octets dans les deux cas) : 99 règles @media, points de rupture à 768, 1 440 et 1 500 px. Il n’existe pas de version mobile séparée.', s: 'hellfest.fr — feuille de style entry.DRSX6o_s.css, relevée le 27 octobre 2026' },
      { t: 'Aucune règle prefers-reduced-motion dans cette feuille de style : les animations du site officiel ne sont pas désactivables par le réglage système.', s: 'hellfest.fr — entry.DRSX6o_s.css (recherche de la chaîne)' }
    ],
    fictional: [
      { t: 'Le titre « Le Centième Feu » et sa règle rituelle (entrer à l’envers, récolter six étincelles, ouvrir la septième scène).' },
      { t: 'Les dates du 19 au 22 août 2027 — volontairement distinctes de l’édition officielle de juin 2027.' },
      { t: 'La septième scène « La Fosse », son accès et son contenu.' },
      { t: 'Les 40 groupes, les horaires, les six passes, les tarifs et les services de restauration' },
      { t: 'L’ensemble des archives après 2006 et 2022, ainsi que les témoignages.' },
      { t: 'Les chiffres de fréquentation, de capacité de camping et d’attente.' }
    ],
    unreachable: [
      { t: 'La programmation officielle 2027 dans son détail : au moment de la consultation, le site n’affichait que l’annonce de dates et le nombre d’artistes, pas les noms.' },
      { t: 'Les internes de Hellfest (billetterie, budget, logistique) : non consultés, non sollicités.' },
      { t: 'Les chiffres de fréquentation de 2022 : les sources publiques se contredisent (ordre de grandeur affiché sur le site, chiffres différents dans les bases de données), sans être réconciliés.' },
      { t: 'Aucune inspection visuelle n’a été faite sur un mobile réel ni sur un autre navigateur que le moteur utilisé pour cette vérification.' },
      { t: 'La comparaison mobile/desktop du site officiel porte uniquement sur sa structure technique (requête HTTP, feuille de style, points de rupture, poids du payload). Aucune capture d’écran ni comparaison visuelle du rendu officiel n’a pu être réalisée : le navigateur de vérification exposait une fenêtre de 0 × 0 pixel.' }
    ]
  },

  /* ---------------------------------------------------------------------
     CONFORT / OPTIONS
     --------------------------------------------------------------------- */
  options: [
    { id: 'reduced', label: 'Mouvement réduit', note: 'Coupe transitions, pulsations et parallaxe. Le contenu reste intégral.' },
    { id: 'sound', label: 'Ambiance sonore', note: 'Nappe et percussions synthétisées, générées en direct. Éteinte par défaut.' },
    { id: 'contrast', label: 'Contraste renforcé', note: 'Accentue les contrastes et la lisibilité du texte.' }
  ]
};
