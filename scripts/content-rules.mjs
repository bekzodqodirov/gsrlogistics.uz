/**
 * The Chinese and Persian content guards of scripts/check-content.mjs, with the sentences that prove
 * each one works. check-content.mjs runs `selfTest()` before it reads a single page and fails the
 * build if any rule misfires on its own fixtures — nobody can eyeball a Persian or Chinese regex,
 * so every rule carries the sentences it must catch (`bad`) and the ones it must let through
 * (`good`), the denial wording of the claim among them ("this is not a real-time position").
 *
 *   ZH_FA_FORBIDDEN  business claims (GLOSSARY.md §1.4 and the owner's rules behind the uz/ru/en
 *                    FORBIDDEN list): run on EVERY page, on normalised text — Chinese and Persian
 *                    text can appear anywhere (the China addresses are on every locale).
 *   PAGE_RULES       orthography of one language: run on that language's pages only, on the RAW
 *                    text (normalising would hide exactly what they look for).
 *   leakRuns()       untranslated English / Uzbek / Russian prose on a zh or fa page.
 *
 * All new expressions use the `u` flag and Unicode property escapes. Code points are written
 * \u{…}; Persian and Chinese letters are written as themselves.
 */

/* ── Normalisation ──────────────────────────────────────────────────────────────────────────── */

const DIGIT_BLOCKS = [[0x06f0, 0x06f9], [0x0660, 0x0669], [0xff10, 0xff19]]; // Persian, Arabic-Indic, full-width
const CJK = '[\\p{Script=Han}\\u{3000}-\\u{303F}\\u{FF01}-\\u{FF60}]';
const CJK_GAP = new RegExp(`(?<=${CJK})\\s+(?=${CJK})`, 'gu');

/**
 * The text the claim rules read. Without it, Persian digits and RTL marks slip past even the
 * language-neutral rules (retired phone, 0.1 m³, 400+), and a tag between two Chinese words —
 * 我们的<strong>义乌</strong>仓库, which the tag stripper turns into 我们的 义乌 仓库 — defeats every
 * adjacency pattern.
 *   1. bidi controls (LRM, RLM, LRE…RLO, LRI…PDI) are deleted;
 *   2. Persian, Arabic-Indic and full-width digits become 0–9; ٫ (decimal) → ',', ٬ (thousands) → '',
 *      ٪ and ％ → '%', ＋ → '+';
 *   3. Arabic ي ى → Persian ی and Arabic ك → Persian ک;
 *   4. whitespace between two CJK characters is deleted.
 */
export function normalize(t) {
  let s = t.replace(/[\u{200E}\u{200F}\u{202A}-\u{202E}\u{2066}-\u{2069}]/gu, '');
  for (const [lo, hi] of DIGIT_BLOCKS) {
    s = s.replace(new RegExp(`[\\u{${lo.toString(16)}}-\\u{${hi.toString(16)}}]`, 'gu'), (d) => String(d.codePointAt(0) - lo));
  }
  return s
    .replace(/\u{066B}/gu, ',').replace(/\u{066C}/gu, '')
    .replace(/[\u{066A}\u{FF05}]/gu, '%').replace(/\u{FF0B}/gu, '+')
    .replace(/[\u{064A}\u{0649}]/gu, 'ی').replace(/\u{0643}/gu, 'ک')
    .replace(CJK_GAP, '');
}

/* ── Business claims, Chinese and Persian ───────────────────────────────────────────────────── */

/**
 * In the Persian patterns `[\s\p{Cf}]` is "a space or a ZWNJ" (نیم‌فاصله), `(?<!ن)می` keeps the
 * negative نمی… (the denial) out, and `\p{Mn}` is the kasra/hamza of an ezafe. In the Chinese ones
 * `(?<![不非没无未]…)` is the negation the denial wording puts in front of the claim.
 */
export const ZH_FA_FORBIDDEN = [
  /* — customs and documents (the uz/ru "bojsiz / без пошлин" rules) — */
  { id: 'zh.dutyFree', msg: 'promises duty-free shipping (zh)',
    // 个人免税进口限额 is the statutory allowance (Cabinet Resolution No. 244), not a promise — as in
    // the uz rule's "bojsiz olib kirish normalari".
    re: /(?<![不非没无未][^。！？!?]{0,12})(?<!个人|自然人)(?:免税|免关税|包税)\s?(?:运输|运送|送达|发货|进口(?!限额|额度|限值|限制|标准|规定|政策|门槛|上限|配额)|清关|到门|到家|直达|专线)|双清包税|包税包清关|包清关包税/iu,
    bad: ['我们免税运输到塔什干', '双清包税专线', '免税进口到乌兹别克斯坦'],
    good: ['我们从不承诺“免税”、“100%保证”或“最快”。', '个人免税额度为每月 200 美元', '我们不提供免税进口', '内阁第 244 号决议——个人免税进口限额（每月 200 美元）', '免税进口限额为每月 200 美元'] },
  { id: 'zh.noCustoms', msg: 'claims no customs clearance is needed (zh)',
    re: /(?:无需|不需要|不用|免)\s?(?:清关|报关)(?!费|单|员|行)/iu,
    bad: ['无需清关，直接送到', '不用报关'],
    good: ['清关费另计', '需要清关', '小件个人包裹不需要报关单'] },
  { id: 'zh.noDocs', msg: 'claims shipping without documents (zh)',
    re: /(?:无需|不需要|不用|免)(?:任何)?(?:文件|单据|单证|报关单|手续)(?:即可)?(?:进口|运输|发货|清关|运到|送到)/iu,
    bad: ['无需任何文件即可进口'],
    good: ['没有文件的货物不予接收'] },
  { id: 'fa.dutyFree', msg: 'promises duty-free shipping (fa)',
    re: /(?<!«)(?:بدون|بی)[\s\p{Cf}]?(?:پرداخت\s)?(?:گمرک|عوارض(?:\sگمرکی)?|حقوق\sگمرکی|مالیات)[^.؟!?]{0,25}(?:(?<!ن)می[\s\p{Cf}]?(?:رسانیم|آوریم|فرستیم)|حمل\s?(?<!ن)می[\s\p{Cf}]?کنیم|وارد\s?(?<!ن)می[\s\p{Cf}]?کنیم|تحویل\s?(?<!ن)می[\s\p{Cf}]?دهیم)/iu,
    bad: ['بدون گمرک به تاشکند می‌رسانیم'],
    good: ['ما هرگز «بدون گمرک» نمی‌گوییم', 'کالا را بدون گمرک نمی‌رسانیم', 'تا ۲۰۰ دلار در ماه بدون پرداخت حقوق گمرکی دریافت کنید'] },
  { id: 'fa.noCustoms', msg: 'claims no customs clearance is needed (fa)',
    re: /(?:نیازی\sبه|بدون\sنیاز\sبه)\sترخیص|ترخیص(?:\sگمرکی)?\s(?:لازم|ضروری)\sنیست/iu,
    bad: ['نیازی به ترخیص نیست'],
    good: ['برای بسته‌های شخصی تا ۲۰۰ دلار، پرداخت گمرک لازم نیست'] },
  { id: 'fa.noDocs', msg: 'claims shipping without documents (fa)',
    re: /(?:بدون|بی)[\s\p{Cf}]?(?:مدرک|مدارک|اسناد|سند)[^.؟!?]{0,20}(?:(?<!ن)می[\s\p{Cf}]?(?:آوریم|رسانیم|فرستیم)|حمل\s?(?<!ن)می[\s\p{Cf}]?کنیم|وارد\s?(?<!ن)می[\s\p{Cf}]?کنیم)/iu,
    bad: ['بدون مدرک وارد می‌کنیم'],
    good: ['محموله بدون مدرک پذیرفته نمی‌شود'] },

  /* — unprovable claims about the company — */
  { id: 'zh.superlative', msg: 'unprovable superlative (zh)',
    re: /(?:最好|最佳|最优|顶级|最专业|最大|最便宜|最快)的?\s?(?:货运|物流|货代|运输|清关|国际货运)?\s?(?:公司|服务商|企业|品牌)|(?:货运|物流|货代)(?:行业)?(?:第一|之首|龙头|领导者|领导品牌)|排名第一|首屈一指/iu,
    bad: ['我们是最好的物流公司', '货运行业第一'],
    good: ['空运是最快的运输方式', '最适合电子配件', '我们从不说“免税”、“100%保证”或“最快”。', '全球最大的小商品批发市场', '样品是最便宜的保险'] },
  { id: 'zh.intlCompany', msg: 'unprovable "international company" (zh)',
    re: /(?:国际|跨国)(?:性)?(?:物流|货运)?(?:公司|集团|企业)/iu,
    bad: ['GSR是一家国际物流公司'],
    good: ['国际货运的基本知识', '义乌国际商贸城', '国际快递包裹'] },
  { id: 'fa.superlative', msg: 'unprovable superlative (fa)',
    re: /(?<!«)(?:بهترین|برترین|سریع[\s\p{Cf}]?ترین|ارزان[\s\p{Cf}]?ترین|بزرگ[\s\p{Cf}]?ترین|معتبرترین|شماره\s?(?:یک|1))\s(?:شرکت|کارگو|باربری|لجستیک|ارائه[\s\p{Cf}]?دهنده)/iu,
    bad: ['بهترین شرکت کارگو در تاشکند', 'معتبرترین لجستیک'],
    good: ['بهترین گزینه برای نمونه‌ها', 'ما هرگز «سریع‌ترین» نمی‌گوییم', 'حمل هوایی سریع‌ترین حمل‌ونقل است', 'بزرگ‌ترین بازار عمده‌فروشی جهان'] },
  { id: 'fa.intlCompany', msg: 'unprovable "international company" (fa)',
    re: /شرکت(?:ی)?\s?(?:بین[\s\p{Cf}]?(?:ال)?مللی|چند[\s\p{Cf}]?ملیتی)(?![\p{Cf}]?های)|(?:بین[\s\p{Cf}]?(?:ال)?مللی|چند[\s\p{Cf}]?ملیتی)\sهستیم/iu,
    bad: ['ما یک شرکت بین‌المللی هستیم'],
    good: ['شرکت‌های بین‌المللی پست', 'حمل بین‌المللی', 'اتاق بازرگانی بین‌المللی'] },
  { id: 'zh.association', msg: 'unverified association claim (zh)',
    re: /一带一路[^。！？!?；;]{0,20}(?:协会|联盟|官方代表|正式代表|会员|成员单位)|(?:协会|联盟)[^。！？!?；;]{0,10}(?:官方代表|正式代表|正式会员)/iu,
    bad: ['一带一路协会官方代表'],
    good: ['一带一路倡议下的中吉乌铁路'] },
  { id: 'fa.association', msg: 'unverified association claim (fa)',
    re: /(?:یک\sکمربند|کمربند\sو\sجاده|One Belt)[^.؟!?]{0,40}(?:انجمن|نماینده|عضو)|نماینده(?:\p{Mn}|ی)?\sرسمی[^.؟!?]{0,30}انجمن/iu,
    bad: ['نماینده رسمی انجمن یک کمربند'],
    good: ['کمربند و جاده'] },
  { id: 'zh.branches', msg: 'claims regional branches (zh)',
    re: /(?:各州|各地区|各地|全国各地|各省)(?:均|都)?(?:设有|开设|拥有|有)(?:我们的)?(?:分公司|分部|分支机构|办事处)|(?:我们|GSR|公司)(?:在)?[^。！？!?；;]{0,10}(?:设有|开设|拥有)[^。！？!?；;]{0,6}(?:分公司|分部|分支机构)/iu,
    bad: ['我们在各州设有分公司'],
    good: ['免费送到您所在地区的网点', '我们在塔什干设有办公室'] },
  { id: 'fa.branches', msg: 'claims regional branches (fa)',
    re: /(?:شعبه|نمایندگی)(?:[\s\p{Cf}]?(?:های|ها))?\s?(?:ما|خودمان)\s?(?:در|در\sتمام|در\sهمه(?:\p{Mn}|ی)?)\s?(?:استان|ولایت|شهر)|(?:در|در\sتمام|در\sهمه(?:\p{Mn}|ی)?)\s(?:استان|ولایت)(?:[\s\p{Cf}]?(?:های|ها))?[^.؟!?]{0,20}(?:شعبه|نمایندگی)\s?(?:داریم|دارد|دارند)/iu,
    bad: ['شعبه‌های ما در تمام ولایت‌ها'],
    good: ['تحویل رایگان تا شعبه در ولایت شما'] },

  /* — the QR system: staff scan, the client never does — */
  { id: 'zh.scan', msg: 'tells the client to scan the QR (zh) — staff scan, the client never does',
    re: /(?<![不非没无未][^。！？!?]{0,8})(?:(?:您|你)(?:需要|必须|得|要|可以|应该|应|可)?(?:自己|亲自)?|请(?:您|你)?(?:自己|亲自)?)\s?(?:扫描|扫码|扫一扫)|(?:扫描|扫码|扫一扫)(?:二维码|QR码?)?(?:即可|就能|就可以|来|以)?(?:查询|查看|跟踪|追踪)/iu,
    bad: ['您需要扫描二维码', '请扫描纸箱上的二维码', '扫码查询物流'],
    good: ['我需要自己扫描二维码吗？不需要。我们在中国收货时贴上二维码，工作人员在每个环节扫描。', '您无需扫描任何东西', '不需要您扫描', '工作人员扫描二维码，您在机器人中查看'] },
  { id: 'fa.scan', msg: 'tells the client to scan the QR (fa) — staff scan, the client never does',
    re: /(?<!(?:نیست|ندارد|نه|نیازی|لازم)[^.؟!?]{0,40})(?:اسکن\s?(?:کنید|نمایید|بکنید|می[\s\p{Cf}]?(?:کنید|نمایید))|(?:خودتان|شما\sباید|باید\sخودتان)[^.؟!?]{0,25}اسکن\s?(?:کنید|نمایید))/iu,
    bad: ['کد QR را اسکن کنید', 'شما QR را اسکن می‌کنید'],
    good: ['لازم نیست شما چیزی را اسکن کنید', 'آیا خودم باید QR را اسکن کنم؟ نه.', 'کارکنان انبار در هر مرحله QR را اسکن می‌کنند', 'لازم نیست خودتان اسکن کنید'] },

  /* — tracking is stage-by-stage QR scanning: never real-time, never GPS — */
  { id: 'zh.realTime', msg: 'says real-time (zh) — tracking is stage-by-stage QR scanning',
    re: /(?<![不非没无未][^。！？!?；;]{0,10})实时|即时(?:追踪|跟踪|定位|位置|查询|更新|监控|动态)/iu,
    bad: ['提供实时追踪', '即时追踪您的货物'],
    good: ['这不是车辆的实时位置。', '即时估价'] },
  { id: 'zh.livePos', msg: 'claims a live position (zh) — tracking is stage-by-stage QR scanning',
    re: /(?<![不非没无未][^。！？!?；;]{0,10})(?:实时|动态|即时|在线|实况)[^。！？!?；;]{0,4}(?:车辆|卡车|货车|货物)?(?:的)?(?:位置|定位|坐标|轨迹)/iu,
    bad: ['在线查看货车位置'],
    good: ['这不是车辆的实时位置', '仓库位置在义乌', '在线地图上查看仓库位置', '官方在线平台'] },
  { id: 'zh.gps', msg: 'implies live GPS position (zh) — tracking is stage-by-stage QR scanning',
    re: /(?<![不非没无未][^。！？!?；;]{0,10})(?:GPS|北斗|卫星)(?!\s?(?:追踪器|跟踪器|定位器|tracker))\s?(?:定位|追踪|跟踪|监控|实时)|(?<![不非没无未][^。！？!?；;]{0,10})(?:追踪|跟踪|定位|查询)[^。！？!?；;]{0,20}GPS(?!\s?(?:追踪器|跟踪器|定位器|tracker))/iu,
    bad: ['GPS定位追踪您的货物', '卫星定位'],
    good: ['无人机、GPS 追踪器、带 SIM 卡的智能手表', '这不是 GPS 定位'] },
  { id: 'fa.realTime', msg: 'says real-time (fa) — tracking is stage-by-stage QR scanning',
    re: /(?<!(?:نه|نیست)[^.؟!?]{0,20})(?:بلادرنگ|ریل[\s\p{Cf}]?تایم|real[\s-]?time|به[\s\p{Cf}]?صورت\s(?:زنده|لحظه[\s\p{Cf}]?ای|آنی)|لحظه[\s\p{Cf}]?به[\s\p{Cf}]?لحظه|لحظه[\s\p{Cf}]?ای(?!\p{Script=Arabic}))(?![^.؟!?]{0,30}(?:نیست|نمی[\s\p{Cf}]?(?:دهد|کند|شود|بینید)|ندارد))/iu,
    bad: ['ردیابی بلادرنگ', 'اطلاعات لحظه‌ای بار'],
    good: ['وضعیت مرحله به مرحله تغییر می‌کند', 'این ردیابی لحظه‌ای نیست'] },
  { id: 'fa.livePos', msg: 'claims a live position (fa) — tracking is stage-by-stage QR scanning',
    re: /(?:موقعیت|مکان|لوکیشن|ردیابی|رهگیری|پیگیری)(?:[\s\p{Cf}]?(?:ی|\p{Mn}))?\s(?:زنده|لحظه[\s\p{Cf}]?ای|آنی|آنلاین|بلادرنگ)(?![^.؟!?]{0,40}(?:نیست|نمی[\s\p{Cf}]?(?:دهد|کند|شود|بینید)|ندارد))/iu,
    bad: ['موقعیت زنده کامیون را ببینید', 'ردیابی لحظه‌ای محموله', 'پیگیری آنلاین بار'],
    good: ['این موقعیت زنده‌ی خودرو نیست.', 'حیوانات زنده و گیاهان', 'پلتفرم آنلاین رسمی بازار'] },
  { id: 'fa.gps', msg: 'implies live GPS position (fa) — tracking is stage-by-stage QR scanning',
    re: /(?<!(?:نه|نیست|بدون)[^.؟!?]{0,15})(?:GPS|جی[\s\p{Cf}]?پی[\s\p{Cf}]?اس|ماهواره(?:ای)?)(?![\s\p{Cf}]?(?:tracker|ترکر))[^.؟!?]{0,30}(?:ردیابی|رهگیری|پیگیری|موقعیت[\s\p{Cf}]?یابی)|(?:ردیابی|رهگیری|پیگیری)[^.؟!?]{0,30}(?:GPS|جی[\s\p{Cf}]?پی[\s\p{Cf}]?اس)/iu,
    bad: ['ردیابی با GPS', 'پیگیری با جی‌پی‌اس'],
    good: ['پهپادها، ردیاب‌های GPS، ساعت‌های هوشمند'] },

  /* — the owner-confirmed figures: 400+ clients, 10+ trucks a month, GSR 8+ years (2018), the TEAM 15 years — */
  { id: 'zh.clients', msg: 'client count other than the confirmed 400+ (zh)',
    // Like the uz/ru/en rule, a count is a claim when it carries its "+" (多, 余, 以上): "一辆装有 100 位
    // 客户货物的卡车" — a truck carrying 100 clients' goods — is arithmetic, not a client count.
    re: /(?<![\d+])(?!400(?!\d)|1688(?!\d))\d{2,5}\s?(?:\+|多|余|以上)\s?(?:位|家|名)?\s?(?:客户|顾客)|(?:客户|顾客)(?:数|数量|总数)?\s?[:：]?\s?(?!400(?!\d))\d{2,5}\s?(?:\+|多|余)|(?:上千|数千|几千|上万|数万|成千上万)(?:位|家|名)?(?:客户|顾客)/iu,
    bad: ['500多位客户', '客户 1000+', '服务过上千家客户', '已服务 600+ 位客户'],
    good: ['400+客户', '客户 400+', '已服务400多位客户', '2018年客户', '一辆装有 100 位客户货物的卡车', '04 客户经理'] },
  { id: 'zh.trucks', msg: 'truck count other than the confirmed 10+ a month (zh)',
    // GSR's own figure is "10+ trucks a month". A truck count is a claim when it carries the "+" or is a
    // monthly count; "吐尔尕特口岸每天通行 300 多辆卡车" (a border post's capacity) is not GSR's fleet.
    re: /(?<![\d+])(?!10(?!\d))\d{1,4}\s?\+\s?(?:(?:辆|台|趟|车次)\s?)?(?:卡车|货车|大车|重卡|车(?!\p{Script=Han}))|(?:每月|每个月|月均)[^。！？!?；;]{0,8}?(?<![\d+])(?!10(?!\d))\d{1,4}\s?(?:\+|多|余|以上)?\s?(?:辆|趟|车次)|(?<![\d+])(?!10(?!\d))\d{1,4}\s?(?:\+|多|余|以上)?\s?(?:辆|趟|车次)(?:卡车|货车|重卡)?[^。！？!?；;]{0,4}?(?:每月|每个月)/iu,
    bad: ['每月20多辆卡车', '每月 20+ 辆。', '20+ 辆卡车', '每月超过 15 辆'],
    good: ['每月10+辆卡车', '3–4天', '20 多台车床', '超过 3 台设备', '超过 20 辆汽车', '吐尔尕特口岸每天通行 300 多辆卡车'] },
  { id: 'zh.age', msg: 'company age other than the confirmed 8+ years (zh; GSR since 2018)',
    re: /(?<![\d+])(?!8(?!\d))\d{1,3}\s?\+\s?年|(?:GSR|我们|我司|本公司)(?![^。！？!?；;]{0,8}团队)[^。！？!?；;]{0,12}(?:(?<![\d+])(?!8(?!\d))\d{1,3}\s?(?:多|余)?\s?年(?:以上|多|有余)?(?:的)?(?:经验|历史|经营|运营|合作|从业)|(?:超过|逾|近)\s?(?!8(?!\d))\d{1,3}\s?年|(?:成立于|创立于|创办于|始建于)\s?(?!2018)(?:19|20)\d{2})/iu,
    bad: ['10+年', '我们有10年经验', 'GSR 成立于 2015 年', 'GSR Logistics，成立于 2015 年'],
    good: ['GSR — 自2018年起 8+年', '我们的团队拥有15年货运经验', '自2026年起，关税按新规计算', '车龄超过3年的汽车', '公司成立于2018年', '义乌国际商贸城始建于 2002 年', '供应商在平台上超过 5 年为佳'] },
  { id: 'zh.team15', msg: '15 years belongs to the team, not to GSR (zh; GSR is 8+ years, since 2018)',
    re: /(?:^|[。！？!?；;])(?![^。！？!?；;]*团队)[^。！？!?；;]*?(?<![\d+])15\s?年(?!代)/iu,
    bad: ['GSR拥有15年经验。'],
    good: ['团队拥有15年的货运经验。', '关于公司 GSR — 自2018年起 8+年 团队货运经验 15年 客户 400+'] },
  { id: 'fa.clients', msg: 'client count other than the confirmed 400+ (fa)',
    // As in zh: the count is a claim with its "+" or "بیش از" (more than) — not "the goods of 100 clients".
    re: /(?<![\d+])(?:\+\s?(?!400(?!\d))\d{2,5}|(?!400(?!\d))\d{2,5}\s?\+)\s?(?:مشتری|مشتریان)|(?:بیش\s?از|بالای|بالغ\s?بر|افزون\s?بر)\s?(?!400(?!\d))\d{2,5}\s?(?:مشتری|مشتریان)|مشتری(?:ان|\p{Cf}ها)?\s?[:：]?\s?(?:\+\s?(?!400(?!\d))\d{2,5}|(?!400(?!\d))\d{2,5}\s?\+)|(?:هزاران|صدها\sهزار)\sمشتری/iu,
    bad: ['بیش از ۵۰۰ مشتری', 'مشتریان ۱۰۰۰+', 'هزاران مشتری', '+۶۰۰ مشتری'],
    good: ['۴۰۰+ مشتری', '+۴۰۰ مشتری', 'بیش از ۴۰۰ مشتری', 'کامیونی که بار ۱۰۰ مشتری را حمل می‌کند'] },
  { id: 'fa.trucks', msg: 'truck count other than the confirmed 10+ a month (fa)',
    re: /(?<![\d+])(?:\+\s?(?!10(?!\d))\d{1,4}|(?!10(?!\d))\d{1,4}\s?\+)\s?(?:کامیون|تریلی|تریلر|لاری)|(?:ماهانه|ماهیانه|در\sماه|هر\sماه)[^.؟!?]{0,15}?(?:بیش\s?از|بالای|افزون\s?بر)?\s?(?<![\d+])(?!10(?!\d))\d{1,4}\s?(?:کامیون|تریلی|تریلر|لاری)|(?:بیش\s?از|بالای|افزون\s?بر)\s?(?!10(?!\d))\d{1,4}\s?(?:کامیون|تریلی|تریلر|لاری)[^.؟!?]{0,15}(?:ماهانه|ماهیانه|در\sماه|هر\sماه)/iu,
    bad: ['ماهانه +۲۰ کامیون', 'ماهانه بیش از ۱۵ تریلی', 'بیش از ۲۰ کامیون در ماه'],
    good: ['ماهانه ۱۰+ کامیون', 'ماهانه بیش از ۱۰ کامیون', 'بیش از ۳ موتر', 'تروگارت روزانه بیش از ۳۰۰ کامیون را رد می‌کند'] },
  { id: 'fa.age', msg: 'company age other than the confirmed 8+ years (fa; GSR since 2018)',
    re: /(?<![\d+])(?:\+\s?(?!8(?!\d))\d{1,3}|(?!8(?!\d))\d{1,3}\s?\+)\s?سال(?![م\p{Mn}ن])|(?:GSR|شرکت\sما|(?<!\p{Script=Arabic})ما(?!\p{Script=Arabic}))(?![^.؟!?]{0,20}تیم)[^.؟!?]{0,20}(?:بیش\s?از|بالای|افزون\s?بر)\s?(?!8(?!\d))\d{1,3}\s?سال|(?:تأسیس|تاسیس|آغاز\sبه\sکار)[^.؟!?]{0,20}(?!2018)(?:19|20)\d{2}/iu,
    bad: ['+۱۰ سال', 'شرکت ما بیش از ۱۰ سال سابقه دارد', 'تأسیس در ۲۰۱۵'],
    good: ['۸+ سال', 'از سال ۲۰۱۸ با چین کار می‌کنیم', 'تیم ما ۱۵ سال تجربه دارد', 'سابقهٔ فروشنده در پلتفرم بیش از ۵ سال خوب است'] },
  { id: 'fa.team15', msg: '15 years belongs to the team, not to GSR (fa; GSR is 8+ years, since 2018)',
    re: /(?:^|[.؟!?؛;])(?![^.؟!?؛;]*(?:تیم|کارکنان|همکاران))[^.؟!?؛;]*?(?<![\d+])15\s?سال/iu,
    bad: ['GSR ۱۵ سال سابقه دارد.'],
    good: ['تیم ما ۱۵ سال تجربه در حمل‌ونقل دارد.'] },

  /* — the three China receiving points are never GSR's own — */
  { id: 'zh.ourWarehouse', msg: 'claims a China receiving point as our own (zh)',
    re: /我(?:们|司)(?:自己)?的\s?(?:义乌|广州|喀什|中国)?\s?(?:的)?\s?(?:仓库|货仓|库房|仓储中心|收货点)|我(?:们|司)(?:自己)?在\s?(?:义乌|广州|喀什|中国)\s?的\s?(?:仓库|货仓|库房|仓储中心|收货点)|我司\s?(?:义乌|广州|喀什)?\s?仓库|自有(?:的)?(?:仓库|收货点)|自营仓库|GSR(?:\s?Logistics)?\s?(?:的|自有的?|自己的)\s?(?:义乌|广州|喀什)?\s?(?:的)?\s?(?:仓库|收货点)/iu,
    bad: ['我们的义乌仓库', '我们的仓库工作人员', 'GSR的义乌仓库', '我们在义乌的仓库', '我们的收货点'],
    good: ['我们在义乌仓库为您验货', '义乌收货点', '仓库工作人员在每个环节扫描二维码', '我们在义乌的员工'] },
  { id: 'fa.ourWarehouse', msg: 'claims a China receiving point as our own (fa)',
    re: /انبار(?:\p{Cf}?(?:های|ها))?(?:\p{Mn}|ی)?\s?(?:ما|خودمان|خود\sما)(?!\p{Script=Arabic})|انبار(?:\p{Cf}?(?:های|ها))?مان(?!\p{Script=Arabic})|انبار(?:\p{Mn}|ی)?\s?(?:GSR|جی[\s\p{Cf}]?اس[\s\p{Cf}]?آر)|(?:محل|نقطه|نشانی|مرکز)(?:\p{Mn}|ی)?\s(?:تحویل|دریافت)(?:\sبار)?(?:\p{Mn}|ی)?\s(?:ما|خودمان)(?!\p{Script=Arabic})/iu,
    bad: ['انبار ما در ییوو', 'انبارمان', 'انبار GSR در ییوو', 'محل تحویل بار ما در ییوو'],
    good: ['انبار ییوو', 'نقطه دریافت ییوو', 'انبار ماشین‌آلات', 'کارکنان ما در ییوو', 'نشانی ما در تاشکند'] },
  { id: 'zh.partners', msg: 'stale "through partners" claim for Guangzhou (zh)',
    re: /广州[^。！？!?；;]{0,40}(?:通过|经由)(?:合作伙伴|合作方)|(?:通过|经由)(?:合作伙伴|合作方)[^。！？!?；;]{0,40}广州/iu,
    bad: ['广州的货物通过合作伙伴接收'],
    good: ['广州收货点有地址'] },
  { id: 'fa.partners', msg: 'stale "through partners" claim for Guangzhou (fa)',
    re: /گوانگ[\s\p{Cf}]?(?:ژو|جو)[^.؟!?]{0,60}(?:از\sطریق|توسط)\s(?:شرکا|شرکای|همکاران)|(?:از\sطریق|توسط)\s(?:شرکا|شرکای|همکاران)[^.؟!?]{0,60}گوانگ[\s\p{Cf}]?(?:ژو|جو)/iu,
    bad: ['بار گوانگجو را از طریق شرکا دریافت می‌کنیم', 'بار گوانگژو را از طریق شرکا دریافت می‌کنیم'],
    good: ['گوانگجو یک نشانی دریافت دارد'] },

  /* — consolidated cargo: by truck only, from 1 m³; nothing smaller by truck, no single items — */
  { id: 'zh.m3', msg: 'stale truck minimum 0.1 m³ (zh) — consolidated cargo starts at 1 m³',
    re: /(?<![\d.,])0[.,]1\s?(?:立方米|立方|方|CBM|m³|m3)(?!\d)/iu,
    bad: ['最低0.1立方米'],
    good: ['拼货1立方米起'] },
  { id: 'zh.small', msg: 'offers small orders or sub-minimum truck cargo (zh) — the minimum is 1 m³',
    // "1 件起" is an offer only when it is GSR's: 1688's own filter 一件代发 ("ships from 1 piece") is
    // quoted in the 1688 guide and is not one.
    re: /(?:我们|我司|GSR|代购|代采购)[^。！？!?；;]{0,10}(?<![\d.,一二三四五六七八九十百千])(?:1|一)\s?件起(?:购|买|订|发|运)?|(?<![不非没无未][^。！？!?；;]{0,6})单件(?:起|也可|代购|起购|起运)|(?:不足|小于|低于|少于)\s?(?:1|一)\s?(?:立方米|立方|方|CBM|m³)(?![^。！？!?；;]{0,16}空运)[^。！？!?；;]{0,10}(?:也|亦|均)(?:可|能|收|接)|小(?:件|包裹|包)(?:也|亦)(?:可以|可|能够|能)?(?:拼|并入|加入|发)/iu,
    bad: ['我们一件起购', '代采购 1 件起', '不足1立方米也可以', '小件也可以拼', '单件代购'],
    good: ['一件代发（1 件起发）', '不足1立方米的货物请走空运', '卡车拼货1立方米起', '21 件起', '不接受单件代购', '不足 1 立方米的货物也可以走空运'] },
  { id: 'fa.m3', msg: 'stale truck minimum 0.1 m³ (fa) — consolidated cargo starts at 1 m³',
    re: /(?<![\d.,])0[.,]1\s?(?:متر[\s\p{Cf}]?مکعب|مترمکعب|m³|m3|CBM)(?!\d)/iu,
    bad: ['حداقل ۰٫۱ متر مکعب'],
    good: ['از ۱ متر مکعب'] },
  { id: 'fa.small', msg: 'offers small orders or sub-minimum truck cargo (fa) — the minimum is 1 m³',
    re: /(?:(?<!\p{Script=Arabic})از\s(?:یک|1)\s(?:عدد|قلم|دانه|تکه)(?!\p{Script=Arabic})[^.؟!?]{0,20}(?<!ن)می[\s\p{Cf}]?(?:خریم|پذیریم|گیریم|فرستیم)|(?:خرید\s(?:تکی|تک[\s\p{Cf}]?عددی|یک[\s\p{Cf}]?عددی)|بسته(?:\p{Cf}?های|\p{Cf}?ها)?\s(?:کوچک|خرد)\s(?:را\s)?(?:هم|نیز))(?![^.؟!?]{0,30}(?:نمی[\s\p{Cf}]|نه\s|ندار|نیست|ممنوع)))|(?:کمتر|کوچک[\s\p{Cf}]?تر)\sاز\s(?:یک|1)\sمتر[\s\p{Cf}]?مکعب(?![^.؟!?]{0,40}هوایی)[^.؟!?]{0,20}(?:هم|نیز)\s(?:می[\s\p{Cf}]?پذیریم|قبول\sمی[\s\p{Cf}]?کنیم|حمل\sمی[\s\p{Cf}]?کنیم)/iu,
    bad: ['از یک عدد می‌خریم', 'کمتر از ۱ متر مکعب هم می‌پذیریم', 'خرید تکی انجام می‌دهیم'],
    good: ['از ۱ متر مکعب', 'خرید تکی انجام نمی‌دهیم', 'بار کمتر از ۱ متر مکعب را فقط هوایی می‌فرستیم', '一件代发 (ارسال از ۱ عدد)', 'حداقل سفارش ۱ عدد'] },

  /* — rail takes whole containers only: no consolidated (LCL) cargo by rail — */
  { id: 'zh.fclOrLcl', msg: 'offers a choice of FCL or LCL (zh) — rail takes whole containers only',
    re: /FCL\s?(?:或|或者|还是)\s?LCL|LCL\s?(?:或|或者|还是)\s?FCL|整柜\s?(?:或|或者|还是)\s?拼(?:柜|箱)|拼(?:柜|箱)\s?(?:或|或者|还是)\s?整柜/iu,
    bad: ['FCL或LCL', '整柜还是拼箱'],
    good: ['什么是FCL和LCL？'] },
  { id: 'zh.railLcl', msg: 'offers consolidated (LCL) cargo or shared container space by rail (zh) — rail takes whole containers only',
    re: /(?<![不非没无未][^。！？!?；;]{0,6})(?:铁路|班列|火车)(?![^。！？!?；;]{0,12}(?:不|没有|无|只|仅|唯))[^。！？!?；;]{0,12}(?:拼箱|拼柜|拼货|LCL|散货|零担)|集装箱(?:中|里|内)?的?\s?(?:舱位|位置|空间|一部分|部分空间)|(?:共享|合用|共用)(?:一个)?(?:集装箱|货柜)/iu,
    bad: ['铁路也可以拼箱', '集装箱里的舱位', '与其他客户共用一个集装箱'],
    good: ['铁路只运整柜，不做拼箱', 'LCL（拼货）：多个客户的货物共用一辆卡车', '我们不做铁路拼货。', '铁路没有拼货服务'] },
  { id: 'zh.truckOrContainer', msg: 'puts consolidated cargo "in a truck or container" (zh) — consolidated cargo is truck only',
    re: /(?:卡车|货车|汽运|公路运输)\s?(?:或|或者|还是)\s?(?:集装箱|货柜)/iu,
    bad: ['卡车或集装箱'],
    good: ['卡车拼货'] },
  { id: 'fa.fclOrLcl', msg: 'offers a choice of FCL or LCL (fa) — rail takes whole containers only',
    re: /FCL\s(?:یا|و\sیا)\sLCL|LCL\s(?:یا|و\sیا)\sFCL|کانتینر\s(?:کامل|دربست)\s(?:یا|و\sیا)\s(?:بخشی|قسمتی|جا|فضا|نیمه|اشتراکی)/iu,
    bad: ['FCL یا LCL'],
    good: ['FCL و LCL چیست؟'] },
  { id: 'fa.railLcl', msg: 'offers consolidated (LCL) cargo or shared container space by rail (fa) — rail takes whole containers only',
    re: /(?:ریل(?:ی)?|راه[\s\p{Cf}]?آهن|قطار)(?![^.؟!?]{0,25}(?:فقط|تنها|نمی|(?<!\p{Script=Arabic})نه(?!\p{Script=Arabic})|ندارد|نداریم))[^.؟!?]{0,25}(?:LCL|خرده[\s\p{Cf}]?بار|بار\s(?:تجمیعی|اشتراکی|مجموعی)|گروپاژ)|(?:جا|فضا|بخشی|قسمتی)\s(?:از|در)\s(?:یک\s)?کانتینر|کانتینر(?:\p{Cf}?های)?\s(?:مشترک|اشتراکی)/iu,
    bad: ['در حمل ریلی هم بار تجمیعی می‌پذیریم', 'جا در یک کانتینر'],
    good: ['حمل ریلی فقط با کانتینر کامل است؛ در ریل بار تجمیعی نداریم', 'فقط هزینهٔ فضای خود را می‌پردازید، نه کل کانتینر'] },
  { id: 'fa.truckOrContainer', msg: 'puts consolidated cargo "in a truck or container" (fa) — consolidated cargo is truck only',
    re: /(?:کامیون|تریلی|لاری)\s(?:یا|و\sیا)\sکانتینر|کانتینر\s(?:یا|و\sیا)\s(?:کامیون|تریلی|لاری)/iu,
    bad: ['کامیون یا کانتینر'],
    good: ['کامیون و قطار'] },

  /* — no promise about how fast a reply arrives — */
  { id: 'zh.reply', msg: 'promises a reply speed (zh)',
    re: /(?:马上|立即|立刻|即时|秒|迅速|及时|第一时间|\d+\s?分钟(?:内|之内)?|几分钟(?:内)?)\s?(?:回复|答复|回应|回覆|响应)|最快(?:的)?(?:回复|答复|联系方式)|回复最快/iu,
    bad: ['我们马上回复', '5分钟内回复'],
    good: ['我们在工作时间内回复', '个人数据请求我们会在10个工作日内回复'] },
  { id: 'fa.reply', msg: 'promises a reply speed (fa)',
    re: /(?:فوری|فورا\p{Mn}|فورا|بلافاصله|سریعا\p{Mn}|سریعا|در\sاسرع\sوقت|در\s(?:کمتر\sاز\s)?\d+\sدقیقه|ظرف\s(?:چند|\d+)\sدقیقه)[^.؟!?]{0,15}(?:پاسخ|جواب)|(?:پاسخ|جواب)(?:[\s\p{Cf}]?(?:گویی|دهی))?[^.؟!?]{0,10}(?:فوری|سریع|بلافاصله|آنی)|سریع[\s\p{Cf}]?ترین\s(?:پاسخ|جواب|راه\s(?:تماس|ارتباط))/iu,
    bad: ['فوراً پاسخ می‌دهیم', 'سریع‌ترین راه تماس'],
    good: ['در ساعات کاری پاسخ می‌دهیم', 'ظرف ۱۰ روز کاری پاسخ می‌دهیم'] },

  /* — what the Chinese and Persian sites invite a reader to assume, and nothing confirms — */
  { id: 'zh.wechat', msg: 'offers a WeChat/QQ contact (zh) — GSR has no such account; the channels are Telegram, WhatsApp, phone and e-mail',
    re: /(?:添加|加)(?:我们的?)?\s?(?:微信|WeChat|QQ)|(?:微信|WeChat|QQ)\s?(?:号|联系|咨询|客服|二维码)|联系(?:我们)?(?:的)?(?:方式)?\s?[：:]?\s?(?:微信|WeChat|QQ)(?!支付|Pay)/iu,
    bad: ['添加我们的微信', '请通过微信联系我们', '联系我们：微信'],
    good: ['绝不要付款到个人微信或银行卡', '通过支付宝或微信支付向卖家付款'] },
  { id: 'fa.persianStaff', msg: 'claims Persian-speaking staff (fa) — the managers speak Uzbek, Russian and Chinese',
    re: /(?:مدیران|کارشناسان|مشاوران|همکاران)(?:\sما)?[^.؟!?]{0,40}(?:فارسی|دری)\s?(?:صحبت|پاسخ|می[\s\p{Cf}]?دانند|بلدند)|پشتیبانی\s(?:به\s)?(?:زبان\s)?(?:فارسی|دری)|(?:به\s)?زبان\s(?:فارسی|دری)\sپاسخ/iu,
    bad: ['مدیران ما به فارسی پاسخ می‌دهند', 'مدیران ما فارسی صحبت می‌کنند', 'پشتیبانی به زبان فارسی'],
    good: ['کارشناسان ما به ازبکی، روسی و چینی پاسخ می‌دهند'] },
  { id: 'zh.destination', msg: 'claims delivery beyond Uzbekistan (zh) — GSR ships China → Uzbekistan',
    re: /(?:运往|运到|运至|送到|送往|发往|直达|寄往|寄到)\s?(?:阿富汗|伊朗|喀布尔|德黑兰|马扎里沙里夫|赫拉特|哈萨克斯坦|吉尔吉斯斯坦|塔吉克斯坦|土库曼斯坦|俄罗斯)(?!边境|边界|口岸|过境|境内|一侧|段)/iu,
    bad: ['我们也可以运往阿富汗', '直达伊朗'],
    good: ['经哈萨克斯坦运到塔什干', '从义乌经霍尔果斯直达塔什干', '货物运到哈萨克斯坦边境'] },
  { id: 'fa.destination', msg: 'claims delivery beyond Uzbekistan (fa) — GSR ships China → Uzbekistan',
    re: /(?:به|تا)\s(?:افغانستان|ایران|کابل|هرات|مزار[\s\p{Cf}]?شریف|قندهار|تهران|مشهد|قزاقستان|قرقیزستان|تاجیکستان|ترکمنستان|روسیه)[^.؟!?]{0,20}(?:(?<!ن)می[\s\p{Cf}]?(?:رسانیم|فرستیم|آوریم|بریم)|حمل\s?(?<!ن)می[\s\p{Cf}]?کنیم|ارسال\s?(?<!ن)می[\s\p{Cf}]?کنیم|تحویل\s?(?<!ن)می[\s\p{Cf}]?دهیم)/iu,
    bad: ['بار را به کابل هم می‌رسانیم', 'به افغانستان ارسال می‌کنیم'],
    good: ['از طریق قزاقستان به تاشکند می‌رسد', 'به افغانستان ارسال نمی‌کنیم'] },
];

/* ── Orthography, per page language (raw text) ──────────────────────────────────────────────── */

// Persian letters (not digits, harakat or punctuation of the Arabic block).
const FA_LETTER = '[\\u{0620}-\\u{064A}\\u{066E}-\\u{06D3}\\u{06D5}\\u{06FA}-\\u{06FF}]';
// Any Arabic-script character: letters and the Persian digits ۰–۹.
const FA_ANY = '\\p{Script=Arabic}';

/** level: 'error' fails the build on any page of that language; 'warn' is reported. */
export const PAGE_RULES = {
  zh: [
    { id: 'zh.traditional', level: 'error', msg: 'Traditional Chinese character on a zh-Hans page',
      re: /[們這貨運關門國車價買賣東華區號際應會與對從過網務電話覽頁說請問題種類點擊報錢費稅單據聯絡讓幫]/u,
      bad: ['我們的貨運'], good: ['我们的货运'] },
    { id: 'zh.halfPunct', level: 'warn', msg: 'half-width , ; : ? ! between Chinese characters (use ，；：？！)',
      re: /(?<=\p{Script=Han})[,;:?!](?=\p{Script=Han})/u,
      bad: ['运输,清关'], good: ['运输，清关', 'GSR Logistics, Tashkent'] },
    { id: 'zh.pinyin', level: 'warn', msg: 'pinyin place name inside Chinese text (义乌, 广州, 喀什 …; a gloss in parentheses is fine)',
      re: /(?<=\p{Script=Han}\s?)(?:Yiwu|Guangzhou|Kashgar|Shenzhen|Urumqi|Lanzhou|Khorgos)\b(?!\s?[)）])|(?<![(（]\s?)\b(?:Yiwu|Guangzhou|Kashgar|Shenzhen|Urumqi|Lanzhou|Khorgos)(?=\s?\p{Script=Han})/u,
      bad: ['从Yiwu发货', '从 Guangzhou 发货'], good: ['义乌（Yiwu）', '义乌 (Yiwu)', 'from Yiwu to Tashkent'] },
  ],
  fa: [
    { id: 'fa.arabicLetters', level: 'error', msg: 'Arabic ي / ك / ى in Persian text (write ی and ک)',
      re: /[\u{064A}\u{0643}\u{0649}]/u,
      bad: ['\u{0643}ارگو', 'ی\u{064A}وو'], good: ['کارگو', 'ییوو'] },
    // DECISIONS.md: Persian digits in every displayed quantity, price, date, duration, count and year;
    // ASCII only inside identifiers (phones, codes, 1688, 20GP, HS codes, URLs). So an ASCII figure
    // that a Persian unit follows, or that از / تا (from / to) introduces, is a figure printed past
    // src/lib/format.ts — "20–35 روز", "از 2018". Phones, codes and 1688 are left alone.
    { id: 'fa.asciiFigure', level: 'warn', msg: 'ASCII digits in a Persian figure (format it with src/lib/format.ts: ۱۵ تا ۲۵ روز, از ۲۰۱۸)',
      re: new RegExp(`(?<![\\w.+/@#-])\\d+(?:[.,]\\d+)?(?:\\s?[–-]\\s?\\d+(?:[.,]\\d+)?)?[\\s\\p{Cf}]{0,2}(?:روز|ساعت|هفته|ماه|سال|کیلوگرم|کیلو|گرم|تن|مترمکعب|متر|کیلومتر|دلار|سوم|درصد|عدد|کامیون|مشتری)(?!${FA_LETTER})|(?<!${FA_LETTER})(?:از|تا)[\\s\\p{Cf}](?!1688(?!\\d))\\d+(?![\\w/])`, 'u'),
      bad: ['Rail 20–35 روز', 'از 2018', '۱۵ تا 25 روز', '110 دلار'], good: ['۲۰ تا ۳۵ روز', 'از ۲۰۱۸', 'سفارش از 1688', '+998 95 018 33 33', 'کانتینر 40HQ', 'کد HS 8471 برای پاور بانک'] },
    { id: 'fa.arabicIndicDigits', level: 'error', msg: 'Arabic-Indic digits ٠–٩ (write the Persian ۰–۹)',
      re: /[\u{0660}-\u{0669}]/u,
      bad: ['\u{0664}\u{0665}\u{0660}'], good: ['۴۵۰', '450'] },
    { id: 'fa.rightArrow', level: 'error', msg: '"→" next to Persian text — it does not mirror in RTL; write "←" (ییوو ← تاشکند)',
      re: new RegExp(`${FA_ANY}[\\s\\p{Cf}]{0,3}→|→[\\s\\p{Cf}]{0,3}${FA_ANY}`, 'u'),
      bad: ['ییوو → تاشکند', '→ تاشکند'], good: ['ییوو ← تاشکند', 'CN → KZ'] },
    { id: 'fa.middleDot', level: 'error', msg: '"·" next to Persian text — it reads as the Persian zero ۰; write " • "',
      re: new RegExp(`${FA_ANY}[\\s\\p{Cf}]{0,3}\\u{00B7}|\\u{00B7}[\\s\\p{Cf}]{0,3}${FA_ANY}`, 'u'),
      bad: ['هوایی · زمینی', '۱۵ · ۲۵'], good: ['هوایی • زمینی', 'BYD · Zeekr · Li Auto'] },
    { id: 'fa.presentationForms', level: 'error', msg: 'Arabic presentation forms (text pasted from a PDF: it breaks search and copy)',
      re: /[\u{FB50}-\u{FDFB}\u{FDFD}-\u{FDFF}\u{FE70}-\u{FEFC}]/u,
      bad: ['\u{FEDB}\u{FE8E}\u{FEAE}\u{FB94}\u{FEEE}'], good: ['کارگو'] },
    { id: 'fa.embedding', level: 'warn', msg: 'bidi embedding/override control (U+202A–U+202E): isolate with dir="ltr" or LRI…PDI instead',
      re: /[\u{202A}-\u{202E}]/u,
      bad: ['\u{202B}کارگو\u{202C}'], good: ['\u{2066}+998 95 018 33 33\u{2069}'] },
    { id: 'fa.latinPunct', level: 'warn', msg: 'Latin , ; ? between Persian words (write ، ؛ ؟)',
      re: new RegExp(`(?<=${FA_LETTER})\\s?[,;?](?=\\s?${FA_LETTER})`, 'u'),
      bad: ['کارگو, هوایی'], good: ['کارگو، هوایی', '۱۵, ۲۵'] },
    { id: 'fa.miSpace', level: 'warn', msg: 'می / نمی followed by a space instead of a ZWNJ (می‌شود)',
      re: new RegExp(`(?<!${FA_LETTER})ن?می (?=${FA_LETTER}{2,})`, 'u'),
      bad: ['می شود', 'نمی پذیریم'], good: ['می‌شود', 'نمی‌پذیریم'] },
  ],
};

/* ── Untranslated text on a zh or fa page ───────────────────────────────────────────────────── */

/**
 * Foreign terms a translation keeps on purpose (GLOSSARY.md §3): the Russian customs code name.
 * Anything else in Cyrillic, or with the Uzbek ʻ/ʼ letters, is allowed only where the English page
 * the translation was made from quotes it too ("in Russian сборный груз", "kitay kargo").
 */
export const QUOTED_TERMS = ['ТН ВЭД'];
/** English toponyms that carry an Uzbek-looking apostrophe and still have to be translated. */
const NEVER_QUOTED = /^Xi[ʼ'’]an$/;

const UNITS = new Set(['kg', 'km', 'cm', 'mm', 'm', 'ft', 'pcs', 'g', 't', 'cbm', 'x', 'h', 'min']);
const LATIN_WORD = "[A-Za-zʻʼ][A-Za-zʻʼ'’\\-]*";
const SEPARATOR = "[\\s\\d.,:;!?()\"“”'‘’«»/&+%$°×·•²³–—\\-]";
const LATIN_RUN = new RegExp(`${LATIN_WORD}(?:${SEPARATOR}+${LATIN_WORD})*`, 'gu');
const CYRILLIC_RUN = /[\u{0400}-\u{04FF}][\u{0400}-\u{04FF}\-]*(?:[\s,/]+[\u{0400}-\u{04FF}][\u{0400}-\u{04FF}\-]*)*/gu;
const UZBEK_WORD = /(?<![A-Za-zʻʼ])[A-Za-z]*[ʻʼ][A-Za-zʻʼ]*|(?<![A-Za-z])(?:uchun|bilan|yoki|boʻyicha|qilamiz|yetkazib|olib\skelish)(?![A-Za-z])/gu;
const NOT_PROSE = /https?:\/\/\S+|[\w.+-]+@[\w-]+(?:\.[\w-]+)+|@[A-Za-z0-9_]{3,}|\b[\w-]+\.(?:uz|com|ru|cn|org|net|io)\b(?:\/\S*)?/gu;

/** The Cyrillic runs and Uzbek-looking words of a text — what a translation may quote from its source. */
export function quotedForeign(text) {
  const s = text.replace(NOT_PROSE, ' ');
  return new Set([...(s.match(CYRILLIC_RUN) ?? []), ...(s.match(UZBEK_WORD) ?? [])].map((w) => w.trim()).filter((w) => !NEVER_QUOTED.test(w)));
}

const GLOSS_SKIPS = /^(?:a|an|and|by|for|in|of|on|per|than|the|to)$/i;
/**
 * The English words spell out an acronym that stands right beside them, in the run or within a few
 * characters of it — "起订量（MOQ，minimum order quantity）", "MOQ (minimum order quantity)". Such a
 * gloss is kept on purpose; English prose that merely happens to sit near an acronym is not one.
 */
function spellsOut(words, near) {
  const acronyms = new Set([...(near.match(/(?<![A-Za-z])[A-Z]{2,6}(?![A-Za-z])/g) ?? []), ...words.filter((w) => /^[A-Z]{2,6}$/.test(w))]);
  if (!acronyms.size) return false;
  const rest = words.filter((w) => !acronyms.has(w));
  const initials = (ws) => ws.map((w) => w[0]).join('').toUpperCase();
  return rest.length >= 2 && [initials(rest), initials(rest.filter((w) => !GLOSS_SKIPS.test(w)))].some((i) => acronyms.has(i));
}

/**
 * Runs of English, Uzbek or Russian prose in the text of a zh or fa page: a Latin run with three or
 * more lowercase words (brands, codes, units and proper names are capitalised or listed), any Uzbek
 * word, any Cyrillic run — minus what `allowed` (the English source page's own quotes) contains and
 * minus the English expansion of an acronym standing beside it (spellsOut).
 */
export function leakRuns(text, allowed = new Set()) {
  const s = text.replace(NOT_PROSE, ' ');
  const runs = [];
  for (const m of s.matchAll(LATIN_RUN)) {
    const run = m[0];
    const words = run.match(new RegExp(LATIN_WORD, 'gu')) ?? [];
    const prose = words.filter((w) => /^[a-zʻʼ]/u.test(w) && w.length >= 2 && !UNITS.has(w.toLowerCase()));
    const near = `${s.slice(Math.max(0, m.index - 12), m.index)} ${s.slice(m.index + run.length, m.index + run.length + 12)}`;
    if (prose.length >= 3 && !spellsOut(words, near)) runs.push(run.trim());
  }
  const quoted = (w) => allowed.has(w) || QUOTED_TERMS.includes(w);
  for (const w of s.match(UZBEK_WORD) ?? []) if (!quoted(w.trim()) || NEVER_QUOTED.test(w.trim())) runs.push(w.trim());
  for (const r of s.match(CYRILLIC_RUN) ?? []) if (!quoted(r.trim()) && ![...allowed].some((a) => a.includes(r.trim()))) runs.push(r.trim());
  return [...new Set(runs)];
}

const LEAK_FIXTURES = {
  bad: ['Cargo from China to Tashkent in 15–25 days', 'Xitoydan Toshkentga yuk tashish uchun', 'Сборный груз из Китая в Ташкент', '途经 Xiʼan 和兰州', '查看 the status of your cargo here', 'MOQ 是 the smallest quantity a factory accepts', 'MOQ (the smallest quantity a factory accepts)'],
  good: ['义乌（Yiwu）发往塔什干', 'GSR Logistics 的客户经理', 'Imex services LLC', '拼货（LCL）', 'حمل بار از چین به تاشکند با GSR Logistics', '每公斤 9 美元起，1 m³ 起', '海关编码（HS 编码，ТН ВЭД）', '写信给 @GSR_GROUP_AGENT_bot 或 b.e.kodirov@gmail.com', 'BYD · Zeekr · Li Auto', 'power bank', '起订量（MOQ，minimum order quantity）是工厂接受的最小数量', 'حداقل سفارش (MOQ, minimum order quantity)', '国际通用术语为 LCL（Less than Container Load，拼箱）'],
};

/* ── The self-test ──────────────────────────────────────────────────────────────────────────── */

/** Every rule against its own sentences. Returns the list of misfires (empty when all is well). */
export function selfTest() {
  const bad = [];
  for (const r of ZH_FA_FORBIDDEN) {
    for (const s of r.bad) if (!r.re.test(normalize(s))) bad.push(`${r.id} misses its bad sentence: ${s}`);
    for (const s of r.good) if (r.re.test(normalize(s))) bad.push(`${r.id} fires on its good sentence: ${s}`);
  }
  for (const rules of Object.values(PAGE_RULES)) {
    for (const r of rules) {
      for (const s of r.bad) if (!r.re.test(s)) bad.push(`${r.id} misses its bad sentence: ${s}`);
      for (const s of r.good) if (r.re.test(s)) bad.push(`${r.id} fires on its good sentence: ${s}`);
    }
  }
  for (const s of LEAK_FIXTURES.bad) if (!leakRuns(s).length) bad.push(`leakRuns misses: ${s}`);
  for (const s of LEAK_FIXTURES.good) if (leakRuns(s).length) bad.push(`leakRuns fires on: ${s} → ${leakRuns(s).join(' | ')}`);
  // The quotes of the English source page are allowed on its translation, and only those.
  if (leakRuns('拼货（俄语 сборный груз）', quotedForeign('in Russian сборный груз')).length) bad.push('leakRuns rejects a quote its English source carries');
  if (!leakRuns('拼货（俄语 сборный груз）', quotedForeign('consolidated cargo')).length) bad.push('leakRuns accepts a Cyrillic quote its English source does not carry');
  // The normaliser itself: Persian digits, bidi marks, Arabic letters and CJK gaps.
  const n = normalize('\u{200F}+۹۹۸ ٩٧ ۳۳۳ ۳۹ ۳۳ ۰٫۱ ۲٬۸۰۰ ۱۲٪ ي ك 我们的 义乌 仓库');
  if (n !== '+998 97 333 39 33 0,1 2800 12% ی ک 我们的义乌仓库') bad.push(`normalize() gives "${n}"`);
  return bad;
}
