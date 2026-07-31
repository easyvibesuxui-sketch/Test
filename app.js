import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

/* ======================================================================
   1. The doors. Everything user-facing lives in this one list.
   ====================================================================== */
const DOORS = [
  { id:'programs', label:'Programs', wall:'left', slot:'near',
    url:'https://ibsu.edu.ge/en/entrant/catalog-of-programs/',
    blurb:'Bachelor’s, master’s and doctoral programs, taught in English and in Georgian.' },

  { id:'tuition', label:'Tuition', wall:'left', slot:'far',
    url:'https://ibsu.edu.ge/en/entrant/tuition-fees/',
    blurb:'Tuition rates for every level of study, for Georgian and international students.' },

  { id:'fees', label:'Fees', wall:'right', slot:'near',
    url:'https://ibsu.edu.ge/en/entrant/tuition-fees/',
    blurb:'What an entrant pays and when — the full fee list, in one place.' },

  { id:'openday', label:'Open Day', wall:'right', slot:'far',
    url:'https://ibsu.edu.ge/en/events/',
    blurb:'Come and see the campus. Open Day is held every Friday at 3 pm — register in advance.' },

  { id:'calculation', label:'Calculation', wall:'back', x:-3.5,
    url:'https://ibsu.edu.ge/en/calculation/',
    blurb:'Work out your final tuition with the state grant and IBSU’s internal grants applied.' },

  { id:'pupils', label:'Trainings For Pupils', wall:'back', x:3.5,
    url:'https://ibsu.edu.ge/en/entrant/seasonal-schools/',
    blurb:'Seasonal schools and trainings where pupils try a profession before choosing one.' },
];

/* ======================================================================
   2. Hall dimensions, in metres
   ====================================================================== */
/* A phone held upright sees a narrow slice of the world, so the hall itself is
   built narrower there — otherwise the side doors sit permanently off-frame. */
const PORTRAIT = innerHeight > innerWidth * 1.05;

const HALL = { hw: PORTRAIT ? 4.7 : 7, h: PORTRAIT ? 7.6 : 8.6, zBack: -16, zFront: 16 };
const DOOR = { w: 1.95, h: 3.65, depth: 0.34 };
const BOUND = { x: HALL.hw - 1.3, zMin: -13.8, zMax: 13.2 };
const STAND_OFF = 2.35;          // how far in front of a door the walker stops
const CAM = PORTRAIT
  ? { fov: 68, back: 10.6, high: 4.2, aim: 2.4, aimZ: -7.5 }
  : { fov: 46, back: 10.4, high: 4.1, aim: 1.75, aimZ: -4.6 };

/* On a phone the side doors also sit deeper down the hall, so both pairs stay
   ahead of the camera instead of sliding past its edges. */
for (const d of DOORS){
  if (d.slot === 'near') d.z = PORTRAIT ? -0.6 : 2.6;
  else if (d.slot === 'far') d.z = PORTRAIT ? -8.8 : -6.4;
}

const GOLD = 0xf0b978;
const isCoarse = matchMedia('(pointer: coarse)').matches;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const params = new URLSearchParams(location.search);
const LOW = params.has('low') || isCoarse || innerWidth < 820;   // lighter pipeline on phones

/* ======================================================================
   3. Renderer, scene, camera
   ====================================================================== */
const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: !LOW, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, LOW ? 1.5 : 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = !LOW;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x06070a);
scene.fog = new THREE.Fog(0x06070a, 16, 46);

const camera = new THREE.PerspectiveCamera(CAM.fov, innerWidth / innerHeight, 0.1, 120);
camera.position.set(0, 3.5, 15);
// Layers in this scene: 2 = "the walker only" (his personal lights),
// 4 = "architecture only" (the fills and wall washes). The camera sees them all.
camera.layers.enableAll();

/* a small procedural environment so the black surfaces have something to reflect */
function makeEnv(){
  const c = document.createElement('canvas');
  c.width = 64; c.height = 256;
  const g = c.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0.00, '#05060a');
  grad.addColorStop(0.42, '#12141c');
  grad.addColorStop(0.55, '#3a2d20');
  grad.addColorStop(0.62, '#1a1a22');
  grad.addColorStop(1.00, '#020305');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromEquirectangular(tex).texture;
  pmrem.dispose();
  tex.dispose();
  return env;
}
scene.environment = makeEnv();

/* ======================================================================
   4. Materials
   ====================================================================== */
const matWall = new THREE.MeshStandardMaterial({ color: 0x181b23, roughness: 0.58, metalness: 0.3 });
const matWallDark = new THREE.MeshStandardMaterial({ color: 0x0d0f14, roughness: 0.8, metalness: 0.1 });
const matPillar = new THREE.MeshStandardMaterial({ color: 0x1b1e27, roughness: 0.2, metalness: 0.7 });
const matTrim = new THREE.MeshStandardMaterial({
  color: 0x1d1710, roughness: 0.28, metalness: 0.85, emissive: GOLD, emissiveIntensity: 0.16,
});
const matSteel = new THREE.MeshStandardMaterial({ color: 0x2a2e38, roughness: 0.24, metalness: 0.9 });
const matLeaf = new THREE.MeshPhysicalMaterial({
  color: 0x101319, roughness: 0.12, metalness: 0.55, clearcoat: 1, clearcoatRoughness: 0.06,
});
const matStrip = new THREE.MeshBasicMaterial({ color: 0xb3a48c });
const matBody = new THREE.MeshPhysicalMaterial({
  color: 0x39414f, roughness: 0.34, metalness: 0.22, clearcoat: 1, clearcoatRoughness: 0.16,
});
const matSkin = new THREE.MeshPhysicalMaterial({
  color: 0x8d7f70, roughness: 0.62, metalness: 0.05, clearcoat: 0.3, clearcoatRoughness: 0.45,
});
const matGold = new THREE.MeshStandardMaterial({
  color: 0x8a6535, roughness: 0.24, metalness: 1, emissive: GOLD, emissiveIntensity: 0.08,
});

/* ======================================================================
   5. The hall
   ====================================================================== */
const depth = HALL.zFront - HALL.zBack;
const midZ = (HALL.zFront + HALL.zBack) / 2;

function buildHall(){
  const g = new THREE.Group();

  // ---- floor ----
  // Polished stone: a semi-transparent glossy sheet with mirrored copies of the
  // bright objects underneath it (see makeMirror). A real Reflector was tried
  // first and threw hard specular streaks at grazing angles; this is cheaper
  // and completely predictable.
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(HALL.hw * 2, depth),
    new THREE.MeshPhysicalMaterial({
      color: 0x0c0e15, roughness: 0.4, metalness: 0.45,
      clearcoat: 0.6, clearcoatRoughness: 0.2,
      transparent: !LOW, opacity: LOW ? 1 : 0.88,
    })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.z = midZ;
  floor.receiveShadow = !LOW;
  g.add(floor);

  // an invisible plane the pointer can hit, so clicks land on the floor
  const picker = new THREE.Mesh(
    new THREE.PlaneGeometry(HALL.hw * 2, depth),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  picker.rotation.x = -Math.PI / 2;
  picker.position.z = midZ;
  picker.name = 'floor';
  g.add(picker);
  floorPicker = picker;

  // ---- ceiling ----
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(HALL.hw * 2, depth), matWallDark);
  ceil.rotation.x = Math.PI / 2;
  ceil.position.set(0, HALL.h, midZ);
  g.add(ceil);

  // two light strips running the length of the ceiling
  for (const x of [-2.6, 2.6]){
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.06, depth - 3), matStrip);
    strip.position.set(x, HALL.h - 0.16, midZ);
    g.add(strip);
  }


  // ---- walls ----
  for (const side of [-1, 1]){
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(depth, HALL.h), matWall);
    wall.rotation.y = -side * Math.PI / 2;
    wall.position.set(side * HALL.hw, HALL.h / 2, midZ);
    wall.receiveShadow = !LOW;
    g.add(wall);

    // skirting + cornice
    for (const [y, h] of [[0.14, 0.28], [HALL.h - 0.3, 0.34]]){
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.12, h, depth), matSteel);
      b.position.set(side * (HALL.hw - 0.06), y, midZ);
      g.add(b);
    }

    // pillars between the doors, each with a warm vertical strip
    for (const z of [10.6, 6.4, -1.9, -10.6, -14.4]){
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.55, HALL.h, 0.9), matPillar);
      p.position.set(side * (HALL.hw - 0.26), HALL.h / 2, z);
      p.castShadow = !LOW;
      g.add(p);

      const s = new THREE.Mesh(new THREE.BoxGeometry(0.04, HALL.h - 3.6, 0.07), matStrip);
      s.position.set(side * (HALL.hw - 0.54), HALL.h / 2 + 0.35, z);
      g.add(s);
    }

    // a horizontal reveal so the wall is not a dead black slab
    const reveal = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.07, depth - 2), matSteel);
    reveal.position.set(side * (HALL.hw - 0.04), 5.9, midZ);
    g.add(reveal);

    // Two soft washes per side. They live on LAYER 4 — "walls only" — so they
    // model the architecture without laying a specular hotspot on the floor.
    for (const z of [7.5, -8]){
      const wash = new THREE.SpotLight(0xffc48d, LOW ? 26 : 42, 15, 0.85, 1, 2);
      wash.position.set(side * (HALL.hw - 0.5), HALL.h - 0.7, z);
      wash.target.position.set(side * HALL.hw, 1.5, z);
      wash.layers.set(4);
      g.add(wash, wash.target);
    }
  }

  // ---- back wall ----
  const back = new THREE.Mesh(new THREE.PlaneGeometry(HALL.hw * 2, HALL.h), matWall);
  back.position.set(0, HALL.h / 2, HALL.zBack);
  back.receiveShadow = !LOW;
  g.add(back);

  const backTrim = new THREE.Mesh(new THREE.BoxGeometry(HALL.hw * 2, 0.28, 0.12), matSteel);
  backTrim.position.set(0, 0.14, HALL.zBack + 0.06);
  g.add(backTrim);

  // the wall behind the camera, so reflections never look into the void
  const front = new THREE.Mesh(new THREE.PlaneGeometry(HALL.hw * 2, HALL.h), matWallDark);
  front.rotation.y = Math.PI;
  front.position.set(0, HALL.h / 2, HALL.zFront);
  g.add(front);

  // ---- IBSU on the back wall ----
  g.add(makeWordmark());

  // walls and columns also answer to the layer-4 wall washes
  const wallish = [matWall, matWallDark, matPillar, matTrim, matSteel];
  g.traverse(o => { if (o.isMesh && wallish.includes(o.material)) o.layers.enable(4); });

  return g;
}

function makeWordmark(){
  const c = document.createElement('canvas');
  c.width = 2048; c.height = 512;
  const x = c.getContext('2d');
  x.clearRect(0, 0, c.width, c.height);
  x.font = '600 300px Outfit, "Segoe UI", system-ui, sans-serif';
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  if ('letterSpacing' in x) x.letterSpacing = '64px';
  x.fillStyle = '#fff3e2';
  x.fillText('IBSU', c.width / 2 + 32, c.height / 2);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;

  const grp = new THREE.Group();
  const mark = new THREE.Mesh(
    new THREE.PlaneGeometry(7.2, 1.8),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true })
  );
  mark.position.set(0, 6.55, HALL.zBack + 0.05);
  grp.add(mark);

  const glow = new THREE.PointLight(0xffd9ac, 26, 18, 2);
  glow.position.set(0, 6.4, HALL.zBack + 1.8);
  grp.add(glow);

  // a thin lit line under the wordmark
  const rule = new THREE.Mesh(new THREE.BoxGeometry(8.6, 0.03, 0.04), matStrip);
  rule.position.set(0, 5.62, HALL.zBack + 0.06);
  grp.add(rule);

  return grp;
}

/* ======================================================================
   6. A door: frame, swinging leaf, lit sign, portal glow
   ====================================================================== */
function signTexture(label){
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 256;
  const x = c.getContext('2d');
  x.clearRect(0, 0, c.width, c.height);
  const size = 104;
  x.font = `400 ${size}px Outfit, "Segoe UI", system-ui, sans-serif`;
  if ('letterSpacing' in x) x.letterSpacing = `${size * 0.16}px`;
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  x.fillStyle = '#fff1dd';
  // squeeze long labels rather than letting them run off the plate
  const text = label.toUpperCase();
  const room = c.width * 0.88;
  const w = x.measureText(text).width;
  x.save();
  if (w > room) x.scale(room / w, 1);
  x.fillText(text, (c.width / 2) * (w > room ? w / room : 1), c.height / 2);
  x.restore();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function makeGlowTexture(){
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const x = c.getContext('2d');
  const g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, 'rgba(255,226,180,1)');
  g.addColorStop(0.45, 'rgba(255,190,120,.45)');
  g.addColorStop(1, 'rgba(255,170,90,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
const glowTex = makeGlowTexture();

function buildDoor(d){
  const grp = new THREE.Group();
  if (d.wall === 'back'){
    grp.position.set(d.x, 0, HALL.zBack + 0.02);
    d.stand = new THREE.Vector3(d.x, 0, HALL.zBack + STAND_OFF + 0.4);
  } else {
    const side = d.wall === 'left' ? -1 : 1;
    grp.position.set(side * (HALL.hw - 0.02), 0, d.z);
    grp.rotation.y = side * Math.PI / 2 * -1;    // local +z points into the hall
    d.stand = new THREE.Vector3(side * (HALL.hw - STAND_OFF), 0, d.z);
  }

  const W = DOOR.w, H = DOOR.h, T = 0.17;

  // recess: a dark box set into the wall
  const recess = new THREE.Mesh(
    new THREE.BoxGeometry(W, H, DOOR.depth),
    new THREE.MeshStandardMaterial({ color: 0x05060a, roughness: 0.9, metalness: 0 })
  );
  recess.position.set(0, H / 2, -DOOR.depth / 2 + 0.02);
  grp.add(recess);

  // portal glow, revealed as the leaf swings
  const portal = new THREE.Mesh(
    new THREE.PlaneGeometry(W * 1.5, H * 1.1),
    new THREE.MeshBasicMaterial({
      map: glowTex, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false,
    })
  );
  portal.position.set(0, H / 2, 0.03);
  grp.add(portal);
  d.portal = portal;

  // frame
  const frameMat = matTrim.clone();
  d.frameMat = frameMat;
  const side1 = new THREE.Mesh(new THREE.BoxGeometry(T, H + T * 2, 0.22), frameMat);
  side1.position.set(-W / 2 - T / 2, H / 2, 0.09);
  const side2 = side1.clone();
  side2.position.x = W / 2 + T / 2;
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(W + T * 2, T, 0.22), frameMat);
  lintel.position.set(0, H + T / 2, 0.09);
  grp.add(side1, side2, lintel);

  // the leaf, hinged on its left edge
  const hinge = new THREE.Group();
  hinge.position.set(-W / 2, 0, 0.02);
  grp.add(hinge);
  d.hinge = hinge;

  const leaf = new THREE.Mesh(new THREE.BoxGeometry(W - 0.04, H - 0.04, 0.09), matLeaf);
  leaf.position.set(W / 2 - 0.02, H / 2, 0);
  leaf.castShadow = !LOW;
  hinge.add(leaf);

  // thin inlays + handle, so the leaf reads as a door without going brassy
  for (const y of [H * 0.28, H * 0.68]){
    const pw = W - 0.6, ph = H * 0.28, t = 0.035;
    for (const [ox, oy, sx, sy] of [[0, ph / 2, pw, t], [0, -ph / 2, pw, t],
                                    [-pw / 2, 0, t, ph], [pw / 2, 0, t, ph]]){
      const bar = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, 0.02), matGold);
      bar.position.set(W / 2 - 0.02 + ox, y + oy, 0.05);
      hinge.add(bar);
    }
  }
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.34, 12), matGold);
  handle.rotation.x = Math.PI / 2;
  handle.position.set(W - 0.24, H * 0.47, 0.11);
  hinge.add(handle);

  // sign above the door
  const signMat = new THREE.MeshBasicMaterial({ map: signTexture(d.label), transparent: true });
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 0.62), signMat);
  sign.position.set(0, H + 0.78, 0.12);
  grp.add(sign);
  d.signMat = signMat;

  const plate = new THREE.Mesh(
    new THREE.BoxGeometry(2.66, 0.8, 0.07),
    new THREE.MeshStandardMaterial({ color: 0x0b0c11, roughness: 0.3, metalness: 0.7 })
  );
  plate.position.set(0, H + 0.78, 0.05);
  grp.add(plate);

  const underline = new THREE.Mesh(new THREE.BoxGeometry(2.66, 0.026, 0.03), matStrip);
  underline.position.set(0, H + 0.38, 0.1);
  grp.add(underline);

  // a spot washing down over the door
  const spot = new THREE.SpotLight(0xffc38a, LOW ? 26 : 48, 11, 0.62, 0.75, 2);
  spot.position.set(0, H + 2.4, 1.7);
  spot.target.position.set(0, H / 2, 0);
  grp.add(spot, spot.target);
  d.spot = spot;

  // a painted pool of light on the polished floor at the threshold — free, and
  // it reads far better on gloss than another real light would
  const pool = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 4.4),
    new THREE.MeshBasicMaterial({
      map: glowTex, transparent: true, opacity: 0.18,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
  );
  pool.rotation.x = -Math.PI / 2;
  pool.position.set(0, 0.014, 1.9);
  pool.renderOrder = 1;
  grp.add(pool);
  d.pool = pool;

  // everything the pointer may hit for this door. The mapping lives in a Map,
  // not in userData, so that cloning a door for its reflection never has to
  // serialise a cycle back to this object.
  for (const m of [leaf, side1, side2, lintel, sign, plate, recess]){
    doorOf.set(m, d);
    pickables.push(m);
  }

  // doors belong to the architecture, so the layer-4 fills reach them too
  grp.traverse(o => { if (o.isMesh) o.layers.enable(4); });

  d.group = grp;
  d.open = 0;
  d.openTarget = 0;
  d.hot = 0;
  return grp;
}

/* ======================================================================
   7. The walker — built from primitives, lit and glossy
   ====================================================================== */
function buildHero(){
  const g = new THREE.Group();
  const limbs = {};

  // upper body sits in its own group so it can lean into the walk
  const upper = new THREE.Group();
  upper.position.y = 0.92;
  g.add(upper);

  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.235, 0.44, 6, 18), matBody);
  torso.position.y = 0.3;
  torso.scale.set(1.06, 1, 0.84);
  upper.add(torso);

  const shoulders = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.42, 4, 14), matBody);
  shoulders.rotation.z = Math.PI / 2;
  shoulders.position.y = 0.53;
  shoulders.scale.set(1, 1, 0.8);
  upper.add(shoulders);

  const hips = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.1, 4, 14), matBody);
  hips.position.y = 0.02;
  hips.scale.set(1.05, 1, 0.78);
  upper.add(hips);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.075, 0.1, 10), matSkin);
  neck.position.y = 0.66;
  upper.add(neck);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.152, 26, 20), matSkin);
  head.position.y = 0.83;
  head.scale.set(0.94, 1.12, 1);
  upper.add(head);

  // arms
  for (const s of [-1, 1]){
    const pivot = new THREE.Group();
    pivot.position.set(s * 0.275, 0.5, 0);
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.062, 0.4, 4, 12), matBody);
    arm.position.y = -0.28;
    pivot.add(arm);
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.062, 12, 10), matSkin);
    hand.position.y = -0.52;
    pivot.add(hand);
    upper.add(pivot);
    limbs[s < 0 ? 'armL' : 'armR'] = pivot;
  }

  // legs
  for (const s of [-1, 1]){
    const pivot = new THREE.Group();
    pivot.position.set(s * 0.125, 0.88, 0);
    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.082, 0.46, 4, 12), matBody);
    leg.position.y = -0.34;
    pivot.add(leg);
    const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.09, 0.3), matLeaf);
    shoe.position.set(0, -0.68, 0.04);
    pivot.add(shoe);
    g.add(pivot);
    limbs[s < 0 ? 'legL' : 'legR'] = pivot;
  }

  // satchel on the left hip, strap across the chest
  const bag = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.26, 0.12), matBody);
  bag.position.set(-0.31, 0.06, 0.02);
  bag.rotation.z = 0.07;
  upper.add(bag);
  const flap = new THREE.Mesh(new THREE.BoxGeometry(0.315, 0.06, 0.135), matGold);
  flap.position.set(-0.31, 0.16, 0.02);
  flap.rotation.z = 0.07;
  upper.add(flap);

  for (const z of [-0.16, 0.16]){
    const strap = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.7, 0.016), matSteel);
    strap.position.set(-0.05, 0.33, z);
    strap.rotation.z = -0.4;
    upper.add(strap);
  }

  // a book tucked under the right arm
  const book = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.26, 0.2), matGold);
  book.position.set(0.3, 0.16, 0.02);
  book.rotation.z = -0.09;
  upper.add(book);

  // LAYER 2 = "only the walker". His personal lights live there, so they model
  // him without ever blowing highlights across the polished floor.
  g.traverse(o => { if (o.isMesh){ o.castShadow = !LOW; o.layers.enable(2); } });

  const key = new THREE.PointLight(0xffe8cf, 14, 8, 2);
  key.position.set(0.9, 2.5, 2.2);
  key.layers.set(2);
  g.add(key);

  const rim = new THREE.PointLight(0xffb877, 11, 6, 2);
  rim.position.set(-0.8, 2.1, -1.8);
  rim.layers.set(2);
  g.add(rim);

  g.userData.limbs = limbs;
  g.userData.upper = upper;
  return g;
}

/* ======================================================================
   8. Reflections, by mirroring the geometry under the floor
   ====================================================================== */
const dimCache = new Map();
function dimMaterial(m){
  if (dimCache.has(m)) return dimCache.get(m);
  const d = m.clone();
  d.color.multiplyScalar(0.42);
  if (d.emissive) d.emissiveIntensity = (d.emissiveIntensity || 0) * 0.45;
  d.side = THREE.DoubleSide;          // the negative scale flips face winding
  d.transparent = true;
  d.opacity = (m.opacity ?? 1) * 0.75;
  d.depthWrite = false;
  if ('clearcoat' in d) d.clearcoat = 0;
  dimCache.set(m, d);
  return d;
}
const mirrorPairs = new Map();
/** a dimmed copy of `src`, flipped through the floor plane */
function makeMirror(src){
  const m = src.clone(true);

  // pair the two trees up while they still match node for node
  const a = [], b = [];
  src.traverse(o => a.push(o));
  m.traverse(o => b.push(o));
  const pairs = [];
  for (let i = 1; i < a.length && i < b.length; i++){
    if (!b[i].isLight) pairs.push([a[i], b[i]]);
  }
  mirrorPairs.set(m, pairs);

  // a reflection carries no lights, no shadows and no hit targets
  const lights = b.filter(o => o.isLight);
  for (const l of lights) l.parent && l.parent.remove(l);
  for (const o of b){
    if (o.isMesh) o.material = dimMaterial(o.material);
    o.castShadow = false;
    o.receiveShadow = false;
  }

  m.scale.y *= -1;
  m.renderOrder = -1;
  return m;
}
/** keep a mirrored copy in step with the original, frame by frame */
function syncMirror(src, dst){
  dst.position.set(src.position.x, -src.position.y, src.position.z);
  dst.quaternion.copy(src.quaternion);
  const pairs = mirrorPairs.get(dst);
  if (!pairs) return;
  for (const [from, to] of pairs){
    to.position.copy(from.position);
    to.quaternion.copy(from.quaternion);
  }
}

/* ======================================================================
   9. Assemble
   ====================================================================== */
let floorPicker = null;
const pickables = [];
const doorOf = new Map();

scene.add(new THREE.HemisphereLight(0x8496b4, 0x0d0f15, 1.8));

// Directional fills are for the architecture only (layer 4). Aimed at the floor
// they would smear a broad specular blob across the polish.
const fill = new THREE.DirectionalLight(0xc6d6ff, 0.9);
fill.position.set(4, 9, 12);
fill.layers.set(4);
scene.add(fill);
const backFill = new THREE.DirectionalLight(0xffc48d, 0.5);
backFill.position.set(-3, 6, -12);
backFill.layers.set(4);
scene.add(backFill);

scene.add(buildHall());
for (const d of DOORS){
  const grp = buildDoor(d);
  scene.add(grp);
  if (!LOW){
    d.mirror = makeMirror(grp);
    scene.add(d.mirror);
  }
}

/* one shared light for whichever door is open — cheaper than one per door */
const portalLight = new THREE.PointLight(0xffc98a, 0, 12, 2);
scene.add(portalLight);

const hero = buildHero();
hero.position.set(0, 0, 8.5);
hero.rotation.y = Math.PI;          // facing away from the camera, down the hall
scene.add(hero);

const heroMirror = LOW ? null : makeMirror(hero);
if (heroMirror) scene.add(heroMirror);

/* a soft pool of light that travels with him, plus a contact shadow so he
   is planted on the floor rather than hovering over it */
const heroSpot = new THREE.SpotLight(0xfff0da, 62, 18, 0.42, 1, 2);
heroSpot.position.set(0, HALL.h - 0.4, 8.5);
heroSpot.castShadow = !LOW;
heroSpot.shadow.mapSize.set(1024, 1024);
heroSpot.shadow.bias = -0.0012;
scene.add(heroSpot, heroSpot.target);

const contact = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    map: (() => {
      const c = document.createElement('canvas');
      c.width = c.height = 128;
      const x = c.getContext('2d');
      const gr = x.createRadialGradient(64, 64, 0, 64, 64, 64);
      gr.addColorStop(0, 'rgba(0,0,0,.85)');
      gr.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = gr; x.fillRect(0, 0, 128, 128);
      return new THREE.CanvasTexture(c);
    })(),
    transparent: true, opacity: 0.75, depthWrite: false,
  })
);
contact.rotation.x = -Math.PI / 2;
contact.position.y = 0.012;
scene.add(contact);

/* ---------- post processing ---------- */
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(
  new THREE.Vector2(innerWidth, innerHeight), LOW ? 0.3 : 0.42, 0.7, 0.92
);
composer.addPass(bloom);
composer.addPass(new OutputPass());

/* ======================================================================
   9. Input
   ====================================================================== */
const keys = new Set();
const MOVE_KEYS = { ArrowLeft:1, ArrowRight:1, ArrowUp:1, ArrowDown:1, KeyA:1, KeyD:1, KeyW:1, KeyS:1 };
const SPEED = 4.2;

let target = null;        // Vector3 on the floor
let queuedDoor = null;
let hoverDoor = null;
let activeDoor = null;
let promptDoor = null;
let yaw = Math.PI, phase = 0, moving = 0;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

function pick(ev){
  pointer.x = (ev.clientX / innerWidth) * 2 - 1;
  pointer.y = -(ev.clientY / innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(pickables, false);
  if (hits.length) return { door: doorOf.get(hits[0].object) };
  const f = raycaster.intersectObject(floorPicker, false);
  if (f.length) return { point: f[0].point };
  return {};
}

canvas.addEventListener('pointermove', ev => {
  if (activeDoor) return;
  hoverDoor = pick(ev).door || null;
  canvas.classList.toggle('pointing', !!hoverDoor);
});
canvas.addEventListener('pointerleave', () => { hoverDoor = null; canvas.classList.remove('pointing'); });
canvas.addEventListener('pointerdown', ev => {
  if (activeDoor) return;
  canvas.focus({ preventScroll: true });
  hideHint();
  const hit = pick(ev);
  if (hit.door){
    if (hero.position.distanceTo(hit.door.stand) < 1.2){ enterDoor(hit.door); target = null; queuedDoor = null; }
    else { target = hit.door.stand.clone(); queuedDoor = hit.door; }
    return;
  }
  if (hit.point){
    target = new THREE.Vector3(
      clamp(hit.point.x, -BOUND.x, BOUND.x), 0, clamp(hit.point.z, BOUND.zMin, BOUND.zMax)
    );
    queuedDoor = null;
  }
});

addEventListener('keydown', e => {
  if (e.code === 'Escape'){ if (activeDoor) closePopup(); return; }
  if (activeDoor) return;
  if (MOVE_KEYS[e.code]){
    keys.add(e.code); target = null; queuedDoor = null; hideHint(); e.preventDefault();
  } else if (e.code === 'Enter' || e.code === 'Space'){
    if (promptDoor){ enterDoor(promptDoor); e.preventDefault(); }
  }
});
addEventListener('keyup', e => keys.delete(e.code));
addEventListener('blur', () => keys.clear());

/* ======================================================================
   10. Popup
   ====================================================================== */
const modal = document.getElementById('modal');
const mTitle = document.getElementById('mTitle');
const mBlurb = document.getElementById('mBlurb');
const mGo = document.getElementById('mGo');

function openPopup(d){
  activeDoor = d;
  mTitle.textContent = d.label;
  mBlurb.textContent = d.blurb;
  mGo.href = d.url;
  modal.classList.add('on');
  setTimeout(() => mGo.focus({ preventScroll: true }), 150);
}
function closePopup(){
  if (activeDoor){ activeDoor.openTarget = 0; activeDoor = null; }
  modal.classList.remove('on');
  canvas.focus({ preventScroll: true });
}
/* the real link click is what opens the tab, so no popup blocker ever sees it */
mGo.addEventListener('click', () => setTimeout(closePopup, 90));
document.getElementById('mBack').addEventListener('click', closePopup);
modal.addEventListener('click', e => { if (e.target === modal) closePopup(); });

function enterDoor(d){
  if (!d || activeDoor) return;
  d.openTarget = 1;
  setTimeout(() => { if (d.openTarget === 1 && !activeDoor) openPopup(d); }, 620);
}

/* ---------- the floating "press Enter" label ---------- */
const promptEl = document.createElement('div');
promptEl.id = 'prompt';
promptEl.style.cssText = `position:fixed;z-index:5;pointer-events:none;transform:translate(-50%,-50%);
  padding:.5em 1em;border-radius:999px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;
  color:#f2ece4;background:rgba(10,11,15,.62);border:1px solid rgba(240,185,120,.45);
  backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);opacity:0;transition:opacity .25s`;
promptEl.textContent = 'Press ⏎ to open';
document.body.appendChild(promptEl);

/* ---------- hint + door index ---------- */
const hint = document.getElementById('hint');
let hintHidden = false;
function hideHint(){
  if (hintHidden) return;
  hintHidden = true;
  setTimeout(() => hint.classList.add('gone'), 1400);
}
setTimeout(hideHint, 10000);

const indexBtn = document.getElementById('indexBtn');
const indexPanel = document.getElementById('indexPanel');
indexPanel.innerHTML = DOORS.map(d =>
  `<li><a href="${d.url}" target="_blank" rel="noopener">${d.label}</a></li>`).join('');
indexBtn.addEventListener('click', () => {
  const willOpen = indexPanel.hidden;
  indexPanel.hidden = !willOpen;
  indexBtn.setAttribute('aria-expanded', String(willOpen));
});
document.addEventListener('click', e => {
  if (!indexPanel.hidden && !indexPanel.contains(e.target) && e.target !== indexBtn){
    indexPanel.hidden = true;
    indexBtn.setAttribute('aria-expanded', 'false');
  }
});

/* ======================================================================
   11. Frame loop
   ====================================================================== */
const camPos = new THREE.Vector3(0, 3.5, 15);
const camAim = new THREE.Vector3(0, 1.4, 0);
const tmp = new THREE.Vector3();
const clock = new THREE.Clock();

function update(dt, t){
  // ---- steering ----
  let ax = 0, az = 0;
  if (keys.has('ArrowLeft') || keys.has('KeyA')) ax -= 1;
  if (keys.has('ArrowRight') || keys.has('KeyD')) ax += 1;
  if (keys.has('ArrowUp') || keys.has('KeyW')) az -= 1;
  if (keys.has('ArrowDown') || keys.has('KeyS')) az += 1;

  let vx = 0, vz = 0;
  if (ax || az){
    const l = Math.hypot(ax, az);
    vx = (ax / l) * SPEED; vz = (az / l) * SPEED;
  } else if (target){
    tmp.subVectors(target, hero.position);
    tmp.y = 0;
    const dist = tmp.length();
    if (dist < 0.12){
      hero.position.copy(target);
      target = null;
      if (queuedDoor){ const d = queuedDoor; queuedDoor = null; enterDoor(d); }
    } else {
      // never step past the target: at a low frame rate a fixed-speed step can
      // overshoot and orbit it forever, so arrival would never fire
      tmp.normalize();
      const step = Math.min(SPEED * dt, dist) / dt;
      vx = tmp.x * step; vz = tmp.z * step;
    }
  }

  const speed = Math.hypot(vx, vz);
  moving += ((speed > 0.05 ? 1 : 0) - moving) * Math.min(1, dt * 9);
  if (speed > 0.05){
    hero.position.x = clamp(hero.position.x + vx * dt, -BOUND.x, BOUND.x);
    hero.position.z = clamp(hero.position.z + vz * dt, BOUND.zMin, BOUND.zMax);
    yaw = Math.atan2(vx, vz);
    phase += dt * 9.2;
  }
  // shortest-path turn
  let dy = yaw - hero.rotation.y;
  while (dy > Math.PI) dy -= Math.PI * 2;
  while (dy < -Math.PI) dy += Math.PI * 2;
  hero.rotation.y += dy * Math.min(1, dt * 9);

  // ---- walk cycle ----
  const L = hero.userData.limbs;
  const sw = Math.sin(phase) * 0.62 * moving;
  L.legL.rotation.x = sw;
  L.legR.rotation.x = -sw;
  L.armL.rotation.x = -sw * 0.7;
  L.armR.rotation.x = sw * 0.7;
  hero.position.y = Math.abs(Math.sin(phase)) * 0.04 * moving;
  hero.userData.upper.rotation.x = 0.08 * moving;
  hero.userData.upper.rotation.z = Math.sin(phase) * 0.035 * moving;

  if (heroMirror) syncMirror(hero, heroMirror);
  heroSpot.position.set(hero.position.x, HALL.h - 0.4, hero.position.z + 0.6);
  heroSpot.target.position.copy(hero.position);
  contact.position.set(hero.position.x, 0.012, hero.position.z);

  // ---- which door are we at ----
  promptDoor = null;
  let best = 2.6;
  for (const d of DOORS){
    const dist = hero.position.distanceTo(d.stand);
    if (dist < best){ best = dist; promptDoor = d; }
  }

  // ---- doors ----
  for (const d of DOORS){
    d.open += (d.openTarget - d.open) * Math.min(1, dt * 3.4);
    d.hinge.rotation.y = -d.open * 1.85;
    if (d.mirror) syncMirror(d.group, d.mirror);
    d.portal.material.opacity = d.open * 0.85;
    if (d.open > 0.02){
      d.group.getWorldPosition(tmp);
      portalLight.position.set(tmp.x, DOOR.h / 2, tmp.z);
      portalLight.position.lerp(hero.position.clone().setY(DOOR.h / 2), 0.16);
      portalLight.intensity = d.open * 34;
    }

    const want = (d === hoverDoor || d === promptDoor || d === activeDoor) ? 1 : 0;
    d.hot += (want - d.hot) * Math.min(1, dt * 6);
    d.frameMat.emissiveIntensity = 0.16 + d.hot * 0.75;
    d.signMat.color.setScalar(1 + d.hot * 0.9);
    d.spot.intensity = (LOW ? 26 : 48) * (1 + d.hot * 0.5);
    d.pool.material.opacity = 0.18 + d.hot * 0.28 + d.open * 0.4;
  }
  if (!DOORS.some(d => d.open > 0.02)) portalLight.intensity = 0;

  // ---- the floating prompt ----
  const showPrompt = promptDoor && !activeDoor && promptDoor.open < 0.06;
  promptEl.style.opacity = showPrompt ? '1' : '0';
  if (showPrompt){
    tmp.set(hero.position.x, 2.35, hero.position.z).project(camera);
    promptEl.style.left = `${(tmp.x * 0.5 + 0.5) * innerWidth}px`;
    promptEl.style.top = `${(-tmp.y * 0.5 + 0.5) * innerHeight}px`;
  }

  // ---- camera ----
  const breathe = reduceMotion ? 0 : Math.sin(t * 0.5) * 0.05;
  camPos.set(
    clamp(hero.position.x * 0.5, -HALL.hw * 0.46, HALL.hw * 0.46),
    CAM.high + breathe,
    clamp(hero.position.z + CAM.back, HALL.zBack + 4.5, 15.2)
  );
  camAim.set(hero.position.x * 0.6, CAM.aim, hero.position.z + CAM.aimZ);
  camera.position.lerp(camPos, Math.min(1, dt * 3.2));
  tmp.copy(camAim);
  camera.lookAt(tmp);
}

let booted = false;
renderer.setAnimationLoop(() => {
  const dt = Math.min(0.05, clock.getDelta());
  update(dt, clock.elapsedTime);
  composer.render();
  if (!booted){
    booted = true;
    document.getElementById('loader').classList.add('done');
  }
});

let resizeT = 0;
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth, innerHeight);
  bloom.setSize(innerWidth, innerHeight);
  // the hall's proportions are chosen for the orientation, so turning the
  // device sideways rebuilds it from scratch
  clearTimeout(resizeT);
  resizeT = setTimeout(() => {
    if ((innerHeight > innerWidth * 1.05) !== PORTRAIT) location.reload();
  }, 500);
});

canvas.tabIndex = 0;
canvas.focus({ preventScroll: true });

/* ?debug exposes the scene for automated checks */
if (params.has('debug')){
  window.__hall = { DOORS, camera, hero, scene, pickables,
    probe(x, y){
      const r = pick({ clientX: x, clientY: y });
      return { door: r.door ? r.door.id : null, point: r.point ? r.point.toArray().map(n => +n.toFixed(2)) : null };
    },
    screenOf(o){
    const v = new THREE.Vector3();
    o.getWorldPosition(v);
    v.project(camera);
    return { x: (v.x * 0.5 + 0.5) * innerWidth, y: (-v.y * 0.5 + 0.5) * innerHeight };
  } };
}
