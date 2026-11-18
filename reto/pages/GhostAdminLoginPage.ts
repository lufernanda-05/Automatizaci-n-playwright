import { Page, Locator } from '@playwright/test';
import {
  clic,
  escribir,
  evidenciaPantalla,
} from '../../utils/acciones';

export class GhostAdminLoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly errorMessage: Locator;
  readonly userMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByRole('textbox', { name: 'Email address' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.signInButton = page.getByRole('button', { name: 'Sign in →' });
    this.errorMessage = page.getByText('Your password is incorrect.');
    this.userMenu = page.getByRole('button', { name: 'User menu' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/ghost/#/signin');
    await evidenciaPantalla(
      this.page,
      'Abrir inicio de sesión de Ghost',
    );
  }

  async login(email: string, password: string): Promise<void> {
    await escribir(
      this.emailInput,
      email,
      'Ingresar correo del personal',
    );
    await escribir(
      this.passwordInput,
      password,
      'Ingresar contraseña del personal',
    );
    await clic(
      this.signInButton,
      'Enviar formulario de inicio de sesión',
    );
  }
}