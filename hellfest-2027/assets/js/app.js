/* =========================================================================
   HELLFEST 2027 — « Le Centième Feu »
   APPLICATION : routeur, vues, outils pratiques (programme, panier, confort).
   ========================================================================= */

const App = (function () {
  const main = document.getElementById('main');
  const toastEl = document.getElementById('toast');
  const views = {};
  let currentRoute = '';
  let lastPath = '/';

  /* ---------- Utilitaires ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function store(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* ignore */ } }
  function read(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } }
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2600);
  }
  function reducedMotion() {
    const forced = document.documentElement.dataset.reduced === '1';
    const sys = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return forced || sys;
  }

  /* ---------- Confort de lecture ---------- */
  function applyPrefs() {
    const p = read('hf27.prefs', { reduced: false, contrast: false });
    document.documentElement.dataset.reduced = p.reduced ? '1' : '0';
    document.documentElement.dataset.contrast = p.contrast ? '1' : '0';
  }
  function togglePref(key) {
    const p = read('hf27.prefs', { reduced: false, contrast: false });
    p[key] = !p[key];
    store('hf27.prefs', p);
    applyPrefs();
    return p[key];
  }

  /* ---------- Programme déterministe ---------- */
  let SCHEDULE = null;
  function buildSchedule() {
    if (SCHEDULE) return SCHEDULE;
    const out = {};
    DATA.days.forEach(function (day, dayIdx) {
      const rows = [];
      const used = {};
      DATA.scenes.forEach(function (sc) {
        const times = (DATA.grid[sc.id] || {})[day.id];
        if (!times) return;
        const pool = sc.artists;
        const head = (DATA.headliners[sc.id] || {})[day.id];
        times.forEach(function (t, i) {
          let artist = head;
          if (i < times.length - 1) {
            let idx = (dayIdx * 2 + i * 2 + sc.order) % pool.length;
            let guard = 0;
            while ((used[idx] || pool[idx] === head) && guard++ < pool.length) idx = (idx + 1) % pool.length;
            used[idx] = true;
            artist = pool[idx];
          }
          const genres = DATA.genres[sc.id] || ['—'];
          rows.push({ time: t, artist: artist, scene: sc.id, genre: genres[i % genres.length] });
        });
      });
      rows.sort(function (a, b) { return a.time.localeCompare(b.time); });
      out[day.id] = rows;
    });
    SCHEDULE = out;
    return out;
  }

  /* ---------- Vue : ACCUEIL ---------- */
  views.home = function () {
    const d = DATA.meta;
    return '' +
    '<section class="hero">' +
      '<canvas id="hero-canvas" aria-hidden="true"></canvas>' +
      '<div class="wrap hero-inner">' +
        '<p class="hero-sub">Hellfest 2027 · Édition anniversaire fictive</p>' +
        '<h1 class="hero-title">Le Centième<br>Feu</h1>' +
        '<p class="hero-lede">' + esc(d.tagline) + ' Pour la centième fois, les Portes s’ouvrent à l’envers : on entre par la dernière scène, on descend, et on ne remonte pas les mêmes qu’on est descendu. Ce prototype propose trois entrées dans cet invariant.</p>' +
        '<div class="hero-facts">' +
          '<div><p class="hfact-k">Dates (fictives)</p><p class="hfact-v is-fic">' + esc(d.dates) + '</p></div>' +
          '<div><p class="hfact-k">Lieu</p><p class="hfact-v">' + esc(d.place.split('·')[0].trim()) + '</p></div>' +
          '<div><p class="hfact-k">Scènes</p><p class="hfact-v">' + d.scenes + ' + 1 fiction</p></div>' +
          '<div><p class="hfact-k">Fréquentation (fictive)</p><p class="hfact-v is-fic">' + d.claim.toLocaleString('fr-FR') + '</p></div>' +
        '</div>' +
        '<div class="btn-row">' +
          '<a class="btn btn--primary" href="#/descente">Entrer par la Descente</a>' +
          '<a class="btn btn--ghost" href="#/programme">Voir le programme</a>' +
          '<a class="btn btn--ghost" href="#/pratique">Infos pratiques</a>' +
        '</div>' +
      '</div>' +
    '</section>' +

    '<section class="section"><div class="wrap">' +
      '<p class="eyebrow">La règle du Centième Feu</p>' +
      '<h2 class="title-lg">Une tradition inventée, et tout ce qu’elle implique</h2>' +
      '<p class="h-lede">Hellcity ne compte pas les années : elle compte les feux. Le centième s’allume en 2027, et les Portes s’ouvrent à l’envers. Trois gestes suffisent à tenir cette fiction — et tout le prototype en découle.</p>' +
      '<div class="cols" style="margin-top:2rem">' +
        '<div class="card"><span class="card-tag">Geste 01 — Entrer à l’envers</span><h3>On commence par la dernière scène</h3><p>La descente est l’inverse du programme habituel. Chaque scène visitée rend une étincelle : six étincelles, six scènes.</p></div>' +
        '<div class="card"><span class="card-tag">Geste 02 — Récolter</span><h3>Chaque scène a son rite</h3><p>Scanner, viser, décolleter, respirer, frapper, retourner. Chaque scène a son interaction propre — jamais un simple changement de couleur.</p></div>' +
        '<div class="card"><span class="card-tag">Geste 03 — Descendre</span><h3>La Fosse s’ouvre à la fin</h3><p>Une septième scène, absente de tout plan officiel, ne s’ouvre qu’aux porteurs des six étincelles. C’est la récompense de l’expérience immersive.</p></div>' +
      '</div>' +
    '</div></section>' +

    '<section class="section"><div class="wrap">' +
      '<p class="eyebrow">Trois entrées dans le même univers</p>' +
      '<h2 class="title-lg">Un prototype, trois modes de découverte</h2>' +
      '<div class="routes" style="margin-top:1.8rem">' +
        '<a class="route route--a" href="#/descente"><span class="route-num">A</span><h3>La Descente</h3><p>Expérience immersive principale : traverser les sept scènes du festival, rite par rite, jusqu’à la Fosse. Exploratoire, spatiale, jouable au clavier.</p><span class="route-go">Descendre →</span></a>' +
        '<a class="route route--b" href="#/archives"><span class="route-num">B</span><h3>Archives de Minuit</h3><p>Second mode, radicalement différent : un récit par la durée. On traverse les decades du Hellfest et on y laisse un fragment de souvenir. Narratif, horizontal, sonore.</p><span class="route-go">Traverser le temps →</span></a>' +
        '<a class="route route--c" href="#/pratique"><span class="route-num">C</span><h3>Pratique</h3><p>Le chemin court : programme par jour et par scène, passes simulées, accès, transports, accessibilité, FAQ. Aucune information n’est piégée derrière l’expérience.</p><span class="route-go">Tout savoir →</span></a>' +
      '</div>' +
    '</div></section>' +

    '<section class="section"><div class="wrap cols-2">' +
      '<div>' +
        '<p class="eyebrow">Ce que ce prototype n’est pas</p>' +
        '<h2 class="title-md">Honnêteté avant spectacle</h2>' +
        '<p class="h-lede">Cette expérience est une proposition créative <strong>indépendante et non officielle</strong>. Elle n’a été commandée, ni validée, ni produite par le Hellfest ou sa société. Elle ne remplace pas le site officiel, ne crée aucune transaction, ne collecte aucune donnée personnelle.</p>' +
        '<p class="muted">Le Hellfest a annoncé de son côté une édition 2027 <strong>réelle</strong> du 17 au 20 juin 2027 à Clisson. <em>Le Centième Feu</em> se fictionne du <strong>19 au 22 août 2027</strong> et n’a aucun rapport avec elle. Le détail de ce qui est vérifié, inventé ou inaccessible est publié dans <a href="#/colonne">La Colonne</a>.</p>' +
      '</div>' +
      '<div class="note note--neutral">' +
        '<p><b>Séparation des registres</b></p>' +
        '<p class="tiny" style="margin-bottom:.6rem">Le site marque en permanence le statut de chaque information :</p>' +
        '<p style="margin-bottom:.4rem"><span class="pill pill--fic">Fiction 2027</span> Dates, programmation, tarifs, scène La Fosse</p>' +
        '<p style="margin-bottom:.4rem"><span class="pill">Vérifié</span> Clisson, 2006, six scènes, Hellbangers, édition 2027 de juin</p>' +
        '<p style="margin-bottom:0"><span class="pill pill--sim">Simulation</span> Panier et panier de pass, sans paiement</p>' +
      '</div>' +
    '</div></section>';
  };

  /* ---------- Vue : PRATIQUE ---------- */
  views.pratique = function () {
    const acc = DATA.practical.accessiblity;
    return '' +
    '<section class="section"><div class="wrap">' +
      '<p class="eyebrow">Mode C · Accès direct</p>' +
      '<h1 class="title-lg">Pratique</h1>' +
      '<p class="h-lede">Tout ce qu’il faut savoir, sans passer par l’expérience immersive. Les informations propres à 2027 sont fictives et signalées comme telles.</p>' +
      '<nav class="toc" aria-label="Sommaire des informations pratiques" style="margin-top:1.6rem">' +
        '<a href="#/pratique#edition">L’édition</a><a href="#/pratique#passes">Passes</a><a href="#/pratique#lieux">Les lieux</a>' +
        '<a href="#/pratique#acces">Accès</a><a href="#/pratique#partic">Participer</a>' +
        '<a href="#/pratique#accessibilite">Accessibilité</a><a href="#/pratique#faq">FAQ</a>' +
      '</nav>' +
    '</div></section>' +

    '<section class="section" id="edition"><div class="wrap">' +
      '<h2 class="title-md">L’édition (fictive)</h2>' +
      '<div class="cols-2" style="margin-top:1.2rem">' +
        '<dl class="kv">' +
          '<dt>Dates</dt><dd>19 – 22 août 2027 <span class="pill pill--fic">fiction</span></dd>' +
          '<dt>Lieu</dt><dd>Clisson Rock City, Clisson (Loire-Atlantique) <span class="pill">vérifié</span></dd>' +
          '<dt>Format</dt><dd>4 jours · 4 nuits de camping · 6 scènes réelles + 1 scène fictive</dd>' +
          '<dt>Fréquentation</dt><dd>180 000 personnes <span class="pill pill--fic">fiction</span></dd>' +
          '<dt>Tranche d’âge</dt><dd>Interdit aux moins de 16 ans sans adulte accompagnateur</dd>' +
        '</dl>' +
        '<div class="note"><p><b>Pourquoi des dates différentes ?</b></p><p class="tiny">Le Hellfest a annoncé une édition 2027 du 17 au 20 juin 2027. <em>Le Centième Feu</em> est une invention distincte : elle ne prétend rien représenter de l’édition officielle et ne doit pas être confondue avec elle.</p></div>' +
      '</div>' +
    '</div></section>' +

    '<section class="section" id="passes"><div class="wrap">' +
      '<h2 class="title-md">Passes <span class="pill pill--sim">simULATION — aucun paiement</span></h2>' +
      '<p class="muted">Tarifs et passes entièrement fictifs. La sélection est enregistrée uniquement dans votre navigateur.</p>' +
      '<div class="pass-grid" id="pass-grid" style="margin-top:1.4rem"></div>' +
      '<div class="basket" style="margin-top:1.2rem">' +
        '<div><p class="hfact-k">Panier de démonstration</p><p class="basket-list" id="basket-list">Aucun pass sélectionné.</p></div>' +
        '<div class="btn-row" style="margin:0">' +
          '<button class="btn btn--primary" id="basket-validate" type="button">Valider (simulation)</button>' +
          '<button class="btn btn--ghost" id="basket-clear" type="button">Vider</button>' +
        '</div>' +
      '</div>' +
    '</div></section>' +

    '<section class="section" id="lieux"><div class="wrap">' +
      '<h2 class="title-md">Les lieux <span class="pill pill--fic">fiction</span></h2>' +
      '<p class="muted">Clisson Rock City n’existe pas sur un plan : voici comment l’édition 2027 l’organiserait. Chaque lieu est rattaché à une scène ou à un service, et sert de repère dans la Descente.</p>' +
      '<div class="venues" style="margin-top:1.4rem">' +
        DATA.venues.map(function (v) {
          return '<article class="venue"><h3>' + esc(v.n) + '</h3>' +
            '<span class="card-tag">' + esc(v.k) + '</span>' +
            '<p>' + esc(v.s) + '</p></article>';
        }).join('') +
      '</div>' +
    '</div></section>' +

    '<section class="section" id="acces"><div class="wrap">' +
      '<h2 class="title-md">Accès &amp; transports <span class="pill pill--fic">2027 fictif</span></h2>' +
      '<div class="cols" style="margin-top:1.4rem">' +
        DATA.practical.access.map(function (a) {
          return '<div class="card"><span class="card-tag">' + esc(a.t) + '</span><p>' + esc(a.d) + '</p></div>';
        }).join('') +
      '</div>' +
    '</div></section>' +

    '<section class="section" id="partic"><div class="wrap cols-2">' +
      '<div>' +
        '<h2 class="title-md">Modalités de participation</h2>' +
        '<div class="cols" style="margin-top:1.2rem">' +
          '<div class="card"><span class="card-tag">Entrée</span><p>Entrée par Hellstage uniquement. Le bracelet d’entrée (fictif) est 유일 et nominatif sur toute la durée du festival. Aucun passage par la case « office » à l’intérieur du site.</p></div>' +
          '<div class="card"><span class="card-tag">Camping</span><p>Camping intégré à l’emplacement, en zone dégradée (bruit, poussière, promiscuité assumée). Les emplacements 4 personnes sont les plus demandés. Aucun animal, aucune tente de type tunnel de plus de trois mètres.</p></div>' +
          '<div class="card"><span class="card-tag">Mineurs</span><p>Interdit aux moins de 16 ans. De 16 à 18 ans, autorisation parentale écrite obligatoire, à remettre au poste d’accueil.</p></div>' +
          '<div class="card"><span class="card-tag">Objets</span><p>Sac de 40 × 30 × 20 cm maximum, contenus inspectés à l’entrée, casques interdits dans le Hellcity Square. Rappel : un seul sac par personne, par jour.</p></div>' +
        '</div>' +
      '</div>' +
      '<div>' +
        '<h2 class="title-md">Sécurité &amp; prévention</h2>' +
        '<p class="muted">Ce prototype reprend la philosophie de prévention affichée par l’organisation réelle : interdictions claires, postes de secours, numéro d’urgence unique, règle de la compassion. Les contenus détaillés sont ici <strong>simulés</strong>.</p>' +
        '<ul class="foot-links" style="margin-top:.8rem">' +
          '<li><a href="#/colonne">Prévention et sécurité — ce qui est réel, ce qui est simulé</a></li>' +
          '<li><a href="#faq">Questions fréquentes</a></li>' +
        '</ul>' +
        '<div class="note" style="margin-top:1.2rem"><p><b>Urgence</b></p><p class="tiny">En cas d’urgence sur le site (fictif) : poste de secours central du Hellcity Square, balisage rouge « SECOURS » tous les 80 mètres, numéro court 112. En situation réelle, appelez le 112 ou le 15.</p></div>' +
      '</div>' +
    '</div></section>' +

    '<section class="section" id="accessibilite"><div class="wrap">' +
      '<h2 class="title-md">Accessibilité</h2>' +
      '<p class="muted">Mesures fictives pour le festival, réelles pour le prototype : voir <a href="#/colonne#acces">la section accessibilité du prototype</a>.</p>' +
      '<div class="cols" style="margin-top:1.4rem">' +
        acc.map(function (a) {
          return '<div class="card"><span class="card-tag">' + esc(a.t) + '</span><p>' + esc(a.d) + '</p></div>';
        }).join('') +
      '</div>' +
    '</div></section>' +

    '<section class="section" id="faq"><div class="wrap">' +
      '<h2 class="title-md">Questions fréquentes</h2>' +
      '<div style="margin-top:1rem">' +
        DATA.faq.map(function (f) {
          return '<details class="acc-item"><summary class="acc-q">' + esc(f.q) + '</summary><div class="acc-a">' + esc(f.a) + '</div></details>';
        }).join('') +
      '</div>' +
    '</div></section>';
  };

  /* ---------- Vue : PROGRAMME ---------- */
  views.programme = function () {
    return '' +
    '<section class="section"><div class="wrap">' +
      '<p class="eyebrow">Mode C · Programmation</p>' +
      '<h1 class="title-lg">Programme <span class="pill pill--fic">entièrement fictif</span></h1>' +
      '<p class="h-lede">Quarante-deux groupes qui n’existent pas, répartis sur six scènes et quatre jours. Les horaires sont inventés et ne correspondent à aucune programmation réelle.</p>' +
      '<div class="note" style="margin-top:1.2rem"><p class="tiny"><b>À propos de « Mon festival »</b> : la colonne de droite construit votre programme personnel. Il est enregistré uniquement dans votre navigateur, sans compte et sans envoi de donnée.</p></div>' +
    '</div></section>' +
    '<section class="section" style="border-top:1px solid #1c1b20"><div class="wrap cols-2">' +
      '<div>' +
        '<div class="sched-toolbar">' +
          '<div class="day-tabs" role="group" aria-label="Choisir un jour">' +
            DATA.days.map(function (d, i) {
              return '<button class="day-tab" type="button" data-day="' + d.id + '" aria-pressed="' + (i === 0) + '">' + esc(d.date) + '</button>';
            }).join('') +
          '</div>' +
        '</div>' +
        '<div class="sched-toolbar" id="scene-filters" role="group" aria-label="Filtrer par scène">' +
          '<button class="scene-chip" type="button" data-scene="all" aria-pressed="true">Toutes</button>' +
          DATA.scenes.filter(function (s) { return s.real; }).map(function (s) {
            return '<button class="scene-chip" type="button" data-scene="' + s.id + '" aria-pressed="false">' + esc(s.name) + '</button>';
          }).join('') +
        '</div>' +
        '<p class="tiny" id="day-note"></p>' +
        '<div class="sched" id="sched"></div>' +
      '</div>' +
      '<aside class="planner">' +
        '<h3>Mon festival</h3>' +
        '<p class="tiny">Votre programme personnel · <span id="planner-count">0</span> rendez-vous</p>' +
        '<ul id="planner-list"></ul>' +
        '<p class="planner-empty" id="planner-empty">Rien pour l’instant. Ajoutez des groupes depuis le programme.</p>' +
        '<div class="btn-row" style="margin-top:.8rem">' +
          '<button class="btn btn--ghost" type="button" id="planner-clear">Vider</button>' +
        '</div>' +
        '<p class="tiny" style="margin-top:.8rem">Aucun export, aucun envoi : tout reste dans ce navigateur.</p>' +
      '</aside>' +
    '</div></section>';
  };

  /* ---------- Vue : LA COLONNE ---------- */
  views.colonne = function () {
    const c = DATA.colophon;
    function block(list, cls, label) {
      return list.map(function (f) {
        return '<div class="fact ' + cls + '"><h3>' + esc(f.t) + (label ? ' <span class="pill">' + label + '</span>' : '') + '</h3>' +
          (f.s ? '<p class="src">Source : ' + esc(f.s) + '</p>' : '') + '</div>';
      }).join('');
    }
    return '' +
    '<section class="section"><div class="wrap">' +
      '<p class="eyebrow">Méthode &amp; honnêteté</p>' +
      '<h1 class="title-lg">La Colonne</h1>' +
      '<p class="h-lede">Cette page explique ce que ce prototype a réellement vérifié, ce qu’il invente, ce qu’il n’a pas pu consulter, et comment il a été construit. Elle est la contrepartie nécessaire du spectaculaire.</p>' +
      '<div class="note" style="margin-top:1.4rem"><p><b>Concept indépendant et non officiel. Édition anniversaire 2027 entièrement fictive.</b> Aucune commande, aucun financement, aucun accord avec le Hellfest ou sa société. Ce prototype n’est pas un site officiel et ne doit pas être confondu avec l’édition 2027 annoncée en juin 2027.</p>' +
      '<p class="tiny" style="margin-top:.7rem">Pour l’organisation réelle et son édition 2027 annoncée : <a href="https://hellfest.fr" target="_blank" rel="noopener noreferrer">hellfest.fr</a> (lien externe, hors de ce concept). Ce prototype n’est pas la billetterie officielle et n’en propose aucune.</p></div>' +
    '</div></section>' +

    '<section class="section" id="verifie"><div class="wrap">' +
      '<h2 class="title-md">A · Ce qui est vérifié</h2>' +
      '<p class="muted">Éléments relevés sur les sources publiques de l’organisation (pages officielles et encyclopédies), lors d’une consultation en ligne.</p>' +
      '<div style="margin-top:1.2rem">' + block(c.verified, 'fact--v') + '</div>' +
    '</div></section>' +

    '<section class="section" id="fiction"><div class="wrap">' +
      '<h2 class="title-md">B · Ce qui est inventé</h2>' +
      '<p class="muted">Tout le reste est une création. Rien de ce qui suit n’a été annoncé, validé ou revendiqué par l’organisation.</p>' +
      '<div style="margin-top:1.2rem">' + block(c.fictional, 'fact--f') + '</div>' +
    '</div></section>' +

    '<section class="section" id="inaccessible"><div class="wrap">' +
      '<h2 class="title-md">C · Ce que je n’ai pas pu accéder</h2>' +
      '<p class="muted">Un prototype honnête admet ses angles morts plutôt que de les combler par des inventions présentées comme des faits.</p>' +
      '<div style="margin-top:1.2rem">' + block(c.unreachable, 'fact--h') + '</div>' +
    '</div></section>' +

    '<section class="section" id="acces"><div class="wrap cols-2">' +
      '<div>' +
        '<h2 class="title-md">Accessibilité du prototype</h2>' +
        '<ul class="foot-links" style="margin-top:1rem">' +
          '<li><a href="#/pratique#accessibilite">Accessibilité de l’expérience</a></li>' +
          '<li><a href="#/descente">Le clavier dans la Descente</a></li>' +
          '<li><a href="#/archives">Le mode sonore dans les Archives</a></li>' +
        '</ul>' +
        '<h3 class="title-md" style="margin-top:1.8rem">Réglages</h3>' +
        '<p class="muted">Trois réglages appliqués immédiatement, mémorisés dans ce navigateur.</p>' +
        '<div class="btn-row">' +
          '<button class="btn btn--ghost" type="button" data-pref="reduced">Mouvement réduit</button>' +
          '<button class="btn btn--ghost" type="button" data-pref="contrast">Contraste renforcé</button>' +
          '<button class="btn btn--ghost" type="button" data-pref="sound">Ambiance sonore</button>' +
        '</div>' +
        '<p class="tiny" style="margin-top:.8rem">Le réglage système « réduire les animations » est respecté automatiquement. L’ambiance sonore est <strong>éteinte par défaut</strong> : rien n’est généré tant que vous ne l’activez pas.</p>' +
      '</div>' +
      '<div>' +
        '<h2 class="title-md">Construction</h2>' +
        '<dl class="kv" style="margin-top:1rem">' +
          '<dt>Nature</dt><dd>Prototype statique, sans build, sans dépendance à l’exécution, sans service payant, sans API, sans compte.</dd>' +
          '<dt>Code</dt><dd>HTML, CSS et JavaScript natifs. Routage par ancre, rendu des vues en DOM.</dd>' +
          '<dt>Visuels</dt><dd>100 % générés : SVG, Canvas, dégradés, filtres CSS. Aucune image photographique, aucun logo, aucune affiche reprise.</dd>' +
          '<dt>Son</dt><dd>Synthèse Web Audio en direct (oscillateurs, filtres, bruit de synthèse). Aucun morceau enregistré.</dd>' +
          '<dt>Polices</dt><dd>Rye, Oswald, Barlow — SIL Open Font License, sous-ensembles latins embarqués.</dd>' +
          '<dt>Données</dt><dd>Aucune collecte. Stockage local limité au programme, au panier et aux préférences.</dd>' +
          '<dt>Durée de session</dt><dd>Prototype réalisé en une session de travail d’environ 75 minutes.</dd>' +
        '</dl>' +
      '</div>' +
    '</div></section>';
  };

  /* ---------- Branchement des interactions par vue ---------- */
  function bindHome() {
    startEmbers(document.getElementById('hero-canvas'));
  }

  function bindPratique() {
    const grid = document.getElementById('pass-grid');
    let basket = read('hf27.basket', []);
    function paint() {
      grid.innerHTML = DATA.passes.map(function (p) {
        const on = basket.indexOf(p.id) > -1;
        return '<div class="pass"><h3>' + esc(p.name) + '</h3><p class="price">' + p.price + ' €</p>' +
          '<p class="tiny">' + esc(p.note) + '</p><ul>' + p.list.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul>' +
          '<button class="btn ' + (on ? 'btn--ghost' : 'btn--primary') + '" type="button" data-pass="' + p.id + '" aria-pressed="' + on + '">' +
          (on ? 'Retirer' : 'Ajouter au panier') + '</button></div>';
      }).join('');
      const list = document.getElementById('basket-list');
      if (!basket.length) {
        list.innerHTML = 'Aucun pass sélectionné.';
      } else {
        const total = basket.reduce(function (s, id) {
          const p = DATA.passes.find(function (x) { return x.id === id; });
          return s + (p ? p.price : 0);
        }, 0);
        list.innerHTML = DATA.passes.filter(function (p) { return basket.indexOf(p.id) > -1; })
          .map(function (p) { return esc(p.name) + ' — ' + p.price + ' €'; }).join(' · ') +
          '<br><strong>Total simulé : ' + total + ' €</strong> <span class="pill pill--sim">simulation</span>';
      }
      grid.querySelectorAll('[data-pass]').forEach(function (b) {
        b.addEventListener('click', function () {
          const id = b.getAttribute('data-pass');
          const i = basket.indexOf(id);
          if (i > -1) { basket.splice(i, 1); toast('Pass retiré'); }
          else { basket.push(id); toast('Pass ajouté (simulation)'); }
          store('hf27.basket', basket);
          paint();
        });
      });
    }
    paint();
    document.getElementById('basket-validate').addEventListener('click', function () {
      if (!basket.length) { toast('Choisissez d’abord un pass'); return; }
      toast('Simulation : aucun paiement, aucune donnée transmise');
    });
    document.getElementById('basket-clear').addEventListener('click', function () {
      basket = []; store('hf27.basket', basket); paint(); toast('Panier vidé');
    });
  }

  function bindProgramme() {
    const sched = buildSchedule();
    let day = DATA.days[0].id;
    let scene = 'all';
    let mine = read('hf27.plan', []);

    function paintPlanner() {
      const list = document.getElementById('planner-list');
      const items = mine.map(function (k) { return sched[day].find(function (r) { return r.key === k; }); }).filter(Boolean);
      list.innerHTML = items.map(function (r) {
        return '<li><span>' + esc(r.artist) + '</span><span>' + r.time + '</span></li>';
      }).join('');
      document.getElementById('planner-empty').style.display = mine.length ? 'none' : '';
      document.getElementById('planner-count').textContent = mine.length;
    }

    function paint() {
      const rows = sched[day].filter(function (r) { return scene === 'all' || r.scene === scene; });
      const sc = DATA.scenes.find(function (s) { return s.id === scene; });
      document.getElementById('day-note').textContent =
        (DATA.days.find(function (d) { return d.id === day; }).note) +
        ' · ' + rows.length + ' groupes' + (scene === 'all' ? '' : ' sur la scène ' + sc.name) +
        ' · tous les noms et horaires sont fictifs';
      document.getElementById('sched').innerHTML = rows.map(function (r) {
        const s = DATA.scenes.find(function (x) { return x.id === r.scene; });
        const on = mine.indexOf(r.key) > -1;
        return '<div class="slot" style="--slot:' + s.accent + (on ? ';background:rgba(255,192,97,.05)' : '') + '">' +
          '<span class="slot-time">' + r.time + '</span>' +
          '<span><span class="slot-artist">' + esc(r.artist) + '</span><br><span class="slot-genre">' + esc(r.genre) + '</span></span>' +
          '<span class="slot-scene">' + esc(s.name) + '</span>' +
          '<button class="slot-add" type="button" data-key="' + r.key + '" aria-pressed="' + on + '">' + (on ? '✓ retiré' : '+ ajouter') + '</button>' +
          '</div>';
      }).join('');
      main.querySelectorAll('.slot-add').forEach(function (b) {
        b.addEventListener('click', function () {
          const k = b.getAttribute('data-key');
          const i = mine.indexOf(k);
          if (i > -1) { mine.splice(i, 1); toast('Retiré de Mon festival'); }
          else { mine.push(k); toast('Ajouté à Mon festival'); }
          store('hf27.plan', mine);
          paint(); paintPlanner();
        });
      });
      paintPlanner();
    }

    /* clé stable par groupe + jour + heure */
    Object.keys(sched).forEach(function (d) {
      sched[d].forEach(function (r, i) { r.key = d + '|' + r.time + '|' + r.artist + '|' + i; });
    });

    main.querySelectorAll('[data-day]').forEach(function (b) {
      b.addEventListener('click', function () {
        day = b.getAttribute('data-day');
        main.querySelectorAll('[data-day]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        paint();
      });
    });
    main.querySelectorAll('[data-scene]').forEach(function (b) {
      b.addEventListener('click', function () {
        scene = b.getAttribute('data-scene');
        main.querySelectorAll('[data-scene]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        paint();
      });
    });
    document.getElementById('planner-clear').addEventListener('click', function () {
      mine = []; store('hf27.plan', mine); paint(); toast('Programme personnel vidé');
    });
    paint();
  }

  function bindColonne() {
    main.querySelectorAll('[data-pref]').forEach(function (b) {
      const key = b.getAttribute('data-pref');
      function label() {
        if (key === 'sound') b.setAttribute('aria-pressed', String(AudioEngine.isEnabled()));
        else b.setAttribute('aria-pressed', String(document.documentElement.dataset[key] === '1'));
      }
      b.addEventListener('click', function () {
        if (key === 'sound') {
          const on = AudioEngine.toggle();
          AudioEngine.play('drone');
          toast(on ? 'Ambiance sonore activée' : 'Ambiance sonore coupée');
        } else {
          togglePref(key);
          toast(key === 'reduced' ? 'Mouvement réduit activé' : 'Contraste renforcé activé');
        }
        label();
      });
      label();
    });
  }

  /* ---------- Braises de l'accueil ---------- */
  let emberRAF = null;
  let emberResize = null;
  function stopEmbers() {
    if (emberRAF) { cancelAnimationFrame(emberRAF); emberRAF = null; }
    if (emberResize) { window.removeEventListener('resize', emberResize); emberResize = null; }
  }
  function startEmbers(canvas) {
    if (!canvas) return;
    stopEmbers();
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, parts = [];
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = Math.floor(w * DPR); canvas.height = Math.floor(h * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    function seed() {
      const n = Math.max(24, Math.min(90, Math.round(w / 14)));
      parts = [];
      for (let i = 0; i < n; i++) {
        parts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.6 + Math.random() * 1.9,
          vy: 0.12 + Math.random() * 0.5,
          vx: (Math.random() - 0.5) * 0.22,
          a: 0.15 + Math.random() * 0.6,
          t: Math.random() * Math.PI * 2
        });
      }
    }
    function frame(ts) {
      ctx.clearRect(0, 0, w, h);
      const t = ts / 1000;
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        if (!reducedMotion()) {
          p.y -= p.vy;
          p.x += p.vx + Math.sin(t * 0.6 + p.t) * 0.16;
          if (p.y < -8) { p.y = h + 8; p.x = Math.random() * w; }
          if (p.x < -8) p.x = w + 8; else if (p.x > w + 8) p.x = -8;
        }
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 7);
        g.addColorStop(0, 'rgba(255,190,110,' + (p.a * 0.85) + ')');
        g.addColorStop(0.35, 'rgba(255,110,30,' + (p.a * 0.35) + ')');
        g.addColorStop(1, 'rgba(255,80,10,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 7, 0, Math.PI * 2); ctx.fill();
      }
      emberRAF = requestAnimationFrame(frame);
    }
    resize(); seed();
    emberResize = function () { resize(); seed(); };
    window.addEventListener('resize', emberResize);
    if (reducedMotion()) { frame(0); cancelAnimationFrame(emberRAF); emberRAF = null; }
    else emberRAF = requestAnimationFrame(frame);
  }

  /* ---------- Routeur ---------- */
  const routes = {
    '/': { view: 'home', nav: null, title: 'HELLFEST 2027 — Le Centième Feu' },
    '/descente': { view: 'descente', nav: 'descente', title: 'La Descente — HELLFEST 2027 (fictif)' },
    '/archives': { view: 'archives', nav: 'archives', title: 'Archives de Minuit — HELLFEST 2027 (fictif)' },
    '/pratique': { view: 'pratique', nav: 'pratique', title: 'Pratique — HELLFEST 2027 (fictif)' },
    '/programme': { view: 'programme', nav: 'programme', title: 'Programme — HELLFEST 2027 (fictif)' },
    '/colonne': { view: 'colonne', nav: 'colonne', title: 'La Colonne — méthode et honnêteté' }
  };

  /* positionne la vue sur une ancre et y transfère le focus */
  function scrollToAnchor(id) {
    if (!id) return false;
    var t = document.getElementById(id);
    if (!t) return false;
    t.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
    if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1');
    t.focus({ preventScroll: true });
    return true;
  }

  function render() {
    var raw = location.hash.replace(/^#/, '');
    var path, anchor;

    if (raw === '') {
      path = '/';
      anchor = '';
    } else if (raw.charAt(0) === '/') {
      var parts = raw.split('#');
      path = parts[0];
      anchor = parts[1] || '';
    } else {
      /* ancre interne à la page courante : le routeur ne doit pas réécrire la vue */
      scrollToAnchor(raw.split('#')[0]);
      return;
    }

    const route = routes[path] || routes['/'];
    currentRoute = path;

    document.querySelectorAll('[data-nav]').forEach(function (a) {
      if (a.getAttribute('data-nav') === route.nav) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });

    if (route.view === 'descente') {
      Descent.open();
      document.title = route.title;
      return;
    }
    Descent.close();
    /* Les Archives construisent elles-mêmes leur contenu dans #main */
    if (route.view === 'archives') Archives.mount();
    else main.innerHTML = views[route.view] ? views[route.view]() : '';
    document.title = route.title;

    if (route.view === 'home') bindHome();
    else stopEmbers();
    if (route.view === 'pratique') bindPratique();
    if (route.view === 'programme') bindProgramme();
    if (route.view === 'colonne') bindColonne();

    if (anchor) scrollToAnchor(anchor);
    else {
      window.scrollTo({ top: 0, behavior: 'auto' });
      main.focus({ preventScroll: true });
    }
    lastPath = path;
  }

  function navigate() {
    render();
  }

  /* le bandeau d'en-tête est collant : les ancres doivent passer en dessous */
  function syncHeadOffset() {
    const head = document.querySelector('.site-head');
    if (!head) return;
    const h = Math.round(head.getBoundingClientRect().height);
    if (h > 0) document.documentElement.style.setProperty('--head-h', h + 'px');
  }

  function init() {
    applyPrefs();
    AudioEngine.init();
    syncHeadOffset();
    window.addEventListener('resize', syncHeadOffset);
    document.getElementById('nav-toggle').addEventListener('click', function () {
      const nav = document.getElementById('site-nav');
      const open = nav.classList.toggle('is-open');
      this.setAttribute('aria-expanded', String(open));
      this.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      syncHeadOffset();
    });
    document.getElementById('site-nav').addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        document.getElementById('site-nav').classList.remove('is-open');
        document.getElementById('nav-toggle').setAttribute('aria-expanded', 'false');
        syncHeadOffset();
      }
    });
    window.addEventListener('hashchange', navigate);
    render();
  }

  return { init: init, render: render, toast: toast, esc: esc, buildSchedule: buildSchedule, reducedMotion: reducedMotion, lastPath: function () { return lastPath; } };
})();

document.addEventListener('DOMContentLoaded', App.init);
