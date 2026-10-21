/**
 * Browser regression audit for the hero renderer and static poster fallbacks.
 * Run the app, then `node scripts/verify-motion.mjs`.
 * AUDIT_URL defaults to http://localhost:3000. AUDIT_LABEL names the artifacts.
 * AUDIT_CASES accepts a regex to rerun selected cases after a failure.
 * CHROME_PATH selects a browser executable; otherwise install Playwright Chromium.
 * AUDIT_SOFTWARE_GL=1 explicitly enables SwiftShader for WebGL behavior checks.
 * The normal capability probe stays unmodified. Subsequent 3D checks may override
 * renderer-name queries and the context caveat flag; reports retain the actual driver.
 * JSON reports and PNG captures go to output/playwright, which is ignored by Git.
 * Software rendering results do not measure physical GPU throughput or frame rate.
 */
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const target = process.env.AUDIT_URL || 'http://localhost:3000';
const label = (process.env.AUDIT_LABEL || 'native-4k-local').replace(/[^a-zA-Z0-9_-]/g, '-');
const selectedCases = process.env.AUDIT_CASES ? new RegExp(process.env.AUDIT_CASES) : null;
const out = fileURLToPath(new URL('../output/playwright/', import.meta.url));
fs.mkdirSync(out, { recursive: true });
const report = { label, selectedCases: process.env.AUDIT_CASES || 'all', started: new Date().toISOString(), cases: [], limitations: [] };
const browsers = [];
let storageState;
let base;
let forceAcceleratedCapability = false;
const softwareRenderer = /swiftshader|llvmpipe|softpipe|software rasterizer|software renderer|microsoft basic render/i;

// Only browser/platform boundaries are instrumented; application code is untouched.
function instrument(options = {}) {
  const probe = window.__motionAudit = {
    draws: 0, frames: 0, glRequests: 0, decodeCalls: 0, decodeRejections: [],
    captureWanted: false, capture: null, renderer: null, context: null, captureQueued: false,
    capabilityOverride: false, reportedRenderer: null, contextAttributes: null,
    requestedContextAttributes: null,
    pendingRaf: 0,
  };
  const parameterReaders = new WeakMap();
  const pendingFrames = new Set();
  const nativeRequestFrame = window.requestAnimationFrame.bind(window);
  const nativeCancelFrame = window.cancelAnimationFrame.bind(window);
  window.requestAnimationFrame = callback => {
    const id = nativeRequestFrame(now => {
      pendingFrames.delete(id);
      probe.pendingRaf = pendingFrames.size;
      callback(now);
    });
    pendingFrames.add(id);
    probe.pendingRaf = pendingFrames.size;
    return id;
  };
  window.cancelAnimationFrame = id => {
    pendingFrames.delete(id);
    probe.pendingRaf = pendingFrames.size;
    nativeCancelFrame(id);
  };
  if (options.saveData) Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true } });
  const nativeDecode = HTMLImageElement.prototype.decode;
  HTMLImageElement.prototype.decode = function (...args) {
    if (this.closest('.hero-artwork')) probe.decodeCalls++;
    return nativeDecode.apply(this, args).catch(error => {
      if (this.closest('.hero-artwork')) probe.decodeRejections.push(error.name);
      throw error;
    });
  };
  const nativeGetContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (kind, ...args) {
    const heroContext = /^webgl/.test(kind) && this.classList.contains('hero-sculpture');
    if (heroContext) {
      probe.glRequests++;
      probe.requestedContextAttributes = args[0] || {};
      if (options.denyWebGL) return null;
    }
    const effectiveArgs = heroContext && options.forceAcceleratedCapability
      ? [{ ...args[0], failIfMajorPerformanceCaveat: false }, ...args.slice(1)]
      : args;
    const context = nativeGetContext.call(this, kind, ...effectiveArgs);
    if (context && heroContext) {
      probe.context = context;
      probe.contextAttributes = effectiveArgs[0] || {};
      const debug = context.getExtension('WEBGL_debug_renderer_info');
      const readParameter = parameterReaders.get(context) || context.getParameter.bind(context);
      parameterReaders.set(context, readParameter);
      probe.renderer = readParameter(debug?.UNMASKED_RENDERER_WEBGL ?? context.RENDERER);
      probe.reportedRenderer = probe.renderer;
      if (options.forceAcceleratedCapability) {
        probe.capabilityOverride = true;
        probe.reportedRenderer = 'Motion audit accelerated capability';
        context.getParameter = parameter => {
          if (parameter === context.RENDERER || parameter === debug?.UNMASKED_RENDERER_WEBGL) return probe.reportedRenderer;
          return readParameter(parameter);
        };
      }
    }
    return context;
  };
  for (const name of ['WebGLRenderingContext', 'WebGL2RenderingContext']) {
    const prototype = window[name]?.prototype;
    if (!prototype) continue;
    for (const method of ['drawArrays', 'drawElements', 'drawArraysInstanced', 'drawElementsInstanced']) {
      if (!Object.prototype.hasOwnProperty.call(prototype, method)) continue;
      const original = prototype[method];
      prototype[method] = function (...args) {
        const result = original.apply(this, args);
        if (!this.canvas.classList.contains('hero-sculpture')) return result;
        probe.draws++;
        if (!probe.captureQueued) {
          probe.captureQueued = true;
          // A microtask runs after the complete synchronous renderer call, before
          // presentation clears a non-preserved WebGL drawing buffer.
          queueMicrotask(() => {
            probe.captureQueued = false;
            probe.frames++;
            if (!probe.captureWanted) return;
            probe.captureWanted = false;
            const thumbnail = document.createElement('canvas');
            thumbnail.width = 320;
            thumbnail.height = Math.round(320 * this.canvas.height / this.canvas.width);
            thumbnail.getContext('2d').drawImage(this.canvas, 0, 0, thumbnail.width, thumbnail.height);
            probe.capture = {
              data: thumbnail.toDataURL('image/png'),
              width: this.canvas.width, height: this.canvas.height,
              progress: Number(document.querySelector('.hero-scroll-track').style.getPropertyValue('--scene-progress')),
              pendingRaf: probe.pendingRaf,
            };
          });
        }
        return result;
      };
    }
  }
}

function cleanError(error) {
  return String(error?.stack || error).replace(/https?:\/\/[^\s"'<>]+/g, value => {
    try { const u = new URL(value); return u.origin + u.pathname; } catch { return '[URL]'; }
  });
}

async function run(name, body) {
  if (selectedCases && !selectedCases.test(name)) return;
  const started = Date.now();
  try {
    const evidence = await body();
    report.cases.push({ name, status: 'passed', elapsedMs: Date.now() - started, ...evidence });
    console.log('PASS ' + name);
  } catch (error) {
    report.cases.push({ name, status: 'failed', elapsedMs: Date.now() - started, error: cleanError(error) });
    console.log('FAIL ' + name + ': ' + cleanError(error).split('\n')[0]);
  }
  fs.writeFileSync(path.join(out, label + '-motion-audit.json'), JSON.stringify(report, null, 2));
}

async function launch(software = false) {
  const args = ['--no-sandbox'];
  if (software) args.push('--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader');
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, headless: true, args });
  browsers.push(browser);
  return browser;
}

async function fresh(browser, options = {}, probeOptions = {}) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2, storageState, ...options });
  await context.addInitScript(instrument, { forceAcceleratedCapability, ...probeOptions });
  const page = await context.newPage();
  const errors = [];
  const requests = { lighting: 0 };
  page.on('request', request => {
    if (new URL(request.url()).pathname === '/signal-environment.bin.gz') requests.lighting++;
  });
  page.on('pageerror', error => errors.push(cleanError(error)));
  return { context, page, errors, requests };
}

async function open(page, destination = base) {
  const response = await page.goto(destination, { waitUntil: 'domcontentloaded', timeout: 45000 });
  assert.equal(response.status(), 200);
  await page.locator('h1').waitFor();
  await page.locator('.hero-artwork img').waitFor();
}

async function ready(page) {
  await page.waitForFunction(() => document.querySelector('.hero-artwork')?.hasAttribute('data-scene-ready'), undefined, { timeout: 20000 });
}

async function settle(page) {
  let last = -1;
  let stable = 0;
  for (let attempt = 0; attempt < 40; attempt++) {
    await page.waitForTimeout(150);
    const current = await page.evaluate(() => ({ draws: window.__motionAudit.draws, pendingRaf: window.__motionAudit.pendingRaf }));
    stable = current.draws === last && current.pendingRaf === 0 ? stable + 1 : 0;
    last = current.draws;
    if (stable >= 3) return current.draws;
  }
  throw new Error('Renderer did not settle within 6 seconds');
}

async function scrollHero(page, progress) {
  const result = await page.evaluate(progress => {
    const track = document.querySelector('.hero-scroll-track');
    const stage = track.firstElementChild;
    const travel = track.offsetHeight - stage.offsetHeight;
    const top = parseFloat(getComputedStyle(stage).top) || 0;
    const y = track.getBoundingClientRect().top + scrollY - top + travel * progress;
    scrollTo({ top: y, behavior: 'instant' });
    return { y: Math.max(0, y), travel };
  }, progress);
  if (!await page.evaluate(() => document.hidden)) {
    await page.waitForFunction(progress => Math.abs(Number(document.querySelector('.hero-scroll-track').style.getPropertyValue('--scene-progress')) - progress) < 0.002, progress, { polling: 100, timeout: 10000 });
  }
  return result;
}

async function bufferCapture(page, name) {
  await settle(page);
  await page.evaluate(() => {
    window.__motionAudit.capture = null;
    window.__motionAudit.captureWanted = true;
    window.dispatchEvent(new Event('resize'));
  });
  await page.waitForFunction(() => window.__motionAudit.capture !== null, undefined, { polling: 100, timeout: 10000 });
  const capture = await page.evaluate(() => window.__motionAudit.capture);
  const png = Buffer.from(capture.data.split(',')[1], 'base64');
  const filename = label + '-' + name + '-buffer.png';
  fs.writeFileSync(path.join(out, filename), png);
  const raw = await sharp(png).ensureAlpha().raw().toBuffer();
  let nonempty = 0;
  for (let index = 3; index < raw.length; index += 4) if (raw[index] > 10) nonempty++;
  assert(nonempty > 100, 'WebGL drawing buffer must contain visible pixels');
  const evidence = { file: filename, width: capture.width, height: capture.height, progress: capture.progress, pendingRaf: capture.pendingRaf, hash: crypto.createHash('sha256').update(png).digest('hex') };
  fs.writeFileSync(path.join(out, label + '-' + name + '-buffer.json'), JSON.stringify(evidence, null, 2));
  assert.equal(capture.pendingRaf, 0, 'Pose capture must follow the final requested animation frame');
  return { raw, evidence };
}

function pixelDifference(left, right) {
  assert.equal(left.length, right.length);
  let total = 0;
  for (let index = 0; index < left.length; index++) total += Math.abs(left[index] - right[index]);
  return total / left.length;
}

async function idle(page, duration = 900) {
  const before = await settle(page);
  await page.waitForTimeout(duration);
  const after = await page.evaluate(() => window.__motionAudit.draws);
  assert.equal(after, before, 'Renderer must not draw while settled');
  return { before, after, duration };
}

async function poster(page) {
  await page.locator('.hero-artwork img').evaluate(image => image.decode());
  const evidence = await page.locator('.hero-artwork').evaluate(art => {
    const image = art.querySelector('img');
    const canvas = art.querySelector('canvas');
    return {
      ready: art.hasAttribute('data-scene-ready'),
      imageComplete: image.complete && image.naturalWidth > 0,
      pictureOpacity: Number(getComputedStyle(art.querySelector('picture')).opacity),
      canvasOpacity: canvas ? Number(getComputedStyle(canvas).opacity) : 0,
      source: new URL(image.currentSrc).searchParams.get('url') || new URL(image.currentSrc).pathname,
    };
  });
  assert.equal(evidence.ready, false);
  assert.equal(evidence.imageComplete, true);
  assert.equal(evidence.pictureOpacity, 1);
  assert.equal(evidence.canvasOpacity, 0);
  assert(await page.locator('h1').isVisible());
  assert(await page.locator('.hero-actions a[href="#work"]').isVisible());
  return evidence;
}

async function capacity(page) {
  const evidence = await page.locator('.hero-sculpture').evaluate(canvas => ({
    width: canvas.width, height: canvas.height,
    cssWidth: canvas.parentElement.clientWidth, cssHeight: canvas.parentElement.clientHeight,
    portrait: innerWidth <= 800, dpr: devicePixelRatio,
    canvasMask: getComputedStyle(canvas).maskImage,
    posterMask: getComputedStyle(canvas.parentElement.querySelector('img')).maskImage,
  }));
  assert(evidence.width * evidence.height <= (evidence.portrait ? 2_000_000 : 4_000_000) + 2, 'Drawing buffer exceeds pixel budget');
  assert(evidence.width <= evidence.cssWidth * 2 + 1 && evidence.height <= evidence.cssHeight * 2 + 1, 'Drawing buffer exceeds DPR 2');
  return evidence;
}

async function fallback(browser, name, options = {}, probeOptions = {}) {
  await run(name, async () => {
    const session = await fresh(browser, options, probeOptions);
    try {
      await open(session.page);
      await session.page.waitForTimeout(1000);
      const evidence = await poster(session.page);
      const draws = await session.page.evaluate(() => window.__motionAudit.draws);
      assert.equal(draws, 0);
      assert.deepEqual(session.errors, []);
      await session.page.screenshot({ path: path.join(out, label + '-' + name + '.png') });
      return { ...evidence, draws };
    } finally { await session.context.close(); }
  });
}

async function main() {
  const normal = await launch();
  const warm = await fresh(normal);
  await open(warm.page, target);
  const location = new URL(warm.page.url());
  base = location.origin + location.pathname;
  report.base = base;
  storageState = await warm.context.storageState();
  await warm.page.locator('.hero-artwork img').evaluate(image => image.decode());
  await warm.page.waitForFunction(() => document.querySelector('.hero-artwork')?.hasAttribute('data-scene-ready') || (window.__motionAudit.glRequests > 0 && (!window.__motionAudit.context || /swiftshader|llvmpipe|softpipe|software rasterizer|software renderer|microsoft basic render/i.test(window.__motionAudit.renderer))), undefined, { timeout: 20000 }).catch(() => {});
  await warm.page.waitForTimeout(350);
  const normalState = await warm.page.evaluate(() => ({ ready: document.querySelector('.hero-artwork').hasAttribute('data-scene-ready'), hasContext: !!window.__motionAudit.context, renderer: window.__motionAudit.renderer, draws: window.__motionAudit.draws, glRequests: window.__motionAudit.glRequests, capabilityOverride: window.__motionAudit.capabilityOverride, contextAttributes: window.__motionAudit.contextAttributes }));
  report.normalCapability = normalState;
  let browser = normal;
  await run('normal-browser-capability', async () => {
    assert.equal(normalState.capabilityOverride, false, 'Normal capability probe must preserve the actual renderer');
    const software = softwareRenderer.test(normalState.renderer || '');
    if (software) assert.equal(normalState.ready, false, 'Known software drivers must retain the poster');
    else if (normalState.hasContext) assert.equal(normalState.ready, true, 'An accelerated context must initialize the scene');
    let fallbackEvidence;
    if (!normalState.ready) {
      fallbackEvidence = await poster(warm.page);
      assert(normalState.glRequests > 0, 'Normal browser did not attempt WebGL; scene readiness may be broken');
      assert.equal(warm.requests.lighting, 0, 'Rejected capability must not download the lighting atlas');
      assert.equal(normalState.draws, 0, 'Rejected capability must not render WebGL frames');
      await scrollHero(warm.page, 0.45);
      await warm.page.waitForTimeout(100);
      const cssMotion = await warm.page.locator('.hero-scroll-track').evaluate(track => ({ progress: Number(track.style.getPropertyValue('--scene-progress')), scale: Number(track.style.getPropertyValue('--art-scale')) }));
      assert(cssMotion.progress > 0.4 && cssMotion.scale > 1, 'Poster fallback must retain native CSS scroll motion');
      await scrollHero(warm.page, 0);
      await idle(warm.page);
      assert.equal(warm.requests.lighting, 0);
      fallbackEvidence.cssMotion = cssMotion;
    }
    assert.deepEqual(warm.errors, []);
    return { ...normalState, lightingRequests: warm.requests.lighting, softwareFallbackVerified: software && !normalState.ready, fallbackEvidence };
  });
  await warm.context.close();
  if (!normalState.ready || process.env.AUDIT_SOFTWARE_GL === '1') {
    browser = await launch(true);
    forceAcceleratedCapability = true;
    report.limitations.push('After the unmodified normal-browser probe, 3D behavior checks explicitly use SwiftShader, request failIfMajorPerformanceCaveat:false, and override only WebGL RENDERER/UNMASKED_RENDERER_WEBGL name queries to pass the accelerated-capability gate. Actual driver names are captured before the override; other WebGL parameters remain unchanged. These results do not measure hardware GPU performance or real-device frame rate.');
  } else if (softwareRenderer.test(normalState.renderer || '')) {
    forceAcceleratedCapability = true;
    report.limitations.push('Subsequent 3D behavior checks request failIfMajorPerformanceCaveat:false and override only renderer-name capability queries on the actual software driver. The unmodified software fallback is tested separately; no hardware GPU performance claim is made.');
  }

  await run('matching-canvas-and-poster-masks', async () => {
    const session = await fresh(browser);
    try {
      await open(session.page);
      const checks = [];
      for (const width of [1440, 390]) {
        await session.page.setViewportSize({ width, height: 1000 });
        await ready(session.page);
        await settle(session.page);
        const evidence = await capacity(session.page);
        assert.equal(evidence.canvasMask, evidence.posterMask, 'Canvas and poster masks should match');
        checks.push({ viewportWidth: width, ...evidence });
      }
      return { checks };
    } finally { await session.context.close(); }
  });

  await run('scene-motion-reversibility-and-idle', async () => {
    const session = await fresh(browser);
    try {
      const { page } = session;
      await open(page); await ready(page);
      const dimensions = await capacity(page);
      const poses = [0, 0.2, 0.45, 0.65, 0.85, 1];
      const forward = [];
      for (const progress of poses) {
        await scrollHero(page, progress);
        forward.push(await bufferCapture(page, 'forward-' + progress));
      }
      const differences = forward.slice(1).map((capture, index) => pixelDifference(capture.raw, forward[index].raw));
      assert(differences.filter(value => value > 0.2).length >= 3, 'At least three scroll transitions must change actual WebGL pixels');
      const reversals = [];
      for (let index = poses.length - 1; index >= 0; index--) {
        await scrollHero(page, poses[index]);
        const reverse = await bufferCapture(page, 'reverse-' + poses[index]);
        const difference = pixelDifference(reverse.raw, forward[index].raw);
        assert(difference < 1, 'The same scroll position must restore the same rendered pose: ' + difference);
        reversals.push({ ...reverse.evidence, difference });
      }
      const rest = await idle(page);
      await scrollHero(page, 0.5); await page.waitForTimeout(60);
      await page.locator('#contact').scrollIntoViewIfNeeded();
      const offscreen = await idle(page);
      await scrollHero(page, 0.4); await ready(page);
      assert((await settle(page)) > offscreen.after, 'Returning onscreen should redraw the current pose');
      assert.deepEqual(session.errors, []);
      return { dimensions, forward: forward.map(capture => capture.evidence), differences, reversals, rest, offscreen, renderer: await page.evaluate(() => window.__motionAudit.renderer) };
    } finally { await session.context.close(); }
  });

  await run('viewport-budgets-and-live-reduced-motion', async () => {
    const session = await fresh(browser);
    try {
      const { page } = session;
      await open(page); await ready(page);
      const sizes = [];
      for (const viewport of [{ width: 1800, height: 1200 }, { width: 390, height: 844 }, { width: 768, height: 1024 }]) {
        await page.setViewportSize(viewport); await ready(page); await settle(page);
        sizes.push({ viewport, ...await capacity(page) });
      }
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.waitForFunction(() => !document.querySelector('.hero-artwork').hasAttribute('data-scene-ready'));
      const reducedPoster = await poster(page);
      const reducedIdle = await idle(page);
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await ready(page);
      await page.setViewportSize({ width: 1440, height: 600 });
      await page.waitForFunction(() => !document.querySelector('.hero-artwork').hasAttribute('data-scene-ready'));
      const compactPoster = await poster(page);
      await page.setViewportSize({ width: 1440, height: 1000 });
      await ready(page);
      assert.deepEqual(session.errors, []);
      return { sizes, reducedPoster, reducedIdle, compactPoster, restored: true };
    } finally { await session.context.close(); }
  });

  await run('document-visibility-suspension', async () => {
    const session = await fresh(browser);
    try {
      const { page } = session;
      await open(page); await ready(page); await scrollHero(page, 0.3); await settle(page);
      const other = await session.context.newPage();
      await other.goto('about:blank'); await other.bringToFront();
      let actualHidden = await page.evaluate(() => document.hidden);
      let method = 'actual background tab';
      if (!actualHidden) {
        method = 'visibility API boundary override (headless tabs stayed visible)';
        await page.evaluate(() => {
          Object.defineProperty(document, 'hidden', { configurable: true, get: () => window.__auditHidden === true });
          Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => window.__auditHidden ? 'hidden' : 'visible' });
          window.__auditHidden = true;
          document.dispatchEvent(new Event('visibilitychange'));
        });
      }
      const before = await page.evaluate(() => window.__motionAudit.draws);
      await scrollHero(page, 0.6); await page.waitForTimeout(700);
      assert.equal(await page.evaluate(() => window.__motionAudit.draws), before, 'Hidden document must not draw');
      await page.bringToFront();
      if (!actualHidden) await page.evaluate(() => { window.__auditHidden = false; document.dispatchEvent(new Event('visibilitychange')); });
      await page.waitForFunction(before => window.__motionAudit.draws > before, before);
      await settle(page);
      assert.deepEqual(session.errors, []);
      return { method, hiddenDraws: before, resumedDraws: await page.evaluate(() => window.__motionAudit.draws) };
    } finally { await session.context.close(); }
  });

  await run('reduced-motion-during-delayed-scene-import', async () => {
    const session = await fresh(browser);
    let release;
    const gate = new Promise(resolve => { release = resolve; });
    let held = false;
    let chunk = null;
    try {
      await session.context.route('**/*.js*', async route => {
        const eligible = !held && await session.page.evaluate(() => window.__motionAudit?.glRequests > 0).catch(() => false);
        if (eligible) {
          held = true;
          chunk = new URL(route.request().url()).pathname;
          await gate;
        }
        await route.continue().catch(() => {});
      });
      await open(session.page);
      for (let index = 0; !held && index < 80; index++) await session.page.waitForTimeout(100);
      assert(held, 'A real lazy scene chunk must be delayed to exercise the stale initialization race');
      await session.page.emulateMedia({ reducedMotion: 'reduce' });
      await session.page.waitForTimeout(80);
      await session.page.emulateMedia({ reducedMotion: 'no-preference' });
      await session.page.waitForTimeout(350);
      release();
      await ready(session.page);
      assert.deepEqual(session.errors, []);
      return { chunk, resumedWithoutExtraScroll: true, draws: await session.page.evaluate(() => window.__motionAudit.draws) };
    } finally { release(); await session.context.close(); }
  });

  await run('responsive-image-decode-cancellation', async () => {
    const session = await fresh(browser);
    let release;
    const gate = new Promise(resolve => { release = resolve; });
    let held = false;
    try {
      await session.context.route('**/*', async route => {
        if (!held && route.request().resourceType() === 'image' && decodeURIComponent(route.request().url()).includes('signal-sculpture-4k.webp')) {
          held = true;
          await gate;
        }
        await route.continue().catch(() => {});
      });
      await open(session.page);
      await session.page.waitForFunction(() => window.__motionAudit.decodeCalls > 0);
      assert(held, 'Desktop poster request must be in flight during decode');
      await session.page.setViewportSize({ width: 390, height: 844 });
      await session.page.waitForFunction(() => window.__motionAudit.decodeRejections.length > 0, undefined, { timeout: 10000 });
      release();
      await ready(session.page);
      const evidence = await session.page.evaluate(() => ({ rejections: window.__motionAudit.decodeRejections, draws: window.__motionAudit.draws, source: new URL(document.querySelector('.hero-artwork img').currentSrc).searchParams.get('url') }));
      assert.match(evidence.source, /signal-sculpture-mobile-4k/);
      assert.deepEqual(session.errors, []);
      return evidence;
    } finally { release(); await session.context.close(); }
  });

  await run('real-webgl-context-loss-fallback', async () => {
    const session = await fresh(browser);
    try {
      await open(session.page); await ready(session.page);
      await session.page.evaluate(() => {
        const extension = window.__motionAudit.context.getExtension('WEBGL_lose_context');
        if (!extension) throw new Error('WEBGL_lose_context unavailable');
        extension.loseContext();
      });
      await session.page.waitForFunction(() => !document.querySelector('.hero-artwork').hasAttribute('data-scene-ready'));
      const evidence = await poster(session.page);
      const rest = await idle(session.page);
      await scrollHero(session.page, 0.2); await session.page.waitForTimeout(300);
      assert.equal(await session.page.evaluate(() => window.__motionAudit.draws), rest.after);
      assert.deepEqual(session.errors, []);
      return { ...evidence, rest };
    } finally { await session.context.close(); }
  });

  for (const [name, status, body] of [
    ['failed-lighting-fetch-poster', 503, 'Studio lighting unavailable'],
    ['corrupt-lighting-gzip-poster', 200, 'This is not a gzip stream'],
  ]) {
    await run(name, async () => {
      const session = await fresh(browser);
      let requests = 0;
      const consoleErrors = [];
      try {
        session.page.on('console', message => {
          if (message.type() !== 'error') return;
          const text = message.text();
          if (status === 503 && /^Failed to load resource: the server responded with a status of 503\b/.test(text)) return;
          consoleErrors.push(cleanError(text));
        });
        await session.context.route('**/signal-environment.bin.gz*', async route => {
          requests++;
          await route.fulfill({ status, contentType: 'application/octet-stream', headers: { 'cache-control': 'no-store' }, body });
        });
        const responseReceived = session.page.waitForResponse(response => new URL(response.url()).pathname === '/signal-environment.bin.gz');
        await open(session.page);
        assert.equal((await responseReceived).status(), status);
        await session.page.waitForTimeout(350);
        await poster(session.page);
        for (const progress of [0.2, 0.45, 0]) {
          await scrollHero(session.page, progress);
          await session.page.waitForTimeout(90);
        }
        await session.page.setViewportSize({ width: 1400, height: 1000 });
        await session.page.emulateMedia({ reducedMotion: 'reduce' });
        await session.page.waitForTimeout(80);
        await session.page.emulateMedia({ reducedMotion: 'no-preference' });
        await session.page.waitForTimeout(900);
        const evidence = await poster(session.page);
        const draws = await session.page.evaluate(() => window.__motionAudit.draws);
        assert.equal(draws, 0, 'Invalid lighting must never expose a rendered scene');
        assert.equal(requests, 1, 'Failed lighting must not retry after scroll, resize, or motion preference changes');
        assert.deepEqual(session.errors, []);
        assert.deepEqual(consoleErrors, []);
        return { ...evidence, responseStatus: status, requests, draws, applicationErrors: session.errors, consoleErrors };
      } finally { await session.context.close(); }
    });
  }

  await fallback(browser, 'webgl-denied-poster', {}, { denyWebGL: true });
  await fallback(browser, 'save-data-poster', {}, { saveData: true });
  await fallback(browser, 'initial-reduced-motion-poster', { reducedMotion: 'reduce' });
  await fallback(browser, 'compact-viewport-poster', { viewport: { width: 1440, height: 600 } });

  await run('javascript-disabled-poster-and-content', async () => {
    const context = await browser.newContext({ storageState, javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    try {
      const page = await context.newPage(); await open(page);
      const evidence = await poster(page);
      for (const id of ['work', 'oss', 'builds', 'about', 'experience', 'contact']) assert(await page.locator('#' + id + ' h2').isVisible(), id + ' remains available');
      await page.screenshot({ path: path.join(out, label + '-no-js.png') });
      return evidence;
    } finally { await context.close(); }
  });

  await run('work-images-cover-through-scroll', async () => {
    const session = await fresh(browser, {}, { denyWebGL: true });
    try {
      const { page } = session;
      await open(page);
      const checks = [];
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        for (const id of ['streaming-analytics', 'aws-data-platform']) {
          const media = page.locator('.work-story-' + id + ' .work-story-media');
          for (const progress of [0.1, 0.5, 0.9, 0.99]) {
            await media.evaluate((element, progress) => {
              const box = element.getBoundingClientRect();
              scrollTo({ top: scrollY + box.top - (innerHeight - progress * (innerHeight + box.height)), behavior: 'instant' });
            }, progress);
            await page.waitForTimeout(90);
            await media.locator('img').evaluate(image => image.decode());
            const evidence = await media.evaluate(element => {
              const box = element.getBoundingClientRect();
              const image = element.querySelector('img').getBoundingClientRect();
              return { top: box.top - image.top, bottom: image.bottom - box.bottom, left: box.left - image.left, right: image.right - box.right, scale: element.style.getPropertyValue('--work-image-scale'), shift: element.style.getPropertyValue('--work-image-shift') };
            });
            for (const edge of ['top', 'bottom', 'left', 'right']) assert(evidence[edge] >= -0.15, id + ' at ' + width + ' p=' + progress + ' exposes ' + edge + ': ' + evidence[edge]);
            checks.push({ width, id, progress, ...evidence });
          }
          await page.emulateMedia({ reducedMotion: 'reduce' });
          await page.waitForFunction(selector => {
            const element = document.querySelector(selector);
            return matchMedia('(prefers-reduced-motion: reduce)').matches && element.style.getPropertyValue('--work-image-scale') === '1' && element.style.getPropertyValue('--work-image-shift') === '0px';
          }, '.work-story-' + id + ' .work-story-media', { polling: 100, timeout: 10000 });
          assert.equal(await media.evaluate(element => element.style.getPropertyValue('--work-image-scale')), '1');
          assert.equal(await media.evaluate(element => element.style.getPropertyValue('--work-image-shift')), '0px');
          await page.emulateMedia({ reducedMotion: 'no-preference' });
        }
      }
      assert.deepEqual(session.errors, []);
      return { checks };
    } finally { await session.context.close(); }
  });

  report.finished = new Date().toISOString();
  report.passed = report.cases.length > 0 && report.cases.every(result => result.status === 'passed');
  fs.writeFileSync(path.join(out, label + '-motion-audit.json'), JSON.stringify(report, null, 2));
  if (!report.passed) process.exitCode = 1;
  console.log(JSON.stringify({ label, passed: report.passed, cases: report.cases.map(({ name, status }) => ({ name, status })), limitations: report.limitations }, null, 2));
}

main().catch(error => {
  report.fatal = cleanError(error);
  fs.writeFileSync(path.join(out, label + '-motion-audit.json'), JSON.stringify(report, null, 2));
  console.error(report.fatal);
  process.exitCode = 1;
}).finally(async () => { await Promise.allSettled(browsers.map(browser => browser.close())); });
