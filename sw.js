importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

if (workbox) {
  // 把打包时注入的文件缓存进来
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

  // 图片优先缓存
  workbox.routing.registerRoute(
    /\.(?:png|jpg|jpeg|webp|svg)$/,
    new workbox.strategies.CacheFirst({
      cacheName: 'images-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
      ],
    })
  );

  // 页面网络优先
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'pages-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({ maxEntries:20 }),
      ],
    })
  );
} else {
  console.warn('Workbox 加载失败');
}
