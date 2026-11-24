'use strict';
const CACHE='qisu-atlas-a55850ec65a3';
const SHELL=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('qisu-atlas-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url),scope=new URL(self.registration.scope);
 if(url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname))return;
 if(event.request.mode==='navigate'){
  event.respondWith(fetch(event.request).then(async response=>{
   const relative=url.pathname.slice(scope.pathname.length);
   if(response.ok&&(!relative||relative==='index.html')){try{const cache=await caches.open(CACHE);await cache.put(new URL('./index.html',scope).href,response.clone())}catch{/* A full cache must not block an online response. */}}
   return response;
  }).catch(()=>caches.open(CACHE).then(cache=>cache.match(new URL('./index.html',scope).href))));
  return;
 }
 event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(event.request))||fetch(event.request)));
});
