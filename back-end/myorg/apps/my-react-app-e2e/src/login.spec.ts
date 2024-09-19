import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/login');

    // Fill in valid credentials
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="password"]', 'password123');

    // Click on login button
    await page.click('button[type="submit"]');

    // Check if redirection happens
    await expect(page).toHaveURL('/');
  });

  test('should show error on invalid login', async ({ page }) => {
    await page.goto('/login');

    // Fill in invalid credentials
    await page.fill('input[name="username"]', 'invaliduser');
    await page.fill('input[name="password"]', 'wrongpassword');

    // Click on login button
    await page.click('button[type="submit"]');

    // Check for error message
    const errorMessage = page.locator('.error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Invalid credentials');
  });
});
