import { test, expect } from "@playwright/test";

test.describe("Shopify Dev Studio Services Form Validation", () => {
  test("should enforce form input validation constraints", async ({ page }) => {
    await page.goto("/services");

    // Navigate to the form spread inside the 3D book (page 18 on spread 10)
    const spreadBtn = page.locator('button[title="Jump to Spread 10"]');
    await spreadBtn.waitFor({ state: "visible" });
    await spreadBtn.click();
    await page.waitForTimeout(2000); // Wait for transition to fully settle

    // Try submitting without checking consent
    await page.fill("#storeUrl", "https://mystore.com");
    await page.fill("#email", "contact@mystore.com");
    await page.locator('.book-viewport form').evaluate(form => (form as HTMLFormElement).requestSubmit());

    // Should display consent warning message
    await expect(page.locator(".book-viewport").locator("text=Please check the consent box")).toBeVisible();

    // Verify checkbox can be checked
    await page.locator("#consent").dispatchEvent("click");
    await expect(page.locator("#consent")).toBeChecked();
  });
});
