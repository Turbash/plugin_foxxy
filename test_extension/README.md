# Foxxy Plugin Tester Extension

A beautiful Chrome extension for testing Foxxy plugins.

## Installation

1. Copy your plugin folders to `test_extension/plugins/`:
   ```
   test_extension/
   ├── plugins/
   │   ├── amazon/
   │   │   ├── foxxy.json
   │   │   └── foxxy.js
   │   ├── youtube/
   │   ├── twitter/
   │   ├── linkedin/
   │   └── gmail/
   ```

2. Create placeholder icons (or add your own):
   - icon16.png (16x16)
   - icon48.png (48x48)
   - icon128.png (128x128)

3. Load in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `test_extension` folder

## Usage

1. Navigate to a supported site (Amazon, YouTube, Twitter, LinkedIn, Gmail)
2. Click the Foxxy extension icon
3. See available capabilities for the current page
4. Fill in any required parameters
5. Click "Execute" to run the function
6. See results in the result panel

## Features

- 🎨 Beautiful gradient UI
- 🔍 Auto-detects plugin based on current site
- 🎯 Context-aware capability filtering
- 📝 Parameter input for functions
- ✅ Real-time execution results
- 🚀 Direct function execution in page context
