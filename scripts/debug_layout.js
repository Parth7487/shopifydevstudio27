import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto("http://localhost:8080/services", { waitUntil: "networkidle" });
    
    console.log("=== Initial State (Closed) ===");
    const leavesInfoClosed = await page.evaluate(() => {
      const leaves = Array.from(document.querySelectorAll(".page-leaf"));
      return leaves.map((leaf, i) => {
        const rect = leaf.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(leaf);
        const children = Array.from(leaf.children).map(c => {
          const crect = c.getBoundingClientRect();
          const cstyle = window.getComputedStyle(c);
          return {
            className: c.className,
            top: crect.top,
            left: crect.left,
            width: crect.width,
            height: crect.height,
            position: cstyle.position,
            display: cstyle.display,
            transform: cstyle.transform
          };
        });
        return {
          index: i,
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          transform: computedStyle.transform,
          children
        };
      });
    });
    console.log(JSON.stringify(leavesInfoClosed, null, 2));

    console.log("Opening book...");
    await page.click("button[aria-label='Next Page']");
    await page.waitForTimeout(2000); 
    
    console.log("=== Opened State (Spread 1) ===");
    const leavesInfoOpen = await page.evaluate(() => {
      const leaves = Array.from(document.querySelectorAll(".page-leaf"));
      return leaves.map((leaf, i) => {
        const rect = leaf.getBoundingClientRect();
        const children = Array.from(leaf.children).map(c => {
          const crect = c.getBoundingClientRect();
          const cstyle = window.getComputedStyle(c);
          return {
            className: c.className,
            top: crect.top,
            left: crect.left,
            width: crect.width,
            height: crect.height,
            position: cstyle.position,
            display: cstyle.display,
            transform: cstyle.transform
          };
        });
        return {
          index: i,
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          transform: window.getComputedStyle(leaf).transform,
          children
        };
      });
    });
    console.log(JSON.stringify(leavesInfoOpen, null, 2));

  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
}

run();
