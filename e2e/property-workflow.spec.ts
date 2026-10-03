import { expect, test } from '@playwright/test';

const api = 'http://127.0.0.1:8000/api/v1';

test.afterEach(async ({ request }) => {
  const login = await request.post(`${api}/sesiones`, { data: { correo: 'phase4-advisor@example.com', password: 'Secure1!' } });
  const { access_token } = await login.json() as { access_token: string };
  const headers = { Authorization: `Bearer ${access_token}` };
  const result = await request.get(`${api}/me/propiedades?limit=100`, { headers });
  const { items } = await result.json() as { items: Array<{id:string;titulo:string;estado_publicacion:string;version:number}> };
  for (const item of items.filter(item => item.titulo.startsWith('Casa navegador') && item.estado_publicacion !== 'ARCHIVADA')) {
    const archived = await request.post(`${api}/me/propiedades/${item.id}/publicacion`, { headers: { ...headers, 'If-Match': `"v${item.version}"` }, data: { accion: 'ARCHIVAR' } });
    expect(archived.status()).toBe(200);
  }
});

test('real inventory saves, uploads and publishes with the refreshed resource version', async ({ page, request }) => {
  // Only the external object transport is bridged to the test server's memory provider.
  // Authorization, hashes, confirmation, versions and publication use the real API/MySQL.
  await page.route('https://objects.test/**', async route => {
    const outgoing = route.request();
    expect(outgoing.headers().authorization).toBeUndefined();
    const path = new URL(outgoing.url()).pathname.replace(/^\/(upload|read)\//, '');
    const response = outgoing.method() === 'PUT'
      ? await request.put(`http://127.0.0.1:8000/__e2e/storage/${path}`, {
        data: outgoing.postDataBuffer()!, headers: { 'Content-Type': outgoing.headers()['content-type'] },
      })
      : await request.get(`http://127.0.0.1:8000/__e2e/storage/${path}`);
    await route.fulfill({ response });
  });
  await page.goto('/login');
  await page.getByPlaceholder('Correo electrónico').fill('phase4-advisor@example.com');
  await page.getByPlaceholder('Contraseña ...').fill('Secure1!');
  await page.getByRole('button', { name: 'Iniciar sesión', exact: true }).click();
  await page.getByRole('link', { name: 'Gestionar inventario' }).click();
  await page.getByRole('button', { name: 'Nueva propiedad', exact: true }).click();
  await page.getByRole('combobox', { name: 'Tipo de propiedad' }).selectOption({ label: 'Casa' });
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  const title = `Casa navegador ${Date.now()}`;
  await page.getByLabel('Título', { exact: true }).fill(title);
  await page.getByLabel('Precio MXN', { exact: true }).fill('1750000');
  await page.getByLabel('Calle y número (privado)').fill('Calle de prueba 123');
  await page.getByLabel('Código postal', { exact: true }).fill('37000');
  await page.getByRole('combobox', { name: 'Zona de catálogo' }).selectOption({ label: 'León (zona general)' });
  await page.getByLabel('Latitud privada').fill('21.14');
  await page.getByLabel('Longitud privada').fill('-101.67');
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await page.getByLabel('Habitaciones', { exact: true }).fill('2');
  await page.getByLabel('Baños', { exact: true }).fill('1.5');
  await page.getByLabel('Terreno m²').fill('120');
  await page.getByLabel('Construcción m²').fill('90');
  await page.getByLabel('Descripción', { exact: true }).fill('Propiedad sintética para revisar el recorrido real de creación, edición, fotografías y publicación.');
  const created = page.waitForResponse(response => response.url() === `${api}/propiedades` && response.request().method() === 'POST');
  await page.getByRole('button', { name: 'Crear borrador', exact: true }).click();
  const creation = await created;
  expect(creation.status()).toBe(201);
  const property = await creation.json() as { id: string; version: number };
  await page.getByRole('button', { name: 'Editar', exact: true }).click();
  await page.getByLabel('Título', { exact: true }).fill(title + ' editada');
  const saved = page.waitForResponse(response => response.url() === `${api}/me/propiedades/${property.id}` && response.request().method() === 'PATCH');
  await page.getByRole('button', { name: 'Guardar cambios', exact: true }).click();
  const saving = await saved;
  expect(saving.status()).toBe(200);
  expect(saving.request().headers()['if-match']).toBe(`"v${property.version}"`);
  const edited = await saving.json() as { version: number };
  const refreshed = page.waitForResponse(response => response.url() === `${api}/me/propiedades/${property.id}` && response.request().method() === 'GET');
  const confirmation = page.waitForResponse(response => response.url().endsWith(`/me/propiedades/${property.id}/fotografias/confirmaciones`));
  const jpeg = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 320; canvas.height = 200;
    const context = canvas.getContext('2d')!;
    context.fillStyle = '#FA003F'; context.fillRect(0, 0, 320, 200);
    context.fillStyle = '#FFFFFF'; context.font = '24px sans-serif';
    context.fillText('Fotografía de prueba', 30, 110);
    return canvas.toDataURL('image/jpeg').split(',')[1];
  });
  await page.locator('input[type=file]').first().setInputFiles({ name: 'fachada.jpg', mimeType: 'image/jpeg', buffer: Buffer.from(jpeg, 'base64') });
  expect((await confirmation).status()).toBe(201);
  await expect(page.getByText('Fotografías confirmadas: 1').first()).toBeVisible();
  const afterPhoto = await (await refreshed).json() as { version: number };
  expect(afterPhoto.version).toBeGreaterThanOrEqual(edited.version);
  const publication = page.waitForResponse(response => response.url().endsWith(`/me/propiedades/${property.id}/publicacion`));
  await page.getByRole('button', { name: 'Publicar', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Confirmar', exact: true }).click();
  const published = await publication;
  expect(published.status()).toBe(200);
  expect(published.request().headers()['if-match']).toBe(`"v${afterPhoto.version}"`);
  expect((await published.json()).estado_publicacion).toBe('PUBLICADA');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page.getByText('Estado actualizado.', { exact: true }).first()).toBeVisible();
  await expect(page.getByRole('img', { name: title + ' editada', exact: true })).toHaveJSProperty('naturalWidth', 320);
  await page.screenshot({ path: 'docs/evidence/inventory-published-desktop.png', fullPage: true });
});
