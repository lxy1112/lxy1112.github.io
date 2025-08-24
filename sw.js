importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');
if (workbox) {
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);
  workbox.routing.registerRoute(
    /\.(?:png|jpg|jpeg|webp|svg)$/,
    new workbox.strategies.CacheFirst({
      cacheName: 'images-cache',
      plugins: [ new workbox.expiration.ExpirationPlugin({ maxEntries:60, maxAgeSeconds:30*24*3600 }) ]
    })
  );
  workbox.routing.registerRoute(
    ({request})=>request.mode==='navigate',
    new workbox.strategies.NetworkFirst({ cacheName:'pages-cache', plugins:[ new workbox.expiration.ExpirationPlugin({ maxEntries:20 }) ] })
  );
} else {
  console.warn('Workbox 加载失败');
}
