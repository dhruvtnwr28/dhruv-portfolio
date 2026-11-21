import { Engine, STONE_SHAPES } from './engine.js';
import { Conduit } from './conduit.js';
import { Reliquary } from './reliquary.js';
import { sound, disintegrate, scramble, sparks } from './fx.js';
import { PROFILE, STONES, ABOUT, SKILLS, PROJECTS, EXPERIENCE, OPEN_SOURCE, TIMELINE } from './content.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI'];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const touch = matchMedia('(pointer: coarse)').matches;
const stoneById = id => STONES.find(s => s.id === id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const lerp = (a, b, k) => a + (b - a) * k;

/* ============================== BUILD THE PAGE ============================== */

function chapterHead(stone, i, title, extraHint, noRelic = false) {
  return `
  <header class="chapter-head${noRelic ? ' no-relic' : ''}">
    <div class="ch-text">
      <p class="ch-kicker dust"><span class="ch-num">${ROMAN[i]}</span><span class="ch-line"></span><span>The ${stone.name} Stone</span></p>
      <h2 class="ch-title dust">${title}</h2>
      <p class="ch-lore dust">${esc(stone.lore)}</p>
      <p class="ch-log dust"><span>Log ${String(i).padStart(2, '0')}</span>${esc(stone.log)}</p>
    </div>
    ${noRelic ? '' : `<div class="relic-anchor" data-relic="${stone.id}" data-stone="${stone.id}">
      <span class="relic-hint">${esc(extraHint || stone.how)}</span>
      <span class="relic-ring"></span>
      <img class="relic-fallback" src="assets/img/stones/${stone.id}.png" alt="" />
    </div>`}
  </header>`;
}

function build() {
  const S = Object.fromEntries(STONES.map(s => [s.id, s]));
  const html = [];

  // I · SPACE — Origin / About
  html.push(`
  <section class="chapter" id="space" data-chapter="1" data-stone="space" data-name="Space · Origin">
    ${chapterHead(S.space, 1, 'Origin', 'Its home is the cube at the top of the page.')}
    <div class="about-grid">
      <div class="about-copy">
        <p class="lead dust" data-alt="${esc(ABOUT.alt[0])}">${esc(ABOUT.lead)}</p>
        ${ABOUT.body.map(p => `<p class="dust">${esc(p)}</p>`).join('')}
      </div>
      <div class="stats">
        ${ABOUT.stats.map(s => `<div class="stat glass dust"><b>${s.n}</b><span>${s.label}</span></div>`).join('')}
      </div>
    </div>
  </section>`);

  // II · MIND — Arsenal / Skills
  html.push(`
  <section class="chapter" id="mind" data-chapter="2" data-stone="mind" data-name="Mind · Arsenal">
    ${chapterHead(S.mind, 2, 'Arsenal')}
    <div class="mind-wrap glass dust">
      <canvas id="mindCanvas" aria-label="Skill constellation"></canvas>
      <p class="mind-status mono" id="mindStatus">Click a skill to wake it. Then wake one it is linked to.</p>
    </div>
    <div class="skill-groups">
      ${SKILLS.groups.map(g => `
        <div class="skill-group dust"><h3>${g.name}</h3><ul>${g.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>`).join('')}
    </div>
  </section>`);

  // III · REALITY — Creations / Projects
  html.push(`
  <section class="chapter" id="reality" data-chapter="3" data-stone="reality" data-name="Reality · Creations">
    ${chapterHead(S.reality, 3, 'Creations')}
    <p class="section-note dust" data-alt="You are in the other reality now. Every card shows what is underneath.">Shift reality (top right, or press R) and every project shows what is underneath.</p>
    <div class="projects">
      ${PROJECTS.map((p, i) => `
      <article class="card dust" style="--i:${i}">
        <div class="card-inner">
          <div class="card-face front glass">
            <p class="card-tag mono">${esc(p.tag)}</p>
            <h3>${esc(p.title)}</h3>
            <p>${esc(p.blurb)}</p>
            <ul class="chips">${p.stack.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
            <div class="card-links">${p.links.map(l => `<a href="${l.url}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join('')}</div>
          </div>
          <div class="card-face back glass">
            <p class="card-tag mono">Under the hood</p>
            <h3>${esc(p.title)}</h3>
            <p>${esc(p.under)}</p>
            <div class="card-links">${p.links.map(l => `<a href="${l.url}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join('')}</div>
          </div>
        </div>
      </article>`).join('')}
    </div>
  </section>`);

  // IV · POWER — Experience
  html.push(`
  <section class="chapter" id="power" data-chapter="4" data-stone="power" data-name="Power · Experience">
    ${chapterHead(S.power, 4, 'Experience')}
    <div class="xp">
      ${EXPERIENCE.map(x => `
      <article class="xp-item glass dust">
        <div class="xp-meta"><span class="mono">${esc(x.when)}</span></div>
        <div class="xp-body">
          <h3>${esc(x.role)} <span>· ${esc(x.org)}</span></h3>
          <ul>${x.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul>
          ${x.url ? `<a class="xp-link" href="${x.url}" target="_blank" rel="noopener">See the work ↗</a>` : ''}
        </div>
      </article>`).join('')}
    </div>
  </section>`);

  // V · TIME — Chronicle / Open source + timeline
  html.push(`
  <section class="chapter" id="time" data-chapter="5" data-stone="time" data-name="Time · Chronicle">
    ${chapterHead(S.time, 5, 'Chronicle', '', true)}
    <h3 class="sub dust">Open source</h3>
    <div class="oss">
      ${OPEN_SOURCE.map(o => `
      <a class="oss-item glass dust" href="${o.url}" target="_blank" rel="noopener">
        <span class="mono">${esc(o.lang)}</span>
        <h4>${esc(o.org)} <em>/ ${esc(o.repo)}</em></h4>
        <p>${esc(o.what)}</p>
      </a>`).join('')}
    </div>
    <h3 class="sub dust">The timeline</h3>
    <div class="chrono">
      <div class="dial dust" id="dial" role="slider" tabindex="0" aria-label="Time dial" aria-valuemin="1" aria-valuemax="${TIMELINE.length}" aria-valuenow="1">
        ${dialSVG()}
        <div class="relic-anchor dial-relic" data-relic="time" data-stone="time"><img class="relic-fallback" src="assets/img/stones/time.png" alt="" /></div>
        ${irisSVG()}
        <canvas class="dial-rel" id="dialRel" aria-hidden="true"></canvas>
        <span class="dial-year" id="dialYear"></span>
      </div>
      <div class="chrono-read glass dust" id="chronoRead" aria-live="polite"></div>
    </div>
    <p class="mono dial-help dust" id="dialHelp">Turn the outer ring to wind back the years. One full turn wakes the reliquary.</p>
    <button class="btn btn-ghost replay-time dust" id="replayTime" hidden>Watch the reliquary open again</button>
  </section>`);

  // VI · SOUL — Contact
  html.push(`
  <section class="chapter" id="soul" data-chapter="6" data-stone="soul" data-name="Soul · Contact">
    ${chapterHead(S.soul, 6, 'Contact')}
    <div class="contact glass dust">
      <p class="contact-lead" data-alt="You found me. That was the hard part.">Have something worth building? I am listening.</p>
      <a class="contact-mail" href="mailto:${PROFILE.email}">${PROFILE.email}</a>
      <div class="contact-row">
        <button class="btn btn-ghost" id="copyMail">Copy email</button>
        <a class="btn btn-ghost" href="${PROFILE.github}" target="_blank" rel="noopener">GitHub ${PROFILE.githubHandle} ↗</a>
      </div>
    </div>
  </section>`);

  $('#chapters').innerHTML = html.join('');
  $('#yr').textContent = new Date().getFullYear();

  // sockets
  $('#sockets').innerHTML = STONES.map((s, i) => `
    <a class="socket" href="#${s.id}" data-stone="${s.id}" style="--c:${s.hex};--a:${i * 60 - 90}deg" aria-label="${s.name} Stone · ${s.chapter}">
      <img src="assets/img/stones/${s.id}.png" alt="" />
      <span class="socket-tip"><b>${s.name}</b> · ${s.chapter}<br><em>${esc(s.how)}</em></span>
    </a>`).join('');
}

function irisSVG() {
  const blades = [];
  const N = 9;
  for (let i = 0; i < N; i++) {
    const a0 = (i / N) * 360;
    blades.push(`<g class="blade" style="--a:${a0}deg"><path d="M0,0 L66,-4 A66,66 0 0,1 38,54 Q20,22 0,0Z"/><path class="blade-hi" d="M6,-1 L62,-4" /></g>`);
  }
  return `
  <svg class="iris" viewBox="-60 -60 120 120" aria-hidden="true">
    <defs>
      <clipPath id="irisClip"><circle r="57"/></clipPath>
      <linearGradient id="brass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#e7c98a"/><stop offset=".35" stop-color="#9c7438"/><stop offset=".6" stop-color="#5b3f19"/><stop offset=".85" stop-color="#b48a46"/><stop offset="1" stop-color="#3d2a10"/>
      </linearGradient>
      <radialGradient id="brassRim"><stop offset=".85" stop-color="#2a1c0a"/><stop offset=".93" stop-color="#c9a35f"/><stop offset="1" stop-color="#3a2810"/></radialGradient>
      <filter id="bladeShade" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="1.2" stdDeviation="1.4" flood-color="#000" flood-opacity=".75"/></filter>
    </defs>
    <g clip-path="url(#irisClip)"><g class="blades" filter="url(#bladeShade)">${blades.join('')}</g></g>
    <circle r="58.5" fill="none" stroke="url(#brassRim)" stroke-width="5"/>
    ${Array.from({ length: 18 }, (_, i) => { const a = i * 20 * Math.PI / 180; return `<circle cx="${Math.cos(a) * 58.5}" cy="${Math.sin(a) * 58.5}" r=".9" fill="#f3dca3"/>`; }).join('')}
  </svg>`;
}

function dialSVG() {
  const ticks = [];
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2, r1 = 140, r2 = i % 6 ? 133 : 124;
    ticks.push(`<line x1="${150 + Math.cos(a) * r1}" y1="${150 + Math.sin(a) * r1}" x2="${150 + Math.cos(a) * r2}" y2="${150 + Math.sin(a) * r2}"/>`);
  }
  const marks = TIMELINE.map((t, i) => {
    const a = (i / TIMELINE.length) * Math.PI * 2 - Math.PI / 2;
    return `<circle cx="${150 + Math.cos(a) * 104}" cy="${150 + Math.sin(a) * 104}" r="4"/>`;
  }).join('');
  return `
  <svg viewBox="0 0 300 300" aria-hidden="true">
    <defs>
      <path id="runePath" d="M150,150 m-88,0 a88,88 0 1,1 176,0 a88,88 0 1,1 -176,0"/>
      <radialGradient id="dialGlow"><stop offset="0" stop-color="#1fe07a" stop-opacity=".35"/><stop offset="1" stop-color="#1fe07a" stop-opacity="0"/></radialGradient>
    </defs>
    <circle cx="150" cy="150" r="150" fill="url(#dialGlow)"/>
    <g class="sigils">
      <circle cx="150" cy="150" r="172" class="sig s1"/>
      <circle cx="150" cy="150" r="186" class="sig s2"/>
      <g class="sig-glyphs">${Array.from({ length: 12 }, (_, i) => { const a = i * 30; return `<rect x="146" y="-28" width="8" height="8" transform="rotate(${a} 150 150) rotate(45 150 -24)" class="sig-g"/>`; }).join('')}</g>
      <polygon class="sig-star" points="${Array.from({ length: 12 }, (_, i) => { const a = (i * 150) * Math.PI / 180; return `${150 + Math.cos(a) * 168},${150 + Math.sin(a) * 168}`; }).join(' ')}"/>
    </g>
    <g class="dial-outer">
      <circle cx="150" cy="150" r="144" class="ring"/>
      <g class="ticks">${ticks.join('')}</g>
    </g>
    <g class="dial-rot" id="dialRot">
      <circle cx="150" cy="150" r="104" class="ring thin"/>
      <g class="marks">${marks}</g>
      <g class="runes">${Array.from({ length: 36 }, (_, i) => {
        const a = i * 10, k = i % 4;
        const g = k === 0 ? 'M-3,-3 L0,3 L3,-3' : k === 1 ? 'M0,-3.5 L0,3.5 M-2.5,-1 L2.5,-1' : k === 2 ? 'M-3,0 A3,3 0 1,1 3,0' : 'M-2.5,-3 L2.5,3 M2.5,-3 L-2.5,3';
        return `<path d="${g}" transform="rotate(${a} 150 150) translate(150 62)"/>`;
      }).join('')}</g>
      <polygon points="150,30 158,52 150,46 142,52" class="pointer"/>
      <g class="petals">${[0,1,2,3,4,5].map(i => `<ellipse cx="150" cy="104" rx="12" ry="40" transform="rotate(${i*60} 150 150)"/>`).join('')}</g>
    </g>
    <circle cx="150" cy="150" r="58" class="ring thin"/>
  </svg>`;
}

/* ============================== STATE ============================== */

const store = {
  get() { try { return JSON.parse(localStorage.getItem('stones') || '[]'); } catch { return []; } },
  set(v) { try { localStorage.setItem('stones', JSON.stringify(v)); } catch {} },
};
const claimed = new Set(store.get().filter(id => stoneById(id)));
let realityOn = false;
let snapped = false;

const fx = { reality: 0, rewind: 0, power: 0, snap: 0, crack: 0, rewindTarget: 0, powerTarget: 0 };

/* ============================== ENGINE ============================== */

let engine = null;
const glCanvas = $('#gl');
try {
  engine = new Engine(glCanvas, { scale: touch ? 0.6 : Math.min(devicePixelRatio || 1, 1.5) * 0.75 });
  document.body.classList.add('gl-on');
} catch (e) {
  console.warn('WebGL off, using static art.', e);
  document.body.classList.add('gl-off');
}

let conduit = null;
try {
  conduit = new Conduit($('#conduitGL'), STONES.map(s => s.rgb));
  document.body.classList.add('conduit-on');
} catch (e) { console.warn('Conduit fallback', e); }

/* ---- power surges: screen trauma, light, shockwave, sound ---- */
const quake = { trauma: 0, floor: 0, t: 0 };
const surgeFx = { v: 0, col: [1, 1, 1], wave: 1, waveC: [0, 0] };
function addTrauma(x) { quake.trauma = Math.min(1.4, quake.trauma + x); }
function center(el) {
  const r = el.getBoundingClientRect();
  return [r.left + r.width / 2, innerHeight - (r.top + r.height / 2)];
}
function surge(level, st, originEl) {
  addTrauma(0.35 + level * 0.55);
  surgeFx.v = Math.min(1.4, 0.7 + level * 0.6);
  surgeFx.col = st.rgb;
  surgeFx.wave = 0;
  surgeFx.waveC = originEl ? center(originEl) : [innerWidth / 2, innerHeight / 2];
  document.documentElement.style.setProperty('--surge', st.hex);
  document.body.classList.remove('surging'); void document.body.offsetWidth;
  document.body.classList.add('surging');
  setTimeout(() => document.body.classList.remove('surging'), 900);
  if (conduit) { conduit.flash = 1; conduit.flashCol = st.rgb; }
  sound.surge(level);
}
async function megaSurge() {
  const box = $('.conduit');
  document.body.classList.add('letterboxed', 'mega-on');
  sound.mega();
  for (let i = 0; i < STONES.length; i++) {
    surge(0.35 + i * 0.08, STONES[i], box);
    await wait(260);
  }
  await wait(250);
  addTrauma(1.4);
  surgeFx.v = 2.2; surgeFx.col = [1, 0.92, 0.75]; surgeFx.wave = 0; surgeFx.waveC = center(box);
  document.body.classList.add('whiteout');
  $('#mega').classList.add('show');
  if (conduit) conduit.ready = 1;
  await wait(900);
  document.body.classList.remove('whiteout');
  await wait(2600);
  $('#mega').classList.remove('show');
  document.body.classList.remove('letterboxed', 'mega-on');
  toast('All six stones are seated. The <b>Snap</b> is in the centre of the medallion.', 5200);
}
const wait = ms => new Promise(r => setTimeout(r, ms));

const relic = {
  anchor: null, current: null, vis: 0, swapping: false,
  rot: [0, 0], vel: [0, 0], dragging: false,
  col: [0.24, 0.55, 1.0],
};

function relicKey(a) { return a ? a.dataset.relic : null; }

function pickAnchor() {
  let best = null, bestD = Infinity;
  const mid = innerHeight * 0.5;
  for (const a of $$('.relic-anchor')) {
    const r = a.getBoundingClientRect();
    if (r.bottom < -40 || r.top > innerHeight + 40) continue;
    const d = Math.abs(r.top + r.height / 2 - mid);
    if (d < bestD) { bestD = d; best = a; }
  }
  return best;
}

let irisOpen = 0;
function relicVisible(key) {
  if (key === 'reality') return realityOn || claimed.has('reality');
  if (key === 'time') return irisOpen > 0.03;
  return true;
}

function applyRelic(key) {
  if (key === 'cube') {
    if (claimed.has('space')) engine.setStone('space', stoneById('space').rgb);
    else engine.state.type = 0;
  } else engine.setStone(key, stoneById(key).rgb);
}

let last = performance.now();
const mainEl = document.querySelector('main');
const cam = { zoom: 1, origin: '50% 50%' };
let mouse = [0.5, 0.5];
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  if (engine && !document.hidden) {
    const s = engine.state;
    s.time += dt * (reduced ? 0.3 : 1) * (fx.rewind > 0.05 ? -1.5 : 1);
    s.mouse = [lerp(s.mouse[0], mouse[0], 0.05), lerp(s.mouse[1], mouse[1], 0.05)];

    // relic follows its anchor
    const a = pickAnchor();
    const key = relicKey(a);
    if (key !== relic.current && !relic.swapping) {
      relic.swapping = true;
    }
    if (relic.swapping) {
      relic.vis = Math.max(0, relic.vis - dt * 5);
      if (relic.vis === 0) {
        relic.current = key; relic.anchor = a; relic.swapping = false;
        if (key) applyRelic(key);
      }
    } else if (relic.current) {
      const target = relicVisible(relic.current) ? 1 : 0;
      relic.vis = lerp(relic.vis, target, Math.min(1, dt * 4));
    }
    if (relic.anchor) {
      const r = relic.anchor.getBoundingClientRect();
      s.obj = [r.left + r.width / 2, innerHeight - (r.top + r.height / 2), Math.min(r.width, r.height) * 0.5];
    }
    s.vis = relic.vis;

    // rotation with inertia
    if (!relic.dragging) {
      relic.rot[0] += relic.vel[0]; relic.rot[1] += relic.vel[1];
      relic.vel[0] *= 0.95; relic.vel[1] *= 0.95;
      relic.rot[1] *= 0.985;
    }
    s.rot = relic.rot;

    // effects
    fx.reality = lerp(fx.reality, realityOn ? 1 : 0, Math.min(1, dt * 2.2));
    fx.rewind = lerp(fx.rewind, fx.rewindTarget, Math.min(1, dt * 3));
    fx.power = lerp(fx.power, fx.powerTarget, Math.min(1, dt * 6));
    s.reality = fx.reality; s.rewind = fx.rewind; s.power = fx.power;
    s.snap = fx.snap; s.crack = fx.crack;
    surgeFx.v = Math.max(0, surgeFx.v - dt * 1.1);
    surgeFx.wave = Math.min(1, surgeFx.wave + dt * 0.75);
    s.surge = Math.min(1.5, surgeFx.v); s.surgeCol = surgeFx.col; s.wave = surgeFx.wave; s.waveC = surgeFx.waveC;

    // background tint follows the chapter
    const target = currentStone ? stoneById(currentStone).rgb : [0.24, 0.5, 1];
    relic.col = relic.col.map((v, i) => lerp(v, realityOn ? [1, 0.12, 0.16][i] : target[i], Math.min(1, dt * 1.6)));
    s.col = relic.col;

    engine.render();
  }
  // camera shake: trauma squared, driven by smooth noise, decays like a real impact
  quake.t += dt;
  quake.trauma = Math.max(quake.floor, quake.trauma - dt * 0.85);
  const amp = reduced ? 0 : quake.trauma * quake.trauma;
  const nz = (o) => Math.sin(quake.t * 31 + o) * 0.6 + Math.sin(quake.t * 57 + o * 2.3) * 0.4;
  const sx = amp * 22 * nz(1), sy = amp * 16 * nz(7), sr = amp * 1.2 * nz(13);
  const zoomed = Math.abs(cam.zoom - 1) > 0.001;
  const tr = (amp > 0.0005 ? `translate3d(${sx}px, ${sy}px, 0) rotate(${sr}deg)` : '') + (zoomed ? ` scale(${cam.zoom})` : '');
  mainEl.style.transform = tr;
  mainEl.style.transformOrigin = zoomed ? cam.origin : '';
  if (dialRel && dialRelVisible()) { dialRel.state.time += dt; dialRel.render(); }
  glCanvas.style.transform = amp > 0.0005 ? `translate3d(${sx * 0.6}px, ${sy * 0.6}px, 0) scale(1.06)` : '';
  if (conduit) { conduit.tiltT = [(mouse[0] - 0.5) * 0.35, (mouse[1] - 0.5) * 0.35]; conduit.step(dt); }
  requestAnimationFrame(frame);
}

function resize() {
  if (engine) engine.resize(innerWidth, innerHeight);
}
addEventListener('resize', resize);

/* ============================== CHAPTERS & HUD ============================== */

let currentStone = null;
function watchChapters() {
  const els = $$('[data-chapter]');
  const io = new IntersectionObserver(entries => {
    for (const e of entries) if (e.isIntersecting) setChapter(e.target);
  }, { rootMargin: '-45% 0px -45% 0px' });
  els.forEach(el => io.observe(el));
}
function setChapter(el) {
  const n = +el.dataset.chapter;
  currentStone = el.dataset.stone || null;
  const col = currentStone ? stoneById(currentStone).hex : '#3d8bff';
  document.documentElement.style.setProperty('--accent', realityOn ? '#ff2d3c' : col);
  $('.hud-num').textContent = ROMAN[n];
  $('.hud-name').textContent = el.dataset.name;
  $$('.socket').forEach(s => s.classList.toggle('here', s.dataset.stone === currentStone));
}

function reveal() {
  const io = new IntersectionObserver(entries => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -8% 0px' });
  $$('.dust, .chapter-head .relic-anchor').forEach(el => io.observe(el));
}

let toastT;
function toast(html, ms = 3600) {
  const t = $('#toast');
  t.innerHTML = html; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), ms);
}

/* ============================== CLAIMING ============================== */

function refreshSockets() {
  $$('.socket').forEach(s => s.classList.toggle('owned', claimed.has(s.dataset.stone)));
  $('#stoneCount').textContent = claimed.size;
  const all = claimed.size === 6;
  const btn = $('#snapBtn');
  btn.disabled = !all;
  btn.classList.toggle('ready', all);
  btn.setAttribute('aria-label', all ? 'Snap' : `Snap (needs all six stones, ${claimed.size} found)`);
  $$('.relic-anchor').forEach(a => a.classList.toggle('owned', claimed.has(a.dataset.stone) && a.dataset.relic !== 'cube'));
}

function flyToSocket(id, fromEl, onArrive) {
  const sock = $(`.socket[data-stone="${id}"]`);
  if (!sock || !fromEl) { onArrive && onArrive(); return; }
  const a = fromEl.getBoundingClientRect(), b = sock.getBoundingClientRect();
  const img = document.createElement('img');
  img.src = `assets/img/stones/${id}.png`;
  img.className = 'flyer';
  const size = Math.min(a.width, 220);
  Object.assign(img.style, { left: `${a.left + a.width / 2 - size / 2}px`, top: `${a.top + a.height / 2 - size / 2}px`, width: `${size}px`, height: `${size}px` });
  document.body.appendChild(img);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
  img.animate([
    { transform: 'translate(0,0) scale(1)', opacity: 1, filter: 'brightness(2)' },
    { transform: `translate(${dx * 0.3}px, ${dy * 0.3 - 120}px) scale(.8)`, opacity: 1, offset: 0.4 },
    { transform: `translate(${dx}px, ${dy}px) scale(${b.width / size})`, opacity: 0.2, filter: 'brightness(1)' },
  ], { duration: reduced ? 10 : 1100, easing: 'cubic-bezier(.6,0,.3,1)' }).onfinish = () => {
    img.remove();
    sock.classList.add('flash'); setTimeout(() => sock.classList.remove('flash'), 900);
    onArrive && onArrive();
  };
}

function claim(id, fromEl, quiet = false) {
  if (claimed.has(id)) return false;
  claimed.add(id);
  store.set([...claimed]);
  const st = stoneById(id);
  const n = claimed.size;
  flyToSocket(id, fromEl || $(`.relic-anchor[data-relic="${id}"]`), () => {
    if (conduit) conduit.set(STONES.indexOf(st), true);
    refreshSockets();
    if (quiet) return;
    surge(n / 6, st, $('.conduit'));
    if (n === 6) setTimeout(megaSurge, 700);
  });
  if (!quiet) {
    sound.chime(330 + STONES.indexOf(st) * 55);
    const left = 6 - n;
    toast(`<b style="color:${st.hex}">The ${st.name} Stone</b> is yours. ${left ? `${left} remain.` : 'All six.'}`);
  }
  return true;
}

/* -- Space: strike the cube three times -- */
let strikes = 0;
function strikeCube(anchor) {
  if (claimed.has('space')) return;
  strikes++;
  sound.impact();
  anchor.animate([{ transform: 'translate(0,0)' }, { transform: 'translate(-6px,3px)' }, { transform: 'translate(5px,-4px)' }, { transform: 'translate(0,0)' }], { duration: 260 });
  const from = fx.crack, to = Math.min(1, strikes / 3);
  tween(400, k => { fx.crack = lerp(from, to, k); });
  if (strikes < 3) {
    toast(strikes === 1 ? 'The cube hums. Something is inside it.' : 'It is cracking. Once more.');
    return;
  }
  // shatter: dissolve the cube, then the stone appears in its place
  tween(1300, k => { fx.snap = k; }).then(() => {
    claimed.add('space'); // so applyRelic shows the stone
    applyRelic('cube');
    fx.crack = 0;
    claimed.delete('space');
    claim('space', anchor);
    $('.hero-relic .relic-hint').textContent = 'The Space Stone. It was inside all along.';
    tween(900, k => { fx.snap = 1 - k; });
  });
}

function tween(ms, fn) {
  return new Promise(res => {
    const t0 = performance.now();
    const step = () => {
      const k = Math.min(1, (performance.now() - t0) / ms);
      fn(k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
      if (k < 1) requestAnimationFrame(step); else res();
    };
    requestAnimationFrame(step);
  });
}

/* -- Relic pointer handling: drag to rotate, click to interact, hold for power -- */
function bindRelics() {
  for (const a of $$('.relic-anchor')) {
    let down = null, moved = 0, holdRAF = 0, holdStart = 0;
    a.addEventListener('pointerdown', e => {
      down = [e.clientX, e.clientY]; moved = 0;
      relic.dragging = true; a.setPointerCapture(e.pointerId);
      if (a.dataset.relic === 'power' && !claimed.has('power')) startHold();
    });
    a.addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - down[0], dy = e.clientY - down[1];
      moved += Math.abs(dx) + Math.abs(dy);
      relic.rot[0] += dx * 0.01; relic.rot[1] += dy * 0.01;
      relic.vel = [dx * 0.004, dy * 0.004];
      down = [e.clientX, e.clientY];
    });
    const up = () => {
      if (!down) return;
      relic.dragging = false;
      const wasClick = moved < 8;
      down = null;
      if (a.dataset.relic === 'power') endHold();
      if (wasClick) clickRelic(a);
    };
    a.addEventListener('pointerup', up);
    a.addEventListener('pointercancel', up);
    a.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); clickRelic(a); } });
    a.tabIndex = 0;
    a.setAttribute('role', 'button');
    a.setAttribute('aria-label', a.dataset.relic === 'cube' ? 'The cube' : `${stoneById(a.dataset.relic).name} Stone`);

    function startHold() {
      holdStart = performance.now();
      a.classList.add('holding');
      const step = () => {
        const k = Math.min(1, (performance.now() - holdStart) / 2400);
        fx.powerTarget = k;
        a.style.setProperty('--hold', k);
        quake.floor = k * 0.55;
        sound.tint(k);
        if (k >= 1) { endHold(true); return; }
        holdRAF = requestAnimationFrame(step);
      };
      holdRAF = requestAnimationFrame(step);
    }
    function endHold(done) {
      cancelAnimationFrame(holdRAF);
      a.classList.remove('holding');
      quake.floor = 0;
      sound.tint(0);
      if (done === true) {
        shockwave(a, '#a24dff');
        sound.impact();
        claim('power', a);
        tween(1400, k => { fx.powerTarget = 1 - k; });
      } else {
        fx.powerTarget = 0;
        a.style.setProperty('--hold', 0);
        if (performance.now() - holdStart > 250 && !claimed.has('power')) toast('It resists. Hold on longer.');
      }
    }
  }
}

function clickRelic(a) {
  const key = a.dataset.relic;
  if (key === 'cube') return strikeCube(a);
  if (claimed.has(key)) { const s = stoneById(key); toast(`<b style="color:${s.hex}">${s.name}.</b> ${s.lore}`); return; }
  switch (key) {
    case 'space': toast('This stone is still sealed inside the cube. <a href="#prologue">Go back to it ↑</a>'); break;
    case 'mind': toast('Wake three linked skills in the constellation below.'); break;
    case 'reality':
      if (!realityOn) toast('Nothing is here. Not in this reality. <button class="link" data-act="reality">Shift reality</button>');
      else { shockwave(a, '#ff2d3c'); claim('reality', a); }
      break;
    case 'power': break; // handled by hold
    case 'time': toast('Turn the dial below through one full revolution.'); break;
    case 'soul': {
      const others = STONES.filter(s => s.id !== 'soul' && !claimed.has(s.id));
      if (others.length) toast(`It will not come to empty hands. Still missing: ${others.map(s => `<b style="color:${s.hex}">${s.name}</b>`).join(', ')}.`, 5000);
      else soulExchange(a);
      break;
    }
  }
}

function soulExchange(a) {
  const veil = document.createElement('div');
  veil.className = 'soul-veil';
  veil.innerHTML = '<p>Everything you gathered, offered.</p><p>Everything returned.</p>';
  document.body.appendChild(veil);
  sound.chime(196);
  setTimeout(() => { claim('soul', a); }, 1800);
  setTimeout(() => veil.classList.add('out'), 2600);
  setTimeout(() => veil.remove(), 4200);
}

function shockwave(el, color) {
  const r = el.getBoundingClientRect();
  const w = document.createElement('div');
  w.className = 'shock';
  Object.assign(w.style, { left: `${r.left + r.width / 2}px`, top: `${r.top + r.height / 2}px`, '--c': color });
  document.body.appendChild(w);
  setTimeout(() => w.remove(), 1200);
}

/* ============================== MIND: constellation ============================== */

function mindConstellation() {
  const cv = $('#mindCanvas'), x = cv.getContext('2d');
  const names = SKILLS.groups.flatMap(g => g.items.map(n => ({ n, g: g.id })));
  const idx = Object.fromEntries(names.map((s, i) => [s.n, i]));
  const links = SKILLS.links.map(([a, b]) => [idx[a], idx[b]]).filter(([a, b]) => a != null && b != null);
  const adj = names.map(() => new Set());
  links.forEach(([a, b]) => { adj[a].add(b); adj[b].add(a); });
  const gIndex = Object.fromEntries(SKILLS.groups.map((g, i) => [g.id, i]));
  let W = 0, H = 0, nodes = [], hover = -1, woke = [], pointer = null;

  function layout() {
    const r = cv.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    cv.width = W * dpr; cv.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
    const G = SKILLS.groups.length;
    const cols = W < 640 ? 2 : G;
    const rows = Math.ceil(G / cols);
    nodes = names.map((s, i) => {
      const gi = gIndex[s.g];
      const items = SKILLS.groups[gi].items;
      const k = items.indexOf(s.n);
      const col = gi % cols, row = Math.floor(gi / cols);
      const cellW = W / cols, cellH = (H - 40) / rows;
      const cx = cellW * (col + 0.5);
      const top = cellH * row + 34, span = cellH - 50;
      const hy = top + (items.length > 1 ? (k / (items.length - 1)) * span : span / 2);
      const hx = cx + (k % 2 ? 1 : -1) * cellW * 0.16 + Math.sin(k * 2.3 + gi) * cellW * 0.06;
      const old = nodes[i];
      return { ...s, hx, hy, x: old ? old.x : hx, y: old ? old.y : hy, ph: Math.random() * 6 };
    });
    cv._nodes = nodes;
  }
  layout();
  addEventListener('resize', layout);

  cv.addEventListener('pointermove', e => {
    const r = cv.getBoundingClientRect();
    pointer = [e.clientX - r.left, e.clientY - r.top];
    let best = -1, bd = 26;
    nodes.forEach((n, i) => { const d = Math.hypot(n.x - pointer[0], n.y - pointer[1]); if (d < bd) { bd = d; best = i; } });
    if (best !== hover && best >= 0) sound.tick();
    hover = best;
    cv.style.cursor = best >= 0 ? 'pointer' : '';
  });
  cv.addEventListener('pointerleave', () => { pointer = null; hover = -1; });
  cv.addEventListener('click', () => {
    if (hover < 0) return;
    const status = $('#mindStatus');
    if (woke.includes(hover)) return;
    if (woke.length && !woke.some(w => adj[w].has(hover))) {
      woke = [hover];
      status.textContent = `The thought broke. ${nodes[hover].n} is not linked to that chain. Start again from here.`;
      sound.tick();
      return;
    }
    woke.push(hover);
    sound.chime(300 + woke.length * 90);
    if (woke.length >= 3 && !claimed.has('mind')) {
      status.textContent = `${woke.map(i => nodes[i].n).join(' → ')}. A complete thought.`;
      claim('mind', $('.relic-anchor[data-relic="mind"]'));
    } else if (!claimed.has('mind')) {
      status.textContent = `${woke.map(i => nodes[i].n).join(' → ')}. Wake ${3 - woke.length} more, each linked to the chain.`;
    } else status.textContent = `${woke.map(i => nodes[i].n).join(' → ')}`;
  });

  const yellow = '255,204,51';
  function draw(t) {
    if (!cv.isConnected) return;
    const r = cv.getBoundingClientRect();
    if (r.bottom > 0 && r.top < innerHeight) {
      x.clearRect(0, 0, W, H);
      const accent = realityOn ? '255,45,60' : yellow;
      nodes.forEach(n => {
        let tx = n.hx + Math.sin(t / 1400 + n.ph) * 5, ty = n.hy + Math.cos(t / 1700 + n.ph) * 5;
        if (pointer) { // telekinesis: nodes lean toward the pointer
          const dx = pointer[0] - tx, dy = pointer[1] - ty, d = Math.hypot(dx, dy);
          if (d < 160) { tx += dx * (1 - d / 160) * 0.25; ty += dy * (1 - d / 160) * 0.25; }
        }
        n.x = lerp(n.x, tx, 0.08); n.y = lerp(n.y, ty, 0.08);
      });
      links.forEach(([a, b]) => {
        const A = nodes[a], B = nodes[b];
        const lit = (woke.includes(a) && woke.includes(b));
        const near = hover === a || hover === b;
        x.strokeStyle = lit ? `rgba(${accent},.95)` : near ? `rgba(${accent},.55)` : 'rgba(255,255,255,.09)';
        x.lineWidth = lit ? 2 : 1;
        x.beginPath(); x.moveTo(A.x, A.y); x.lineTo(B.x, B.y); x.stroke();
        if (lit || near) { // a pulse travelling along the synapse
          const k = (t / 900 + a * 0.13) % 1;
          x.fillStyle = `rgba(${accent},.9)`;
          x.beginPath(); x.arc(lerp(A.x, B.x, k), lerp(A.y, B.y, k), 2, 0, 7); x.fill();
        }
      });
      x.font = '500 12px "JetBrains Mono", monospace';
      x.textAlign = 'center';
      nodes.forEach((n, i) => {
        const on = woke.includes(i), h = hover === i;
        const R = on ? 6 : h ? 5 : 3;
        const g = x.createRadialGradient(n.x, n.y, 0, n.x, n.y, R * 5);
        g.addColorStop(0, `rgba(${accent},${on ? .55 : h ? .35 : .12})`); g.addColorStop(1, `rgba(${accent},0)`);
        x.fillStyle = g; x.beginPath(); x.arc(n.x, n.y, R * 5, 0, 7); x.fill();
        x.fillStyle = on || h ? `rgb(${accent})` : 'rgba(230,235,255,.85)';
        x.beginPath(); x.arc(n.x, n.y, R, 0, 7); x.fill();
        x.fillStyle = on || h ? '#fff' : 'rgba(210,215,235,.62)';
        x.fillText(n.n, n.x, n.y - 12);
      });
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}

/* ============================== TIME: the dial ============================== */

function timeDial() {
  const dial = $('#dial'), rotG = $('#dialRot'), read = $('#chronoRead'), year = $('#dialYear');
  let angle = 0, total = 0, last = null, idx = -1;
  const N = TIMELINE.length;

  function show(i) {
    if (i === idx) return;
    idx = i;
    const t = TIMELINE[i];
    read.innerHTML = `<p class="mono">${String(i + 1).padStart(2, '0')} / ${String(N).padStart(2, '0')} · ${esc(t.when)}</p><h4>${esc(t.title)}</h4><p>${esc(t.text)}</p>`;
    read.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'ease-out' });
    year.textContent = ROMAN[i + 1] || String(i + 1);
    dial.setAttribute('aria-valuenow', i + 1);
    dial.setAttribute('aria-valuetext', t.title);
    sound.tick();
  }
  function setAngle(a, delta) {
    angle = a;
    total += delta;
    if (!claimed.has('time') && !cineRunning) { setCharge(Math.min(1, Math.abs(total) / 360)); setIris(Math.min(0.08, Math.abs(total) / 360 * 0.08)); }
    dial.style.setProperty('--conjure', Math.min(1, Math.abs(delta) / 4));
    if (Math.abs(delta) > 0.6 && Math.random() < 0.7) {
      const r = dial.getBoundingClientRect(), th = Math.random() * Math.PI * 2, rad = r.width * (0.35 + Math.random() * 0.2);
      sparks(r.left + r.width / 2 + Math.cos(th) * rad, r.top + r.height / 2 + Math.sin(th) * rad, '#5dffa8', 6);
    }
    rotG.style.transform = `rotate(${angle}deg)`;
    const i = ((Math.round(angle / (360 / N)) % N) + N) % N;
    show(i);
    fx.rewindTarget = Math.min(1, Math.abs(delta) / 6);
    clearTimeout(setAngle._t);
    setAngle._t = setTimeout(() => fx.rewindTarget = 0, 160);
    if (Math.abs(total) >= 360 && !claimed.has('time') && !cineRunning) {
      $('#dialHelp').textContent = 'It is waking.';
      last = null; dial.classList.remove('turning');
      shockwave(dial, '#1fe07a');
      setTimeout(() => timeCinematic(), 350);
    }
  }
  const center = () => { const r = dial.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
  dial.addEventListener('pointerdown', e => {
    dial.setPointerCapture(e.pointerId);
    const [cx, cy] = center();
    last = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI;
    dial.classList.add('turning');
  });
  dial.addEventListener('pointermove', e => {
    if (last == null) return;
    const [cx, cy] = center();
    const a = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI;
    let d = a - last; if (d > 180) d -= 360; if (d < -180) d += 360;
    last = a;
    setAngle(angle + d, d);
  });
  const end = () => {
    last = null; dial.classList.remove('turning'); dial.style.setProperty('--conjure', 0);
    const snapTo = Math.round(angle / (360 / N)) * (360 / N);
    const from = angle;
    tween(300, k => { angle = lerp(from, snapTo, k); rotG.style.transform = `rotate(${angle}deg)`; });
  };
  dial.addEventListener('pointerup', end);
  dial.addEventListener('pointercancel', end);
  dial.addEventListener('keydown', e => {
    const step = 360 / N;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); tweenDial(step); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); tweenDial(-step); }
  });
  function tweenDial(d) {
    const from = angle; let prev = 0;
    tween(320, k => { const v = d * k; setAngle(from + v, v - prev); prev = v; });
  }
  show(0);
}

let dialRel = null;
function dialRelVisible() {
  const c = dialRel.canvas.getBoundingClientRect();
  return c.bottom > 0 && c.top < innerHeight;
}
function setIris(k) {
  irisOpen = k;
  $$('.iris .blade').forEach(b => b.style.setProperty('--o', k));
  if (dialRel) dialRel.state.open = k;
  const d = $('#dial'); if (d) d.classList.toggle('open', k >= 1);
}
function setCharge(k) { if (dialRel) dialRel.state.charge = k; }

/* ============================== TIME: the reliquary cinematic ============================== */

let cineRunning = false;
const CINE_STEP = +(new URLSearchParams(location.search).get('cinestep') || 0); // test hook: fixed seconds per frame
async function timeCinematic({ replay = false } = {}) {
  if (cineRunning) return;
  cineRunning = true;
  const dial = $('#dial');
  const st = stoneById('time');

  // 1 · camera pushes in on the reliquary
  const dr = dial.getBoundingClientRect(), mr = mainEl.getBoundingClientRect();
  cam.origin = `${dr.left + dr.width / 2 - mr.left}px ${dr.top + dr.height / 2 - mr.top}px`;
  document.body.classList.add('letterboxed', 'cine-on');
  sound.swell();
  tween(1300, k => { cam.zoom = 1 + k * 1.8; });

  // 2 · the cinematic stage
  const el = document.createElement('div');
  el.className = 'cine';
  el.innerHTML = `
    <canvas class="cine-stone"></canvas><canvas class="cine-rel"></canvas>
    <div class="cine-cap"><p class="cine-k">V · The Time Stone</p><p class="cine-l">${esc(st.lore)}</p></div>
    <button class="cine-skip mono">Skip ›</button>`;
  document.body.appendChild(el);
  let stone = null, rel = null;
  try {
    stone = new Engine(el.querySelector('.cine-stone'), { background: false, scale: touch ? 0.6 : 0.8 });
    rel = new Reliquary(el.querySelector('.cine-rel'), { atmos: true });
  } catch (e) {
    console.warn('cinematic unavailable', e);
  }
  const size = () => {
    if (stone) stone.resize(innerWidth, innerHeight);
    if (rel) rel.resize(touch ? 0.5 : 0.62);
  };
  size(); addEventListener('resize', size);
  if (stone) { stone.setStone('time', st.rgb); Object.assign(stone.state, { vis: 0, quality: 1, time: 1.5 }); }
  requestAnimationFrame(() => el.classList.add('in'));

  const T = reduced ? 3.2 : 7.2;
  const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const seg = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));
  let skip = false;
  const onSkip = () => { skip = true; };
  el.querySelector('.cine-skip').addEventListener('click', onSkip);
  addEventListener('keydown', function esc_(e) { if (e.key === 'Escape') { onSkip(); removeEventListener('keydown', esc_); } });

  const t0 = performance.now();
  let lastClick = -1, chimed = false, burst = false;
  await new Promise(done => {
    const step = () => {
      let t = CINE_STEP ? (step.n = (step.n || 0) + 1) * CINE_STEP : (performance.now() - t0) / 1000 * (7.2 / T);
      window.__cineT = t;
      if (skip && t < 6.2) t = 6.2;
      const charge = ease(seg(t, 0.4, 2.0));
      const open = ease(seg(t, 2.1, 4.4));
      const flare = seg(t, 4.2, 4.6) * (1 - seg(t, 4.6, 6.0) * 0.6) * (1 - seg(t, 6.4, 7.2));
      const fadeOut = seg(t, 6.3, 7.2);
      const R = 0.27 + 0.07 * ease(seg(t, 0, 6.3));                    // slow dolly in
      if (rel) {
        Object.assign(rel.state, { time: t + 10, open, charge, flare: flare * 1.2, r: (touch ? 1.25 : 1) * R, rot: -0.25 + t * 0.05, cx: 0.5, cy: 0.5 });
        rel.render();
      }
      if (stone) {
        const minD = Math.min(innerWidth, innerHeight);
        Object.assign(stone.state, { time: 1.5 + t * 0.6, obj: [innerWidth / 2, innerHeight / 2, minD * (touch ? 1.25 : 1) * R * 1.3], vis: Math.min(1, open * 1.6), surge: flare * 1.1 });
        stone.render();
      }
      // mechanism: one click per blade as the iris opens
      const ci = Math.floor(open * 9);
      if (ci !== lastClick && open > 0 && open < 1) { lastClick = ci; sound.click(); }
      if (charge > 0 && t < 2.1 && Math.random() < 0.15) sound.tick();
      if (!burst && t >= 4.2) { burst = true; addTrauma(0.55); sound.surge(0.5); }
      if (!chimed && t >= 4.5) { chimed = true; sound.chime(392); el.classList.add('cap'); }
      el.style.opacity = String(1 - fadeOut);
      if (t >= 6.3 && cam.zoom > 1 && !step.zoomOut) { step.zoomOut = true; const z = cam.zoom; tween(900, k => cam.zoom = z + (1 - z) * k); }
      if (t >= 7.2) return done();
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });

  removeEventListener('resize', size);
  if (stone) stone.gl.getExtension('WEBGL_lose_context')?.loseContext();
  if (rel) rel.destroy();
  el.remove();
  cam.zoom = 1;
  document.body.classList.remove('letterboxed', 'cine-on');
  setIris(1); setCharge(1);
  $('#replayTime').hidden = false;
  cineRunning = false;
  if (!replay && !claimed.has('time')) {
    $('#dialHelp').textContent = 'The reliquary is open. The Time Stone is yours.';
    claim('time', $('.relic-anchor[data-relic="time"]'));
  }
}

/* ============================== REALITY ============================== */

function setReality(on) {
  realityOn = on;
  document.body.classList.toggle('reality', on);
  $('#realityBtn').setAttribute('aria-pressed', String(on));
  document.documentElement.style.setProperty('--accent', on ? '#ff2d3c' : (currentStone ? stoneById(currentStone).hex : '#3d8bff'));
  $$('[data-alt]').forEach(el => {
    if (!el.dataset.orig) el.dataset.orig = el.textContent;
    scramble(el, on ? el.dataset.alt : el.dataset.orig);
  });
  sound.tint(on ? 0.6 : 0);
  sound.impact();
  if (on && !claimed.has('reality')) setTimeout(() => toast('Reality has shifted. Something has appeared in <a href="#reality">Creations</a>.'), 700);
}

/* ============================== SNAP ============================== */

let snapping = false;
async function doSnap() {
  if (claimed.size < 6 || snapping) return;
  snapping = true;
  if (snapped) { snapping = false; return; }
  sound.snap();
  document.body.classList.add('snap-flash');
  setTimeout(() => document.body.classList.remove('snap-flash'), 900);
  const pool = $$('main .dust').filter(el => el.offsetParent !== null);
  // exactly half, chosen at random
  for (let i = pool.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [pool[i], pool[j]] = [pool[j], pool[i]]; }
  const gone = pool.slice(0, Math.floor(pool.length / 2));
  gone.forEach(el => el.classList.add('ashed'));
  tween(2400, k => fx.snap = k * 0.999);
  await new Promise(r => setTimeout(r, 900));
  await Promise.all(gone.map((el, i) => disintegrate(el, { delay: Math.random() * 1600, duration: 2400 })));
  snapped = true;
  snapping = false;
  $('#aftermath').classList.add('show');
}

async function undoSnap() {
  $('#aftermath').classList.remove('show');
  sound.rewind();
  fx.rewindTarget = 1;
  const gone = $$('.ashed');
  tween(1800, k => fx.snap = 1 - k);
  await Promise.all(gone.map(el => disintegrate(el, { delay: Math.random() * 600, duration: 1800, reverse: true })));
  gone.forEach(el => el.classList.remove('ashed'));
  fx.rewindTarget = 0;
  snapped = false;
  toast('Restored. Everyone came back.');
}

/* ============================== MISC ============================== */

function cursor() {
  if (touch) return;
  const c = $('.cursor');
  let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
  addEventListener('pointermove', e => {
    x = e.clientX; y = e.clientY;
    mouse = [x / innerWidth, 1 - y / innerHeight];
    const t = e.target.closest('a, button, .relic-anchor, #mindCanvas, .dial, .socket');
    c.classList.toggle('hot', !!t);
  });
  (function step() { cx = lerp(cx, x, 0.22); cy = lerp(cy, y, 0.22); c.style.transform = `translate(${cx}px, ${cy}px)`; requestAnimationFrame(step); })();
}

function skipHunt() {
  const order = STONES.map(s => s.id).filter(id => !claimed.has(id));
  if (!order.length) { toast('You already hold all six.'); return; }
  order.forEach((id, i) => setTimeout(() => {
    claim(id, $('#skipBtn'));
    if (id === 'space' && relic.current === 'cube') applyRelic('cube');
    if (id === 'time') { setIris(1); setCharge(1); $('#replayTime').hidden = false; }
  }, i * 750));
}

function enter(withSound) {
  if (withSound) { sound.init(); sound.set(true); }
  $('#soundBtn').setAttribute('aria-pressed', String(withSound));
  document.body.classList.remove('booting', 'letterboxed');
  $('#intro').classList.add('gone');
  setTimeout(() => $('#intro').remove(), 1600);
  if (!claimed.size) setTimeout(() => toast('Six stones are hidden here. The first is inside the cube. <b>Strike it.</b>', 6000), 1800);
}

/* ============================== BOOT ============================== */

build();
refreshSockets();
if (conduit) { conduit.resize(); STONES.forEach((st, i) => { if (claimed.has(st.id)) { conduit.set(i, true); conduit.own[i] = 1; } }); if (claimed.size === 6) conduit.ready = 1; addEventListener('resize', () => conduit.resize()); }
try {
  dialRel = new Reliquary($('#dialRel'), { atmos: false });
  dialRel.resize(Math.min(devicePixelRatio || 1, 2));
  Object.assign(dialRel.state, { r: 0.5 / 1.05, rot: 0.3 });
  document.body.classList.add('rel-on');
  addEventListener('resize', () => dialRel.resize());
} catch (e) { console.warn('reliquary fallback', e); }
setIris(claimed.has('time') ? 1 : 0);
setCharge(claimed.has('time') ? 1 : 0);
if (claimed.has('time')) $('#replayTime').hidden = false;
$('#replayTime').addEventListener('click', () => timeCinematic({ replay: true }));
resize();
watchChapters();
reveal();
bindRelics();
mindConstellation();
timeDial();
cursor();
requestAnimationFrame(frame);

if (claimed.has('space')) $('.hero-relic .relic-hint').textContent = 'The Space Stone. It was inside all along.';

$$('[data-enter]').forEach(b => b.addEventListener('click', () => enter(b.dataset.enter === 'sound')));
$('#realityBtn').addEventListener('click', () => setReality(!realityOn));
$('#soundBtn').addEventListener('click', () => { const on = !sound.enabled; sound.init(); sound.set(on); $('#soundBtn').setAttribute('aria-pressed', String(on)); });
$('#snapBtn').addEventListener('click', doSnap);
$('#rewindBtn').addEventListener('click', undoSnap);
$('#skipBtn').addEventListener('click', skipHunt);
$('#copyMail').addEventListener('click', async e => {
  try { await navigator.clipboard.writeText(PROFILE.email); e.target.textContent = 'Copied'; } catch { e.target.textContent = PROFILE.email; }
  setTimeout(() => e.target.textContent = 'Copy email', 2200);
});
document.addEventListener('click', e => {
  const act = e.target.closest('[data-act]');
  if (act && act.dataset.act === 'reality') setReality(true);
});
$$('a, button, .socket').forEach(el => el.addEventListener('pointerenter', () => sound.tick()));
addEventListener('keydown', e => {
  if (e.target.closest('input, textarea')) return;
  if (e.key === 'r' || e.key === 'R') setReality(!realityOn);
  if (e.key === 'm' || e.key === 'M') $('#soundBtn').click();
});

// the intro can be skipped if the visitor has been here before
const loadBar = $('.intro-load span');
if (loadBar) requestAnimationFrame(() => loadBar.style.width = '100%');
if (new URLSearchParams(location.search).has('nointro')) enter(false);
