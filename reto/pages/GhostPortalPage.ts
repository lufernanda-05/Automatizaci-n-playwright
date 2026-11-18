import {
  FrameLocator,
  Locator,
  Page,
  expect,
} from '@playwright/test';
import {
  clic,
  escribir,
  evidenciaElemento,
  evidenciaPantalla,
} from '../../utils/acciones';

export class GhostPortalPage {
  readonly page: Page;
  readonly portalFrame: FrameLocator;
  readonly emailInput: Locator;
  readonly continueButton: Locator;
  readonly codeInput: Locator;
  readonly accountLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.portalFrame = page.frameLocator(
      '[data-testid="portal-popup-frame"]',
    );

    this.emailInput = this.portalFrame.getByRole('textbox', {
      name: 'Email',
    });
    this.continueButton = this.portalFrame.getByRole('button', {
      name: 'Continue',
    });
    this.codeInput = this.portalFrame.getByRole('textbox', {
      name: 'Code',
    });
    this.accountLink = page.getByRole('link', { name: 'Account' });
  }

  async gotoSignIn(): Promise<void> {
    await this.page.goto('/#/portal/signin');
    await evidenciaPantalla(
      this.page,
      'Abrir portal de acceso de miembros',
    );
  }

  async requestCode(email: string): Promise<void> {
    await escribir(
      this.emailInput,
      email,
      'Ingresar correo del miembro',
    );
    await clic(
      this.continueButton,
      'Solicitar código de acceso',
    );
  }

  async enterCode(code: string): Promise<void> {
    await evidenciaElemento(
      this.codeInput,
      'Campo del código de acceso',
    );
    await this.codeInput.fill(code);
  }

  async verifyAccountIsSignedIn(email: string): Promise<void> {
    await clic(this.accountLink, 'Abrir la cuenta del miembro');
    await expect(this.portalFrame.getByText(email)).toBeVisible();
  }
}