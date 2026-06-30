import type { SlideDetail } from "../detailTypes";

export const slideDetail: SlideDetail = {
  slug: "contact",
  lede: {
    zh: "顯藝科技直接為您的晶圓廠交付並承擔 IT/OT+AI 全棧的建置、整合與維運責任，100% 歸檔交還。",
    en: "ShinyLogic delivers and owns the full IT/OT+AI stack build, integration, and operations for your fab directly — and hands back 100%-archived cross-fab templates.",
  },
  sections: [
    {
      heading: { zh: "四步交付流程", en: "Engagement Flow" },
      kicker: "// ENGAGE.00 · HOW WE WORK",
      block: {
        kind: "defs",
        items: [
          {
            term: { zh: "01 · 諮詢評估", en: "01 · Consultation" },
            desc: {
              zh: "一通對談，釐清您的晶圓廠建置需求、IT/OT 現況與希望我們承擔的全棧範圍。",
              en: "One call to clarify your fab's build requirements, current IT/OT state, and the full-stack scope you want us to own.",
            },
          },
          {
            term: { zh: "02 · 範圍評估", en: "02 · Scope Assessment" },
            desc: {
              zh: "白紙黑字界定 L1–L6 交付範圍、SLA 指標與驗收標準，簽約前雙方對齊，無灰色地帶。",
              en: "Written definition of L1–L6 delivery scope, SLA metrics and acceptance criteria — both sides aligned before signing, no grey areas.",
            },
          },
          {
            term: { zh: "03 · 建置合約", en: "03 · Delivery Contract" },
            desc: {
              zh: "與您的晶圓廠直接簽訂建置合約，明確商務條款、Gate 里程碑與付款計畫。",
              en: "Direct contract with your fab covering commercial terms, Gate milestones, and payment schedule.",
            },
          },
          {
            term: { zh: "04 · 交付 + 100% 歸檔", en: "04 · Deliver + 100% Archive" },
            desc: {
              zh: "依 8 道 Gate 交付全棧整合層，通過 SLA 驗收，並交還 100% 歸檔的跨廠範本供您未來擴廠重複套用。",
              en: "8-Gate delivery of the full integration stack, SLA acceptance, and 100%-archived cross-fab templates returned for your future expansion reuse.",
            },
          },
        ],
      },
    },
    {
      heading: { zh: "諮詢類型說明", en: "Inquiry Types" },
      kicker: "// INFO.03 · INQUIRY TYPES",
      block: {
        kind: "defs",
        items: [
          {
            term: { zh: "建置規劃", en: "Build Planning" },
            desc: {
              zh: "針對新建或擴建晶圓廠的 IT/OT+AI 全棧建置規劃諮詢。我們直接與貴廠對接，承擔 L1–L6 整合層的建置、整合與維運責任，並交還 100% 歸檔的跨廠範本。",
              en: "IT/OT+AI full-stack build planning consultation for new or expanding fabs. We engage directly with your fab, owning L1–L6 integration delivery, and hand back 100%-archived cross-fab templates.",
            },
            tag: {
              zh: "適合：新建廠、擴建廠、IT/OT 現代化升級",
              en: "For: new fabs, fab expansion, IT/OT modernisation",
            },
          },
          {
            term: { zh: "技術諮詢", en: "Technical Advisory" },
            desc: {
              zh: "針對 AI 算力（GB300/HGX B300）、MES（FAB300）、OT 安全（IEC 62443）或 DR 架構的深度技術評估與選型建議。",
              en: "In-depth technical assessment and selection guidance for AI compute (GB300/HGX B300), MES (FAB300), OT security (IEC 62443), or DR architecture.",
            },
            tag: {
              zh: "適合：架構評估、技術選型、POC 規劃",
              en: "Ideal for: architecture review, selection, POC planning",
            },
          },
          {
            term: { zh: "供應商協調", en: "Vendor Coordination" },
            desc: {
              zh: "晶圓廠建置中的供應商與技術選型協調——我們直接為您的晶圓廠整合硬體、軟體授權與技術堆疊，並承擔交付責任。",
              en: "Supplier and technology-selection coordination during your fab build — we integrate the hardware, software licenses, and technology stack for your fab directly and own delivery accountability.",
            },
            tag: {
              zh: "適合：晶圓廠建置中的供應商與技術選型協調",
              en: "Ideal for: supplier and technology-selection coordination during a fab build",
            },
          },
          {
            term: { zh: "招募", en: "Careers" },
            desc: {
              zh: "加入四階段建設團隊。我們正在尋找 IT/OT 整合、AI 算力基礎設施、MES 工程與 OT 資安各領域的頂尖人才。",
              en: "Join our four-phase build team. We are looking for top talent in IT/OT integration, AI compute infrastructure, MES engineering, and OT security.",
            },
            tag: {
              zh: "適合：工程師、顧問、專案管理",
              en: "Ideal for: engineers, consultants, project managers",
            },
          },
          {
            term: { zh: "媒體", en: "Media" },
            desc: {
              zh: "媒體採訪、行業報告、白皮書合作或活動邀請，請提供您的媒體機構名稱與截稿日期。",
              en: "Press interviews, industry reports, white-paper collaboration, or event invitations. Please include your outlet name and deadline.",
            },
            tag: {
              zh: "適合：記者、分析師、研究機構",
              en: "Ideal for: journalists, analysts, research institutes",
            },
          },
        ],
      },
    },
    {
      heading: { zh: "直接聯絡", en: "Direct Contact" },
      kicker: "// DIRECT.02 · DIRECT CONTACT",
      block: {
        kind: "list",
        items: [
          {
            zh: "電子郵件：hello@shinylogic.tech",
            en: "Email: hello@shinylogic.tech",
          },
          {
            zh: "回覆時效：2 個工作天以內",
            en: "Response time: within 2 business days",
          },
          {
            zh: "服務語言：繁體中文 · 英文 · 简体中文",
            en: "Languages: Traditional Chinese · English · Simplified Chinese",
          },
          {
            zh: "座標：N 24°08′ E 120°41′ · 臺灣 · 新竹科學工業園區附近",
            en: "Coordinates: N 24°08′ E 120°41′ · Taiwan · Hsinchu Science Park vicinity",
          },
        ],
      },
    },
  ],
};
