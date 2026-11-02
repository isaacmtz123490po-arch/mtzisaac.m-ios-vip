// sw.js — cachea la app y sirve offline
const CACHE = "metatron-v1";
const ASSETS = ["./", "./index.html"];
self.addEventListener("install", e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
    // cachear respuestas exitosas del mismo origen
    if (res.ok && new URL(e.request.url).origin === location.origin) {
      const clone = res.clone(); caches.open(CACHE).then(c => c.put(e.request, clone));
    }
    return res;
  }).catch(() => caches.match("./index.html"))));
});