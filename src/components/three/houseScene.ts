import * as THREE from "three";

/**
 * A procedural two-storey house, drawn like an architect's model in the brand colours,
 * that builds itself as `update(progress)` goes from 0 to 1:
 *   0.0–0.2 slab · 0.2–0.4 frame · 0.4–0.6 roof · 0.6–0.8 lock-up · 0.8–1.0 garden and lights at dusk.
 * Framework-free: the React component owns scroll and calls update / render / resize.
 */
export interface HouseScene {
  update(progress: number): void;
  render(): void;
  resize(width: number, height: number, layout: "wide" | "narrow"): void;
  dispose(): void;
}

const TINY = 0.001;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const grow = (v: number) => Math.max(v, TINY);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const backOut = (t: number, s = 1.7) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);

export function createHouseScene(canvas: HTMLCanvasElement): HouseScene {
  // preserveDrawingBuffer keeps the last frame for screenshots and link previews.
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance", preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  // Daytime matches the light site; dusk falls to navy when the lights come on.
  const skyDay = new THREE.Color("#ece8e0");
  const skyNight = new THREE.Color("#0c1626");
  const groundDay = new THREE.Color("#e3ddd2"), groundNight = new THREE.Color("#18233a");
  const streetDay = new THREE.Color("#cbc3b5"), streetNight = new THREE.Color("#0e1728");
  const sky = skyDay.clone();
  scene.background = sky;
  scene.fog = new THREE.Fog(sky.clone(), 60, 130);
  const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 400);
  // Pull the camera back on narrower screens so the whole house stays in frame.
  let distance = 1;
  let last = 0;

  const hemi = new THREE.HemisphereLight(0xf2f4f7, 0xb9ad98, 1.7);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff0d8, 3.6);
  sun.position.set(-16, 28, 18);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -24, right: 24, top: 24, bottom: -24, near: 1, far: 90 });
  sun.shadow.bias = -0.0015;
  sun.shadow.normalBias = 0.04;
  scene.add(sun);
  const inner = [new THREE.PointLight(0xffa24a, 0, 16, 2), new THREE.PointLight(0xffa24a, 0, 16, 2)];
  inner[0].position.set(0, 1.8, 2.5);
  inner[1].position.set(0, 4.9, 1);
  inner.forEach((l) => scene.add(l));

  const mat = (color: string, o: THREE.MeshStandardMaterialParameters = {}) =>
    new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, ...o });
  const M = {
    ground: mat("#e3ddd2", { roughness: 1 }),
    street: mat("#cbc3b5", { roughness: 1 }),
    path: mat("#9aa1ab"),
    concrete: mat("#bfc4cc"),
    timber: mat("#c9a06a", { roughness: 0.7 }),
    joist: mat("#8e6b42"),
    clad: mat("#e8ebef", { roughness: 0.6 }),
    dark: mat("#27303f", { roughness: 0.55 }),
    roof: mat("#222a38", { roughness: 0.5, metalness: 0.2 }),
    fascia: mat("#ac8654", { roughness: 0.4, metalness: 0.5 }),
    door: mat("#6b4f35", { roughness: 0.5 }),
    glass: mat("#1a2638", { roughness: 0.12, metalness: 0.4, emissive: new THREE.Color("#ff9a3c"), emissiveIntensity: 0 }),
    rail: new THREE.MeshStandardMaterial({ color: "#9fb3c8", roughness: 0.1, metalness: 0.2, transparent: true, opacity: 0.35 }),
    leaf: mat("#35523f", { roughness: 0.9 }),
    trunk: mat("#4a3a2a"),
    lamp: mat("#2a2a2a", { emissive: new THREE.Color("#ffb85c"), emissiveIntensity: 0 }),
  };

  // A box whose origin sits at its base, so scale.y grows it up from the ground.
  const boxB = (w: number, h: number, d: number, m: THREE.Material, x: number, y: number, z: number, parent: THREE.Object3D = scene) => {
    const g = new THREE.BoxGeometry(w, h, d);
    g.translate(0, h / 2, 0);
    const mesh = new THREE.Mesh(g, m);
    mesh.position.set(x, y, z);
    mesh.castShadow = mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };

  // Site: ground, street, a faint blueprint grid and the block boundary (16 x 30 m)
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(260, 260), M.ground);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
  const street = new THREE.Mesh(new THREE.PlaneGeometry(260, 9), M.street);
  street.rotation.x = -Math.PI / 2;
  street.position.set(0, 0.01, 18.5);
  street.receiveShadow = true;
  scene.add(street);
  const grid = new THREE.GridHelper(80, 80, 0xac8654, 0xac8654);
  const gridMat = grid.material as THREE.LineBasicMaterial;
  gridMat.transparent = true;
  gridMat.opacity = 0.2;
  grid.position.y = 0.02;
  scene.add(grid);
  const loop = (pts: [number, number][], color: number, opacity: number) => {
    const g = new THREE.BufferGeometry().setFromPoints(pts.map(([x, z]) => new THREE.Vector3(x, 0.05, z)));
    const line = new THREE.LineLoop(g, new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
    scene.add(line);
    return line;
  };
  loop([[-8, -16], [8, -16], [8, 14], [-8, 14]], 0xac8654, 0.9);
  const setout = loop([[-5.3, -6.3], [5.3, -6.3], [5.3, 6.3], [-5.3, 6.3]], 0x19283f, 0);
  const setoutMat = setout.material as THREE.LineBasicMaterial;

  // 01 Slab
  const slab = boxB(10.6, 0.3, 12.6, M.concrete, 0, 0, 0);

  // 02 Frame: studs every 0.6 m round both floors, the upper floor platform between them
  const perimeter = (x0: number, x1: number, z0: number, z1: number, step: number) => {
    const p: [number, number][] = [];
    for (let x = x0; x < x1; x += step) p.push([x, z1]);
    for (let z = z1; z > z0; z -= step) p.push([x1, z]);
    for (let x = x1; x > x0; x -= step) p.push([x, z0]);
    for (let z = z0; z < z1; z += step) p.push([x0, z]);
    return p;
  };
  const lower = perimeter(-5, 5, -6, 6, 0.6).map(([x, z]) => boxB(0.09, 2.95, 0.09, M.timber, x, 0.3, z));
  const upper = perimeter(-5, 5, -6, 4, 0.6).map(([x, z]) => boxB(0.09, 2.8, 0.09, M.timber, x, 3.53, z));
  const platform = boxB(10.2, 0.28, 12.2, M.joist, 0, 3.25, 0);

  // 03 Roof: a skillion roof that drops into place, with a gold fascia
  const roof = new THREE.Group();
  scene.add(roof);
  boxB(11.2, 0.22, 11.2, M.roof, 0, 0, 0, roof);
  boxB(11.25, 0.12, 0.12, M.fascia, 0, 0.05, 5.6, roof);
  const ROOF_Y = 6.33;
  roof.position.set(0, ROOF_Y, -1);
  roof.rotation.x = 0.045;

  // 04 Lock-up: white cladding below, dark cladding above, gold-edged glass and a timber door
  const walls = [
    boxB(10.24, 2.95, 0.12, M.clad, 0, 0.3, 6.06), boxB(0.12, 2.95, 12.24, M.clad, 5.06, 0.3, 0),
    boxB(10.24, 2.95, 0.12, M.clad, 0, 0.3, -6.06), boxB(0.12, 2.95, 12.24, M.clad, -5.06, 0.3, 0),
    boxB(0.12, 2.8, 10.24, M.dark, 5.06, 3.53, -1), boxB(10.24, 2.8, 0.12, M.dark, 0, 3.53, -6.06),
    boxB(0.12, 2.8, 10.24, M.dark, -5.06, 3.53, -1),
    boxB(0.4, 2.8, 0.14, M.dark, -4.86, 3.53, 4.06), boxB(0.4, 2.8, 0.14, M.dark, 4.86, 3.53, 4.06),
  ];
  const edgeMat = new THREE.LineBasicMaterial({ color: 0xd4b283 });
  const openings: THREE.Mesh[] = [];
  const pane = (w: number, h: number, x: number, y: number, z: number, rotY = 0, m: THREE.Material = M.glass) => {
    const g = boxB(w, h, 0.08, m, x, y, z);
    g.rotation.y = rotY;
    g.add(new THREE.LineSegments(new THREE.EdgesGeometry(g.geometry), edgeMat));
    openings.push(g);
  };
  pane(9.3, 2.5, 0, 3.66, 4.1);
  pane(2.6, 1.7, -2.9, 1.2, 6.14);
  pane(1.15, 2.35, 1.3, 0.3, 6.14, 0, M.door);
  pane(1.4, 1.7, 3.6, 1.2, 6.14);
  pane(2.2, 1.4, 5.14, 1.4, -2, Math.PI / 2);
  pane(1.6, 1.3, 5.14, 4.4, 0.5, Math.PI / 2);
  pane(2.4, 1.3, -5.14, 4.4, -1.5, Math.PI / 2);
  const rail = boxB(10.1, 1.0, 0.05, M.rail, 0, 3.53, 6.0);

  // 05 Welcome home: garden, a path to the street, lamps, and the lights come on
  const trees = ([[-6.8, 9, 1.3], [6.6, 11, 1.0], [-6.5, -10, 1.5], [6.8, -12, 1.2], [-7, 2, 0.8]] as const).map(([x, z, s]) => {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12 * s, 0.16 * s, 1.6 * s, 8), M.trunk);
    trunk.position.y = 0.8 * s;
    trunk.castShadow = true;
    const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(1.2 * s, 1), M.leaf);
    crown.position.y = 2.2 * s;
    crown.castShadow = true;
    g.add(trunk, crown);
    scene.add(g);
    return g;
  });
  const path = boxB(1.4, 0.05, 7.8, M.path, 1.3, 0, 10.1);
  const lamps = [8, 10.6, 13.2].map((z) => boxB(0.14, 0.55, 0.14, M.lamp, 2.35, 0, z));

  function update(p: number) {
    last = p;
    const s = [0, 1, 2, 3, 4].map((i) => seg(p, i * 0.2, i * 0.2 + 0.2));

    setoutMat.opacity = 0.9 * seg(s[0], 0, 0.25) * (1 - seg(s[1], 0, 0.3));
    slab.scale.y = grow(easeOut(seg(s[0], 0.25, 0.9)));

    lower.forEach((m, i) => { const a = (i / lower.length) * 0.35; m.scale.y = grow(easeOut(seg(s[1], a, a + 0.12))); });
    platform.scale.set(1, grow(easeOut(seg(s[1], 0.42, 0.58))), grow(easeOut(seg(s[1], 0.38, 0.58))));
    upper.forEach((m, i) => { const a = 0.56 + (i / upper.length) * 0.3; m.scale.y = grow(easeOut(seg(s[1], a, a + 0.12))); });

    const r = backOut(seg(s[2], 0.1, 0.75));
    roof.visible = s[2] > 0.1;
    roof.position.y = ROOF_Y + (1 - r) * 9;

    walls.forEach((w, i) => { const a = (i / walls.length) * 0.45; w.scale.y = grow(easeOut(seg(s[3], a, a + 0.3))); });
    openings.forEach((g, i) => { const a = 0.45 + (i / openings.length) * 0.35; const v = grow(backOut(seg(s[3], a, a + 0.18))); g.scale.set(v, v, 1); });
    rail.scale.x = grow(easeOut(seg(s[3], 0.85, 1)));

    const h = s[4];
    trees.forEach((t, i) => t.scale.setScalar(grow(backOut(seg(h, 0.04 + i * 0.07, 0.34 + i * 0.07)))));
    path.scale.z = grow(easeOut(seg(h, 0, 0.3)));
    lamps.forEach((l, i) => { l.scale.y = grow(easeOut(seg(h, 0.15 + i * 0.06, 0.35 + i * 0.06))); });

    // Dusk: sun and sky fade, windows and lamps glow warm amber
    const lit = easeInOut(seg(h, 0.35, 0.9));
    M.glass.emissiveIntensity = lit * 1.3;
    M.lamp.emissiveIntensity = lit * 2.2;
    inner.forEach((l) => { l.intensity = lit * 40; });
    sun.intensity = 3.6 - lit * 3.0;
    hemi.intensity = 1.7 - lit * 1.05;
    sky.copy(skyDay).lerp(skyNight, lit);
    M.ground.color.copy(groundDay).lerp(groundNight, lit);
    M.street.color.copy(streetDay).lerp(streetNight, lit);
    (scene.fog as THREE.Fog).color.copy(sky);
    gridMat.opacity = 0.2 * (1 - seg(p, 0.6, 0.95));

    // Camera sweeps from a high three-quarter view down towards the street
    const c = easeInOut(p), th = -0.9 + c * 1.35, R = (40 - c * 9) * distance;
    cam.position.set(Math.sin(th) * R, (22 - c * 14.5) * distance, Math.cos(th) * R);
    cam.lookAt(0, 2.4 + c * 1.6, 0);
  }

  function resize(width: number, height: number, layout: "wide" | "narrow") {
    renderer.setSize(width, height, false);
    cam.aspect = width / height;
    distance = Math.max(1, (layout === "wide" ? 1.75 : 1.25) / cam.aspect);
    // Fog scales with the camera so a pulled-back view isn't washed out.
    const fog = scene.fog as THREE.Fog;
    fog.near = 60 * distance;
    fog.far = 130 * distance;
    // Keep the house clear of the text: pushed right on wide screens, up on phones.
    if (layout === "wide") cam.setViewOffset(width, height, -width * 0.17 * Math.min(1, cam.aspect / 1.6), 0, width, height);
    else cam.setViewOffset(width, height, 0, height * 0.2, width, height);
    cam.updateProjectionMatrix();
    update(last);
  }

  function dispose() {
    scene.traverse((o) => {
      if (o instanceof THREE.Mesh || o instanceof THREE.LineSegments || o instanceof THREE.LineLoop) o.geometry.dispose();
    });
    Object.values(M).forEach((m) => m.dispose());
    edgeMat.dispose();
    renderer.dispose();
  }

  update(0);
  return { update, render: () => renderer.render(scene, cam), resize, dispose };
}
