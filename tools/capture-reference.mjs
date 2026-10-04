import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

// Run against a separate, unmodified checkout of 01295be without private environment variables.
const args = Object.fromEntries(process.argv.slice(2).map(arg => arg.replace(/^--/, '').split('=')));
const directory = path.resolve(args.output ?? 'docs/evidence/fidelity/reference');
await fs.mkdir(directory, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROME_EXECUTABLE || (process.platform === 'win32' ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : undefined) });
const captures = [];
try {
  for (const size of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'tablet', width: 820, height: 1180 }, { name: 'mobile', width: 390, height: 844 }]) for (const dark of [false, true]) {
    for (const [role, routes] of [['public', ['/', '/map', '/favorites', '/messages', '/profile', '/asesores/1']], ['asesor', ['/asesor', '/asesor/propiedades', '/asesor/mensajes', '/asesor/profile', '/asesor/profile?view=documents', '/asesor/profile?view=plan']], ['admin', ['/admin', '/admin/asesores', '/admin/moderacion', '/admin/profile']]]) {
      const context = await browser.newContext({ viewport: { width: size.width, height: size.height }, colorScheme: dark ? 'dark' : 'light' });
      await context.addInitScript(({ role, dark }) => { localStorage.setItem('inmo_role', role); localStorage.setItem('inmo_theme', dark ? 'dark' : 'light'); }, { role, dark });
      const page = await context.newPage();
      for (const route of routes) {
        await page.goto((args.reference ?? 'http://127.0.0.1:5174') + route, { waitUntil: 'domcontentloaded' });
        await (route === '/map' ? page.locator('button') : page.getByRole('heading')).filter({ visible: true }).first().waitFor();
        // The reference alone simulates loading with timers; wait for its settled comparison layout.
        await page.waitForTimeout(1700);
        await page.evaluate(async () => { await document.fonts.ready; });
        const file = `${role}-${size.name}-${dark ? 'dark' : 'light'}-${route.replace(/[^a-z0-9]/gi, '_')}.png`;
        await page.screenshot({ path: path.join(directory, file), fullPage: true, animations: 'disabled' });
        captures.push({ role, size: size.name, dark, route, file });
      }
      await context.close();
    }
  }
  await fs.writeFile(path.join(directory, 'manifest.json'), JSON.stringify({ source: '01295bee792791081933a936c51d820f0b6877d3', scope: 'Reference captures for review; not a whole-application pixel certification', captures }, null, 2) + '\n');
  console.log(`${captures.length} reference captures`);
} finally { await browser.close(); }
