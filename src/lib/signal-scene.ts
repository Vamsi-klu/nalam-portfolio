import * as THREE from "three";

export type SignalSceneOptions = {
  width: number;
  height: number;
  pixelRatio?: number;
  portrait?: boolean;
  context?: WebGL2RenderingContext;
  preserveDrawingBuffer?: boolean;
  colors: { paper: string; ink: string; accent: string };
};

export type SignalScene = {
  render: (progress: number) => void;
  resize: (width: number, height: number, pixelRatio: number, portrait: boolean) => void;
  dispose: () => void;
};

const SEGMENTS = 360;
const CROSS_SEGMENTS = 8;
const LAYERS = 22;
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => value * value * (3 - 2 * value);

function createStudioEnvironment(
  renderer: THREE.WebGLRenderer,
  paper: THREE.Color,
  ink: THREE.Color,
  accent: THREE.Color,
) {
  const studio = new THREE.Scene();
  studio.background = ink.clone().lerp(paper, 0.004);
  const resources: (THREE.BufferGeometry | THREE.Material)[] = [];
  const panel = (
    position: [number, number, number],
    width: number,
    height: number,
    intensity: number,
    tint = paper,
  ) => {
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({
      color: tint.clone().multiplyScalar(intensity),
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.lookAt(0, 0, 0);
    studio.add(mesh);
    resources.push(geometry, material);
  };

  panel([-4, 6, 4], 7, 0.8, 7.5);
  panel([4, 2, 3], 2, 7, 0.8);
  panel([0, -5, 2], 7, 1, 0.5);
  panel([-6, 0, -1], 2, 6, 0.35, paper.clone().lerp(accent, 0.16));
  panel([-4, 6, -5], 9, 3.5, 4);

  const generator = new THREE.PMREMGenerator(renderer);
  try {
    return generator.fromScene(studio, 0.08, 0.1, 100);
  } finally {
    generator.dispose();
    resources.forEach((resource) => resource.dispose());
  }
}

function makeRibbonGeometry(index: number) {
  const totalWidth = 1.95;
  const spacing = totalWidth / LAYERS;
  const center = (index - (LAYERS - 1) / 2) * spacing;
  const width = spacing * 0.95;
  const points: number[] = [];
  const indices: number[] = [];

  for (let segment = 0; segment < SEGMENTS; segment++) {
    const angle = (segment / SEGMENTS) * Math.PI * 2;
    const centerline = new THREE.Vector3(
      2.2 * Math.cos(angle) + 0.24 * Math.cos(2 * angle),
      1.3 * Math.sin(angle),
      0.42 * Math.sin(angle) + 0.28 * Math.sin(2 * angle),
    );
    const tangent = new THREE.Vector3(
      -2.2 * Math.sin(angle) - 0.48 * Math.sin(2 * angle),
      1.3 * Math.cos(angle),
      0.42 * Math.cos(angle) + 0.56 * Math.cos(2 * angle),
    ).normalize();
    const radial = new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0);
    const binormal = new THREE.Vector3().crossVectors(tangent, radial).normalize();
    const twist = 0.35 + 1.05 * Math.sin(angle + 0.6);
    const widthDirection = radial
      .multiplyScalar(Math.cos(twist))
      .add(binormal.multiplyScalar(Math.sin(twist)))
      .normalize();
    const normal = new THREE.Vector3().crossVectors(tangent, widthDirection).normalize();

    for (let cross = 0; cross <= CROSS_SEGMENTS; cross++) {
      const offset =
        (center + (cross / CROSS_SEGMENTS - 0.5) * width) *
        (0.78 + 0.22 * Math.cos(angle));
      const crown =
        0.04 * Math.cos((offset * Math.PI) / totalWidth) +
        0.001 * Math.sin((cross / CROSS_SEGMENTS) * Math.PI);
      const point = centerline
        .clone()
        .addScaledVector(widthDirection, offset)
        .addScaledVector(normal, crown);
      points.push(point.x, point.y, point.z);

      if (cross < CROSS_SEGMENTS) {
        const current = segment * (CROSS_SEGMENTS + 1) + cross;
        // Wrapping indices shares normals at the seam instead of leaving a visible cut.
        const next = ((segment + 1) % SEGMENTS) * (CROSS_SEGMENTS + 1) + cross;
        indices.push(current, next, current + 1, next, next + 1, current + 1);
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function makeEdgeGeometry(geometry: THREE.BufferGeometry) {
  const positions = geometry.getAttribute("position");
  const normals = geometry.getAttribute("normal");
  const points: THREE.Vector3[] = [];
  for (let index = 0; index < positions.count; index += CROSS_SEGMENTS + 1) {
    points.push(
      new THREE.Vector3()
        .fromBufferAttribute(positions, index)
        .addScaledVector(new THREE.Vector3().fromBufferAttribute(normals, index), 0.005),
    );
  }
  const curve = new THREE.CatmullRomCurve3(points, true, "centripetal");
  return new THREE.TubeGeometry(curve, SEGMENTS, 0.0025, 4, true);
}

export function createSignalScene(
  canvas: HTMLCanvasElement,
  {
    width,
    height,
    pixelRatio = 1,
    portrait = false,
    context,
    preserveDrawingBuffer = false,
    colors,
  }: SignalSceneOptions,
): SignalScene {
  const paper = new THREE.Color(colors.paper);
  const ink = new THREE.Color(colors.ink);
  const accent = new THREE.Color(colors.accent);
  const renderer = new THREE.WebGLRenderer({
    canvas,
    context,
    antialias: true,
    alpha: false,
    preserveDrawingBuffer,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(ink, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
  const sculpture = new THREE.Group();
  scene.add(sculpture);
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const bands: THREE.Group[] = [];
  let environment: THREE.WebGLRenderTarget | undefined;
  let isPortrait = portrait;
  let currentProgress = 0;
  let disposed = false;

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    environment?.dispose();
    scene.clear();
    renderer.dispose();
  };

  try {
    environment = createStudioEnvironment(renderer, paper, ink, accent);
    scene.environment = environment.texture;
    scene.environmentIntensity = 1.08;
    const silver = new THREE.MeshStandardMaterial({
      color: paper.clone().multiplyScalar(0.4),
      roughness: 0.32,
      metalness: 0.96,
      side: THREE.DoubleSide,
      envMapIntensity: 1.05,
    });
    const edge = new THREE.MeshStandardMaterial({
      color: paper.clone().multiplyScalar(0.15),
      roughness: 0.65,
      metalness: 0.85,
      envMapIntensity: 0.25,
    });
    const blue = new THREE.MeshStandardMaterial({
      color: accent,
      roughness: 0.33,
      metalness: 0.65,
      emissive: accent,
      emissiveIntensity: 0.16,
    });
    materials.push(silver, edge, blue);

    for (let index = 0; index < LAYERS; index++) {
      const group = new THREE.Group();
      const geometry = makeRibbonGeometry(index);
      geometries.push(geometry);
      const edgeGeometry = makeEdgeGeometry(geometry);
      geometries.push(edgeGeometry);
      group.add(
        new THREE.Mesh(geometry, silver),
        new THREE.Mesh(edgeGeometry, index === 5 || index === 15 ? blue : edge),
      );
      sculpture.add(group);
      bands.push(group);
    }

    const key = new THREE.DirectionalLight(paper, 0.7);
    key.position.set(-3, 5, 5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(paper.clone().lerp(accent, 0.2), 0.18);
    fill.position.set(3, -3, 2);
    scene.add(fill);

    const render = (progress: number) => {
      if (disposed) return;
      currentProgress = clamp(progress);
      const orbit = smooth(clamp(currentProgress / 0.7));
      const opening = smooth(clamp((currentProgress - 0.1) / 0.55));
      sculpture.rotation.set(
        0.2 + orbit * 0.2,
        -0.3 + orbit * 1.05,
        (isPortrait ? -0.94 : -0.32) + orbit * 0.08,
      );
      sculpture.scale.set(isPortrait ? 1 : 1.12, 1, 1);
      sculpture.position.set(0, -0.03 + orbit * 0.02, 0);
      bands.forEach((band, index) => {
        const offset = index - (LAYERS - 1) / 2;
        band.position.z = offset * 0.035 * opening;
        band.position.y = offset * 0.012 * opening;
      });
      camera.position.set(0, 0.8, (isPortrait ? 12 : 8.8) - orbit * 0.55);
      camera.lookAt(0, 0.1, 0);
      renderer.render(scene, camera);
    };

    const resize = (
      nextWidth: number,
      nextHeight: number,
      nextPixelRatio: number,
      nextPortrait: boolean,
    ) => {
      if (disposed) return;
      isPortrait = nextPortrait;
      renderer.setPixelRatio(Math.min(nextPixelRatio, 2));
      renderer.setSize(nextWidth, nextHeight, false);
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      render(currentProgress);
    };

    resize(width, height, pixelRatio, portrait);
    return { render, resize, dispose };
  } catch (error) {
    dispose();
    throw error;
  }
}
