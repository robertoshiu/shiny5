import type { SlideDetail } from "../detailTypes";

export const slideDetail: SlideDetail = {
  slug: "technology",
  lede: {
    zh: "從 NVIDIA Blackwell Ultra 算力底座、高量產 MES 平台（FAB300）七模組，到 OT/IT 雙域安全架構與 RTO ≤ 4hr 異地備援 — 每一層技術均有規格、合規與合約為後盾。",
    en: "From the NVIDIA Blackwell Ultra compute base and HVM MES Platform (FAB300) 7 modules, to OT/IT dual-domain security and RTO ≤ 4hr resilience — every layer is backed by specifications, compliance, and contract.",
  },
  sections: [
    {
      heading: { zh: "韌性指標", en: "Resilience Metrics" },
      kicker: "// 00 · BY THE NUMBERS",
      block: {
        kind: "stats",
        items: [
          {
            value: "≤4hr",
            label: { zh: "DR RTO", en: "DR RTO" },
            sub: { zh: "關鍵系統復原時間目標", en: "Recovery time objective" },
          },
          {
            value: "≤15min",
            label: { zh: "DR RPO", en: "DR RPO" },
            sub: { zh: "數據復原點目標", en: "Recovery point objective" },
          },
          {
            value: "7",
            label: { zh: "FAB300 模組", en: "FAB300 Modules" },
            sub: { zh: "高量產 MES 全模組", en: "Full HVM MES module set" },
          },
          {
            value: "800Gb/s",
            label: { zh: "網絡頻寬", en: "Network Bandwidth" },
            sub: { zh: "XDR 全互聯", en: "XDR full interconnect" },
          },
        ],
      },
    },
    {
      heading: { zh: "Blackwell Ultra 算力底座", en: "Blackwell Ultra AI Compute" },
      kicker: "// 01 · AI COMPUTE",
      block: {
        kind: "defs",
        items: [
          {
            term: { zh: "GB300 NVL72 × 3", en: "GB300 NVL72 × 3" },
            desc: {
              zh: "GB300 NVL72 算力，液冷機架，構成 AI Fabric 核心。",
              en: "GB300 NVL72 Compute — liquid-cooled racks forming the AI Fabric core.",
            },
          },
          {
            term: { zh: "HGX B300 × 4", en: "HGX B300 × 4" },
            desc: {
              zh: "HGX B300 推理，承擔邊緣推理負載。",
              en: "HGX B300 Inference — handles edge inference workloads.",
            },
          },
          {
            term: { zh: "Quantum-X800", en: "Quantum-X800" },
            desc: {
              zh: "InfiniBand 800Gb/s XDR，東西向 AI 計算全互聯。",
              en: "InfiniBand 800Gb/s XDR — full east-west AI compute interconnect.",
            },
          },
          {
            term: { zh: "Spectrum-X", en: "Spectrum-X" },
            desc: {
              zh: "SN5600 800Gb/s，南北向生產網與 AI 服務橋接。",
              en: "SN5600 800Gb/s — bridges north-south production and AI service networks.",
            },
          },
          {
            term: { zh: "ConnectX-8", en: "ConnectX-8" },
            desc: {
              zh: "SuperNIC + LinkX，每台 GPU 節點 RDMA 卸載。",
              en: "SuperNIC + LinkX — RDMA offload at every GPU node.",
            },
          },
          {
            term: { zh: "儲存", en: "Storage" },
            desc: {
              zh: "NVMe 數據湖，低延遲存取 AI 特徵與時序數據。",
              en: "NVMe Data Lake — low-latency access for AI features and time-series data.",
            },
          },
        ],
      },
    },
    {
      heading: { zh: "高量產 MES 平台（FAB300）", en: "HVM MES Platform (FAB300)" },
      kicker: "// 03 · MES · FAB300",
      block: {
        kind: "list",
        items: [
          { zh: "Dispatching / WIP 調度", en: "Dispatching / WIP" },
          { zh: "Genealogy 譜系追溯", en: "Genealogy" },
          { zh: "APC · R2R + FDC", en: "APC · R2R + FDC" },
          { zh: "Recipe / RMS 配方管理", en: "Recipe / RMS" },
          { zh: "Scheduling / APS 排程", en: "Scheduling / APS" },
          { zh: "SPC / YMS 良率", en: "SPC / YMS" },
          { zh: "設備整合 EAP / SECS-GEM（GEM300）", en: "EAP / SECS-GEM (GEM300)" },
        ],
      },
    },
    {
      heading: { zh: "高速網絡 Fabric", en: "High-Speed Network Fabric" },
      kicker: "// 02 · NETWORK FABRIC",
      block: {
        kind: "cards",
        items: [
          {
            title: { zh: "Quantum-X800 InfiniBand", en: "Quantum-X800 InfiniBand" },
            body: {
              zh: "東西向 AI 計算互聯。GB300 NVL72 節點全互聯，支撐高頻張量並行訓練與 Digital Twin 即時數據流。",
              en: "East-west AI compute interconnect. Full-mesh for GB300 NVL72 nodes, supporting tensor-parallel training and real-time Digital Twin data streams.",
            },
            tag: { zh: "144-port · 800Gb/s XDR", en: "144-port · 800Gb/s XDR" },
          },
          {
            title: { zh: "Spectrum-X SN5600", en: "Spectrum-X SN5600" },
            body: {
              zh: "南北向生產網與 AI 服務網。橋接 OT 生產段與 AI 應用層，對齊 ISA-95 L3/L4 分段。",
              en: "North-south production and AI service network. Bridges OT production zone and AI application layer, aligned to ISA-95 L3/L4 segmentation.",
            },
            tag: { zh: "800Gb/s · 乙太網路", en: "800Gb/s · Ethernet" },
          },
          {
            title: { zh: "ConnectX-8 SuperNIC", en: "ConnectX-8 SuperNIC" },
            body: {
              zh: "每台 GPU 節點的網路介面卡，RDMA 卸載降低 CPU 負擔，LinkX 光纖模組提供低損耗傳輸。",
              en: "NIC for every GPU node; RDMA offload reduces CPU overhead; LinkX optical modules provide low-loss transmission.",
            },
            tag: { zh: "SuperNIC + LinkX", en: "SuperNIC + LinkX" },
          },
        ],
      },
    },
    {
      heading: { zh: "合規基準", en: "Compliance Baseline" },
      kicker: "// 07 · COMPLIANCE",
      block: {
        kind: "defs",
        items: [
          {
            term: { zh: "IEC 62443", en: "IEC 62443" },
            desc: {
              zh: "OT 域安全架構主要參考標準，定義分區（Zone）、管道（Conduit）與安全等級（SL）。",
              en: "Primary reference standard for OT security architecture, defining zones, conduits, and security levels (SL).",
            },
            tag: { zh: "工業自動化與控制系統安全", en: "Industrial automation & control security" },
          },
          {
            term: { zh: "SEMI E187", en: "SEMI E187" },
            desc: {
              zh: "SEMI 針對晶圓廠設備與網路的專項安全規範，覆蓋 SECS-GEM 通訊安全要求。",
              en: "SEMI-specific security specification for fab equipment and networks, covering SECS-GEM communications security requirements.",
            },
            tag: { zh: "半導體工廠網路安全規範", en: "Semiconductor fab cybersecurity spec" },
          },
          {
            term: { zh: "ISA-95", en: "ISA-95" },
            desc: {
              zh: "L3↔L4 整合架構依據，確保 MES 與 ERP/PLM 的資訊交換模型一致。",
              en: "L3↔L4 integration architecture reference; ensures consistent information exchange models between MES and ERP/PLM.",
            },
            tag: { zh: "企業控制系統整合標準", en: "Enterprise-control system integration" },
          },
          {
            term: { zh: "等保 2.0 三級", en: "China MLPS 2.0 Level 3" },
            desc: {
              zh: "中國網路安全等級保護 2.0 三級認證，適用於關鍵資訊基礎設施的安全要求。",
              en: "China Cybersecurity Multi-Level Protection Standard 2.0 Level 3 certification for critical information infrastructure.",
            },
          },
          {
            term: { zh: "密評", en: "Crypto Evaluation" },
            desc: {
              zh: "商用密碼算法（SM2/SM3/SM4）應用安全評估，適用於具有密碼合規要求的場景。",
              en: "Commercial cryptographic algorithm (SM2/SM3/SM4) application security evaluation for cryptographic compliance scenarios.",
            },
            tag: { zh: "商用密碼應用評估", en: "Commercial cryptography assessment" },
          },
        ],
      },
    },
  ],
};
