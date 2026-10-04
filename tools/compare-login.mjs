import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

// Common, unchanged login regions only. The single real login button is an agreed exception.
// This comparison does not certify the whole application as pixel identical.
const args = Object.fromEntries(process.argv.slice(2).map(arg => arg.replace(/^--/, '').split('=')));
const directory = path.resolve(args.output ?? 'docs/evidence/fidelity');
await fs.mkdir(directory, { recursive: true });
const executablePath = process.env.PLAYWRIGHT_CHROME_EXECUTABLE || (process.platform === 'win32' ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : undefined);
const browser = await chromium.launch({ executablePath, headless: true });
const results = [];
try {
  for (const size of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'tablet', width: 820, height: 1180 }, { name: 'mobile', width: 390, height: 844 }]) for (const dark of [false, true]) {
    const viewport = { width: size.width, height: size.height };
    const context = await browser.newContext({ viewport });
    await context.addInitScript(theme => localStorage.setItem('inmo_theme', theme), dark ? 'dark' : 'light');
    const captures = {};
    for (const [name, base] of [['reference', args.reference ?? 'http://127.0.0.1:5174'], ['integrated', args.integrated ?? 'http://localhost:5173']]) {
      const page = await context.newPage();
      await page.goto(base + '/login', { waitUntil: 'domcontentloaded' });
      await page.getByPlaceholder('Contraseña ...').waitFor();
      await page.waitForFunction(() => getComputedStyle(document.querySelector('form')).maxWidth === '384px');
      await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(img => img.decode().catch(() => {}))); });
      captures[name] = {};
      for (const [part, locator] of [['logo', page.getByRole('img', { name: 'INMO', exact: true }).filter({ visible: true })], ['password', page.getByPlaceholder('Contraseña ...').locator('..')]]) {
        captures[name][part] = { png: (await locator.screenshot({ path: `${directory}/${name}-${part}-${size.name}-${dark ? 'dark' : 'light'}.png`, animations: 'disabled' })).toString('base64'), box: await locator.boundingBox() };
      }
      await page.close();
    }
    const comparer = await context.newPage();
    for (const part of ['logo', 'password']) {
      const stats = await comparer.evaluate(async ([first, second]) => {
        async function decode(data) {
          const image = new Image(); image.src = 'data:image/png;base64,' + data; await image.decode();
          const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
          const context = canvas.getContext('2d'); context.drawImage(image, 0, 0);
          return context.getImageData(0, 0, canvas.width, canvas.height).data;
        }
        const [a, b] = await Promise.all([decode(first), decode(second)]);
        if (a.length !== b.length) throw new Error('Region dimensions differ');
        let changed = 0;
        for (let i = 0; i < a.length; i += 4) if (a[i] !== b[i] || a[i + 1] !== b[i + 1] || a[i + 2] !== b[i + 2] || a[i + 3] !== b[i + 3]) changed++;
        return { pixels: a.length / 4, changed, percent: 100 * changed / (a.length / 4) };
      }, [captures.reference[part].png, captures.integrated[part].png]);
      results.push({ size: size.name, dark, part, reference: captures.reference[part].box, integrated: captures.integrated[part].box, ...stats });
    }
    await context.close();
  }
  await fs.writeFile(`${directory}/login-pixel-comparison.json`, JSON.stringify({ source: '01295bee792791081933a936c51d820f0b6877d3', scope: 'Only the explicitly captured common regions, not the whole application', results }, null, 2) + '\n');
  console.log(JSON.stringify(results));
} finally { await browser.close(); }
