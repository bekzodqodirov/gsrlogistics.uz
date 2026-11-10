import type { TrackSystemStrings } from '../track-system';

/** Chinese (Simplified) strings for `src/i18n/track-system.ts`, translated from its English branch. */
export const zh: TrackSystemStrings = {
  eyebrow: '公开透明',
  h2: '您的每一箱货物，都有自己的二维码',
  intro:
    '在中国的收货点，我们为您的货物拍照、清点、测量，并在每一箱上贴上二维码。此后每到一个阶段，仓库工作人员都会扫描这个二维码——您在 Telegram 机器人里就能看到每一箱货物到了哪里，凌晨 3 点也不例外。',
  shot: {
    caption: '二维码一直留在箱子上：沿途每一次装车和卸车，扫描的都是这个码。',
    alt: '义乌收货点：印有 GS 客户代码的二维码贴纸正贴到纸箱上，纸箱上标有尺寸和重量。',
  },
  beats: [
    {
      title: '收货时——每箱贴上二维码',
      text: '货物到达中国的收货点：我们拍照、清点、测量并录入系统——然后在每一箱上贴上二维码。',
    },
    {
      title: '每个阶段——扫码',
      text: '仓库工作人员在卸货和装货时扫描二维码。扫码由我们完成，您无需做任何操作。',
    },
    {
      title: '在机器人里——每箱单独显示',
      text: '在 Telegram 机器人里，您有自己的个人账户：可以分别看到每一箱货物处于哪个阶段。白天黑夜随时可查，不必询问任何人。',
    },
  ],
  bot: {
    label: 'Telegram 机器人',
    open: '打开机器人',
    how: '用您自己的手机号码绑定——如果号码已在系统中，机器人就能识别您。也可以由客户经理把绑定链接发给您。',
    botHours: '机器人 — 24/7',
    managerLabel: '客户经理',
    link: '货物跟踪如何运作',
  },
};
