const V="narges-v1";
const CORE=["./","index.html","style.css","script.js","data.js","extras.js","manifest.json","icons/icon-192.png","icons/icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET"||e.request.headers.has("range"))return;
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
    if(res.ok&&(new URL(e.request.url).origin===location.origin||e.request.url.includes("fonts.g"))){const cp=res.clone();caches.open(V).then(c=>c.put(e.request,cp))}
    return res}).catch(()=>caches.match("index.html"))));
});
