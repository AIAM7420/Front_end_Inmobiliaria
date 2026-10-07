import { expect, test, type Page, type APIRequestContext } from '@playwright/test';
import { createHash } from 'node:crypto';

const api = process.env.E2E_API_URL ?? 'http://127.0.0.1:8000/api/v1';
const backend = api.replace(/\/api\/v1$/, '');
let fixture: { id: string; asesor_id: string; titulo: string };
test.beforeAll(async ({ browser, request }) => {
  const headers = await authenticate(request, 'phase4-advisor@example.com', 'Secure1!');
  const [types, zones, operations] = await Promise.all(['tipos', 'zonas', 'operaciones'].map(async name => (await request.get(`${api}/catalogos/${name}`)).json()));
  const created = await request.post(`${api}/propiedades`, { headers, data: { tipo_id: types.find((item: { codigo: string }) => item.codigo === 'CASA').id, zona_id: zones.find((item: { nombre: string }) => item.nombre === 'León (zona general)').id, operacion_id: operations.find((item: { codigo: string }) => item.codigo === 'VENTA').id, titulo: `Casa mapas navegador ${Date.now()}`, descripcion: 'Publicación sintética para probar favoritos y contacto real. Amplios espacios y distribución de prueba para recorrer toda la información desde un dispositivo táctil.\n'.repeat(12), direccion: 'Calle de prueba 123', codigo_postal: '37000', latitud: '21.165', longitud: '-101.680', precio: '1000000', moneda: 'MXN', habitaciones: 2, banos: '1', superficie_construccion: '90', superficie_terreno: '120' } });
  expect(created.status()).toBe(201); fixture = await created.json();
  const page = await browser.newPage();
  for (let index = 0; index < 3; index++) {
  const jpeg = await page.evaluate(color => { const canvas = document.createElement('canvas'); canvas.width = 320; canvas.height = 200; const context = canvas.getContext('2d')!; context.fillStyle = color; context.fillRect(0, 0, 320, 200); return canvas.toDataURL('image/jpeg').split(',')[1]; }, ['#FA003F', '#4059ad', '#238c65'][index]);
  const content = Buffer.from(jpeg, 'base64');
  const receipt = await (await request.post(`${api}/me/propiedades/${fixture.id}/fotografias`, { headers, data: { nombre: 'casa.jpg', mime: 'image/jpeg', tamano_bytes: content.length, sha256: createHash('sha256').update(content).digest('hex') } })).json();
  const key = new URL(receipt.url).pathname.replace(/^\/upload\//, '');
  expect((await request.put(`${backend}/__e2e/storage/${key}`, { data: content, headers: { 'Content-Type': 'image/jpeg' } })).status()).toBe(204);
  expect((await request.post(`${api}/me/propiedades/${fixture.id}/fotografias/confirmaciones`, { headers, data: { comprobante: receipt.comprobante } })).status()).toBe(201);
  }
  await page.close();
  const current = await request.get(`${api}/me/propiedades/${fixture.id}`, { headers });
  const publication = await request.post(`${api}/me/propiedades/${fixture.id}/publicacion`, { headers: { ...headers, 'If-Match': current.headers().etag }, data: { accion: 'PUBLICAR', visible: true } });
  expect(publication.status(), await publication.text()).toBe(200);
});
test.afterAll(async ({ request }) => {
  if (!fixture) return;
  const headers = await authenticate(request, 'phase4-advisor@example.com', 'Secure1!');
  const current = await request.get(`${api}/me/propiedades/${fixture.id}`, { headers });
  expect((await request.post(`${api}/me/propiedades/${fixture.id}/publicacion`, { headers: { ...headers, 'If-Match': current.headers().etag }, data: { accion: 'ARCHIVAR' } })).status()).toBe(200);
});
async function authenticate(request: APIRequestContext, email: string, password: string) {
  const session = await request.post(`${api}/sesiones`, { data: { correo: email, password } });
  expect(session.status()).toBe(200);
  return { Authorization: `Bearer ${(await session.json()).access_token}` };
}
async function login(page: Page, email: string, password: string, home: string) {
  await page.goto('/login');
  await page.getByPlaceholder('Correo electrónico').fill(email);
  await page.getByPlaceholder('Contraseña ...').fill(password);
  await page.getByRole('button', { name: 'Iniciar sesión', exact: true }).click();
  await page.waitForURL(home);
}
async function navigate(page: Page, path: string) {
  await page.evaluate(path => { history.pushState({}, '', path); dispatchEvent(new PopStateEvent('popstate')); }, path);
}
async function transport(page: Page, request: APIRequestContext) {
  await page.route('https://objects.test/**', async route => {
    const outgoing = route.request();
    expect(outgoing.headers().authorization).toBeUndefined();
    const key = new URL(outgoing.url()).pathname.replace(/^\/(upload|read)\//, '');
    const result = outgoing.method() === 'PUT'
      ? await request.put(`${backend}/__e2e/storage/${key}`, { data: outgoing.postDataBuffer()!, headers: { 'Content-Type': outgoing.headers()['content-type'] } })
      : await request.get(`${backend}/__e2e/storage/${key}`);
    await route.fulfill({ response: result });
  });
}

async function swipe(page: Page, x: number, y: number, dx: number, dy: number) {
  const session = await page.context().newCDPSession(page);
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
  for (let step = 1; step <= 12; step++) {
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + dx * step / 12, y: y + dy * step / 12 }] });
    await page.waitForTimeout(20);
  }
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await session.detach();
}

test.describe('native touch interactions', () => {
  test.use({ hasTouch: true });
  for (const size of [{ name: 'phone', width: 390, height: 844 }, { name: 'tablet', width: 820, height: 1180 }, { name: 'tablet-landscape', width: 1024, height: 768 }, { name: 'wide-tablet', width: 1280, height: 800 }]) for (const dark of [false, true]) {
    test('detail scroll, gallery swipe and touch selection ' + size.name + (dark ? ' dark' : ' light'), async ({ page }) => {
      const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
      await page.setViewportSize(size);
      if (dark) await page.addInitScript(() => localStorage.setItem('inmo_theme', 'dark'));
      await page.goto('/inmuebles?propiedad=' + fixture.id);
      const detail = size.width < 768 ? page.getByRole('dialog', { name: 'Detalle de propiedad' }) : page.locator('[aria-hidden="false"]').filter({ has: page.getByRole('region', { name: 'Fotografía principal' }) });
      const photo = page.getByRole('region', { name: 'Fotografía principal' }).filter({ visible: true });
      await expect(photo).toBeVisible();
      const closeBox = await page.getByRole('button', { name: 'Cerrar detalle', exact: true }).filter({ visible: true }).boundingBox();
      const titleBoxes = await detail.first().getByRole('heading', { name: fixture.titulo, exact: true }).evaluate(element => {
        const range = document.createRange(); range.selectNodeContents(element);
        return Array.from(range.getClientRects()).map(rect => ({ x: rect.x, y: rect.y, width: rect.width, height: rect.height }));
      });
      for (const text of titleBoxes) expect(text.x < closeBox!.x + closeBox!.width && text.x + text.width > closeBox!.x && text.y < closeBox!.y + closeBox!.height && text.y + text.height > closeBox!.y).toBe(false);
      if (size.width >= 768) {
        const card = page.getByLabel('Resultados del catálogo').locator(':scope > div').first();
        await expect(card).toBeVisible();
        expect((await card.boundingBox())!.width).toBeGreaterThanOrEqual(200);
      }
      const gallery = page.getByLabel('Galería de fotografías').filter({ visible: true });
      const second = gallery.getByRole('button', { name: 'Mostrar fotografía 2' });
      await expect(gallery.getByRole('button')).toHaveCount(3);
      const picture = await photo.boundingBox();
      await swipe(page, picture!.x + picture!.width * .75, picture!.y + picture!.height * .25, -picture!.width * .5, 0);
      await expect(second).toHaveAttribute('aria-pressed', 'true');
      await page.screenshot({ path: 'docs/evidence/integracion-galeria-' + size.name + (dark ? '-dark' : '') + '.png', animations: 'disabled' });
      await photo.getByRole('button', { name: 'Fotografía anterior' }).tap();
      await expect(gallery.getByRole('button', { name: 'Mostrar fotografía 1' })).toHaveAttribute('aria-pressed', 'true');
      const thumbnails = await gallery.boundingBox();
      if (await gallery.evaluate(element => element.scrollWidth > element.clientWidth)) {
        await swipe(page, thumbnails!.x + thumbnails!.width * .85, thumbnails!.y + 50, -thumbnails!.width * .55, 0);
        await expect.poll(() => gallery.evaluate(element => element.scrollLeft)).toBeGreaterThan(0);
      }
      await gallery.getByRole('button', { name: 'Mostrar fotografía 3' }).tap();
      await expect(gallery.getByRole('button', { name: 'Mostrar fotografía 3' })).toHaveAttribute('aria-pressed', 'true');
      const scroll = photo.locator('xpath=ancestor::*[contains(@class,"overflow-y-auto")][1]');
      // On desktop the text column has its own scroll, while the mobile column owns the entire detail.
      const textScroll = size.width < 768 ? scroll : page.getByRole('heading', { name: fixture.titulo, exact: true }).first().locator('xpath=ancestor::*[contains(@class,"overflow-y-auto")][1]');
      const bounds = await textScroll.boundingBox();
      await swipe(page, bounds!.x + bounds!.width * .6, bounds!.y + Math.min(bounds!.height - 50, 370), 0, -230);
      await expect.poll(() => textScroll.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
      await expect(detail.first()).toBeVisible();
      await page.screenshot({ path: 'docs/evidence/integracion-touch-' + size.name + (dark ? '-dark' : '') + '.png', animations: 'disabled' });
      if (size.width < 768) {
        const handle = page.getByRole('button', { name: 'Expandir o contraer detalle' }).filter({ visible: true });
        const grip = await handle.boundingBox();
        await swipe(page, grip!.x + grip!.width / 2, grip!.y + grip!.height / 2, 0, -100);
        await expect(handle).toHaveAttribute('aria-expanded', 'true');
        await expect(gallery.getByRole('button', { name: 'Mostrar fotografía 3' })).toHaveAttribute('aria-pressed', 'true');
        await handle.tap();
        await expect(handle).toHaveAttribute('aria-expanded', 'false');
      }
      expect(errors).toEqual([]);
      await page.getByRole('button', { name: 'Cerrar detalle', exact: true }).filter({ visible: true }).tap();
      await expect(photo).toHaveCount(0);
      await expect(page).not.toHaveURL(/propiedad=/);
    });
  }

  for (const size of [{ name: 'phone', width: 390, height: 844 }, { name: 'tablet', width: 820, height: 1180 }]) {
    test('map detail and advisor portfolio touch flow ' + size.name, async ({ page }) => {
      const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
      await page.setViewportSize(size);
      await page.goto('/map?propiedad=' + fixture.id);
      const photo = page.getByRole('region', { name: 'Fotografía principal' }).filter({ visible: true });
      await expect(photo).toBeVisible();
      const picture = await photo.boundingBox();
      await swipe(page, picture!.x + picture!.width * .75, picture!.y + 90, -picture!.width * .5, 0);
      await expect(page.getByRole('button', { name: 'Mostrar fotografía 2' }).filter({ visible: true })).toHaveAttribute('aria-pressed', 'true');
      const scroll = photo.locator('xpath=ancestor::*[contains(@class,"overflow-y-auto")][1]');
      const area = await scroll.boundingBox();
      await swipe(page, area!.x + area!.width / 2, area!.y + Math.min(area!.height - 60, 400), 0, -220);
      await expect.poll(() => scroll.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
      await page.getByRole('button', { name: 'Ver perfil del asesor' }).filter({ visible: true }).tap();
      await expect(page.getByRole('button', { name: 'Portafolio', exact: true }).filter({ visible: true })).toBeVisible();
      await page.getByRole('button', { name: 'Portafolio', exact: true }).filter({ visible: true }).tap();
      await expect(page).toHaveURL(new RegExp('/asesores/' + fixture.asesor_id));
      if (size.width < 768) await page.getByRole('button', { name: 'Portafolio', exact: true }).tap();
      await expect(page.getByRole('heading', { name: 'Portafolio', exact: true }).filter({ visible: true }).first()).toBeVisible();
      await page.screenshot({ path: 'docs/evidence/integracion-portafolio-' + size.name + '.png', animations: 'disabled' });
      if (size.width < 768) await page.getByRole('button', { name: 'Cerrar detalle', exact: true }).filter({ visible: true }).tap();
      await page.getByRole('button', { name: 'Volver', exact: true }).filter({ visible: true }).tap();
      await expect(page).toHaveURL(new RegExp('/map\\?propiedad=' + fixture.id));
      await expect(page.getByRole('region', { name: 'Fotografía principal' }).filter({ visible: true })).toBeVisible();
      expect(errors).toEqual([]);
    });
  }
});

test.describe('new messages layout touch', () => {
  test.use({ hasTouch: true });
  for (const width of [390, 820]) test('real chat scroll and custom filters ' + width, async ({ page, request }) => {
    const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize({ width, height: 900 });
    const customer = await authenticate(request, 'e2e-general@example.invalid', 'E2eTesting1!');
    const response = await request.post(`${api}/conversaciones`, { headers: customer, data: { tipo: 'CLIENTE_ASESOR', propiedad_id: fixture.id } });
    expect(response.ok()).toBe(true);
    const conversation = await response.json();
    for (let index = 0; index < 8; index++) expect((await request.post(`${api}/conversaciones/${conversation.id}/mensajes`, { headers: customer, data: { cliente_mensaje_id: crypto.randomUUID(), contenido: `Mensaje táctil ${width} ${index}: ` + 'Consulta real sobre la publicación y sus espacios. '.repeat(15) } })).ok()).toBe(true);
    await login(page, 'phase4-advisor@example.com', 'Secure1!', '/asesor');
    await navigate(page, '/asesor/mensajes?conversation=' + conversation.id);
    const history = page.getByLabel('Historial de mensajes');
    await expect(history.getByText('Usuario E2E', { exact: true }).first()).toBeVisible();
    const bounds = await history.boundingBox();
    await swipe(page, bounds!.x + bounds!.width / 2, bounds!.y + Math.min(bounds!.height - 60, 400), 0, -220);
    await expect.poll(() => history.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
    await expect(page.getByRole('button', { name: 'Cerrar detalle', exact: true })).toHaveCount(0);
    await page.screenshot({ path: `docs/evidence/integracion-mensajes-${width}.png` });
    await page.getByRole('button', { name: 'Cerrar conversación', exact: true }).tap();
    await expect(history).toHaveCount(0);
    await page.getByRole('button', { name: 'Abrir filtros del panel', exact: true }).filter({ visible: true }).tap();
    const filter = page.getByRole('combobox', { name: 'Filtrar conversaciones', exact: true });
    await filter.tap();
    await page.getByRole('option', { name: 'Archivados', exact: true }).tap();
    await expect(filter).toContainText('Archivados');
    await filter.press('Escape');
    await expect(filter).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Abrir asistente', exact: true })).toHaveCount(0);
    await expect(page).not.toHaveURL(/conversation=/);
    expect(errors).toEqual([]);
  });
});

test('portfolio filters load later pages and allow explicit retry without false empty results', async ({ page, request }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const property = await (await request.get(`${api}/propiedades/${fixture.id}`)).json();
  let fail = true, nextRequests = 0;
  // Pagination contract fixtures; the detail/advisor, photos and login still use the real isolated API.
  await page.route(`**/asesores/${fixture.asesor_id}/propiedades?*`, async route => {
    const next = new URL(route.request().url()).searchParams.has('cursor');
    if (next) { nextRequests++; if (fail) return route.fulfill({ status: 503, body: '{}' }); }
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify(next
      ? { items: [property], next_cursor: null }
      : { items: Array.from({ length: 20 }, (_, index) => ({ ...property, id: String(900000 + index), titulo: 'Otra publicación', descripcion: '', sector: 'SUR' })), next_cursor: 'controlled-next-page' }) });
  });
  await page.route(`**/propiedades/${fixture.id}`, async route => {
    const response = await route.fetch();
    await new Promise(resolve => setTimeout(resolve, 600));
    await route.fulfill({ response });
  });
  await page.goto('/asesores/' + fixture.asesor_id + '?propiedad=' + fixture.id);
  await expect(page.getByText('Cargando publicación…', { exact: true })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Fotografía principal' })).toBeVisible();
  await page.getByRole('button', { name: 'Volver al portafolio', exact: true }).click();
  const search = page.getByPlaceholder('Buscar en este portafolio...').filter({ visible: true });
  await search.fill(fixture.titulo);
  await expect(page.getByRole('button', { name: 'Reintentar página del portafolio' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Sin propiedades con esos criterios' })).toHaveCount(0);
  fail = false;
  await page.getByRole('button', { name: 'Reintentar página del portafolio' }).click();
  await expect(page.getByRole('heading', { name: fixture.titulo, exact: true })).toBeVisible();
  expect(nextRequests).toBeGreaterThan(1);
  await page.getByRole('heading', { name: fixture.titulo, exact: true }).click();
  await expect(page).toHaveURL(new RegExp('propiedad=' + fixture.id));
  await expect(page.getByRole('region', { name: 'Fotografía principal' })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('region', { name: 'Fotografía principal' })).toHaveCount(0);
  await page.goForward();
  await expect(page.getByRole('region', { name: 'Fotografía principal' })).toBeVisible();
});


test.beforeEach(async ({ page, request }) => {
  await transport(page, request);
  await page.route('https://api.mapbox.com/**', async route => {
    if (route.request().url().includes('/styles/v1/')) {
      await new Promise(resolve => setTimeout(resolve, 200));
      await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ version: 8, sources: {}, layers: [{ id: 'local-background', type: 'background', paint: { 'background-color': route.request().url().includes('dark') ? '#222222' : '#d9e8d0' } }] }) });
    } else await route.fulfill({ status: 200, body: '{}' });
  });
  await page.route('https://events.mapbox.com/**', route => route.fulfill({ status: 204 }));
});

for (const size of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'tablet', width: 820, height: 1180 }, { name: 'mobile', width: 390, height: 844 }]) {
  test('anchored filters and shared criteria ' + size.name, async ({ page, request }) => {
    const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize(size);
    const headers = await authenticate(request, 'phase4-advisor@example.com', 'Secure1!');
    const preferences = await (await request.get(`${api}/me/preferencias`, { headers })).json();
    expect((await request.put(`${api}/me/preferencias`, { headers: { ...headers, 'If-Match': `"v${preferences.version}"` }, data: { tema: 'CLARO', alertas_correo: preferences.alertas_correo } })).ok()).toBe(true);
    await login(page, 'phase4-advisor@example.com', 'Secure1!', '/asesor');
    await navigate(page, '/asesor/mensajes');
    await expect(page.getByRole('heading', { name: 'Mensajes', exact: true })).toBeVisible();
    if (size.width < 768) await page.getByRole('button', { name: 'Abrir búsqueda' }).click();
    const trigger = page.getByRole('button', { name: 'Abrir filtros', exact: true }).filter({ visible: true });
    const header = page.locator('header').first(), before = await header.boundingBox();
    await trigger.click();
    const dialog = page.getByRole('dialog', { name: 'Filtros de inmuebles' });
    await expect(dialog).toBeVisible();
    const after = await header.boundingBox(); expect(after!.height).toBeCloseTo(before!.height, 0);
    const box = await dialog.boundingBox(); expect(box!.width).toBeGreaterThan(300); expect(box!.x + box!.width).toBeLessThanOrEqual(size.width);
    await page.keyboard.press('Escape'); await expect(dialog).toHaveCount(0); await expect(trigger).toBeFocused();
    await trigger.click();
    await dialog.getByRole('combobox', { name: 'Sector', exact: true }).click();
    await expect(page.getByRole('listbox', { name: 'Sector' })).toBeVisible();
    const optionsBox = await page.getByRole('listbox', { name: 'Sector' }).boundingBox();
    expect(optionsBox!.x + optionsBox!.width).toBeLessThanOrEqual(size.width);
    expect(optionsBox!.y + optionsBox!.height).toBeLessThanOrEqual(size.height);
    await page.screenshot({ path: 'docs/evidence/dropdown-filtros-' + size.name + '.png' });
    await page.getByRole('option', { name: 'Zona norte', exact: true }).click();
    await expect(dialog).toBeVisible();
    await dialog.getByRole('combobox', { name: 'Rango de precio' }).click();
    await page.getByRole('option', { name: '$1M - $3M', exact: true }).click();
    const search = page.waitForRequest(r => r.url().includes('/busquedas'));
    await dialog.getByRole('button', { name: 'Buscar propiedades' }).click();
    expect((await search).postDataJSON()).toMatchObject({ sector: 'NORTE', precio_min: '1000000', precio_max: '3000000' });
    await expect(page).toHaveURL(/\/inmuebles$/);
    await navigate(page, '/map');
    await expect(page.locator('.mapboxgl-canvas').first()).toBeVisible();
    await page.getByRole('button', { name: 'Abrir filtros', exact: true }).filter({ visible: true }).click();
    await expect(dialog.getByRole('combobox', { name: 'Sector', exact: true })).toHaveText('Zona norte');
    await expect(dialog.getByRole('combobox', { name: 'Rango de precio' })).toHaveText('$1M - $3M');
    await dialog.getByRole('combobox', { name: 'Sector', exact: true }).focus();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Escape');
    await expect(page.getByRole('listbox')).toHaveCount(0);
    await expect(dialog).toBeVisible();
    await page.screenshot({ path: 'docs/evidence/bugs-filtros-' + size.name + '.png' });
    await page.keyboard.press('Escape');
    // Mobile map intentionally uses the floating navbar; theme lives in the main header.
    if (size.width < 768) await navigate(page, '/asesor/mensajes');
    await page.getByRole('button', { name: 'Usar modo oscuro', exact: true }).click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    if (size.width < 768) await navigate(page, '/map');
    await page.getByRole('button', { name: 'Abrir filtros', exact: true }).filter({ visible: true }).click();
    await dialog.getByRole('combobox', { name: 'Sector', exact: true }).click();
    await page.screenshot({ path: 'docs/evidence/dropdown-filtros-' + size.name + '-oscuro.png', animations: 'disabled' });
    await page.keyboard.press('Escape'); await page.keyboard.press('Escape');
    expect(errors).toEqual([]);
  });
}

test('real Mapbox keeps canvases, markers and detail selection through delayed theme changes', async ({ page }) => {
  test.setTimeout(60_000);
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/map');
  const marker = page.getByRole('button', { name: fixture.titulo + ' · zona aproximada', exact: true });
  await expect(marker).toBeVisible();
  const canvas = await page.locator('.mapboxgl-canvas').first().elementHandle();
  await marker.click();
  await expect(page.getByRole('heading', { name: fixture.titulo, exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Mostrar fotografía 3', exact: true })).toBeVisible();
  const gallery = page.getByLabel('Galería de fotografías').filter({ visible: true }), heading = page.getByRole('heading', { name: fixture.titulo, exact: true });
  expect((await gallery.boundingBox())!.y).toBeLessThan((await heading.boundingBox())!.y);
  await page.getByRole('button', { name: 'Mostrar fotografía 3', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Mostrar fotografía 3', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByLabel('Ubicación aproximada').filter({ visible: true }).locator('.mapboxgl-canvas')).toBeVisible();
  const miniMap = page.getByLabel('Ubicación aproximada').filter({ visible: true });
  const miniCanvas = await miniMap.locator('.mapboxgl-canvas').elementHandle();
  const zoomOut = miniMap.getByRole('button', { name: 'Alejar mapa (zoom out)', exact: true });
  await expect(zoomOut).toBeVisible();
  expect((await zoomOut.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  await zoomOut.click();
  await miniMap.getByRole('button', { name: 'Recentrar ubicación', exact: true }).click();
  const mainMap = page.getByLabel('Mapa de inmuebles', { exact: true });
  await expect(mainMap).toHaveAttribute('aria-busy', 'false');
  const beforePan = await marker.boundingBox();
  await page.mouse.move(700, 650);
  await page.mouse.down();
  await page.mouse.move(780, 650, { steps: 20 });
  await page.mouse.up();
  await expect.poll(async () => Math.abs((await marker.boundingBox())!.x - beforePan!.x)).toBeGreaterThan(20);
  // Wait for Mapbox's drag inertia to settle before comparing screen coordinates.
  let lastX = (await marker.boundingBox())!.x;
  await expect.poll(async () => { const nextX = (await marker.boundingBox())!.x; const delta = Math.abs(nextX - lastX); lastX = nextX; return delta; }, { intervals: [300, 300, 300] }).toBeLessThan(0.5);
  const cameraPosition = await marker.boundingBox();
  for (let i = 0; i < 4; i++) {
    await page.getByRole('button', { name: i % 2 === 0 ? 'Usar modo oscuro' : 'Usar modo claro', exact: true }).click();
    await expect(mainMap).toHaveAttribute('aria-busy', 'false');
    await expect(marker).toBeVisible();
    expect((await marker.boundingBox())!.x).toBeCloseTo(cameraPosition!.x, 0);
    expect((await marker.boundingBox())!.y).toBeCloseTo(cameraPosition!.y, 0);
    await expect(page.getByRole('button', { name: 'Mostrar fotografía 3', exact: true })).toHaveAttribute('aria-pressed', 'true');
    expect(await canvas!.evaluate(node => node.isConnected)).toBe(true);
    expect(await miniCanvas!.evaluate(node => node.isConnected)).toBe(true);
  }
  await expect(page.getByText('Mapa no disponible', { exact: true })).toHaveCount(0);
  await page.screenshot({ path: 'docs/evidence/bugs-mapa-galeria.png' });
  expect(errors).toEqual([]);
});

test('new footer preserves real destinations and renders in both themes without SVG errors', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error' && message.text().includes('Invalid DOM property')) errors.push(message.text()); });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const footer = page.locator('footer');
  await footer.scrollIntoViewIfNeeded();
  await expect(footer.getByRole('link', { name: 'Mensajes', exact: true })).toHaveAttribute('href', '/asesor/mensajes');
  await expect(footer.getByRole('link', { name: 'Buscar Propiedades', exact: true })).toHaveAttribute('href', '/map');
  await expect(footer.locator('svg')).toBeVisible();
  for (const dark of [false, true]) {
    if (dark) await page.getByRole('button', { name: 'Usar modo oscuro', exact: true }).click();
    await expect(footer).toHaveCSS('background-color', dark ? 'rgb(31, 31, 31)' : 'rgb(255, 255, 255)');
    await footer.screenshot({ path: `docs/evidence/dropdown-footer-${dark ? 'oscuro' : 'claro'}.png`, animations: 'disabled' });
  }
  expect(errors).toEqual([]);
});

for (const width of [1440, 390]) {
  test('uniform administrative tabs navigate to real users and authorizations ' + width, async ({ page, request }) => {
    const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize({ width, height: 900 });
    const headers = await authenticate(request, 'e2e-admin@example.invalid', 'E2eTesting1!');
    const preferences = await (await request.get(`${api}/me/preferencias`, { headers })).json();
    expect((await request.put(`${api}/me/preferencias`, { headers: { ...headers, 'If-Match': `"v${preferences.version}"` }, data: { tema: 'CLARO', alertas_correo: preferences.alertas_correo } })).ok()).toBe(true);
    await login(page, 'e2e-admin@example.invalid', 'E2eTesting1!', '/admin');
    await navigate(page, '/admin/solicitudes');
    const navigation = page.getByRole('navigation', { name: 'Administración de usuarios' });
    for (const dark of [false, true]) {
      if (dark) await page.getByRole('button', { name: 'Usar modo oscuro', exact: true }).click();
      await expect(page.locator('html')).toHaveClass(dark ? /dark/ : /^(?!.*dark).*$/);
      await expect(navigation.getByRole('link', { name: 'Usuarios', exact: true })).toHaveCSS('background-color', dark ? 'rgb(51, 51, 51)' : 'rgb(255, 255, 255)');
      await expect(navigation.getByRole('link', { name: 'Autorizaciones' })).toHaveAttribute('aria-current', 'page');
      const users = await navigation.getByRole('link', { name: 'Usuarios', exact: true }).boundingBox();
      const approvals = await navigation.getByRole('link', { name: 'Autorizaciones' }).boundingBox();
      expect(users!.height).toBe(44); expect(approvals!.height).toBe(44);
      expect(users!.width).toBe(approvals!.width);
      expect(approvals!.x + approvals!.width).toBeLessThanOrEqual(width);
      await page.screenshot({ path: `docs/evidence/dropdown-admin-${width}-${dark ? 'oscuro' : 'claro'}.png`, animations: 'disabled' });
      await navigation.getByRole('link', { name: 'Usuarios', exact: true }).click();
      await expect(page).toHaveURL(/\/admin\/asesores$/);
      await expect(page.getByRole('heading', { name: 'Usuarios de la Plataforma' })).toBeVisible();
      await expect(navigation.getByRole('link', { name: 'Usuarios', exact: true })).toHaveAttribute('aria-current', 'page');
      await navigation.getByRole('link', { name: 'Autorizaciones' }).click();
      await expect(page).toHaveURL(/\/admin\/solicitudes$/);
    }
    expect(errors).toEqual([]);
  });
}

test('new thumbnail marker responds to keyboard after zoom and theme changes', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/map');
  const marker = page.getByRole('button', { name: fixture.titulo + ' · zona aproximada', exact: true });
  await expect(marker).toBeVisible();
  const map = page.getByLabel('Mapa de inmuebles', { exact: true });
  await expect(map).toHaveAttribute('aria-busy', 'false');
  const position = await marker.boundingBox();
  await page.mouse.dblclick(position!.x - 30, position!.y + 24);
  await expect(marker.getByText(fixture.titulo, { exact: true })).toBeVisible();
  await expect.poll(() => marker.locator('img').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  await page.getByRole('button', { name: 'Usar modo oscuro', exact: true }).click();
  await expect(map).toHaveAttribute('aria-busy', 'false');
  await marker.focus(); await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: fixture.titulo, exact: true })).toBeVisible();
  await page.screenshot({ path: 'docs/evidence/dropdown-marcador-nuevo.png' });
  expect(errors).toEqual([]);
});

test('distribution uses four real sectors and chat has one close on desktop and mobile', async ({ page, request }) => {
  await login(page, 'phase4-advisor@example.com', 'Secure1!', '/asesor');
  await expect(page.getByRole('button', { name: /^Zona norte [0-9]/ })).toBeVisible();
  await expect(page.getByLabel('Distribución de inmuebles por sector')).toHaveAttribute('aria-busy', 'false');
  await page.screenshot({ path: 'docs/evidence/bugs-distribucion.png' });
  await page.getByRole('button', { name: /^Zona norte [0-9]/ }).click();
  await expect(page).toHaveURL(/\/map$/);
  const headers = await authenticate(request, 'e2e-general@example.invalid', 'E2eTesting1!');
  const result = await request.post(api + '/conversaciones', { headers, data: { tipo: 'CLIENTE_ASESOR', propiedad_id: fixture.id } });
  expect(result.ok(), await result.text()).toBeTruthy();
  const conversation = await result.json();
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await navigate(page, '/asesor/mensajes?conversation=' + conversation.id);
    await expect(page.getByRole('button', { name: 'Cerrar conversación', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cerrar detalle', exact: true })).toHaveCount(0);
    await page.screenshot({ path: 'docs/evidence/bugs-chat-' + width + '.png' });
    await page.getByRole('button', { name: 'Cerrar conversación', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Cerrar conversación', exact: true })).toHaveCount(0);
  }
});

test('failed local style recovers explicitly without a blank page', async ({ page }) => {
  let failed = false;
  await page.route('https://api.mapbox.com/styles/v1/**', async route => {
    if (!failed) { failed = true; await route.abort('failed'); }
    else await route.fallback();
  });
  await page.goto('/map');
  await expect(page.getByRole('button', { name: 'Reintentar mapa', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Reintentar mapa', exact: true }).click();
  await expect(page.getByRole('button', { name: fixture.titulo + ' · zona aproximada', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reintentar mapa', exact: true })).toHaveCount(0);
});

test('short mobile viewport scrolls filters, cycles keyboard focus and closes outside', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 320 });
  await page.goto('/map');
  const trigger = page.getByRole('button', { name: 'Abrir filtros', exact: true }).filter({ visible: true });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Filtros de inmuebles' });
  await expect(dialog).toBeVisible();
  const box = await dialog.boundingBox();
  expect(box!.y + box!.height).toBeLessThanOrEqual(320);
  expect(await dialog.evaluate(node => node.scrollHeight > node.clientHeight)).toBe(true);
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.getByRole('button', { name: 'Buscar propiedades' })).toBeFocused();
  expect(await dialog.evaluate(node => node.scrollTop)).toBeGreaterThan(0);
  await page.keyboard.press('Tab');
  await expect(dialog.getByRole('button', { name: 'Cerrar filtros' })).toBeFocused();
  await dialog.getByRole('combobox', { name: 'Sector', exact: true }).focus();
  await page.keyboard.press('Enter');
  const options = page.getByRole('listbox', { name: 'Sector' });
  await expect(options).toBeVisible();
  const popup = await options.boundingBox();
  expect(popup!.y).toBeGreaterThanOrEqual(0);
  expect(popup!.y + popup!.height).toBeLessThanOrEqual(320);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeVisible();
  await page.mouse.click(385, 310);
  await expect(dialog).toHaveCount(0);
});

test('published property without coordinates shows the general map and completion notice', async ({ page, request }) => {
  const headers = await authenticate(request, 'phase4-advisor@example.com', 'Secure1!');
  const current = await request.get(`${api}/me/propiedades/${fixture.id}`, { headers });
  const saved = await request.patch(`${api}/me/propiedades/${fixture.id}`, { headers: { ...headers, 'If-Match': current.headers().etag }, data: { latitud: null, longitud: null } });
  expect(saved.status()).toBe(200);
  try {
    await page.goto('/map');
    await page.getByRole('button', { name: /^Ver \d+\+? coincidencias?$/ }).click();
    await page.getByRole('heading', { name: fixture.titulo, exact: true }).click();
    await expect(page.getByText('Mapa general de León. El asesor debe completar la ubicación del inmueble.', { exact: true }).filter({ visible: true })).toBeVisible();
    await expect(page.getByText('Ubicación sin registrar', { exact: true })).toHaveCount(0);
    await expect(page.getByLabel('Ubicación aproximada').filter({ visible: true }).locator('.mapboxgl-canvas')).toBeVisible();
  } finally {
    const latest = await request.get(`${api}/me/propiedades/${fixture.id}`, { headers });
    const restored = await request.patch(`${api}/me/propiedades/${fixture.id}`, { headers: { ...headers, 'If-Match': latest.headers().etag }, data: { latitud: '21.165', longitud: '-101.680' } });
    expect(restored.status()).toBe(200);
  }
});
