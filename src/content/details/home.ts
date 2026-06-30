import type { SlideDetail } from "../detailTypes";

export const slideDetail: SlideDetail = {
  slug: "home",
  lede: {
    zh: "從 8 大工藝機台的訊號，到 AI 決策閉環，再到跨區域異地備援 — 完整六層技術堆疊 100% 歸檔回您。",
    en: "From signals across 8 process tool types, to AI decision loops, to cross-region disaster recovery — complete six-layer stack, 100% archived back to you.",
  },
  sections: [
    {
      heading: { zh: "數字說話", en: "By the Numbers" },
      kicker: "// 02 · BY THE NUMBERS",
      block: {
        kind: "stats",
        items: [
          {
            value: "Gate×8",
            label: { zh: "一次性建置", en: "One-time Build Investment" },
            sub: { zh: "六層全棧 · 逐道 Gate 把關", en: "Six-layer full stack · gated delivery" },
          },
          {
            value: "3yr",
            label: { zh: "3 年 TCO", en: "3-yr TCO" },
            sub: {
              zh: "一次性建置 + 年度維運，三年全生命週期",
              en: "One-time build + annual managed services · three-year total lifecycle",
            },
          },
          {
            value: "AI Fabric",
            label: { zh: "AI 算力底座", en: "AI Compute Foundation" },
            sub: { zh: "3 × GB300 NVL72 · 4 × HGX B300", en: "3 × GB300 NVL72 · 4 × HGX B300" },
          },
          {
            value: "NVMe Lake",
            label: { zh: "NVMe 數據湖", en: "NVMe Data Lake" },
            sub: { zh: "高頻設備數據 + EDA Lakehouse", en: "High-freq equipment data + EDA Lakehouse" },
          },
          {
            value: "≤4hr",
            label: { zh: "DR RTO", en: "DR RTO" },
            sub: { zh: "RPO ≤ 15 min · 溫備援跨區域", en: "RPO ≤ 15 min · Warm standby cross-region" },
          },
          {
            value: "≥95%",
            label: { zh: "系統 SLO", en: "System SLO" },
            sub: { zh: "良率目標 ≥ 90% · SOC 24×7", en: "Yield target ≥ 90% · SOC 24×7" },
          },
        ],
      },
    },
    {
      heading: { zh: "六層架構，一條決策閉環", en: "Six Layers, One Decision Loop" },
      kicker: "// FIG.03 · SYSTEM ARCHITECTURE",
      block: {
        kind: "defs",
        items: [
          {
            term: { zh: "L1 輸入層", en: "L1 Input Layer" },
            desc: {
              zh: "八類工藝機台透過 SECS-GEM / GEM300 協議接入 EAP，OPC UA 收攏廠務自動化訊號，傳感網絡覆蓋溫濕度、震動與電力品質——所有原始訊號在進入數據層前完成協議轉換與邊緣預處理。",
              en: "Eight process tool classes connect to EAP via SECS-GEM / GEM300; OPC UA aggregates facility automation signals; sensor networks cover temperature, vibration, and power quality — all raw signals undergo protocol conversion and edge pre-processing before entering the data layer.",
            },
          },
          {
            term: { zh: "L2 數據層", en: "L2 Data Layer" },
            desc: {
              zh: "Historian 時序歸檔承擔時序數據歸檔，Lakehouse 架構支援 EDA 高頻波形採集；NVMe 數據湖提供低延遲存取，為算力層的 AI 訓練與推理準備結構化特徵。",
              en: "Time-series Historian handles time-series archiving; the Lakehouse architecture supports high-frequency EDA waveform capture; NVMe data lake provides low-latency access, preparing structured features for AI training and inference in the compute layer.",
            },
          },
          {
            term: { zh: "L3 算力層", en: "L3 Compute Layer" },
            desc: {
              zh: "GB300 NVL72 構成 AI Fabric（液冷）；HGX B300 承擔邊緣推理；Quantum-X800 800 Gb/s XDR InfiniBand 全互聯，Spectrum-X SN5600 覆蓋東西向 AI 計算網。",
              en: "GB300 NVL72 systems form the AI Fabric (liquid-cooled); HGX B300 handle edge inference; Quantum-X800 800 Gb/s XDR InfiniBand provides full interconnect; Spectrum-X SN5600 covers east-west AI compute traffic.",
            },
          },
          {
            term: { zh: "L4 應用層", en: "L4 Application Layer" },
            desc: {
              zh: "高量產 MES 平台（FAB300）作為 MES 核心，實證高量產旗艦；Omniverse Digital Twin 以即時 3D 映像呈現產線狀態；Agentic RAG 接收異常訊號後自主推理並閉環回饋製程配方。",
              en: "HVM MES Platform (FAB300) serves as the MES core, proven at HVM production scale; Omniverse Digital Twin renders real-time 3D line status; Agentic RAG autonomously reasons on anomaly signals and closes the loop back to process recipes.",
            },
          },
          {
            term: { zh: "L5 治理層", en: "L5 Governance Layer" },
            desc: {
              zh: "CCC 中控台整合全廠事件告警；SOC 24×7 以 SIEM/SOAR 驅動威脅響應；OT 入侵偵測與資產可視化提供 OT 網絡可視化與入侵偵測；對齊 IEC 62443、SEMI E187 與等保 2.0 三級合規底座。",
              en: "CCC command center consolidates plant-wide event alerts; SOC 24×7 drives threat response via SIEM/SOAR; OT intrusion detection and asset visibility covers OT network visibility; aligned to IEC 62443, SEMI E187, and MLPS 2.0 Level 3.",
            },
          },
          {
            term: { zh: "L6 備援層", en: "L6 Resilience Layer" },
            desc: {
              zh: "溫備援跨區域架構配合異步複製，SD-WAN 雙 ISP 保障廣域鏈路冗餘；關鍵系統 RTO ≤ 4hr、RPO ≤ 15min，DR 演練納入季度 Review 閉環，業務連續性由架構承諾，非事後補救。",
              en: "Warm standby cross-region architecture with async replication; SD-WAN dual-ISP ensures WAN link redundancy; critical systems RTO ≤ 4hr, RPO ≤ 15min; DR drills are part of the quarterly review cycle — continuity is guaranteed by architecture, not remediated after the fact.",
            },
          },
        ],
      },
    },
    {
      heading: { zh: "全棧能力", en: "Full-Stack Capability" },
      kicker: "// 04 · CAPABILITIES",
      block: {
        kind: "cards",
        items: [
          {
            title: { zh: "AI 算力與儲存", en: "AI Compute & Storage" },
            body: {
              zh: "NVIDIA Blackwell Ultra 世代；GB300 NVL72 + HGX B300，承接設備高頻數據與 Digital Twin 資產。",
              en: "NVIDIA Blackwell Ultra generation; GB300 NVL72 + HGX B300, handling high-frequency equipment data and Digital Twin assets.",
            },
            tag: { zh: "GB300 NVL72 · NVMe Lake", en: "GB300 NVL72 · NVMe Lake" },
          },
          {
            title: { zh: "製造執行 MES", en: "Manufacturing Execution MES" },
            body: {
              zh: "高量產 MES 平台（FAB300）— 實證高量產旗艦，與設備自動化深度整合。",
              en: "HVM MES Platform (FAB300) — proven HVM flagship, deeply integrated with equipment automation.",
            },
            tag: { zh: "FAB300 · HVM MES", en: "FAB300 · HVM MES" },
          },
          {
            title: { zh: "高速網絡 Fabric", en: "High-Speed Network Fabric" },
            body: {
              zh: "Quantum-X800 InfiniBand 800Gb/s + Spectrum-X，覆蓋東西向 AI 計算網與南北向生產網。",
              en: "Quantum-X800 InfiniBand 800Gb/s + Spectrum-X, covering east-west AI compute and north-south production networks.",
            },
            tag: { zh: "800 Gb/s", en: "800 Gb/s" },
          },
          {
            title: { zh: "資訊安全 OT/IT", en: "OT/IT Security" },
            body: {
              zh: "OT/IT 雙域：OT 入侵偵測與資產可視化、NGFW、SIEM/SOAR、SOC 24×7，對齊 IEC 62443。",
              en: "Dual OT/IT domains: OT intrusion detection & asset visibility, NGFW, SIEM/SOAR, SOC 24×7, aligned to IEC 62443.",
            },
            tag: { zh: "IEC 62443", en: "IEC 62443" },
          },
          {
            title: { zh: "異地備援 DR", en: "Disaster Recovery DR" },
            body: {
              zh: "溫備援跨區域、異步複製、SD-WAN 雙 ISP；關鍵系統 RTO ≤ 4hr、RPO ≤ 15min。",
              en: "Warm standby cross-region, async replication, SD-WAN dual ISP; critical systems RTO ≤ 4hr, RPO ≤ 15min.",
            },
            tag: { zh: "RTO ≤ 4hr", en: "RTO ≤ 4hr" },
          },
          {
            title: { zh: "企業整合", en: "Enterprise Integration" },
            body: {
              zh: "打通 ISA-95 L3↔L4：ERP/PLM 接口、AMHS/MCS、LIMS、FMCS。",
              en: "Bridging ISA-95 L3↔L4: ERP/PLM interfaces, AMHS/MCS, LIMS, FMCS.",
            },
            tag: { zh: "ISA-95 L3↔L4", en: "ISA-95 L3↔L4" },
          },
        ],
      },
    },
  ],
};
