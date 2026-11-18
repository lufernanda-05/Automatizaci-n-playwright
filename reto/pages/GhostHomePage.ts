import { FrameLocator, Page, Locator } from '@playwright/test';
import {
  clic,
  escribir,
  evidenciaPantalla,
} from '../../utils/acciones';

export class GhostHomePage {
  readonly page: Page;
  readonly searchButton: Locator;
  readonly searchFrame: FrameLocator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchButton = page.getByRole('button', {
      name: 'Search this site',
    });
    this.searchFrame = page.frameLocator('iframe[title="portal-popup"]');
    this.searchInput = this.searchFrame.getByRole('textbox', {
      name: 'Search posts, tags and authors',
    });
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
    await evidenciaPantalla(
      this.page,
      'Abrir sitio público de Ghost',
    );
  }

  async search(term: string): Promise<void> {
    await clic(this.searchButton, 'Abrir búsqueda');
    await escribir(
      this.searchInput,
      term,
      `Buscar "${term}"`,
    );
  }

  result(text: string): Locator {
    return this.searchFrame.getByText(text);
  }
}