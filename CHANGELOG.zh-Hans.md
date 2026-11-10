# Changelog

- 联系: gs.lee@konghq.com
- 路径格式为 **上级菜单 > 章节 > 条目**。

---

## Unreleased

### 变更
- AI Management > 用例: 修复多余闭合标签导致仅显示软件工厂页签的问题，恢复六个用例图在标签页间切换显示

- AI Gateway 2.0：按 Enterprise · Konnect 分支概要、架构图与部署强调色。将 LLM 成本估算摘要并入功能变更章节。章节标题改为「AI 2.0 功能变更与改进事项」
- AI Gateway 2.0 > 功能变更 · 改进 > LLM 成本估算：新增 v1·v2 估算与供应商实账对比图
- AI Management：EE 侧栏仅概要可点，其余禁用；仅 AI Cost Management · Catalog · AI Registry 显示「EE 预定」。Konnect 无徽章且全部可用
- AI Management > 用例：六幅图按原架构（Gateway · Context Mesh · Management plane）重绘

## 2026.11.09.6af12729

### 新增

- AI Gateway > 竞品对比
  - 新增 Public Cloud
  - 类别覆盖范围图示
- 许可模型 > 价格基准：补充说明

### 变更

- Kong 企业介绍：章节顺序调整为概要 → 市场变化 → Kong 平台 → 已验证可信度 → 客户案例 → 沿革。将沿革与全球布局拆成独立章节

## 2026.11.06.6aedbacb

### 新增

- 安全与合规映射 > 科技部 Agentic AI 零信任：补充指南 53 项安全功能的 Kong 覆盖范围。Kong 承担的项目标为对应，其余所需控制写入需补充要素

### 变更

- 许可模型 > 价格结构：
  - 将规模配置示例移入价格结构
  - 各计费因子的最小数量以卡片右上角胶囊标签显示
- Event Gateway > 策略行为：增加请求规则、记录转码、字段遮蔽、Backend 认证标签页

### 删除

- Event Gateway > 演示：删除交互式演示章节

## 2026.11.03.6ae9ed14

### 新增

- AI Gateway 2.0 > 新功能 > MCP 捆绑与 1.x listener 模式对比
- AI Gateway > AI GW 1.0 & 2.0：背景 · 对称比较 · 选择标准 · 2.0 链接
- AI Gateway > 切换方式：按工具条目补充

### 变更

- AI Gateway > 核心功能：插件用语改为策略与请求流程
- AI Gateway > 竞品比较：按标签页增加支持项数量汇总条
- 基础设施 > 推荐规模：按规模选择标注所需资源

### 删除

- Agent Gateway > 概览 > 2.0 Agent 实体说明框

## 2026.11.02.6ae86a09
### 新增
- AI Gateway > 竞品比较 > Data Platform（Databricks, Snowflake）
- 语言：繁体中文（`zh-Hant`，台湾/香港用语）· 简体为 `zh-Hans`

### 变更

- AI Gateway > 代表性功能概览
  - PII Sanitizer：评测集对比合并为纵向分组柱状图 · 按类型泄漏率 · 整理字段含义
  - 语义缓存 · 护栏 · 路由 · 令牌压缩 · 熔断开关 · 虚拟密钥行为示意图
  - PII Sanitizer · 令牌压缩 Docker Hub 镜像链接
  - Kong/OpenAI/Mozilla 泄漏率对比

- AI Gateway > 竞品比较
  - 将 AI DLP 对比并入 Endpoint AI Security 标签页
  - 将 API7 · IBM API Connect 合并为 Legacy APIM 标签页
  - 将 FortiAIGate · Netskope · Portkey 合并为 AI Runtime Security 标签页

---


## 2026.10.29.9b351b37
### 新增

- AI Gateway > AI Gateway 2.0
- 语言：简体中文（`zh`，以英文为基准 · 正式书面语校正）
- Agent Gateway > A2A Proxy 适用标准：仅 Service·Route vs ai-a2a-proxy — 判断 · 优势 · 行为差异

### 变更

- Agent Gateway > A2A Proxy：流程 SVG · 文案整理
- 侧栏下载 · 版本框及变更历史弹窗文案应用 EN · JA
