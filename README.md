# 老蔡的个人主页

> 蔡志峰（老蔡）的个人主页 —— 云计算与虚拟化解决方案架构师

## 这是什么

一个**纯静态单页站点**，零依赖、零外链、完全离线可用。深色科技风 + 幽默文案。

## 快速开始

### 方式一：直接打开

双击 `index.html` 即可。数据由 `data/fallback.js` 内联提供，`file://` 协议下也能正常渲染。

### 方式二：本地服务器（推荐）

```bash
python -m http.server 8080
# 打开 http://localhost:8080/
```

## 目录结构

```
.
├── index.html          单页站点（9 个板块）
├── assets/
│   ├── style.css       深色科技风样式，响应式，零外链
│   └── app.js          渲染 + 打字机 + 滚动动效
└── data/
    ├── profile.json    唯一数据源（改内容只改这里）
    └── fallback.js     profile.json 的内联镜像，供 file:// 兜底
```

## 页面板块

| 板块 | 内容 |
|------|------|
| Hero | 「欢迎来到老蔡的个人主页」+ 终端卡片 + 数据条 |
| 关于老蔡 | 个人档案、教育背景、证书 |
| 能力图谱 | 6 大能力域 + 熟练度自评 + 编程语言经历 |
| **专利墙** | 虚拟化与云领域相关专利 2 篇（详情待补充） |
| 职业轨迹 | 2002 → 至今，9 段经历的完整时间线 |
| 业余生活 | 慢跑、爬山、羽毛球、音乐 |
| 待补充 | 待填充素材清单 |
| 联系方式 | Email / 电话 / 所在地 |

## 如何更新内容

所有内容集中在 `data/profile.json`。修改后需要重新生成内联兜底文件：

```bash
python -c "
import json
d = json.load(open('data/profile.json', encoding='utf-8'))
open('data/fallback.js','w',encoding='utf-8').write(
    '/* 自动生成，请勿手动编辑。数据源：data/profile.json */\n'
    'var PROFILE_DATA = ' + json.dumps(d, ensure_ascii=False, indent=2) + ';\n')
"
```

## 待补充

- [ ] 两篇专利的具体名称、申请号/公开号、授权状态
- [ ] 个人头像图片
- [ ] 代表项目的技术细节与成果数据
- [ ] 技术博客 / GitHub / 开源项目链接
- [ ] 证书扫描件或编号
- [ ] 获奖与荣誉
- [ ] 演讲 / 分享材料

## 技术说明

- 纯 HTML + CSS + 原生 JS，无构建步骤、无 npm 依赖
- 数据渲染走 `fetch('data/profile.json')`，失败时自动降级到内联数据
- 响应式：桌面 / 平板 / 手机三档断点
- 动效：`IntersectionObserver` 驱动的滚动显现 + 技能条填充

---

© 蔡志峰（老蔡）
