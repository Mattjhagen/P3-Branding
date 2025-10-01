#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Applying Reown AppKit fixes...');

// Fix CaipNetworkUtil.js files
const caipNetworkUtilFiles = [
  'node_modules/@reown/appkit-utils/dist/esm/src/CaipNetworkUtil.js',
  'node_modules/@walletconnect/ethereum-provider/node_modules/@reown/appkit-utils/dist/esm/src/CaipNetworkUtil.js'
];

// Fix WalletConnectConnector.js
const walletConnectConnectorFile = 'node_modules/@reown/appkit-adapter-wagmi/dist/esm/src/connectors/WalletConnectConnector.js';

function applyFix(filePath, oldString, newString, description) {
  try {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      if (content.includes(oldString)) {
        content = content.replace(oldString, newString);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Fixed: ${description}`);
        return true;
      } else {
        console.log(`⚠️  Already fixed or not found: ${description}`);
        return false;
      }
    } else {
      console.log(`❌ File not found: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

let fixesApplied = 0;

// Fix CaipNetworkUtil.js files
caipNetworkUtilFiles.forEach(filePath => {
  const fixed = applyFix(
    filePath,
    'return caipNetworks.map(caipNetwork => CaipNetworksUtil.extendCaipNetwork(caipNetwork, {',
    'return (caipNetworks || []).map(caipNetwork => CaipNetworksUtil.extendCaipNetwork(caipNetwork, {',
    `CaipNetworkUtil.js null check in ${path.basename(path.dirname(path.dirname(filePath)))}`
  );
  if (fixed) fixesApplied++;
});

// Fix WalletConnectConnector.js
const fixed = applyFix(
  walletConnectConnectorFile,
  'this.setRequestedChainsIds(caipNetworks.map(x => Number(x.id)));',
  'this.setRequestedChainsIds((caipNetworks || []).map(x => Number(x.id)));',
  'WalletConnectConnector.js null check'
);
if (fixed) fixesApplied++;

console.log(`🎯 Applied ${fixesApplied} fixes to prevent CaipNetworkUtil.js TypeError`);
console.log('✨ Reown AppKit fixes complete!');
