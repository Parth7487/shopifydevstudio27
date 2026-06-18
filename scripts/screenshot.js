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
    
    // Initial closed state
    await page.screenshot({ path: "test-services-closed.png" });
    console.log("Saved test-services-closed.png");
    
    // Open the book (Page 1 & inside front cover)
    console.log("Clicking Next Page button to open cover...");
    await page.click("button[aria-label='Next Page']");
    await page.waitForTimeout(2000); // Wait for open transition
    await page.screenshot({ path: "test-services-opened.png" });
    console.log("Saved test-services-opened.png");

    // Flip to Page 2 & 3
    console.log("Clicking Next Page button to flip to Page 2 & 3...");
    await page.click("button[aria-label='Next Page']");
    await page.waitForTimeout(2000); // Wait for page flip transition
    await page.screenshot({ path: "test-services-spread1.png" });
    console.log("Saved test-services-spread1.png");

  } catch (e) {
    console.error("Error occurred:", e);
  } finally {
    await browser.close();
  }
}

run();
