import { test, expect } from "@playwright/test";

test.describe("Shopify Dev Studio Process Timeline Verification", () => {
  test("should load process page and verify phase 5 migrations details", async ({ page }) => {
    await page.goto("/process");

    // Check heading
    await expect(page.locator("h1")).toContainText(/Process/i);

    // Verify presence of Phase 5 content and migration keywords
    const phase5Card = page.locator("text=Phase 5");
    await expect(phase5Card).toBeVisible();

    const migrationText = page.locator("text=lossless migrations");
    await expect(migrationText).toBeVisible();
  });
});
