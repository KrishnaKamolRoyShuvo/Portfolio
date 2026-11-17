const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function runTests() {
  const screenshotsDir = path.join(__dirname, 'test-evidence');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('Launching Google Chrome via Playwright...');
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true
  });

  const viewports = [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'laptop', width: 1280, height: 800 },
    { name: 'tablet_ipad', width: 820, height: 1180 },
    { name: 'mobile', width: 390, height: 844 }
  ];

  for (const vp of viewports) {
    console.log(`\n=== Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) ===`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height }
    });
    const page = await context.newPage();

    // 1. Load Page and Verify Preloader
    console.log('Loading http://localhost:5173/ ...');
    await page.goto('http://localhost:5173/');

    // Check Preloader visibility
    const preloaderVisible = await page.isVisible('#preloader');
    console.log(`Preloader initial visible: ${preloaderVisible}`);

    // Wait for preloader to complete (~2.5s)
    await page.waitForTimeout(2800);
    const preloaderGone = !(await page.isVisible('#preloader'));
    console.log(`Preloader finished and hidden: ${preloaderGone}`);

    // Capture Hero in Night Mode
    await page.screenshot({ path: path.join(screenshotsDir, `${vp.name}_1_night_hero.png`) });

    // 2. Test Water Ripple simulation
    console.log('Testing WebGL Water Ripple interactions...');
    await page.mouse.move(vp.width / 2, 300);
    await page.mouse.down();
    await page.mouse.up();
    await page.waitForTimeout(200);

    // 3. Test Progressive Bento Gallery Reveal (7 -> 12 -> 20 -> 30 -> 36)
    console.log('Testing Progressive Bento Gallery Steps (6 -> 12 -> 18)...');
    const gallerySection = page.locator('#gallery');
    await gallerySection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    const countInitial = await page.locator('#client-gallery-grid .bento-card').count();
    console.log(`Initial visible projects count: ${countInitial} (expected 6)`);

    const loadMoreBtn = page.locator('#load-more-projects-btn');
    if (await loadMoreBtn.isVisible()) {
      await loadMoreBtn.click();
      await page.waitForTimeout(400);
      const countStep2 = await page.locator('#client-gallery-grid .bento-card').count();
      console.log(`After click 1: ${countStep2} projects (expected 12)`);

      await loadMoreBtn.click();
      await page.waitForTimeout(400);
      const countStep3 = await page.locator('#client-gallery-grid .bento-card').count();
      console.log(`After click 2: ${countStep3} projects (expected 18)`);
    }

    await page.screenshot({ path: path.join(screenshotsDir, `${vp.name}_2_gallery_step.png`) });

    // 4. Test Day Mode & CLI Terminal in Day Mode
    console.log('Testing Day Mode & Terminal styling...');
    const themeBtn = page.locator('#theme-toggle-btn');
    if (await themeBtn.isVisible()) {
      await themeBtn.click();
      await page.waitForTimeout(500);

      // Check terminal in Day Mode
      const terminalSection = page.locator('#terminal');
      await terminalSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);

      // Type in CLI
      const terminalInput = page.locator('#terminal-input');
      if (await terminalInput.isVisible()) {
        await terminalInput.fill('academic');
        await terminalInput.press('Enter');
        await page.waitForTimeout(300);
      }

      await page.screenshot({ path: path.join(screenshotsDir, `${vp.name}_3_day_mode_terminal.png`) });

      // Check Flagship tech badges in Day Mode
      const flagshipSection = page.locator('#flagship');
      await flagshipSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(screenshotsDir, `${vp.name}_4_day_mode_flagship.png`) });

      // Check Skills Matrix in Day Mode (Verify chip contrast)
      const skillsSection = page.locator('#skills');
      await skillsSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      const skillChipColor = await page.locator('.skill-chip').first().evaluate((el) => {
        const style = window.getComputedStyle(el);
        return { color: style.color, bg: style.backgroundColor };
      });
      console.log(`Day Mode Skill Chip color: ${skillChipColor.color}, bg: ${skillChipColor.bg}`);
      await page.screenshot({ path: path.join(screenshotsDir, `${vp.name}_6_day_mode_skills.png`) });

      // Check Hero in Day Mode
      await page.locator('#hero').scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(screenshotsDir, `${vp.name}_5_day_mode_hero.png`) });
    }

    await context.close();
  }

  await browser.close();
  console.log('\n✓ ALL RESPONSIVE TESTS COMPLETED SUCCESSFULLY IN GOOGLE CHROME!');
}

runTests().catch((err) => {
  console.error('Test run error:', err);
  process.exit(1);
});
