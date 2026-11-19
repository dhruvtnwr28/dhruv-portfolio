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
  // cheap environment for reflections: a projection of the sky + soft studio lights
  vec3 c = sky(d.xy / (1.2 + abs(d.z)) * 1.6, uTime) * 1.6;
  c += vec3(1.) * pow(max(dot(d, normalize(vec3(.6,.8,.4))),0.), 40.) * .7;
  c += uGem * pow(max(dot(d, normalize(vec3(-.7,.2,.5))),0.), 6.) * .4;
  return c;
}

/* ---------- relics ---------- */
float sdRoundBox(vec3 p, vec3 b, float r){ vec3 q = abs(p)-b+r; return length(max(q,0.)) + min(max(q.x,max(q.y,q.z)),0.) - r; }

// Faceted stone: an n-fold brilliant-ish cut built from folded half-spaces.
float sdStone(vec3 p){
  float el = uShape.w;
  p.y /= el;
  float ang = atan(p.z, p.x);
  float rad = length(p.xz);
  float N = 8.;
  float seg = TAU/N;
  float a1 = mod(ang + seg*.5, seg) - seg*.5;
  float a2 = mod(ang, seg) - seg*.5;
  float q1 = rad*cos(a1);
  float q2 = rad*cos(a2);

  float d = p.y - uShape.x;                                   // table
  float c = uShape.y;
  d = max(d, dot(vec2(q1, p.y), vec2(sin(c), cos(c))) - .62);  // main crown facets
  d = max(d, dot(vec2(q2, p.y), vec2(sin(c*1.25), cos(c*1.25))) - .66); // star facets
  d = max(d, q1*.98 + abs(p.y)*.05 - .84);                      // girdle
  float pv = uShape.z;
  d = max(d, dot(vec2(q1, p.y), vec2(sin(pv), -cos(pv))) - .5); // pavilion mains
  d = max(d, dot(vec2(q2, p.y), vec2(sin(pv*1.12), -cos(pv*1.12))) - .53);
  return d * min(el, 1.);
}

mat3 relicRot(){
  float t = uTime;
  float ay = t*.25 + uRot.x;
  float ax = .3*sin(t*.31) + uRot.y + (uType > .5 ? .12 : .55);
  float az = uType > .5 ? .12*sin(t*.2) : .2;
  mat3 Ry = mat3(cos(ay),0.,sin(ay), 0.,1.,0., -sin(ay),0.,cos(ay));
  mat3 Rx = mat3(1.,0.,0., 0.,cos(ax),-sin(ax), 0.,sin(ax),cos(ax));
  mat3 Rz = mat3(cos(az),-sin(az),0., sin(az),cos(az),0., 0.,0.,1.);
  return Rz*Rx*Ry;
}

float map(vec3 p){
  if (uType < .5) return sdRoundBox(p, vec3(.56), .035);
  return sdStone(p);
}
vec3 nrm(vec3 p){
  vec2 e = vec2(.0015, 0.);
  return normalize(vec3(map(p+e.xyy)-map(p-e.xyy), map(p+e.yxy)-map(p-e.yxy), map(p+e.yyx)-map(p-e.yyx)));
}

// plasma inside the cube
float plasma(vec3 p, float t){
  vec3 q = p*2.4;
  q.xy *= rot(t*.3 + p.z*1.5);
  q.yz *= rot(t*.2);
  float f = fbm3(q + vec3(0., 0., t*.7));
  float ridge = 1. - abs(2.*fbm3(q*1.7 - vec3(t*.4, 0., 0.)) - 1.);
  float core = exp(-length(p)*3.4);
  return f*f*1.2 + pow(ridge, 6.)*1.6 + core*2.2;
}

vec4 relic(vec2 fc){
  vec2 p = (fc - uObj.xy) / uObj.z;
  float L = length(p);
  if (L > 2.2 || uVis < .005) return vec4(0.);

  mat3 R = relicRot();
  // rotate the rays instead of the relic (row-vector multiply = inverse rotation)
  vec3 ro = vec3(0.,0.,3.4) * R;
  vec3 rd = normalize(vec3(p, -1.55)) * R;

  float t = 0., minD = 9.;
  bool hit = false;
  vec3 pos;
  for (int i = 0; i < 90; i++){
    pos = ro + rd*t;
    float d = map(pos);
    // snap: dissolve the relic into ash
    if (uSnap > .001){
      float ash = n3(pos*7. + uTime*.2);
      if (ash < uSnap*1.15 - .1) d = max(d, .02);
    }
    minD = min(minD, d);
    if (d < .0008){ hit = true; break; }
    t += d*.9;
    if (t > 6.) break;
  }

  vec3 glowCol = uType < .5 ? vec3(.25, .65, 1.) : uGem;
  float halo = exp(-minD*7.) * .55 + exp(-L*2.4)*.18;
  vec3 col = glowCol * halo;
  float alpha = clamp(halo*1.1, 0., 1.);

  if (hit){
    vec3 n = nrm(pos);
    vec3 v = -rd;
    float fres = .04 + .96*pow(1. - max(dot(n, v), 0.), 5.);
    vec3 refl = env(reflect(rd, n));

    // interior
    vec3 rdi = refract(rd, n, 1./1.45);
    if (dot(rdi,rdi) < .5) rdi = reflect(rd, n);
    vec3 acc = vec3(0.);
    float tr = 1.;
    vec3 ip = pos - n*.003;
    vec3 exitN = n;
    float steps = uQuality > .5 ? 34. : 22.;
    float st = 1.25/steps;
    for (int i = 0; i < 34; i++){
      if (float(i) >= steps) break;
      ip += rdi*st;
      float dd = map(ip);
      if (dd > 0.){ exitN = nrm(ip); break; }
      if (uType < .5){
        float dens = plasma(ip, uTime);
        vec3 c = mix(vec3(.02,.16,.9), vec3(.55,.9,1.), clamp(dens-1.1,0.,1.));
        acc += c * dens * st * 1.5 * tr;
        tr *= exp(-dens*st*.7);
      } else {
        float dens = .25 + pow(fbm3(ip*3.5 + vec3(0., uTime*.25, 0.)), 2.)*1.6;
        float core = exp(-length(ip*vec3(1.,1./uShape.w,1.))*3.);
        vec3 c = uGem*uGem * dens*.7 + mix(uGem, vec3(1.), .12) * core*1.8;
        acc += c * st * 2.2 * tr;
        tr *= exp(-dens*st*1.4);
      }
    }

    if (uType < .5){
      // glass cube: bright tessellated edges + inner plasma
      vec3 ap = abs(pos)/.56;
      float mx = max(ap.x, max(ap.y, ap.z));
      float mid = ap.x + ap.y + ap.z - mx - min(ap.x, min(ap.y, ap.z));
      float edge = smoothstep(.86, .99, mid);
      // inner frame (tesseract's nested cube) seen through glass
      vec3 inner = abs(pos + rdi*.25)/.3;
      float im = max(inner.x, max(inner.y, inner.z));
      float innerEdge = smoothstep(.12, .0, abs(im - 1.)) * .35;
      col = acc*1.15 + refl*fres*1.3 + vec3(.55,.85,1.)*edge*1.6 + vec3(.3,.7,1.)*innerEdge;
      col += vec3(.2,.5,1.) * (1.-tr) * .25;
      // fracture lines
      if (uCrack > .001){
        vec2 cp = (abs(n.x) > .5 ? pos.yz : abs(n.y) > .5 ? pos.xz : pos.xy) * 6.;
        float cr = abs(fbm2(cp*1.3) - .5);
        col += vec3(.7,.95,1.) * smoothstep(.025, .0, cr) * uCrack * 3.;
      }
    } else {
      // stone: facet fire from the exit facet + sharp sparkles
      float facet = h31(floor(exitN*5.3 + 11.));
      float fire = pow(abs(dot(rdi, exitN)), 3.);
      vec3 body = acc * (.5 + facet*1.2) + uGem * fire * .6 * facet + uGem*uGem*.04;
      vec3 L1 = normalize(vec3(.6,.8,.5)), L2 = normalize(vec3(-.8,.3,.6)), L3 = normalize(vec3(.1,-.6,.9));
      vec3 rr = reflect(rd, n);
      float spark = pow(max(dot(rr, L1),0.), 90.)*2.5 + pow(max(dot(rr, L2),0.), 120.)*1.8 + pow(max(dot(rr, L3),0.), 60.);
      float facetFlash = pow(h31(floor(n*7.1)+floor(uTime*.6)), 18.) * .9;
      col = body + refl*mix(vec3(1.), uGem, .45)*fres*.8 + vec3(1.)*spark + mix(uGem, vec3(1.), .5)*facetFlash*.6;
      // subtle chromatic dispersion around edges
      col += vec3(.15,.0,.25) * pow(fres, .6) * .3;
    }

    // ember rim when dissolving
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
  vec2 uv = (fc - .5*uRes) / uRes.y;
  vec3 col = vec3(0.);
  float alpha = uBg;
  if (uBg > .5){
    col = sky(uv * 1.15, uTime);
    float vig = smoothstep(1.35, .2, length(uv*vec2(.9,1.1)));
    col *= .35 + .65*vig;
  }
  vec4 r = relic(fc);
  if (uBg > .5) col = mix(col, r.rgb, step(.999, r.a)) + (r.a < .999 ? r.rgb : vec3(0.));
  else { alpha = r.a; col = r.rgb / max(r.a, .001); }

  // filmic tonemap + grain
  col = col / (1. + col*.85);
  col = pow(col, vec3(.92));
  col += (h21(fc + fract(uTime)*91.) - .5) * .025 * uBg;
  gl_FragColor = vec4(col, alpha);
}
`;

export const STONE_SHAPES = {
  // table height, crown angle, pavilion angle, vertical stretch
  space:   [0.30, 0.78, 0.82, 1.00],
  mind:    [0.26, 0.62, 0.70, 1.55],
  reality: [0.34, 0.86, 0.90, 0.85],
  power:   [0.30, 0.72, 0.80, 1.10],
  time:    [0.36, 0.95, 0.95, 0.75],
  soul:    [0.30, 0.80, 0.86, 1.00],
};

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
    ['uRes','uTime','uMouse','uCol','uObj','uType','uShape','uGem','uRot','uVis','uReality','uRewind','uSnap','uPower','uCrack','uBg','uQuality']
      .forEach(n => this.u[n] = gl.getUniformLocation(prog, n));

    this.state = {
      time: 0, mouse: [0.5, 0.5], col: [0.2, 0.45, 1.0], obj: [0, 0, 100], type: 0,
      shape: STONE_SHAPES.space, gem: [0.2, 0.5, 1.0], rot: [0, 0], vis: 1,
      reality: 0, rewind: 0, snap: 0, power: 0, crack: 0, quality: 1,
    };
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
    const gl = this.gl, u = this.u, s = this.state, c = this.canvas;
    gl.uniform2f(u.uRes, c.width, c.height);
    gl.uniform1f(u.uTime, s.time);
    gl.uniform2f(u.uMouse, s.mouse[0], s.mouse[1]);
    gl.uniform3fv(u.uCol, s.col);
    gl.uniform3f(u.uObj, s.obj[0] * this.scale, s.obj[1] * this.scale, s.obj[2] * this.scale);
    gl.uniform1f(u.uType, s.type);
    gl.uniform4fv(u.uShape, s.shape);
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
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}
