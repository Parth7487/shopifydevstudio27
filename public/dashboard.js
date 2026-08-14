// DevStudioXFlowDev App - Client Side JS controller
const PORT = 9999;
const PROXY_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? `http://localhost:${PORT}/shopify-proxy`
  : '/api/shopify-proxy';

// DOM elements
const shopDomainInput = document.getElementById('shop-domain');
const accessTokenInput = document.getElementById('access-token');
const btnSaveCredentials = document.getElementById('btn-save-credentials');
const statStocksCount = document.getElementById('stat-stocks-count');
const statProductsCount = document.getElementById('stat-products-count');
const statSyncsCount = document.getElementById('stat-syncs-count');
const logConsole = document.getElementById('log-console-box');
const btnCreateSiblings = document.getElementById('btn-create-siblings');

// State variables
let credentials = { shop: '', token: '' };
let scrapedData = null;

// Logger function
function log(msg, type = 'info') {
  const time = new Date().toLocaleTimeString();
  let color = '#34d399'; // default green
  if (type === 'error') color = '#ef4444';
  if (type === 'warn') color = '#fbbf24';
  
  logConsole.innerHTML += `<div style="color: ${color}">[${time}] ${msg}</div>`;
  logConsole.scrollTop = logConsole.scrollHeight;
  console.log(`[${type.toUpperCase()}] ${msg}`);
}

// Load saved credentials
function loadCredentials() {
  log(`DEBUG URL Search Params: ${window.location.search || 'None'}`);
  let savedShop = localStorage.getItem('shopify_domain');
  let savedToken = localStorage.getItem('shopify_token');
  
  if (!savedShop || !savedToken || savedToken.startsWith('shpat_8573091949')) {
    savedShop = 'pixilabb.myshopify.com';
    savedToken = '';
    localStorage.setItem('shopify_domain', savedShop);
    localStorage.setItem('shopify_token', savedToken);
  }
  
  credentials.shop = savedShop;
  credentials.token = savedToken;
  shopDomainInput.value = savedShop;
  accessTokenInput.value = savedToken;
  
  log('Loaded active Shopify store credentials.');
  verifyConnection();
}

// Save credentials
btnSaveCredentials.addEventListener('click', () => {
  const shop = shopDomainInput.value.trim();
  const token = accessTokenInput.value.trim();
  
  if (!shop || !token) {
    log('Please fill in both Shopify Domain and Admin Access Token.', 'error');
    return;
  }
  
  localStorage.setItem('shopify_domain', shop);
  localStorage.setItem('shopify_token', token);
  credentials.shop = shop;
  credentials.token = token;
  log('Credentials saved.');
  verifyConnection();
});

// Call Shopify via CORS proxy
async function callShopify(endpoint, method = 'GET', data = null) {
  const shopDomain = credentials.shop.replace('https://', '').replace('http://', '');
  const url = `https://${shopDomain}/admin/api/2024-04/${endpoint}`;
  
  const headers = {
    'X-Shopify-Access-Token': credentials.token,
    'Content-Type': 'application/json'
  };
  
  try {
    const response = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, method, headers, body: data })
    });
    
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Shopify API error (${response.status}): ${errText}`);
    }
    
    return await response.json();
  } catch (err) {
    log(`Shopify API Call Failed: ${err.message}`, 'error');
    throw err;
  }
}

// Verify connection
async function verifyConnection() {
  log('Verifying Shopify connection...');
  try {
    const shopData = await callShopify('shop.json');
    if (shopData && shopData.shop) {
      log(`Connected successfully to store: ${shopData.shop.name} (${shopData.shop.email})`);
      btnSaveCredentials.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      btnSaveCredentials.textContent = 'Connected ✓';
    }
  } catch (err) {
    btnSaveCredentials.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    btnSaveCredentials.textContent = 'Connection Failed ❌';
  }
}

// Dropzone file loaders
function setupDropzones() {
  const dropzones = [
    { id: 'dropzone-14-gloss', name: '14 pt. Gloss' },
    { id: 'dropzone-14-uncoated', name: '14 pt. Uncoated' },
    { id: 'dropzone-16-matte', name: '16 pt. Premium Matte' }
  ];
  
  dropzones.forEach(dz => {
    const el = document.getElementById(dz.id);
    if (!el) return;
    
    el.addEventListener('dragover', (e) => {
      e.preventDefault();
      el.style.borderColor = 'var(--accent-teal)';
    });
    
    el.addEventListener('dragleave', () => {
      el.style.borderColor = 'rgba(255, 255, 255, 0.15)';
    });
    
    el.addEventListener('drop', (e) => {
      e.preventDefault();
      el.style.borderColor = 'rgba(255, 255, 255, 0.15)';
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileLoad(files[0], dz.name, el);
      }
    });
    
    el.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = (e) => {
        if (e.target.files.length > 0) {
          handleFileLoad(e.target.files[0], dz.name, el);
        }
      };
      input.click();
    });
  });
}

function handleFileLoad(file, paperName, el) {
  log(`Loading file: ${file.name} for ${paperName}...`);
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const json = JSON.parse(e.target.result);
      if (!json.results || !Array.isArray(json.results)) {
        throw new Error('Invalid formats: missing results array.');
      }
      scrapedData = json.results;
      el.style.borderColor = 'var(--accent-teal)';
      el.innerHTML = `✓ Mapped ${scrapedData.length} records successfully!`;
      log(`Successfully loaded ${scrapedData.length} pricing combinations for ${paperName}.`);
    } catch (err) {
      log(`Error parsing file: ${err.message}`, 'error');
      el.style.borderColor = '#ef4444';
      el.innerHTML = `❌ Error: ${err.message}`;
    }
  };
  reader.readAsText(file);
}

// 📦 SIBLING GENERATION LOGIC
btnCreateSiblings.addEventListener('click', async () => {
  if (!scrapedData) {
    log('Please upload a valid pricing dataset first.', 'error');
    return;
  }
  if (!credentials.shop || !credentials.token) {
    log('Please connect your Shopify store first.', 'error');
    return;
  }
  
  log('Starting sibling products generator process...', 'warn');
  
  // 1. Group combinations by Size & Orientation (each unique group is a separate sibling product)
  const sizes = ['2" x 3.5" U.S. Standard', '1.75" x 3"', '1.75" x 3.5"', '2" x 3"', '2.17" x 3.35" European Standard'];
  const orientations = ['Horizontal', 'Vertical'];
  
  const siblingGroupKey = `business-cards-14pt-gloss-${Date.now()}`;
  const createdProducts = [];
  
  for (const size of sizes) {
    for (const orientation of orientations) {
      const cleanSizeName = size.split(' ')[0].replace('"', '');
      const productTitle = `Business Cards - 14 pt. Gloss - ${cleanSizeName} (${orientation})`;
      const productHandle = `business-cards-14pt-gloss-${cleanSizeName.replace('.', '')}-${orientation.toLowerCase()}`;
      
      log(`Creating sibling product: ${productTitle}...`);
      
      // Filter combinations matching this size
      const combosForSize = scrapedData.filter(item => {
        // Size ID 101 corresponds to standard 2x3.5
        if (size.includes('2" x 3.5"') && item.size === '2x3.5') return true;
        return false; // For now we do 2x3.5 prototype
      });
      
      if (combosForSize.length === 0) {
        log(`No pricing combinations found for size: ${size}. Skipping.`, 'warn');
        continue;
      }
      
      // Build variants payload
      // Options are: Quantity, Color, Rounded Corners
      const optionQuantities = [...new Set(combosForSize.map(c => c.quantity))];
      const optionColors = [...new Set(combosForSize.map(c => c.color))];
      const optionCorners = [...new Set(combosForSize.map(c => c.roundedCorners.includes('Round') ? 'Round Corners' : 'None'))];
      
      const variantsPayload = [];
      
      for (const qty of optionQuantities) {
        for (const col of optionColors) {
          for (const crn of optionCorners) {
            // Find matched price
            const match = combosForSize.find(c => 
              c.quantity === qty && 
              c.color === col && 
              ((crn === 'Round Corners' && c.roundedCorners.includes('Round')) || (crn === 'None' && c.roundedCorners === 'None'))
            );
            
            const price = match && match.price !== 'Not found' ? match.price.replace('$', '') : null;
            if (!price) continue; // Skip non-existent variant options
            
            variantsPayload.push({
              title: `${qty} / ${col} / ${crn}`,
              option1: qty,
              option2: col,
              option3: crn,
              price: price,
              inventory_management: null,
              requires_shipping: true,
              taxable: true
            });
          }
        }
      }
      
      const productData = {
        product: {
          title: productTitle,
          handle: productHandle,
          body_html: `<strong>Premium Business Cards</strong> - Printed on heavy 14 pt. Gloss paper stock.`,
          vendor: 'Pixilab',
          product_type: 'Business Cards',
          status: 'active',
          options: [
            { name: 'Quantity' },
            { name: 'Color' },
            { name: 'Rounded Corners' }
          ],
          variants: variantsPayload
        }
      };
      
      try {
        const result = await callShopify('products.json', 'POST', productData);
        if (result && result.product) {
          log(`Created Shopify Product: ${result.product.title} (ID: ${result.product.id})`);
          createdProducts.push({
            id: result.product.id,
            handle: result.product.handle,
            title: result.product.title,
            size: cleanSizeName,
            orientation: orientation
          });
        }
      } catch (err) {
        log(`Failed to create product ${productTitle}: ${err.message}`, 'error');
      }
    }
  }
  
  if (createdProducts.length > 0) {
    log(`Created ${createdProducts.length} sibling products. Setting up Sibling Links metafield...`, 'warn');
    
    // Save Sibling Links Metafield to each created product
    for (const prod of createdProducts) {
      const metafieldData = {
        metafield: {
          namespace: 'custom',
          key: 'sibling_group',
          value: JSON.stringify({
            group_id: siblingGroupKey,
            siblings: createdProducts.map(p => ({
              id: p.id,
              title: p.title,
              handle: p.handle,
              size: p.size,
              orientation: p.orientation
            }))
          }),
          type: 'json'
        }
      };
      
      try {
        await callShopify(`products/${prod.id}/metafields.json`, 'POST', metafieldData);
        log(`Linked sibling: ${prod.title} successfully.`);
      } catch (err) {
        log(`Failed to set metafield for ${prod.title}: ${err.message}`, 'error');
      }
    }
    
    log('🎉 Sibling products setup is complete and fully synced!', 'info');
    updateDashboardTables(createdProducts);
  }
});

// Update Sibling Table on dashboard UI
function updateDashboardTables(products) {
  const tbody = document.getElementById('sibling-table-body');
  tbody.innerHTML = '';
  
  if (products.length === 0) return;
  
  const tr = document.createElement('tr');
  
  let badges = '';
  products.forEach(p => {
    badges += `<span class="link-badge">${p.size} ${p.orientation[0]}</span>`;
  });
  
  tr.innerHTML = `
    <td>Business Cards - 14 pt. Gloss (Group)</td>
    <td>14 pt. Gloss</td>
    <td>${badges}</td>
    <td>Just now</td>
    <td><span class="status-pill">Synced</span></td>
    <td><button class="btn btn-secondary" onclick="alert('Sync successful')">Sync Now</button></td>
  `;
  
  tbody.appendChild(tr);
}

// Nav toggling logic
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const viewContents = document.querySelectorAll('.view-content');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetView = item.getAttribute('data-view');
      if (!targetView) return;

      // Remove active class from all items and views
      navItems.forEach(nav => nav.classList.remove('active'));
      viewContents.forEach(view => view.classList.remove('active'));

      // Add active class to clicked item and target view
      item.classList.add('active');
      const targetEl = document.getElementById(`view-${targetView}`);
      if (targetEl) {
        targetEl.classList.add('active');
      }
    });
  });
}

// Check if we are receiving an OAuth redirection code from Shopify
async function checkOAuthCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const shop = urlParams.get('shop');
  const hmac = urlParams.get('hmac');

  if (code && shop) {
    log(`OAuth authorization code received from store: ${shop}. Exchanging for token...`);
    
    // Set loading indicator on save button
    btnSaveCredentials.textContent = 'Connecting...';
    btnSaveCredentials.style.background = 'linear-gradient(135deg, var(--accent-purple), #7c3aed)';

    try {
      const authEndpoint = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? `http://localhost:${PORT}/api/auth`
        : '/api/auth';

      const response = await fetch(authEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, shop })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Token exchange failed: ${errorText}`);
      }

      const data = await response.json();
      if (data.access_token) {
        log('Token successfully exchanged and saved!', 'success');
        
        // Save to localStorage
        localStorage.setItem('shopify_domain', shop);
        localStorage.setItem('shopify_token', data.access_token);
        
        // Update credentials
        credentials.shop = shop;
        credentials.token = data.access_token;
        shopDomainInput.value = shop;
        accessTokenInput.value = data.access_token;

        // Clean up URL query parameters cleanly
        const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({ path: cleanUrl }, '', cleanUrl);

        // Verify connection immediately
        verifyConnection();
      } else {
        throw new Error('Access token not found in response');
      }
    } catch (err) {
      log(`OAuth Token Exchange Failed: ${err.message}`, 'error');
      btnSaveCredentials.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
      btnSaveCredentials.textContent = 'OAuth Failed ❌';
    }
  } else if (shop && hmac) {
    // Page was opened by Shopify (either iframe or redirect) but we don't have the token yet
    const token = localStorage.getItem('shopify_token');
    
    // If we have no token, or it's still the old expired fallback token:
    if (!token || token.startsWith('shpat_8573091949')) {
      log('No active token found in localStorage. Initiating Shopify OAuth handshake...');
      
      const client_id = "ba7a82e65c2cdd1dbf98c766b09ab4aa";
      const redirect_uri = "https://shopifydevstudioxpixi.vercel.app/";
      const authorizeUrl = `https://${shop}/admin/oauth/authorize?client_id=${client_id}&scope=read_products,write_products&redirect_uri=${encodeURIComponent(redirect_uri)}`;
      
      log(`Redirecting to Shopify Authorize screen: ${authorizeUrl}`);
      
      // Escape iframe frame-busting to redirect the parent tab using target=_top
      try {
        window.open(authorizeUrl, '_top');
      } catch (e) {
        window.location.href = authorizeUrl;
      }
    }
  }
}

// Initial triggers
window.onload = () => {
  loadCredentials();
  setupDropzones();
  setupNavigation();
  checkOAuthCallback();
};
