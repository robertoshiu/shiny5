import type { SlideDetail } from "../detailTypes";

export const slideDetail: SlideDetail = {
  slug: "solutions",
  lede: {
    zh: "六層架構，六個明確的解題框架 — 從設備訊號採集、到 AI 決策閉環、再到跨區域業務連續性，每一層以合約 SLA 為後盾。",
    en: "Six explicit problem-solving frameworks — from equipment signal ingestion to AI decision loops to cross-region business continuity, each layer backed by contractual SLA.",
  },
  sections: [
    {
      heading: { zh: "六大解決方案", en: "Six Solution Blocks" },
      kicker: "// SOL.03 · SOLUTION BLOCKS",
      block: {
        kind: "cards",
        items: [
          {
            title: { zh: "AI 算力與儲存", en: "AI COMPUTE & STORAGE" },
            body: {
              zh: "晶圓廠 AI 工作負載（Digital Twin、Agentic RAG、FDC）要求超算密度算力，普通 GPU 集群無法在生產環境維持足夠吞吐。交付 3 × GB300 NVL72 液冷 AI Fabric、4 × HGX B300 邊緣推理節點與 NVMe 數據湖全鏈路儲存。",
              en: "Fab AI workloads — Digital Twin, Agentic RAG, FDC feature extraction — demand supercomputing density. Delivers 3 × GB300 NVL72 liquid-cooled AI Fabric, 4 × HGX B300 edge inference nodes, and a full-pipeline NVMe data lake.",
            },
            tag: { zh: "GB300 NVL72 + HGX B300", en: "GB300 NVL72 + HGX B300" },
          },
          {
            title: { zh: "製造執行 MES", en: "MANUFACTURING EXECUTION" },
            body: {
              zh: "高量產晶圓廠在 HVM 規模下需要 WIP 自動調度、良率閉環與 EAP 深度整合，一般 MES 平台在爬坡期間瓶頸明顯。FAB300 MES 平台完整七模組上線，8 大工藝機台 SECS-GEM/GEM300 聯調，對齊 ISA-95 L3↔L4。",
              en: "HVM fabs require WIP auto-dispatch, yield loop closure, and deep EAP integration at scale — generic MES platforms bottleneck during ramp. Delivers FAB300 with all 7 modules live, 8 process tool types via SECS-GEM/GEM300, aligned to ISA-95 L3–L4.",
            },
            tag: { zh: "FAB300 · GEM300", en: "FAB300 · GEM300" },
          },
          {
            title: { zh: "高速網絡 Fabric", en: "HIGH-SPEED NETWORK FABRIC" },
            body: {
              zh: "AI Fabric 東西向計算帶寬、MES 南北向生產流量、DR 廣域鏈路三類需求共存，傳統以太網架構無法同時滿足超低延遲與生產網可靠性隔離。Quantum-X800 800Gb/s XDR InfiniBand 搭配 Spectrum-X SN5600 與 SD-WAN 雙 ISP 分層交付。",
              en: "AI Fabric east–west compute, MES north–south production, and DR WAN links coexist in one fab. Quantum-X800 800Gb/s XDR InfiniBand, Spectrum-X SN5600 Ethernet, and SD-WAN dual-ISP deliver layered isolation for all three traffic classes.",
            },
            tag: { zh: "800Gb/s XDR InfiniBand", en: "800Gb/s XDR InfiniBand" },
          },
          {
            title: { zh: "資訊安全 OT/IT", en: "SECURITY — OT & IT" },
            body: {
              zh: "晶圓廠 OT 與 IT 網絡邊界日益模糊，IEC 62443 / SEMI E187 / 等保 2.0 三級多軌合規並行，威脅響應缺乏自動化閉環。OT 入侵偵測與資產可視化、SOC 24×7 SIEM/SOAR 驅動、CCC 中控台統一告警。",
              en: "Fab OT/IT boundaries are increasingly porous under multi-track compliance (IEC 62443 / SEMI E187 / MLPS 2.0 Level 3). OT intrusion detection and asset visibility, SOC 24×7 SIEM/SOAR, and CCC unified alert management close the threat response loop.",
            },
            tag: { zh: "IEC 62443 · SOC 24×7", en: "IEC 62443 · SOC 24×7" },
          },
          {
            title: { zh: "異地備援 DR", en: "DISASTER RECOVERY" },
            body: {
              zh: "晶圓廠單次非計劃停機損失極高，事後備份策略在 AI 工作負載場景下無效，需架構級 RTO/RPO 保障。跨區域溫備援加異步複製確保 RTO ≤ 4hr / RPO ≤ 15min，2 × HGX B300 維持 DR 期間 AI 決策持續。",
              en: "A single unplanned outage carries extreme cost; post-hoc backups fail for AI workloads — architecture-level RTO/RPO guarantees are required. Cross-region warm-standby with async replication delivers RTO ≤ 4hr / RPO ≤ 15min; 2 × HGX B300 keeps AI inference live during DR.",
            },
            tag: { zh: "RTO ≤ 4hr · RPO ≤ 15min", en: "RTO ≤ 4hr · RPO ≤ 15min" },
          },
          {
            title: { zh: "企業整合", en: "ENTERPRISE INTEGRATION" },
            body: {
              zh: "ISA-95 L3 製造執行層與 L4 企業管理層（ERP、PLM）長期割裂，手工對賬與離線報表造成決策滯後。L3↔L4 雙向數據流架構整合 ERP、PLM、AMHS/MCS、LIMS、FMCS，以 OPC UA 與 SECS-GEM 統一接入。",
              en: "ISA-95 L3 and L4 (ERP, PLM) have long been siloed, causing decision lag via manual reconciliation and offline reports. Bidirectional L3↔L4 data-flow integrates ERP, PLM, AMHS/MCS, LIMS, and FMCS via OPC UA and SECS-GEM.",
            },
            tag: { zh: "ISA-95 L3↔L4 · OPC UA", en: "ISA-95 L3↔L4 · OPC UA" },
          },
        ],
      },
    },
    {
      heading: { zh: "成果與承諾", en: "Outcomes & SLA" },
      kicker: "// SOL.04 · OUTCOMES & SLA",
      block: {
        kind: "stats",
        items: [
          {
            value: "≤ 4hr",
            label: { zh: "DR RTO", en: "DR RTO" },
            sub: { zh: "關鍵系統 · 溫備援跨區域", en: "Critical systems · cross-region warm standby" },
          },
          {
            value: "≤ 15min",
            label: { zh: "DR RPO", en: "DR RPO" },
            sub: { zh: "異步複製 · 數據損失上限", en: "Async replication · data-loss ceiling" },
          },
          {
            value: "≥ 95%",
            label: { zh: "系統 SLO", en: "System SLO" },
            sub: { zh: "全系統可用性 · SOC 24×7 監控", en: "Full-system availability · SOC 24×7 monitoring" },
          },
          {
            value: "≥ 90%",
            label: { zh: "良率目標", en: "Yield Target" },
            sub: { zh: "SPC/YMS 閉環 · APC R2R+FDC", en: "SPC/YMS loop · APC R2R+FDC" },
          },
          {
            value: "8 Gate",
            label: { zh: "交付管控", en: "Delivery Governance" },
            sub: { zh: "四階段 · RACI 唯一 A · 三級升級", en: "4 phases · single RACI A · 3-level escalation" },
          },
          {
            value: "100%",
            label: { zh: "模板歸檔", en: "Template Archive" },
            sub: { zh: "跨廠複製就緒 · 知識資產保全", en: "Cross-fab replication ready · knowledge-asset preservation" },
          },
        ],
      },
    },
    {
      heading: { zh: "六層架構解決框架", en: "Six-Layer Solution Framework" },
      kicker: "// SOL.02 · SOLUTION FRAMEWORK",
      block: {
        kind: "defs",
        items: [
          {
            term: { zh: "L1 輸入層", en: "L1 Input Layer" },
            desc: {
              zh: "異質機台協議分歧，訊號孤立，無法統一進入數據管道。8 大工藝機台 SECS-GEM/GEM300 接入、OPC UA 廠務整合與邊緣預處理節點實現協議統一輸出。",
              en: "Heterogeneous equipment protocols isolate signals from the data pipeline. 8 process tool types via SECS-GEM/GEM300, OPC UA facility integration, and edge pre-processing nodes deliver unified protocol output.",
            },
            tag: { zh: "協議統一輸出", en: "Unified protocol output" },
          },
          {
            term: { zh: "L2 數據層", en: "L2 Data Layer" },
            desc: {
              zh: "高頻設備波形數據量大、時序複雜，傳統資料庫無法支撐 AI 特徵工程與 EDA 分析。Historian 時序歸檔、Lakehouse EDA 高頻採集與 NVMe 數據湖構成結構化數據管道。",
              en: "High-frequency waveform volume and time-series complexity exceed traditional DB capacity for AI feature engineering and EDA. Historian, Lakehouse EDA ingestion, and NVMe data lake form a structured pipeline.",
            },
            tag: { zh: "NVMe 結構化數據湖", en: "Structured NVMe data lake" },
          },
          {
            term: { zh: "L3 算力層", en: "L3 Compute Layer" },
            desc: {
              zh: "AI 訓練與即時推理需要超算級算力，普通伺服器集群無法支撐 Digital Twin 與 Agentic RAG 同時運行。3 × GB300 NVL72 液冷 AI Fabric、4 × HGX B300 與 Quantum-X800 800Gb/s XDR 全互聯解決此問題。",
              en: "AI training and real-time inference require supercomputing-grade density standard clusters cannot sustain for Digital Twin and Agentic RAG concurrently. 3 × GB300 NVL72 liquid-cooled AI Fabric, 4 × HGX B300, and Quantum-X800 800Gb/s XDR full mesh address this.",
            },
            tag: { zh: "AI Fabric 決策算力", en: "AI Fabric decision compute" },
          },
          {
            term: { zh: "L4 應用層", en: "L4 Application Layer" },
            desc: {
              zh: "製程知識分散在人腦與 Excel，機台異常後靠工程師人工研判，決策閉環耗時且無法規模化。FAB300 HVM MES 整合 Agentic RAG/LLM 推理與 NVIDIA Omniverse Digital Twin，實現自動決策閉環。",
              en: "Process knowledge is fragmented across engineers and spreadsheets; post-alarm diagnosis is manual and unscalable. FAB300 HVM MES with Agentic RAG/LLM reasoning and NVIDIA Omniverse Digital Twin closes the automated decision loop.",
            },
            tag: { zh: "HVM MES 自動決策", en: "HVM MES automated decisions" },
          },
          {
            term: { zh: "L5 治理層", en: "L5 Governance Layer" },
            desc: {
              zh: "OT 與 IT 網絡邊界模糊，合規要求多軌並行，APT 攻擊與內部威脅難以統一可視化與響應。SOC 24×7 SIEM/SOAR 加 OT 入侵偵測，對齊 IEC 62443 / SEMI E187 / 等保 2.0 三級合規底座。",
              en: "OT/IT boundaries are blurring; multi-track compliance and APT threats lack unified visibility and automated response. SOC 24×7 SIEM/SOAR with OT intrusion detection, aligned to IEC 62443 / SEMI E187 / MLPS 2.0 Level 3.",
            },
            tag: { zh: "IEC 62443 雙域合規", en: "IEC 62443 dual-domain compliance" },
          },
          {
            term: { zh: "L6 備援層", en: "L6 Resilience Layer" },
            desc: {
              zh: "晶圓廠停機成本極高，單點故障或區域性災難需要架構級保障而非事後補救。跨區域溫備援、異步複製與 SD-WAN 雙 ISP 確保 RTO ≤ 4hr / RPO ≤ 15min，DR 季度演練納入治理閉環。",
              en: "Extreme fab downtime cost from single-point failure or regional disaster requires architecture-level guarantees, not reactive fixes. Cross-region warm-standby, async replication, and SD-WAN dual-ISP deliver RTO ≤ 4hr / RPO ≤ 15min with quarterly DR drills in the governance cycle.",
            },
            tag: { zh: "RTO ≤ 4hr 業務連續", en: "RTO ≤ 4hr business continuity" },
          },
        ],
      },
    },
  ],
};
