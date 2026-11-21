/* ==========================================================================
   COSMIC ENGINE — a single WebGL pass that renders:
   · a living, domain-warped nebula with parallax stars
   · one raymarched relic (the cube, or one of six faceted stones) that is
     pinned to a DOM anchor so it scrolls with the page
   · global "stone effects": reality warp, time rewind, snap dissolve, power surge
   No libraries. Everything is procedural.
   ========================================================================== */

const VERT = `
attribute vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;      // 0..1
uniform vec3  uCol;        // active stone colour (background tint)
uniform vec3  uObj;        // relic centre (px, GL coords) + radius (px)
uniform float uType;       // 0 = cube, 1 = stone
uniform vec4  uShape;      // stone cut parameters
uniform vec3  uGem;        // stone colour
uniform vec2  uRot;        // user drag rotation
uniform float uVis;        // relic visibility 0..1
uniform float uReality;    // 0..1
uniform float uRewind;     // 0..1
uniform float uSnap;       // 0..1 relic dissolve
uniform float uPower;      // 0..1
uniform float uCrack;      // 0..1 (cube fracture glow)
uniform float uBg;         // 1 = draw sky, 0 = transparent (asset renders)
uniform float uQuality;    // 0..1
uniform float uSurge;      // 0..1 power surge
uniform vec3  uSurgeCol;
uniform float uWave;       // shockwave progress
uniform vec2  uWaveC;      // shockwave origin (px)

#define PI 3.14159265
#define TAU 6.2831853

/* ---------- noise ---------- */
float h11(float p){ p = fract(p*.1031); p *= p+33.33; p *= p+p; return fract(p); }
float h21(vec2 p){ vec3 p3 = fract(vec3(p.xyx)*.1031); p3 += dot(p3, p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
float h31(vec3 p){ p = fract(p*.1031); p += dot(p, p.zyx+31.32); return fract((p.x+p.y)*p.z); }
vec2  h22(vec2 p){ vec3 p3 = fract(vec3(p.xyx)*vec3(.1031,.1030,.0973)); p3 += dot(p3, p3.yzx+33.33); return fract((p3.xx+p3.yz)*p3.zy); }

float n2(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(h21(i), h21(i+vec2(1,0)), f.x), mix(h21(i+vec2(0,1)), h21(i+vec2(1,1)), f.x), f.y);
}
float n3(vec3 p){
  vec3 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(mix(h31(i),h31(i+vec3(1,0,0)),f.x), mix(h31(i+vec3(0,1,0)),h31(i+vec3(1,1,0)),f.x), f.y),
             mix(mix(h31(i+vec3(0,0,1)),h31(i+vec3(1,0,1)),f.x), mix(h31(i+vec3(0,1,1)),h31(i+vec3(1,1,1)),f.x), f.y), f.z);
}
float fbm2(vec2 p){ float a=.5, s=0.; mat2 m = mat2(1.6,1.2,-1.2,1.6); for(int i=0;i<5;i++){ s += a*n2(p); p = m*p; a *= .5; } return s; }
float fbm3(vec3 p){ float a=.5, s=0.; for(int i=0;i<4;i++){ s += a*n3(p); p = p*2.03 + vec3(1.7,9.2,3.1); a *= .5; } return s; }

mat2 rot(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }

/* ---------- sky ---------- */
float stars(vec2 uv, float scale, float t){
  vec2 g = uv*scale; vec2 id = floor(g); vec2 f = fract(g)-.5;
  vec2 o = h22(id)-.5; float r = h21(id+7.1);
  float d = length(f - o*.7);
  float tw = .6 + .4*sin(t*(1.+r*3.) + r*40.);
  return smoothstep(.05*(.4+r), 0., d) * step(.82, r) * tw;
}

vec3 sky(vec2 uv, float t){
  // reality bends the fabric
  float R = uReality;
  uv += R * .12 * vec2(sin(uv.y*3.5 + t*1.3), cos(uv.x*2.8 - t*1.1));
  uv = rot(R*.25*sin(t*.3)) * uv;

  // time stone: spiral pull toward centre
  float W = uRewind;
  float rr = length(uv);
  uv = rot(W * 1.8 / (rr + .35)) * uv;

  float tt = t * .035;
  vec2 q = vec2(fbm2(uv*1.4 + vec2(tt, -tt)), fbm2(uv*1.4 + vec2(5.2, 1.3) - tt));
  vec2 r = vec2(fbm2(uv*1.2 + 3.*q + vec2(1.7, 9.2) + tt*1.5), fbm2(uv*1.2 + 3.*q + vec2(8.3, 2.8) - tt));
  float neb = fbm2(uv*1.1 + 2.6*r);

  vec3 deep = vec3(.006, .007, .018);
  vec3 tint = uCol;
  vec3 col = deep;
  col += mix(vec3(.05,.02,.12), tint*.55, clamp(q.x*1.2,0.,1.)) * smoothstep(.25, .95, neb) * .9;
  col += tint * pow(neb, 5.) * 2.2;
  col += vec3(.35,.12,.55) * pow(r.y, 6.) * .5;
  // dark dust lanes
  col *= .55 + .45*smoothstep(.15, .65, fbm2(uv*2.3 - r*1.3 + 11.));

  // reality: liquid aether — crimson ink with black veins
  if (R > .001){
    float a = fbm2(uv*2.2 + vec2(t*.12, -t*.08) + 4.*r);
    float veins = smoothstep(.02, .0, abs(fract(a*6.) - .5) - .45);
    vec3 aether = vec3(.55, .02, .04) * smoothstep(.3, .9, a) + vec3(1., .25, .1) * pow(a, 6.) * 2.;
    aether = mix(aether, vec3(0.), veins*.6);
    col = mix(col, aether, R*.85);
  }

  // time: concentric emerald glyph rings
  if (W > .001){
    float ang = atan(uv.y, uv.x);
    float ring = abs(fract(rr*5. - t*.6) - .5);
    float ticks = step(.5, fract(ang*24./TAU + t*.2*sign(sin(rr*10.))));
    col += vec3(.1, 1., .45) * smoothstep(.04, .0, ring - .02) * (.4 + .6*ticks) * W * .6 * exp(-rr*.8);
    col = mix(col, col*vec3(.5,1.2,.8), W*.5);
  }

  // stars (3 parallax layers, they drift with the mouse)
  vec2 m = (uMouse - .5) * .04;
  float s = stars(uv + m*.3, 70., t) + stars(uv + m*.6 + 3.1, 38., t)*1.2 + stars(uv + m + 7.7, 18., t)*1.5;
  col += vec3(.85, .9, 1.) * s * (1. - R*.6);

  // power: violet arcs
  if (uPower > .001){
    float arc = abs(fbm2(uv*3. + t*2.) - .5);
    col += vec3(.7, .25, 1.) * smoothstep(.03, .0, arc) * uPower * 1.5;
    col += vec3(.35, .1, .6) * uPower * .25;
  }
  return col;
}

vec3 env(vec3 d){
  // studio-in-space environment: dark void, a cool key softbox, a warm rim, faint nebula tint
  float up = d.y*.5 + .5;
  vec3 c = mix(vec3(.004,.005,.012), uCol*.10 + vec3(.01,.012,.03), up);
  c += uCol * .25 * pow(n2(d.xy*2.3 + d.z) , 3.);
  c += vec3(1.,.97,.92) * smoothstep(.965, .995, dot(d, normalize(vec3(.55,.75,.38)))) * 1.8;   // key softbox
  c += vec3(.75,.85,1.) * smoothstep(.96, .995, dot(d, normalize(vec3(-.8,.35,.45)))) * 1.3;  // fill strip
  c += vec3(1.,.8,.6)  * pow(max(dot(d, normalize(vec3(.1,-.4,-1.))),0.), 8.) * .5;          // warm back rim
  return c;
}

/* ---------- relics ---------- */
float sdRoundBox(vec3 p, vec3 b, float r){ vec3 q = abs(p)-b+r; return length(max(q,0.)) + min(max(q.x,max(q.y,q.z)),0.) - r; }

// Raw crystal: convex hull of 16 seeded planes, then chipped with fine noise.
uniform vec4 uPl[24];
float sdCrystal(vec3 p){
  vec3 q = p / vec3(uShape.x, uShape.w, uShape.y);
  float s = min(uShape.x, min(uShape.y, uShape.w));
  float d = length(q) - .86;
  for (int i = 0; i < 24; i++) d = max(d, dot(q, uPl[i].xyz) - uPl[i].w);
  d *= s;
  d += (n3(p*9. + uShape.z*7.) - .5) * .006;
  return d;
}

mat3 relicRot(){
  float t = uTime;
  float ay = t*.22 + uRot.x;
  float ax = .25*sin(t*.31) + uRot.y + (uType > .5 ? .1 : .55);
  float az = uType > .5 ? .15*sin(t*.2) : .2;
  mat3 Ry = mat3(cos(ay),0.,sin(ay), 0.,1.,0., -sin(ay),0.,cos(ay));
  mat3 Rx = mat3(1.,0.,0., 0.,cos(ax),-sin(ax), 0.,sin(ax),cos(ax));
  mat3 Rz = mat3(cos(az),-sin(az),0., sin(az),cos(az),0., 0.,0.,1.);
  return Rz*Rx*Ry;
}

float map(vec3 p){
  if (uType < .5) return sdRoundBox(p, vec3(.56), .03);
  return sdCrystal(p);
}
vec3 nrm(vec3 p){
  vec2 e = vec2(.0012, 0.);
  return normalize(vec3(map(p+e.xyy)-map(p-e.xyy), map(p+e.yxy)-map(p-e.yxy), map(p+e.yyx)-map(p-e.yyx)));
}

// energy inside the cube: dense blue fire with bright filaments
float plasma(vec3 p, float t){
  vec3 q = p*2.4;
  q.xy *= rot(t*.3 + p.z*1.5);
  q.yz *= rot(t*.2);
  float f = fbm3(q + vec3(0., 0., t*.7));
  float ridge = 1. - abs(2.*fbm3(q*1.7 - vec3(t*.4, 0., 0.)) - 1.);
  float core = exp(-length(p)*3.4);
  return f*f*.8 + pow(ridge, 8.)*2.2 + core*2.4;
}

vec4 relic(vec2 fc){
  vec2 p = (fc - uObj.xy) / uObj.z;
  float L = length(p);
  if (L > 2.4 || uVis < .005) return vec4(0.);

  mat3 R = relicRot();
  // rotate the rays instead of the relic (row-vector multiply = inverse rotation)
  vec3 ro = vec3(0.,0.,3.4) * R;
  vec3 rd = normalize(vec3(p, -1.55)) * R;

  float t = 0., minD = 9.;
  bool hit = false;
  vec3 pos;
  for (int i = 0; i < 96; i++){
    pos = ro + rd*t;
    float d = map(pos);
    if (uSnap > .001){
      float ash = n3(pos*7. + uTime*.2);
      if (ash < uSnap*1.15 - .1) d = max(d, .02);
    }
    minD = min(minD, d);
    if (d < .0007){ hit = true; break; }
    t += d*.85;
    if (t > 6.) break;
  }

  vec3 glowCol = uType < .5 ? vec3(.25, .6, 1.) : uGem;
  float halo = exp(-minD*10.) * .28 + exp(-L*2.4)*.14;
  halo *= 1. + uSurge*2.5;
  vec3 col = glowCol * halo;
  float alpha = clamp(halo*1.1, 0., 1.);

  if (hit){
    vec3 n = nrm(pos);
    vec3 v = -rd;
    float ndv = max(dot(n, v), 0.);
    float fres = .045 + .955*pow(1. - ndv, 5.);

    if (uType < .5){
      /* ---- the cube: glass shell, nested frame, plasma core ---- */
      vec3 refl = env(reflect(rd, n));
      vec3 rdi = refract(rd, n, 1./1.48);
      vec3 acc = vec3(0.); float tr = 1.;
      vec3 ip = pos - n*.003;
      float steps = uQuality > .5 ? 36. : 22.;
      float st = 1.3/steps;
      for (int i = 0; i < 36; i++){
        if (float(i) >= steps) break;
        ip += rdi*st;
        if (map(ip) > 0.) break;
        float dens = plasma(ip, uTime);
        vec3 c = mix(vec3(.01,.12,.85), vec3(.45,.85,1.), clamp(dens-1.4,0.,1.));
        acc += c * dens * st * 1.35 * tr;
        tr *= exp(-dens*st*.55);
      }
      vec3 ap = abs(pos)/.56;
      float mx = max(ap.x, max(ap.y, ap.z));
      float mid = ap.x + ap.y + ap.z - mx - min(ap.x, min(ap.y, ap.z));
      float edge = smoothstep(.9, .995, mid);
      vec3 inner = abs(pos + rdi*.25)/.3;
      float im = max(inner.x, max(inner.y, inner.z));
      float innerEdge = smoothstep(.1, .0, abs(im - 1.)) * .3;
      col = acc + refl*fres*1.4 + vec3(.6,.88,1.)*edge*1.2 + vec3(.3,.7,1.)*innerEdge + env(rdi)*tr*.4;
      if (uCrack > .001){
        vec2 cp = (abs(n.x) > .5 ? pos.yz : abs(n.y) > .5 ? pos.xz : pos.xy) * 6.;
        float cr = abs(fbm2(cp*1.3) - .5);
        col += vec3(.7,.95,1.) * smoothstep(.025, .0, cr) * uCrack * 3.;
      }
    } else {
      /* ---- raw crystal: refraction, absorption, inner fire, fractures, dispersion ---- */
      // frosted / polished patches
      // which natural face did we hit? each face catches the light differently
      vec3 qq = pos / vec3(uShape.x, uShape.w, uShape.y);
      float best = -9., second = -9.; float fid = 0.;
      for (int i = 0; i < 24; i++){
        float dd = dot(qq, uPl[i].xyz) - uPl[i].w;
        if (dd > best){ second = best; best = dd; fid = float(i); } else if (dd > second) second = dd;
      }
      float ridge = 1. - smoothstep(.0, .018, best - second);
      float faceRand = h11(fid*7.31 + uShape.z);
      float frost = 0.;
      vec3 nr = n;
      vec3 refl = env(reflect(rd, nr)) * (.55 + faceRand*.9) * (1. - frost*.6);

      vec3 rdi = refract(rd, nr, 1./1.56);
      vec3 ip = pos - n*.002;
      vec3 acc = vec3(0.);
      float path = 0.;
      float dither = h21(p*731. + fract(uTime));
      vec3 exitN = n;
      float steps = uQuality > .5 ? 30. : 18.;
      float st = 1.4/steps;
      vec3 fr1 = normalize(vec3(.6, .5, -.3) + uShape.z), fr2 = normalize(vec3(-.3, .8, .5) - uShape.z*.5);
      for (int i = 0; i < 30; i++){
        if (float(i) >= steps) break;
        ip += rdi*st*(i == 0 ? dither : 1.);
        float dd = map(ip);
        if (dd > 0.){ exitN = nrm(ip); break; }
        path += st;
        float rr = length(ip / vec3(uShape.x, uShape.w, uShape.y));
        float core = exp(-rr*rr*9.);
        float cloud = pow(fbm3(ip*2.6 + vec3(0., uTime*.18, 0.)), 4.) * 2.;
        cloud += pow(1. - abs(2.*fbm3(ip*4.5 - vec3(uTime*.1, 0., 0.)) - 1.), 12.) * 2.5;
        // planar fractures catch the light
        float f1 = smoothstep(.05, .0, abs(dot(ip, fr1) - .08)) * smoothstep(.45, .6, n3(ip*4.));
        float f2 = smoothstep(.05, .0, abs(dot(ip, fr2) + .12)) * smoothstep(.5, .65, n3(ip*5.+4.));
        acc += (uGem*uGem * (core*3.4 + cloud*.7) + mix(uGem, vec3(1.), .3) * core*core*2.2 + mix(uGem, vec3(1.), .6) * (f1 + f2) * .9) * st;
      }
      // exit: refract out (or totally reflect, which gives the deep flashes)
      vec3 absorb = exp(-(1. - uGem) * path * 4.6) * (.75 + .5*faceRand);
      vec3 rdo = refract(rdi, -exitN, 1.56);
      vec3 trans;
      if (dot(rdo, rdo) < .5){
        vec3 ri = reflect(rdi, -exitN);
        trans = env(ri) * .6 + uGem * .35;
      } else {
        // dispersion: three slightly different exit angles
        vec3 rdR = refract(rdi, -exitN, 1.53), rdB = refract(rdi, -exitN, 1.60);
        if (dot(rdR,rdR) < .5) rdR = rdo; if (dot(rdB,rdB) < .5) rdB = rdo;
        trans = vec3(env(rdR).r, env(rdo).g, env(rdB).b);
      }
      vec3 body = trans * uGem * absorb * .8 + acc * mix(vec3(1.), absorb, .35);
      // specular glints from the softboxes
      vec3 rr = reflect(rd, n);
      float spec = pow(max(dot(rr, normalize(vec3(.55,.75,.38))),0.), 90.) * 5. + pow(max(dot(rr, normalize(vec3(-.8,.35,.45))),0.), 160.) * 3.
                 + pow(max(dot(rr, normalize(vec3(.2,-.3,.95))),0.), 60.) * 1.2;
      // bright crisp edges where faces meet
      float edgeL = 1. - smoothstep(.0, .012, abs(best - (-0.0)) );
      vec3 Lk = normalize(vec3(.55,.75,.38));
      float sheen = pow(max(dot(rr, Lk), 0.), 10.) * faceRand * faceRand;
      float edgeVar = smoothstep(.35, .75, n3(pos*3.5 + uShape.z));
      col = body + refl * (fres * 1.2 + .03) + vec3(1.) * spec + mix(uGem, vec3(1.), .3) * sheen * .7
          + mix(uGem, vec3(1.), .5) * ridge * edgeVar * (.06 + .8*pow(max(dot(n, Lk), 0.), 3.));
      col += uGem * fres * .25;  // the stone's own light leaking at grazing angles
      col *= 1. + uSurge * 1.8;
    }

    if (uSnap > .001){
      float ash = n3(pos*7. + uTime*.2);
      float rim = smoothstep(.08, .0, abs(ash - (uSnap*1.15 - .1)));
      col += vec3(1., .55, .2) * rim * 2.;
    }
    alpha = 1.;
  }
  return vec4(col * uVis, alpha * uVis);
}

/* ---------- compose ---------- */
void main(){
  vec2 fc = gl_FragCoord.xy;

  // surge shockwave: a ring that bends space as it travels
  vec2 sfc = fc;
  if (uWave > .001 && uWave < .999){
    vec2 dv = fc - uWaveC;
    float dist = length(dv);
    float radius = uWave * length(uRes) * 1.1;
    float ring = exp(-pow((dist - radius) / (uRes.y*.05), 2.));
    sfc -= normalize(dv + .001) * ring * uRes.y * .035 * (1. - uWave);
  }
  vec2 uv = (sfc - .5*uRes) / uRes.y;

  vec3 col = vec3(0.);
  float alpha = uBg;
  if (uBg > .5){
    col = sky(uv * 1.15, uTime);
    // the light of a surge floods the void
    col += uSurgeCol * uSurge * (.25 + .6*fbm2(uv*3. + uTime));
    float vig = smoothstep(1.35, .2, length(uv*vec2(.9,1.1)));
    col *= .3 + .7*vig;
    if (uWave > .001 && uWave < .999){
      float dist = length(fc - uWaveC), radius = uWave * length(uRes) * 1.1;
      col += uSurgeCol * exp(-pow((dist - radius) / (uRes.y*.012), 2.)) * (1. - uWave) * 1.5;
    }
  }
  vec4 r = relic(fc);
  if (uBg > .5){
    col = mix(col, r.rgb, step(.999, r.a)) + (r.a < .999 ? r.rgb : vec3(0.));
    // anamorphic lens streak + soft bloom around the relic
    if (uVis > .01){
      vec2 d = fc - uObj.xy;
      vec3 gc = uType < .5 ? vec3(.3, .6, 1.) : uGem;
      float streak = exp(-abs(d.y) / (uObj.z*.035)) * exp(-abs(d.x) / (uObj.z*2.6));
      float bloom = exp(-length(d) / (uObj.z*.9));
      col += gc * (streak*.28 + bloom*.12) * uVis * (1. + uSurge*3.);
      // a faint ghost on the far side of the frame
      vec2 g = .5*uRes - d*.6;
      col += gc * exp(-length(fc - (.5*uRes + (.5*uRes - uObj.xy)*.7)) / (uObj.z*.25)) * .05 * uVis;
    }
  } else { alpha = r.a; col = r.rgb / max(r.a, .001); }

  // filmic tonemap, slight warm/cool grade, grain
  col = col / (1. + col*.8);
  col = pow(col, vec3(.93, .95, .98));
  col += (h21(fc + fract(uTime)*91.) - .5) * .03 * uBg;
  gl_FragColor = vec4(col, alpha);
}
`;

/* Raw-crystal proportions: [width, depth, seed, height]. */
export const STONE_SHAPES = {
  space:   [0.92, 0.86, 1.7, 1.02],
  mind:    [0.84, 0.80, 4.3, 1.18],
  reality: [0.96, 0.84, 2.9, 1.06],
  power:   [1.00, 0.88, 6.1, 0.92],
  time:    [0.94, 0.90, 3.6, 0.98],
  soul:    [0.88, 0.84, 5.2, 1.12],
};

/** Sixteen cutting planes for a raw crystal, spread over the sphere and jittered by a seed. */
export function crystalPlanes(seed, n = 24) {
  let a = Math.sin(seed * 91.7) * 43758.5453;
  const rnd = () => { a = Math.sin(a * 12.9898 + 78.233) * 43758.5453; return a - Math.floor(a); };
  const out = new Float32Array(n * 4);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i + 0.5) / n * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i + rnd() * 0.9;
    let v = [Math.cos(th) * r + (rnd() - .5) * .35, y + (rnd() - .5) * .35, Math.sin(th) * r + (rnd() - .5) * .35];
    const L = Math.hypot(...v); v = v.map(x => x / L);
    out.set([v[0], v[1], v[2], 0.54 + rnd() * 0.2], i * 4);
  }
  return out;
}
const PLANES = {};
export function planesFor(id) { return PLANES[id] || (PLANES[id] = crystalPlanes((STONE_SHAPES[id] || STONE_SHAPES.space)[2])); }

export class Engine {
  constructor(canvas, opts = {}) {
    this.canvas = canvas;
    this.bg = opts.background !== false;
    this.scale = opts.scale || 1;
    const gl = canvas.getContext('webgl', { alpha: !this.bg, premultipliedAlpha: false, antialias: false, preserveDrawingBuffer: !!opts.preserve, powerPreference: 'high-performance' });
    if (!gl) throw new Error('WebGL unavailable');
    this.gl = gl;
    const prog = this._program(VERT, FRAG);
    this.prog = prog;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    this.u = {};
    ['uRes','uTime','uMouse','uCol','uObj','uType','uShape','uGem','uRot','uVis','uReality','uRewind','uSnap','uPower','uCrack','uBg','uQuality','uSurge','uSurgeCol','uWave','uWaveC','uPl']
      .forEach(n => this.u[n] = gl.getUniformLocation(prog, n));

    this.state = {
      time: 0, mouse: [0.5, 0.5], col: [0.2, 0.45, 1.0], obj: [0, 0, 100], type: 0,
      shape: STONE_SHAPES.space, planes: planesFor('space'), gem: [0.2, 0.5, 1.0], rot: [0, 0], vis: 1,
      reality: 0, rewind: 0, snap: 0, power: 0, crack: 0, quality: 1,
      surge: 0, surgeCol: [1, 1, 1], wave: 0, waveC: [0, 0],
    };
  }

  setStone(id, rgb) {
    this.state.type = 1;
    this.state.shape = STONE_SHAPES[id];
    this.state.planes = planesFor(id);
    this.state.gem = rgb;
  }

  _program(vs, fs) {
    const gl = this.gl;
    const mk = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    };
    const p = gl.createProgram();
    gl.attachShader(p, mk(gl.VERTEX_SHADER, vs));
    gl.attachShader(p, mk(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    return p;
  }

  resize(w, h) {
    const c = this.canvas;
    const W = Math.max(1, Math.round(w * this.scale)), H = Math.max(1, Math.round(h * this.scale));
    if (c.width !== W || c.height !== H) { c.width = W; c.height = H; }
    this.gl.viewport(0, 0, W, H);
  }

  render() {
    const gl = this.gl, u = this.u, s = this.state, c = this.canvas, k = this.scale;
    gl.uniform2f(u.uRes, c.width, c.height);
    gl.uniform1f(u.uTime, s.time);
    gl.uniform2f(u.uMouse, s.mouse[0], s.mouse[1]);
    gl.uniform3fv(u.uCol, s.col);
    gl.uniform3f(u.uObj, s.obj[0] * k, s.obj[1] * k, s.obj[2] * k);
    gl.uniform1f(u.uType, s.type);
    gl.uniform4fv(u.uShape, s.shape);
    gl.uniform4fv(u.uPl, s.planes);
    gl.uniform3fv(u.uGem, s.gem);
    gl.uniform2f(u.uRot, s.rot[0], s.rot[1]);
    gl.uniform1f(u.uVis, s.vis);
    gl.uniform1f(u.uReality, s.reality);
    gl.uniform1f(u.uRewind, s.rewind);
    gl.uniform1f(u.uSnap, s.snap);
    gl.uniform1f(u.uPower, s.power);
    gl.uniform1f(u.uCrack, s.crack);
    gl.uniform1f(u.uBg, this.bg ? 1 : 0);
    gl.uniform1f(u.uQuality, s.quality);
    gl.uniform1f(u.uSurge, s.surge);
    gl.uniform3fv(u.uSurgeCol, s.surgeCol);
    gl.uniform1f(u.uWave, s.wave);
    gl.uniform2f(u.uWaveC, s.waveC[0] * k, s.waveC[1] * k);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}
