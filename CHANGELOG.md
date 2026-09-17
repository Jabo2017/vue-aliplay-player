# Changelog

## 4.0.0 (2026-09-17)

面向 Vue 3 的重写版本。Vue 2 项目请继续使用 3.x。

### 新增

- TypeScript 全类型（props / emits / 暴露方法均有 `.d.ts`）
- `license` prop：支持阿里云播放器 License 配置（SDK ≥2.28 必需）
- `aliplayer` prop：注入构造器模式（npm 安装 `aliyun-aliplayer` 的用户，SSR / 严格 CSP 友好）
- `source` 变化自动销毁重建播放器
- vitest 单元测试 8 例
- Vite 7 库构建（ES + UMD + d.ts，gzip ~3KB）

### 变更

- 默认 SDK 从 2.9.3（`de/prismplayer` 旧路径）升级到 **2.27.1**（`apsara-media-box` 新路径，免 License 的最后版本）
- 构建工具从 vue-cli 4 / webpack 4 迁移到 Vite 7
- `package.json` 补 `repository` / `homepage` / `keywords` / `exports` / `files`，`lib/` 产物移出版本控制

### 修复（继承自 3.x 的已知问题）

- 初始化流程会被自身 `dispose()` 作废导致播放器偶发不出现
- `extraInfo` 在 3.x 中不是合法 prop（写成了对象字面量），现在正确透传
- `x5_type` prop 缺失默认值
- 组件卸载时事件解绑拼写错误（`dbclick` → `dblclick`）
- 水印层会拦截控制栏点击（现在 `pointer-events: none`）

### 移除

- Flash 播放器支持（`useFlashPrism` prop 保留透传但已无意义）
- Vue 2 支持（改用 3.x）
