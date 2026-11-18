import { test, expect } from '../fixtures';
import { evidenciaElemento } from '../../utils/acciones';

test.describe('Ghost: búsqueda pública', () => {
  test(
    'GH-CP-004 @smoke @busqueda — encuentra una publicación',
    {
      tag: ['@smoke', '@busqueda'],
      annotation: {
        type: 'HU',
        description: 'HU-02 Búsqueda pública',
      },
    },
    async ({ homePage }) => {
      await homePage.search('soft');

      const resultado = homePage.result(
        'Calidad de software en la práctica',
      );

      await expect(resultado).toBeVisible();
      await evidenciaElemento(
        resultado,
        'Resultado: publicación encontrada',
      );
    },
  );

  test(
    'GH-CP-005 @busqueda — búsqueda sin resultados muestra un mensaje',
    {
      tag: ['@busqueda'],
      annotation: {
        type: 'HU',
        description: 'HU-02 Búsqueda sin resultados',
      },
    },
    async ({ homePage }) => {
      await homePage.search('bebel');

      const mensajeEsperado = homePage.searchFrame.getByText(
        'No matches found',
      );

      await expect(mensajeEsperado).toBeVisible();
      await evidenciaElemento(
        mensajeEsperado,
        'Resultado: mensaje de búsqueda sin coincidencias',
      );
    },
  );
});