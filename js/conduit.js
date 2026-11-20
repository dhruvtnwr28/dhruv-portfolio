/* ==========================================================================
   THE CONDUIT — a forged metal medallion with six settings.
   Rendered live: every claimed stone is seated in its socket in real time.
   ========================================================================== */

const VERT = `attribute vec2 aPos; void main(){ gl_Position = vec4(aPos, 0., 1.); }`;

const FRAG = `
precision highp float;
uniform vec2  uRes;
uniform float uTime;
uniform vec2  uTilt;
uniform float uOwn[6];
uniform vec3  uCols[6];
uniform float uFlash;
uniform vec3  uFlashCol;
uniform float uReady;
#define PI 3.14159265

float h11(float p){ p = fract(p*.1031); p *= p+33.33; p *= p+p; return fract(p); }
float h31(vec3 p){ p = fract(p*.1031); p += dot(p, p.zyx+31.32); return fract((p.x+p.y)*p.z); }
float n3(vec3 p){
  vec3 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(mix(h31(i),h31(i+vec3(1,0,0)),f.x), mix(h31(i+vec3(0,1,0)),h31(i+vec3(1,1,0)),f.x), f.y),
             mix(mix(h31(i+vec3(0,0,1)),h31(i+vec3(1,0,1)),f.x), mix(h31(i+vec3(0,1,1)),h31(i+vec3(1,1,1)),f.x), f.y), f.z);
}
float fbm(vec3 p){ float s=0., a=.5; for(int i=0;i<4;i++){ s+=a*n3(p); p*=2.07; a*=.5; } return s; }

vec2 sockC(int i){ float a = radians(float(i)*60. - 90.); return vec2(cos(a), -sin(a)) * .718; }

float sdTorus(vec3 p, float R, float r){ return length(vec2(length(p.xy) - R, p.z)) - r; }

float crystal(vec3 p, float seed){
  float d = length(p) - .86;
  for (int i = 0; i < 10; i++){
    float fi = float(i);
    float y = 1. - (fi + .5) / 10. * 2.;
    float r = sqrt(1. - y*y);
    float th = 2.39996 * fi + h11(fi*3.7 + seed) * .9;
    vec3 n = normalize(vec3(cos(th)*r, y, sin(th)*r) + (vec3(h11(fi+seed*1.3), h11(fi*1.7+seed), h11(fi*2.3+seed*.7)) - .5) * .4);
    d = max(d, dot(p, n) - (.55 + .2*h11(fi*5.1 + seed*2.)));
  }
  return d;
}

// returns (distance, material): 0 metal, 1..6 stones
vec2 map(vec3 p){
  float rr = length(p.xy);
  // body: a thick disc with a rounded edge
  vec2 q = vec2(rr - .80, p.z);
  float body = length(max(abs(q) - vec2(.0, .07), 0.)) - .06;
  body = min(body, max(rr - .86, abs(p.z) - .09));
  // raised outer rim and inner boss
  float d = min(body, sdTorus(p - vec3(0,0,.09), .875, .045));
  d = min(d, sdTorus(p - vec3(0,0,.09), .40, .03));
  // engraved grooves
  float g1 = length(vec2(rr - .79, p.z - .13)) - .011;
  float g2 = length(vec2(rr - .52, p.z - .13)) - .008;
  d = max(d, -min(g1, g2));
  vec2 res = vec2(d, 0.);
  for (int i = 0; i < 6; i++){
    vec2 c = sockC(i);
    vec3 lp = p - vec3(c, .09);
    // bezel + cup
    float bez = sdTorus(lp, .16, .03);
    float cup = length(lp - vec3(0,0,.05)) - .145;
    res.x = min(max(res.x, -cup), bez);
    // the stone, if it has been claimed
    float o = uOwn[i];
    if (o > .01){
      float s = .16 * o;
      vec3 sp = lp - vec3(0., 0., .06 + (1. - o) * .25);
      float a = uTime*.15 + float(i);
      sp.xy = mat2(cos(a), -sin(a), sin(a), cos(a)) * sp.xy;
      float cd = crystal(sp / s, float(i)*1.91 + 1.) * s;
      if (cd < res.x) res = vec2(cd, float(i) + 1.);
    }
  }
  return res;
}

vec3 nrm(vec3 p){
  vec2 e = vec2(.0015, 0.);
  return normalize(vec3(map(p+e.xyy).x - map(p-e.xyy).x, map(p+e.yxy).x - map(p-e.yxy).x, map(p+e.yyx).x - map(p-e.yyx).x));
}

vec3 envMetal(vec3 r){
  float up = r.y*.5 + .5;
  vec3 c = mix(vec3(.03,.025,.03), vec3(.35,.3,.28), smoothstep(.2, 1., up));
  c += vec3(1.,.92,.8) * smoothstep(.9, .99, dot(r, normalize(vec3(-.5,.6,.62)))) * 3.;
  c += vec3(.5,.6,.8) * smoothstep(.95, .995, dot(r, normalize(vec3(.8,-.2,.55)))) * 1.2;
  return c;
}

void main(){
  vec2 p = (gl_FragCoord.xy - .5*uRes) / (.5*uRes.y);
  float tx = uTilt.x, ty = uTilt.y;
  mat3 R = mat3(cos(tx),0.,sin(tx), 0.,1.,0., -sin(tx),0.,cos(tx)) * mat3(1.,0.,0., 0.,cos(ty),-sin(ty), 0.,sin(ty),cos(ty));
  vec3 ro = R * vec3(p, 2.);
  vec3 rd = R * vec3(0., 0., -1.);

  float t = 0.; vec2 h = vec2(9., -1.);
  bool hit = false;
  for (int i = 0; i < 70; i++){
    h = map(ro + rd*t);
    if (h.x < .0006){ hit = true; break; }
    t += h.x*.9;
    if (t > 4.) break;
  }

  // light spilling from seated stones
  vec3 spill = vec3(0.);
  for (int i = 0; i < 6; i++) spill += uCols[i] * uOwn[i] * exp(-length(p - sockC(i)) * 5.5);

  vec3 col = vec3(0.); float alpha = 0.;
  if (hit){
    vec3 pos = ro + rd*t;
    vec3 n = nrm(pos);
    vec3 v = -rd;
    vec3 L = normalize(vec3(-.5, .6, .62));
    if (h.y < .5){
      // forged dark bronze: hammered, worn bright on the high edges, etched with fine rings
      float ham = fbm(pos*14.);
      n = normalize(n + (vec3(fbm(pos*22.), fbm(pos*22.+5.), 0.) - .5) * .18);
      float rr = length(pos.xy), ang = atan(pos.y, pos.x);
      float etch = smoothstep(.6, .9, sin(rr*160.)) * step(.55, rr) * step(rr, .76) * step(.06, pos.z) * .5;
      etch += smoothstep(.7, .95, sin(ang*48.)) * step(.82, rr) * step(rr, .9) * step(.06, pos.z) * .4;
      vec3 alb = mix(vec3(.30,.22,.13), vec3(.62,.48,.30), ham);
      alb *= 1. - etch*.6;
      float wear = smoothstep(.85, 1., n.z) * step(.11, pos.z);  // polished tops
      alb = mix(alb, vec3(.85,.7,.48), wear*.5);
      float rough = mix(.55, .2, wear);
      vec3 rf = reflect(rd, n);
      float fres = .5 + .5*pow(1. - max(dot(n, v), 0.), 5.);
      vec3 spec = envMetal(rf) * alb * fres * (1.4 - rough);
      float diff = max(dot(n, L), 0.);
      float sp = pow(max(dot(reflect(-L, n), v), 0.), mix(12., 70., 1.-rough)) * 1.2;
      // ambient occlusion
      float ao = 1.;
      for (int k = 1; k <= 4; k++){ float hh = float(k)*.03; ao -= (hh - map(pos + n*hh).x) * 2.2 / float(k); }
      ao = clamp(ao, .2, 1.);
      col = (alb*diff*.6 + spec + alb*sp) * ao + alb*.04 + spill * alb * 2.2 * ao;
      col += uFlashCol * uFlash * .6 * alb;
    } else {
      int id = int(h.y + .5) - 1;
      vec3 gc = vec3(1.);
      for (int i = 0; i < 6; i++) if (i == id) gc = uCols[i];
      float fres = .04 + .96*pow(1. - max(dot(n, v), 0.), 5.);
      vec3 rf = reflect(rd, n);
      float face = h31(floor(n*4.) + float(id));
      float glow = 1.2 + .5*sin(uTime*2. + float(id)) + uFlash*2.5 + uReady*.8;
      col = gc*gc*(.25 + face*.9) * glow + gc * .35 + envMetal(rf)*fres*.8
          + vec3(1.) * pow(max(dot(rf, L), 0.), 60.) * 2.;
    }
    alpha = 1.;
  }
  // halo
  vec3 halo = spill * (.6 + uFlash*2. + uReady*.6);
  float ha = clamp(length(halo)*.5, 0., 1.) * (1. - alpha);
  col = col + halo * (1. - alpha);
  alpha = max(alpha, ha);
  col = col / (1. + col*.6);
  gl_FragColor = vec4(col, alpha);
}
`;

export class Conduit {
  constructor(canvas, colors) {
    this.canvas = canvas;
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false });
    if (!gl) throw new Error('no webgl');
    this.gl = gl;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
    const p = gl.createProgram();
    gl.attachShader(p, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    gl.useProgram(p);
    const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(p, 'aPos'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    this.u = {};
    ['uRes','uTime','uTilt','uOwn','uCols','uFlash','uFlashCol','uReady'].forEach(n => this.u[n] = gl.getUniformLocation(p, n));
    gl.uniform3fv(this.u.uCols, new Float32Array(colors.flat()));
    this.own = new Float32Array(6);
    this.target = new Float32Array(6);
    this.flash = 0; this.flashCol = [1, 1, 1]; this.ready = 0; this.tilt = [0, 0]; this.tiltT = [0, 0];
    this.time = 0; this._acc = 0;
  }
  resize() {
    const r = this.canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(r.width * dpr); this.canvas.height = Math.round(r.height * dpr);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }
  set(i, on) { this.target[i] = on ? 1 : 0; }
  step(dt) {
    this.time += dt;
    for (let i = 0; i < 6; i++) {
      const d = this.target[i] - this.own[i];
      this.own[i] = Math.abs(d) < 0.002 ? this.target[i] : this.own[i] + d * Math.min(1, dt * 3.2);
    }
    this.flash = Math.max(0, this.flash - dt * 1.4);
    this.tilt[0] += (this.tiltT[0] - this.tilt[0]) * Math.min(1, dt * 4);
    this.tilt[1] += (this.tiltT[1] - this.tilt[1]) * Math.min(1, dt * 4);
    // ~30 fps is plenty for a small, slow object
    this._acc += dt;
    if (this._acc < 1 / 30) return;
    this._acc = 0;
    const gl = this.gl, u = this.u;
    gl.uniform2f(u.uRes, this.canvas.width, this.canvas.height);
    gl.uniform1f(u.uTime, this.time);
    gl.uniform2f(u.uTilt, this.tilt[0], this.tilt[1]);
    gl.uniform1fv(u.uOwn, this.own);
    gl.uniform1f(u.uFlash, this.flash);
    gl.uniform3fv(u.uFlashCol, this.flashCol);
    gl.uniform1f(u.uReady, this.ready);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}
