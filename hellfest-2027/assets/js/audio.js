/* =========================================================================
   HELLFEST 2027 — « Le Centième Feu »
   MOTEUR SONORE PROCÉDURAL
   Aucun fichier audio n'est distribué : tout est synthétisé par Web Audio.
   Le son est OPTIONNEL, éteint par défaut, et jamais requis pour comprendre
   l'expérience (parcours « Son » textuel fourni en alternative).
   ========================================================================= */

const AudioEngine = (function () {
  const KEY = 'hf27.sound';
  let ctx = null;
  let master = null;
  let nodes = [];
  let current = null;
  let intensity = 0.5;
  let crackleTimer = null;
  let enabled = false;

  function store(key, val) { try { localStorage.setItem(key, val); } catch (e) { /* stockage indisponible */ } }
  function read(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }

  function buildGraph() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.ratio.value = 8;
    comp.attack.value = 0.01;
    comp.release.value = 0.25;
    master.connect(comp).connect(ctx.destination);
    return true;
  }

  function noiseBuffer(seconds) {
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  function stopNodes() {
    nodes.forEach(function (n) {
      try { n.stop ? n.stop() : n.disconnect(); } catch (e) { /* déjà arrêté */ }
      try { n.disconnect(); } catch (e) { /* déjà débranché */ }
    });
    nodes = [];
    if (crackleTimer) { clearInterval(crackleTimer); crackleTimer = null; }
  }

  function profileDrone() {
    const g = ctx.createGain(); g.gain.value = 0.16;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 260; lp.Q.value = 3;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain(); lfoGain.gain.value = 90;
    lfo.connect(lfoGain).connect(lp.frequency);
    [55, 55.7, 82.5].forEach(function (f, i) {
      const o = ctx.createOscillator();
      o.type = i === 2 ? 'triangle' : 'sawtooth';
      o.frequency.value = f;
      const og = ctx.createGain(); og.gain.value = i === 2 ? 0.22 : 0.4;
      o.connect(og).connect(lp);
      o.start(); nodes.push(o);
    });
    lp.connect(g).connect(master);
    lfo.start(); nodes.push(lfo);
  }

  function profileNoise() {
    const g = ctx.createGain(); g.gain.value = 0.1;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 1.4;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(3); src.loop = true;
    src.connect(bp).connect(g).connect(master);
    src.start(); nodes.push(src);
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.23;
    const lg = ctx.createGain(); lg.gain.value = 420;
    lfo.connect(lg).connect(bp.frequency);
    lfo.start(); nodes.push(lfo);
  }

  function profileAir() {
    const g = ctx.createGain(); g.gain.value = 0.07;
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 700;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(4); src.loop = true;
    src.connect(hp).connect(g).connect(master);
    src.start(); nodes.push(src);
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.05;
    const lg = ctx.createGain(); lg.gain.value = 380;
    lfo.connect(lg).connect(hp.frequency);
    lfo.start(); nodes.push(lfo);
  }

  function profileFire() {
    profileDrone();
    const bus = ctx.createGain(); bus.gain.value = 0.5; bus.connect(master);
    crackleTimer = setInterval(function () {
      if (!ctx || !enabled) return;
      const dur = 0.03 + Math.random() * 0.07;
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer(0.2);
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass';
      bp.frequency.value = 1200 + Math.random() * 3200; bp.Q.value = 2;
      const g = ctx.createGain();
      const t = ctx.currentTime;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.05 + Math.random() * 0.09, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(bp).connect(g).connect(bus);
      src.start(t); src.stop(t + dur + 0.02);
    }, 170);
  }

  const PROFILES = { drone: profileDrone, noise: profileNoise, air: profileAir, fire: profileFire };

  function play(profile) {
    if (!enabled) return;
    if (!ctx && !buildGraph()) return;
    if (ctx.state === 'suspended') ctx.resume();
    stopNodes();
    current = profile || 'drone';
    (PROFILES[current] || profileDrone)();
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 1.1);
  }

  function setEnabled(on) {
    enabled = !!on;
    store(KEY, enabled ? '1' : '0');
    if (enabled) {
      play(current);
    } else if (ctx && master) {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
      setTimeout(function () { if (!enabled) stopNodes(); }, 520);
    }
  }

  function setIntensity(v) {
    intensity = Math.max(0, Math.min(1, v));
    if (master && ctx && enabled) {
      master.gain.linearRampToValueAtTime(0.12 + intensity * 0.45, ctx.currentTime + 0.25);
    }
  }

  return {
    init: function () {
      enabled = read(KEY) === '1';
      return enabled;
    },
    isEnabled: function () { return enabled; },
    setEnabled: setEnabled,
    toggle: function () { setEnabled(!enabled); return enabled; },
    play: play,
    setIntensity: setIntensity,
    currentProfile: function () { return current; }
  };
})();
