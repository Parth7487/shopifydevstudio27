import { test, expect } from "@playwright/test";

test.describe("Theme Toggle Verification", () => {
  test("should switch between light and dark themes", async ({ page }) => {
    await page.goto("/");

    // The document element should initially have class 'dark' (default brand standard)
    const root = page.locator("html");
    await expect(root).toHaveClass(/dark/);

    // Toggle the theme via navbar switcher
    const themeToggler = page.locator("#theme-toggler");
    await themeToggler.click();

    // Verify it changed theme - class 'dark' should be removed
    await expect(root).not.toHaveClass(/dark/);

    // Toggle it back to dark
    await themeToggler.click();
    await expect(root).toHaveClass(/dark/);
  });
});
