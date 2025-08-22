const CACHE_NAME = 'portfolio-cache-v1';
const URLS_TO_CACHE = [
  '/',                    // 根目录，等同 index.html
  '/index.html',
  '/manifest.json',
  // 上面 HTML 里用到的静态资源，按需补充：
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  // 如果你有离线展示页，可以加入：
  '/offline.html'
];

// 安装阶段：预缓存核心文件
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// 激活阶段：清理旧版本缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// 拦截请求：优先缓存，再网络
self.addEventListener('fetch', event => {
  const req = event.request;
  // 只缓存 GET 请求
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) {
        // 缓存命中，立即返回
        return cached;
      }
      // 缓存未命中，去网络拉取并动态缓存
      return fetch(req)
        .then(res => {
          // 对任意可缓存类型做动态缓存
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(req, res.clone());
            return res;
          });
        })
        .catch(() => {
          // 拦截导航请求，返回离线页
          if (req.mode === 'navigate') {
            return caches.match('/offline.html');
          }
        });
    })
  );
});
