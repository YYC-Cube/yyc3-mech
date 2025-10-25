# YYC-机械风

[![CI](https://github.com/YYC-Cube/yyc3-mech/actions/workflows/ci.yml/badge.svg)](https://github.com/YYC-Cube/yyc3-mech/actions/workflows/ci.yml)
[![CD](https://github.com/YYC-Cube/yyc3-mech/actions/workflows/cd.yml/badge.svg)](https://github.com/YYC-Cube/yyc3-mech/actions/workflows/cd.yml)
[![Issues](https://img.shields.io/github/issues/YYC-Cube/yyc3-mech)](https://github.com/YYC-Cube/yyc3-mech/issues) [![Pull Requests](https://img.shields.io/github/issues-pr/YYC-Cube/yyc3-mech)](https://github.com/YYC-Cube/yyc3-mech/pulls) [![Stars](https://img.shields.io/github/stars/YYC-Cube/yyc3-mech?style=social)](https://github.com/YYC-Cube/yyc3-mech/stargazers) [![License](https://img.shields.io/github/license/YYC-Cube/yyc3-mech)](https://github.com/YYC-Cube/yyc3-mech/blob/main/LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/) [![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/) [![pnpm](https://img.shields.io/badge/pnpm-orange?logo=pnpm&logoColor=white)](https://pnpm.io/) [![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/) [![Docker](https://img.shields.io/badge/Docker-Multi--Arch-2496ED?logo=docker&logoColor=white)](https://www.docker.com/) [![Kubernetes](https://img.shields.io/badge/Kubernetes-Production%20Ready-326CE5?logo=kubernetes&logoColor=white)](https://kubernetes.io/)

一个以高可用为目标的 Next.js + Vitest 项目，提供模块化特性域、完善的 CI/CD 流水线与 Kubernetes 部署清单，支持多架构容器镜像与滚动更新。

## 项目目标与定位
- 强调稳定性、可维护性与可观测性，适合生产环境部署。
- 以“模块域（features/modules）”组织 UI、容器与 hooks，提升协作与复用。
- 内置标准化 CI/CD 与 K8S 清单，快速落地自动化发布与水平扩展。

## 核心特性
- 模块域分层：`components / containers / hooks` 职责清晰。
- 质量保障：`lint + typecheck + vitest`，覆盖率工件上传（CI）。
- 容器化交付：多阶段 `Dockerfile`，`HEALTHCHECK` 依据 `/api/health`。
- 高可用部署：K8S Deployment 滚更、HPA 按 CPU/内存扩缩容、Ingress TLS。
- 构建加速：Next 构建缓存与 Docker/Registry 缓存，提高流水线稳定性。

## 架构与目录
- App Router：`app/`（含 `api/health`、业务页面与错误页）。
- 特性域：`features/modules/`（组件、容器、hooks 桶文件与聚合入口）。
- 基础层：`services/`（数据服务）、`store/`（Zustand）、`lib/`（工具）、`contexts/`。
- 测试：`tests/`（Vitest），`vitest.config.ts` 配置。

## 开发与运行
- 安装：`pnpm install`
- 开发：`pnpm dev`
- 构建：`pnpm build`
- 生产：`pnpm start`（默认端口 `3000`，或 `npm run dev -- -p <port>`）

## 质量与规范
- 代码风格：保持类型明确与职责分离，避免耦合 UI 与数据逻辑。
- 提交规范：推荐使用 Conventional Commits（如 `feat: xxx`、`fix: yyy`）。
- 测试策略：以 store 与 lib 为主的单元测试；UI 采用轻量快照与交互测试。

## 安全与配置
- 依赖审计：在 CI 中可增加 `pnpm audit` 或第三方扫描（可选）。
- 环境变量：`NODE_ENV`、`NEXT_TELEMETRY_DISABLED`、`PORT` 等在容器与 K8S 中统一管理。
- Secrets：在 GitHub Actions 与 K8S 中使用安全注入，不直接写入仓库。

## CI 工作流（.github/workflows/ci.yml）
- Node 20 + PNPM 8，缓存 `.next/cache`。
- 步骤：`pnpm install --frozen-lockfile` → `pnpm lint` → `pnpm build` → `pnpm test --coverage`。
- 并发收敛：同分支取消在途任务，避免重复构建。
- 产物：上传覆盖率报告为 artifact（`coverage/`）。

## CD 工作流（.github/workflows/cd.yml）
- 触发：推送 `main` 或发布 `v*.*.*` tag。
- 镜像：Docker Buildx 构建 `linux/amd64, linux/arm64`，推送至 GHCR（`ghcr.io/<owner>/<repo>`）。
- 部署：`kubectl` 应用 `deploy/k8s/*.yaml` 并滚动更新 Deployment；支持镜像缓存与并发控制。
- Secrets：`KUBE_CONFIG`（kubeconfig）、`K8S_NAMESPACE`（目标命名空间）。

## 运维与高可用
- 探针：`HEALTHCHECK` 与 K8S `readiness/liveness` 使用 `/api/health`。
- 资源：合理设置 `requests/limits`，避免过载与抖动。
- 扩缩容：`hpa.yaml` 按 CPU/内存进行自动扩缩容（`min:2`, `max:10`）。
- 发布策略：默认滚动更新；如需金丝雀/蓝绿，可在 Ingress/Service Mesh 层扩展。
- 监控：建议接入 Prometheus/Grafana 与告警（可选）。

## 环境与参数
- Ingress：`ingress.yaml` 使用示例域名 `example.com`，请替换为真实域名与证书。
- 镜像占位：`deployment.yaml` 中 `ghcr.io/OWNER/REPO:latest` 可由 CD 流程注入 digest 或手动替换。

## 分支与版本
- 分支建议：`main`（稳定）/ `feature/*`（开发）。
- 版本：语义化版本 `vX.Y.Z`，CI 自动构建，CD 按标签发布。
- PR 检查：要求 lint/build/test 通过。

## 路线图（Roadmap）
- 引入金丝雀发布与自动回滚策略（失败阈值）。
- 扩充 E2E 测试与端到端监控指标采集。
- 完善多环境（staging/production）工作流与审批。

## 贡献
- Fork → Feature 分支 → 提交 PR（通过 CI 后合并）。
- 保持与现有风格与分层一致，不引入不必要复杂度。

## 联系方式
- 邮箱：`admin@0379.email`
