/* Sound, disintegration and text-scramble effects. */

/* ---------------- Sound (synthesised, no files) ---------------- */
export const sound = {
  ctx: null, master: null, enabled: false, drone: null,
  init() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(this.ctx.destination);
    this._drone();
  },
  set(on) {
    this.init();
    if (!this.ctx) return;
    this.enabled = on;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.linearRampToValueAtTime(on ? 0.55 : 0, t + 0.6);
  },
  _drone() {
    const c = this.ctx, g = c.createGain();
    g.gain.value = 0.05;
    const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 380; f.Q.value = 4;
    [55, 55.4, 82.5, 110.3].forEach((hz, i) => {
      const o = c.createOscillator(); o.type = i % 2 ? 'sawtooth' : 'sine'; o.frequency.value = hz;
      const og = c.createGain(); og.gain.value = i % 2 ? 0.12 : 0.5;
      o.connect(og).connect(f); o.start();
    });
    const lfo = c.createOscillator(); lfo.frequency.value = 0.07;
    const lg = c.createGain(); lg.gain.value = 160;
    lfo.connect(lg).connect(f.frequency); lfo.start();
    f.connect(g).connect(this.master);
    this.drone = { gain: g, filter: f };
  },
  tint(level) { // drone brightness, used by power / reality
    if (!this.ctx) return;
    this.drone.filter.frequency.setTargetAtTime(380 + level * 1400, this.ctx.currentTime, 0.1);
  },
  _noise(dur) {
    const c = this.ctx, b = c.createBuffer(1, c.sampleRate * dur, c.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const s = c.createBufferSource(); s.buffer = b; return s;
  },
  tick() {
    if (!this.enabled) return;
    const c = this.ctx, t = c.currentTime, o = c.createOscillator(), g = c.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(1800, t); o.frequency.exponentialRampToValueAtTime(900, t + 0.05);
    g.gain.setValueAtTime(0.03, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
    o.connect(g).connect(this.master); o.start(t); o.stop(t + 0.08);
  },
  chime(base = 440) {
    if (!this.enabled) return;
    const c = this.ctx, t = c.currentTime;
    [1, 2.01, 2.76, 4.07, 5.4].forEach((m, i) => {
      const o = c.createOscillator(), g = c.createGain();
      o.frequency.value = base * m; o.type = 'sine';
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12 / (i + 1), t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 2.8 - i * 0.3);
      o.connect(g).connect(this.master); o.start(t); o.stop(t + 3);
    });
  },
  impact() {
    if (!this.enabled) return;
    const c = this.ctx, t = c.currentTime;
    const o = c.createOscillator(), g = c.createGain();
    o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(30, t + 0.6);
    g.gain.setValueAtTime(0.5, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
    o.connect(g).connect(this.master); o.start(t); o.stop(t + 1);
    const n = this._noise(0.4), f = c.createBiquadFilter(), ng = c.createGain();
    f.type = 'highpass'; f.frequency.value = 2500;
    ng.gain.setValueAtTime(0.25, t); ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    n.connect(f).connect(ng).connect(this.master); n.start(t);
  },
  snap() {
    if (!this.enabled) return;
    const c = this.ctx, t = c.currentTime;
    // the click of fingers
    const n = this._noise(0.08), f = c.createBiquadFilter(), g = c.createGain();
    f.type = 'bandpass'; f.frequency.value = 2200; f.Q.value = 1.2;
    g.gain.setValueAtTime(0.9, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
    n.connect(f).connect(g).connect(this.master); n.start(t);
    // the silence, then the wind of ash
    const w = this._noise(5), wf = c.createBiquadFilter(), wg = c.createGain();
    wf.type = 'bandpass'; wf.Q.value = 0.7;
    wf.frequency.setValueAtTime(300, t + 0.6); wf.frequency.exponentialRampToValueAtTime(3000, t + 4.5);
    wg.gain.setValueAtTime(0.0001, t + 0.5); wg.gain.exponentialRampToValueAtTime(0.18, t + 1.6); wg.gain.exponentialRampToValueAtTime(0.0001, t + 5);
    w.connect(wf).connect(wg).connect(this.master); w.start(t + 0.5);
    const o = c.createOscillator(), og = c.createGain();
    o.frequency.value = 41; og.gain.setValueAtTime(0.0001, t + 0.15); og.gain.exponentialRampToValueAtTime(0.35, t + 0.3); og.gain.exponentialRampToValueAtTime(0.0001, t + 3.5);
    o.connect(og).connect(this.master); o.start(t + 0.15); o.stop(t + 3.6);
  },
  rewind() {
    if (!this.enabled) return;
    const c = this.ctx, t = c.currentTime;
    const o = c.createOscillator(), g = c.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(900, t); o.frequency.exponentialRampToValueAtTime(110, t + 2.2);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.3); g.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);
    o.connect(g).connect(this.master); o.start(t); o.stop(t + 2.5);
    this.chime(523);
  },
};

/* ---------------- Disintegration ---------------- */
const dustCanvas = () => document.getElementById('dust');
let particles = [];
let running = false;

function sizeDust() {
  const c = dustCanvas(), dpr = Math.min(devicePixelRatio || 1, 2);
  c.width = innerWidth * dpr; c.height = innerHeight * dpr;
  c.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
}
addEventListener('resize', () => dustCanvas() && sizeDust());

function loop() {
  const c = dustCanvas(), x = c.getContext('2d');
  x.clearRect(0, 0, innerWidth, innerHeight);
  const now = performance.now();
  particles = particles.filter(p => now < p.t0 + p.life);
  for (const p of particles) {
    const k = (now - p.t0) / p.life;
    if (k < 0) continue;
    const e = p.reverse ? 1 - k : k;
    const ease = e * e;
    const px = p.x + p.vx * ease * 220 + Math.sin(p.seed + e * 6) * 14 * e;
    const py = p.y + p.vy * ease * 220 - e * 40;
    const a = p.reverse ? Math.min(1, (1 - k) * 2) * (k > 0.92 ? (1 - k) / 0.08 : 1) : (1 - k);
    x.globalAlpha = Math.max(0, a) * 0.9;
    x.fillStyle = p.c;
    x.fillRect(px, py - scrollYDelta(p), p.s, p.s);
  }
  x.globalAlpha = 1;
  if (particles.length) requestAnimationFrame(loop); else running = false;
}
function scrollYDelta(p) { return scrollY - p.sy; }

const PALETTE = ['#5b4637', '#8a6a52', '#2b2522', '#b08d6e', '#3a3030', '#d6c2a8'];

/** Turn an element to ash. Returns a promise that resolves when it is gone. */
export function disintegrate(el, { delay = 0, duration = 2200, reverse = false } = {}) {
  if (!running) { sizeDust(); }
  const r = el.getBoundingClientRect();
  const visible = r.bottom > -200 && r.top < innerHeight + 200;
  const accent = getComputedStyle(el).color;
  if (visible) {
    const n = Math.min(520, Math.max(40, (r.width * r.height) / 140));
    const t = performance.now() + delay;
    for (let i = 0; i < n; i++) {
      const fx = Math.random();
      particles.push({
        x: r.left + fx * r.width, y: r.top + Math.random() * r.height,
        vx: 0.6 + Math.random() * 1.2, vy: -0.4 - Math.random() * 0.8,
        s: Math.random() < 0.15 ? 2.4 : 1.4, seed: Math.random() * 10,
        c: Math.random() < 0.35 ? accent : PALETTE[(Math.random() * PALETTE.length) | 0],
        t0: t + (reverse ? (1 - fx) : fx) * duration * 0.55, life: duration * (0.55 + Math.random() * 0.45),
        sy: scrollY, reverse,
      });
    }
    if (!running) { running = true; requestAnimationFrame(loop); }
  }
  return new Promise(res => {
    const start = performance.now() + delay;
    const step = () => {
      const k = Math.min(1, Math.max(0, (performance.now() - start) / (duration * 0.95)));
      const p = reverse ? 1 - k : k;
      // sweeping, noisy mask: left side crumbles first
      const edge = -20 + p * 140;
      el.style.webkitMaskImage = el.style.maskImage =
        `linear-gradient(100deg, transparent ${edge - 20}%, rgba(0,0,0,.35) ${edge - 6}%, #000 ${edge + 8}%)`;
      el.style.filter = `blur(${p * 2}px)`;
      el.style.opacity = String(1 - p * 0.15);
      if (k < 1) requestAnimationFrame(step);
      else {
        if (reverse) { el.style.webkitMaskImage = el.style.maskImage = ''; el.style.filter = ''; el.style.opacity = ''; }
        else el.style.visibility = 'hidden';
        res();
      }
    };
    if (reverse) el.style.visibility = '';
    requestAnimationFrame(step);
  });
}

/* ---------------- Scramble text ---------------- */
const GLYPHS = '▲◆●■◇○△▽※ΔΣΩΨΞ01⟁⟡⟐';
export function scramble(el, to, dur = 900) {
  const from = el.textContent;
  const len = Math.max(from.length, to.length);
  const start = performance.now();
  if (el._scr) cancelAnimationFrame(el._scr);
  const step = () => {
    const k = Math.min(1, (performance.now() - start) / dur);
    let out = '';
    for (let i = 0; i < len; i++) {
      const th = i / len;
      if (k > th + 0.25) out += to[i] || '';
      else if (k > th) out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
      else out += from[i] || '';
    }
    el.textContent = out;
    if (k < 1) el._scr = requestAnimationFrame(step); else el.textContent = to;
  };
  el._scr = requestAnimationFrame(step);
}
