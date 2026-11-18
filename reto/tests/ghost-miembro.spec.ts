import { test, expect } from '../fixtures';
import { limpiarMailpit, obtenerCodigoMiembro } from '../utils/mailpit';
import { evidenciaElemento } from '../../utils/acciones';

const memberEmail = process.env.GHOST_MEMBER_EMAIL;
const mailpitUrl = process.env.MAILPIT_URL;

test.describe('Ghost: acceso de miembros', () => {
  test(
    'GH-CP-006 @smoke @miembros — miembro inicia sesión con código de Mailpit',
    {
      tag: ['@smoke', '@miembros'],
      annotation: {
        type: 'HU',
        description: 'HU-03 Acceso de miembros por correo',
      },
    },
    async ({ portalPage, request }) => {
      if (!memberEmail || !mailpitUrl) {
        throw new Error('Faltan GHOST_MEMBER_EMAIL o MAILPIT_URL en .env');
      }

      await limpiarMailpit(request, mailpitUrl);
      await portalPage.requestCode(memberEmail);

      const code = await obtenerCodigoMiembro(request, mailpitUrl, memberEmail);

      await portalPage.enterCode(code);

      await expect(portalPage.accountLink).toBeVisible();
      await portalPage.verifyAccountIsSignedIn(memberEmail);
      await evidenciaElemento(
        portalPage.accountLink,
        'Resultado: acceso de miembro completado',
      );
    },
  );
});