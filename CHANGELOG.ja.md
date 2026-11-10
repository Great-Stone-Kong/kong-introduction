# Changelog

- 問い合わせ: gs.lee@konghq.com
- パスは **上位メニュー > セクション > 項目** 形式です。

---

## Unreleased

### 変更

- AI Gateway 2.0: Enterprise · Konnect 選択に応じて概要・アーキテクチャ図・デプロイ強調色を分岐。LLM コスト算定を機能変更セクション配下に要約して吸収。セクションタイトルを「AI 2.0の機能変更および改善事項」に整理
- AI Gateway 2.0 > 機能変更 · 改善 > LLM コスト算定: v1・v2 見積とプロバイダー実請求を比較するグラフを追加
- AI Management: EEでは左メニューの概要のみ活性、他は非活性。AI Cost Management · Catalog · AI Registry にのみ「EE 予定」を表示。Konnectではバッジなしで全セクション活性
- AI Management > 活用事例: 6つの図を元のアーキテクチャ（Gateway · Context Mesh · Management plane）に合わせて再構成

## 2026.11.09.6af12729

### 追加

- AI Gateway > 競合比較
  - Public Cloud を追加
  - カテゴリー別カバー領域の図式化
- ライセンスモデル > 価格基準: 説明を追加

### 変更

- Kong 企業紹介: セクション順を概要 → 市場の変化 → Kong プラットフォーム → 証明された信頼性 → 顧客事例 → 沿革に変更。沿革・グローバル拠点を独立セクションへ分離

## 2026.11.06.6aedbacb

### 追加

- セキュリティおよび規制マッピング > 科学技術部 Agentic AI ゼロトラスト: 案内書の 53 セキュリティ機能に対する Kong の対応範囲を追加。Kong が担う項目は対応と表記し、それ以外に必要な統制は追加が必要な要素に記載

### 変更

- ライセンスモデル > 価格構造:
  - 規模別構成例を価格構造へ移動
  - 算定要素ごとの最小数量をカード右上のピルで表示
- Event Gateway > ポリシー動作: リクエストルール・レコード変換・フィールドマスキング・Backend 認証のタブを追加

### 削除

- Event Gateway > デモ: インタラクティブデモのセクションを削除

## 2026.11.03.6ae9ed14

### 追加

- AI Gateway 2.0 > 新機能 > MCP バンドルと 1.x listener モードの比較
- AI Gateway > AI GW 1.0 & 2.0: 背景 · 対称比較 · 選択基準 · 2.0 リンク
- AI Gateway > 切り替え方式: 個別ツール項目を追加

### 変更

- AI Gateway > コア機能: プラグイン表記をポリシー・リクエストフローに整理
- AI Gateway > 競合比較: タブ別サポート項目数の要約バーを追加
- インフラ構成 > 推奨サイジング: サイジング選択に応じた必要リソース表示

### 削除

- Agent Gateway > 概要 > 2.0 Agent エンティティ案内ボックス

## 2026.11.02.6ae86a09
### 追加
- AI Gateway > 競合比較 > Data Platform（Databricks, Snowflake）
- 言語: 繁体字中国語（`zh-Hant`、台湾/香港表現）· 簡体を `zh-Hans` に区分

### 変更

- AI Gateway > 代表機能概要
  - PII Sanitizer: 評価セット比較を縦グループ棒グラフに統合 · タイプ別漏えい率 · 項目の意味を整理
  - セマンティックキャッシュ・ガード・ルーティング・トークン圧縮・キルスイッチ・仮想キーの動作図を追加
  - PII Sanitizer · トークン圧縮に Docker Hub イメージリンクを追加
  - Kong/OpenAI/Mozilla 漏えい率比較

- AI Gateway > 競合比較
  - AI DLP 比較を Endpoint AI Security タブに統合
  - API7 · IBM API Connect を Legacy APIM タブに統合
  - FortiAIGate · Netskope · Portkey を AI Runtime Security タブに統合

---


## 2026.10.29.9b351b37
### 追加

- AI Gateway > AI Gateway 2.0
- 言語: 簡体字中国語（`zh`、英文基準 · 公式文語調に補正）
- Agent Gateway > A2A Proxy 適用基準: Service·Routeのみ vs ai-a2a-proxy — 判断 · 利点 · 動作差

### 変更

- Agent Gateway > A2A Proxy: フロー SVG · コピー整理
- サイドバーのダウンロード · バージョンボックスおよび変更履歴モーダル文言に EN · JA を適用

## 2026.10.28.63575106
### 追加

- インフラ構成 > 推奨サイジング > API Gateway: Redis S·M·L項目および用途説明を追加

### 変更

- インフラ構成 > 推奨サイジング: セクション紹介文を整理

## 2026.10.28.df84c27f
### 追加

- Agent Gateway > AI Agent セキュリティ事例: Cohere（Qwen3.8の無断アップロード試行）事例を追加
- AI Gateway > 競合製品との比較 > Kong vs IBM API Connectタブ追加

### 変更

- Agent Gateway > AI Agent セキュリティ事例: 各カードの主な原因の下にKongのアプローチを追加
- AI Gateway > 規制 · コンプライアンスセクション削除（セキュリティおよび規制マッピングへ統合）
- ライセンス > 呼び出し量算定: Stream(TCP/TLS)セッション算定方式を追加
- API Gateway > 性能 · 拡張性: GigaOm Benchmark 2025数値に更新
- AI Gateway > 競合製品との比較
  - 既存のLiteLLM単体から Pure AI Gateway（LiteLLM·Portkey·Bifrost）を対象に変更

## 2026.10.22.6ad99f11
### 変更

- AI Gateway > 競合製品との比較 > LiteLLMサプライチェーン事故
  - 10月21日の PyPI 1.107.0 事故を追加
  - 3月24日 · 8月11日 · 10月21日のタイムライン

## 2026.10.19.6ad5f6a0
### 変更

- インフラ構成 > 推奨サイジングの可読性改善

## 2026.10.19.6ad56817
### 変更

- Event Gatewayを上部メニューの独立項目として分離
- Event Gatewayの必要性およびVirtual Clusterの動作例を追加
- ライセンスモデル > 価格構造に Event Gateway、Insomnia を追加

## 2026.10.16.6ad1ab81

### 変更

- API7比較説明の改善

## 2026.10.14.80c47eac

### 追加

- 多言語対応をメインストリームに包含
- Light / Dark モード

## 2026.10.12.8b884563

### 追加

- API Gateway > Kafka Plugins
- API Gateway > Event Gateway

## 2026.10.09.6ac851b8

### 追加

- Insomnia > Postman 移行
- Insomnia > AI 連携

## 2026.10.08.1a004

### 追加

- API Gateway > デモ > シナリオ **部門認可**

### 変更

- API Gateway > API セキュリティ事例
  - タイトル・物語を **2026年金融界の相次ぐ個人情報漏洩** に拡大
  - 照会 API の悪用、API インベントリ（資産管理）、Gateway 管理の一元化、検知の要点を反映
