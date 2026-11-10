import type { WhyStrings } from '../why';

/** Chinese (Simplified) strings for `src/i18n/why.ts`, translated from its English branch. */
export const zh: WhyStrings = {
  eyebrow: '为什么选择 GSR',
  h2: '不靠承诺，靠事实。',
  intro: '信任体现在数字和地址上。以下每一条都可以核实。',
  listLabel: '六个理由',
  reasons: [
    {
      glyph: 'warehouse',
      title: '中国 3 个收货点，统一集货',
      text: '我们把多家供应商的货物集中到一处，统一称重、测量并重新包装。收货点位于义乌、广州和喀什，具体发往哪一个由客户经理告知。',
      fact: '义乌 · 广州 · 喀什 · 一个件号，一份账单',
      link: 'warehouse',
      linkLabel: '仓库与质检',
    },
    {
      glyph: 'languages',
      title: '客户经理会说乌兹别克语、俄语和中文',
      text: '由我们替您与供应商沟通：价格、样品、发货日期。您无需亲自与中国供应商打交道。',
      fact: '3 种语言 · 一位客户经理',
    },
    {
      glyph: 'camera',
      title: '每个阶段都有照片报告',
      text: '收货、测量和装车时我们都会拍照。您可以亲眼看到自己的货物——就在 Telegram 上，无需您开口索要。',
      fact: '收货 · 测量 · 装车',
    },
    {
      glyph: 'document',
      title: '清关与单证',
      text: '发票、装箱单、海关编码（HS 编码，ТН ВЭД）、报关单——都由我们负责。由谁担任进口商（您的公司或我们）取决于合作模式，首次沟通时即可商定。关税和增值税依法缴纳，金额我们会提前为您算好。',
      fact: '报关单（GTD）· 提前估算关税和增值税',
      link: 'customs',
      linkLabel: '了解清关',
    },
    {
      glyph: 'scale',
      title: '价格透明：按 kg 或按 m³ 计费',
      text: '体积重公式公开：长 × 宽 × 高（cm）÷ {div}。密度在 {th} kg/m³ 及以上按 kg 计费，低于此值按 m³ 计费。没有任何隐性收费。',
      fact: '拼货 {rate} 起 · ÷ {div} · {th} kg/m³',
      link: 'pricing',
      linkLabel: '全部运价',
    },
    {
      glyph: 'calendar',
      title: '自 {year} 年起与中国合作',
      text: '最初做寻找货源和代采购，后来开展拼货运输。无论是个人还是企业，无论货量是 1 m³ 还是一整个集装箱，我们都同样严谨。',
      fact: '塔什干，{address} · 欢迎来访',
      link: 'contact',
      linkLabel: '地址与联系方式',
    },
  ],
  meta: '价格为参考价 · 更新于 {date}',
};
