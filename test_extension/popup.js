// Styled console logging with UI display
function addUILog(emoji, msg, color) {
  const debugLog = document.getElementById('debugLog');
  if (debugLog) {
    debugLog.style.display = 'block';
    const time = new Date().toLocaleTimeString();
    debugLog.innerHTML += `<div style="color: ${color}; margin-bottom: 3px;">[${time}] ${emoji} ${msg}</div>`;
    debugLog.scrollTop = debugLog.scrollHeight;
  }
}

const log = {
  info: (msg, data) => {
    console.log(`%c🦊 FOXXY INFO %c${msg}`, 
      'background: #667eea; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;',
      'color: #667eea; font-weight: bold;',
      data || '');
    addUILog('🦊', msg, '#a5b4fc');
  },
  success: (msg, data) => {
    console.log(`%c✅ SUCCESS %c${msg}`, 
      'background: #10b981; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;',
      'color: #10b981; font-weight: bold;',
      data || '');
    addUILog('✅', msg, '#4ade80');
  },
  error: (msg, error) => {
    console.error(`%c❌ ERROR %c${msg}`, 
      'background: #ef4444; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;',
      'color: #ef4444; font-weight: bold;',
      error || '');
    addUILog('❌', msg, '#f87171');
  },
  warn: (msg, data) => {
    console.warn(`%c⚠️ WARNING %c${msg}`, 
      'background: #f59e0b; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;',
      'color: #f59e0b; font-weight: bold;',
      data || '');
    addUILog('⚠️', msg, '#fbbf24');
  },
  debug: (msg, data) => {
    console.log(`%c🔍 DEBUG %c${msg}`, 
      'background: #8b5cf6; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;',
      'color: #8b5cf6;',
      data || '');
    addUILog('🔍', msg, '#c4b5fd');
  }
};

// Plugin registry - maps domain patterns to plugin folders
const PLUGIN_REGISTRY = {
  'amazon': 'amazon',      // matches amazon.*
  'youtube.com': 'youtube',
  'twitter.com': 'twitter',
  'x.com': 'twitter',
  'linkedin.com': 'linkedin',
  'mail.google.com': 'gmail',
  'docs.google.com': 'docs.google'
};

let currentPlugin = null;
let currentTab = null;
let pluginInjected = false;

// Initialize when popup opens
document.addEventListener('DOMContentLoaded', async () => {
  log.info('Extension popup opened');
  
  try {
    log.debug('Querying active tab...');
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    currentTab = tab;
    log.success('Got active tab', { id: tab.id, url: tab.url });
    
    const url = new URL(tab.url);
    const hostname = url.hostname.replace('www.', '');
    log.debug('Parsed hostname', { original: url.hostname, cleaned: hostname });
    
    // Find matching plugin
    log.debug('Searching for matching plugin...', { hostname, registry: PLUGIN_REGISTRY });
    const pluginName = Object.keys(PLUGIN_REGISTRY).find(domain => 
      hostname.includes(domain)
    );
    
    if (!pluginName) {
      log.warn('No plugin found for hostname', hostname);
      showNoPlugin(hostname);
      return;
    }
    
    log.success('Found matching plugin', pluginName);
    
    // Load plugin JSON
    const pluginFolder = PLUGIN_REGISTRY[pluginName];
    const jsonPath = chrome.runtime.getURL(`plugins/${pluginFolder}/foxxy.json`);
    log.debug('Loading plugin JSON', { folder: pluginFolder, path: jsonPath });
    
    try {
      const response = await fetch(jsonPath);
      log.debug('Fetch response status', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      currentPlugin = await response.json();
      log.success('Plugin JSON loaded successfully', currentPlugin);
      renderPlugin(currentPlugin);
    } catch (e) {
      log.error('Failed to load plugin JSON', e);
      showNoPlugin(hostname, `Plugin files not found: ${e.message}`);
    }
    
  } catch (error) {
    log.error('Fatal error in popup initialization', error);
    showNoPlugin('unknown', error.message);
  }
});

function showNoPlugin(hostname, message = 'No plugin available for this site') {
  log.warn('Showing no plugin screen', { hostname, message });
  document.getElementById('siteName').textContent = hostname;
  document.getElementById('content').innerHTML = `
    <div class="no-plugin">
      <div style="font-size: 48px; margin-bottom: 15px;">🚫</div>
      <div style="font-size: 14px; margin-bottom: 10px;">No Plugin Found</div>
      <div style="font-size: 12px; opacity: 0.7;">${message}</div>
    </div>
  `;
}

function renderPlugin(plugin) {
  log.info('Rendering plugin UI', { 
    name: plugin.name, 
    site: plugin.site,
    capabilityCount: Object.keys(plugin.capabilities || {}).length,
    contextCount: Object.keys(plugin.contexts || {}).length
  });
  
  document.getElementById('siteName').textContent = plugin.name || plugin.site;
  
  const contexts = Object.keys(plugin.contexts || {});
  const allCapabilities = plugin.capabilities || {};
  
  log.debug('Plugin structure', { contexts, capabilities: Object.keys(allCapabilities) });
  
  let html = '';
  
  // Plugin info
  html += `
    <div class="plugin-info">
      <div><strong>Site:</strong> ${plugin.site}</div>
      <div><strong>Version:</strong> ${plugin.version}</div>
      <div><strong>Capabilities:</strong> ${Object.keys(allCapabilities).length}</div>
    </div>
  `;
  
  // Context selector if multiple contexts exist
  if (contexts.length > 1) {
    html += `
      <div class="context-section">
        <div class="context-title">Select Context</div>
        <select class="context-select" id="contextSelect">
          <option value="all">All Capabilities</option>
          ${contexts.map(ctx => `<option value="${ctx}">${ctx.replace('_', ' ')}</option>`).join('')}
        </select>
      </div>
    `;
  }
  
  // Capabilities section
  html += '<div class="capabilities" id="capabilitiesList"></div>';
  
  // Result section
  html += `
    <div class="result-section" id="resultSection" style="display: none;">
      <div class="result-title">Result:</div>
      <div class="result-content" id="resultContent"></div>
    </div>
  `;
  
  document.getElementById('content').innerHTML = html;
  
  // Reset injection flag when plugin changes
  pluginInjected = false;
  
  // Render all capabilities initially
  log.debug('Rendering initial capabilities');
  renderCapabilities('all');
  
  // Add context selector listener
  const contextSelect = document.getElementById('contextSelect');
  if (contextSelect) {
    log.debug('Context selector found, adding listener');
    contextSelect.addEventListener('change', (e) => {
      log.info('Context changed', e.target.value);
      renderCapabilities(e.target.value);
    });
  }
  
  log.success('Plugin UI rendered successfully');
}

function renderCapabilities(contextFilter) {
  log.debug('Rendering capabilities', { contextFilter });
  
  const capabilities = currentPlugin.capabilities || {};
  const contexts = currentPlugin.contexts || {};
  
  let filteredCaps = Object.keys(capabilities);
  
  if (contextFilter !== 'all') {
    filteredCaps = contexts[contextFilter] || [];
    log.debug('Filtered capabilities by context', { context: contextFilter, count: filteredCaps.length });
  }
  
  log.info(`Displaying ${filteredCaps.length} capabilities`);
  
  const capsList = document.getElementById('capabilitiesList');
  capsList.innerHTML = filteredCaps.map(capName => {
    const cap = capabilities[capName];
    const params = cap.params || [];
    
    return `
      <div class="capability" data-cap-name="${capName}">
        <div class="capability-header">
          <span class="capability-name">${capName}()</span>
        </div>
        <div class="capability-desc">${cap.description}</div>
        ${params.length > 0 ? `
          <div class="param-section">
            ${params.map(param => {
              // Handle object-style params with metadata
              const isObjectParam = typeof param === 'object';
              const paramName = isObjectParam ? param.name : param.replace('?', '');
              const isOptional = isObjectParam ? false : param.endsWith('?');
              const paramType = isObjectParam ? param.type : 'text';
              const enumValues = isObjectParam && param.values ? param.values : [];
              
              if (paramType === 'enum' && enumValues.length > 0) {
                // Render as dropdown for enum types
                return `
                  <div class="param-label">${paramName}${isOptional ? ' (optional)' : ''}</div>
                  <select 
                    class="param-input" 
                    data-param="${paramName}"
                  >
                    ${enumValues.map(value => `<option value="${value}">${value}</option>`).join('')}
                  </select>
                `;
              } else {
                // Render as text input for other types
                return `
                  <div class="param-label">${paramName}${isOptional ? ' (optional)' : ''}</div>
                  <input 
                    type="text" 
                    class="param-input" 
                    data-param="${paramName}"
                    placeholder="Enter ${paramName}..."
                  />
                `;
              }
            }).join('')}
          </div>
        ` : ''}
        <button class="execute-btn" data-cap-name="${capName}">
          Execute
        </button>
      </div>
    `;
  }).join('');
  
  // Add click listeners to execute buttons
  document.querySelectorAll('.execute-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const capName = btn.dataset.capName;
      log.info('Button clicked', capName);
      executeCapability(capName);
    });
  });
}

async function executeCapability(capName) {
  log.info('='.repeat(50));
  log.info(`Executing capability: ${capName}`);
  
  const resultSection = document.getElementById('resultSection');
  const resultContent = document.getElementById('resultContent');
  
  resultSection.style.display = 'block';
  resultContent.className = 'result-content';
  resultContent.textContent = 'Executing...';
  
  try {
    // Get parameters from inputs
    const cap = currentPlugin.capabilities[capName];
    log.debug('Capability definition', cap);
    
    const params = cap.params || [];
    const args = {};
    
    if (params.length > 0) {
      log.debug('Collecting parameters', { expectedParams: params });
      const capabilityDiv = document.querySelector(`.capability[data-cap-name="${capName}"]`);
      const inputs = capabilityDiv.querySelectorAll('.param-input');
      
      inputs.forEach(input => {
        const paramName = input.dataset.param;
        let value = input.value;
        // Convert to number if it looks like a number
        if (value && !isNaN(value)) {
          value = Number(value);
        }
        // Only add if value is not empty (to support optional params)
        if (value !== '' && value !== null && value !== undefined) {
          args[paramName] = value;
        }
        log.debug(`Parameter collected: ${paramName}`, value);
      });
    }
    
    log.info('Final arguments', args);
    
    // Get plugin folder name
    const url = new URL(currentTab.url);
    const hostname = url.hostname.replace('www.', '');
    const pluginDomain = Object.keys(PLUGIN_REGISTRY).find(domain => 
      hostname.includes(domain)
    );
    const pluginFolder = PLUGIN_REGISTRY[pluginDomain];
    
    log.debug('Plugin execution details', {
      hostname,
      pluginFolder,
      pluginAlreadyInjected: pluginInjected
    });
    
    // Check if plugin is actually injected in the page
    log.info('Checking if plugin is already injected in page...');
    const checkResult = await chrome.scripting.executeScript({
      target: { tabId: currentTab.id },
      world: 'MAIN',
      func: () => {
        const foxxyFuncs = Object.keys(window).filter(k => k.startsWith('__foxxy_'));
        return foxxyFuncs.length > 0;
      }
    });
    
    const isActuallyInjected = checkResult[0].result;
    log.debug('Page injection check', { isActuallyInjected });
    
    // Inject plugin code if not already injected in the page
    if (!isActuallyInjected) {
      log.info('Injecting pre-compiled plugin code...');
      
      // Inject the pre-compiled plugin file directly
      const injectionResult = await chrome.scripting.executeScript({
        target: { tabId: currentTab.id },
        world: 'MAIN',
        files: [`plugins/${pluginFolder}/foxxy.js`]
      });
      
      log.success('Plugin code injected from file');
      
      // Verify injection worked
      const verifyResult = await chrome.scripting.executeScript({
        target: { tabId: currentTab.id },
        world: 'MAIN',
        func: () => {
          const foxxyFuncs = Object.keys(window).filter(k => k.startsWith('__foxxy_'));
          console.log('🦊 Available functions:', foxxyFuncs);
          return foxxyFuncs;
        }
      });
      
      const injectedFunctions = verifyResult[0].result;
      log.success('Verified functions', { functions: injectedFunctions });
      
      if (injectedFunctions.length === 0) {
        throw new Error('Plugin injection failed - no functions found after injection');
      }
      
      pluginInjected = true;
      
      // Wait a bit for script to be fully loaded
      await new Promise(resolve => setTimeout(resolve, 100));
    } else {
      log.info('Plugin already injected in page');
    }
    
    // Execute in content script
    log.info('Executing function in page...');
    const result = await chrome.scripting.executeScript({
      target: { tabId: currentTab.id },
      world: 'MAIN',
      func: executePluginFunctionInPage,
      args: [capName, args]
    });
    
    log.debug('Script execution completed', result);
    
    const execResult = result[0].result;
    log.info('Execution result', execResult);
    
    if (execResult.error) {
      log.error('Function returned error', execResult.error);
      resultContent.className = 'result-content error';
      resultContent.textContent = `Error: ${execResult.error}`;
    } else {
      log.success('Function executed successfully', execResult.result);
      resultContent.className = 'result-content success';
      resultContent.textContent = execResult.result === undefined 
        ? 'Success ✓' 
        : JSON.stringify(execResult.result, null, 2);
    }
    
  } catch (error) {
    log.error('Execution failed with exception', error);
    resultContent.className = 'result-content error';
    resultContent.textContent = `Error: ${error.message}\n${error.stack}`;
  }
  
  log.info('='.repeat(50));
}

// This function runs in the page context
async function executePluginFunctionInPage(capName, args) {
  const log = {
    info: (msg, data) => console.log(`%c🦊 PAGE %c${msg}`, 'background: #667eea; color: white; padding: 2px 6px; border-radius: 3px;', 'color: #667eea;', data || ''),
    error: (msg, error) => console.error(`%c❌ PAGE %c${msg}`, 'background: #ef4444; color: white; padding: 2px 6px; border-radius: 3px;', 'color: #ef4444;', error || '')
  };
  
  try {
    log.info('executePluginFunctionInPage called', { capName, args });
    
    // Get function from window
    const funcName = `__foxxy_${capName}`;
    log.info('Looking for function', funcName);
    
    const func = window[funcName];
    if (!func) {
      const available = Object.keys(window).filter(k => k.startsWith('__foxxy_')).map(k => k.replace('__foxxy_', ''));
      log.error('Function not found', { capName, available });
      return { error: `Function ${capName} not found. Available: ${available.join(', ')}` };
    }
    
    log.info('Executing function', { capName, args });
    const result = await func(args);
    log.info('Function completed', result);
    
    return { result };
    
  } catch (error) {
    log.error('Exception in executePluginFunctionInPage', error);
    return { error: `${error.message}\n${error.stack}` };
  }
}
