import type { JourneyStrings } from '../journey';

/** Chinese (Simplified) strings for `src/i18n/journey.ts`, translated from its English branch. */
export const zh: JourneyStrings = {
  eyebrow: '运输路线',
  title: '从中国到您家门口。',
  sub: '每个阶段，一目了然。',
  stageWord: '阶段',
  railLabel: '路线阶段',
  stages: [
    { title: '义乌仓库', short: '义乌仓库', body: '我们对每件货物称重、测量并编号。照片报告会发送到您的 Telegram。', facts: ['收货', '测量', '照片报告'] },
    { title: '装车', short: '装车', body: '您的货物装上卡车，占用其中一部分空间。无需整个集装箱——您只为自己占用的空间付费。', facts: ['件号', '装车日期'] },
    { title: '运输途中', short: '运输途中', body: '经乌鲁木齐抵达霍尔果斯，再途经哈萨克斯坦。运输方式由您选择。铁路运输仅接受整柜。', facts: [] },
    { title: '霍尔果斯：边境与海关', short: '霍尔果斯', body: '发票、装箱单和海关编码（HS 编码）提前备好。清关由我们负责。', facts: ['申报', '关税和增值税测算', '报关单（GTD）'] },
    { title: '塔什干仓库', short: '塔什干仓库', body: '货物已入库——客户经理会通知您。您可以自提，或由我们发往您所在的州。', facts: ['塔什干', '自提或发往您所在的州'] },
    { title: '已交付', short: '已交付', body: '您签收货物。下一批货，要不要帮您算算运费？', facts: [] },
  ],
  chipsLabel: '运输方式',
  chips: { truck: '汽运', rail: '铁路', air: '空运' },
  daysUnit: '天',
  km: { unit: '公里', caption: '义乌 → 塔什干，途经霍尔果斯', daysCaption: { truck: '汽运约', rail: '铁路约', air: '空运约' } },
  footnote: '时效仅供参考，自货物从义乌仓库发出之日起计算。中国收货地址：义乌、广州和喀什。',
  done: '已完成',
  map: {
    aria: '从义乌到塔什干的路线图：义乌、西安、兰州、乌鲁木齐、霍尔果斯、阿拉木图、奇姆肯特、塔什干',
    border: '海关',
    altRoute: '备选路线',
    warehouse: '仓库',
    countries: { cn: '中国', kz: '哈萨克斯坦', uz: '乌兹别克斯坦' },
  },
};
