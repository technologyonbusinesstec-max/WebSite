/* Fondo interactivo HackaToB: Big Bang → galaxia → Tierra. Requiere three.js r128 y anime.js 3.2.1. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = id => document.getElementById('hk-' + id);
  if (!$('gl') || typeof THREE === 'undefined' || typeof anime === 'undefined') {
    if ($('cool')) $('cool').style.opacity = .6;
    return;
  }

  const FOCUS_PCT = [60, 57]; // punto del brazo de la galaxia al que nos acercamos

  /* =====================================================
     1. ANIME.JS = el director. Línea de tiempo 0–1000.
     ===================================================== */
  const S = { expand: 0, flash: 0, heat: 1, chaos: 0, stars: 0, galaxy: 0, zoom: 0, earth: 0, ezoom: 0, pin: 0, z: 5 };
  const tl = anime.timeline({ autoplay: false, easing: 'linear' });
  const T = (prop, from, to, start, end, easing) =>
    tl.add({ targets: S, [prop]: [from, to], duration: end - start, easing: easing || 'linear' }, start);
  // 7 secciones → cada una queda centrada en k * 1000/6
  T('z', 5, 7.5, 0, 820);
  // 1 · Singularidad: estado inicial (todo en 0), no necesita animación
  T('expand', 0, 1, 15, 380, 'easeOutQuart');                               // 2 · Explosión
  T('flash', 0, 1, 15, 50);  T('flash', 1, 0, 50, 200, 'easeOutQuad');
  T('chaos', 0, 1, 15, 170);
  // 3 · Plasma caliente: se mantienen el caos y el calor de la explosión
  T('heat', 1, 0, 390, 500, 'easeInOutSine');                               // 4 · Enfriamiento
  T('chaos', 1, .1, 400, 540, 'easeOutQuad');
  T('stars', 0, 1, 510, 670);                                               // 5 · Estrellas
  T('galaxy', 0, 1, 700, 830, 'easeInOutSine');                             // 6 · Galaxia
  T('zoom', 0, 1, 868, 935, 'easeInOutQuad');                               //     acercamiento a un brazo
  T('earth', 0, 1, 905, 950, 'easeOutCubic');                               // 7 · Tierra
  T('ezoom', 0, 1, 945, 992, 'easeInOutQuad');
  T('pin', 0, 1, 978, 1000);

  /* =====================================================
     2. THREE.JS = partículas.
     ===================================================== */
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas: $('gl'), alpha: true, antialias: false }); }
  catch (e) { $('cool').style.opacity = .6; return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  const gauss = () => (Math.random() + Math.random() + Math.random() + Math.random() - 2) / 2;

  // de % de pantalla a coordenadas 3D (plano z = 0, cámara en z = 7.5)
  const halfH = 7.5 * Math.tan(Math.PI / 6), aspect = innerWidth / innerHeight, halfW = halfH * aspect;
  const toWorld = (px, py) => [(px / 50 - 1) * halfW, -(py / 50 - 1) * halfH];
  const fit = Math.min(1, aspect / 1.3); // achica la galaxia en pantallas angostas

  const N = innerWidth < 700 ? 9000 : 24000;
  const dir = new Float32Array(N * 3), gal = new Float32Array(N * 3), rnd = new Float32Array(N * 4);
  for (let i = 0; i < N; i++) {
    let x = gauss(), y = gauss(), z = gauss();
    const l = Math.hypot(x, y, z) || 1, sp = (0.12 + Math.pow(Math.random(), 1.5)) * 4.4;
    dir.set([x / l * sp, y / l * sp, z / l * sp], i * 3);
    // destino: una sola galaxia espiral de 3 brazos, centrada
    const r = Math.pow(Math.random(), 0.6) * 3.2 * fit;
    const a = (i % 3) * 2.0944 + (r / fit) * 1.4 + gauss() * 0.55;
    gal.set([Math.cos(a) * r, gauss() * 0.22 * (1 - r / 4), Math.sin(a) * r], i * 3);
    rnd.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(dir, 3));
  geo.setAttribute('aGal', new THREE.BufferAttribute(gal, 3));
  geo.setAttribute('aRnd', new THREE.BufferAttribute(rnd, 4));

  const U = { uExpand: { value: 0 }, uChaos: { value: 0 }, uGalaxy: { value: 0 }, uHeat: { value: 1 },
              uAlpha: { value: 1 }, uTime: { value: 0 }, uScale: { value: 1 } };
  const points = new THREE.Points(geo, new THREE.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
    vertexShader: `
      attribute vec3 aGal; attribute vec4 aRnd;
      uniform float uExpand, uChaos, uGalaxy, uHeat, uTime, uScale;
      varying vec3 vCol; varying float vA;
      mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
      void main() {
        vec3 p = position * uExpand;
        vec3 n = vec3(sin(uTime*.6 + aRnd.z*40. + p.y*1.5),
                      cos(uTime*.5 + aRnd.z*31. + p.z*1.5),
                      sin(uTime*.7 + aRnd.z*17. + p.x*1.5));
        p += n * uChaos * .4 * uExpand;
        // destino: su lugar en la galaxia (gira sobre su eje y está inclinada 60°)
        float k = smoothstep(aRnd.x*.4, aRnd.x*.4 + .6, uGalaxy);
        vec3 g = aGal;
        g.xz = rot(uTime * .05) * g.xz;
        g.yz = rot(1.0472) * g.yz;
        p = mix(p, g, k);
        vec4 mv = modelViewMatrix * vec4(p, 1.);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = mv.z > -.4 ? 0. : min((4. + aRnd.y * 14.) * uScale / -mv.z, 60. * uScale);
        vec3 hot  = mix(vec3(1., .5, .18), vec3(1., .95, .85), aRnd.w);
        vec3 cool = mix(vec3(.3, .45, 1.), vec3(.85, .35, 1.), aRnd.w);
        if (aRnd.y > .93) cool = vec3(1., .85, .55);
        vCol = mix(cool, hot, uHeat);
        vA = .55;
      }`,
    fragmentShader: `
      uniform float uAlpha; varying vec3 vCol; varying float vA;
      void main() {
        float d = length(gl_PointCoord - .5);
        gl_FragColor = vec4(vCol, smoothstep(.5, 0., d) * vA * uAlpha);
      }`
  }));
  points.frustumCulled = false;
  scene.add(points);

  // estrellas lejanas (redondas)
  const dotTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.3, 'rgba(255,255,255,.7)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  })();
  const sp = new Float32Array(1800 * 3);
  for (let i = 0; i < sp.length; i++) sp[i] = (Math.random() - 0.5) * 40;
  for (let i = 2; i < sp.length; i += 3) sp[i] *= 0.35;
  const sg = new THREE.BufferGeometry();
  sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.12, map: dotTex, transparent: true, opacity: 0, depthWrite: false });
  const stars = new THREE.Points(sg, starMat);
  stars.position.z = -12;
  scene.add(stars);

  const [fx, fy] = toWorld(FOCUS_PCT[0], FOCUS_PCT[1]);
  const FOCUS = new THREE.Vector3(fx, fy, 0);

  function resize() {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    U.uScale.value = renderer.getPixelRatio() * innerHeight / 900;
  }
  addEventListener('resize', resize); resize();

  /* =====================================================
     3. Scroll → cabezal de la línea de tiempo (suavizado)
     ===================================================== */
  let target = 0, cur = 0;
  const readScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    target = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
  };
  addEventListener('scroll', readScroll, { passive: true }); readScroll();

  const CR = '-79.9%, -69.5%'; // Costa Rica dentro de la imagen de la Tierra
  const t0 = performance.now(), ss = (a, b, x) => { x = Math.min(1, Math.max(0, (x - a) / (b - a))); return x * x * (3 - 2 * x); };
  function frame(now) {
    cur += (target - cur) * 0.08;
    tl.seek(cur * 1000);
    const time = reduce ? 0 : (now - t0) / 1000;

    U.uExpand.value = S.expand; U.uChaos.value = S.chaos; U.uGalaxy.value = S.galaxy;
    U.uHeat.value = S.heat; U.uTime.value = time;
    camera.position.z = S.z;

    // acercamiento alrededor de FOCUS
    const zs = 1 + S.zoom * S.zoom * 9, zFade = 1 - ss(.3, .9, S.zoom);
    points.scale.setScalar(zs);
    points.position.copy(FOCUS).multiplyScalar(1 - zs);
    U.uAlpha.value = zFade;
    starMat.opacity = S.stars * 0.85 * (1 - S.ezoom * .5);

    // etapa 7: la Tierra aparece y se acerca hasta Costa Rica
    $('earth').style.opacity = S.earth;
    $('earth').style.transform = `translate(${CR}) scale(${(.12 + .88 * S.earth) * (1 + S.ezoom * 1.9)})`;
    $('pin').style.opacity = S.pin;

    $('core').style.opacity  = Math.max(0, 1 - S.expand * 5);
    $('flash').style.opacity = reduce ? 0 : S.flash * 0.8;
    $('warm').style.opacity  = S.heat * Math.min(1, S.expand * 3) * 0.7;
    $('cool').style.opacity  = (1 - S.heat) * (0.8 - S.galaxy * 0.3) * (1 - S.zoom * .7);

    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
