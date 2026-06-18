import { test, expect } from "@playwright/test";

test.describe("Shopify Dev Studio Services Form Validation", () => {
  test("should enforce form input validation constraints", async ({ page }) => {
    await page.goto("/services");

    // Try submitting without checking consent
    await page.fill("#storeUrl", "https://mystore.com");
    await page.fill("#email", "contact@mystore.com");
    await page.click('button[type="submit"]');

    // Should display consent warning message
    await expect(page.locator("text=Please check the consent box")).toBeVisible();

    // Verify checkbox can be checked
    await page.check("#consent");
    await expect(page.locator("#consent")).toBeChecked();
  });
});
