import type { SlideDetail } from "../detailTypes";

export const slideDetail: SlideDetail = {
  slug: "about",
  lede: {
    zh: "顯藝科技為晶圓廠直接交付 IT/OT+AI 全棧技術棧 — 從 L1 設備訊號到 L6 備援層，以明確 SLA 承擔建置、整合與維運全程責任，並交還 100% 歸檔的跨廠範本。",
    en: "ShinyLogic delivers the IT/OT+AI full-stack directly to your fab — from L1 equipment signals to L6 resilience, with clear SLA ownership across build, integration, and operations, returning a 100%-archived cross-fab template.",
  },
  sections: [
    {
      heading: { zh: "使命與定位", en: "Mission & Positioning" },
      kicker: "// 01 · MISSION & POSITIONING",
      block: {
        kind: "list",
        items: [
          { zh: "IT/OT+AI 全棧整合", en: "IT/OT+AI Full-Stack Integration" },
          { zh: "範圍界定的 SLA 交付", en: "Scope-bounded SLA delivery" },
          { zh: "100% 歸檔跨廠範本", en: "100%-archived cross-fab template" },
          { zh: "HVM 高量產", en: "HVM Scale" },
        ],
      },
    },
    {
      heading: { zh: "我們交付什麼", en: "What We Deliver" },
      kicker: "// 02 · WHAT WE DELIVER",
      block: {
        kind: "defs",
        items: [
          {
            term: { zh: "L1 輸入層", en: "L1 Input Layer" },
            desc: {
              zh: "8 大工藝機台 · SECS-GEM / GEM300 · OPC UA 廠務 · 傳感網絡",
              en: "8 process tool types · SECS-GEM / GEM300 · OPC UA facility automation · sensor networks",
            },
          },
          {
            term: { zh: "L2 數據層", en: "L2 Data Layer" },
            desc: {
              zh: "Historian 時序歸檔 · NVMe Lakehouse · EDA 高頻採集",
              en: "Time-series Historian · NVMe Lakehouse · EDA high-frequency acquisition",
            },
          },
          {
            term: { zh: "L3 算力層", en: "L3 Compute Layer" },
            desc: {
              zh: "GB300 NVL72 AI Fabric · HGX B300 推理 · 800Gb/s Fabric",
              en: "GB300 NVL72 AI Fabric · HGX B300 inference · 800Gb/s fabric",
            },
          },
          {
            term: { zh: "L4 應用層", en: "L4 Application Layer" },
            desc: {
              zh: "Agentic RAG / LLM · Digital Twin（Omniverse）· 高量產 MES 平台（FAB300）",
              en: "Agentic RAG / LLM · Digital Twin (Omniverse) · MES (FAB300)",
            },
          },
          {
            term: { zh: "L5 治理層", en: "L5 Governance Layer" },
            desc: {
              zh: "CCC 中控台 · SOC 24×7 · OT 入侵偵測與資產可視化 · 合規底座",
              en: "CCC control center · SOC 24×7 · OT intrusion detection & asset visibility · compliance base",
            },
          },
          {
            term: { zh: "L6 備援層", en: "L6 Resilience Layer" },
            desc: {
              zh: "溫備援跨區域 · 異步複製 · SD-WAN 雙 ISP · RTO ≤ 4hr / RPO ≤ 15min",
              en: "Warm standby cross-region · async replication · SD-WAN dual ISP · RTO ≤ 4hr / RPO ≤ 15min",
            },
          },
        ],
      },
    },
    {
      heading: { zh: "治理與責任", en: "Governance & Accountability" },
      kicker: "// 03 · GOVERNANCE & ACCOUNTABILITY",
      block: {
        kind: "defs",
        items: [
          {
            term: { zh: "RACI 責任矩陣", en: "RACI Accountability Matrix" },
            desc: {
              zh: "每個決策議題設定唯一的「Accountable」，避免責任模糊。所有重大決策均有書面 RACI 記錄，作為合約附件執行。",
              en: "Every decision issue has a single Accountable, eliminating ambiguity. All major decisions are documented in a written RACI executed as a contract exhibit.",
            },
            tag: { zh: "每議題唯一 A", en: "One A per issue" },
          },
          {
            term: { zh: "8 道 Gate 把關", en: "8-Gate Milestone Sign-off" },
            desc: {
              zh: "交付依八道 Gate 分階段推進；每道 Gate 提交驗收文件，確認後才進入下一階段。進度透明、全程可稽核。",
              en: "Delivery advances through eight Gates; each Gate requires acceptance documents and sign-off before the next phase begins. Fully transparent and auditable end to end.",
            },
            tag: { zh: "逐道驗收把關", en: "Gate-by-gate sign-off" },
          },
          {
            term: { zh: "風險三級升級", en: "Three-Tier Risk Escalation" },
            desc: {
              zh: "紅 / 黃 / 綠三級風險，週報更新；黃級 48hr 升級至項目委員會，紅級即時上報廠方決策者。升級路徑明訂於合約。",
              en: "Red / Yellow / Green risk tiers, updated weekly; Yellow escalates to the project committee within 48hr; Red reports immediately to the fab decision-maker. Escalation path written into the contract.",
            },
            tag: { zh: "紅 / 黃 / 綠", en: "Red / Yellow / Green" },
          },
          {
            term: { zh: "DR 季度演練", en: "Quarterly DR Drills" },
            desc: {
              zh: "每季執行 RTO / RPO 實測演練，結果存檔並列入下季 Review，確保 RTO ≤ 4hr 承諾有實測為憑。",
              en: "Every quarter we execute live RTO/RPO measurement drills. Results are archived and reviewed in the following quarter, ensuring the RTO ≤ 4hr commitment is backed by tested data.",
            },
            tag: { zh: "RTO ≤ 4hr 實測", en: "RTO ≤ 4hr tested" },
          },
        ],
      },
    },
    {
      heading: { zh: "關鍵數字", en: "Key Figures" },
      kicker: "// 06 · KEY FIGURES",
      block: {
        kind: "stats",
        items: [
          {
            value: "GB300",
            label: { zh: "AI Fabric 算力底座", en: "AI Fabric Compute Base" },
            sub: { zh: "NVL72 + HGX B300 推理節點", en: "NVL72 + HGX B300 inference nodes" },
          },
          {
            value: "4",
            label: { zh: "四階段組建節奏", en: "Four-Phase Build Rhythm" },
            sub: { zh: "建廠 → 裝機 → 試產 → 量產", en: "Build → Install → Ramp → HVM" },
          },
          {
            value: "≤4hr",
            label: { zh: "DR RTO", en: "DR RTO" },
            sub: { zh: "RPO ≤ 15min · 溫備援跨區域", en: "RPO ≤ 15min · warm standby cross-region" },
          },
          {
            value: "100%",
            label: { zh: "跨廠範本歸檔", en: "Cross-fab template archived" },
            sub: { zh: "交付完成後移交，可在每座新廠重複套用", en: "Transferred on completion; reusable on every future fab" },
          },
        ],
      },
    },
  ],
};
