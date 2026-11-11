import type { ParcelStrings } from '../parcel';

/** Chinese (Simplified) strings for `src/i18n/parcel.ts`, translated from its English branch. */
export const zh: ParcelStrings = {
  title: '一箱货物，六个阶段。',
  hint: '选择一个阶段，看看您的货箱在这一步会经历什么。',
  pickerLabel: '选择阶段图片',
  note: '每一箱都标有您的 GS 客户代码。',
  trackLink: '凭 GS 客户代码跟踪货物',
  steps: [
    {
      text: '您的货箱到达收货地址：称重、测量、拍照。',
      facts: ['义乌 · 广州 · 喀什', 'kg 和 m³', '照片报告'],
    },
    {
      text: '您的货箱与其他客户的货物拼装在同一辆卡车上。',
      facts: ['无需包下整车', '{rate}/m³ 起'],
    },
    {
      text: '卡车出发。运输方式由您选择：汽运或空运。',
      facts: ['汽运 {truckDays} 天', '空运 {airDays} 天'],
    },
    {
      text: '途经两个边境口岸：先是霍尔果斯，然后是亚拉马（Yallama）或吉什特科普里克（Gishtkuprik）。',
      facts: ['霍尔果斯：中哈边境', '报关、关税、增值税'],
    },
    {
      text: '货箱到达塔什干仓库——客户经理会通知您。',
      facts: ['塔什干仓库', '清关由我们办理'],
    },
    {
      text: '您可以自提货箱，或由我们发往您所在的州。',
      facts: ['自提', '发往各州', '发票'],
    },
  ],
};
