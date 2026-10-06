import { expect, test } from '@playwright/test';

const api = process.env.E2E_API_URL ?? 'http://127.0.0.1:8000/api/v1';
const backend = api.replace(/\/api\/v1$/, '');

// The guarded E2E database is reused locally. Retire these synthetic fixtures
// through the real API so repeated runs do not accumulate hundreds of trash rows.
async function cleanInventoryFixtures(request: import('@playwright/test').APIRequestContext) {
  const login = await request.post(`${api}/sesiones`, { data: { correo: 'phase4-advisor@example.com', password: 'Secure1!' } });
  const { access_token } = await login.json() as { access_token: string };
  const headers = { Authorization: `Bearer ${access_token}` };
  type Fixture = {id:string;titulo:string;estado_publicacion:string;version:number};
  const items: Fixture[] = [];
  let cursor: string | null = null;
  do {
    const result = await request.get(`${api}/me/propiedades`, { headers, params: { limit: 100, ...(cursor ? { cursor } : {}) } });
    expect(result.ok()).toBe(true);
    const page = await result.json() as { items: Fixture[]; next_cursor: string | null };
    items.push(...page.items);
    cursor = page.next_cursor;
  } while (cursor);
  for (let item of items.filter(item => item.titulo.startsWith('Casa navegador'))) {
    if (item.estado_publicacion !== 'ARCHIVADA') {
      const archived = await request.post(`${api}/me/propiedades/${item.id}/publicacion`, { headers: { ...headers, 'If-Match': `"v${item.version}"` }, data: { accion: 'ARCHIVAR' } });
      expect(archived.status()).toBe(200);
      item = await archived.json();
    }
    const retired = await request.delete(`${api}/me/propiedades/${item.id}/retiro`, { headers: { ...headers, 'If-Match': `"v${item.version}"` } });
    expect(retired.status()).toBe(200);
  }
}
test.beforeAll(async ({ request }) => { test.setTimeout(120_000); await cleanInventoryFixtures(request); });
test.afterEach(async ({ request }) => { await cleanInventoryFixtures(request); });

test('real inventory saves, uploads and publishes with the refreshed resource version', async ({ page, request }) => {
  test.setTimeout(60_000);
  const browserErrors: string[] = [];
  page.on('pageerror', error => browserErrors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') browserErrors.push(message.text()); });
  // Only the external object transport is bridged to the test server's memory provider.
  // Authorization, hashes, confirmation, versions and publication use the real API/MySQL.
  await page.route('https://objects.test/**', async route => {
    const outgoing = route.request();
    expect(outgoing.headers().authorization).toBeUndefined();
    const path = new URL(outgoing.url()).pathname.replace(/^\/(upload|read)\//, '');
    const response = outgoing.method() === 'PUT'
      ? await request.put(`${backend}/__e2e/storage/${path}`, {
        data: outgoing.postDataBuffer()!, headers: { 'Content-Type': outgoing.headers()['content-type'] },
      })
      : await request.get(`${backend}/__e2e/storage/${path}`);
    await route.fulfill({ response });
  });
  await page.goto('/login');
  await page.getByPlaceholder('Correo electrónico').fill('phase4-advisor@example.com');
  await page.getByPlaceholder('Contraseña ...').fill('Secure1!');
  await page.getByRole('button', { name: 'Iniciar sesión', exact: true }).click();
  await page.getByRole('button', { name: 'Mi inventario', exact: true }).filter({ visible: true }).click();
  await page.getByRole('button', { name: 'Nueva propiedad', exact: true }).click();
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
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
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
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
  const refreshed = page.waitForResponse(async response => response.url() === `${api}/me/propiedades/${property.id}` && response.request().method() === 'GET' && (await response.json()).version > edited.version);
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
  expect(afterPhoto.version).toBeGreaterThan(edited.version);
  const secondConfirmation = page.waitForResponse(response => response.url().endsWith(`/me/propiedades/${property.id}/fotografias/confirmaciones`));
  await page.locator('input[type=file]').first().setInputFiles({ name: 'interior.jpg', mimeType: 'image/jpeg', buffer: Buffer.from(jpeg, 'base64') });
  const secondPhoto = await (await secondConfirmation).json() as { id: string };
  await expect(page.getByText('Fotografías confirmadas: 2').first()).toBeVisible();
  await page.getByRole('button', { name: 'Mover foto 2 antes', exact: true }).click();
  const reordering = page.waitForResponse(response => response.request().method() === 'PUT' && response.url().endsWith(`/me/propiedades/${property.id}/fotografias/orden`));
  await page.getByRole('button', { name: 'Guardar orden de fotos', exact: true }).click();
  const ordered = await reordering;
  expect(ordered.status()).toBe(200);
  const currentVersion = (await ordered.json()).version as number;
  const auth = await request.post(`${api}/sesiones`, { data: { correo: 'phase4-advisor@example.com', password: 'Secure1!' } });
  const headers = { Authorization: `Bearer ${(await auth.json()).access_token}` };
  const orderedPictures = await (await request.get(`${api}/me/propiedades/${property.id}/fotografias`, { headers })).json();
  expect(orderedPictures[0].id).toBe(secondPhoto.id);
  await page.getByRole('button', { name: 'Eliminar foto 2', exact: true }).click();
  const removingPhoto = page.waitForResponse(response => response.request().method() === 'DELETE' && response.url().includes('/fotografias/'));
  await page.getByRole('dialog', { name: 'Eliminar fotografía' }).getByRole('button', { name: 'Eliminar fotografía', exact: true }).click();
  const removedPhoto = await removingPhoto;
  expect(removedPhoto.status()).toBe(200);
  const beforePublication = (await removedPhoto.json()).propiedad.version as number;
  expect(beforePublication).toBeGreaterThan(currentVersion);
  await expect(page.getByText('Fotografías confirmadas: 1').first()).toBeVisible();
  const publication = page.waitForResponse(response => response.url().endsWith(`/me/propiedades/${property.id}/publicacion`));
  await page.getByRole('button', { name: 'Publicar', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Confirmar', exact: true }).click();
  const published = await publication;
  expect(published.status()).toBe(200);
  expect(published.request().headers()['if-match']).toBe(`"v${beforePublication}"`);
  expect((await published.json()).estado_publicacion).toBe('PUBLICADA');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page.getByText('Estado actualizado.', { exact: true }).first()).toBeVisible();
  await expect(page.getByRole('img', { name: title + ' editada', exact: true }).first()).toHaveJSProperty('naturalWidth', 320);
  await page.screenshot({ path: 'docs/evidence/inventory-published-desktop.png', fullPage: true });
  await page.getByLabel('Porcentaje de comisión').fill('2.50');
  const sharing = page.waitForResponse(response => response.request().method() === 'PUT' && response.url().endsWith('/comision'));
  await page.getByRole('button', { name: 'Guardar comisión', exact: true }).click();
  expect((await sharing).status()).toBe(200);
  await page.getByRole('button', { name: 'Comisiones compartidas', exact: true }).filter({visible:true}).click();
  await expect(page.getByRole('dialog', {name:'Comisiones compartidas'}).getByText(title + ' editada', {exact:true})).toBeVisible();
  await expect(page.getByRole('dialog').getByText('Comisión compartida: 2.50%', {exact:true})).toBeVisible();
  await page.getByRole('dialog').getByRole('button', {name:'Cerrar'}).click();
  await page.getByRole('button', { name: `Eliminar ${title} editada`, exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Cancelar', exact: true }).click();
  await expect(page.getByRole('button', { name: `Eliminar ${title} editada`, exact: true })).toBeVisible();
  await page.getByRole('button', { name: `Eliminar ${title} editada`, exact: true }).click();
  const deletion = page.waitForResponse(response => response.url() === `${api}/me/propiedades/${property.id}` && response.request().method() === 'DELETE');
  await page.getByRole('dialog').getByRole('button', { name: 'Mover a papelera', exact: true }).click();
  const deleted = await deletion;
  expect(deleted.status()).toBe(200);
  expect((await deleted.json()).estado_publicacion).toBe('ARCHIVADA');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page.getByRole('button', { name: `Eliminar ${title} editada`, exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Ver eliminadas', exact: true }).click();
  await page.getByRole('button', { name: `Recuperar ${title} editada`, exact: true }).click();
  const restoration = page.waitForResponse(response => response.url().endsWith(`/me/propiedades/${property.id}/publicacion`));
  await page.getByRole('dialog').getByRole('button', { name: 'Recuperar', exact: true }).click();
  const restored = await restoration;
  expect(restored.status()).toBe(200);
  expect((await restored.json()).estado_publicacion).toBe('REGISTRADA');
  await page.getByRole('button', { name: 'Volver al inventario', exact: true }).click();
  await expect(page.getByRole('button', { name: `Eliminar ${title} editada`, exact: true })).toBeVisible();
  await page.getByRole('button', { name: `Eliminar ${title} editada`, exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Mover a papelera', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeHidden();
  await page.getByRole('button', { name: 'Ver eliminadas', exact: true }).click();
  await page.getByRole('button', { name: `Eliminar definitivamente ${title} editada`, exact: true }).click();
  const retirement = page.waitForResponse(response => response.request().method() === 'DELETE' && response.url().endsWith('/retiro'));
  await page.getByRole('dialog').getByRole('button', { name: 'Retirar publicación y fotos', exact: true }).click();
  const retired = await retirement;
  expect(retired.status()).toBe(200);
  expect((await retired.json()).limpieza_pendiente).toBe(false);
  await expect(page.getByRole('button', { name: `Recuperar ${title} editada`, exact: true })).toHaveCount(0);
  expect((await request.get(`${api}/me/propiedades/${property.id}`, { headers })).status()).toBe(404);
  expect(browserErrors).toEqual([]);
});

for (const mobile of [false, true]) {
  test(`long inventory scrolls and a stale deletion requires review (${mobile ? 'mobile' : 'desktop'})`, async ({ page, request }) => {
    await page.setViewportSize(mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 });
    const login = await request.post(`${api}/sesiones`, { data: { correo: 'phase4-advisor@example.com', password: 'Secure1!' } });
    const { access_token } = await login.json();
    const headers = { Authorization: `Bearer ${access_token}` };
    const types = await (await request.get(`${api}/catalogos/tipos`)).json();
    const zones = await (await request.get(`${api}/catalogos/zonas`)).json();
    const operations = await (await request.get(`${api}/catalogos/operaciones`)).json();
    let target!: { id: string; titulo: string; version: number };
    const prefix = `Casa navegador scroll ${mobile ? 'mobile' : 'desktop'} ${Date.now()}`;
    for (let index = 0; index < 24; index++) {
      const created = await request.post(`${api}/propiedades`, { headers, data: {
        tipo_id: types.find((item: {codigo:string}) => item.codigo === 'CASA').id,
        operacion_id: operations.find((item: {codigo:string}) => item.codigo === 'VENTA').id,
        zona_id: zones[0].id, titulo: `${prefix} ${index}`, descripcion: 'Borrador de prueba',
        direccion: 'Calle de prueba 123', precio: '1000000', moneda: 'MXN', habitaciones: 2,
        banos: '1', superficie_construccion: '90', superficie_terreno: '120',
      } });
      expect(created.status()).toBe(201);
      target = await created.json();
    }
    await page.goto('/login');
    await page.getByPlaceholder('Correo electrónico').fill('phase4-advisor@example.com');
    await page.getByPlaceholder('Contraseña ...').fill('Secure1!');
    await page.getByRole('button', { name: 'Iniciar sesión', exact: true }).click();
    await page.getByRole('button', { name: 'Mi inventario', exact: true }).filter({ visible: true }).click();
    const region = page.getByRole('region', { name: mobile ? 'Inventario móvil' : 'Inventario de escritorio' });
    await expect(region).toBeVisible();
    await page.getByPlaceholder('Buscar por título o ubicación...').filter({visible:true}).fill(prefix);
    expect(await region.evaluate(el => el.scrollHeight > el.clientHeight)).toBe(true);
    await region.evaluate(el => { el.scrollTop = el.scrollHeight; });
    expect(await region.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `docs/evidence/fidelity/inventory-scroll-${mobile?'mobile':'desktop'}.png`, fullPage: true });
    await page.getByRole('button', { name: 'Ordenar inventario', exact: true }).filter({visible:true}).click();
    await page.getByRole('dialog', {name:'Ordenar inventario'}).getByRole('button', {name:`Bajar ${target.titulo}`,exact:true}).click();
    const reordering = page.waitForResponse(response => response.request().method() === 'PUT' && response.url().endsWith('/me/inventario/orden'));
    await page.getByRole('button', {name:'Guardar orden del inventario',exact:true}).click();
    expect((await reordering).status()).toBe(200);
    await expect(page.getByRole('dialog')).toBeHidden();
    const orderedProperty = await request.get(`${api}/me/propiedades/${target.id}`, {headers});
    target = await orderedProperty.json();
    await region.getByRole('button', { name: `Eliminar ${target.titulo}`, exact: true }).click();
    const updated = await request.patch(`${api}/me/propiedades/${target.id}`, { headers: { ...headers, 'If-Match': `"v${target.version}"` }, data: { titulo: target.titulo + ' vigente' } });
    expect(updated.status()).toBe(200);
    const stale = page.waitForResponse(response => response.request().method() === 'DELETE');
    await page.getByRole('dialog').getByRole('button', { name: 'Mover a papelera', exact: true }).click();
    expect((await stale).status()).toBe(412);
    await expect(page.getByText('Los datos cambiaron mientras editabas.', { exact: false })).toBeVisible();
    const current = await request.get(`${api}/me/propiedades/${target.id}`, { headers });
    expect((await current.json()).estado_publicacion).toBe('REGISTRADA');
  });
}
