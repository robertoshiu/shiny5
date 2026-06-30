import type { SlideDetail } from "../detailTypes";

export const slideDetail: SlideDetail = {
  slug: "methodology",
  lede: {
    zh: "以高量產 MES 平台（FAB300）為核心、NVIDIA GB300 NVL72 AI Fabric 為算力底座——六層 IT/OT+AI 整合參考方法論，端到端交付，100% 歸檔。",
    en: "Built on the high-volume MES platform (FAB300) and NVIDIA GB300 NVL72 AI Fabric — a six-layer IT/OT+AI reference methodology, end-to-end delivery, 100% archived.",
  },
  sections: [
    {
      heading: { zh: "六層 × 階段交付矩陣", en: "Six-Layer Delivery Matrix" },
      kicker: "// FIG.02 · DELIVERY SCOPE MATRIX",
      block: {
        kind: "table",
        columns: [
          { zh: "類別", en: "Category" },
          { zh: "P1 建廠期 (M1–M6)", en: "P1 Site Build (M1–M6)" },
          { zh: "P2 裝機期 (M7–M15)", en: "P2 Installation (M7–M15)" },
          { zh: "P3 試產期 (M16–M21)", en: "P3 Pilot Production (M16–M21)" },
          { zh: "P4 量產期 (M22+)", en: "P4 Volume Production (M22+)" },
        ],
        rows: [
          [
            { zh: "AI 算力與儲存", en: "AI Compute & Storage" },
            { zh: "機房液冷規劃", en: "DC liquid-cooling planning" },
            { zh: "GB300 主交付", en: "GB300 NVL72 delivery" },
            { zh: "AI Fabric 聯調", en: "AI Fabric integration" },
            { zh: "持續優化", en: "Continuous optimization" },
          ],
          [
            { zh: "平台軟體（MES + AI）", en: "Platform Software (MES + AI)" },
            { zh: "授權規劃", en: "License planning" },
            { zh: "MES 上線", en: "MES go-live" },
            { zh: "模型訓練", en: "Model training" },
            { zh: "SLO 監控", en: "SLO monitoring" },
          ],
          [
            { zh: "高速網絡 Fabric", en: "High-Speed Network Fabric" },
            { zh: "基礎網絡鋪設", en: "Foundation network cabling" },
            { zh: "AI Fabric 部署", en: "AI Fabric deployment" },
            { zh: "全連通驗收", en: "Full-connectivity acceptance" },
            { zh: "持續維運", en: "Ongoing operations" },
          ],
          [
            { zh: "異地備援 DR", en: "Disaster Recovery (DR)" },
            { zh: "選址規劃", en: "DR site selection" },
            { zh: "備援建置", en: "DR infrastructure build" },
            { zh: "首輪演練", en: "First DR drill" },
            { zh: "季度演練", en: "Quarterly drills" },
          ],
          [
            { zh: "資訊安全 OT/IT", en: "IT/OT Security" },
            { zh: "合規底座設計", en: "Compliance baseline design" },
            { zh: "OT 安全整合", en: "OT security integration" },
            { zh: "SOC 上線", en: "SOC go-live" },
            { zh: "SOC 24×7", en: "SOC 24×7" },
          ],
          [
            { zh: "機房 · 液冷 · 供電", en: "Data Center · Liquid Cooling · Power" },
            { zh: "土建施工", en: "Civil works" },
            { zh: "液冷投產", en: "Liquid cooling commissioning" },
            { zh: "環境驗收", en: "Environment acceptance" },
            { zh: "常態維護", en: "Steady-state maintenance" },
          ],
        ],
      },
    },
    {
      heading: { zh: "成果與承諾", en: "Outcomes & Commitments" },
      kicker: "// FIG.04 · OUTCOMES & SLA",
      block: {
        kind: "stats",
        items: [
          {
            value: "≥ 90%",
            label: { zh: "良率目標", en: "Yield Target" },
            sub: { zh: "AI 輔助 SPC/YMS 即時回饋", en: "AI-assisted SPC/YMS real-time feedback" },
          },
          {
            value: "≥ 95%",
            label: { zh: "系統 SLO", en: "System SLO" },
            sub: { zh: "SOC 24×7 覆蓋 MES 及 AI Fabric", en: "SOC 24×7 covering MES and AI Fabric" },
          },
          {
            value: "≤ 4hr",
            label: { zh: "DR RTO", en: "DR RTO" },
            sub: { zh: "RPO ≤ 15min · 溫備援 + SD-WAN 雙 ISP", en: "RPO ≤15min · warm-standby + SD-WAN dual-ISP" },
          },
          {
            value: "100%",
            label: { zh: "跨廠模板歸檔", en: "Cross-Fab Template" },
            sub: { zh: "量產期結束後完整移交", en: "Fully archived on volume-production exit" },
          },
        ],
      },
    },
    {
      heading: { zh: "風險與合規", en: "Risk & Compliance" },
      kicker: "// FIG.05 · RISK & COMPLIANCE",
      block: {
        kind: "cards",
        items: [
          {
            title: { zh: "供應鏈風險", en: "Supply Chain Risk" },
            body: { zh: "鎖單 + 備份方案（HGX B300 擴容）", en: "Forward order lock + fallback (HGX B300 expansion)" },
            tag: { zh: "SUPPLY CHAIN", en: "SUPPLY CHAIN" },
          },
          {
            title: { zh: "匯率風險", en: "FX Risk" },
            body: { zh: "遠期合約鎖匯 · 彈性採購緩衝", en: "Forward FX lock · flexible-sourcing buffer" },
            tag: { zh: "FX RISK", en: "FX RISK" },
          },
          {
            title: { zh: "合規風險", en: "Compliance Risk" },
            body: { zh: "合規底座於裝機期第一階段 Gate 完成驗收", en: "Compliance baseline accepted at Installation Phase Gate 1" },
            tag: { zh: "COMPLIANCE", en: "COMPLIANCE" },
          },
          {
            title: { zh: "交期風險", en: "Schedule Risk" },
            body: { zh: "M1 啟動審批，並行施工 + 週進度里程碑", en: "Approval initiated M1; parallel construction with weekly milestone tracking" },
            tag: { zh: "SCHEDULE", en: "SCHEDULE" },
          },
          {
            title: { zh: "系統整合風險", en: "Integration Risk" },
            body: { zh: "接口凍結於建廠期 Gate 2，EAP 聯調 M5 啟動", en: "Interface freeze at Site Build Gate 2; EAP integration commences M5" },
            tag: { zh: "INTEGRATION", en: "INTEGRATION" },
          },
          {
            title: { zh: "人力風險", en: "Staffing Risk" },
            body: { zh: "關鍵崗位留任計畫 + 知識文件化", en: "Critical-role retention plan + knowledge documentation" },
            tag: { zh: "STAFFING", en: "STAFFING" },
          },
        ],
      },
    },
    {
      heading: { zh: "跨廠複製藍圖", en: "Cross-Fab Replication" },
      kicker: "// FIG.06 · CROSS-FAB REPLICATION",
      block: {
        kind: "list",
        items: [
          { zh: "六層架構設計文件與 BOM", en: "Six-layer architecture docs & BOM" },
          { zh: "MES FAB300 設定基線（7 模組）", en: "MES FAB300 configuration baseline (7 modules)" },
          { zh: "AI 模型基線（良率 / DR 預測）", en: "AI model baselines (yield / DR prediction)" },
          { zh: "OT 安全 Zone/Conduit 策略", en: "OT security Zone/Conduit policy" },
          { zh: "DR 演練腳本與驗收標準", en: "DR drill scripts & acceptance criteria" },
        ],
      },
    },
  ],
};
