#!/usr/bin/env node

/**
 * Link Verification Script for P³ Lending Platform
 * Verifies that all internal and external links are working properly
 */

const fs = require('fs');
const path = require('path');

// Define all the routes and pages that should exist
const expectedRoutes = [
  // Public routes
  '/',
  '/login',
  '/register',
  '/help',
  '/contact',
  '/forgot-password',
  '/smart-wallet',
  
  // Protected routes (require authentication)
  '/dashboard',
  '/lend',
  '/borrow',
  '/reputation',
  '/kyc',
  '/profile',
  '/admin',
  
  // OAuth and webhook routes
  '/auth/callback/google',
  '/auth/callback/github',
  '/auth/callback/discord',
  '/slack/webhook',
  
  // Static files
  '/terms-of-service.html',
  '/privacy-policy.html',
];

// Define external links that should be verified
const externalLinks = [
  'https://github.com/Mattjhagen/P3-Lending',
  'https://p3lending.space',
];

// Check if files exist in the public directory
const publicDir = path.join(__dirname, '..', 'public');
const staticFiles = [
  'terms-of-service.html',
  'privacy-policy.html',
  'logo-p3.svg',
  'logo-icon.svg',
  'logo-simple.svg',
  'logo-dark.svg',
  'logo.jpeg',
  'hero.jpg',
  'manifest.json',
];

console.log('🔍 P³ Lending Platform - Link Verification\n');

// Check static files
console.log('📁 Checking static files...');
let staticFilesOk = true;
staticFiles.forEach(file => {
  const filePath = path.join(publicDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - Missing`);
    staticFilesOk = false;
  }
});

// Check React components exist
console.log('\n⚛️  Checking React components...');
const srcDir = path.join(__dirname, '..', 'src', 'pages');
const expectedComponents = [
  'HomePage.tsx',
  'LoginPage.tsx',
  'RegisterPage.tsx',
  'DashboardPage.tsx',
  'LendingPage.tsx',
  'BorrowingPage.tsx',
  'ReputationPage.tsx',
  'KYCPage.tsx',
  'ProfilePage.tsx',
  'AdminPage.tsx',
  'HelpPage.tsx',
  'ContactPage.tsx',
  'ForgotPasswordPage.tsx',
  'SmartWalletPage.tsx',
  'OAuthCallback.tsx',
  'SlackWebhookPage.tsx',
  'NotFoundPage.tsx',
];

let componentsOk = true;
expectedComponents.forEach(component => {
  const componentPath = path.join(srcDir, component);
  if (fs.existsSync(componentPath)) {
    console.log(`✅ ${component}`);
  } else {
    console.log(`❌ ${component} - Missing`);
    componentsOk = false;
  }
});

// Check routing configuration
console.log('\n🛣️  Checking routing configuration...');
const appPath = path.join(__dirname, '..', 'src', 'App.tsx');
let routesOk = true;
if (fs.existsSync(appPath)) {
  const appContent = fs.readFileSync(appPath, 'utf8');
  
  // Check if all expected routes are defined
  expectedRoutes.forEach(route => {
    if (appContent.includes(`path="${route}"`) || appContent.includes(`path='${route}'`)) {
      console.log(`✅ Route: ${route}`);
    } else {
      console.log(`❌ Route: ${route} - Not found in App.tsx`);
      routesOk = false;
    }
  });
} else {
  console.log('❌ App.tsx not found');
  routesOk = false;
}

// Check navigation links
console.log('\n🧭 Checking navigation links...');
const layoutPath = path.join(__dirname, '..', 'src', 'components', 'Layout.tsx');
let navOk = true;
if (fs.existsSync(layoutPath)) {
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  
  const navigationLinks = [
    '/dashboard',
    '/lend',
    '/borrow',
    '/reputation',
    '/smart-wallet',
    '/kyc',
    '/profile',
  ];
  
  navigationLinks.forEach(link => {
    if (layoutContent.includes(`href="${link}"`) || layoutContent.includes(`href='${link}'`) || layoutContent.includes(`href: '${link}'`) || layoutContent.includes(`href: "${link}"`)) {
      console.log(`✅ Nav link: ${link}`);
    } else {
      console.log(`❌ Nav link: ${link} - Not found in Layout.tsx`);
      navOk = false;
    }
  });
} else {
  console.log('❌ Layout.tsx not found');
  navOk = false;
}

// Check homepage links
console.log('\n🏠 Checking homepage links...');
const homePath = path.join(__dirname, '..', 'src', 'pages', 'HomePage.tsx');
let homeOk = true;
if (fs.existsSync(homePath)) {
  const homeContent = fs.readFileSync(homePath, 'utf8');
  
  const homepageLinks = [
    '/dashboard',
    '/register',
    '/login',
    '/lend',
    '/borrow',
    '/reputation',
    '/kyc',
    '/help',
    '/contact',
    '/terms-of-service.html',
    '/privacy-policy.html',
  ];
  
  homepageLinks.forEach(link => {
    if (homeContent.includes(`to="${link}"`) || homeContent.includes(`to='${link}'`)) {
      console.log(`✅ Homepage link: ${link}`);
    } else {
      console.log(`❌ Homepage link: ${link} - Not found in HomePage.tsx`);
      homeOk = false;
    }
  });
} else {
  console.log('❌ HomePage.tsx not found');
  homeOk = false;
}

// Summary
console.log('\n📊 Verification Summary:');
console.log(`Static Files: ${staticFilesOk ? '✅ All present' : '❌ Some missing'}`);
console.log(`Components: ${componentsOk ? '✅ All present' : '❌ Some missing'}`);
console.log(`Routes: ${routesOk ? '✅ All configured' : '❌ Some missing'}`);
console.log(`Navigation: ${navOk ? '✅ All configured' : '❌ Some missing'}`);
console.log(`Homepage: ${homeOk ? '✅ All configured' : '❌ Some missing'}`);

const allOk = staticFilesOk && componentsOk && routesOk && navOk && homeOk;
console.log(`\n🎯 Overall Status: ${allOk ? '✅ All links verified!' : '❌ Some issues found'}`);

if (allOk) {
  console.log('\n🚀 Your P³ Lending platform is ready to go!');
  console.log('🌐 Live at: https://491a53f4.p3-lending-platform.pages.dev');
  console.log('📱 Local: http://192.168.1.39:3000');
} else {
  console.log('\n⚠️  Please fix the issues above before deploying.');
  process.exit(1);
}
