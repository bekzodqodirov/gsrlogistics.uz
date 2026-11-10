import type { ProofStrings } from '../proof';

/** Chinese (Simplified) strings for `src/i18n/proof.ts`, translated from its English branch. */
export const zh: ProofStrings = {
  eyebrow: '您能得到什么',
  h2: '留在您手中的，是这些。',
  intro: '每个阶段，您手里都会留下一份文件、一个代码或一张照片。以下按时间顺序排列。',
  listLabel: '客户获得的内容',
  items: [
    { when: '开始时', title: '合同与发票', text: '价格、时效和责任——白纸黑字写明。凭发票付款，结束时出具服务完成确认书。' },
    { when: '签约后', title: '中国收货地址与 GS 客户代码', text: '中国共有 3 个收货地址，具体发往哪一个由客户经理告知。您的供应商在发货前把 GS 客户代码（唛头）写在每个箱子上，这样您的货物就不会与他人的货物混在一起。' },
    { when: '在收货点', title: '照片报告', text: '收货、测量和装车时都会拍照。重量、体积和件号会连同照片一起发到 Telegram。' },
    { when: '运输途中', title: '机器人里的个人账户', text: '每一箱货都在机器人里单独显示：目前处于六个阶段中的哪一个，一天中任何时间都能查看。', link: 'tracking', linkLabel: '货物跟踪页面' },
    { when: '在塔什干', title: '塔什干仓库自提或送货上门', text: '货物到达后，客户经理会通知您。您可以自提，也可以由我们送到您的地址或发往各州。', link: 'pricing', linkLabel: '配送条件' },
  ],
  facts: {
    label: '线路信息',
    distance: '义乌 → 塔什干，公路里程',
    bordersUnit: '个口岸',
    borders: '霍尔果斯（中哈边境）· 亚拉马或吉什特科普里克（Yallama / Gishtkuprik，哈乌边境）',
    daysUnit: '天',
    days: '汽运拼货，参考时效',
    note: '时效仅供参考，自货物从中国仓库发出之日起计算。',
    nodes: ['义乌', '霍尔果斯', '亚拉马', '塔什干'],
    drawingLabel: '线路：义乌、霍尔果斯、亚拉马、塔什干',
  },
  company: {
    label: '关于公司',
    rows: [
      { value: '8+', unit: '年', label: 'GSR 自 2018 年起' },
      { value: '15', unit: '年', label: '团队在货运行业的经验' },
      { value: '400+', label: '客户' },
    ],
  },
  shots: {
    label: '工作实拍',
    items: [
      { alt: '义乌收货点：GSR Logistics 招牌下码放在托盘上的货物', caption: '义乌收货点。货物在这里拍照、清点、测量，每一箱都会贴上二维码。' },
      { alt: '托盘上打了木架的易碎货物', caption: '易碎货物打木架、放在托盘上，以免途中被压坏。' },
      { alt: '卡车车厢内用缠绕膜包裹的托盘货物', caption: '车厢内：货物码放在托盘上，用缠绕膜包裹。佛山，2026年9月21日。' },
    ],
  },
};
