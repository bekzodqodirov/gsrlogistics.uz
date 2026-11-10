import type { ProcessStrings } from '../process';

/** Chinese (Simplified) strings for `src/i18n/process.ts`, translated from its English branch. */
export const zh: ProcessStrings = {
  eyebrow: '合作流程',
  h2: '五个步骤，第一步只需一条消息。',
  intro: '从咨询到收货——一位客户经理，一份合同。每一步会发生什么，您都提前知道。',
  listLabel: '合作流程：五个步骤',
  stepWord: '步骤',
  steps: [
    { glyph: 'chat', title: '您提交咨询', text: '通过 Telegram 或电话。告诉我们货物类型、大致重量和城市，就可以开始了。' },
    { glyph: 'exchange', title: '我们沟通订单', text: '运输方式、单据、包装和计费规则——按 kg 还是按 m³。客户经理解答您的所有问题。' },
    { glyph: 'contract', title: '签好文件，开始工作', text: '合同、您的 GS 客户代码，以及客户经理告知的收货地址：义乌、广州或喀什。您的供应商在发货前把代码写在每一箱上。' },
    { glyph: 'pin', title: '客户经理全程跟进', text: '货物到了哪一站以及照片报告，都会发到 Telegram：收货、装车、边境、塔什干。' },
    { glyph: 'parcel', title: '您接收货物', text: '在塔什干自提，或由我们发往您所在的州。发票交到您手中。' },
  ],
  note: '第一条消息不产生任何义务：告诉我们货物、城市和期限——我们为您提供报价和路线。',
};
