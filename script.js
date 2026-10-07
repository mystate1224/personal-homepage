// 页面内容直接写在 HTML 中；JavaScript 只用于增强导航、筛选与复制功能。
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const navLinks = [...navigation.querySelectorAll('a')];

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', '展开导航');
  navigation.classList.remove('is-open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? '收起导航' : '展开导航');
  navigation.classList.toggle('is-open', open);
});
navLinks.forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
window.matchMedia('(min-width: 801px)').addEventListener('change', closeMenu);

// 筛选按项目实际方向匹配；康复手套同时属于 AI 和物联网。
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const projectCards = [...document.querySelectorAll('[data-categories]')];
filterButtons.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filterButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  projectCards.forEach(card => {
    card.hidden = filter !== 'all' && !card.dataset.categories.split(' ').includes(filter);
  });
  document.querySelector('#filter-status').textContent = `显示 ${projectCards.filter(card => !card.hidden).length} 个项目`;
}));

// 复制成功才显示成功提示；受限环境下提供明确的手动复制方式。
document.querySelector('#copy-email').addEventListener('click', async () => {
  const email = '2473501617@qq.com';
  const status = document.querySelector('#copy-status');
  try {
    if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(email);
    status.textContent = '邮箱已复制，可以粘贴到邮件应用。';
  } catch {
    const range = document.createRange();
    range.selectNodeContents(document.querySelector('.email-link'));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    status.textContent = '请手动复制邮箱：2473501617@qq.com';
  }
});

// 当前阅读章节高亮，辅助长页面定位。
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    if (!visible.length) return;
    const activeId = visible[0].target.id;
    navLinks.forEach(link => {
      const active = link.getAttribute('href') === `#${activeId}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.1, 0.4] });
  document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
}
document.querySelector('#year').textContent = new Date().getFullYear();

// 原生 details 关闭时，浏览器会隐藏详情内容；打印前展开，打印后恢复阅读状态。
let detailsBeforePrint;
window.addEventListener('beforeprint', () => {
  detailsBeforePrint = [...document.querySelectorAll('.project-card details')].map(element => ({element, open: element.open}));
  detailsBeforePrint.forEach(({element}) => { element.open = true; });
});
window.addEventListener('afterprint', () => {
  detailsBeforePrint?.forEach(({element, open}) => { element.open = open; });
  detailsBeforePrint = undefined;
});
