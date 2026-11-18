import {
  test as base,
  expect,
} from '@playwright/test';
import { GhostAdminLoginPage } from './pages/GhostAdminLoginPage';
import { GhostHomePage } from './pages/GhostHomePage';
import { GhostPortalPage } from './pages/GhostPortalPage';

type GhostFixtures = {
  adminLoginPage: GhostAdminLoginPage;
  homePage: GhostHomePage;
  portalPage: GhostPortalPage;
};

export const test = base.extend<GhostFixtures>({
  adminLoginPage: async ({ page }, use) => {
    const pageObject = new GhostAdminLoginPage(page);
    await pageObject.goto();
    await use(pageObject);
  },

  homePage: async ({ page }, use) => {
    const pageObject = new GhostHomePage(page);
    await pageObject.goto();
    await use(pageObject);
  },

  portalPage: async ({ page }, use) => {
    const pageObject = new GhostPortalPage(page);
    await pageObject.gotoSignIn();
    await use(pageObject);
  },
});

export { expect };