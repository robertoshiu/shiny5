import type { SlideDetail } from "../detailTypes";

export const slideDetail: SlideDetail = {
  slug: "careers",
  lede: {
    zh: "顯藝科技正以四階段節奏組建 IT 智能部，從建廠到量產，每一位工程師都在真實的前沿場景中擔任授權角色 — 不是執行清單，而是拿責任、驅動決策。",
    en: "ShinyLogic is assembling the IT Intelligence Dept across four build phases — from site construction to high-volume manufacturing. Every engineer holds an authorized role in a real frontier environment, with ownership and decisions that matter.",
  },
  sections: [
    {
      heading: { zh: "IT 智能部 八大職能", en: "IT Intelligence Dept — Eight Functions" },
      kicker: "// 02 · TEAM FUNCTIONS",
      block: {
        kind: "cards",
        items: [
          {
            title: { zh: "T1 架構治理", en: "T1 Architecture & Governance" },
            body: {
              zh: "制定 IT/OT 六層技術堆疊藍圖、標準與 Gate 審查流程；RACI 管理與跨廠知識模板歸檔。",
              en: "Define the IT/OT six-layer tech stack blueprint, standards, and Gate review process. Manage RACI and archive cross-fab knowledge templates.",
            },
            tag: { zh: "企業架構 · RACI · Gate Review", en: "Enterprise Arch · RACI · Gate Review" },
          },
          {
            title: { zh: "T2 MES / EAP", en: "T2 MES / EAP" },
            body: {
              zh: "高量產 MES 平台（FAB300）實施、SECS-GEM/GEM300 機台聯調、WIP 調度優化與 APC R2R+FDC 閉環。",
              en: "HVM MES Platform (FAB300) implementation, SECS-GEM/GEM300 equipment integration, WIP dispatching optimization, and APC R2R+FDC closed-loop.",
            },
            tag: { zh: "FAB300 · SECS-GEM · APC FDC", en: "FAB300 · SECS-GEM · APC FDC" },
          },
          {
            title: { zh: "T3 AI / MLOps", en: "T3 AI / MLOps" },
            body: {
              zh: "模型訓練與部署平台（基於 GB300 AI Fabric）、Agentic RAG 開發、Digital Twin 算力供給與 MLOps 流水線。",
              en: "Model training and deployment platform on GB300 AI Fabric, Agentic RAG development, Digital Twin compute supply, and MLOps pipelines.",
            },
            tag: { zh: "GB300 NVL72 · Agentic RAG · Omniverse", en: "GB300 NVL72 · Agentic RAG · Omniverse" },
          },
          {
            title: { zh: "T4 網絡", en: "T4 Network Fabric" },
            body: {
              zh: "Quantum-X800 InfiniBand 800Gb/s AI Fabric、Spectrum-X 東西向交換及南北向生產網設計與維運。",
              en: "Quantum-X800 InfiniBand 800 Gb/s AI Fabric, Spectrum-X east-west switching, and southbound production network design and operations.",
            },
            tag: { zh: "Quantum-X800 · Spectrum-X · OT 網段", en: "Quantum-X800 · Spectrum-X · OT Segment" },
          },
          {
            title: { zh: "T5 資安 / SOC", en: "T5 Security / SOC" },
            body: {
              zh: "OT 入侵偵測與資產可視化、SOC 24×7 SIEM/SOAR 運營、NGFW/EDR/IAM/PAM，對齊 IEC 62443 與等保 2.0 三級。",
              en: "OT intrusion detection and asset visibility, SOC 24×7 SIEM/SOAR operations, NGFW/EDR/IAM/PAM, aligned to IEC 62443 and China MLPS 2.0 Level 3.",
            },
            tag: { zh: "IEC 62443 · SIEM/SOAR · 等保 2.0", en: "IEC 62443 · SIEM/SOAR · MLPS 2.0" },
          },
          {
            title: { zh: "T6 DR 業務連續性", en: "T6 Disaster Recovery" },
            body: {
              zh: "溫備援跨區域架構、異步複製、SD-WAN 雙 ISP；保障 RTO ≤ 4hr / RPO ≤ 15min，DR 演練納入季度 Review。",
              en: "Warm-standby cross-region architecture, async replication, SD-WAN dual ISP; guarantee RTO ≤ 4hr / RPO ≤ 15min with quarterly DR drills.",
            },
            tag: { zh: "RTO ≤ 4hr · RPO ≤ 15min · SD-WAN", en: "RTO ≤ 4hr · RPO ≤ 15min · SD-WAN" },
          },
          {
            title: { zh: "T7 企業整合", en: "T7 Enterprise Integration" },
            body: {
              zh: "打通 ISA-95 L3↔L4 數據流：ERP/PLM 接口、AMHS/MCS、LIMS、FMCS；確保跨系統數據完整性。",
              en: "Bridge ISA-95 L3↔L4 data flows: ERP/PLM interfaces, AMHS/MCS, LIMS, FMCS; ensure cross-system data integrity.",
            },
            tag: { zh: "ISA-95 · ERP/PLM · AMHS/MCS", en: "ISA-95 · ERP/PLM · AMHS/MCS" },
          },
          {
            title: { zh: "T8 中控 CCC", en: "T8 Central Command (CCC)" },
            body: {
              zh: "整合全廠事件告警、KPI 看板、異常升級與跨部門協調；CCC 中控台是全廠可觀測性的單一入口。",
              en: "Aggregate fab-wide event alerts, KPI dashboards, incident escalation, and cross-department coordination. CCC is the single pane of glass for fab observability.",
            },
            tag: { zh: "CCC 中控台 · 全廠告警 · KPI 看板", en: "CCC Console · Fab-Wide Alerts · KPI Dashboards" },
          },
        ],
      },
    },
    {
      heading: { zh: "四階段組建，逐步到位", en: "Four Build Phases — Staged Deployment" },
      kicker: "// 03 · HIRING RHYTHM",
      block: {
        kind: "defs",
        items: [
          {
            term: { zh: "P1 · 建廠期（M1–M6）", en: "P1 · Construction (M1–M6)" },
            desc: {
              zh: "核心架構師與 MES/網絡先鋒，制定技術藍圖，完成機房選址與基礎設施規劃。",
              en: "Founding architects and MES/network pioneers define the tech blueprint, site selection, and data center infrastructure planning.",
            },
            tag: { zh: "架構治理 · 基建規劃", en: "Architecture · Infrastructure Planning" },
          },
          {
            term: { zh: "P2 · 裝機期（M7–M15）", en: "P2 · Equipment Install (M7–M15)" },
            desc: {
              zh: "GB300 NVL72 主交付、AI Fabric 建置、MES 上線；網絡、資安、MLOps 團隊主力加入。",
              en: "Main GB300 NVL72 delivery, AI Fabric build-out, MES go-live; network, security, and MLOps core teams join.",
            },
            tag: { zh: "GB300 AI Fabric · MES · 資安 SOC", en: "GB300 AI Fabric · MES · Security SOC" },
          },
          {
            term: { zh: "P3 · 試產期（M16–M21）", en: "P3 · Trial Production (M16–M21)" },
            desc: {
              zh: "DR 首輪演練、Digital Twin 上線、良率優化閉環啟動；AI/MLOps 與 CCC 中控全員到位。",
              en: "First DR drill, Digital Twin launch, yield optimization closed-loop starts; AI/MLOps and CCC are fully staffed.",
            },
            tag: { zh: "DR 演練 · Digital Twin · 良率優化", en: "DR Drill · Digital Twin · Yield Optimization" },
          },
          {
            term: { zh: "P4 · 量產期（M22+）", en: "P4 · High-Volume Mfg (M22+)" },
            desc: {
              zh: "全員就位，持續維運與優化；SLO ≥ 95%、良率 ≥ 90% 承諾生效，跨廠模板 100% 歸檔。",
              en: "Full team in place, continuous operations and optimization. SLO ≥ 95% and yield ≥ 90% commitments are active; cross-fab templates 100% archived.",
            },
            tag: { zh: "SLO ≥ 95% · 持續優化 · 跨廠複製", en: "SLO ≥ 95% · Continuous Ops · Cross-Fab Scale" },
          },
        ],
      },
    },
    {
      heading: { zh: "拿授權，拿責任", en: "Own the Authority. Own the Outcome." },
      kicker: "// 04 · CULTURE & VALUES",
      block: {
        kind: "stats",
        items: [
          {
            value: "8 Gates",
            label: { zh: "Gate 審查", en: "Gate Reviews" },
            sub: { zh: "四階段逐道把關推進", en: "phased go/no-go across all four build stages" },
          },
          {
            value: "1 A",
            label: { zh: "每議題唯一負責人", en: "Accountable per Issue" },
            sub: { zh: "RACI 強制執行，無層級審批迴圈", en: "RACI enforced, no approval loops" },
          },
          {
            value: "3 Tiers",
            label: { zh: "風險升級", en: "Risk Escalation" },
            sub: { zh: "紅 / 黃 / 綠，透明可視", en: "Red / Amber / Green — always visible" },
          },
          {
            value: "Quarterly",
            label: { zh: "DR 演練", en: "DR Drills" },
            sub: { zh: "納入季度 Review 閉環", en: "integrated into the quarterly review cycle" },
          },
          {
            value: "100%",
            label: { zh: "跨廠模板歸檔", en: "Cross-Fab Templates" },
            sub: { zh: "無知識孤島", en: "zero knowledge silos" },
          },
        ],
      },
    },
    {
      heading: { zh: "代表性職缺", en: "Representative Open Roles" },
      kicker: "// 05 · OPEN ROLES",
      block: {
        kind: "cards",
        items: [
          {
            title: { zh: "IT/OT 解決方案架構師", en: "IT/OT Solution Architect" },
            body: {
              zh: "主導六層技術堆疊設計、Gate 技術審查、跨廠標準模板制定。需具備晶圓廠 IT/OT 整合經驗及 ISA-95 / IEC 62443 知識。",
              en: "Lead six-layer tech stack design, Gate technical reviews, and cross-fab standard template creation. Requires wafer fab IT/OT integration experience and knowledge of ISA-95 / IEC 62443.",
            },
            tag: { zh: "架構治理 · 裝機期優先 · 高級 / Staff", en: "Architecture · Equipment Phase Priority · Senior/Staff" },
          },
          {
            title: { zh: "MES 資深工程師（FAB300）", en: "Sr. MES Engineer (FAB300)" },
            body: {
              zh: "高量產 MES 平台（FAB300）模組實施、SECS-GEM/GEM300 機台聯調、WIP 調度優化與 APC R2R+FDC 閉環。",
              en: "HVM MES Platform (FAB300) module implementation, SECS-GEM/GEM300 equipment integration, Dispatching/WIP optimization, and APC R2R+FDC closed-loop control.",
            },
            tag: { zh: "MES / EAP · 裝機期優先 · 中高級", en: "MES / EAP · Equipment Phase Priority · Mid-Senior" },
          },
          {
            title: { zh: "AI/MLOps 工程師（GPU 叢集）", en: "AI/MLOps Engineer (GPU Cluster)" },
            body: {
              zh: "基於 GB300 NVL72 的模型訓練 / 推理平台建置、MLOps 流水線、Agentic RAG 開發及 Omniverse Digital Twin 算力供給。",
              en: "Build training and inference platform on GB300 NVL72, MLOps pipelines, Agentic RAG development, and Omniverse Digital Twin compute provisioning.",
            },
            tag: { zh: "AI / MLOps · 裝機期 — 試產期 · 中高級 / Senior", en: "AI / MLOps · Install–Trial Phase · Mid-Senior/Senior" },
          },
          {
            title: { zh: "OT 資安工程師 / SOC 分析師", en: "OT Security Engineer / SOC Analyst" },
            body: {
              zh: "OT 入侵偵測與資產可視化部署、SIEM/SOAR 規則開發、SOC 24×7 輪值，確保 IEC 62443 與等保 2.0 三級持續合規。",
              en: "OT intrusion detection and asset visibility deployment, SIEM/SOAR rule development, SOC 24×7 shift coverage, maintaining IEC 62443 and China MLPS 2.0 Level 3 compliance.",
            },
            tag: { zh: "資安 / SOC · 裝機期優先 · 中級 / Mid", en: "Security / SOC · Equipment Phase Priority · Mid-Level" },
          },
          {
            title: { zh: "網絡工程師（InfiniBand / OT）", en: "Network Engineer (InfiniBand / OT)" },
            body: {
              zh: "Quantum-X800 InfiniBand 800Gb/s AI Fabric 部署、Spectrum-X 東西向交換設計、OT 網段隔離與 SD-WAN 雙 ISP 廣域架構。",
              en: "Quantum-X800 InfiniBand 800 Gb/s AI Fabric deployment, Spectrum-X east-west switching design, OT segment isolation, and SD-WAN dual ISP WAN architecture.",
            },
            tag: { zh: "網絡 · 建廠 — 裝機期 · 中高級", en: "Network · Construction–Install Phase · Mid-Senior" },
          },
          {
            title: { zh: "DR / 業務連續性工程師", en: "DR / Business Continuity Engineer" },
            body: {
              zh: "溫備援跨區域架構規劃、異步複製策略、DR 演練腳本設計與執行，確保 RTO ≤ 4hr / RPO ≤ 15min 合約承諾可達成。",
              en: "Warm-standby cross-region architecture planning, async replication strategy, DR drill script design and execution. Ensures RTO ≤ 4hr / RPO ≤ 15min contractual targets are achievable.",
            },
            tag: { zh: "DR / 企業整合 · 試產期優先 · 中高級", en: "DR / Enterprise Integration · Trial Phase Priority · Mid-Senior" },
          },
        ],
      },
    },
  ],
};
