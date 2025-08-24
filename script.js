document.addEventListener('DOMContentLoaded', () => {
  // 元素选取
  const menuItems     = document.querySelectorAll('#menu li');
  const sections      = document.querySelectorAll('main section');
  const hamburgerBtn  = document.getElementById('hamburger');
  const menuUl        = document.getElementById('menu');
  const themeToggle   = document.getElementById('theme-toggle');
  const back2top      = document.getElementById('back-to-top');
  const lightbox      = document.getElementById('lightbox');
  const lbImage       = document.getElementById('lb-image');
  const lbClose       = document.getElementById('lb-close');
  const postsList     = document.getElementById('posts-list');
  const searchInput   = document.getElementById('search-input');

  // ----- 导航 & 路由 -----
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      // 更新样式 & aria-current
      menuItems.forEach(i => {
        i.classList.remove('active');
        i.removeAttribute('aria-current');
      });
      item.classList.add('active');
      item.setAttribute('aria-current', 'page');
      // 切换区块
      const target = item.dataset.target;
      sections.forEach(sec => {
        sec.id === target
          ? sec.classList.add('active')
          : sec.classList.remove('active');
      });
      // 收起移动端菜单
      if (menuUl.classList.contains('open')) {
        menuUl.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded','false');
      }
    });
  });

  // 汉堡菜单
  hamburgerBtn.addEventListener('click', () => {
    const open = menuUl.classList.toggle('open');
    hamburgerBtn.setAttribute('aria-expanded', open);
  });

  // ----- 主题切换 -----
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.classList.toggle('dark', savedTheme === 'dark');
  themeToggle.setAttribute('aria-pressed', savedTheme === 'dark');
  themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌓';

  themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.setAttribute('aria-pressed', isDark);
    themeToggle.textContent = isDark ? '☀️' : '🌓';
  });

  // ----- Lightbox -----
  document.querySelectorAll('.gallery img').forEach(img => {
    img.addEventListener('click', () => {
      lbImage.src     = img.src;
      lbImage.alt     = img.alt;
      lightbox.classList.add('open');
      lbClose.focus();
    });
  });
  function closeLightbox() {
    lightbox.classList.remove('open');
  }
  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });

  // ----- 返回顶部 -----
  window.addEventListener('scroll', () => {
    back2top.classList.toggle('show', window.scrollY > 300);
  });
  back2top.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ----- Blog 列表 & 搜索 (Fuse.js) -----
  const posts = [
    { title:'如何拍摄夜空星轨', date:'2023-05-10', summary:'夜空星轨拍摄技巧全攻略...', url:'#' },
    { title:'旅行视频后期剪辑秘籍', date:'2023-04-22', summary:'用 Premiere Pro 制作流畅过渡...', url:'#' },
    { title:'Lightroom 调色教程',   date:'2023-03-15', summary:'一步步教你打造高级胶片质感...', url:'#' },
    // ……
  ];

  // 渲染函数
  function renderPosts(list) {
    postsList.innerHTML = '';
    list.forEach(p => {
      const li = document.createElement('li');
      li.className = 'post';
      li.innerHTML = `
        <h3><a href="${p.url}">${p.title}</a></h3>
        <small>${p.date}</small>
        <p>${p.summary}</p>
      `;
      postsList.appendChild(li);
    });
  }
  renderPosts(posts);

  // Fuse.js 搜索
  const fuse = new Fuse(posts, { keys:['title','summary'], threshold:0.4 });
  searchInput.addEventListener('input', e => {
    const q = e.target.value.trim();
    q ? renderPosts(fuse.search(q).map(item => item.item)) : renderPosts(posts);
  });

  // ----- 注册 Service Worker -----
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .catch(err => console.error('SW 注册失败:', err));
  }
});
