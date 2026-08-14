const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 9999;
const planningDir = path.join(__dirname, '../.planning');
const commandFilePath = path.join(planningDir, 'browser_command.json');

if (!fs.existsSync(planningDir)) {
  fs.mkdirSync(planningDir, { recursive: true });
}

// In-memory state
let pendingCommand = null;
let lastSeen = null;
let activeRunId = null;

const server = http.createServer((req, res) => {
  // CORS — allow extension to call this
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // ─── GET /active-run ──────────────────────────────────────────────
  if (req.method === 'GET' && pathname === '/active-run') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ activeRunId }));
    return;
  }

  // ─── GET /command ───────────────────────────────────────────────
  // Extension polls this every 2s to receive commands from IDE
  if (req.method === 'GET' && pathname === '/command') {
    lastSeen = new Date().toISOString();
    if (pendingCommand) {
      if (pendingCommand.runId) {
        activeRunId = pendingCommand.runId;
      }
      console.log(`📡 Delivering command to extension:`, pendingCommand);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(pendingCommand));
      pendingCommand = null; // consumed
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ action: null }));
    }
    return;
  }

  // ─── POST /state ─────────────────────────────────────────────────
  // Extension sends DOM state / tab changes
  if (req.method === 'POST' && pathname === '/state') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);

        if (data.type === 'DOM_STATE') {
          fs.writeFileSync(path.join(planningDir, 'browser_active_tab.json'),
            JSON.stringify({ url: data.url, title: data.title, updatedAt: data.timestamp }, null, 2));
          fs.writeFileSync(path.join(planningDir, 'browser_state.html'), data.html);
          console.log(`📥 DOM Captured for: ${data.url}`);
        }

        else if (data.type === 'DOM_CAPTURE_RESULT') {
          try {
            const capturesDir = path.join(planningDir, 'captures');
            if (!fs.existsSync(capturesDir)) fs.mkdirSync(capturesDir, { recursive: true });

            const domain = new URL(data.url).hostname.replace('www.', '');
            const domainDir = path.join(capturesDir, domain);
            if (!fs.existsSync(domainDir)) fs.mkdirSync(domainDir, { recursive: true });

            let htmlContent = data.html;
            if (!htmlContent.includes('styles.css')) {
              htmlContent = htmlContent.replace('</head>', '<link rel="stylesheet" href="styles.css">\n</head>');
            }

            fs.writeFileSync(path.join(domainDir, 'index.html'), htmlContent);
            fs.writeFileSync(path.join(domainDir, 'styles.css'), data.styles || '');
            console.log(`📥 UI Layout & Styles captured and saved to: ${path.relative(process.cwd(), domainDir)}`);
          } catch (e) {
            console.error('Failed to save DOM capture:', e.message);
          }
        }

        else if (data.type === 'TAB_CHANGED') {
          fs.writeFileSync(path.join(planningDir, 'browser_active_tab.json'),
            JSON.stringify({ url: data.url, title: data.title, updatedAt: data.timestamp }, null, 2));
          console.log(`🌐 Tab Changed: ${data.url}`);
        }

        else if (data.type === 'CONSOLE_ERROR') {
          const logLine = `[${data.timestamp}] ❌ ERROR: ${data.message}\nURL: ${data.url}\nLocation: ${data.filename}:${data.lineno}:${data.colno}\nStack: ${data.stack}\n${'─'.repeat(40)}\n`;
          fs.appendFileSync(path.join(planningDir, 'browser_console.log'), logLine);
          console.log(`🚨 Browser error captured!`);
        }

        else if (data.type === 'CONSOLE_LOG') {
          if (data.runId && data.runId !== activeRunId) return;
          const logLine = `[${data.timestamp}] [${data.level.toUpperCase()}]: ${data.message}\n`;
          fs.appendFileSync(path.join(planningDir, 'browser_console.log'), logLine);
        }

        else if (data.type === 'TABS_LIST_RESULT') {
          fs.writeFileSync(path.join(planningDir, 'browser_tabs_list.json'),
            JSON.stringify({ tabs: data.tabs, count: data.tabs.length, timestamp: data.timestamp }, null, 2));
          console.log(`📥 Received list of ${data.tabs.length} tabs`);
        }

        else if (data.type === 'SCRAPE_STARTED') {
          if (data.runId && data.runId !== activeRunId) return;
          console.log(`🕵️  Scraper started! Total combinations: ${data.total}`);
        }

        else if (data.type === 'SCRAPE_PROGRESS') {
          if (data.runId && data.runId !== activeRunId) return;
          const i = data.item;
          console.log(`⏳ [${data.current}/${data.total}] ${i.size} | ${i.paper} | ${i.color} | ${i.quantity} | corners:${i.roundedCorners} => ${i.price}`);
        }

        else if (data.type === 'SCRAPE_COMPLETE') {
          if (data.runId && data.runId !== activeRunId) return;
          const jsonPath = path.join(planningDir, 'variants_data.json');
          fs.writeFileSync(jsonPath, JSON.stringify({ results: data.results, timestamp: data.timestamp }, null, 2));

          const mdPath = path.join(planningDir, 'variants_data.md');
          let md = `# Printograph Business Card Variant Prices\n\n*Generated: ${data.timestamp}*\n\n`;
          md += `| Paper | Color | Quantity | Rounded Corners | Price |\n| :--- | :--- | :--- | :--- | :--- |\n`;
          for (const item of data.results) md += `| ${item.paper} | ${item.color} | ${item.quantity} | ${item.roundedCorners} | ${item.price} |\n`;
          fs.writeFileSync(mdPath, md);
          console.log(`✅ Scrape complete! ${data.results.length} results saved.`);
        }

        else if (data.type === 'SCRAPE_ERROR') {
          if (data.runId && data.runId !== activeRunId) return;
          console.error(`🚨 Scraper error:`, data.error);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        console.error('Error parsing state body:', e.message);
        res.writeHead(400);
        res.end('Bad JSON');
      }
    });
    return;
  }

  // ─── POST /result ─────────────────────────────────────────────────
  // Extension sends script execution results
  if (req.method === 'POST' && pathname === '/result') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        if (data.error) {
          console.error(`🚨 Script error:`, data.error);
        } else {
          console.log(`📤 Script result:`, data.result);
        }
        fs.writeFileSync(path.join(planningDir, 'browser_script_result.json'),
          JSON.stringify(data, null, 2));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        res.writeHead(400);
        res.end('Bad JSON');
      }
    });
    return;
  }

  // ─── POST /shopify-proxy ──────────────────────────────────────────
  if (req.method === 'POST' && pathname === '/shopify-proxy') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const { url: shopifyUrl, method, headers, body: reqBody } = payload;
        
        const parsedShopifyUrl = url.parse(shopifyUrl);
        const options = {
          hostname: parsedShopifyUrl.hostname,
          path: parsedShopifyUrl.path,
          method: method || 'GET',
          headers: headers || {}
        };
        
        const proxyReq = https.request(options, (proxyRes) => {
          let responseData = '';
          proxyRes.on('data', chunk => responseData += chunk);
          proxyRes.on('end', () => {
            res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' });
            res.end(responseData);
          });
        });
        
        proxyReq.on('error', (err) => {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
        });
        
        if (reqBody) {
          proxyReq.write(typeof reqBody === 'string' ? reqBody : JSON.stringify(reqBody));
        }
        proxyReq.end();
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
    return;
  }

  // ─── GET /status ──────────────────────────────────────────────────
  if (req.method === 'GET' && pathname === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, lastSeen, hasPendingCommand: !!pendingCommand }));
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

// Watch for command files written by IDE
fs.watch(planningDir, (eventType, filename) => {
  if (filename === 'browser_command.json' && fs.existsSync(commandFilePath)) {
    try {
      const fileData = fs.readFileSync(commandFilePath, 'utf8');
      if (!fileData.trim()) return;
      const command = JSON.parse(fileData);
      try { fs.unlinkSync(commandFilePath); } catch (_) {}
      pendingCommand = command;
      console.log(`📬 Command queued (will deliver on next poll):`, command);
    } catch (err) {
      console.error(`Failed to handle command file:`, err.message);
    }
  }
});

server.listen(PORT, () => {
  console.log(`📡 Antigravity HTTP Bridge listening on http://localhost:${PORT}`);
  console.log(`   GET  /command  — extension polls this for commands`);
  console.log(`   POST /state    — extension sends DOM/tab state`);
  console.log(`   POST /result   — extension sends script results`);
  console.log(`   GET  /status   — health check`);
});
