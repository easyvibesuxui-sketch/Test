/* ============================================================
   syniotec — CORE telematics box, built in WebGL
   Five real parts with physical materials. The Anatomy section's scroll
   position explodes and re-assembles them; main.js keeps driving the copy.
   If WebGL is unavailable the SVG layer stack stays as the fallback.
   Build: npm run build  →  assets/js/device3d.js
   ============================================================ */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const RED = 0xe10600;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const easeOut = t => 1 - Math.pow(1 - t, 3);
const easeInOut = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const section = document.getElementById('anatomy');
const stage = document.getElementById('stage');
if (section && stage) boot();

function boot() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- renderer (bail out quietly → SVG fallback) ---------- */
  const canvas = document.createElement('canvas');
  canvas.className = 'device-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) {
    return;
  }
  if (!renderer.getContext()) return;

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);
  stage.appendChild(canvas);
  stage.classList.add('has-3d');

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.3;

  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);

  /* ---------- light: cool key, hot red rim, faint fill ---------- */
  const key = new THREE.DirectionalLight(0xffffff, 1.8);
  key.position.set(-4, 7, 5);
  const rim = new THREE.DirectionalLight(0xff2414, 3.4);
  rim.position.set(5, 0.6, -5);
  const under = new THREE.PointLight(0xff1a0a, 5, 9, 1.6);
  under.position.set(0, -1.2, 0.4);
  const fill = new THREE.DirectionalLight(0x9fb4ff, 0.35);
  fill.position.set(4, 3, 6);
  scene.add(key, rim, under, fill);

  /* ---------- materials ---------- */
  const M = {
    shell: new THREE.MeshPhysicalMaterial({ color: 0x111215, roughness: 0.42, clearcoat: 0.7, clearcoatRoughness: 0.3 }),
    tray: new THREE.MeshPhysicalMaterial({ color: 0x15171a, roughness: 0.55, clearcoat: 0.3, clearcoatRoughness: 0.5 }),
    trayInner: new THREE.MeshStandardMaterial({ color: 0x0c0d0f, roughness: 0.8 }),
    rib: new THREE.MeshStandardMaterial({ color: 0x23262a, roughness: 0.7 }),
    hole: new THREE.MeshBasicMaterial({ color: 0x030303 }),
    metal: new THREE.MeshStandardMaterial({ color: 0xa4aab2, metalness: 1, roughness: 0.3 }),
    darkMetal: new THREE.MeshStandardMaterial({ color: 0x5c6168, metalness: 1, roughness: 0.38 }),
    gold: new THREE.MeshStandardMaterial({ color: 0xd3aa52, metalness: 1, roughness: 0.28 }),
    chip: new THREE.MeshStandardMaterial({ color: 0x131417, roughness: 0.45 }),
    red: new THREE.MeshPhysicalMaterial({ color: RED, roughness: 0.42, emissive: 0x3a0000, emissiveIntensity: 1 }),
    silicone: new THREE.MeshPhysicalMaterial({ color: 0xd20800, roughness: 0.55, sheen: 0.6, sheenColor: new THREE.Color(0xff5a4d), emissive: 0x4a0200, emissiveIntensity: 1 }),
    led: new THREE.MeshBasicMaterial({ color: 0xff2a1f }),
    ledOff: new THREE.MeshStandardMaterial({ color: 0x2b2e33, roughness: 0.3 }),
    ceramic: new THREE.MeshStandardMaterial({ color: 0xded6c2, roughness: 0.72 }),
    cell: new THREE.MeshPhysicalMaterial({ color: 0x101113, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.15 }),
    plate: new THREE.MeshStandardMaterial({ color: 0x0f1113, roughness: 0.6 }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0x050506, roughness: 0.08, clearcoat: 1 }),
  };

  /* ---------- geometry helpers ---------- */
  function rr(path, w, d, r) {
    const hw = w / 2, hd = d / 2;
    path.moveTo(-hw + r, -hd);
    path.lineTo(hw - r, -hd);
    path.absarc(hw - r, -hd + r, r, -Math.PI / 2, 0, false);
    path.lineTo(hw, hd - r);
    path.absarc(hw - r, hd - r, r, 0, Math.PI / 2, false);
    path.lineTo(-hw + r, hd);
    path.absarc(-hw + r, hd - r, r, Math.PI / 2, Math.PI, false);
    path.lineTo(-hw, -hd + r);
    path.absarc(-hw + r, -hd + r, r, Math.PI, Math.PI * 1.5, false);
    return path;
  }
  /* a rounded-rect slab (optionally a ring) extruded upward, base at y = 0 */
  function slab(w, d, r, h, { hole = null, bevel = 0.02, seg = 4 } = {}) {
    const shape = rr(new THREE.Shape(), w, d, r);
    if (hole) shape.holes.push(rr(new THREE.Path(), hole[0], hole[1], hole[2]));
    const g = new THREE.ExtrudeGeometry(shape, {
      depth: h, curveSegments: 20,
      bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: seg,
    });
    g.rotateX(-Math.PI / 2);
    g.computeBoundingBox();
    g.translate(0, -g.boundingBox.min.y, 0);
    g.computeVertexNormals();
    return g;
  }
  const box = (w, h, d, r = 0.012) => new RoundedBoxGeometry(w, h, d, 2, Math.min(r, w / 2, h / 2, d / 2));
  const cyl = (r, h, s = 28) => new THREE.CylinderGeometry(r, r, h, s);
  function mesh(g, m, x = 0, y = 0, z = 0) {
    const o = new THREE.Mesh(g, m);
    o.position.set(x, y, z);
    return o;
  }

  /* seeded random so the board looks the same on every visit */
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  /* ---------- PCB artwork: traces, vias, silkscreen ---------- */
  function pcbTexture() {
    const W = 1400, H = 790, c = document.createElement('canvas');
    c.width = W; c.height = H;
    const g = c.getContext('2d');
    g.fillStyle = '#0d1d16'; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 2600; i++) {               // solder-mask grain
      g.fillStyle = `rgba(${rnd() < 0.5 ? '40,80,60' : '0,0,0'},${rnd() * 0.12})`;
      g.fillRect(rnd() * W, rnd() * H, 2, 2);
    }
    g.lineCap = 'round'; g.lineJoin = 'round';
    for (let i = 0; i < 46; i++) {                 // 45° routed traces
      g.strokeStyle = `rgba(214,172,84,${0.5 + rnd() * 0.4})`;
      g.lineWidth = 2 + Math.floor(rnd() * 3);
      let x = rnd() * W, y = rnd() * H;
      g.beginPath(); g.moveTo(x, y);
      for (let k = 0; k < 4; k++) {
        const len = 60 + rnd() * 240, dir = Math.floor(rnd() * 8) * (Math.PI / 4);
        x += Math.cos(dir) * len; y += Math.sin(dir) * len;
        g.lineTo(x, y);
      }
      g.stroke();
      g.fillStyle = '#d6ac54';
      g.beginPath(); g.arc(x, y, 5, 0, Math.PI * 2); g.fill();
    }
    g.strokeStyle = 'rgba(230,232,228,.55)'; g.lineWidth = 2;   // silkscreen outlines
    [[120, 110, 380, 250], [610, 390, 230, 230], [630, 90, 180, 150], [1010, 110, 170, 130], [1000, 600, 300, 100]]
      .forEach(([x, y, w, h]) => g.strokeRect(x, y, w, h));
    g.fillStyle = 'rgba(230,232,228,.6)';
    g.font = '600 22px ui-monospace, Menlo, monospace';
    g.fillText('SYN-CORE  REV 3.2', 120, 740);
    g.fillText('U1', 612, 380); g.fillText('LTE-M', 124, 100); g.fillText('GNSS', 632, 80);
    g.fillStyle = '#d6ac54';                        // edge-connector fingers
    for (let i = 0; i < 12; i++) g.fillRect(90 + i * 34, H - 34, 20, 34);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return t;
  }

  /* ---------- lid wordmark (drawn once ABC Favorit is ready) ---------- */
  function wordmarkTexture() {
    const c = document.createElement('canvas'); c.width = 1024; c.height = 320;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    const draw = () => {
      const g = c.getContext('2d');
      g.clearRect(0, 0, c.width, c.height);
      g.fillStyle = '#0b0c0e'; g.fillRect(0, 0, c.width, c.height);
      g.fillStyle = '#6f757c';
      g.font = '700 124px "ABC Favorit Extended", "Helvetica Neue", Arial, sans-serif';
      g.textBaseline = 'middle';
      g.fillText('syniotec', 96, 150);
      g.fillStyle = '#e10600';
      g.beginPath(); g.arc(912, 150, 26, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#3a3e44';
      g.fillRect(100, 236, 420, 12);
      t.needsUpdate = true;
    };
    draw();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
    return t;
  }

  /* ---------- parts ---------- */
  const W = 3.2, D = 2.0, R = 0.28;

  function bottomShell() {
    const g = new THREE.Group();
    g.add(mesh(slab(W, D, R, 0.05), M.tray));
    g.add(mesh(slab(W, D, R, 0.3, { hole: [W - 0.2, D - 0.2, R - 0.1] }), M.tray));
    g.add(mesh(slab(W - 0.22, D - 0.22, R - 0.11, 0.004, { bevel: 0 }), M.trayInner, 0, 0.09, 0));
    [[-1.0, 0], [-0.4, 0], [0.2, 0], [0.8, 0]].forEach(([x]) => g.add(mesh(box(0.035, 0.05, D - 0.34), M.rib, x, 0.11, 0)));
    g.add(mesh(box(W - 0.5, 0.06, 0.04), M.rib, 0, 0.11, -0.62));
    g.add(mesh(box(W - 0.5, 0.06, 0.04), M.rib, 0, 0.11, 0.62));
    [[-1.3, -0.72], [1.3, -0.72], [-1.3, 0.72], [1.3, 0.72]].forEach(([x, z]) => {
      g.add(mesh(cyl(0.09, 0.26), M.tray, x, 0.18, z));
      g.add(mesh(cyl(0.038, 0.262), M.hole, x, 0.182, z));
    });
    [-1, 1].forEach(s => {                                    // bolt-on flanges
      g.add(mesh(box(0.38, 0.06, 0.72, 0.03), M.tray, s * 1.78, 0.03, 0));
      g.add(mesh(cyl(0.07, 0.062), M.hole, s * 1.84, 0.031, 0));
    });
    const gland = new THREE.Group();                          // sealed cable gland
    gland.add(mesh(cyl(0.13, 0.24), M.darkMetal));
    for (let i = 0; i < 4; i++) gland.add(mesh(cyl(0.142, 0.022), M.metal, 0, -0.08 + i * 0.055, 0));
    gland.add(mesh(cyl(0.065, 0.3), M.chip));
    gland.rotation.x = Math.PI / 2;
    gland.position.set(0.35, 0.18, D / 2 + 0.1);
    g.add(gland);
    g.add(mesh(box(0.3, 0.012, 0.03), M.red, 0, 0.1, -0.78));  // red index mark
    return g;
  }

  function mainBoard() {
    const g = new THREE.Group();
    const BW = 2.76, BD = 1.56, T = 0.05;
    g.add(mesh(box(BW, T, BD, 0.02), new THREE.MeshStandardMaterial({ color: 0x0b1712, roughness: 0.6 }), 0, T / 2, 0));
    const top = mesh(new THREE.PlaneGeometry(BW - 0.02, BD - 0.02),
      new THREE.MeshStandardMaterial({ map: pcbTexture(), roughness: 0.52, metalness: 0.15 }), 0, T + 0.001, 0);
    top.rotation.x = -Math.PI / 2;
    g.add(top);
    const y = T;
    g.add(mesh(box(0.78, 0.07, 0.5, 0.01), M.metal, -0.72, y + 0.035, -0.3));        // LTE module shield
    g.add(mesh(box(0.5, 0.004, 0.2, 0.002), M.chip, -0.72, y + 0.072, -0.3));
    g.add(mesh(box(0.42, 0.05, 0.42, 0.008), M.chip, 0.12, y + 0.025, 0.22));          // MCU
    for (let i = 0; i < 7; i++) {
      const o = -0.18 + i * 0.06;
      g.add(mesh(box(0.02, 0.012, 0.06), M.gold, 0.12 + o, y + 0.006, 0.22 - 0.24));
      g.add(mesh(box(0.02, 0.012, 0.06), M.gold, 0.12 + o, y + 0.006, 0.22 + 0.24));
      g.add(mesh(box(0.06, 0.012, 0.02), M.gold, 0.12 - 0.24, y + 0.006, 0.22 + o));
      g.add(mesh(box(0.06, 0.012, 0.02), M.gold, 0.12 + 0.24, y + 0.006, 0.22 + o));
    }
    g.add(mesh(box(0.3, 0.04, 0.26, 0.006), M.chip, 0.14, y + 0.02, -0.38));          // GNSS
    g.add(mesh(box(0.26, 0.035, 0.2, 0.006), M.chip, 0.78, y + 0.018, -0.42));
    [[0.86, 0.16, 0.085], [1.1, 0.34, 0.07], [0.86, 0.46, 0.07]].forEach(([x, z, r]) => { // capacitors
      g.add(mesh(cyl(r, 0.16), M.chip, x, y + 0.08, z));
      g.add(mesh(cyl(r * 0.96, 0.012), M.metal, x, y + 0.162, z));
    });
    g.add(mesh(box(0.52, 0.03, 0.17, 0.006), M.metal, 0.9, y + 0.015, 0.63));          // SIM socket
    for (let i = 0; i < 6; i++) g.add(mesh(box(0.06, 0.018, 0.028, 0.004), M.chip, -0.95 + (i % 3) * 0.1, y + 0.009, 0.28 + Math.floor(i / 3) * 0.08));
    g.add(mesh(box(0.05, 0.02, 0.03, 0.004), M.led, 1.12, y + 0.01, -0.68));           // status LEDs
    g.add(mesh(box(0.05, 0.02, 0.03, 0.004), M.ledOff, 1.22, y + 0.01, -0.68));
    return g;
  }

  function powerModule() {
    const g = new THREE.Group();
    g.add(mesh(box(2.36, 0.03, 1.0, 0.015), M.plate, 0, 0.015, 0));
    g.add(mesh(box(0.72, 0.03, 0.72, 0.01), M.darkMetal, -0.72, 0.045, 0));            // antenna bracket
    g.add(mesh(box(0.6, 0.07, 0.6, 0.012), M.ceramic, -0.72, 0.095, 0));               // ceramic GNSS patch
    g.add(mesh(box(0.44, 0.004, 0.44, 0.004), M.gold, -0.72, 0.132, 0));
    g.add(mesh(cyl(0.035, 0.02), M.chip, -0.72, 0.14, 0));
    const cell = new THREE.Group();                                                      // lithium cell
    cell.add(mesh(cyl(0.19, 0.96, 40), M.cell));
    cell.add(mesh(cyl(0.193, 0.09, 40), M.red, 0, 0.12, 0));
    cell.add(mesh(cyl(0.15, 0.05), M.metal, 0, 0.5, 0));
    cell.add(mesh(cyl(0.15, 0.05), M.metal, 0, -0.5, 0));
    cell.add(mesh(cyl(0.055, 0.04), M.metal, 0, 0.54, 0));
    cell.rotation.z = Math.PI / 2;
    cell.position.set(0.45, 0.21, 0);
    g.add(cell);
    const wire = new THREE.CatmullRomCurve3([                                            // harness
      new THREE.Vector3(-0.08, 0.21, 0), new THREE.Vector3(-0.22, 0.27, 0.2),
      new THREE.Vector3(-0.45, 0.2, 0.36), new THREE.Vector3(-0.72, 0.14, 0.34),
    ]);
    g.add(mesh(new THREE.TubeGeometry(wire, 40, 0.026, 10), M.red));
    g.add(mesh(box(0.2, 0.08, 0.12, 0.01), M.chip, 1.12, 0.07, 0.36));
    [[-1.08, -0.4], [1.08, -0.4], [-1.08, 0.4]].forEach(([x, z]) => g.add(mesh(cyl(0.045, 0.02), M.metal, x, 0.035, z)));
    return g;
  }

  function gasket() {
    const g = new THREE.Group();
    g.add(mesh(slab(W - 0.12, D - 0.12, R - 0.05, 0.03, { hole: [W - 0.26, D - 0.26, R - 0.11], bevel: 0.016, seg: 5 }), M.silicone));
    [[-0.9, -1], [0.9, -1], [-0.9, 1], [0.9, 1]].forEach(([x, s]) =>
      g.add(mesh(box(0.2, 0.035, 0.07, 0.017), M.silicone, x, 0.02, s * (D / 2 - 0.02))));
    [-1, 1].forEach(s => g.add(mesh(box(0.07, 0.035, 0.3, 0.017), M.silicone, s * (W / 2 - 0.02), 0.02, 0)));
    return g;
  }

  function topShell() {
    const g = new THREE.Group();
    const H = 0.13, B = 0.04, top = H + 2 * B;
    g.add(mesh(slab(W, D, R, H, { bevel: B, seg: 6 }), M.shell));
    g.add(mesh(slab(W - 0.16, D - 0.16, R - 0.07, 0.004, { hole: [W - 0.2, D - 0.2, R - 0.09], bevel: 0 }), M.red, 0, top - 0.001, 0));
    const plate = mesh(slab(1.34, 0.44, 0.07, 0.008, { bevel: 0.004 }), M.plate, 0, top - 0.002, 0);
    g.add(plate);
    const word = mesh(new THREE.PlaneGeometry(1.2, 0.375), new THREE.MeshStandardMaterial({ map: wordmarkTexture(), roughness: 0.5 }), 0, top + 0.0145, 0);
    word.rotation.x = -Math.PI / 2;
    g.add(word);
    g.add(mesh(slab(0.4, 0.15, 0.07, 0.006, { bevel: 0.003 }), M.glass, 1.02, top - 0.001, -0.66));   // status window
    g.add(mesh(cyl(0.03, 0.012), M.led, 0.94, top + 0.008, -0.66));
    g.add(mesh(cyl(0.03, 0.012), M.ledOff, 1.08, top + 0.008, -0.66));
    [[-1.3, -0.72], [1.3, -0.72], [-1.3, 0.72], [1.3, 0.72]].forEach(([x, z]) => {    // screws
      g.add(mesh(cyl(0.075, 0.022), M.metal, x, top + 0.004, z));
      g.add(mesh(box(0.1, 0.012, 0.016, 0.004), M.hole, x, top + 0.014, z));
      g.add(mesh(box(0.016, 0.012, 0.1, 0.004), M.hole, x, top + 0.014, z));
    });
    [[-1.02, 0.58], [-1.02, 0.66], [1.02, 0.58], [1.02, 0.66]].forEach(([x, z]) =>     // vent slots
      g.add(mesh(box(0.34, 0.01, 0.035, 0.012), M.hole, x, top + 0.001, z)));
    return g;
  }

  /* ---------- assemble the rig ---------- */
  // rest = where each part sits in the finished box; gap = exploded spacing
  const parts = [
    { obj: bottomShell(), rest: 0.0,  pose: [-0.35,  0.22, -0.22] },
    { obj: mainBoard(),   rest: 0.075, pose: [ 0.42, -0.12,  0.18] },
    { obj: powerModule(), rest: 0.13, pose: [-0.46, -0.05, -0.14] },
    { obj: gasket(),      rest: 0.338, pose: [ 0.3,   0.2,   0.1 ] },
    { obj: topShell(),    rest: 0.37, pose: [-0.14, -0.3,  -0.07] },
  ];
  const device = new THREE.Group();
  parts.forEach(p => device.add(p.obj));
  scene.add(device);

  /* soft contact shadow + red floor bloom (cheap, no shadow maps) */
  function radial(stops) {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const g = c.getContext('2d'), gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    stops.forEach(([o, col]) => gr.addColorStop(o, col));
    g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  const shadow = mesh(new THREE.PlaneGeometry(5.6, 3.8), new THREE.MeshBasicMaterial({
    map: radial([[0, 'rgba(0,0,0,.95)'], [0.55, 'rgba(0,0,0,.5)'], [1, 'rgba(0,0,0,0)']]),
    transparent: true, depthWrite: false,
  }));
  shadow.rotation.x = -Math.PI / 2;
  const bloom = mesh(new THREE.PlaneGeometry(5.6, 5.6), new THREE.MeshBasicMaterial({
    map: radial([[0, 'rgba(225,6,0,.5)'], [0.35, 'rgba(225,6,0,.14)'], [0.8, 'rgba(225,6,0,0)']]),
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  bloom.rotation.x = -Math.PI / 2;
  device.add(bloom, shadow);

  /* ---------- sizing ---------- */
  function resize() {
    const r = stage.getBoundingClientRect();
    const w = Math.max(1, r.width), h = Math.max(1, r.height);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(stage);
  resize();

  /* ---------- pointer parallax ---------- */
  let px = 0, py = 0, tx = 0, ty = 0;
  if (!reduced) {
    window.addEventListener('pointermove', e => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  /* ---------- frame ---------- */
  const N = parts.length;
  function progress() {
    const rect = section.getBoundingClientRect();
    const span = section.offsetHeight - window.innerHeight;
    return clamp(-rect.top / (span || 1), 0, 1);
  }

  function frame(time) {
    const p = progress();
    const e = easeInOut(p);
    const narrow = stage.clientWidth < 560;
    const gap = narrow ? 0.82 : 1.02;
    const spread = narrow ? 0.7 : 1;
    const t = (time || 0) / 1000;
    const idle = reduced ? 0 : 1;

    let meanT = 0;
    parts.forEach((part, i) => {
      const k = easeOut(clamp((p - i * 0.125) / 0.44, 0, 1));
      meanT += k / N;
      const [ox, oz, spin] = part.pose;
      const bob = idle * (1 - k) * Math.sin(t * 0.9 + i * 1.3) * 0.045;
      part.obj.position.set(
        lerp(ox * spread, 0, k),
        lerp(part.rest + (i - (N - 1) / 2) * gap + 2.05, part.rest, k) + bob,
        lerp(oz * spread, 0, k)
      );
      part.obj.rotation.y = lerp(spin, 0, k);
    });

    // frame the real span: bottom of the tray to the top of the lid
    const lo = parts[0].obj.position.y, hi = parts[N - 1].obj.position.y + 0.21;
    const span = hi - lo;
    device.position.y = -(lo + hi) / 2;
    shadow.position.y = parts[0].obj.position.y - 0.005;
    shadow.material.opacity = lerp(0.35, 0.9, meanT);
    bloom.position.y = shadow.position.y - 0.01;
    bloom.material.opacity = lerp(0.55, 1, meanT);

    // camera: high oblique while exploded → lower three-quarter once shut
    px += (tx - px) * 0.05; py += (ty - py) * 0.05;
    const sway = idle * Math.sin(t * 0.25) * 0.04;
    const az = THREE.MathUtils.degToRad(lerp(-36, -20, e)) + px * 0.08 + sway;
    const pol = THREE.MathUtils.degToRad(lerp(50, 60, e)) + py * 0.04;
    const rad = (narrow ? 10.6 : 8.7) + span * (narrow ? 1.45 : 1.22);
    camera.position.set(rad * Math.sin(pol) * Math.sin(az), rad * Math.cos(pol), rad * Math.sin(pol) * Math.cos(az));
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  /* render only while the section is on screen */
  let raf = 0, visible = false;
  const loop = time => { frame(time); raf = visible ? requestAnimationFrame(loop) : 0; };
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible && !raf) raf = requestAnimationFrame(loop);
  }, { rootMargin: '200px 0px' }).observe(section);
  frame(0);
}
