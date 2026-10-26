// Service worker: lets the game open offline once it has been loaded.
// Bump VERSION when you want every device to refresh its cached copy.
const VERSION = "rdy-v1";
const SHELL = ["./", "index.html", "tasks.js", "config.js", "manifest.webmanifest",
  "logo-light.png", "logo-dark.png", "icon-192.png", "icon-512.png", "apple-touch-icon.png", "favicon-64.png"];
const EXTERNAL = [
  "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Public+Sans:wght@400;600;800&display=swap",
  "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js",
  "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/hint/show-hint.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/sql/sql.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/hint/show-hint.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/hint/sql-hint.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/edit/matchbrackets.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/edit/closebrackets.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/display/placeholder.min.js",
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js",
  "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.wasm"
];

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    await Promise.allSettled([
      ...SHELL.map(u => cache.add(u)),
      ...EXTERNAL.map(u => cache.add(new Request(u, { mode: "cors" })))
    ]);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    for(const k of await caches.keys()) if(k !== VERSION) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if(req.method !== "GET") return;
  const url = new URL(req.url);
  if(url.hostname.endsWith("supabase.co")) return;            // never cache login or progress requests
  if(url.origin === location.origin){
    // our own files: try the network first so new deployments show up, fall back to the cache offline
    e.respondWith((async () => {
      try{
        const res = await fetch(req);
        if(res.ok) (await caches.open(VERSION)).put(req, res.clone());
        return res;
      }catch(err){
        return (await caches.match(req, { ignoreSearch: true })) || (req.mode === "navigate" ? caches.match("index.html") : Response.error());
      }
    })());
  }else{
    // libraries and fonts: versioned URLs, so the cache is always right
    e.respondWith((async () => {
      const hit = await caches.match(req);
      if(hit) return hit;
      const res = await fetch(req);
      if(res.ok || res.type === "opaque") (await caches.open(VERSION)).put(req, res.clone());
      return res;
    })());
  }
});
