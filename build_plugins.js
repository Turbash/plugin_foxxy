const fs = require('fs');
const path = require('path');

const PLUGIN_FOLDERS = ['amazon', 'youtube', 'twitter', 'linkedin', 'gmail', 'docs.google'];
const SOURCE_DIR = __dirname;
const OUTPUT_DIR = path.join(__dirname, 'test_extension', 'plugins');

console.log('🔨 Building plugins...\n');

for (const pluginName of PLUGIN_FOLDERS) {
  const sourceFile = path.join(SOURCE_DIR, pluginName, 'foxxy.js');
  const outputDir = path.join(OUTPUT_DIR, pluginName);
  const outputFile = path.join(outputDir, 'foxxy.js');
  const jsonFile = path.join(SOURCE_DIR, pluginName, 'foxxy.json');
  const jsonOutput = path.join(outputDir, 'foxxy.json');
  
  if (!fs.existsSync(sourceFile)) {
    console.log(`⚠️  Skipping ${pluginName} - source not found`);
    continue;
  }
  
  // Read source
  let code = fs.readFileSync(sourceFile, 'utf8');
  
  // Transform: wrap in IIFE and convert exports to window assignments
  const transformed = `
// Auto-generated from ${pluginName}/foxxy.js
// DO NOT EDIT - Run build_plugins.js to regenerate

(function() {
  ${code
    .replace(/export async function (\w+)/g, 'window.__foxxy_$1 = async function $1')
    .replace(/export function (\w+)/g, 'window.__foxxy_$1 = function $1')}
})();
`;
  
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write transformed file
  fs.writeFileSync(outputFile, transformed, 'utf8');
  
  // Copy JSON file
  if (fs.existsSync(jsonFile)) {
    fs.copyFileSync(jsonFile, jsonOutput);
  }
  
  console.log(`✅ Built ${pluginName}`);
}

console.log('\n🎉 All plugins built successfully!');
