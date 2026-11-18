import { Page, Locator, test } from '@playwright/test';
import path from 'path';

function limpiar(texto: string): string {
  return texto.replace(/[\\/:*?"<>|]/g, '').trim();
}

function siguienteNumero(): string {
  const capturas = test.info().attachments.filter(
    (adjunto) => adjunto.contentType === 'image/png',
  );
  return String(capturas.length + 1).padStart(2, '0');
}

async function tomarCaptura(
  page: Page,
  descripcion: string,
): Promise<void> {
  const numero = siguienteNumero();
  const nombre = `${numero} - ${limpiar(descripcion)}`;
  const ruta = path.join(
    'evidencias',
    limpiar(test.info().title),
    `${nombre}.png`,
  );

  const body = await page.screenshot({ path: ruta, fullPage: true });
  await test.info().attach(nombre, {
    body,
    contentType: 'image/png',
  });
}

async function capturarResaltado(
  locator: Locator,
  descripcion: string,
): Promise<void> {
  await locator.scrollIntoViewIfNeeded();

  const estiloAnterior = await locator.getAttribute('style');

  await locator.evaluate((elemento) => {
    const nodo = elemento as HTMLElement;
    nodo.style.outline = '3px solid red';
    nodo.style.outlineOffset = '2px';
  });

  try {
    await tomarCaptura(locator.page(), descripcion);
  } finally {
    await locator
      .evaluate(
        (elemento, estilo) => {
          const nodo = elemento as HTMLElement;
          if (estilo === null) {
            nodo.removeAttribute('style');
          } else {
            nodo.setAttribute('style', estilo);
          }
        },
        estiloAnterior,
        { timeout: 2_000 },
      )
      .catch(() => undefined);
  }
}

export async function clic(
  locator: Locator,
  descripcion: string,
): Promise<void> {
  await test.step(descripcion, async () => {
    await capturarResaltado(locator, descripcion);
    await locator.click();
  });
}

export async function escribir(
  locator: Locator,
  texto: string,
  descripcion: string,
): Promise<void> {
  await test.step(descripcion, async () => {
    await locator.fill(texto);
    await capturarResaltado(locator, descripcion);
  });
}

export async function seleccionar(
  locator: Locator,
  valor: string,
  descripcion: string,
): Promise<void> {
  await test.step(descripcion, async () => {
    await locator.selectOption(valor);
    await capturarResaltado(locator, descripcion);
  });
}

export async function evidenciaElemento(
  locator: Locator,
  descripcion: string,
): Promise<void> {
  await test.step(descripcion, async () => {
    await capturarResaltado(locator, descripcion);
  });
}

export async function evidenciaPantalla(
  page: Page,
  descripcion: string,
): Promise<void> {
  await test.step(descripcion, async () => {
    await tomarCaptura(page, descripcion);
  });
}