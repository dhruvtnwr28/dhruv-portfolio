/* ==========================================================================
   THE RELIQUARY — a brass housing with a nine-blade iris that guards the
   Time Stone. Rendered as a lit height field (brushed brass, engraved glyph
   channel, rivets, overlapping spiral blades) with optional haze, light
   shafts and an anamorphic flare for the cinematic.
   The aperture is transparent: the stone itself is drawn by the canvas below.
   ========================================================================== */

const VERT = `attribute vec2 aPos; void main(){ gl_Position = vec4(aPos, 0., 1.); }`;

const FRAG = `
precision highp float;
uniform vec2  uRes;
uniform vec2  uC;        // housing centre (px)
uniform float uR;        // housing radius (px)
uniform float uTime;
uniform float uOpen;     // iris 0..1
uniform float uCharge;   // glyph ignition 0..1
uniform float uFlare;    // flare / burst 0..1+
uniform float uAtmos;    // 1 = haze, shafts, sigils; 0 = object only (transparent around it)
uniform float uRot;
#define PI 3.14159265
#define TAU 6.2831853

float h11(float p){ p = fract(p*.1031); p *= p+33.33; p *= p+p; return fract(p); }
float h21(vec2 p){ vec3 p3 = fract(vec3(p.xyx)*.1031); p3 += dot(p3, p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(h21(i), h21(i+vec2(1,0)), f.x), mix(h21(i+vec2(0,1)), h21(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float s=0., a=.5; mat2 m = mat2(1.6,1.2,-1.2,1.6); for(int i=0;i<5;i++){ s += a*n2(p); p = m*p; a *= .5; } return s; }
mat2 rot(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }

const vec3 G = vec3(.16, 1., .52);

// engraved rune in a cell (u along the ring, v across it), returns 0..1 coverage
float rune(float id, vec2 uv){
  float h = h11(id*7.13 + 3.);
  float h2 = h11(id*3.71 + 9.);
  float w = .07;
  float d = 1.;
  d = min(d, abs(uv.x - .5) + step(.85, abs(uv.y - .5)*2.) );                       // stem
  if (h > .3) d = min(d, abs((uv.y - .5) - (uv.x - .5) * (h2 > .5 ? 1.2 : -1.2)) + step(.36, abs(uv.x-.5))); // slash
  if (h2 > .55) d = min(d, abs(length(uv - vec2(.5, .3 + .4*h)) - .16));              // ring
  if (h < .25) d = min(d, abs(uv.y - .2 - .6*h2) + step(.32, abs(uv.x-.5)));          // bar
  return smoothstep(w, w*.4, d);
}

// height of the brass housing (annulus .60 .. 1.04)
float housingH(vec2 p, out float glyph, out float gid){
  float r = length(p), a = atan(p.y, p.x);
  float h = smoothstep(1.045, 1.0, r) * smoothstep(.585, .63, r) * .42;
  h += exp(-pow((r - .972)/.026, 2.)) * .30;      // rolled outer rim
  h += exp(-pow((r - .642)/.022, 2.)) * .26;      // inner lip
  // recessed glyph channel
  float ch = smoothstep(.785, .792, r) * smoothstep(.912, .905, r);
  h -= ch * .14;
  float seg = (a + PI) / TAU * 30.;
  gid = floor(seg);
  vec2 uv = vec2(fract(seg), (r - .79) / .12);
  glyph = rune(gid, uv) * ch;
  h += glyph * .1;
  // decorative grooves and fluting
  h -= exp(-pow((r - .728)/.0045, 2.)) * .05;
  h -= exp(-pow((r - .935)/.0045, 2.)) * .05;
  float flute = step(.665, r) * step(r, .715);
  h += flute * (.5 + .5*cos(a * 72.)) * .02;
  // rivets
  float ra = (a + PI) / TAU * 12.;
  vec2 rv = vec2((fract(ra) - .5) * TAU * .955 / 12., r - .955);
  h += smoothstep(.022, .0, length(rv)) * .06 * smoothstep(.0, .022, .022 - length(rv)) * 4.;
  return h;
}

// iris: returns blade height, or -1 inside the aperture
float irisH(vec2 p, out float id, out float u){
  float r = length(p);
  float ap = uOpen * .615;
  id = 0.; u = 0.;
  if (r < ap) return -1.;
  float N = 9.;
  float a = atan(p.y, p.x);
  float ph = (a + 2.6*(r - ap) + uOpen*1.4) / TAU * N;
  id = floor(ph); u = fract(ph);
  // each blade is slightly domed and rises toward its overlapping edge
  float h = .16 + u * .05 - pow(abs(u - .55), 2.) * .06;
  h -= smoothstep(.06, .0, u) * .04;                 // tucked under the neighbour
  h += smoothstep(.93, .995, u) * smoothstep(1., .995, u) * .02; // bevelled lip
  return h;
}

vec3 envBrass(vec3 r){
  float up = r.y*.5 + .5;
  vec3 c = mix(vec3(.02,.025,.03), vec3(.25,.22,.2), smoothstep(.1, 1., up));
  c += vec3(1., .93, .8) * smoothstep(.9, .99, dot(r, normalize(vec3(-.55, .62, .56)))) * 3.;
  c += vec3(.5, .65, .9) * smoothstep(.94, .995, dot(r, normalize(vec3(.75, -.25, .6)))) * 1.;
  return c;
}

vec3 shadeBrass(vec2 p, vec3 n, vec3 albedo, float rough, float occl){
  vec3 v = vec3(0., 0., 1.);
  vec3 L = normalize(vec3(-.55, .62, .56));
  float diff = max(dot(n, L), 0.);
  vec3 rf = reflect(-v, n);
  float fres = .55 + .45*pow(1. - max(dot(n, v), 0.), 5.);
  vec3 spec = envBrass(rf) * albedo * fres * (1.2 - rough);
  float sp = pow(max(dot(reflect(-L, n), v), 0.), mix(10., 80., 1. - rough));
  // the stone's light, spilling out of the aperture
  vec3 Lg = normalize(vec3(-p, .32));
  float r = length(p);
  float gI = (uOpen*1.3 + uCharge*.25 + uFlare*.8) / (1. + r*r*5.);
  vec3 green = G * max(dot(n, Lg), 0.) * gI;
  return (albedo*diff*.55 + spec + albedo*sp*1.1) * occl + albedo*.03 + green * mix(albedo, vec3(1.), .25) * 1.15;
}

void main(){
  vec2 fc = gl_FragCoord.xy;
  vec2 p = rot(uRot) * ((fc - uC) / uR);
  float r = length(p);
  float a = atan(p.y, p.x);
  vec3 col = vec3(0.);
  float alpha = 0.;
  float glow = uOpen + uFlare;

  /* ---------- atmosphere behind/around the object ---------- */
  vec3 atm = vec3(0.);
  if (uAtmos > .5){
    vec2 sp = (fc - uC) / uR;
    float haze = fbm(sp*1.3 + vec2(uTime*.04, -uTime*.025));
    float haze2 = fbm(sp*3.1 - vec2(uTime*.06, uTime*.02) + haze*1.5);
    float dens = smoothstep(.25, .95, haze*.65 + haze2*.5);
    float rr = length(sp);
    vec3 lit = G * (glow*.9 + uCharge*.12) / (1. + rr*rr*.9);
    atm += lit * dens * .45;
    atm += vec3(.02, .05, .045) * dens;                                 // ambient teal haze
    // light shafts through the haze
    if (glow > .01 && rr > uOpen*.55){
      float sh = pow(fbm(vec2(atan(sp.y, sp.x) * 5.5, uTime*.15)), 3.) * 2.2;
      sh += pow(n2(vec2(atan(sp.y, sp.x) * 21., uTime*.4)), 6.) * 1.5;
      atm += G * sh * glow * (.4 + dens) * .55 / (.25 + rr*1.4);
    }
    // conjured rings around the housing
    float ring1 = smoothstep(.006, .0, abs(rr - 1.22)) * step(.5, fract((atan(sp.y,sp.x)/TAU)*48. + uTime*.15));
    float ring2 = smoothstep(.004, .0, abs(rr - 1.34)) * step(.25, fract((atan(sp.y,sp.x)/TAU)*12. - uTime*.08));
    float ticks = smoothstep(.004, .0, abs(fract((atan(sp.y,sp.x)/TAU)*72. - uTime*.05) - .5) - .45) * step(1.255, rr) * step(rr, 1.3);
    atm += G * (ring1*.9 + ring2*.7 + ticks*.6) * uCharge * 1.3;
    // anamorphic flare
    vec2 d = fc - uC;
    float streak = exp(-abs(d.y) / (uR*.018)) * exp(-abs(d.x) / (uR*3.2));
    float core = exp(-length(d) / (uR*.32));
    atm += mix(G, vec3(.75,1.,.9), .35) * (streak*1.1 + core*.6) * glow;
    // ghosts
    for (int i = 1; i <= 3; i++){
      vec2 gp = uC + vec2(float(i)*uR*.55*(i == 2 ? -1. : 1.), 0.);
      atm += G * exp(-length(fc - gp) / (uR*(.05 + .03*float(i)))) * .12 * glow;
    }
    // drifting motes
    vec2 mp = sp*7. + vec2(0., uTime*.25);
    vec2 cell = floor(mp); vec2 f = fract(mp) - .5;
    float hh = h21(cell);
    vec2 o = vec2(h21(cell+3.), h21(cell+9.)) - .5;
    float mote = smoothstep(.06, .0, length(f - o*.7)) * step(.86, hh) * (.5 + .5*sin(uTime*3. + hh*30.));
    atm += G * mote * glow * 1.2 / (1. + rr);
  }

  /* ---------- housing ---------- */
  if (r < 1.05 && r > .58){
    float gl, gid;
    float e = .0025;
    float h = housingH(p, gl, gid);
    float g1, g2;
    float hx = housingH(p + vec2(e, 0.), g1, g2), hy = housingH(p + vec2(0., e), g1, g2);
    vec3 n = normalize(vec3(-(hx - h)/e, -(hy - h)/e, 1.) * vec3(.9, .9, 1.));
    // brushed, hammered brass
    float brush = fbm(vec2(a*60., r*4.));
    float ham = fbm(p*18.);
    vec3 alb = mix(vec3(.46,.32,.13), vec3(.86,.66,.33), brush*.7 + ham*.3);
    alb *= mix(1., .55, smoothstep(.0, -.1, h - .3));                 // grime in recesses
    float wear = smoothstep(.33, .42, h);
    alb = mix(alb, vec3(1., .85, .55), wear*.35);
    float occl = .55 + .45*smoothstep(.15, .4, h);
    col = shadeBrass(p, n, alb, mix(.45, .2, wear), occl);
    // glyphs ignite one after another
    float lit = smoothstep(gid/30. - .02, gid/30. + .02, uCharge);
    col += G * gl * (lit * (1.2 + .4*sin(uTime*6. + gid)) + uOpen*.6) * 1.4;
    alpha = smoothstep(1.045, 1.035, r) * smoothstep(.582, .59, r);
  }

  /* ---------- iris ---------- */
  if (r <= .62){
    float id, u;
    float h = irisH(p, id, u);
    if (h >= 0.){
      float e = .002;
      float i2, u2;
      float hx = irisH(p + vec2(e, 0.), i2, u2), hy = irisH(p + vec2(0., e), i2, u2);
      if (hx < 0.) hx = h; if (hy < 0.) hy = h;
      if (i2 != id) { hx = h; hy = h; }
      vec3 n = normalize(vec3(-(hx - h)/e, -(hy - h)/e, 1.));
      float brush = fbm(vec2(u*40. + id*3., length(p)*90.));
      vec3 alb = mix(vec3(.4,.28,.11), vec3(.8,.62,.3), brush) * (.8 + .4*h11(id*4.1));
      float shadow = smoothstep(.0, .14, u);                            // neighbour casts shadow
      col = shadeBrass(p, n, alb, .32, .45 + .55*shadow);
      // seams leak light before the iris opens
      float seam = smoothstep(.035, .0, u) * (uCharge*.6 + uOpen*.5) * (1. - uOpen*.8);
      col += G * seam * 1.4 * (1. - length(p)*.9);
      // hot rim around the aperture
      float rim = exp(-(length(p) - uOpen*.615) * 40.) * step(.001, uOpen);
      col += G * rim * glow * 1.6;
      alpha = 1.;
    } else {
      // aperture: transparent to the stone below, with a little bloom
      float b = exp(-(uOpen*.615 - r) * 6.) * .35 * glow;
      col = G * b; alpha = clamp(b, 0., .5);
    }
  }

  // composite atmosphere (kept thin over the open aperture so the stone reads clearly)
  if (uAtmos > .5){
    float ap = uOpen*.615;
    vec2 dd = fc - uC;
    float keep = exp(-abs(dd.y) / (uR*.012)) * .3 + exp(-length(dd) / (uR*.1)) * .35;
    atm *= mix(clamp(keep, .08, 1.), 1., smoothstep(ap*.7, ap + .02, r));
    atm *= mix(1., .5, alpha * step(ap + .01, r));   // the brass stays readable through the glare
    col = col * alpha + atm;
    float la = clamp(max(max(atm.r, atm.g), atm.b), 0., 1.);
    alpha = max(alpha, la);
    col = alpha > .001 ? col / alpha : col;
  }
  col = col / (1. + col*.65);
  col += (h21(fc + fract(uTime)*50.) - .5) * .02;
  gl_FragColor = vec4(col, alpha);
}
`;

export class Reliquary {
  constructor(canvas, { atmos = false } = {}) {
    this.canvas = canvas;
    this.atmos = atmos;
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false });
    if (!gl) throw new Error('no webgl');
    this.gl = gl;
    const sh = (t, src) => { const s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
    const p = gl.createProgram();
    gl.attachShader(p, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    gl.useProgram(p);
    const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(p, 'aPos'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    this.u = {};
    ['uRes','uC','uR','uTime','uOpen','uCharge','uFlare','uAtmos','uRot'].forEach(n => this.u[n] = gl.getUniformLocation(p, n));
    this.state = { time: 0, open: 0, charge: 0, flare: 0, rot: 0, cx: 0.5, cy: 0.5, r: 0.4 };
    this.scale = 1;
  }
  resize(scale) {
    this.scale = scale || this.scale;
    const r = this.canvas.getBoundingClientRect();
    this.canvas.width = Math.max(1, Math.round(r.width * this.scale));
    this.canvas.height = Math.max(1, Math.round(r.height * this.scale));
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }
  /** cx, cy in 0..1 of the canvas (y from top); r as a fraction of min(w, h) */
  render() {
    const gl = this.gl, u = this.u, s = this.state, W = this.canvas.width, H = this.canvas.height;
    gl.uniform2f(u.uRes, W, H);
    gl.uniform2f(u.uC, s.cx * W, (1 - s.cy) * H);
    gl.uniform1f(u.uR, s.r * Math.min(W, H));
    gl.uniform1f(u.uTime, s.time);
    gl.uniform1f(u.uOpen, s.open);
    gl.uniform1f(u.uCharge, s.charge);
    gl.uniform1f(u.uFlare, s.flare);
    gl.uniform1f(u.uAtmos, this.atmos ? 1 : 0);
    gl.uniform1f(u.uRot, s.rot);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  destroy() {
    const ext = this.gl.getExtension('WEBGL_lose_context');
    if (ext) ext.loseContext();
  }
}
