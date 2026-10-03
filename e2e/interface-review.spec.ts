import { expect, test } from '@playwright/test';

for (const mobile of [false, true]) {
  for (const dark of [false, true]) {
    test(`catalog keyboard and layout ${mobile ? 'mobile' : 'desktop'} ${dark ? 'dark' : 'light'}`, async ({ page }) => {
      await page.setViewportSize(mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 });
      await page.addInitScript(value => localStorage.setItem('inmo_theme', value), dark ? 'dark' : 'light');
      await page.goto('/');
      await expect(page.getByRole('heading', { name: 'Catálogo general' })).toBeVisible();
      await expect(page.locator('html')).toHaveClass(dark ? /dark/ : /^(?!.*dark).*$/);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      await page.getByRole('button', { name: 'Abrir filtros', exact: true }).focus();
      await page.keyboard.press('Enter');
      await expect(page.getByRole('combobox', { name: 'Rango de precio' })).toBeVisible();
      await page.getByRole('button', { name: 'Abrir filtros', exact: true }).click();
      await page.screenshot({ path: `docs/evidence/catalog-${mobile ? 'mobile' : 'desktop'}-${dark ? 'dark' : 'light'}.png`, fullPage: true });
    });
  }
}
