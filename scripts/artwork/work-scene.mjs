import * as THREE from 'three';

export const studioStyle = {
  colorSpace: THREE.SRGBColorSpace,
  toneMapping: THREE.ACESFilmicToneMapping,
  exposure: 1.15,
  silver: 0x92949a,
  cobalt: 0x0071e3,
};

function createStudio(renderer, lightBackground) {
  const studio = new THREE.Scene();
  studio.background = new THREE.Color(lightBackground ? 0.16 : 0.004, lightBackground ? 0.16 : 0.004, lightBackground ? 0.17 : 0.006);
  const objects = [];
  const panel = (position, width, height, intensity, color = [1, 1, 1]) => {
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({color: new THREE.Color(...color).multiplyScalar(intensity), side: THREE.DoubleSide});
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.lookAt(0, 0, 0);
    studio.add(mesh);
    objects.push(geometry, material);
  };
  panel([-4, 6, 4], 8, 1.7, 5.5);
  panel([-4, 6, -5], 9, 3.5, lightBackground ? 3.4 : 4.0);
  panel([4, 2, 3], 2, 7, 0.8);
  panel([0, -5, 2], 7, 1, 0.5);
  panel([-6, 0, -1], 2, 6, 0.35, [0.66, 0.76, 1]);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(studio, 0.08, 0.1, 100);
  pmrem.dispose();
  objects.forEach(item => item.dispose());
  return environment;
}

function flowPoint(u, v, lane, lift = 0) {
  const smooth = t => t * t * (3 - 2 * t);
  const convergence = smooth(Math.max(0, Math.min(1, (u - 0.12) / 0.58)));
  const separation = 1.48 * (1 - convergence) + 0.042;
  const twist = -0.18 - 0.65 * Math.sin(u * Math.PI);
  const baseY = 0.15 + 0.34 * Math.sin(u * Math.PI * 1.4) - 0.56 * smooth(Math.max(0, Math.min(1, (u - 0.25) / 0.43)));
  const baseZ = -0.3 + 0.5 * Math.sin(u * Math.PI * 0.9);
  const crown = 0.12 * Math.cos(v * Math.PI / 1.8);
  const normal = lane * separation + crown + lift;
  return new THREE.Vector3(-6.5 + 13 * u, baseY + v * Math.sin(twist) + normal * Math.cos(twist), baseZ + v * Math.cos(twist) - normal * Math.sin(twist));
}

function flowSurface(lane) {
  const along = 540;
  const across = 56;
  const positions = [];
  const uv = [];
  const indices = [];
  for (let i = 0; i <= along; i++) {
    for (let j = 0; j <= across; j++) {
      const point = flowPoint(-0.25 + (i / along) * 1.5, (j / across - 0.5) * 1.8, lane);
      positions.push(point.x, point.y, point.z);
      uv.push(i / along, j / across);
      if (i < along && j < across) {
        const a = i * (across + 1) + j;
        const b = a + across + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function flowLine(lane, v, start = 0, end = 1, radius = 0.002) {
  const points = [];
  const segments = Math.max(24, Math.round((end - start) * 360));
  for (let i = 0; i <= segments; i++) points.push(flowPoint(start + (end - start) * i / segments, v, lane, 0.004));
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), segments, radius, 5, false);
}

function addStreaming(scene, materials, geometries, accent) {
  const sculpture = new THREE.Group();
  const silver = new THREE.MeshStandardMaterial({color: studioStyle.silver, metalness: 0.98, roughness: 0.37, side: THREE.DoubleSide, envMapIntensity: 1.1});
  const edge = new THREE.MeshStandardMaterial({color: 0xb3b7bf, metalness: 1, roughness: 0.25, envMapIntensity: 0.9});
  const groove = new THREE.MeshBasicMaterial({color: 0x101116, transparent: true, opacity: 0.18});
  const cobalt = new THREE.MeshStandardMaterial({color: accent, metalness: 0.5, roughness: 0.3, emissive: accent, emissiveIntensity: 0.2});
  materials.push(silver, edge, groove, cobalt);
  for (let lane = -1; lane <= 1; lane++) {
    const geometry = flowSurface(lane);
    sculpture.add(new THREE.Mesh(geometry, silver));
    geometries.push(geometry);
    for (let line = 0; line <= 16; line++) {
      const v = (line / 16 - 0.5) * 1.795;
      const boundary = line === 0 || line === 16;
      const lineGeometry = flowLine(lane, v, -0.25, 1.25, boundary ? 0.004 : 0.0013);
      sculpture.add(new THREE.Mesh(lineGeometry, boundary ? edge : groove));
      geometries.push(lineGeometry);
    }
  }
  for (const [lane, v, start, end] of [[1, -0.48, 0.35, 0.385], [0, 0.08, 0.19, 0.225], [1, 0.54, 0.7, 0.735]]) {
    const geometry = flowLine(lane, v, start, end, 0.009);
    sculpture.add(new THREE.Mesh(geometry, cobalt));
    geometries.push(geometry);
  }
  sculpture.rotation.set(-0.1, -0.13, -0.1);
  scene.add(sculpture);
}

const surfaceHeight = (x, z, layer) => Math.sin(x * 0.85 + layer * 0.18) * (0.18 + layer * 0.025) + Math.cos(z * 1.3 + x * 0.2) * 0.13;

function strataSurface(width, depth, layer, elevation) {
  const nx = 180;
  const nz = 84;
  const positions = [];
  const indices = [];
  const radius = 0.15;
  for (let iz = 0; iz <= nz; iz++) {
    const z = (iz / nz - 0.5) * depth;
    const corner = Math.max(0, Math.abs(z) - (depth / 2 - radius));
    const xLimit = width / 2 - radius + Math.sqrt(Math.max(0, radius * radius - corner * corner));
    for (let ix = 0; ix <= nx; ix++) {
      const x = (ix / nx - 0.5) * 2 * xLimit;
      positions.push(x, elevation + surfaceHeight(x, z, layer), z);
      if (iz < nz && ix < nx) {
        const a = iz * (nx + 1) + ix;
        const b = a + nx + 1;
        indices.push(a, a + 1, b, b, a + 1, b + 1);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function addStrata(scene, materials, geometries, accent) {
  const sculpture = new THREE.Group();
  const silver = new THREE.MeshStandardMaterial({color: 0xb7b9be, metalness: 0.86, roughness: 0.34, envMapIntensity: 1.05, side: THREE.DoubleSide});
  const graphite = new THREE.MeshStandardMaterial({color: 0x999da4, metalness: 0.88, roughness: 0.3});
  const cobalt = new THREE.MeshStandardMaterial({color: accent, metalness: 0.65, roughness: 0.33, emissive: accent, emissiveIntensity: 0.1});
  materials.push(silver, graphite, cobalt);
  const width = 5.7;
  const depth = 2.65;
  for (let layer = 0; layer < 3; layer++) {
    const elevation = (layer - 1) * 0.83;
    const geometry = strataSurface(width, depth, layer, elevation);
    const plane = new THREE.Mesh(geometry, silver);
    sculpture.add(plane);
    geometries.push(geometry);
    for (let row = 0; row < 25; row++) {
      const z = (row / 24 - 0.5) * (depth - 0.08);
      const points = [];
      for (let step = 0; step <= 64; step++) {
        const x = (step / 64 - 0.5) * (width - 0.27);
        points.push(new THREE.Vector3(x, elevation + surfaceHeight(x, z, layer) + 0.0035, z));
      }
      const path = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 160, row === 7 && layer === 2 ? 0.006 : 0.0018, 4, false);
      sculpture.add(new THREE.Mesh(path, row === 7 && layer === 2 ? cobalt : graphite));
      geometries.push(path);
    }
  }
  for (const [x, upperLayer] of [[-1.65, 2], [0.1, 1], [1.75, 2]]) {
    const lowerLayer = upperLayer - 1;
    const z = depth / 2 + 0.002;
    const upperY = (upperLayer - 1) * 0.83 + surfaceHeight(x, z, upperLayer);
    const lowerY = (lowerLayer - 1) * 0.83 + surfaceHeight(x, z, lowerLayer);
    const points = [];
    for (let i = 0; i <= 24; i++) {
      const t = i / 24;
      points.push(new THREE.Vector3(x, upperY + (lowerY - upperY) * t, z + Math.sin(t * Math.PI) * 0.07));
    }
    const geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 32, 0.006, 6, false);
    sculpture.add(new THREE.Mesh(geometry, cobalt));
    geometries.push(geometry);
    const markerGeometry = new THREE.SphereGeometry(0.017, 12, 8);
    for (const point of [points[0], points.at(-1)]) {
      const marker = new THREE.Mesh(markerGeometry, cobalt);
      marker.position.copy(point);
      sculpture.add(marker);
    }
    geometries.push(markerGeometry);
  }
  scene.add(sculpture);
  const floorGeometry = new THREE.PlaneGeometry(200, 200);
  const floorMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, toneMapped: false});
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.57;
  scene.add(floor);
  materials.push(floorMaterial);
  geometries.push(floorGeometry);
  const shadowGeometry = new THREE.PlaneGeometry(9, 5.5);
  const shadowMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    vertexShader: 'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader: 'varying vec2 vUv; void main(){vec2 p=(vUv-.5)*2.; float a=exp(-dot(p,p)*5.)*.13;gl_FragColor=vec4(0.,0.,0.,a);}',
  });
  const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, -1.56, 0);
  scene.add(shadow);
  materials.push(shadowMaterial);
  geometries.push(shadowGeometry);
}

export function createWorkScene(canvas, {kind = 'streaming', width = 1600, height = 900, pixelRatio = 1, colors = {}} = {}) {
  const light = kind === 'strata';
  const renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: false, preserveDrawingBuffer: true});
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(width, height, false);
  renderer.outputColorSpace = studioStyle.colorSpace;
  renderer.toneMapping = studioStyle.toneMapping;
  renderer.toneMappingExposure = studioStyle.exposure;
  renderer.shadowMap.enabled = false;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(light ? 0xffffff : 0x000000);
  const environment = createStudio(renderer, light);
  scene.environment = environment.texture;
  const materials = [];
  const geometries = [];
  const key = new THREE.DirectionalLight(0xffffff, 0.7);
  key.position.set(-3, 6, 5);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xaabbff, 0.18);
  fill.position.set(3, -3, 2);
  scene.add(fill);
  const frustum = light ? 6.4 : 6.6;
  const aspect = width / height;
  const camera = new THREE.OrthographicCamera(-frustum * aspect / 2, frustum * aspect / 2, frustum / 2, -frustum / 2, 0.1, 100);
  camera.position.set(...(light ? [7.6, 5.2, 8.4] : [2.3, 3.8, 9.5]));
  camera.lookAt(0, light ? -0.12 : 0.12, 0);
  const accent = colors.accent || studioStyle.cobalt;
  if (light) addStrata(scene, materials, geometries, accent);
  else addStreaming(scene, materials, geometries, accent);
  renderer.render(scene, camera);
  return {
    render: () => renderer.render(scene, camera),
    inspect: () => ({kind, nativeWidth: canvas.width, nativeHeight: canvas.height, triangles: renderer.info.render.triangles, drawCalls: renderer.info.render.calls, threeRevision: THREE.REVISION, upscaled: false}),
    dispose() {geometries.forEach(item => item.dispose()); materials.forEach(item => item.dispose()); environment.dispose(); renderer.dispose();},
  };
}
