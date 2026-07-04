# Virtual Phone UI 项目交接说明

## 项目位置

本地项目目录：

```text
C:\Users\puxit\Documents\Codex\2026-07-03\ni-s\work\homepage-master\homepage-master
```

技术栈：

- React
- TypeScript
- Vite
- `@phosphor-icons/react`
- 单页 Mock UI 原型，无真实后端、数据库、登录或云同步

## 运行与验证

安装依赖：

```bash
npm install
```

本地启动：

```bash
npm run dev
```

默认访问：

```text
http://127.0.0.1:5173/
```

当前已通过的验证命令：

```bash
npm run typecheck
npm run lint
npm run build
```

## 当前成果概览

项目已经从原始 homepage 模板升级为一个虚拟手机 App 原型，核心结构为四个桌面页：

- 今天
- 陪伴
- 回忆
- 管理

底部 Dock 保留固定入口，中央入口已改为 Chat。所有完整功能页面优先在手机容器内打开，并保留返回路径。

## 主题与视觉系统

当前视觉方向为 Aurora 玻璃系统：

- `aurora-dark`
- `aurora-light`

主题切换位于手机外部预览控制区，不在手机内部占用产品 UI。

主要视觉规则：

- 多层极光弥散背景
- 平面 Clear Glass / Frosted Glass
- Dock 使用 ribbed / fluted glass 竖条折射纹理
- 避免 Bubble、软胶、塑料凸起、厚重阴影和强泛光
- 文字、图标、边框、阴影随主题同步切换

近期重点修正：

- Today 页卡片从 Bubble 感改为平面玻璃
- Manage 页浅色主题卡片透明度对齐 Today 页
- 功能页与回忆时间线中错误的矩形背景层已移除
- `.sheet-content`、`.child-detail`、`.memory-timeline-row` 不再被误当作玻璃卡片

## 主要文件

```text
src/App.tsx
```

负责：

- App 状态
- 四页切换
- 手机内 overlay 页面
- Chat / Moments / Calendar / Mailbox / Mood / Quick Actions / Manage 子页入口
- Aurora 主题切换状态

```text
src/components/layout/PageLayouts.tsx
```

负责：

- TodayLayout
- CompanionLayout
- MemoryLayout
- ManageLayout
- Dock 所属桌面页布局

```text
src/components/layout/PhoneShell.tsx
```

负责：

- 手机外壳
- 状态栏
- Dock 容器

```text
src/components/pages/
```

负责：

- ChatPage
- MomentsPage
- CalendarPage
- MailboxPage
- MoodPage
- QuickActionPages
- ManagePages

```text
src/data/features.tsx
```

负责：

- 母功能 / 子功能信息架构
- 陪伴、回忆等功能入口映射

```text
src/styles.css
```

负责：

- 全局主题变量
- Aurora Dark / Aurora Light
- 玻璃材质
- Dock ribbed glass
- 四页和 overlay 页面视觉

注意：`styles.css` 当前较长，后续改视觉时建议优先搜索已有选择器并局部覆盖，避免再次把布局容器误加入玻璃卡片列表。

## 功能状态

### Today

已实现：

- AI 一句话关怀大卡
- “回复ta”进入聊天页
- 关系状态圆环
- 最近聊天入口进入同一聊天页
- 日历、信箱、动态、情绪入口
- Quick Actions：通话、语音便签、AI 帮助

### Chat

已实现：

- 手机内聊天页
- 返回按钮
- 消息流
- 输入框与发送按钮
- “+”面板
- Mock 消息发送与状态变化
- 长按消息菜单

### Moments / 动态

已实现：

- 朋友圈式单列动态流
- 纯文字、单图、多图/活动分享 Mock 动态
- 点赞、评论、状态保留
- 点赞小花动效

### Calendar

已实现：

- 月视图
- 日期选择
- 今日事件 / 即将事件
- 添加 Mock 事件

### Mailbox

已实现：

- 信件列表
- 读信页
- 已读状态
- 收藏、回复、保存为回忆等 Mock 操作

### Mood

已实现：

- 今日情绪选择
- 强度选择
- 备注
- 本周趋势
- 角色回应
- 保存状态

### Companion

已实现：

- 独立“一起听歌”主唱片卡
- 一起生活 / 一起娱乐 / 共同养成 / 相机相册等母功能
- 功能组与子功能在手机内 overlay 打开

### Memories

已实现：

- 主回忆卡
- 时间线
- 珍藏区
- 写信等 Mock 入口

### Manage

已实现：

- Profile 顶部大卡
- 角色管理
- 用户管理
- 记忆管理
- 外观
- 系统设置
- 六类管理二级 Mock 页面
- 保存 / 切换 / 确认类状态反馈

## 最近一次视觉问题修复记录

问题：

部分卡片文字背后出现淡的长方形底片。

根因：

1. `.sheet-content` 被全站 frosted glass 规则误当成卡片。
2. `.child-detail` 被全站 frosted glass 规则误当成卡片。
3. `.memory-timeline-row` 被 clear glass 规则误当成独立玻璃行。

处理：

- 从源头玻璃选择器中移除 `.sheet-content`、`.child-detail`、`.memory-timeline-row`
- 保留末尾透明化兜底
- 保留真正需要玻璃质感的按钮、建议卡、外层卡片

## 后续开发注意事项

1. 不要把布局容器直接加入 `.glass-card`、frosted 或 clear glass 的大选择器列表。
2. 如果要给一组内容加玻璃，只加在明确的卡片元素上，不加在列表根容器或页面布局容器上。
3. 新增视觉规则优先限定在对应页面，例如：

```css
.today-page[data-theme="aurora-light"] ...
.companion-page[data-theme] ...
.phone-page-overlay[data-aurora-scope="true"] ...
```

4. 修改 Dock 时保持：

- 中央 Chat
- ribbed glass
- 现有尺寸与选中逻辑

5. 修改功能页时保持手机内 overlay，不要改成手机外部弹窗。

## 当前已知风险

- `src/styles.css` 历史迭代较多，存在多段后置覆盖规则；继续改视觉时需要注意 CSS 级联顺序。
- 部分中文文本在当前源码读取输出中出现过乱码显示，但页面内实际交互仍以现有项目为准。后续如大规模整理文案，建议先统一确认文件编码。
- 项目仍为 Mock UI 原型，没有真实数据持久化或服务端能力。

