import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport to a typical desktop size
  await page.setViewportSize({ width: 1440, height: 900 });

  page.on("console", msg => console.log("PAGE LOG:", msg.text()));
  page.on("pageerror", err => console.log("PAGE ERROR:", err.message));

  try {
    console.log("Navigating to http://localhost:8080/services...");
    await page.goto("http://localhost:8080/services", { waitUntil: "networkidle" });
    
    // Scroll the book viewport into view
    await page.locator(".book-viewport").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    // Initial closed state
    await page.screenshot({ path: "test-services-closed.png" });
    console.log("Saved test-services-closed.png");
    
    // Open the book using JS click to bypass 3D hit-testing
    console.log("Clicking Next Page button to open cover...");
    const nextBtn = page.locator("button[aria-label='Next Page']");
    await nextBtn.evaluate(el => el.click());
    await page.waitForTimeout(2000);
    await page.locator(".book-viewport").scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: "test-services-opened.png" });
    console.log("Saved test-services-opened.png");

    // Flip to spread 2
    console.log("Clicking Next Page button to flip to spread 2...");
    await nextBtn.evaluate(el => el.click());
    await page.waitForTimeout(2000);
    await page.locator(".book-viewport").scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: "test-services-spread1.png" });
    console.log("Saved test-services-spread1.png");

  } catch (e) {
    console.error("Error occurred:", e);
  } finally {
    await browser.close();
  }
}

run();
