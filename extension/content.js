// Content script to read DOM, listen to console messages, capture errors, and automate scraping

console.log("🚀 Antigravity Bridge Content Script Active");

let currentRunId = "default";

// Function to gather DOM state and send to background script
function sendDOMState() {
  chrome.runtime.sendMessage({
    type: "DOM_STATE",
    url: window.location.href,
    title: document.title,
    html: document.documentElement.outerHTML
  });
}

// Send initial DOM state on load
setTimeout(sendDOMState, 1000);

// Watch for DOM changes (throttled to avoid performance hits)
let domChangeTimeout;
const observer = new MutationObserver(() => {
  clearTimeout(domChangeTimeout);
  domChangeTimeout = setTimeout(sendDOMState, 2000);
});
observer.observe(document.body, { childList: true, subtree: true, attributes: true });

// Capture unhandled errors
window.addEventListener("error", (event) => {
  chrome.runtime.sendMessage({
    type: "CONSOLE_ERROR",
    url: window.location.href,
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error ? event.error.stack : ""
  });
});

// Capture unhandled promise rejections
window.addEventListener("unhandledrejection", (event) => {
  chrome.runtime.sendMessage({
    type: "CONSOLE_ERROR",
    url: window.location.href,
    message: `Unhandled Rejection: ${event.reason}`,
    stack: event.reason ? event.reason.stack : ""
  });
});

// Intercept normal console logs
const originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error
};

function hookConsole(level) {
  console[level] = function(...args) {
    originalConsole[level].apply(console, args);
    let msg = "";
    try {
      msg = args.map(arg => {
        if (typeof arg === 'object' && arg !== null) {
          try {
            return JSON.stringify(arg);
          } catch (e) {
            return "[Circular or Unserializable Object]";
          }
        }
        return String(arg);
      }).join(' ');
    } catch (err) {
      msg = "[Serialization Error]";
    }
    chrome.runtime.sendMessage({
      type: "CONSOLE_LOG",
      level: level,
      runId: currentRunId,
      message: msg
    });
  };
}
hookConsole('log');
hookConsole('warn');
hookConsole('error');

// --- AUTOMATED SCRAPER FOR VARIANT PRICING ---

async function scrapeVariants(papers, colors, corners, sizes, runId) {
  currentRunId = runId || "default";
  console.log("🕵️‍♂️ Starting variant scraper with Run ID: " + currentRunId);
  
  // 1. Locate dropdowns
  const sizeSelect = document.querySelector('select[id^="size_"]');
  const paperSelect = document.querySelector('select[id^="paper_"]');
  const colorSelect = document.querySelector('select[id^="color_"]');
  const quantitySelect = document.querySelector('select[id^="quantity_"]');
  const cornersSelect = document.querySelector('select[id^="roundedCorners_"]');
  const coatingSelect = document.querySelector('select[id^="coating_"]');
  const spotSelect = document.querySelector('select[id^="spotCoating_"]');
  const raisedSelect = document.querySelector('select[id^="raisedPrint_"]');

  if (!sizeSelect || !paperSelect || !colorSelect || !quantitySelect) {
    console.error("❌ Scraper Error: One or more dropdowns not found on page.");
    chrome.runtime.sendMessage({ type: "SCRAPE_ERROR", error: "Required dropdown selects not found on page." });
    return;
  }

  // 2. Default sizes list if not specified
  const targetSizes = sizes && sizes.length > 0 ? sizes : ["101", "335", "337", "260", "339"];

  // 3. Extract quantity options dynamically from the page
  const quantities = Array.from(quantitySelect.options)
    .map(opt => opt.value)
    .filter(val => val && val !== "0"); // exclude placeholder/0 value

  console.log(`📋 Found ${quantities.length} quantities to check:`, quantities);

  // Define 16 pt Premium Matte mutually exclusive finishes
  const matteFinishes = [
    { coating: "", spot: "", raised: "" }, // Base Matte Aqueous
    { coating: "5", spot: "", raised: "" }, // High Gloss Front
    { coating: "40", spot: "", raised: "" }, // High Gloss Both Sides
    { coating: "", spot: "3", raised: "" }, // Spot UV Front
    { coating: "", spot: "39", raised: "" }, // Spot UV Both Sides
    { coating: "", spot: "", raised: "135" }, // Raised UV Front
    { coating: "", spot: "", raised: "137" }, // Raised UV Both Sides
    { coating: "", spot: "", raised: "138" }, // Raised Foil Front
    { coating: "", spot: "", raised: "140" } // Raised Foil Both Sides
  ];

  // 4. Generate all combinations including sizes and finishes
  const combinations = [];
  for (const size of targetSizes) {
    for (const paper of papers) {
      for (const color of colors) {
        for (const corner of corners) {
          for (const qty of quantities) {
            if (paper === "10") { // 16 pt. Premium Matte
              for (const fin of matteFinishes) {
                combinations.push({ size, paper, color, corner, qty, finish: fin });
              }
            } else {
              combinations.push({ size, paper, color, corner, qty, finish: { coating: "", spot: "", raised: "" } });
            }
          }
        }
      }
    }
  }

  console.log(`🎯 Total combinations to scrape: ${combinations.length}`);
  chrome.runtime.sendMessage({
    type: "SCRAPE_STARTED",
    total: combinations.length,
    runId: currentRunId,
    timestamp: new Date().toISOString()
  });

  const results = [];
  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  let lastSelectedSize = "";
  let lastSelectedPaper = "";

  // 5. Scrape each combination
  for (let i = 0; i < combinations.length; i++) {
    const comb = combinations[i];
    
    try {
      // Abort old ghost scraper loops if a new run has been started on the server
      if (i % 5 === 0) {
        try {
          const runResp = await fetch("http://localhost:9999/active-run");
          if (runResp.ok) {
            const runData = await runResp.json();
            if (runData.activeRunId && runData.activeRunId !== currentRunId) {
              console.log(`🛑 Run ID mismatch (server active: ${runData.activeRunId}, this run: ${currentRunId}). Terminating duplicate scraper thread!`);
              return;
            }
          }
        } catch (e) {
          // ignore local server connection errors
        }
      }

      // Step A: Set size dropdown value (wait for update)
      const currentSizeSelect = document.querySelector('select[id^="size_"]');
      if (comb.size !== lastSelectedSize && currentSizeSelect) {
        currentSizeSelect.value = comb.size;
        currentSizeSelect.dispatchEvent(new Event('change', { bubbles: true }));
        await delay(1200); // wait for options list to update
        lastSelectedSize = comb.size;
      }

      // Step B: Set paper (wait for options to render)
      const currentPaperSelect = document.querySelector('select[id^="paper_"]');
      if (comb.paper !== lastSelectedPaper && currentPaperSelect) {
        currentPaperSelect.value = comb.paper;
        currentPaperSelect.dispatchEvent(new Event('change', { bubbles: true }));
        await delay(1200); // wait for Spot UV / Raised Print dropdowns to load in DOM
        lastSelectedPaper = comb.paper;
      }
      
      // Step C: Set color
      const currentColorSelect = document.querySelector('select[id^="color_"]');
      if (currentColorSelect && currentColorSelect.value !== comb.color) {
        currentColorSelect.value = comb.color;
        currentColorSelect.dispatchEvent(new Event('change', { bubbles: true }));
        await delay(500);
      }
      
      // Step D: Set corners
      const currentCornersSelect = document.querySelector('select[id^="roundedCorners_"]');
      const targetCorner = comb.corner || "";
      if (currentCornersSelect && currentCornersSelect.value !== targetCorner) {
        currentCornersSelect.value = targetCorner;
        currentCornersSelect.dispatchEvent(new Event('change', { bubbles: true }));
        await delay(500);
      }

      // Step E: Set coating (wait for Spot/Raised to align)
      const currentCoatingSelect = document.querySelector('select[id^="coating_"]');
      const targetCoating = comb.finish.coating || "";
      if (currentCoatingSelect && currentCoatingSelect.value !== targetCoating) {
        currentCoatingSelect.value = targetCoating;
        currentCoatingSelect.dispatchEvent(new Event('change', { bubbles: true }));
        await delay(850);
      }

      // Step F: Set spot UV
      const currentSpotSelect = document.querySelector('select[id^="spotCoating_"]');
      const targetSpot = comb.finish.spot || "";
      if (currentSpotSelect && currentSpotSelect.value !== targetSpot) {
        currentSpotSelect.value = targetSpot;
        currentSpotSelect.dispatchEvent(new Event('change', { bubbles: true }));
        await delay(850);
      }

      // Step G: Set raised print
      const currentRaisedSelect = document.querySelector('select[id^="raisedPrint_"]');
      const targetRaised = comb.finish.raised || "";
      if (currentRaisedSelect && currentRaisedSelect.value !== targetRaised) {
        currentRaisedSelect.value = targetRaised;
        currentRaisedSelect.dispatchEvent(new Event('change', { bubbles: true }));
        await delay(850);
      }

      // Step H: Set quantity and trigger final price recalculation
      const currentQtySelect = document.querySelector('select[id^="quantity_"]');
      if (currentQtySelect && currentQtySelect.value !== comb.qty) {
        currentQtySelect.value = comb.qty;
        currentQtySelect.dispatchEvent(new Event('change', { bubbles: true }));
        await delay(700);
      }

      // Scrape price
      let price = "Not found";
      const priceContainers = Array.from(document.querySelectorAll('#order-form *'));
      const priceLeafs = priceContainers.filter(el => el.children.length === 0 && el.innerText && el.innerText.includes('$'));
      for (const el of priceLeafs) {
        const match = el.innerText.match(/\$\d+\.\d{2}/);
        if (match) {
          price = match[0];
          break;
        }
      }

      const activeSizeSelect = document.querySelector('select[id^="size_"]');
      const activePaperSelect = document.querySelector('select[id^="paper_"]');
      const activeColorSelect = document.querySelector('select[id^="color_"]');
      const activeCornersSelect = document.querySelector('select[id^="roundedCorners_"]');
      const activeCoatingSelect = document.querySelector('select[id^="coating_"]');
      const activeSpotSelect = document.querySelector('select[id^="spotCoating_"]');
      const activeRaisedSelect = document.querySelector('select[id^="raisedPrint_"]');

      const resultItem = {
        size: activeSizeSelect?.options[activeSizeSelect.selectedIndex]?.text || comb.size,
        sizeValue: comb.size,
        paper: activePaperSelect?.options[activePaperSelect.selectedIndex]?.text || comb.paper,
        paperValue: comb.paper,
        color: activeColorSelect?.options[activeColorSelect.selectedIndex]?.text || comb.color,
        colorValue: comb.color,
        quantity: comb.qty,
        roundedCorners: activeCornersSelect ? (activeCornersSelect.options[activeCornersSelect.selectedIndex]?.text || "None") : "None",
        cornersValue: comb.corner,
        coating: activeCoatingSelect ? (activeCoatingSelect.options[activeCoatingSelect.selectedIndex]?.text || "Matte Aqueous Coating") : "Matte Aqueous Coating",
        coatingValue: comb.finish.coating || "",
        spotUV: activeSpotSelect ? (activeSpotSelect.options[activeSpotSelect.selectedIndex]?.text || "None") : "None",
        spotUVValue: comb.finish.spot || "",
        raisedPrint: activeRaisedSelect ? (activeRaisedSelect.options[activeRaisedSelect.selectedIndex]?.text || "None") : "None",
        raisedPrintValue: comb.finish.raised || "",
        price: price
      };

      results.push(resultItem);
      console.log(`[${i+1}/${combinations.length}] Size: ${resultItem.size} | Paper: ${resultItem.paper} | Color: ${resultItem.color} | Qty: ${comb.qty} | Corners: ${resultItem.roundedCorners} | Coating: ${resultItem.coating} | Spot: ${resultItem.spotUV} | Raised: ${resultItem.raisedPrint} => Price: ${price}`);

      // Send progress to background
      chrome.runtime.sendMessage({
        type: "SCRAPE_PROGRESS",
        current: i + 1,
        total: combinations.length,
        runId: currentRunId,
        item: resultItem
      });

    } catch (err) {
      console.error("Error scraping combination " + JSON.stringify(comb) + " -> " + err.toString() + "\nStack: " + err.stack);
    }
  }

  console.log("✅ Scraper complete!");
  chrome.runtime.sendMessage({
    type: "SCRAPE_COMPLETE",
    results: results,
    runId: currentRunId,
    timestamp: new Date().toISOString()
  });
}

// Function to capture DOM layout and style sheet contents
function captureDOM() {
  console.log("📸 Capturing DOM layout and styling...");
  let styles = "";
  try {
    for (let i = 0; i < document.styleSheets.length; i++) {
      const sheet = document.styleSheets[i];
      try {
        if (sheet.cssRules) {
          for (let j = 0; j < sheet.cssRules.length; j++) {
            styles += sheet.cssRules[j].cssText + "\n";
          }
        }
      } catch (e) {
        if (sheet.href) {
          styles += `/* Import stylesheet: ${sheet.href} */\n@import url("${sheet.href}");\n`;
        }
      }
    }
  } catch (err) {
    console.warn("Could not read all stylesheets:", err);
  }

  chrome.runtime.sendMessage({
    type: "DOM_CAPTURE_RESULT",
    url: window.location.href,
    title: document.title,
    html: document.documentElement.outerHTML,
    styles: styles
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "SCRAPE_VARIANTS") {
    scrapeVariants(message.papers, message.colors, message.corners, message.sizes, message.runId);
  } else if (message.action === "GET_DOM") {
    captureDOM();
  }
});
