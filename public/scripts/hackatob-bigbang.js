/* Fondo interactivo HackaToB: Big Bang → galaxia → Tierra. Requiere three.js r128 y anime.js 3.2.1. */
// Arranca en el primer cuadro de animación: así no mide la ventana mientras la página todavía se arma
// (reflow forzado) y no compite con el primer renderizado.
requestAnimationFrame(() => {
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

  // Logos con las partículas de la galaxia (los pide Premios con el evento "hk:logo": 0 galaxia · 1 ToB · 2 HackaToB).
  // Cada partícula guarda su lugar y su color en cada logo; se llenan cuando la imagen carga.
  const LOGOS = ['/imagenes/IsotipoColor.webp', '/hackatob-log0.svg'];
  const logoPos = [new Float32Array(N * 3), new Float32Array(N * 3)];
  const logoCol = [new Float32Array(N * 3), new Float32Array(N * 3)];
  const logoReady = [false, false];
  ['aLogoA', 'aLogoB'].forEach((name, i) => geo.setAttribute(name, new THREE.BufferAttribute(logoPos[i], 3)));
  ['aColA', 'aColB'].forEach((name, i) => geo.setAttribute(name, new THREE.BufferAttribute(logoCol[i], 3)));
  const loadLogo = (slot) => {
    const img = new Image();
    img.onload = () => {
      const S = 220, c = document.createElement('canvas');
      c.width = c.height = S;
      const g = c.getContext('2d', { willReadFrequently: true });
      const k = Math.min(S / (img.naturalWidth || S), S / (img.naturalHeight || S));
      const iw = (img.naturalWidth || S) * k, ih = (img.naturalHeight || S) * k;
      g.drawImage(img, (S - iw) / 2, (S - ih) / 2, iw, ih);
      const d = g.getImageData(0, 0, S, S).data, pts = [];
      for (let y = 0; y < S; y += 2) for (let x = 0; x < S; x += 2) {
        const i = (y * S + x) * 4;
        // píxel del logo: opaco y no blanco (por si la imagen trae fondo blanco)
        if (d[i + 3] > 120 && !(d[i] > 235 && d[i + 1] > 235 && d[i + 2] > 235)) pts.push(x, y, i);
      }
      if (!pts.length) return;
      // tamaño y lugar: centrado un poco arriba (debajo va el resumen de Premios); más chico en pantallas angostas
      const size = Math.min(halfH * 1.05, halfW * 1.5), oy = halfH * 0.12;
      const pos = logoPos[slot], col = logoCol[slot];
      for (let n = 0; n < N; n++) {
        const j = Math.floor(Math.random() * (pts.length / 3)) * 3, i = pts[j + 2];
        pos.set([((pts[j] + Math.random() * 2) / S - 0.5) * size,
                 -((pts[j + 1] + Math.random() * 2) / S - 0.5) * size + oy,
                 gauss() * 0.06], n * 3);
        // color del píxel, aclarado para que brille como estrella
        col.set([d[i], d[i + 1], d[i + 2]].map((v) => (v + (255 - v) * 0.45) / 255), n * 3);
      }
      geo.attributes[slot ? 'aLogoB' : 'aLogoA'].needsUpdate = true;
      geo.attributes[slot ? 'aColB' : 'aColA'].needsUpdate = true;
      logoReady[slot] = true;
    };
    img.src = LOGOS[slot];
  };
  let logoWanted = 0, logosRequested = false;
  let logoLevel = 0; // cuánto está armado el logo (0–1), antes de apagarlo por el acercamiento
  addEventListener('hk:logo', (e) => {
    logoWanted = e.detail || 0;
    if (logoWanted && !logosRequested) { logosRequested = true; loadLogo(0); loadLogo(1); }
  });

  const U = { uExpand: { value: 0 }, uChaos: { value: 0 }, uGalaxy: { value: 0 }, uHeat: { value: 1 },
              uAlpha: { value: 1 }, uTime: { value: 0 }, uScale: { value: 1 },
              uLogo: { value: 0 }, uLogoMix: { value: 0 } };
  const points = new THREE.Points(geo, new THREE.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
    vertexShader: `
      attribute vec3 aGal; attribute vec4 aRnd;
      attribute vec3 aLogoA, aLogoB, aColA, aColB;
      uniform float uExpand, uChaos, uGalaxy, uHeat, uTime, uScale, uLogo, uLogoMix;
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
        // logos (Premios): cada partícula viaja en espiral desde la galaxia a su lugar en el logo,
        // con un desfase propio; entre un logo y otro se reacomoda con un giro corto
        float kl = smoothstep(aRnd.x * .4, aRnd.x * .4 + .6, uLogo);
        float kb = smoothstep(aRnd.y * .4, aRnd.y * .4 + .6, uLogoMix);
        vec3 L = mix(aLogoA, aLogoB, kb);
        L.xy = rot(sin(kb * 3.1416) * .8) * L.xy;
        p = mix(p, L, kl);
        p.xy = rot(1.6 * sin(kl * 3.1416)) * p.xy; // la espiral: gira a mitad de camino, nunca al principio ni al final
        vec4 mv = modelViewMatrix * vec4(p, 1.);
        gl_Position = projectionMatrix * mv;
        // en el logo las partículas quedan un poco más grandes, para que la forma se lea bien
        gl_PointSize = mv.z > -.4 ? 0. : min((4. + aRnd.y * 14.) * uScale / -mv.z, 60. * uScale) * mix(1., 1.25, kl);
        // paleta sobria: azul oscuro y gris (más clara en caliente, más apagada al enfriarse)
        vec3 hot  = mix(vec3(.10, .20, .62), vec3(.62, .66, .74), aRnd.w);
        vec3 cool = mix(vec3(.07, .14, .48), vec3(.42, .45, .52), aRnd.w);
        vCol = mix(mix(cool, hot, uHeat), mix(aColA, aColB, kb), kl);
        vA = mix(.55, 1., kl);
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
  let earthRequested = false;
  let stages = null; // se busca al leer el scroll: este script corre antes de que exista <main>
  const readScroll = () => {
    stages = stages || document.querySelector('.hackatob');
    // el recorrido termina al final de las etapas: lo que haya debajo (footer) no avanza la línea de tiempo
    // getBoundingClientRect (no offsetTop): con el zoom de escritorio de HackaLayout queda en las mismas unidades que scrollY
    const end = stages ? stages.getBoundingClientRect().bottom + scrollY : document.documentElement.scrollHeight;
    // [data-hk-hold]: tramos donde la línea de tiempo no avanza. Por defecto, lo que el tramo mide de más
    // que la pantalla (contenido fijo, p. ej. Premios); con data-hk-hold="full", todo el tramo (p. ej. Mentores).
    const holds = [...document.querySelectorAll('[data-hk-hold]')].map((el) => {
      const r = el.getBoundingClientRect();
      return { top: r.top + scrollY, extra: el.dataset.hkHold === 'full' ? r.height : Math.max(0, r.height - innerHeight) };
    });
    const heldAt = (y) => holds.reduce((sum, h) => sum + Math.min(h.extra, Math.max(0, y - h.top)), 0);
    const heldTotal = holds.reduce((sum, h) => sum + h.extra, 0);
    const max = end - innerHeight - heldTotal; // recorrido que sí avanza la línea de tiempo
    if (max <= 0) { target = 0; return; }
    const s = Math.min(max, Math.max(0, scrollY - heldAt(scrollY)));
    // [data-hk-at="840"]: anclas. Cuando el borde superior del elemento llega arriba de la pantalla, la línea
    // de tiempo está en ese punto (de 0 a 1000) en cualquier pantalla; entre anclas avanza en proporción.
    // Así Premios siempre ocurre con la galaxia formada, aunque en móvil las secciones midan distinto.
    const pts = [[0, 0]];
    document.querySelectorAll('[data-hk-at]').forEach((el) => {
      const y = el.getBoundingClientRect().top + scrollY;
      pts.push([Math.min(max, Math.max(0, y - heldAt(y))), Math.min(1, Math.max(0, Number(el.dataset.hkAt) / 1000))]);
    });
    pts.push([max, 1]);
    pts.sort((a, b) => a[0] - b[0]);
    let i = 1;
    while (i < pts.length - 1 && s > pts[i][0]) i++;
    const [x0, v0] = pts[i - 1], [x1, v1] = pts[i];
    target = x1 > x0 ? v0 + (v1 - v0) * ((s - x0) / (x1 - x0)) : v1;
  };
  // el scroll solo marca que hay que medir; la medición se hace al principio del cuadro, antes de escribir
  // estilos (medir justo después de escribirlos fuerza un reflow)
  let scrollDirty = true;
  addEventListener('scroll', () => { scrollDirty = true; }, { passive: true });
  addEventListener('resize', () => { scrollDirty = true; });

  const CR = '-79.9%, -69.5%'; // Costa Rica dentro de la imagen de la Tierra
  const t0 = performance.now(), ss = (a, b, x) => { x = Math.min(1, Math.max(0, (x - a) / (b - a))); return x * x * (3 - 2 * x); };
  function frame(now) {
    if (scrollDirty) { scrollDirty = false; readScroll(); }
    cur += (target - cur) * 0.08;
    tl.seek(cur * 1000);
    const time = reduce ? 0 : (now - t0) / 1000;

    U.uExpand.value = S.expand; U.uChaos.value = S.chaos; U.uGalaxy.value = S.galaxy;
    U.uHeat.value = S.heat; U.uTime.value = time;
    // logos: se acercan suave a lo pedido (solo cuando la imagen de ese logo ya cargó).
    // Por tiempo y no por fotograma: tarda lo mismo en un teléfono lento que en una computadora.
    const logoDt = Math.min(0.1, (now - (frame.last || now)) / 1000);
    frame.last = now;
    const logoK = 1 - Math.exp(-logoDt * 2.1);
    const logoOn = logoWanted && logoReady[logoWanted - 1] ? 1 : 0;
    logoLevel += (logoOn - logoLevel) * logoK;
    if (logoWanted && logoReady[logoWanted - 1]) U.uLogoMix.value += ((logoWanted === 2 ? 1 : 0) - U.uLogoMix.value) * logoK;
    // si el acercamiento a la Tierra empieza con el logo todavía armado (scroll muy rápido), el logo se
    // deshace enseguida en vez de agrandarse con el zoom
    U.uLogo.value = logoLevel * (1 - ss(0, 0.2, S.zoom));
    camera.position.z = S.z;

    // acercamiento alrededor de FOCUS
    const zs = 1 + S.zoom * S.zoom * 9, zFade = 1 - ss(.3, .9, S.zoom);
    points.scale.setScalar(zs);
    points.position.copy(FOCUS).multiplyScalar(1 - zs);
    U.uAlpha.value = zFade;
    starMat.opacity = S.stars * 0.85 * (1 - S.ezoom * .5);

    // etapa 7: la Tierra aparece y se acerca hasta Costa Rica
    // la imagen de la Tierra se pide recién cuando el recorrido se acerca a esa etapa (no en la carga inicial)
    if (!earthRequested && cur > 0.75) {
      earthRequested = true;
      const img = $('earth');
      img.sizes = img.getAttribute('sizes') || '100vw';
      img.srcset = img.dataset.srcset || '';
      img.src = '/imagenes/hackatob/tierra-800.webp';
    }
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
});
