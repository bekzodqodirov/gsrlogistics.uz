import type { PrivacyStrings } from '../privacy';

/** Chinese (Simplified) strings for `src/i18n/privacy.ts`, translated from its English branch. */
export const zh: PrivacyStrings = {
  seoTitle: '隐私政策｜GSR Logistics',
  seoDescription: 'GSR Logistics 网站收集哪些个人数据、用于什么目的、提供给谁、保存多久。本政策依据乌兹别克斯坦共和国《个人数据法》（ZRU-547）制定。',
  eyebrow: '隐私政策',
  h1: '隐私政策',
  effective: '生效日期：2026年9月26日',
  intro: '本页说明您通过 gsrlogistics.uz 网站联系我们时会收集哪些数据、为什么需要这些数据，以及数据会提供给谁。本网站不使用 cookie 弹窗，也不加载广告追踪器。',
  operatorLabel: '数据控制者',
  operatorFallback: 'GSR Logistics',
  sections: [
    { heading: '收集哪些数据？', bullets: ['您主动发送的数据：姓名、电话号码、Telegram 用户名、消息内容、货物描述、货物代码。', '技术数据：IP 地址、浏览器和设备类型、访问时间——仅记录在托管服务器日志中。本网站没有访问统计代码，也没有广告脚本。', '运费计算器在您的浏览器中完成计算——您输入的重量和体积不会发送给我们。而货物跟踪表单会把货物代码发送到服务器，以便查询状态。', '当您点击 Telegram 按钮时，网站会向公司自有系统（gsrwms.uz）询问由哪位客户经理答复您。该请求只包含主题（例如“货物”）、页面地址、语言和一个一次性代码（GSR-…）——不包含您的姓名、电话或回答：这些只出现在您自己在 Telegram 上发送的消息中。该代码保存在您浏览器的临时存储（sessionStorage）中，最长一小时，关闭浏览器即删除。'] },
    { heading: '为什么需要这些数据？', bullets: ['答复您的咨询，为您提供报价和路线。', '签订合同并履行运输义务。', '向您通报货物状态。', '保障网站正常运行并发现错误。'] },
    { heading: '法律依据', paragraphs: ['数据的处理基于您的同意（在表单中勾选，或您自己在 Telegram 上发送消息）以及履行合同的需要。您可以随时撤回同意。'] },
    { heading: '数据提供给谁？', bullets: ['Telegram（Telegram FZ-LLC，服务器位于乌兹别克斯坦境外）——当您通过 Telegram 给我们发消息，或表单消息被转发到 Telegram 时。', 'WhatsApp（WhatsApp LLC，服务器位于乌兹别克斯坦境外）——当您通过 WhatsApp 给我们发消息时。点击 WhatsApp 按钮会打开带有预填文字的对话；消息由您自己发送。','GSR 系统（gsrwms.uz，公司自有的客户与订单管理系统，即 CRM）——当您点击 Telegram 按钮时：主题、页面、语言、一次性代码和 IP 地址（用于限制请求次数）。您第一条消息中的代码会把您的咨询关联到对应的客户经理。', 'GitHub, Inc.（美国）——网站托管（GitHub Pages）；服务器日志记录 IP 地址、请求时间和所访问的页面。', 'Google Sheets（美国）——仅限用于货物跟踪的非个人数据（代码、阶段、日期），且仅在该功能启用时。', '国家机关——仅在法律要求时提供。'] },
    { heading: '数据保存多久？', paragraphs: ['咨询消息——保存至咨询结束，并在合同结算期内保留（通常不超过 3 年）。服务器日志——不超过 90 天。应您的要求，数据可提前删除，法律要求保存的除外。'] },
    { heading: '您的权利', bullets: ['了解我们持有您的哪些数据，并获取副本。', '更正不准确的数据。', '要求删除数据或停止处理。', '撤回同意。', '向乌兹别克斯坦共和国总统直属个人化署（Personalisation Agency）投诉。'] },
    { heading: '安全', paragraphs: ['本网站仅支持 HTTPS 访问。表单不会把数据存入数据库：它只是生成消息内容，由您自己通过 Telegram 发送给客户经理。只有经授权的员工才能访问数据。'] },
    { heading: '政策变更', paragraphs: ['政策变更时，本页的日期会随之更新。重大变更我们会在网站上另行公告。'] },
  ],
  contactHeading: '如有疑问',
  contactText: '有关个人数据的请求，请通过 Telegram 或电子邮件发送——我们将在 10 个工作日内答复。',
};
