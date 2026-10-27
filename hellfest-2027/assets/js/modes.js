/* =========================================================================
   HELLFEST 2027 — « Le Centième Feu »
   MODES IMMERSIFS
     A · LA DESCENTE      — exploration spatiale, sept scènes, six rites
     B · ARCHIVES DE MINUIT — récit temporel horizontal, ambiance synthétisée
   ========================================================================= */

/* -------------------------------------------------------------------------
   OUTILS PARTAGÉS
   ------------------------------------------------------------------------- */
const Craft = {
  esc: function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  },
  svg: function (markup) { return markup; },
  /* générateur d'emblèmes déterministe : chaque année a sa marque */
  emblem: function (year, accent) {
    var y = parseInt(year, 10) || 0;
    var seed = y % 7;
    var rings = 3 + (y % 4);
    var s = '<svg viewBox="0 0 120 120" width="120" height="120" role="img" aria-hidden="true" focusable="false">';
    s += '<rect width="120" height="120" fill="#08080a"/>';
    for (var i = 0; i < rings; i++) {
      var r = 16 + i * 13;
      var dash = (i + seed) % 2 ? '3 5' : '0';
      s += '<circle cx="60" cy="60" r="' + r + '" fill="none" stroke="' + accent + '" stroke-width="' + (i === 0 ? 2 : 1) + '" stroke-dasharray="' + dash + '" opacity="' + (0.9 - i * 0.14).toFixed(2) + '"/>';
    }
    s += '<path d="M60 18 L60 102" stroke="' + accent + '" stroke-width="1" opacity=".45"/>';
    s += '<path d="M18 60 L102 60" stroke="' + accent + '" stroke-width="1" opacity=".45"/>';
    s += '<path d="M60 ' + (52 - seed) + ' L' + (66 + seed) + ' 62 L60 ' + (70 + seed) + ' L' + (54 - seed) + ' 62 Z" fill="' + accent + '" opacity=".95"/>';
    s += '<text x="60" y="112" text-anchor="middle" font-family="monospace" font-size="9" fill="' + accent + '" opacity=".8">' + year + '</text>';
    s += '</svg>';
    return s;
  }
};

/* =========================================================================
   MODE A — LA DESCENTE
   ========================================================================= */
const Descent = (function () {
  var root = null;
  var sceneIdx = 0;
  var sparks = {};
  var open = false;
  var rafId = null;

  var SCENES = DATA.scenes;

  function el(id) { return document.getElementById(id); }

  function build() {
    var html = '';
    html += '<div class="dsc-top">' +
      '<button class="dsc-close" id="dsc-close" type="button">← Fermer</button>' +
      '<div class="dsc-progress" role="progressbar" aria-label="Étincelles récoltées" aria-valuemin="0" aria-valuemax="6" aria-valuenow="0"><i id="dsc-bar"></i></div>' +
      '<div class="dsc-embers" id="dsc-embers" aria-hidden="true"></div>' +
      '<span class="dsc-count" id="dsc-count" role="status" aria-live="polite">0 / 6 étincelles</span>' +
      '</div>';
    html += '<div class="dsc-stage" id="dsc-stage"></div>';
    html += '<div class="dsc-foot">' +
      '<p id="dsc-hint" style="margin:0">Chaque scène retient une étincelle. Le rite de la scène décide si vous la repartez avec.</p>' +
      '<div class="dsc-nav">' +
        '<button type="button" id="dsc-up">↑ Remonter</button>' +
        '<button type="button" id="dsc-down">↓ Descendre</button>' +
        '<button type="button" id="dsc-fosse">La Fosse</button>' +
      '</div>' +
    '</div>';
    root = document.createElement('div');
    root.className = 'descent';
    root.id = 'descent-root';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', 'La Descente — exploration immersive des scènes');
    root.innerHTML = html;
    document.body.appendChild(root);

    el('dsc-close').addEventListener('click', close);
    el('dsc-up').addEventListener('click', function () { go(sceneIdx - 1); });
    el('dsc-down').addEventListener('click', function () { go(sceneIdx + 1); });
    el('dsc-fosse').addEventListener('click', function () { go(6); });
    document.addEventListener('keydown', onKey);
  }

  function onKey(e) {
    if (!open) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === 'Tab' && root) {
      var f = root.querySelectorAll('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  function sparkCount() { return Object.keys(sparks).filter(function (k) { return sparks[k]; }).length; }

  function paintChrome() {
    var n = sparkCount();
    el('dsc-bar').style.width = (n / 6 * 100) + '%';
    el('dsc-count').textContent = n + ' / 6 étincelles';
    var meter = document.querySelector('.dsc-progress');
    if (meter) meter.setAttribute('aria-valuenow', String(n));
    var dots = '';
    for (var i = 0; i < 6; i++) {
      dots += '<span class="ember-dot' + (sparks[SCENES[i].id] ? ' is-lit' : '') + '"></span>';
    }
    el('dsc-embers').innerHTML = dots;
    el('dsc-up').disabled = sceneIdx <= 0;
    el('dsc-down').disabled = sceneIdx >= SCENES.length - 1;
    var fosseBtn = el('dsc-fosse');
    fosseBtn.disabled = n < 6;
    fosseBtn.textContent = n < 6 ? 'La Fosse (' + (6 - n) + ' étincelle' + (6 - n > 1 ? 's' : '') + ')' : 'La Fosse ★';
  }

  /* --- rendu d'une scène ------------------------------------------------ */
  function sceneMarkup(sc) {
    var rite = '';
    switch (sc.id) {
      case 'hellstage': rite = riteScanner(sc); break;
      case 'mainstage': rite = riteLaser(sc); break;
      case 'warzone': rite = riteMur(sc); break;
      case 'valley': rite = riteSouffle(sc); break;
      case 'altar': rite = riteFrappe(sc); break;
      case 'temple': rite = riteBougies(sc); break;
      case 'fosse': rite = riteFosse(sc); break;
    }
    return '<section class="dsc-scene" id="sc-' + sc.id + '" style="--sc-acc:' + sc.accent + ';--sc-ink:' + sc.ink + '" aria-label="' + Craft.esc(sc.name) + '">' +
      '<p class="dsc-tag">' + Craft.esc(sc.kind) + '</p>' +
      '<h2>' + Craft.esc(sc.name) + '</h2>' +
      '<p>' + Craft.esc(sc.fiction) + '</p>' +
      '<p class="dsc-artists">' + Craft.esc(sc.artists.slice(0, 3).join(' · ')) + '</p>' +
      rite +
      '<p class="dsc-prompt">' + Craft.esc(sc.prompt) + '</p>' +
      '</section>';
  }

  function riteShell(sc, title, hint, inner) {
    return '<div class="mini" style="--sc-acc:' + sc.accent + '">' +
      '<h3>' + Craft.esc(title) + '</h3>' +
      '<p class="mini-hint">' + Craft.esc(hint) + '</p>' + inner + '</div>';
  }

  function riteScanner(sc) {
    return riteShell(sc, 'Rite du seuil', 'Frôlez le scanner avec votre laissez-passer. Une seule fois suffit.',
      '<div class="scan-line" id="scan-line" role="button" tabindex="0" aria-describedby="scan-desc">PRÉSENTEZ LE PASS</div>' +
      '<p id="scan-desc" class="sr-only">Bouton : validez avec Entrée ou Espace pour scanner le laissez-passer et obtenir l’étincelle du seuil.</p>');
  }

  function riteLaser(sc) {
    var beacons = [[18, 30], [50, 68], [82, 24]];
    var inner = '<div class="laser-field" id="laser-field">' +
      '<div class="beam" id="laser-beam" style="top:50%"></div>';
    beacons.forEach(function (p, i) {
      inner += '<button class="beacon" type="button" data-beacon="' + i + '" style="left:' + p[0] + '%;top:' + p[1] + '%" aria-label="Balise ' + (i + 1) + ' sur 3"></button>';
    });
    inner += '</div>';
    return riteShell(sc, 'Rite des deux tours', 'Visez les trois balises. Le faisceau suit votre pointeur ; au clavier, tabulez jusqu’à une balise et validez.',
      inner);
  }

  function riteMur(sc) {
    var names = sc.artists.slice();
    var codes = ['CAS', 'TRO', 'PES'];
    var decoys = ['CASSE-TÊTE BÉTON ARMÉ', 'PESTICIDE 88', 'TRENTE ET UN BOIS', 'RATATONK CLUB', 'VESTIAIRE ROUGE', 'MONTÉE DE FIÈVRE', 'LA MAIN DANS LE MOTEUR', 'PUNK RIOT PARIS', 'CERCLE DE FER'];
    var items = codes.map(function (c, i) {
      return { label: c, code: true, key: 'c' + i };
    }).concat(decoys.map(function (d, i) {
      return { label: d, code: false, key: 'd' + i };
    }));
    /* mélange déterministe */
    items.sort(function (a, b) { return (a.key.charCodeAt(0) * 7 + a.key.charCodeAt(1)) - (b.key.charCodeAt(0) * 7 + b.key.charCodeAt(1)); });
    var inner = '<div class="flyers" id="flyers">';
    items.forEach(function (it) {
      inner += '<button class="flyer" type="button" data-flyer="' + it.key + '" data-code="' + it.code + '">' + Craft.esc(it.label) + '</button>';
    });
    inner += '</div><p class="mini-hint" id="mur-count" style="margin-top:.7rem">0 / 3 affichesabbrégées</p>';
    return riteShell(sc, 'Rite du Mur', 'Sur les douze affiches, trois sont abrégées en trois lettres. Les douze autres portent un nom entier. Trouvez les trois courtes.',
      inner);
  }

  function riteSouffle(sc) {
    return riteShell(sc, 'Rite de la brume', 'Maintenez le souffle jusqu’à ce que la brume se lève. Sans souris ni tactile : maintenez Espace sur le bouton, ou utilisez les cinq respirations.',
      '<div class="breath-meter" id="breath-meter" role="progressbar" aria-label="Souffle" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i id="breath-fill"></i></div>' +
      '<button class="breath-btn" id="breath-btn" type="button" style="margin-top:.6rem">Maintenir pour respirer</button>' +
      '<button class="btn btn--ghost" id="breath-alt" type="button" style="margin-top:.6rem">Cinq respirations (alternative)</button>');
  }

  function riteFrappe(sc) {
    return riteShell(sc, 'Rite de l’os', 'Frappez quand le marqueur entre dans le cercle. Trois frappes justes ouvrent l’Autel. Espace ou Entrée pour frapper. En mouvement réduit, le cercle reste fixe : trois frappes espacées l’ouvrent aussi.',
      '<div class="rhythm" id="rhythm" role="button" tabindex="0" aria-label="Zone de frappe : validez quand le marqueur est dans le cercle">' +
      '<div class="target"></div><div class="marker" id="marker"></div><div class="hits" id="hits">0 / 3</div></div>');
  }

  function riteBougies(sc) {
    var inner = '<div class="candles" id="candles">';
    for (var i = 0; i < 5; i++) inner += '<button class="candle" type="button" data-candle="' + i + '" aria-label="Bougie ' + (i + 1) + ' sur 5, à retourner"></button>';
    inner += '</div><p class="mini-hint" id="candle-count" style="margin-top:.8rem;text-align:center">0 / 5 bougies retournées</p>';
    return riteShell(sc, 'Rite des bougies', 'Retournez les cinq bougies, mèche vers le bas. La mèche ne doit pas toucher le sol.',
      inner);
  }

  function riteFosse(sc) {
    var n = sparkCount();
    var list = '';
    SCENES.slice(0, 6).forEach(function (s) {
      list += '<li>' + Craft.esc(s.name) + ' — ' + (sparks[s.id] ? 'étincelle récoltée' : 'étincelle manquante') + '</li>';
    });
    return riteShell(sc, 'Le Centième Feu', 'Vous portez les six étincelles. La dernière porte s’ouvre vers le bas.',
      '<div class="fosse"><div class="fosse-core" aria-hidden="true"></div>' +
      '<p style="text-align:center;max-width:52ch">Le Centième Feu est allumé. Il ne se fête pas : il se descend. Sous la Fosse, une seule scène a jamais existé — celle que l’on emporte avec soi, et qui ne se rejoue pas.</p>' +
      '<ul class="fosse-gate">' + list + '</ul>' +
      '<p class="tiny">Fiction. La Fosse, ses règles et cette conclusion sont une création de ce prototype.</p>' +
      '</div>');
  }

  /* ---Branchement des rites --------------------------------------------- */
  function bindRite(sc) {
    if (sc.id === 'hellstage') {
      var line = el('scan-line');
      var fire = function () {
        if (sparks[sc.id]) return;
        sparks[sc.id] = true;
        line.classList.add('is-done');
        line.textContent = 'PASS SCANNÉ — ÉTINCELLE 1/6';
        App.toast('Étincelle du seuil récoltée');
        paintChrome();
      };
      line.addEventListener('click', fire);
      line.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fire(); }
      });
    }

    if (sc.id === 'mainstage') {
      var field = el('laser-field');
      var beam = el('laser-beam');
      var lit = 0;
      field.addEventListener('pointermove', function (e) {
        var r = field.getBoundingClientRect();
        var y = ((e.clientY - r.top) / r.height) * 100;
        beam.style.top = Math.max(2, Math.min(98, y)) + '%';
      });
      field.querySelectorAll('.beacon').forEach(function (b) {
        b.addEventListener('click', function () {
          if (b.classList.contains('is-lit')) return;
          b.classList.add('is-lit');
          lit++;
          beam.style.top = b.style.top;
          if (lit >= 3 && !sparks[sc.id]) {
            sparks[sc.id] = true;
            App.toast('Étincelle des tours récoltée');
            paintChrome();
          }
        });
      });
    }

    if (sc.id === 'warzone') {
      var found = 0;
      el('flyers').querySelectorAll('.flyer').forEach(function (f) {
        f.addEventListener('click', function () {
          if (f.dataset.code === 'true') {
            if (f.classList.contains('is-picked')) return;
            f.classList.add('is-picked');
            found++;
            el('mur-count').textContent = found + ' / 3 affiches abrégées';
            if (found >= 3 && !sparks[sc.id]) {
              sparks[sc.id] = true;
              App.toast('Étincelle du Mur récoltée');
              paintChrome();
            }
          } else {
            f.classList.add('is-false');
          }
        });
      });
    }

    if (sc.id === 'valley') {
      var meter = el('breath-meter');
      var fill = el('breath-fill');
      var val = 0, holding = false, tick = null;
      function setVal(v) {
        val = Math.max(0, Math.min(100, v));
        fill.style.width = val + '%';
        meter.setAttribute('aria-valuenow', String(Math.round(val)));
        if (val >= 100 && !sparks[sc.id]) {
          sparks[sc.id] = true;
          App.toast('Étincelle de la Vallée récoltée');
          paintChrome();
        }
      }
      function loop() {
        if (holding) { setVal(val + 1.6); }
        tick = requestAnimationFrame(loop);
      }
      function start() { if (!holding) { holding = true; loop(); } }
      function stop() { holding = false; }
      var btn = el('breath-btn');
      btn.addEventListener('pointerdown', function (e) { e.preventDefault(); start(); });
      window.addEventListener('pointerup', stop);
      btn.addEventListener('keydown', function (e) {
        if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); start(); }
      });
      btn.addEventListener('keyup', function (e) {
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); stop(); }
      });
      btn.addEventListener('blur', stop);
      var alt = el('breath-alt');
      var altStep = 0;
      alt.addEventListener('click', function () {
        altStep++;
        setVal(altStep * 20);
        if (altStep >= 5) alt.disabled = true;
      });
    }

    if (sc.id === 'altar') {
      var hits = 0, lastHit = 0, t0 = Date.now();
      var marker = el('marker');
      var hitsEl = el('hits');
      var still = App.reducedMotion();
      /* position recalculée à l'instant de la frappe : le jeu reste juste même
         si l'onglet est en arrière-plan et que l'animation est suspendue */
      function posAt(ms) {
        if (still) return 0.5;
        var cycle = (((ms - t0) / 1000) * 0.42) % 2;
        return cycle <= 1 ? cycle : 2 - cycle;
      }
      function loop(ts) {
        marker.style.left = (posAt(ts) * 100) + '%';
        rafId = requestAnimationFrame(loop);
      }
      rafId = requestAnimationFrame(loop);
      function strike() {
        var now = Date.now();
        if (now - lastHit < (still ? 700 : 0)) { hitsEl.textContent = hits + ' / 3 — trop tôt'; return; }
        var d = Math.abs(posAt(now) - 0.5);
        if (d < (still ? 1 : 0.15)) {
          lastHit = now;
          hits++;
          hitsEl.textContent = hits + ' / 3';
          App.toast(hits >= 3 ? 'Étincelle de l’Autel récoltée' : 'Frappe juste (' + hits + '/3)');
          if (hits >= 3 && !sparks[sc.id]) { sparks[sc.id] = true; paintChrome(); }
        } else {
          hitsEl.textContent = hits + ' / 3 — trop tôt ou trop tard';
        }
      }
      var rhythm = el('rhythm');
      rhythm.addEventListener('click', strike);
      rhythm.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); strike(); }
      });
    }

    if (sc.id === 'temple') {
      var flipped = 0;
      el('candles').querySelectorAll('.candle').forEach(function (c) {
        c.addEventListener('click', function () {
          if (c.classList.contains('is-inverted')) return;
          c.classList.add('is-inverted');
          flipped++;
          el('candle-count').textContent = flipped + ' / 5 bougies retournées';
          if (flipped >= 5 && !sparks[sc.id]) {
            sparks[sc.id] = true;
            App.toast('Étincelle du Temple récoltée');
            paintChrome();
          }
        });
      });
    }
  }

  /* --- Navigation -------------------------------------------------------- */
  function go(idx) {
    if (idx < 0 || idx >= SCENES.length) return;
    if (SCENES[idx].id === 'fosse' && sparkCount() < 6) {
      App.toast('Il manque ' + (6 - sparkCount()) + ' étincelle(s) pour ouvrir la Fosse');
      return;
    }
    sceneIdx = idx;
    var stage = el('dsc-stage');
    stage.innerHTML = SCENES.map(function (s, i) {
      return sceneMarkup(s);
    }).join('');
    var nodes = stage.querySelectorAll('.dsc-scene');
    nodes.forEach(function (n, i) { n.classList.toggle('is-active', i === idx); });
    var sc = SCENES[idx];
    stage.setAttribute('data-scene', sc.id);
    document.body.setAttribute('data-scene', sc.id);
    bindRite(sc);
    paintChrome();
    var hint = el('dsc-hint');
    hint.textContent = sc.id === 'fosse'
      ? 'Dernière porte. Vous êtes arrivé.'
      : 'Rite : ' + sc.prompt.replace(/\.$/, '') + '.';
    var head = stage.querySelector('#sc-' + sc.id + ' h2');
    if (head) head.setAttribute('tabindex', '-1'), head.focus({ preventScroll: true });
  }

  /* --- Ouverture / fermeture --------------------------------------------- */
  function openDescent() {
    if (!root) build();
    open = true;
    root.hidden = false;
    document.body.style.overflow = 'hidden';
    go(0);
  }
  function close() {
    if (!open) return;
    open = false;
    if (root) root.hidden = true;
    document.body.style.overflow = '';
    document.body.removeAttribute('data-scene');
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    if (location.hash.replace(/^#/, '') === '/descente') {
      location.hash = (App.lastPath && App.lastPath() !== '/descente') ? '#' + App.lastPath() : '#/';
    }
  }

  return {
    open: openDescent,
    close: close,
    reset: function () { sparks = {}; sceneIdx = 0; }
  };
})();

/* =========================================================================
   MODE B — ARCHIVES DE MINUIT
   ========================================================================= */
const Archives = (function () {
  var KEY = 'hf27.fragments';

  function store(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { } }
  function read() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }

  function mount() {
    /* le contenu vit dans #main : il disparaît quand une autre vue prend la
       place, on le reconstruit donc au retour plutôt que de le garder en mémoire */
    if (document.getElementById('arch-scroll')) return;

    var html = '';
    html += '<section class="section"><div class="wrap">' +
      '<p class="eyebrow">Mode B · Récit par la durée</p>' +
      '<h1 class="title-lg">Archives de Minuit</h1>' +
      '<p class="h-lede">La seconde manière d’entrer dans le même univers n’est pas une carte : c’est une durée. Huit chapitres, du premier concert en cave jusqu’au Centième Feu. On traverse horizontalement, comme on traverse une nuit.</p>' +
      '<p class="tiny" style="margin-top:.8rem">Les chapitres de 2006 et 2022 s’appuient sur des faits publics ; <strong>tout le reste est une reconstruction fictionnelle</strong>. Le son est optionnel et éteint par défaut.</p>' +
      '</div></section>';

    html += '<section class="archives"><div class="wrap">';
    html += '<div class="arch-controls">' +
      '<button class="audio-toggle" id="arch-sound" type="button" aria-pressed="false"><span class="audio-meter" id="arch-meter" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span> Ambiance sonore</button>' +
      '<div class="arch-progress" aria-hidden="true"><i id="arch-bar"></i></div>' +
      '<span class="tiny" id="arch-pos">Chapitre 1 / 8</span>' +
      '</div>';
    html += '<div class="arch-scroll" id="arch-scroll" tabindex="0" role="region" aria-label="Frise des archives, défilement horizontal"><div class="arch-track" id="arch-track">';

    DATA.archives.forEach(function (a, i) {
      var verified = a.status === 'verifie';
      html += '<article class="arch-chapter" id="arch-' + i + '" style="--ch-acc:' + a.accent + '">' +
        '<span class="arch-status pill ' + (verified ? 'pill--ok' : 'pill--fic') + '">' + (verified ? 'vérifié' : 'fiction') + '</span>' +
        '<div class="arch-emblem">' + Craft.emblem(a.year, a.accent) + '</div>' +
        '<p class="arch-year">' + Craft.esc(a.year) + '</p>' +
        '<h3>' + Craft.esc(a.title) + '</h3>' +
        '<p>' + Craft.esc(a.text) + '</p>' +
        '<blockquote class="arch-quote">« ' + Craft.esc(a.quote) + ' »<footer>' + Craft.esc(a.witness) + '</footer></blockquote>' +
        '</article>';
    });

    html += '</div></div></div></section>';

    html += '<section class="section"><div class="wrap cols-2">' +
      '<div>' +
        '<h2 class="title-md">Laisser un fragment</h2>' +
        '<p class="muted">Le festival des Hellbangers se raconte de bouche à oreille. Ce prototype vous propose d’y ajouter la vôtre. <strong>Votre texte reste sur cette machine</strong> : il n’est ni envoyé, ni partagé, ni modifiable par quiconque.</p>' +
        '<form class="witness-form" id="witness-form" style="margin-top:1.2rem">' +
        '<label for="w-text">Votre fragment</label>' +
        '<textarea id="w-text" name="text" rows="4" maxlength="280" placeholder="Ce que vous retenez de Hellcity…" required></textarea>' +
        '<label for="w-name">Signature (facultatif)</label>' +
        '<input id="w-name" name="name" type="text" maxlength="40" placeholder="Un surnom de Hellbanger" autocomplete="off">' +
        '<div class="btn-row"><button class="btn btn--primary" type="submit">Ajouter au mur local</button>' +
        '<button class="btn btn--ghost" type="button" id="w-clear">Effacer mes fragments</button></div>' +
        '<p class="tiny" style="margin-top:.6rem">Démonstration : aucun envoi réseau, aucun compte, aucune analyse. Le mur est rafraîchi au rechargement de la page.</p>' +
        '</form>' +
        '<div class="witness-list" id="witness-list"></div>' +
      '</div>' +
      '<div>' +
        '<h2 class="title-md">Ce que ce mode n’est pas</h2>' +
        '<div class="note" style="margin-top:1rem"><p class="tiny">Les témoignages affichés sont <strong>inventés</strong> pour ce concept. Ils ne citent personne, ne reproduisent aucune parole réelle, et ne prétendent pas représenter la communauté des Hellbangers.</p></div>' +
        '<h3 class="title-md" style="margin-top:1.6rem">Version sans son</h3>' +
        '<p class="muted">L’ambiance est une nappe synthétisée (oscillateurs, filtres, bruit de synthèse) qui traverse les chapitres. Elle est éteinte par défaut, se coupe d’un clic, et le texte porte à lui seul toute l’information.</p>' +
        '<h3 class="title-md" style="margin-top:1.6rem">Navigation</h3>' +
        '<p class="muted">La frise se parcourt au clavier (flèches gauche/droite, Origine/Fin), au doigt ou à la souris. Aucun contenu n’est masqué derrière une animation : le défilement natif reste disponible et le texte est intégralement lisible.</p>' +
      '</div>' +
    '</div></section>';

    var main = document.getElementById('main');
    main.innerHTML = html;

    var scroll = document.getElementById('arch-scroll');
    var chapters = Array.prototype.slice.call(main.querySelectorAll('.arch-chapter'));
    var soundBtn = document.getElementById('arch-sound');
    var meter = document.getElementById('arch-meter');
    var bar = document.getElementById('arch-bar');
    var posEl = document.getElementById('arch-pos');
    var current = -1;

    function setCurrent(i) {
      if (i === current) return;
      current = i;
      chapters.forEach(function (c, k) { c.classList.toggle('is-current', k === i); });
      var a = DATA.archives[i];
      bar.style.width = ((i + 1) / chapters.length * 100) + '%';
      posEl.textContent = 'Chapitre ' + (i + 1) + ' / ' + chapters.length + ' — ' + a.year;
      if (AudioEngine.isEnabled()) AudioEngine.play(a.sound);
    }

    scroll.addEventListener('scroll', function () {
      var sr = scroll.getBoundingClientRect();
      var mid = sr.left + sr.width / 2;
      var best = 0, bestD = Infinity;
      chapters.forEach(function (c, i) {
        var cr = c.getBoundingClientRect();
        var d = Math.abs(cr.left + cr.width / 2 - mid);
        if (d < bestD) { bestD = d; best = i; }
      });
      setCurrent(best);
    }, { passive: true });

    /* la frise se parcourt au clavier, chapitre par chapitre */
    function scrollToChapter(i) {
      var n = Math.max(0, Math.min(chapters.length - 1, i));
      var c = chapters[n];
      var cr = c.getBoundingClientRect();
      var sr = scroll.getBoundingClientRect();
      var delta = (cr.left - sr.left) - (sr.width - cr.width) / 2;
      scroll.scrollTo({ left: scroll.scrollLeft + delta, behavior: App.reducedMotion() ? 'auto' : 'smooth' });
      setCurrent(n);
    }
    scroll.addEventListener('keydown', function (e) {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); scrollToChapter(current + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); scrollToChapter(current - 1); }
      else if (e.key === 'Home') { e.preventDefault(); scrollToChapter(0); }
      else if (e.key === 'End') { e.preventDefault(); scrollToChapter(chapters.length - 1); }
      else if (e.key === 'PageDown') { e.preventDefault(); scrollToChapter(current + 2); }
      else if (e.key === 'PageUp') { e.preventDefault(); scrollToChapter(current - 2); }
    });
    setCurrent(0);

    soundBtn.addEventListener('click', function () {
      var on = AudioEngine.toggle();
      soundBtn.setAttribute('aria-pressed', String(on));
      meter.classList.toggle('is-on', on);
      if (on) AudioEngine.play(DATA.archives[Math.max(current, 0)].sound);
    });
    if (AudioEngine.isEnabled()) { soundBtn.setAttribute('aria-pressed', 'true'); meter.classList.add('is-on'); }

    /* --- Mur local --- */
    var form = document.getElementById('witness-form');
    var list = document.getElementById('witness-list');
    var clearBtn = document.getElementById('w-clear');
    function paintList() {
      var items = read();
      clearBtn.disabled = !items.length;
      if (!items.length) { list.innerHTML = ''; return; }
      list.innerHTML = items.map(function (w, i) {
        return '<div class="witness"><p>« ' + Craft.esc(w.text) + ' »</p><footer>' +
          Craft.esc(w.name || 'anonyme') + ' · fragment local #' + (i + 1) + '</footer></div>';
      }).join('');
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var text = document.getElementById('w-text').value.trim();
      if (!text) return;
      var items = read();
      items.unshift({ text: text, name: document.getElementById('w-name').value.trim(), at: Date.now() });
      store(items.slice(0, 40));
      form.reset();
      paintList();
      App.toast('Fragment ajouté à votre mur local');
    });
    clearBtn.addEventListener('click', function () {
      store([]);
      paintList();
      App.toast('Fragments effacés de ce navigateur');
    });
    paintList();
    setCurrent(0);
  }

  return { mount: mount };
})();
