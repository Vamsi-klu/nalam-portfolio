import { createHash } from "node:crypto";
import { existsSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync, gunzipSync } from "node:zlib";
import { chromium } from "playwright";
import sharp from "sharp";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const preview = process.argv.includes("--preview");
const environmentOnly = process.argv.includes("--environment-only");
const evidence = resolve(root, "output/artwork-4k");
const output = preview ? evidence : resolve(root, "public");
mkdirSync(evidence, { recursive: true });
const styles = readFileSync(resolve(root, "src/app/globals.css"), "utf8");
const token = (name) => {
  const value = styles.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1];
  if (!value) throw new Error(`Missing color token: ${name}`);
  return value.trim();
};
const colors = { paper: token("on-dark"), ink: token("black"), accent: token("accent-light") };
let bakedBinary;
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Portfolio artwork renderer</title>
<style>html,body{margin:0;overflow:hidden}canvas{display:block;width:100vw;height:100vh}</style>
<script type="importmap">{"imports":{"three":"/vendor/three.module.js"}}</script></head><body><canvas></canvas>
<script type="module">
const params=new URLSearchParams(location.search);
const kind=params.get('kind');
const options={width:innerWidth,height:innerHeight,pixelRatio:1,portrait:kind==='mobile',colors:${JSON.stringify(colors)},preserveDrawingBuffer:true};
if(params.has('baked')) options.environment=await fetch('/signal-environment.bin').then(response=>response.arrayBuffer());
if(kind==='hero'||kind==='mobile'){
  const {createSignalScene}=await import('/signal-scene.js');
  if(params.has('capture')) options.onEnvironmentBake=buffer=>{
    const bytes=new Uint8Array(buffer),chunks=[];
    for(let offset=0;offset<bytes.length;offset+=32768) chunks.push(String.fromCharCode(...bytes.subarray(offset,offset+32768)));
    window.environmentBase64=btoa(chunks.join(''));
  };
  window.artwork=createSignalScene(document.querySelector('canvas'),options);
  window.useBakedEnvironment=async()=>{
    window.artwork.dispose();
    delete options.onEnvironmentBake;
    options.environment=await fetch('/signal-environment.bin').then(response=>response.arrayBuffer());
    window.artwork=createSignalScene(document.querySelector('canvas'),options);
  };
}else{
  const {createWorkScene}=await import('/work-scene.mjs');
  window.artwork=createWorkScene(document.querySelector('canvas'),{...options,kind});
}
window.artwork.render(0);window.artworkReady=true;
</script></body></html>`;

const server = createServer((request, response) => {
  const pathname = new URL(request.url, "http://localhost").pathname;
  if (pathname === "/") {
    response.setHeader("Content-Type", "text/html");
    response.end(html);
    return;
  }
  if (pathname === "/signal-environment.bin" && bakedBinary) {
    response.setHeader("Content-Type", "application/octet-stream");
    response.end(bakedBinary);
    return;
  }
  const routes = {
    "/signal-scene.js": "src/lib/signal-scene.ts",
    "/work-scene.mjs": "scripts/artwork/work-scene.mjs",
    "/vendor/three.module.js": "node_modules/three/build/three.module.js",
    "/vendor/three.core.js": "node_modules/three/build/three.core.js",
  };
  const file = routes[pathname];
  if (!file || !existsSync(resolve(root, file))) {
    response.writeHead(404);
    response.end();
    return;
  }
  let source = readFileSync(resolve(root, file), "utf8");
  if (file.endsWith(".ts")) {
    source = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
  }
  response.setHeader("Content-Type", "text/javascript");
  response.end(source);
});

let browser;
try {
  await new Promise((done) => server.listen(0, "127.0.0.1", done));
  browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || undefined,
    headless: true,
    args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"],
  });
  const origin = `http://127.0.0.1:${server.address().port}`;
  const bakePage = await browser.newPage({ viewport: { width: 640, height: 360 }, deviceScaleFactor: 1 });
  await bakePage.goto(`${origin}/?kind=hero&capture`);
  await bakePage.waitForFunction(() => window.artworkReady);
  bakedBinary = Buffer.from(await bakePage.evaluate(() => window.environmentBase64), "base64");
  await bakePage.close();
  const compressedEnvironment = gzipSync(bakedBinary, { level: 9 });
  if (!gunzipSync(compressedEnvironment).equals(bakedBinary)) throw new Error("Environment compression verification failed");
  const environmentFile = "signal-environment.bin.gz";
  const comparisons = [];
  for (const target of [
    { kind: "hero", width: 640, height: 360 },
    { kind: "mobile", width: 390, height: 488 },
  ]) {
    const page = await browser.newPage({ viewport: { width: target.width, height: target.height }, deviceScaleFactor: 1 });
    await page.goto(`${origin}/?kind=${target.kind}`);
    await page.waitForFunction(() => window.artworkReady);
    const capture = async (progress) => Buffer.from(await page.evaluate((value) => {
      window.artwork.render(value);
      return document.querySelector("canvas").toDataURL("image/png").split(",")[1];
    }, progress), "base64");
    const reference = [];
    for (const progress of [0, 0.35, 0.6]) reference.push(await capture(progress));
    await page.evaluate(() => window.useBakedEnvironment());
    for (const [index, progress] of [0, 0.35, 0.6].entries()) {
      const actual = await capture(progress);
      const [before, after] = await Promise.all([
        sharp(reference[index]).ensureAlpha().raw().toBuffer(),
        sharp(actual).ensureAlpha().raw().toBuffer(),
      ]);
      const identical = before.equals(after);
      writeFileSync(resolve(evidence, `environment-${target.kind}-${progress}-procedural.png`), reference[index]);
      writeFileSync(resolve(evidence, `environment-${target.kind}-${progress}-baked.png`), actual);
      comparisons.push({ ...target, progress, identical });
      if (!identical) throw new Error(`Baked environment changed rendered pixels: ${target.kind} at ${progress}`);
    }
    await page.close();
  }
  writeFileSync(resolve(output, environmentFile), compressedEnvironment);
  const environmentManifest = {
    filename: environmentFile,
    width: bakedBinary.readUInt32LE(8),
    height: bakedBinary.readUInt32LE(12),
    header: "SIGE, uint32le version=1, uint32le width, uint32le height (16 bytes)",
    payload: "Little-endian RGBA half-float, bottom-to-top GPU readback",
    mapping: "CubeUVReflectionMapping",
    colorSpace: "LinearSRGBColorSpace",
    minFilter: "LinearFilter",
    magFilter: "LinearFilter",
    flipY: false,
    generateMipmaps: false,
    bytes: compressedEnvironment.length,
    decodedBytes: bakedBinary.length,
    sha256: createHash("sha256").update(compressedEnvironment).digest("hex"),
    decodedSha256: createHash("sha256").update(bakedBinary).digest("hex"),
    colors,
    source: "Exact PMREM studio atlas from src/lib/signal-scene.ts",
    comparisons,
  };
  writeFileSync(resolve(evidence, "environment-manifest.json"), JSON.stringify(environmentManifest, null, 2));
  console.log(JSON.stringify(environmentManifest, null, 2));
  const renders = [
    { kind: "hero", file: "signal-sculpture-4k", width: 3840, height: 2160 },
    { kind: "mobile", file: "signal-sculpture-mobile-4k", width: 3072, height: 3840 },
    { kind: "streaming", file: "event-stream-4k", width: 3840, height: 2160 },
    { kind: "strata", file: "warehouse-strata-4k", width: 3840, height: 2160 },
  ];
  const manifest = [];
  for (const target of environmentOnly ? [] : renders) {
    const width = preview ? Math.round(target.width / 2.4) : target.width;
    const height = preview ? Math.round(target.height / 2.4) : target.height;
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${origin}/?kind=${target.kind}${target.kind === "hero" || target.kind === "mobile" ? "&baked" : ""}`);
    await page.waitForFunction(() => window.artworkReady);
    const data = await page.evaluate(() => {
      window.artwork.render(0);
      const canvas = document.querySelector("canvas");
      return { width: canvas.width, height: canvas.height, png: canvas.toDataURL("image/png").split(",")[1] };
    });
    if (errors.length || data.width !== width || data.height !== height) {
      throw new Error(`Native render failed for ${target.file}: ${JSON.stringify({ errors, width: data.width, height: data.height })}`);
    }
    const png = Buffer.from(data.png, "base64");
    writeFileSync(resolve(evidence, `${target.file}.png`), png);
    const webp = await sharp(png).webp({ lossless: true, effort: 6 }).toBuffer();
    const filename = `${target.file}.webp`;
    writeFileSync(resolve(output, filename), webp);
    const [original, encoded] = await Promise.all([sharp(png).ensureAlpha().raw().toBuffer(), sharp(webp).ensureAlpha().raw().toBuffer()]);
    if (!original.equals(encoded)) throw new Error(`Lossless verification failed: ${filename}`);
    manifest.push({ filename, width, height, bytes: webp.length, sha256: createHash("sha256").update(webp).digest("hex"), source: "Original procedural geometry rendered at native dimensions", resized: false, lossless: true });
    await page.close();
  }
  if (!environmentOnly) {
    writeFileSync(resolve(evidence, preview ? "preview-manifest.json" : "manifest.json"), JSON.stringify(manifest, null, 2));
    console.log(JSON.stringify(manifest, null, 2));
  }
} finally {
  await browser?.close();
  await new Promise((done) => server.close(done));
}
