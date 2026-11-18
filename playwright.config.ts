import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  fullyParallel: false,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'resultados/junit.xml' }],
  ],

  use: {
    screenshot: 'only-on-failure',
    video: 'on',
    trace: 'on',
  },

  projects: [
    {
      name: 'saucedemo',
      testDir: './tests',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.saucedemo.com',
      },
    },
    {
      name: 'ghost',
      testDir: './reto/tests',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:2368',
      },
    },
  ],
});