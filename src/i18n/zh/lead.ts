import type { LeadStrings } from '../lead';

/** Chinese (Simplified) strings for `src/i18n/lead.ts`, translated from its English branch. */
export const zh: LeadStrings = {
  title: '您想咨询什么？',
  lead: '您的消息会转给专门负责这项业务的客户经理。',
  close: '关闭',
  back: '返回',
  footnote: '将打开 Telegram，消息已预先填好——由您自己点击发送。',
  cargo: {
    label: '货物运输',
    sub: '汽运拼货、空运、铁路、清关',
    question: '货量大约多少？',
    draft: '您好！我想咨询货物运输。货量：{v}。',
    choices: [
      { label: '1 m³ 以下——仅限空运', msg: '1 m³ 以下（空运）' },
      { label: '1–5 m³', msg: '1–5 m³' },
      { label: '5 m³ 以上', msg: '5 m³ 以上' },
      { label: '暂不确定', msg: '暂不确定' },
    ],
  },
  buying: {
    label: '寻找货源与代采购',
    sub: '1688、淘宝、工厂采购；设备和汽车',
    question: '您需要什么？',
    draft: '您好！我想咨询代采购：{v}。',
    choices: [
      { label: '我有链接——请帮我代购', msg: '我有商品链接，需要代购' },
      { label: '请帮我找货源', msg: '需要帮忙找货源' },
      { label: '设备或汽车', msg: '需要设备或汽车' },
    ],
  },
  track: { label: '我的货到哪了？', sub: '每一箱货物的状态——在 Telegram 机器人中随时可查' },
  other: { label: '其他问题', sub: '转给负责综合咨询的客户经理', draft: '您好！我有一个问题：' },
  codeWord: 'Code',
  wait: '正在为您匹配客户经理…',
  done: {
    title: '您的消息已准备好',
    manager: '客户经理',
    open: '在 Telegram 中发送',
    copy: '复制',
    copied: '已复制',
    copyFail: '复制失败——请选中文字后手动复制',
    note: '请将这条消息作为第一条消息原样发送，不要改动。',
  },
};
