/* ============================================================
   老蔡的个人主页 — 交互脚本
   数据源：data/profile.json
   零外链、零依赖
   ============================================================ */

/* ---------- 内联兜底数据（file:// 下 fetch 受限时使用） ---------- */
/* 注意：这是 profile.json 的镜像，改内容时两处都要改；
   通过本地服务器访问时优先使用 profile.json。 */
const FALLBACK = null; // 由 data/fallback.js 注入（如果存在）

/* ---------- 图标 ---------- */
const ICONS = {
  cloud: '<path d="M18 18.5H6.5a4.5 4.5 0 0 1-.6-8.96 6 6 0 0 1 11.5-1.4A4.25 4.25 0 0 1 18 18.5z"/>',
  vm: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 20h8M12 17v3"/><path d="M9 9l1.5 1.5L14 7"/>',
  network: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z"/>',
  solution: '<path d="M9 3h6v4l4 4v10H5V11l4-4z"/><path d="M9 15h6"/>',
  cert: '<circle cx="12" cy="9" r="5.5"/><path d="M8.5 13.5 7 22l5-2.5 5 2.5-1.5-8.5"/>',
  code: '<path d="m8 6-6 6 6 6M16 6l6 6-6 6"/>'
};

const HOBBY_EMOJI = {
  run: '🏃',
  hike: '⛰️',
  badminton: '🏸',
  music: '🎵'
};

const LANG_DESC = {
  C: '从 CDMA BSS 到数通协议栈，再到虚拟化内核加速加密——C 是吃饭的家伙。',
  Delphi: '早年做产品整合和统一平台时的主力，SMS / MMS 平台就是它。',
  Python: '写方案、做验证、跑脚本，顺手好用，不抢戏。'
};

/* ---------- 工具 ---------- */
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

function svg(path) {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
    'stroke-linecap="round" stroke-linejoin="round">' + path + '</svg>';
}

/* ---------- 打字机 ---------- */
function typewriter(el, lines) {
  let li = 0, ci = 0, dir = 1;
  const t = el;
  function step() {
    if (li >= lines.length) {
      setTimeout(() => { li = 0; ci = 0; t.textContent = ''; step(); }, 2600);
      return;
    }
    const cur = lines[li];
    if (dir === 1) {
      ci++;
      t.textContent = cur.slice(0, ci);
      if (ci >= cur.length) { dir = 0; setTimeout(step, 1500); return; }
      setTimeout(step, 62);
    } else {
      ci -= 2;
      if (ci <= 0) { t.textContent = ''; li = (li + 1) % lines.length; dir = 1; ci = 0; setTimeout(step, 260); return; }
      t.textContent = cur.slice(0, ci);
      setTimeout(step, 24);
    }
  }
  step();
}

/* ---------- 渲染 ---------- */
function render(d) {
  /* Hero 打字 */
  const roles = [
    d.basic.title,
    d.basic.slogan,
    '20+ 年基础软件与云架构老兵',
    '虚拟化 & 云总架构师（2021-2023）',
    '把云画成图纸的人'
  ];
  typewriter($('#typingText'), roles);

  /* 关于 */
  $('#bioText').textContent = d.basic.bio;

  /* 证书 */
  const certs = d.certificates;
  $('#certText').innerHTML = certs.map(c =>
    (c.year ? c.year + ' 年 ' : '') + esc(c.name)
  ).join('　·　');
  $('#certTags').innerHTML = certs.map(c =>
    '<span class="tag">' + esc(c.name) + (c.level ? ' · ' + esc(c.level) : '') + '</span>'
  ).join('');

  /* 技能卡 */
  $('#skillCards').innerHTML = d.skillGroups.map(g => `
    <div class="card reveal">
      <div class="card-ico">${svg(ICONS[g.icon] || ICONS.cloud)}</div>
      <h3>${esc(g.title)}</h3>
      <p>${esc(g.desc)}</p>
      <div class="tags">${g.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
    </div>`).join('');

  /* 技能条 */
  $('#skillBars').innerHTML = d.skills.map(s => `
    <div class="skill-row">
      <div class="skill-top">
        <span>${esc(s.name)}</span>
        <span class="pct">${s.level}%</span>
      </div>
      <div class="skill-bar"><div class="skill-fill" data-lv="${s.level}"></div></div>
    </div>`).join('');

  /* 语言卡 */
  $('#langCards').innerHTML = d.languages.map(l => `
    <div class="card reveal">
      <div class="card-ico">${svg(ICONS.code)}</div>
      <h3>${esc(l.name)}</h3>
      <p>${esc(LANG_DESC[l.name] || l.note)}</p>
      <div class="tags">
        <span class="tag">${esc(l.note)}</span>
      </div>
    </div>`).join('');

  /* 专利 */
  const P = d.patents;
  $('#patentHeadline').textContent = P.headline;
  $('#patentSub').textContent = P.sub;
  $('#patentHint').textContent = '⚠ ' + P.statusHint;

  /* 统计卡 */
  $('#patentStats').innerHTML = P.stats.map(s => `
    <div class="ps-card reveal">
      <div class="ps-value">${esc(s.value)}<span>${esc(s.unit)}</span></div>
      <div class="ps-label">${esc(s.label)}</div>
      <div class="ps-note">${esc(s.note)}</div>
    </div>`).join('');

  /* 主题分布（横向条） */
  const maxTheme = Math.max.apply(null, P.themes.map(t => t.count));
  $('#patentThemes').innerHTML = P.themes.map(t => `
    <div class="pb-row">
      <div class="pb-name">${esc(t.name)}</div>
      <div class="pb-track"><i class="pb-fill" style="width:${(t.count / maxTheme * 100).toFixed(1)}%"></i></div>
      <div class="pb-num">${t.count}</div>
    </div>`).join('');

  /* 年份分布（柱状） */
  const maxYear = Math.max.apply(null, P.years.map(y => y.count));
  $('#patentYears').innerHTML = '<div class="py-wrap">' + P.years.map(y => `
    <div class="py-col">
      <div class="py-bar" style="height:${(y.count / maxYear * 100).toFixed(1)}%"><span>${y.count}</span></div>
      <div class="py-year">${esc(y.year)}</div>
    </div>`).join('') + '</div>';

  /* 卡片 */
  const STATUS_CLS = { '已授权': 'ok', '审查中': 'wait', '授权后失效': 'off', '视为撤回': 'off' };
  function patentCard(p) {
    const fam = p.family ? p.family.split(';').map(s => s.trim()).filter(Boolean) : [];
    return `
    <div class="patent-card reveal" data-theme="${esc(p.theme)}">
      <div class="patent-no">
        <span>${esc(p.id)}</span>
        <span class="patent-status st-${STATUS_CLS[p.status] || 'wait'}">${esc(p.status)}</span>
      </div>
      <h3>${esc(p.title)}</h3>
      <div class="patent-meta">
        <span>🏷 ${esc(p.theme)}</span>
        <span>🕐 申请 ${esc(p.appDate)}</span>
        <span>👤 第 ${p.order} 发明人${p.isFirst ? '（第一发明人）' : ''}</span>
        <span>🏢 ${esc(p.assignee)}</span>
      </div>
      <p>${esc(p.summary)}</p>
      <div class="patent-foot">
        <span class="pf-k">申请号</span><span class="pf-v">${esc(p.appNo)}</span>
        <span class="pf-k">IPC</span><span class="pf-v">${esc(p.ipc)}</span>
        ${p.grantDate !== '—' ? `<span class="pf-k">授权</span><span class="pf-v">${esc(p.grantDate)}</span>` : ''}
        ${fam.length ? `<span class="pf-k">同族</span><span class="pf-v">${esc(fam.join(' · '))}</span>` : ''}
      </div>
      ${p.link ? `<a class="patent-link" href="${esc(p.link)}" target="_blank" rel="noopener">查看原文 ↗</a>` : ''}
    </div>`;
  }

  function paintPatents(list) {
    $('#patentGrid').innerHTML = list.map(patentCard).join('');
    initReveal();
  }

  /* 主题筛选 */
  $('#patentFilter').innerHTML = ['全部'].concat(P.themes.map(t => t.name)).map((t, i) => {
    const n = i === 0 ? P.items.length : P.themes[i - 1].count;
    return `<button class="pf-btn${i === 0 ? ' is-on' : ''}" data-f="${esc(t)}">${esc(t)}<em>${n}</em></button>`;
  }).join('');
  $('#patentFilter').addEventListener('click', (e) => {
    const b = e.target.closest('.pf-btn');
    if (!b) return;
    $('#patentFilter').querySelectorAll('.pf-btn').forEach(x => x.classList.remove('is-on'));
    b.classList.add('is-on');
    const f = b.dataset.f;
    paintPatents(f === '全部' ? P.items : P.items.filter(p => p.theme === f));
  });
  paintPatents(P.items);

  /* 说明与协作网络 */
  $('#patentNotes').innerHTML = P.notes.map(n => `<li>${esc(n)}</li>`).join('');
  $('#patentCo').innerHTML = P.coinventors.slice(0, 6)
    .map(c => `<span class="co-chip">${esc(c.name)}<em>${c.count}</em></span>`).join('');

  /* 时间线 */
  $('#timelineList').innerHTML = d.timeline.map(t => `
    <div class="tl-item ${t.featured ? 'featured' : ''} reveal">
      <div class="tl-card">
        <div class="tl-head">
          <div>
            <h3 class="tl-role">
              ${esc(t.role)}
              ${t.featured ? '<span class="patent-flag">🏅 产出专利 2 篇</span>' : ''}
            </h3>
            <div class="tl-co">@ ${esc(t.company)}${t.location ? ' · ' + esc(t.location) : ''}</div>
          </div>
          <span class="tl-period">${esc(t.period)}</span>
        </div>
        <p class="tl-sum">${esc(t.summary)}</p>
        <ul class="tl-list">
          ${t.points.map(pt => `<li>${esc(pt)}</li>`).join('')}
        </ul>
      </div>
    </div>`).join('');

  /* 爱好 */
  $('#hobbyGrid').innerHTML = d.interests.map(h => `
    <div class="hobby reveal">
      <div class="hobby-ico">${HOBBY_EMOJI[h.icon] || '🎯'}</div>
      <h4>${esc(h.name)}</h4>
      <p>${esc(h.desc)}</p>
    </div>`).join('');

  /* 待补充 */
  $('#todoList').innerHTML = d.todo.map(t => `<li><span>${esc(t)}</span></li>`).join('');

  /* 联系 */
  const mail = d.contact.email;
  const phone = d.contact.phone;
  $('#mailVal').textContent = mail;
  $('#mailWay').href = 'mailto:' + mail;
  $('#phoneVal').textContent = phone;
  $('#phoneWay').href = 'tel:' + phone;
  $('#locVal').textContent = d.contact.location;

  /* 年份 */
  $('#year').textContent = new Date().getFullYear();

  /* 动效初始化 */
  requestAnimationFrame(() => {
    initReveal();
    initBars();
  });
}

/* ---------- 滚动显现 ---------- */
let io = null;
function initReveal() {
  const els = document.querySelectorAll('.reveal:not(.in)');
  if (!('IntersectionObserver' in window)) {
    els.forEach(e => e.classList.add('in'));
    return;
  }
  if (!io) {
    io = new IntersectionObserver((entries) => {
      entries.forEach((en, i) => {
        if (en.isIntersecting) {
          setTimeout(() => en.target.classList.add('in'), i * 55);
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  }
  els.forEach(e => io.observe(e));
}

/* ---------- 技能条动画 ---------- */
function initBars() {
  const bars = document.querySelectorAll('.skill-fill');
  if (!('IntersectionObserver' in window)) {
    bars.forEach(b => b.style.width = b.dataset.lv + '%');
    return;
  }
  const bio = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const t = en.target;
        setTimeout(() => { t.style.width = t.dataset.lv + '%'; }, 120);
        bio.unobserve(t);
      }
    });
  }, { threshold: 0.2 });
  bars.forEach(b => bio.observe(b));
}

/* ---------- 导航 ---------- */
function initNav() {
  const toggle = $('#navToggle');
  const links = $('#navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') links.classList.remove('open');
    });
  }
}

/* ---------- 数据加载 ---------- */
function boot() {
  initNav();

  // 优先取服务器上的最新 profile.json（时间戳绕过浏览器缓存）；
  // 只有取不到（如 file:// 协议）时才回退到内联兜底数据
  fetch('data/profile.json?t=' + Date.now())
    .then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(render)
    .catch(err => {
      console.warn('[老蔡主页] 读取 data/profile.json 失败：', err.message);

      if (typeof PROFILE_DATA !== 'undefined' && PROFILE_DATA) {
        console.warn('[老蔡主页] 改用内联兜底数据');
        render(PROFILE_DATA);
        return;
      }

      const box = document.createElement('div');
      box.style.cssText = 'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);' +
        'z-index:999;background:#111827;border:1px solid #fbbf24;border-radius:14px;' +
        'padding:28px 32px;max-width:560px;font-size:14px;line-height:1.9;color:#e8eef7;';
      box.innerHTML = '<b style="color:#fbbf24">⚠ 数据未能加载</b><br>' +
        '当前以 <code>file://</code> 直接打开页面时，浏览器会拦截本地 JSON 请求。<br><br>' +
        '请改用本地服务器访问：<br>' +
        '<code style="color:#38bdf8">python -m http.server 8080</code><br>' +
        '然后打开 <code style="color:#38bdf8">http://localhost:8080/</code>';
      document.body.appendChild(box);
    });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
