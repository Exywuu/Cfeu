/* Capture d'écran du prototype via le protocole Chrome DevTools.
   Aucune dépendance : Node 18+ (WebSocket global) + un Chrome/Edge local.

   Usage :  node tools/capture.mjs [dossier_de_sortie]
            ONLY=04 node tools/capture.mjs   →  ne capture qu'un lot
   Le serveur local doit tourner : node hellfest-2027/serve.js 4177

   Chaque image est un rendu réel du prototype dans un vrai navigateur,
   obtenu par exécution des interactions du site (clics, saisies),
   et non une reconstitution. */
import { spawn } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { setTimeout as delay } from 'node:timers/promises';
import path from 'node:path';

const CHROME = process.env.CHROME_BIN ||
  'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = 'http://localhost:4177/';
const PORT = 9222;
const OUT = path.resolve(process.argv[2] || 'docs/images');
const ONLY = process.env.ONLY || '';
const PROFILE = path.join(process.env.TEMP || '.', 'daybreak-capture-profile');

class CDP {
  constructor(ws) {
    this.ws = ws;
    this.seq = 0;
    this.pending = new Map();
    this.listeners = new Map();
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const p = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) p.reject(new Error(p.method + ' : ' + msg.error.message));
        else p.resolve(msg.result);
      } else if (msg.method) {
        for (const fn of (this.listeners.get(msg.method) || []).slice()) fn(msg.params);
      }
    });
  }
  send(method, params = {}) {
    const id = ++this.seq;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject, method });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  once(method) {
    return new Promise((resolve) => {
      const list = this.listeners.get(method) || [];
      const fn = (params) => {
        this.listeners.set(method, (this.listeners.get(method) || []).filter((x) => x !== fn));
        resolve(params);
      };
      list.push(fn);
      this.listeners.set(method, list);
    });
  }
}

async function main() {
  rmSync(PROFILE, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });

  const chrome = spawn(CHROME, [
    '--headless=new',
    '--remote-debugging-port=' + PORT,
    '--user-data-dir=' + PROFILE,
    '--no-first-run', '--no-default-browser-check',
    '--disable-gpu', '--hide-scrollbars', '--force-color-profile=srgb',
    '--disable-lcd-text', '--font-render-hinting=none',
    'about:blank'
  ], { stdio: 'ignore' });

  let version = null;
  for (let i = 0; i < 60 && !version; i++) {
    try {
      version = await fetch(`http://127.0.0.1:${PORT}/json/version`).then((r) => r.json());
    } catch { await delay(300); }
  }
  if (!version) { chrome.kill(); throw new Error('Chrome injoignable sur le port ' + PORT); }

  const target = await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })
    .then((r) => r.json());
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => {
    ws.addEventListener('open', res, { once: true });
    ws.addEventListener('error', rej, { once: true });
  });
  const cdp = new CDP(ws);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  const evaluate = async (expression, awaitPromise = false) => {
    const r = await cdp.send('Runtime.evaluate', {
      expression, awaitPromise, returnByValue: true
    });
    if (r.exceptionDetails) {
      const d = r.exceptionDetails;
      const detail = (d.exception && d.exception.description) || d.text;
      throw new Error(detail + ' → ' + expression.slice(0, 90));
    }
    return r.result.value;
  };

  async function shot(name, opt) {
    if (ONLY && !name.includes(ONLY)) return;
    const width = opt.width || 1440;
    const height = opt.height || 900;
    const dsf = opt.dsf || 1;
    const mobile = !!opt.mobile;

    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width, height, deviceScaleFactor: dsf, mobile
    });
    await cdp.send('Emulation.setTouchEmulationEnabled', {
      enabled: mobile, maxTouchPoints: mobile ? 5 : 1
    });

    // reset du document : une navigation par ancre ne recharge pas la page
    let loaded = cdp.once('Page.loadEventFired');
    await cdp.send('Page.navigate', { url: 'about:blank' });
    await loaded;
    loaded = cdp.once('Page.loadEventFired');
    await cdp.send('Page.navigate', { url: BASE + (opt.hash || '') });
    await loaded;

    await evaluate('document.fonts.ready', true);
    await delay(opt.settle || 900);
    if (opt.script) {
      const out = await evaluate(opt.script, true);
      await delay(opt.after || 700);
      if (out !== undefined && out !== null) console.log('   · ' + name + ' → ' + out);
    }
    if (opt.scroll) {
      await evaluate(opt.scroll, true);
      await delay(500);
    }

    const params = { format: 'png' };
    if (opt.full) {
      const h = await evaluate('document.documentElement.scrollHeight');
      params.captureBeyondViewport = true;
      params.clip = { x: 0, y: 0, width, height: h, scale: 1 };
    }
    const { data } = await cdp.send('Page.captureScreenshot', params);
    writeFileSync(path.join(OUT, name + '.png'), Buffer.from(data, 'base64'));
    console.log('   ✓ ' + name + '.png');
  }

  const scrollTo = (sel) => `(() => { const el = document.querySelector(${JSON.stringify(sel)});
    if (!el) return 'introuvable: ' + ${JSON.stringify(sel)};
    el.scrollIntoView({ block: 'start', behavior: 'instant' });
    return 'ok'; })()`;

  console.log('Captures → ' + OUT);

  await shot('01-accueil-desktop', { hash: '#/' });

  await shot('02-descente-rite-seuil', {
    hash: '#/descente',
    script: `(async () => { await new Promise(r => setTimeout(r, 500));
      const l = document.querySelector('#scan-line');
      if (!l) return 'scan-line absent';
      l.click();
      await new Promise(r => setTimeout(r, 400));
      return document.querySelector('#dsc-count').textContent.trim(); })()`
  });

  await shot('03-descente-rite-balises', {
    hash: '#/descente',
    script: `(async () => {
      const wait = (ms) => new Promise(r => setTimeout(r, ms));
      const line = document.querySelector('#scan-line');
      if (line) line.click();
      await wait(300);
      document.querySelector('#dsc-down').click();
      await wait(400);
      const beacons = document.querySelectorAll('#laser-field .beacon');
      for (const b of beacons) { b.click(); await wait(150); }
      await wait(300);
      return document.querySelector('#dsc-count').textContent.trim(); })()`
  });

  /* La frappe de l'Autel se joue sur le rythme : on frappe en boucle, le site
     ne compte une frappe que lorsqu'elle tombe dans le cercle. */
  const RITE_BODY = `
      const wait = (ms) => new Promise(r => setTimeout(r, ms));
      const click = (sel, n) => { const l = document.querySelectorAll(sel);
        for (let i = 0; i < n && i < l.length; i++) l[i].click(); };
      const cnt = () => document.querySelector('#dsc-count').textContent.trim();
      const trace = [];
      const line = document.querySelector('#scan-line');
      if (line) { line.click(); await wait(200); }
      trace.push('scan=' + cnt());
      document.querySelector('#dsc-down').click(); await wait(300);
      click('#laser-field .beacon', 3); await wait(250);
      trace.push('balises=' + cnt());
      document.querySelector('#dsc-down').click(); await wait(300);
      click('#flyers .flyer[data-code="true"]', 3); await wait(250);
      trace.push('mur=' + cnt());
      document.querySelector('#dsc-down').click(); await wait(300);
      const alt = document.querySelector('#breath-alt');
      for (let i = 0; i < 5; i++) { alt.click(); await wait(160); }
      trace.push('souffle=' + cnt());
      document.querySelector('#dsc-down').click(); await wait(300);
      const rhythm = document.querySelector('#rhythm');
      const hits = document.querySelector('#hits');
      for (let i = 0; i < 80; i++) {
        rhythm.click();
        await wait(120);
        if (hits.textContent.trim().indexOf('3 / 3') === 0) break;
      }
      trace.push('autel=' + cnt() + ' [' + hits.textContent.trim() + ']');
      document.querySelector('#dsc-down').click(); await wait(300);
      click('#candles .candle', 5); await wait(250);
      trace.push('bougies=' + cnt());`;

  await shot('04-descente-rite-autel', {
    hash: '#/descente',
    script: `(async () => {
      const wait = (ms) => new Promise(r => setTimeout(r, ms));
      const line = document.querySelector('#scan-line');
      if (line) line.click();
      await wait(200);
      for (let i = 0; i < 4; i++) {
        document.querySelector('#dsc-down').click(); await wait(320);
      }
      const stage = document.querySelector('#dsc-stage').getAttribute('data-scene');
      const rhythm = document.querySelector('#rhythm');
      const hits = document.querySelector('#hits');
      for (let i = 0; i < 80; i++) {
        rhythm.click();
        await wait(120);
        if (hits.textContent.trim().indexOf('3 / 3') === 0) break;
      }
      await wait(300);
      return 'scene=' + stage + ' | ' + document.querySelector('#dsc-count').textContent.trim()
        + ' | frappe=' + hits.textContent.trim(); })()`
  });

  await shot('05-descente-fosse-finale', {
    hash: '#/descente',
    script: `(async () => {${RITE_BODY}
      document.querySelector('#dsc-down').click(); await wait(500);
      const fosse = document.querySelector('#sc-fosse');
      trace.push('fosse=' + (fosse ? 'ouverte' : 'refusee') + '/' + cnt());
      return trace.join(' | '); })()`
  });

  await shot('06-archives-frise', {
    hash: '#/archives',
    scroll: scrollTo('#arch-scroll')
  });

  await shot('07-archives-mur-local', {
    hash: '#/archives',
    script: `(async () => {
      const wait = (ms) => new Promise(r => setTimeout(r, ms));
      const t = document.querySelector('#w-text');
      if (!t) return 'mur absent';
      t.value = "La veille, dans la cour, on a jou\\u00e9 du vieux rock jusqu\\u2019au bout de la nuit.";
      document.querySelector('#w-name').value = 'Hellbanger';
      document.querySelector('#witness-form').dispatchEvent(new Event('submit', { cancelable: true }));
      await wait(400);
      return document.querySelectorAll('#witness-list .witness').length + ' fragment(s)'; })()`,
    scroll: scrollTo('.witness-form')
  });

  await shot('08-programme-filtres', {
    hash: '#/programme',
    script: `(async () => {
      const wait = (ms) => new Promise(r => setTimeout(r, ms));
      const days = document.querySelectorAll('[data-day]');
      if (days[2]) days[2].click();
      await wait(300);
      const scenes = document.querySelectorAll('[data-scene]');
      if (scenes[0]) scenes[0].click();
      await wait(300);
      return document.querySelectorAll('#main .slot').length + ' créneaux'; })()`,
    scroll: scrollTo('#main .schedule, #main .slots, #main section')
  });

  await shot('09-pratique-passes-simulees', {
    hash: '#/pratique',
    scroll: scrollTo('#passes')
  });

  await shot('10-pratique-acces', {
    hash: '#/pratique',
    scroll: scrollTo('#acces')
  });

  await shot('11-pratique-accessibilite', {
    hash: '#/pratique',
    scroll: scrollTo('#accessibilite')
  });

  await shot('12-colonne-verifie', {
    hash: '#/colonne',
    scroll: scrollTo('#verifie')
  });

  await shot('13-mobile-accueil', { hash: '#/', width: 390, height: 844, dsf: 2, mobile: true });
  await shot('14-mobile-menu', {
    hash: '#/', width: 390, height: 844, dsf: 2, mobile: true,
    script: `(async () => { await new Promise(r => setTimeout(r, 300));
      document.querySelector('#nav-toggle').click();
      await new Promise(r => setTimeout(r, 400));
      return document.querySelector('#site-nav').className; })()`
  });
  await shot('15-mobile-programme', {
    hash: '#/programme', width: 390, height: 844, dsf: 2, mobile: true,
    scroll: scrollTo('#main section:nth-of-type(2)')
  });

  ws.close();
  chrome.kill();
  await delay(400);
  rmSync(PROFILE, { recursive: true, force: true });
  console.log('Terminé.');
}

main().catch((e) => { console.error('ÉCHEC :', e.message); process.exit(1); });
