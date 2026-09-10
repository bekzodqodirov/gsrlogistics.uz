import type { Lang } from './config';

/**
 * Strings for the home "how we track" section (src/components/sections/HowWeTrack.astro).
 *
 * Owner-confirmed 2026-09-10 (scratchpad facts2/TRACKING-SYSTEM.md). The wording rules are
 * binding, not stylistic — a customer tests every one of these on their first shipment:
 *
 *   SAY      a QR is stuck on EVERY carton at the China receiving point;
 *            staff scan it at every stage;
 *            you see where each of your cartons is, in the bot, 24/7.
 *   NEVER    "scan the QR yourself" — the client never scans anything, staff do;
 *            "real-time" or "GPS" — this is stage-by-stage scanning, not a live position.
 *
 * scripts/check-content.mjs fails the build on both of those.
 */
export interface TrackSystemStrings {
  eyebrow: string;
  h2: string;
  /** One paragraph that has to land the whole story in five seconds. */
  intro: string;
  shot: {
    /** Caption printed under the slot — true of the drawing and of the photograph alike. */
    caption: string;
    /** alt text for the QR-on-carton photograph once it replaces the drawing. */
    alt: string;
  };
  beats: Array<{ title: string; text: string }>;
  bot: {
    label: string;
    open: string;
    how: string;
    /** Legend beside the 24-hour dial. `managerLabel` is printed with site.hours[lang]. */
    botHours: string;
    managerLabel: string;
    link: string;
  };
}

const uz: TrackSystemStrings = {
  eyebrow: 'Shaffoflik',
  h2: 'Har bir qutingizda oʻz QR kodi bor',
  intro:
    'Xitoydagi qabul punktida yukingizni suratga olamiz, sanaymiz, oʻlchaymiz va har bir qutiga QR kod yopishtiramiz. Undan keyingi har bir bosqichda ombor xodimlari shu kodni skanerlaydi — siz esa botda har bir qutingiz qayerdaligini koʻrasiz. Kechasi soat uchda ham.',
  shot: {
    caption: 'QR quti ustida qoladi: yoʻldagi har bir yuklash va tushirishda aynan shu kod skanerlanadi.',
    alt: 'Xitoydagi qabul punktida qutiga yopishtirilgan QR kod.',
  },
  beats: [
    {
      title: 'Qabulda — har bir qutiga QR',
      text: 'Yuk Xitoydagi qabul punktiga kelganda uni suratga olamiz, sanaymiz va oʻlchaymiz, tizimga kiritamiz — soʻng har bir qutiga QR kod yopishtiramiz.',
    },
    {
      title: 'Har bir bosqichda — skanerlanadi',
      text: 'Ombor xodimlari yukni tushirganda va yuklaganda QR kodni skanerlaydi. Skanerlash — bizning ishimiz, sizdan hech narsa talab qilinmaydi.',
    },
    {
      title: 'Botda — har bir qutingiz alohida',
      text: 'Telegram botda oʻz kabinetingiz bor: har bir qutingiz qaysi bosqichda ekanini alohida koʻrasiz. Sutkaning istalgan vaqtida, hech kimdan soʻramasdan.',
    },
  ],
  bot: {
    label: 'Telegram bot',
    open: 'Botni ochish',
    how: 'Telefon raqamingiz bilan ulanasiz — raqam tizimda boʻlsa, bot sizni taniydi. Yoki menejer ulanish havolasini yuboradi.',
    botHours: 'Bot — 24/7',
    managerLabel: 'Menejer',
    link: 'Kuzatuv qanday ishlaydi',
  },
};

const ru: TrackSystemStrings = {
  eyebrow: 'Прозрачность',
  h2: 'На каждой вашей коробке — свой QR-код',
  intro:
    'В пункте приёма в Китае мы фотографируем, пересчитываем и обмеряем груз и наклеиваем QR-код на каждую коробку. Дальше на каждом этапе сотрудники склада сканируют этот код — а вы видите в боте, где сейчас каждая ваша коробка. Даже в три часа ночи.',
  shot: {
    caption: 'QR остаётся на коробке: именно этот код сканируют при каждой погрузке и разгрузке в пути.',
    alt: 'QR-код, наклеенный на коробку в пункте приёма в Китае.',
  },
  beats: [
    {
      title: 'На приёмке — QR на каждую коробку',
      text: 'Груз приходит в пункт приёма в Китае: фотографируем, пересчитываем, обмеряем, заносим в систему — и наклеиваем QR-код на каждую коробку.',
    },
    {
      title: 'На каждом этапе — сканирование',
      text: 'Сотрудники склада сканируют QR при разгрузке и погрузке. Сканируем мы — от вас не требуется ничего.',
    },
    {
      title: 'В боте — каждая коробка отдельно',
      text: 'В Telegram-боте у вас свой кабинет: видно, на каком этапе находится каждая ваша коробка. В любое время суток и ни у кого не спрашивая.',
    },
  ],
  bot: {
    label: 'Telegram-бот',
    open: 'Открыть бота',
    how: 'Подключаетесь своим номером телефона — если номер есть в системе, бот вас узнаёт. Или менеджер пришлёт ссылку для подключения.',
    botHours: 'Бот — 24/7',
    managerLabel: 'Менеджер',
    link: 'Как работает отслеживание',
  },
};

const en: TrackSystemStrings = {
  eyebrow: 'Transparency',
  h2: 'Every one of your cartons carries its own QR code',
  intro:
    'At the receiving point in China we photograph, count and measure your goods and stick a QR code on every carton. At each stage after that our warehouse staff scan that code — and you see where each of your cartons is, in the bot. Even at three in the morning.',
  shot: {
    caption: 'The QR stays on the carton: this is the code that gets scanned at every loading and unloading on the way.',
    alt: 'A QR code stuck on a carton at the receiving point in China.',
  },
  beats: [
    {
      title: 'At receiving — a QR on every carton',
      text: 'Your goods reach the receiving point in China: we photograph, count and measure them, enter them into the system — then stick a QR code on every carton.',
    },
    {
      title: 'At each stage — a scan',
      text: 'Warehouse staff scan the QR when they unload and load. The scanning is our job — nothing is ever asked of you.',
    },
    {
      title: 'In the bot — every carton on its own line',
      text: 'The Telegram bot gives you your own account: you see which stage each of your cartons is at. At any hour of the day or night, without asking anyone.',
    },
  ],
  bot: {
    label: 'Telegram bot',
    open: 'Open the bot',
    how: 'You connect with your own phone number — if it is in the system, the bot recognises you. Or your manager sends you a link.',
    botHours: 'The bot — 24/7',
    managerLabel: 'A manager',
    link: 'How tracking works',
  },
};

export const trackSystem: Record<Lang, TrackSystemStrings> = { uz, ru, en };
