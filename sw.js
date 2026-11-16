/* Pivovar Rudohor – offline cache pro GitHub Pages */
'use strict';

const CACHE_VERSION = 'rudohor-offline-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './rudohor-icon.svg'
];

// Všechny externí knihovny, které kalkulačka používá.
const CDN_ASSETS = [
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js',
  'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_VERSION);
    // Lokální soubory jsou povinné – bez nich aplikace nemůže nastartovat.
    await cache.addAll(APP_SHELL.map(path => new Request(new URL(path, self.registration.scope), { cache: 'reload' })));

    // Každou CDN knihovnu uložíme samostatně. Jedna nedostupná CDN tak nezablokuje
    // instalaci Service Workeru; její případný problém bude vidět v konzoli.
    const results = await Promise.allSettled(CDN_ASSETS.map(async url => {
      const request = new Request(url, { mode: 'no-cors', cache: 'reload' });
      const response = await fetch(request);
      if (!response.ok && response.type !== 'opaque') throw new Error('HTTP ' + response.status + ' – ' + url);
      await cache.put(request, response.clone());
    }));
    results.forEach((result, index) => {
      if (result.status === 'rejected') console.warn('[Rudohor offline] CDN knihovnu se nepodařilo uložit:', CDN_ASSETS[index], result.reason);
    });
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('rudohor-offline-') && key !== CACHE_VERSION).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const isNavigation = request.mode === 'navigate';

  if (isNavigation) {
    // Navigace: nejdřív aktuální verze ze sítě, při výpadku poslední uložená.
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        const cache = await caches.open(CACHE_VERSION);
        cache.put(new Request(new URL('./index.html', self.registration.scope)), response.clone()).catch(() => {});
        return response;
      } catch (error) {
        const cache = await caches.open(CACHE_VERSION);
        return (await cache.match(request)) || (await cache.match(new URL('./index.html', self.registration.scope)));
      }
    })());
    return;
  }

  // Skripty, styly, ikony a další GET požadavky: nejprve cache, potom síť.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_VERSION);
    const cached = await cache.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response && (response.ok || response.type === 'opaque')) {
        await cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      // Pro externí CDN zkusíme ještě shodu podle URL, kdyby se lišil režim požadavku.
      const keys = await cache.keys();
      const match = keys.find(key => key.url === request.url);
      if (match) return cache.match(match);
      return new Response('Offline – tento prostředek nebyl při posledním online spuštění uložen.', {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
  })());
});
