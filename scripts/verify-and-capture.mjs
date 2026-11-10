import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = '/Users/sathwik/.gemini/antigravity/scratch/marina-bay-sands-cinematic/screenshots';
const ARTIFACT_DIR = '/Users/sathwik/.gemini/antigravity/brain/a7b702ca-f63c-49f2-bf32-0842d2dc2333';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function run() {
  console.log('🚀 Launching Chrome for architectural reconstruction verification...');

  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--use-gl=angle',
      '--use-angle=metal',
      '--enable-webgl',
      '--enable-features=Vulkan,DefaultANGLEVulkan,Metal',
      '--window-size=1920,1080'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });

  const consoleLogs = [];
  const errors = [];

  page.on('console', msg => {
    const text = msg.text();
    consoleLogs.push({ type: msg.type(), text });
    if (msg.type() === 'error') {
      errors.push(text);
      console.error('Browser Error:', text);
    }
  });

  page.on('pageerror', err => {
    errors.push(err.toString());
    console.error('Page Exception:', err);
  });

  console.log('Navigating to http://localhost:3000/...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });

  // Wait for application hook to be ready
  await page.waitForFunction(() => window.__MBS_APP__ !== undefined, { timeout: 10000 });
  console.log('✅ Marina Bay Sands 3D Engine initialized successfully!');

  // Wait 1.5 seconds for initial render stabilization
  await new Promise(r => setTimeout(r, 1500));

  const initialMetrics = await page.evaluate(() => {
    const app = window.__MBS_APP__;
    return app.getMetrics();
  });
  console.log('📊 Initial Engine Metrics:', initialMetrics);

  const shotMilestones = [
    { id: 1, name: 'shot1_waterfront_approach', time: 5.0, label: 'Shot 1: Waterfront Approach (t=5.0s)' },
    { id: 2, name: 'shot2_tower_ascent', time: 17.0, label: 'Shot 2: Tower Ascent (t=17.0s)' },
    { id: 3, name: 'shot3_skypark_flyover', time: 29.0, label: 'Shot 3: SkyPark Flyover (t=29.0s)' },
    { id: 4, name: 'shot4_architectural_orbit', time: 41.0, label: 'Shot 4: Architectural Orbit (t=41.0s)' },
    { id: 5, name: 'shot5_panoramic_pullback', time: 54.0, label: 'Shot 5: Panoramic Pullback (t=54.0s)' },
    { id: 6, name: 'shot5_hero_tableau', time: 59.5, label: 'Shot 5: Final Masterplan Hero Tableau (t=59.5s)' }
  ];

  for (const shot of shotMilestones) {
    console.log(`🎬 Capturing ${shot.label}...`);
    await page.evaluate((targetTime) => {
      const app = window.__MBS_APP__;
      app.timeline.pause();
      app.timeline.seek(targetTime);
      app.sceneManager.update(targetTime, 0.016);
      app.sceneManager.render();
    }, shot.time);

    await new Promise(r => setTimeout(r, 400));

    const shotPath = path.join(SCREENSHOT_DIR, `${shot.name}.png`);
    await page.screenshot({ path: shotPath });
    
    // Also copy to artifacts dir for embedding
    const artifactPath = path.join(ARTIFACT_DIR, `${shot.name}.png`);
    fs.copyFileSync(shotPath, artifactPath);
    console.log(`Saved screenshot: ${shotPath}`);
  }

  // Test Zoom Interaction
  console.log('🔍 Testing Non-destructive Zoom Interaction...');
  await page.evaluate(() => {
    const app = window.__MBS_APP__;
    app.timeline.seek(34.0);
    app.cameraRig.targetZoomFactor = 1.9;
    app.sceneManager.update(34.0, 0.016);
    app.sceneManager.render();
  });
  await new Promise(r => setTimeout(r, 500));

  const zoomShotPath = path.join(SCREENSHOT_DIR, 'shot3_zoom_cantilever_detail.png');
  await page.screenshot({ path: zoomShotPath });
  fs.copyFileSync(zoomShotPath, path.join(ARTIFACT_DIR, 'shot3_zoom_cantilever_detail.png'));
  console.log(`Saved zoom test screenshot: ${zoomShotPath}`);

  // Reset Zoom & Playback
  await page.evaluate(() => {
    const app = window.__MBS_APP__;
    app.cameraRig.resetZoom();
    app.timeline.play();
  });

  await new Promise(r => setTimeout(r, 2000));

  const playbackMetrics = await page.evaluate(() => {
    const app = window.__MBS_APP__;
    return app.getMetrics();
  });

  console.log('📈 Active Playback Performance Metrics:', playbackMetrics);

  const report = {
    timestamp: new Date().toISOString(),
    status: errors.length === 0 ? 'PASSED' : 'FAILED',
    initialMetrics,
    playbackMetrics,
    capturedShots: shotMilestones.map(s => `${s.name}.png`),
    errors
  };

  fs.writeFileSync(
    path.join(SCREENSHOT_DIR, 'verification_report.json'),
    JSON.stringify(report, null, 2)
  );

  console.log('✅ Verification script completed cleanly!');
  await browser.close();
}

run().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
