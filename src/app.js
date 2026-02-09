/**
 * Global Pantry Chef - Main SPA Router
 * Hash-based routing: #/setup/pantry, #/setup/preferences, etc.
 */

import { renderPantryPage } from './pages/pantry.js';
import { renderPreferencesPage } from './pages/preferences.js';
import { renderDiscoveryPage } from './pages/discovery.js';
import { renderRecipeDetailPage } from './pages/recipe-detail.js';
import { renderCookingPage } from './pages/cooking.js';

const PAGES = {
  '/': 'home',
  '/setup/pantry': 'pantry',
  '/setup/preferences': 'preferences',
  '/recipes': 'discovery',
  '/recipes/:id': 'recipe-detail',
  '/cook/:id': 'cooking',
};

let currentRoute = '/setup/pantry';

/**
 * Parse hash route and return path + params
 */
function parseRoute(hash) {
  const path = hash.replace('#', '') || '/setup/pantry';
  const [pathname, search] = path.split('?');
  return { pathname, search };
}

/**
 * Extract route params (e.g., :id from /recipes/:id)
 */
function extractParams(pathname, pattern) {
  const pathParts = pathname.split('/').filter(p => p);
  const patternParts = pattern.split('/').filter(p => p);
  const params = {};

  patternParts.forEach((part, idx) => {
    if (part.startsWith(':')) {
      const paramName = part.slice(1);
      params[paramName] = pathParts[idx];
    }
  });

  return params;
}

/**
 * Match route pathname to a route pattern
 */
function matchRoute(pathname) {
  for (const [pattern] of Object.entries(PAGES)) {
    const patternParts = pattern.split('/').filter(p => p);
    const pathParts = pathname.split('/').filter(p => p);

    if (patternParts.length !== pathParts.length) continue;

    let matches = true;
    for (let i = 0; i < patternParts.length; i++) {
      if (!patternParts[i].startsWith(':') && patternParts[i] !== pathParts[i]) {
        matches = false;
        break;
      }
    }

    if (matches) {
      return { pattern, params: extractParams(pathname, pattern) };
    }
  }

  return null;
}

/**
 * Router: handle hash changes and render pages
 */
async function handleRoute() {
  const hash = window.location.hash || '#/setup/pantry';
  const { pathname } = parseRoute(hash);

  const outlet = document.getElementById('page-outlet');
  if (!outlet) {
    console.error('Page outlet not found');
    return;
  }

  // Clear outlet
  outlet.innerHTML = '';

  // Match route and render
  const matched = matchRoute(pathname);
  if (!matched) {
    outlet.innerHTML = '<div class="page"><div class="container"><p>Page not found.</p></div></div>';
    return;
  }

  const { pattern, params } = matched;

  // Route handling
  if (pattern === '/' || pattern === '/setup/pantry') {
    renderPantryPage(outlet);
  } else if (pattern === '/setup/preferences') {
    renderPreferencesPage(outlet);
  } else if (pattern === '/recipes') {
    renderDiscoveryPage(outlet);
  } else if (pattern === '/recipes/:id') {
    renderRecipeDetailPage(outlet, params.id);
  } else if (pattern === '/cook/:id') {
    renderCookingPage(outlet, params.id);
  } else {
    outlet.innerHTML = '<div class="page"><div class="container"><p>Page not found.</p></div></div>';
  }

  currentRoute = pathname;
}

/**
 * Navigate to a route
 */
export function navigateTo(route) {
  window.location.hash = route;
}

/**
 * Initialize router
 */
function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute(); // Initial route
}

// Start the app
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRouter);
} else {
  initRouter();
}

// Expose navigate globally for use in page components
window.navigateTo = navigateTo;