# 项目结构规范（YYC-机械风）

本文档约定工作区的标准化文件架构、命名和引用规则，便于团队协作与扩展维护。

## 顶层目录
- `app/`：Next.js App Router 路由与页面（仅页面、布局、路由相关服务端组件）。
- `components/`：可复用的 UI 组件（纯展示或轻逻辑），按通用与`ui/`细分。
- `features/`：按业务域分组的模块化功能（推荐逐步迁移）：
  - 示例：`features/observability/`包含页面配套的容器组件、hooks、服务、样式等，仅对该域暴露公共接口。
- `contexts/`：React 上下文与 Provider（如语言、声音、通知）。
- `hooks/`：跨域通用的自定义 hooks（如`useIsMobile`）。
- `lib/`：通用工具库、错误处理、监控初始化等与 UI 无关的辅助逻辑。
- `services/`：接口调用与适配层（REST/GraphQL/文件读写），不直接依赖 UI。
- `store/`：状态管理（如`zustand`），避免和`contexts/`混用职责。
- `types/`：TypeScript 类型定义。
- `styles/`：全局样式与主题（`app/globals.css`保留在`app/`内，域样式在`features/`内）。
- `public/`：静态资源（图片、音频等）。
- `tests/`：单元与集成测试。
- `docs/`：架构、约定、变更记录等文档。

## 命名与组织
- 组件
  - 目录使用`kebab-case`，文件使用`kebab-case`。导出组件使用`PascalCase`。
  - 通用基础组件放在`components/ui/`，业务定制组件放在`features/<domain>/components/`。
- hooks
  - 放在`hooks/`或`features/<domain>/hooks/`，命名以`use`前缀。
- contexts/providers
  - 放在`contexts/`或`features/<domain>/providers/`，只暴露最小必要 API。
- services
  - 与接口耦合的逻辑放在`services/`，按域细分子目录：`services/<domain>/`。
- types
  - 公共类型在`types/`；域专属类型在`features/<domain>/types/`。

## 引用与别名
- 统一使用路径别名`@/`进行绝对导入，避免相对路径层级耦合：
  - 现状：`tsconfig.json`中`"paths": { "@/*": ["./*"] }`，指向项目根。
  - 若迁移到`src/`根（可选阶段性目标），修改为`"@/*": ["./src/*"]`，并将顶层目录迁移到`src/`下（`src/app`, `src/components`, ...）。
- 组件内使用相对路径仅限同级文件间，跨域访问一律使用`@/`。

## 渐进式迁移建议
- 第1步：消除重复与歧义命名
  - 已统一`useIsMobile`到`hooks/use-mobile.tsx`并删除`components/ui/use-mobile.tsx`重复实现。
- 第2步：按业务域建立`features/`分组（示例）
  - `features/observability/`：移动`app/observability/page.tsx`相关容器与专属组件，配套`hooks/`, `services/`, `types/`。
  - `features/modules/`：聚合`module-*`系列（`module-card`, `module-details`, `module-grid`, `module-actions`等）。
- 第3步：可选迁移到`src/`根
  - 新建`src/`并迁移核心目录：`src/app`, `src/components`, `src/features`, `src/contexts`, `src/hooks`, `src/lib`, `src/services`, `src/store`, `src/styles`, `src/types`。
  - 更新`tsconfig.json`路径别名与`tailwind.config.ts`的`content`匹配，验证构建。

## 代码约束（简要）
- UI组件不直接调用`services/`，通过容器组件或hooks注入数据。
- `features/<domain>`内可引用`components/ui`与`lib`，但不反向依赖。
- Provider仅在`app/layout.tsx`或域入口挂载。
- 错误处理统一走`lib/error-handler.ts`或`lib/error-logger.ts`。

## 校验与检查
- 引入 ESLint 规则（可选后续）：
  - import/order、no-restricted-imports 控制跨域引用。
  - filenames/match-regex 统一命名。
- CI 校验：结构变更需通过构建与关键页面冒烟测试。

---
如需我进一步落地第2步（创建`features/observability`并迁移相关文件）或第3步（`src/`根迁移），请告诉我优先级，我将分批实施并保证可编译与预览。