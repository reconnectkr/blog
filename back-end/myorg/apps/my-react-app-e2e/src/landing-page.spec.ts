import { test, expect } from '@playwright/test';

test.describe('Landing Page with Direct Login', () => {
  test('should login directly from the landing page with valid credentials', async ({
    page,
  }) => {
    // Go to the landing page
    await page.goto('/');

    // Fill in the login form directly on the landing page
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="password"]', 'password123');

    // Submit the login form
    await page.click('button[type="submit"]');

    // Expect to be redirected to the dashboard/home page
    await expect(page).toHaveURL('/dashboard'); // Adjust the URL according to your app's redirection
  });

  test('should display error for invalid login attempt on landing page', async ({
    page,
  }) => {
    // Go to the landing page
    await page.goto('/');

    // Fill in incorrect credentials
    await page.fill('input[name="username"]', 'wronguser');
    await page.fill('input[name="password"]', 'wrongpassword');

    // Submit the login form
    await page.click('button[type="submit"]');

    // Expect an error message to appear
    const errorMessage = page.locator('.error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Invalid credentials');
  });

  test('should navigate to signup page from landing page', async ({ page }) => {
    // Go to the landing page
    await page.goto('/');

    // Click on the "Sign Up" link
    const signupLink = page.locator('text="Sign Up"');
    await signupLink.click();

    // Verify that it navigates to the signup page
    await expect(page).toHaveURL('/signup');
  });
});
