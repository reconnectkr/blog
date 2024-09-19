import { test, expect } from '@playwright/test';

test.describe('Signup Page', () => {
  test('should sign up and redirect to login page', async ({ page }) => {
    await page.goto('/signup');

    // Fill in signup form
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="name"]', 'Test User');

    // Submit the form
    await page.click('button[type="submit"]');

    // Check for redirection to the landing page (with a login form)
    await expect(page).toHaveURL('/');

    // Optionally check if the login form is visible
    const usernameField = page.locator('input[name="username"]');
    await expect(usernameField).toBeVisible();
  });

  test('should show error on invalid signup input', async ({ page }) => {
    await page.goto('/signup');

    // Fill in invalid input (e.g., missing email)
    await page.fill('input[name="email"]', '');
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="password"]', 'password123');

    // Click on submit button
    await page.click('button[type="submit"]');

    // Check for error message
    const errorMessage = page.locator('.error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Email is required');
  });
});
