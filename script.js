
// ==== 数据区 ====
const galleryData = [
  {
    small:  'photos/photo1.JPEG',
    medium: 'photos/photo1.JPEG',
    large:  'photos/photo1.JPEG',
    alt:    'photo1'
  },
  {
    small:  'photos/photo2',
    medium: 'photos/photo2',
    large:  'photos/photo2',
    alt:    'photo2'
  },
  {
    small:  'photos/photo3',
    medium: 'photos/photo3',
    large:  'photos/photo3',
    alt:    'photo3'
  },
  {
    small:  'photos/photo4',
    medium: 'photos/photo4',
    large:  'photos/photo4',
    alt:    'photo4'
  },
  {
    small:  'photos/photo5',
    medium: 'photos/photo5',
    large:  'photos/photo5',
    alt:    'photo5'
  },
  {
    small:  'photos/photo6',
    medium: 'photos/photo6',
    large:  'photos/photo6',
    alt:    'photo6'
  },
  {
    small:  'photos/photo9',
    medium: 'photos/photo9',
    large:  'photos/photo9',
    alt:    'photo9'
  },
  {
    small:  'photos/photo10',
    medium: 'photos/photo10',
    large:  'photos/photo10',
    alt:    'photo10'
  },
  {
    small:  'photos/photo11',
    medium: 'photos/photo11',
    large:  'photos/photo11',
    alt:    'photo11'
  },
  {
    small:  'photos/photo12',
    medium: 'photos/photo12',
    large:  'photos/photo12',
    alt:    'photo12'
  },
  {
    small:  'photos/photo14',
    medium: 'photos/photo14',
    large:  'photos/photo14',
    alt:    'photo14'
  },
  {
    small:  'photos/photo15',
    medium: 'photos/photo15',
    large:  'photos/photo15',
    alt:    'photo15'
  },
  // …根据实际数量继续往这里添加
];

const videoData = [
  {
    src:    'video/video1.mp4',
    poster: 'photos/photo1.JPEG'
  },
  {
    src:    'video/video2.mp4',
    poster: 'photos/photo2'
  },
  {
    src:    'video/video3.mp4',
    poster: 'photos/photo3'
  },
  {
    src:    'video/video4.mp4',
    poster: 'photos/photo4'
  },
  {
    src:    'video/video5.mp4',
    poster: 'photos/photo5'
  },
  {
    src:    'video/video6.mp4',
    poster: 'photos/photo6'
  },
  // …根据实际数量继续往这里添加
];

const blogPosts = [
  { title:'如何拍摄夜空星轨', date:'2023-05-10', summary:'夜空星轨拍摄技巧全攻略...', url:'#' },
  { title:'旅行视频后期剪辑秘籍', date:'2023-04-22', summary:'用 Premiere Pro 制作流畅过渡...', url:'#' },
  { title:'Lightroom 调色教程',   date:'2023-03-15', summary:'一步步教你打造高级胶片质感...', url:'#' },
  // …更多文章
];

// ==== 功能实现 ====
document.addEventListener('DOMContentLoaded', () => {
  // 元素
  const menuItems   = document.querySelectorAll('#menu li');
  const sections    = document.querySelectorAll('main section');
  const hamburger   = document.getElementById('hamburger');
  const menu        = document.getElementById('menu');
  const themeToggle = document.getElementById('theme-toggle');
  const back2top    = document.getElementById('back-to-top');
  const lightbox    = document.getElementById('lightbox');
  const lbImage     = document.getElementById('lb-image');
  const lbClose     = document.getElementById('lb-close');
  const galleryEl   = document.querySelector('.gallery');
  const videosEl    = document.querySelector('.videos');
  const postsList   = document.getElementById('posts-list');
  const searchInput = document.getElementById('search-input');

  // 1. 导航切换
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      menuItems.forEach(i => {
        i.classList.remove('active');
        i.removeAttribute('aria-current');
      });
      item.classList.add('active');
      item.setAttribute('aria-current','page');
      const tgt = item.dataset.target;
      sections.forEach(sec => sec.id===tgt 
        ? sec.classList.add('active') 
        : sec.classList.remove('active')
      );
      if (menu.classList.contains('open')) {
        menu.classList.remove('open');
        hamburger.setAttribute('aria-expanded','false');
      }
    });
  });
  hamburger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
  });

  // 2. 主题切换
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.classList.toggle('dark', savedTheme==='dark');
  themeToggle.textContent = savedTheme==='dark' ? '☀️' : '🌓';
  themeToggle.setAttribute('aria-pressed', savedTheme==='dark');
  themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('theme', isDark?'dark':'light');
    themeToggle.textContent = isDark?'☀️':'🌓';
    themeToggle.setAttribute('aria-pressed', isDark);
  });

  // 3. 动态渲染 Gallery
  galleryEl.innerHTML = galleryData.map(img => `
    <picture>
      <source media="(min-width:800px)" 
              srcset="${img.medium} 1x, ${img.large} 2x">
      <source media="(max-width:799px)" 
              srcset="${img.small}">
      <img src="${img.small}"
           alt="${img.alt}"
           loading="lazy"
           decoding="async">
    </picture>
  `).join('');

  // 4. 动态渲染 Videos
  videosEl.innerHTML = videoData.map(v => `
    <video src="${v.src}"
           poster="${v.poster}"
           controls
           preload="metadata"
           loading="lazy">
      您的浏览器不支持 video 标签。
    </video>
  `).join('');

  // 5. Lightbox 功能
  document.querySelectorAll('.gallery img').forEach(img => {
    img.addEventListener('click', () => {
      lbImage.src = img.src;
      lbImage.alt = img.alt;
      lightbox.classList.add('open');
      lbClose.focus();
    });
  });
  function closeLb() { lightbox.classList.remove('open'); }
  lbClose.addEventListener('click', closeLb);
  lightbox.addEventListener('click', e => {
    if (e.target===lightbox) closeLb();
  });
  document.addEventListener('keydown', e => {
    if (e.key==='Escape' && lightbox.classList.contains('open')) {
      closeLb();
    }
  });

  // 6. 返回顶部
  window.addEventListener('scroll', () => {
    back2top.classList.toggle('show', window.scrollY>300);
  });
  back2top.addEventListener('click', () => {
    window.scrollTo({ top:0, behavior:'smooth' });
  });

  // 7. 渲染 Blog & 搜索
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
  renderPosts(blogPosts);
  const fuse = new Fuse(blogPosts, { keys:['title','summary'], threshold:0.4 });
  searchInput.addEventListener('input', e => {
    const q = e.target.value.trim();
    q ? renderPosts(fuse.search(q).map(r=>r.item)) : renderPosts(blogPosts);
  });

  // 8. 注册 Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .catch(err => console.error('SW 注册失败:', err));
  }
});
