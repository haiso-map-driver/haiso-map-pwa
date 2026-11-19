const CACHE = 'haiso-map-appshell-v10-20261118';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', event => {
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', event => {
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('haiso-map-appshell-') && k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', event => {
 const request=event.request;
 if(request.method!=='GET' || new URL(request.url).origin!==self.location.origin) return;
 if(request.mode==='navigate') {
  event.respondWith(fetch(request).catch(()=>caches.match('./index.html')));
  return;
 }
 if (SHELL.some(path=>new URL(path,self.registration.scope).href===request.url)) {
  event.respondWith(caches.match(request).then(hit=>hit||fetch(request)));
 }
});
