import { test, expect } from "@playwright/test";

test.describe("Shopify Dev Studio Navigation", () => {
  test("should load homepage and verify title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Shopify/i);
  });
});
