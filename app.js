import * as THREE from 'three';

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
const DOOR = { w: 1.95, h: 3.65, depth: 0.3 };
const BOUND = { x: HALL.hw - 1.3, zMin: -13.8, zMax: 13.2 };
const STAND_OFF = 2.35;          // how far in front of a door the walker stops
const CAM = PORTRAIT
  ? { fov: 68, back: 10.6, high: 4.0, aim: 2.0, aimZ: -7.0 }
  : { fov: 46, back: 10.4, high: 4.1, aim: 1.75, aimZ: -4.6 };

/* On a phone the side doors also sit deeper down the hall, so both pairs stay
   ahead of the camera instead of sliding past its edges. */
for (const d of DOORS){
  if (d.slot === 'near') d.z = PORTRAIT ? -0.6 : 2.6;
  else if (d.slot === 'far') d.z = PORTRAIT ? -8.8 : -6.4;
}

/* ---------- palette ----------
   A pale hall where the only dark things are the doors and the walker, so the
   six choices read at a glance and nothing else competes. */
const PAPER  = 0xf4f1ea;   // air, and the far end of the hall
const WALL   = 0xf8f6f1;
const CEIL   = 0xfcfbf8;
const FLOOR  = 0xeae5db;
const GREY   = 0xdad4c8;   // skirting, frames, quiet lines
const NAVY   = 0x2b3654;   // the doors
const INK    = 0x2f3542;   // the walker
const WARM   = 0xffd9a0;   // light through an open door

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const params = new URLSearchParams(location.search);
const LOW = params.has('low') || matchMedia('(pointer: coarse)').matches || innerWidth < 820;

/* ======================================================================
   3. Renderer, scene, camera
   ====================================================================== */
const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: !LOW, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, LOW ? 1 : 1.5));
renderer.setSize(innerWidth, innerHeight);

/* No shadow maps, no post-processing, no reflections, no environment map: this
   scene is drawn in a single pass with three lights and matte materials. That
   is what keeps it smooth on a laptop GPU, and it suits the flat, pale look. */
const scene = new THREE.Scene();
scene.background = new THREE.Color(PAPER);
/* barely any fog: it only softens the far corners. Pulled this far back because
   at 20m it was washing the navy out of the back-wall doors. */
scene.fog = new THREE.Fog(PAPER, 46, 110);

const camera = new THREE.PerspectiveCamera(CAM.fov, innerWidth / innerHeight, 0.1, 90);
camera.position.set(0, CAM.high, 15);

/* Mostly ambient, with a weak sun for shape only: an even wash keeps every
   door the same navy wherever it stands, which is what the flat look needs. */
scene.add(new THREE.HemisphereLight(0xffffff, 0xe8e2d6, 2.3));
const sun = new THREE.DirectionalLight(0xfff6e8, 0.5);
sun.position.set(3, 14, 7);
scene.add(sun);

/* one warm light, moved to whichever door is open */
const portalLight = new THREE.PointLight(WARM, 0, 11, 2);
scene.add(portalLight);

/* ======================================================================
   4. Materials — all Lambert: matte, cheap, and flat enough to stay minimal
   ====================================================================== */
const mat = {
  wall:  new THREE.MeshLambertMaterial({ color: WALL }),
  ceil:  new THREE.MeshBasicMaterial({ color: CEIL }),
  pale:  new THREE.MeshLambertMaterial({ color: CEIL }),
  floor: new THREE.MeshLambertMaterial({ color: FLOOR }),
  grey:  new THREE.MeshLambertMaterial({ color: GREY }),
  navy:  new THREE.MeshLambertMaterial({ color: NAVY }),
  hole:  new THREE.MeshLambertMaterial({ color: 0x1b2236 }),
  body:  new THREE.MeshLambertMaterial({ color: INK }),
};

/* ======================================================================
   5. Canvas-drawn labels
   ====================================================================== */
const UI_FONT = '"Outfit","Segoe UI",system-ui,sans-serif';

function textPlane(label, { px = 104, spacing = 0.16, width = 2.5, height = 0.62 } = {}){
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 256;
  const x = c.getContext('2d');
  x.font = `400 ${px}px ${UI_FONT}`;
  if ('letterSpacing' in x) x.letterSpacing = `${px * spacing}px`;
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  x.fillStyle = '#2b3654';
  const text = label.toUpperCase();
  const room = c.width * 0.9;
  const w = x.measureText(text).width;
  if (w > room) x.scale(room / w, 1);
  x.fillText(text, (c.width / 2) * (w > room ? w / room : 1), c.height / 2);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 2;
  return new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true })
  );
}

function radialTexture(inner, outer){
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const x = c.getContext('2d');
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, inner);
  g.addColorStop(1, outer);
  x.fillStyle = g;
  x.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
const softShadowTex = radialTexture('rgba(60,66,80,.5)', 'rgba(60,66,80,0)');
const warmGlowTex = radialTexture('rgba(255,214,150,.95)', 'rgba(255,214,150,0)');

/* ======================================================================
   6. The hall
   ====================================================================== */
const depth = HALL.zFront - HALL.zBack;
const midZ = (HALL.zFront + HALL.zBack) / 2;
let floorPicker = null;
const pickables = [];
const doorOf = new Map();

function buildHall(){
  const g = new THREE.Group();

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(HALL.hw * 2, depth), mat.floor);
  floor.rotation.x = -Math.PI / 2;
  floor.position.z = midZ;
  g.add(floor);
  floorPicker = floor;                       // the floor is its own click target
  floor.name = 'floor';

  // a single inlaid line down the middle of the floor, for depth and direction
  for (const x of [-1.5, 1.5]){
    const line = new THREE.Mesh(new THREE.PlaneGeometry(0.035, depth - 6), mat.grey);
    line.rotation.x = -Math.PI / 2;
    line.position.set(x, 0.004, midZ - 1);
    g.add(line);
  }

  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(HALL.hw * 2, depth), mat.ceil);
  ceil.rotation.x = Math.PI / 2;
  ceil.position.set(0, HALL.h, midZ);
  g.add(ceil);

  for (const side of [-1, 1]){
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(depth, HALL.h), mat.wall);
    wall.rotation.y = -side * Math.PI / 2;
    wall.position.set(side * HALL.hw, HALL.h / 2, midZ);
    g.add(wall);

    // skirting: one quiet line where the wall meets the floor
    const skirt = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.16, depth), mat.grey);
    skirt.position.set(side * (HALL.hw - 0.03), 0.08, midZ);
    g.add(skirt);

    // shallow pilasters, just enough to carry the perspective
    for (const z of [8.4, -2.4, -12.6]){
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.4, HALL.h, 0.7), mat.pale);
      p.position.set(side * (HALL.hw - 0.2), HALL.h / 2, z);
      g.add(p);
    }
  }

  const back = new THREE.Mesh(new THREE.PlaneGeometry(HALL.hw * 2, HALL.h), mat.wall);
  back.position.set(0, HALL.h / 2, HALL.zBack);
  g.add(back);

  const backSkirt = new THREE.Mesh(new THREE.BoxGeometry(HALL.hw * 2, 0.16, 0.06), mat.grey);
  backSkirt.position.set(0, 0.08, HALL.zBack + 0.03);
  g.add(backSkirt);

  // the wall behind the camera, so the room is closed
  const front = new THREE.Mesh(new THREE.PlaneGeometry(HALL.hw * 2, HALL.h), mat.pale);
  front.rotation.y = Math.PI;
  front.position.set(0, HALL.h / 2, HALL.zFront);
  g.add(front);

  // IBSU on the back wall, and a hairline under it
  const mark = textPlane('IBSU', { px: 160, spacing: 0.3, width: 6.1, height: 1.5 });
  mark.position.set(0, 6.15, HALL.zBack + 0.04);
  g.add(mark);
  const rule = new THREE.Mesh(new THREE.PlaneGeometry(7, 0.022), mat.grey);
  rule.position.set(0, 5.35, HALL.zBack + 0.04);
  g.add(rule);

  return g;
}

/* ======================================================================
   7. A door: opening, hinged leaf, name, threshold shadow
   ====================================================================== */
function buildDoor(d){
  const grp = new THREE.Group();
  if (d.wall === 'back'){
    grp.position.set(d.x, 0, HALL.zBack + 0.02);
    d.stand = new THREE.Vector3(d.x, 0, HALL.zBack + STAND_OFF + 0.4);
  } else {
    const side = d.wall === 'left' ? -1 : 1;
    grp.position.set(side * (HALL.hw - 0.02), 0, d.z);
    grp.rotation.y = -side * Math.PI / 2;        // local +z points into the hall
    d.stand = new THREE.Vector3(side * (HALL.hw - STAND_OFF), 0, d.z);
  }

  const W = DOOR.w, H = DOOR.h, T = 0.14;

  // the opening behind the leaf
  const hole = new THREE.Mesh(new THREE.BoxGeometry(W, H, DOOR.depth), mat.hole);
  hole.position.set(0, H / 2, -DOOR.depth / 2 + 0.02);
  grp.add(hole);

  // warm light spilling out, revealed as the leaf swings
  const spill = new THREE.Mesh(
    new THREE.PlaneGeometry(W * 1.6, H * 1.15),
    new THREE.MeshBasicMaterial({ map: warmGlowTex, transparent: true, opacity: 0, depthWrite: false })
  );
  spill.position.set(0, H / 2, 0.04);
  grp.add(spill);
  d.spill = spill;

  // frame
  const frameMat = mat.grey.clone();
  d.frameMat = frameMat;
  const jambL = new THREE.Mesh(new THREE.BoxGeometry(T, H + T * 2, 0.18), frameMat);
  jambL.position.set(-W / 2 - T / 2, H / 2, 0.07);
  const jambR = jambL.clone();
  jambR.position.x = W / 2 + T / 2;
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(W + T * 2, T, 0.18), frameMat);
  lintel.position.set(0, H + T / 2, 0.07);
  grp.add(jambL, jambR, lintel);

  // the leaf, hinged on its left edge
  const hinge = new THREE.Group();
  hinge.position.set(-W / 2, 0, 0.02);
  grp.add(hinge);
  d.hinge = hinge;

  const leaf = new THREE.Mesh(new THREE.BoxGeometry(W - 0.04, H - 0.04, 0.07), mat.navy);
  leaf.position.set(W / 2 - 0.02, H / 2, 0);
  hinge.add(leaf);

  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.28, 8), mat.grey);
  handle.rotation.x = Math.PI / 2;
  handle.position.set(W - 0.22, H * 0.47, 0.08);
  hinge.add(handle);

  // the name, straight on the wall — no plate, no underline
  const sign = textPlane(d.label, { width: 2.6, height: 0.64 });
  sign.position.set(0, H + 0.62, 0.1);
  grp.add(sign);
  d.signMat = sign.material;

  const tick = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.018), frameMat);
  tick.position.set(0, H + 0.3, 0.1);
  grp.add(tick);

  // a soft shadow on the floor grounds the doorway
  const pool = new THREE.Mesh(
    new THREE.PlaneGeometry(3.1, 3.4),
    new THREE.MeshBasicMaterial({ map: softShadowTex, transparent: true, opacity: 0.4, depthWrite: false })
  );
  pool.rotation.x = -Math.PI / 2;
  pool.position.set(0, 0.008, 1.15);
  grp.add(pool);

  // warm wash on the floor once the door is open
  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(3.6, 4.4),
    new THREE.MeshBasicMaterial({ map: warmGlowTex, transparent: true, opacity: 0, depthWrite: false })
  );
  glow.rotation.x = -Math.PI / 2;
  glow.position.set(0, 0.012, 1.5);
  grp.add(glow);
  d.glow = glow;

  for (const m of [leaf, jambL, jambR, lintel, sign, hole]){
    doorOf.set(m, d);
    pickables.push(m);
  }

  d.group = grp;
  d.open = 0;
  d.openTarget = 0;
  d.hot = 0;
  return grp;
}

/* ======================================================================
   8. The walker — one silhouette, one material
   ====================================================================== */
function buildHero(){
  const g = new THREE.Group();
  const limbs = {};

  /* Built like a signage pictogram, because that is what stays legible at this
     size and from this height: a round head on a short neck, one tapered
     torso, and limbs that keep a visible gap from the body so the silhouette
     reads as a person rather than a lump. */
  const upper = new THREE.Group();
  upper.position.y = 0.86;                     // the hips
  g.add(upper);

  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.172, 0.40, 5, 14), mat.body);
  torso.position.y = 0.33;
  torso.scale.set(1.09, 1, 0.62);              // slim front to back
  upper.add(torso);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.058, 0.1, 10), mat.body);
  neck.position.y = 0.66;
  upper.add(neck);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.138, 20, 14), mat.body);
  head.position.y = 0.79;
  head.scale.set(1, 1.04, 0.96);
  upper.add(head);

  // arms hang clear of the torso and reach the hip, angled out a touch so the
  // gap survives from behind
  for (const s of [-1, 1]){
    const pivot = new THREE.Group();
    // meeting the torso at the shoulder and angling out, so the silhouette
    // stays continuous up top and the hands still clear the hips
    pivot.position.set(s * 0.202, 0.545, 0);
    pivot.rotation.z = -s * 0.11;
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.04, 0.44, 4, 10), mat.body);
    arm.position.y = -0.26;
    pivot.add(arm);
    upper.add(pivot);
    limbs[s < 0 ? 'armL' : 'armR'] = pivot;
  }

  // legs with a gap between them, and a small foot to sit on the floor
  for (const s of [-1, 1]){
    const pivot = new THREE.Group();
    pivot.position.set(s * 0.087, 0.86, 0);
    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.058, 0.66, 4, 10), mat.body);
    leg.position.y = -0.395;
    pivot.add(leg);
    const foot = new THREE.Mesh(new THREE.SphereGeometry(0.066, 10, 8), mat.body);
    foot.position.set(0, -0.775, 0.032);
    foot.scale.set(1, 0.56, 1.55);
    pivot.add(foot);
    g.add(pivot);
    limbs[s < 0 ? 'legL' : 'legR'] = pivot;
  }

  g.userData.limbs = limbs;
  g.userData.upper = upper;
  return g;
}

/* ======================================================================
   9. Assemble
   ====================================================================== */
scene.add(buildHall());
for (const d of DOORS) scene.add(buildDoor(d));

const hero = buildHero();
hero.position.set(0, 0, 8.5);
hero.rotation.y = Math.PI;            // facing away from the camera, down the hall
scene.add(hero);

// his own soft shadow, so he is planted on the floor
const contact = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({ map: softShadowTex, transparent: true, opacity: 0.55, depthWrite: false })
);
contact.rotation.x = -Math.PI / 2;
contact.position.y = 0.01;
scene.add(contact);

// a ring where you clicked, so a walk order always has visible feedback
const marker = new THREE.Mesh(
  new THREE.RingGeometry(0.32, 0.38, 28),
  new THREE.MeshBasicMaterial({ color: NAVY, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide })
);
marker.rotation.x = -Math.PI / 2;
marker.position.y = 0.016;
scene.add(marker);

/* ======================================================================
   10. Input
   ====================================================================== */
const keys = new Set();
const MOVE_KEYS = { ArrowLeft:1, ArrowRight:1, ArrowUp:1, ArrowDown:1, KeyA:1, KeyD:1, KeyW:1, KeyS:1 };
const SPEED = 5;

let target = null;
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
  pad.classList.remove('idle');
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

/* The on-screen arrows are both a control and a legend: pressing a real key
   lights the matching one, which is how you learn the keyboard works. */
const pad = document.getElementById('pad');
const padKeys = new Map();
for (const btn of pad.querySelectorAll('.key')) padKeys.set(btn.dataset.key, btn);

const KEY_ALIAS = { KeyW:'ArrowUp', KeyS:'ArrowDown', KeyA:'ArrowLeft', KeyD:'ArrowRight' };
const padOf = code => padKeys.get(KEY_ALIAS[code] || code);

function startWalk(code){
  if (activeDoor) return;
  keys.add(code);
  padOf(code)?.classList.add('on');
  target = null; queuedDoor = null;
  pad.classList.remove('idle');
  hideHint();
}
function stopWalk(code){
  keys.delete(code);
  padOf(code)?.classList.remove('on');
}

for (const [code, btn] of padKeys){
  btn.addEventListener('pointerdown', e => { e.preventDefault(); btn.setPointerCapture?.(e.pointerId); startWalk(code); });
  for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) btn.addEventListener(ev, () => stopWalk(code));
  btn.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter'){ e.preventDefault(); startWalk(code); } });
  btn.addEventListener('keyup', e => { if (e.key === ' ' || e.key === 'Enter') stopWalk(code); });
}

addEventListener('keydown', e => {
  if (e.code === 'Escape'){ if (activeDoor) closePopup(); return; }
  if (activeDoor) return;
  if (MOVE_KEYS[e.code]){
    startWalk(e.code);
    e.preventDefault();
  } else if (e.code === 'Enter' || e.code === 'Space'){
    if (promptDoor){ enterDoor(promptDoor); e.preventDefault(); }
  }
});
addEventListener('keyup', e => { if (MOVE_KEYS[e.code]) stopWalk(e.code); });
addEventListener('blur', () => { for (const code of [...keys]) stopWalk(code); });

/* ======================================================================
   11. Popup
   ====================================================================== */
const modal = document.getElementById('modal');
const mTitle = document.getElementById('mTitle');
const mBlurb = document.getElementById('mBlurb');
const mGo = document.getElementById('mGo');

function openPopup(d){
  activeDoor = d;
  for (const code of [...keys]) stopWalk(code);   // don't keep walking behind the card
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
   12. Frame loop
   ====================================================================== */
const camPos = new THREE.Vector3(0, CAM.high, 15);
const camAim = new THREE.Vector3(0, CAM.aim, 0);
const tmp = new THREE.Vector3();
const clock = new THREE.Clock();

function update(dt, t){
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
    phase += dt * 9.2 * (speed / SPEED);
  }
  let dy = yaw - hero.rotation.y;
  while (dy > Math.PI) dy -= Math.PI * 2;
  while (dy < -Math.PI) dy += Math.PI * 2;
  hero.rotation.y += dy * Math.min(1, dt * 9);

  const L = hero.userData.limbs;
  const sw = Math.sin(phase) * 0.62 * moving;
  L.legL.rotation.x = sw;
  L.legR.rotation.x = -sw;
  L.armL.rotation.x = -sw * 0.7;
  L.armR.rotation.x = sw * 0.7;
  hero.position.y = Math.abs(Math.sin(phase)) * 0.04 * moving;
  hero.userData.upper.rotation.x = 0.08 * moving;
  hero.userData.upper.rotation.z = Math.sin(phase) * 0.035 * moving;

  contact.position.set(hero.position.x, 0.01, hero.position.z);

  if (target){
    marker.position.set(target.x, 0.016, target.z);
    marker.material.opacity = Math.min(0.5, marker.material.opacity + dt * 3);
    marker.scale.setScalar(1 + Math.sin(t * 5) * 0.1);
  } else if (marker.material.opacity > 0){
    marker.material.opacity = Math.max(0, marker.material.opacity - dt * 2);
    marker.scale.multiplyScalar(1 + dt * 1.6);
  }

  // ---- which door are we at ----
  promptDoor = null;
  let best = 2.6;
  for (const d of DOORS){
    const dist = hero.position.distanceTo(d.stand);
    if (dist < best){ best = dist; promptDoor = d; }
  }

  let anyOpen = false;
  for (const d of DOORS){
    d.open += (d.openTarget - d.open) * Math.min(1, dt * 3.4);
    d.hinge.rotation.y = -d.open * 1.85;
    d.spill.material.opacity = d.open * 0.9;
    d.glow.material.opacity = d.open * 0.55;
    if (d.open > 0.02){
      anyOpen = true;
      d.group.getWorldPosition(tmp);
      portalLight.position.set(tmp.x, DOOR.h / 2, tmp.z);
      portalLight.intensity = d.open * 26;
    }

    const want = (d === hoverDoor || d === promptDoor || d === activeDoor) ? 1 : 0;
    d.hot += (want - d.hot) * Math.min(1, dt * 6);
    d.frameMat.color.setHex(GREY).lerp(NAVY_COLOR, d.hot * 0.85);
    d.signMat.opacity = 0.72 + d.hot * 0.28;
  }
  if (!anyOpen) portalLight.intensity = 0;

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
  camera.lookAt(camAim);
}
const NAVY_COLOR = new THREE.Color(NAVY);

let booted = false;
renderer.setAnimationLoop(() => {
  const dt = Math.min(0.05, clock.getDelta());
  update(dt, clock.elapsedTime);
  renderer.render(scene, camera);
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
  window.__hall = { DOORS, camera, hero, scene, pickables, renderer,
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
