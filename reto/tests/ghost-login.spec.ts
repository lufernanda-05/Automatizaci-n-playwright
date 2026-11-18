import { test, expect } from '../fixtures';
import {
  evidenciaElemento,
  evidenciaPantalla,
} from '../../utils/acciones';

const ownerEmail = process.env.GHOST_OWNER_EMAIL;
const ownerPassword = process.env.GHOST_OWNER_PASSWORD;

test.describe('Ghost: acceso del personal', () => {
  test(
    'GH-CP-001 @smoke @login — propietario inicia sesión correctamente',
    {
      tag: ['@smoke', '@login'],
      annotation: {
        type: 'HU',
        description: 'HU-01 Inicio de sesión del personal',
      },
    },
    async ({ adminLoginPage, page }) => {
      if (!ownerEmail || !ownerPassword) {
        throw new Error(
          'Faltan GHOST_OWNER_EMAIL o GHOST_OWNER_PASSWORD en .env',
        );
      }

      await adminLoginPage.login(ownerEmail, ownerPassword);
      await expect(adminLoginPage.userMenu).toBeVisible({
        timeout: 20_000,
      });
      await expect(page).not.toHaveURL(/signin/);
      await evidenciaElemento(
        adminLoginPage.userMenu,
        'Resultado: panel del propietario abierto',
      );
    },
  );

  test(
    'GH-CP-002 @login — contraseña incorrecta es rechazada',
    {
      tag: ['@login'],
      annotation: {
        type: 'HU',
        description: 'HU-01 Inicio de sesión del personal',
      },
    },
    async ({ adminLoginPage, page }) => {
      if (!ownerEmail) {
        throw new Error('Falta GHOST_OWNER_EMAIL en .env');
      }

      await adminLoginPage.login(
        ownerEmail,
        'clave_incorrecta_de_prueba',
      );

      await expect(page).toHaveURL(/signin/);
      await expect(adminLoginPage.errorMessage).toBeVisible();
      await evidenciaElemento(
        adminLoginPage.errorMessage,
        'Resultado: error de inicio de sesión visible',
      );
    },
  );

  test(
    'GH-CP-003 @login — abrir panel sin sesión solicita autenticación',
    {
      tag: ['@login'],
      annotation: {
        type: 'HU',
        description: 'HU-01 Protección del panel',
      },
    },
    async ({ page }) => {
      await page.goto('/ghost');

      await expect(
        page.getByRole('button', { name: 'Sign in →' }),
      ).toBeVisible();

      await evidenciaPantalla(
        page,
        'Resultado: formulario de acceso protegido',
      );
    },
  );
});