import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const phoneDisplay = "+7 (952) 330-74-96";
const phoneTel = "+79523307496";

const services = [
  {
    title: "Поиск себя и своего пути",
    description:
      "Когда сложно понять, чего вы хотите, и куда двигаться дальше.",
    num: "01",
  },
  {
    title: "Самооценка и принятие себя",
    description:
      "Опора во внутреннем диалоге: меньше самокритики, больше поддержки к себе.",
    num: "02",
  },
  {
    title: "Тревога и стресс",
    description:
      "Разбираем перегрузку, тревожные сценарии и то, что мешает жить спокойнее.",
    num: "03",
  },
  {
    title: "Конфликты и отношения",
    description:
      "Понятнее про границы, ожидания и то, как говорить и слышать друг друга.",
    num: "04",
  },
];

const steps = [
  {
    title: "Платформа",
    body: "Онлайн на Яндекс Телемост — подключиться просто, конфиденциально, без установки приложения.",
  },
  {
    title: "Первый контакт",
    body: "Напишите примерный запрос — обсудим, смогу ли я помочь и подходит ли вам такой формат.",
  },
  {
    title: "Темп — ваш",
    body: "Разовая консультация или продолжительная терапия — глубину и ритм выбираем вместе.",
  },
];

const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
const telegramUsername = String(import.meta.env.VITE_TELEGRAM_USERNAME || "")
  .trim()
  .replace(/^@+/, "");

/** Цена и текст: 1) Gist (см. public/gist-config.json) 2) public/site-content.json 3) запас ниже */
const DEFAULT_SITE_CONTENT = {
  minimumSessionPriceRub: 1200,
  pricingNote:
    "Фиксированной стоимости нет — сколько желаете и можете. Оплата до начала сессии на карту по номеру телефона или номеру карты.",
};

function formatRub(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n) || n <= 0) return null;
  return `${new Intl.NumberFormat("ru-RU").format(Math.round(n))}\u00a0₽`;
}

function mergeSiteContent(raw) {
  const out = { ...DEFAULT_SITE_CONTENT };
  if (!raw || typeof raw !== "object") return out;
  const price = raw.minimumSessionPriceRub;
  if (typeof price === "number" && Number.isFinite(price) && price > 0) {
    out.minimumSessionPriceRub = Math.round(price);
  }
  if (typeof raw.pricingNote === "string" && raw.pricingNote.trim()) {
    out.pricingNote = raw.pricingNote.trim();
  }
  return out;
}

/** Собрать raw URL Gist (owner + 32-символьный id из адреса gist) */
function gistRawUrlFromConfig(cfg) {
  if (!cfg || cfg.enabled !== true) return null;
  const owner = String(cfg.owner || "").trim();
  const gistId = String(cfg.gistId || "").trim();
  const filename =
    String(cfg.filename || "site-content.json").trim() || "site-content.json";
  if (!owner || !gistId) return null;
  if (!/^[a-f0-9]{32}$/i.test(gistId)) return null;
  const file = encodeURIComponent(filename);
  return `https://gist.githubusercontent.com/${owner}/${gistId}/raw/${file}`;
}

/* ─── tiny hook: fade-in on scroll ─── */
function useFadeIn() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-fade]");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [siteContent, setSiteContent] = useState(() => ({
    ...DEFAULT_SITE_CONTENT,
  }));

  const nameInputRef = useRef(null);
  const closeTimerRef = useRef(null);
  const headerRef = useRef(null);

  useFadeIn();

  useEffect(() => {
    let cancelled = false;
    const remoteEnv = String(
      import.meta.env.VITE_SITE_CONTENT_URL || "",
    ).trim();
    const localUrl = asset("site-content.json");

    const loadJson = (url, bust) => {
      const u = bust
        ? `${url}${url.includes("?") ? "&" : "?"}_=${Date.now()}`
        : url;
      return fetch(u, { cache: "no-store", mode: "cors" }).then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      });
    };

    const apply = (raw) => {
      if (!cancelled) setSiteContent(mergeSiteContent(raw));
    };
    const useDefaults = () => {
      if (!cancelled) setSiteContent({ ...DEFAULT_SITE_CONTENT });
    };

    (async () => {
      try {
        if (remoteEnv) {
          apply(await loadJson(remoteEnv, true));
          return;
        }
        let gistUrl = null;
        try {
          const cfg = await loadJson(asset("gist-config.json"), false);
          gistUrl = gistRawUrlFromConfig(cfg);
        } catch {
          /* нет gist-config — ок */
        }
        if (gistUrl) {
          try {
            apply(await loadJson(gistUrl, true));
            return;
          } catch {
            /* Gist недоступен — пробуем локальный файл */
          }
        }
        apply(await loadJson(localUrl, false));
      } catch {
        useDefaults();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const closeModal = useCallback(() => setIsModalOpen(false), []);
  const openModal = () => setIsModalOpen(true);

  /* lock scroll when modal open */
  useEffect(() => {
    if (isModalOpen) {
      const scrollY = window.scrollY;
      document.body.style.cssText = `overflow:hidden;position:fixed;top:-${scrollY}px;width:100%`;
      nameInputRef.current?.focus();
    } else {
      const scrollY = document.body.style.top;
      document.body.style.cssText = "";
      if (scrollY) window.scrollTo(0, parseInt(scrollY) * -1);
    }
    return () => (document.body.style.cssText = "");
  }, [isModalOpen]);

  /* keyboard + smooth anchors */
  useEffect(() => {
    document.documentElement.classList.add("scroll-smooth");
    const onKey = (e) => {
      if (e.key === "Escape") {
        closeModal();
        setIsMenuOpen(false);
      }
    };
    const onAnchor = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = headerRef.current?.offsetHeight ?? 120;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: "smooth",
      });
      setIsMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onAnchor);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onAnchor);
    };
  }, [closeModal]);

  useEffect(() => () => clearTimeout(closeTimerRef.current), []);

  const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const contact = String(fd.get("contact") || "").trim();
    const message = String(fd.get("message") || "").trim();

    if (!name || !contact || !message) {
      toast.error("Заполните все поля.");
      return;
    }
    if (!botToken || !chatId) {
      toast.error("Telegram bot не настроен.");
      return;
    }

    setIsSubmitting(true);
    const text = `Новая заявка\n\nИмя: ${name}\nКонтакт: ${contact}\nСообщение: ${message}`;
    try {
      const res = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ chat_id: chatId, text }),
        },
      );
      if (!res.ok) throw new Error();
      toast.success("Заявка отправлена");
      e.target.reset();
      closeTimerRef.current = setTimeout(closeModal, 600);
    } catch {
      toast.error("Ошибка отправки");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* ── global styles injected ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --cream:   #faf6f0;
          --sand:    #ede5d8;
          --warm:    #c9b49a;
          --copper:  #b5622e;
          --copper2: #9b4f22;
          --bark:    #3a2316;
          --mist:    #5f7464;
          --mist2:   #3d5242;
          --text:    #2a1f14;
          --sub:     #6b5d50;
        }

        html { scroll-behavior: smooth; }

        body {
          background: var(--cream);
          font-family: 'DM Sans', sans-serif;
          color: var(--text);
          -webkit-font-smoothing: antialiased;
        }

        /* fade-in utility */
        [data-fade] { opacity: 0; transform: translateY(28px); transition: opacity .72s cubic-bezier(.25,.8,.25,1), transform .72s cubic-bezier(.25,.8,.25,1); }
        [data-fade].is-visible { opacity: 1; transform: none; }
        [data-fade][data-delay="1"] { transition-delay: .08s; }
        [data-fade][data-delay="2"] { transition-delay: .18s; }
        [data-fade][data-delay="3"] { transition-delay: .28s; }
        [data-fade][data-delay="4"] { transition-delay: .38s; }

        /* ── HEADER ── */
        .site-header {
          position: sticky; top: 0; z-index: 50;
          background: rgba(250,246,240,.88);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(180,156,130,.28);
          padding: 0 40px;
          display: flex; align-items: center; justify-content: space-between;
          height: 118px;
        }
        @media(max-width:767px){.site-header{padding:0 18px;height:98px;}}

        .logo-link {
          display: flex;
          align-items: center;
          min-width: 0;
          margin-right: 8px;
          line-height: 0;
          text-decoration: none;
        }
        .header-logo {
          height: 90px;
          width: auto;
          max-width: min(100%, 720px);
          display: block;
        }
        @media (max-width: 767px) {
          .header-logo {
            height: 64px;
            max-width: calc(100vw - 92px);
          }
        }

        .header-nav { display: flex; gap: 36px; }
        .header-nav a {
          font-size: 13px; font-weight: 400; letter-spacing: .04em;
          color: var(--sub); text-decoration: none;
          transition: color .2s;
        }
        .header-nav a:hover { color: var(--text); }
        @media(max-width:900px){.header-nav{display:none;}}

        .btn-primary {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--copper);
          color: #fff;
          border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500; letter-spacing: .06em;
          padding: 10px 24px;
          border-radius: 100px;
          text-decoration: none;
          transition: background .22s, transform .18s, box-shadow .22s;
          box-shadow: 0 6px 22px rgba(181,98,46,.28);
        }
        .btn-primary:hover { background: var(--copper2); transform: translateY(-2px); box-shadow: 0 10px 28px rgba(181,98,46,.38); }
        .btn-primary:active { transform: translateY(0); }

        .btn-ghost {
          display: inline-flex; align-items: center;
          background: transparent;
          color: var(--copper);
          border: 1.5px solid var(--copper);
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500; letter-spacing: .06em;
          padding: 9px 22px;
          border-radius: 100px;
          text-decoration: none;
          transition: background .2s, color .2s;
        }
        .btn-ghost:hover { background: rgba(181,98,46,.07); }

        .hamburger {
          display: none; background: none; border: 1.5px solid var(--warm);
          border-radius: 8px; width: 42px; height: 42px;
          cursor: pointer; align-items: center; justify-content: center;
          color: var(--text); font-size: 20px; line-height: 1;
        }
        @media(max-width:900px){.hamburger{display:flex;}}
        @media(min-width:901px){.header-cta{display:inline-flex;}}

        /* mobile menu */
        .mobile-menu {
          display: none; flex-direction: column; gap: 16px;
          padding: 20px 18px 18px;
          background: var(--cream);
          border-bottom: 1px solid rgba(180,156,130,.28);
        }
        .mobile-menu.open { display: flex; }
        .mobile-menu a { font-size: 15px; color: var(--sub); text-decoration: none; }

        /* ── LAYOUT ── */
        .site-wrap { max-width: 1180px; margin: 0 auto; padding: 0 40px; }
        @media(max-width:767px){.site-wrap{padding:0 18px;}}

        /* ── HERO ── */
        .hero {
          padding: 80px 0 70px;
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 56px;
          align-items: center;
        }
        @media(max-width:960px){.hero{grid-template-columns:1fr;gap:40px;padding:52px 0 44px;}}

        .hero-tag {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 500; letter-spacing: .16em;
          text-transform: uppercase; color: var(--mist);
          background: rgba(95,116,100,.1);
          padding: 5px 14px; border-radius: 100px;
          margin-bottom: 24px;
        }
        .hero-tag::before {
          content: ''; width: 6px; height: 6px; border-radius: 50%;
          background: var(--mist); flex-shrink: 0;
        }

        .hero-h1 {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 400;
          font-size: clamp(52px, 7vw, 88px);
          line-height: 1.0;
          letter-spacing: -.01em;
          color: var(--bark);
        }
        .hero-h1 em { font-style: italic; color: var(--copper); }

        .hero-desc {
          margin-top: 24px;
          font-size: 16px; line-height: 1.8;
          color: var(--sub); max-width: 44ch;
        }

        .hero-actions { margin-top: 36px; display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }

        .hero-link {
          font-size: 13px; font-weight: 500; letter-spacing: .04em;
          color: var(--mist); text-decoration: none;
          border-bottom: 1px solid currentColor; padding-bottom: 1px;
          transition: color .2s;
        }
        .hero-link:hover { color: var(--mist2); }

        .hero-pills { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 28px; }
        .hero-pill {
          font-size: 12px; color: var(--sub);
          border: 1px solid var(--warm);
          border-radius: 100px; padding: 5px 14px;
          background: rgba(255,255,255,.55);
        }

        /* ── HERO CARD ── */
        .hero-card {
          background: linear-gradient(155deg, #fff8f0 0%, #f4ede1 100%);
          border: 1px solid rgba(180,156,130,.45);
          border-radius: 28px;
          overflow: hidden;
          position: relative;
        }
        .hero-card-img { width: 100%; height: 260px; object-fit: cover; display: block; }
        .hero-card-body { padding: 24px 28px 28px; }
        .hero-card-quote {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px; font-weight: 400; font-style: italic;
          color: var(--copper); line-height: 1.35; margin-top: 10px;
        }

        /* ── SECTION HEADER ── */
        .section-label {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 10px; font-weight: 500; letter-spacing: .2em;
          text-transform: uppercase; color: var(--mist);
          margin-bottom: 14px;
        }
        .section-label::before { content: ''; display: block; width: 20px; height: 1px; background: var(--mist); }

        .section-h2 {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 400;
          font-size: clamp(36px, 5vw, 58px);
          line-height: 1.06;
          color: var(--bark);
        }
        .section-h2 em { font-style: italic; color: var(--copper); }

        /* ── MOOD STRIP ── */
        .mood-strip {
          padding: 64px 0;
          border-top: 1px solid rgba(180,156,130,.22);
        }
        .mood-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          margin-top: 36px;
        }
        @media(max-width:680px){.mood-grid{grid-template-columns:1fr; gap:14px;}}
        .mood-img { width: 100%; height: 220px; object-fit: cover; border-radius: 20px; display: block; }

        /* ── SERVICES ── */
        .services-section { padding: 64px 0; border-top: 1px solid rgba(180,156,130,.22); }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2px;
          margin-top: 44px;
          border: 1.5px solid rgba(180,156,130,.35);
          border-radius: 24px;
          overflow: hidden;
        }
        @media(max-width:680px){.services-grid{grid-template-columns:1fr;}}

        .service-card {
          padding: 32px 32px 36px;
          background: #fdfaf6;
          transition: background .22s;
          position: relative;
        }
        .service-card:hover { background: #fff; }
        .service-card:nth-child(1) { border-right: 1.5px solid rgba(180,156,130,.35); border-bottom: 1.5px solid rgba(180,156,130,.35); }
        .service-card:nth-child(2) { border-bottom: 1.5px solid rgba(180,156,130,.35); }
        .service-card:nth-child(3) { border-right: 1.5px solid rgba(180,156,130,.35); }

        .service-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 13px; font-weight: 400; letter-spacing: .18em;
          color: var(--warm);
        }
        .service-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px; font-weight: 500;
          color: var(--bark);
          margin-top: 8px; line-height: 1.25;
        }
        .service-desc {
          font-size: 14px; line-height: 1.75;
          color: var(--sub); margin-top: 12px;
        }

        /* ── PROCESS ── */
        .process-section { padding: 64px 0; border-top: 1px solid rgba(180,156,130,.22); }

        .process-list { display: flex; flex-direction: column; gap: 0; margin-top: 44px; }
        .process-item {
          display: grid;
          grid-template-columns: 48px 1fr;
          gap: 24px;
          padding: 28px 0;
          border-bottom: 1px solid rgba(180,156,130,.22);
          align-items: start;
        }
        .process-item:first-child { border-top: 1px solid rgba(180,156,130,.22); }

        .process-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 40px; font-weight: 300; color: rgba(181,98,46,.2);
          line-height: 1;
        }
        .process-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px; font-weight: 500; color: var(--bark);
          margin-bottom: 8px;
        }
        .process-body { font-size: 15px; line-height: 1.75; color: var(--sub); }

        /* ── TRUST BLOCK ── */
        .trust-section { padding: 64px 0; border-top: 1px solid rgba(180,156,130,.22); }
        .trust-inner {
          background: linear-gradient(130deg, #f8efe2 0%, #ede6d9 100%);
          border: 1px solid rgba(180,156,130,.38);
          border-radius: 24px;
          padding: 52px 56px;
          display: flex; align-items: flex-start; gap: 40px;
        }
        @media(max-width:680px){.trust-inner{flex-direction:column;padding:36px 28px;gap:20px;}}
        .trust-icon {
          flex-shrink: 0; width: 48px; height: 48px;
          background: var(--copper); border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
        }
        .trust-text { font-size: 16px; line-height: 1.8; color: var(--sub); }
        .trust-text strong { color: var(--bark); font-weight: 500; }

        /* ── PRICING ── */
        .pricing-section { padding: 64px 0; border-top: 1px solid rgba(180,156,130,.22); }
        .pricing-inner {
          display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
          margin-top: 44px;
        }
        @media(max-width:680px){.pricing-inner{grid-template-columns:1fr;}}

        .pricing-card {
          background: #fdfaf6;
          border: 1.5px solid rgba(180,156,130,.35);
          border-radius: 20px; padding: 32px 32px 36px;
        }
        .pricing-amount {
          font-family: 'Cormorant Garamond', serif;
          font-size: 52px; font-weight: 400; color: var(--bark);
          line-height: 1; margin: 12px 0 4px;
        }
        .pricing-label { font-size: 12px; letter-spacing: .12em; text-transform: uppercase; color: var(--mist); }
        .pricing-note { font-size: 14px; line-height: 1.7; color: var(--sub); margin-top: 14px; }

        /* ── CONTACTS ── */
        .contacts-section { padding: 64px 0 80px; border-top: 1px solid rgba(180,156,130,.22); }
        .contacts-inner {
          background: var(--bark);
          border-radius: 28px; padding: 56px 60px;
          display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start;
        }
        @media(max-width:760px){.contacts-inner{grid-template-columns:1fr;padding:38px 28px;gap:36px;}}

        .contacts-h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 4.5vw, 52px); font-weight: 400;
          color: var(--cream); line-height: 1.08;
        }
        .contacts-h2 em { font-style: italic; color: #e4a97a; }
        .contacts-sub { font-size: 15px; line-height: 1.8; color: rgba(250,246,240,.6); margin-top: 16px; }

        .contacts-actions { display: flex; flex-direction: column; gap: 14px; margin-top: 36px; }
        .contact-link-btn {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: 14px; font-weight: 500;
          color: var(--cream); text-decoration: none;
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.14);
          border-radius: 100px; padding: 12px 22px;
          transition: background .2s;
          cursor: pointer; font-family: inherit;
        }
        .contact-link-btn:hover { background: rgba(255,255,255,.14); }

        .contacts-tg { font-size: 13px; color: rgba(250,246,240,.5); margin-top: 8px; }
        .contacts-tg a { color: #e4a97a; text-decoration: none; }

        /* ── FOOTER ── */
        .site-footer {
          border-top: 1px solid rgba(180,156,130,.22);
          padding: 28px 40px;
          display: flex; justify-content: space-between; align-items: center;
          font-size: 12px; color: var(--warm); letter-spacing: .06em;
        }
        @media(max-width:767px){.site-footer{padding:22px 18px;flex-direction:column;gap:6px;text-align:center;}}

        /* ── MODAL ── */
        .modal-overlay {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(18,12,6,.62); backdrop-filter: blur(4px);
          display: grid; place-items: center;
          opacity: 0; visibility: hidden;
          transition: opacity .28s, visibility .28s;
        }
        .modal-overlay.open { opacity: 1; visibility: visible; }

        .modal-box {
          position: relative; z-index: 1;
          background: #fdfaf6;
          border: 1px solid rgba(180,156,130,.45);
          border-radius: 24px; padding: 40px 40px 44px;
          width: min(540px, calc(100vw - 36px));
          box-shadow: 0 32px 64px rgba(30,18,8,.22);
          transform: translateY(18px);
          transition: transform .32s cubic-bezier(.25,.8,.25,1);
        }
        .modal-overlay.open .modal-box { transform: none; }

        .modal-close {
          position: absolute; top: 14px; right: 14px;
          width: 32px; height: 32px; border-radius: 50%;
          border: 1px solid var(--sand); background: #fff;
          cursor: pointer; font-size: 18px; line-height: 1;
          color: var(--sub); display: flex; align-items: center; justify-content: center;
          transition: background .18s;
        }
        .modal-close:hover { background: var(--sand); }

        .modal-h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px; font-weight: 400; color: var(--bark);
          margin-top: 10px;
        }
        .modal-sub { font-size: 13px; line-height: 1.7; color: var(--sub); margin-top: 6px; }

        .form-group { display: flex; flex-direction: column; gap: 5px; margin-top: 18px; }
        .form-label { font-size: 12px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase; color: var(--sub); }
        .form-input {
          width: 100%; padding: 11px 16px;
          border: 1.5px solid var(--sand);
          border-radius: 12px; background: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: var(--text);
          outline: none; transition: border-color .2s, box-shadow .2s;
        }
        .form-input:focus { border-color: var(--mist); box-shadow: 0 0 0 3px rgba(95,116,100,.14); }
        textarea.form-input { resize: vertical; min-height: 100px; }

        .scroll-indicator {
          display: flex; align-items: center; gap: 8px;
          font-size: 11px; letter-spacing: .12em; text-transform: uppercase;
          color: var(--warm);
        }
        .scroll-line { width: 32px; height: 1px; background: var(--warm); }
      `}</style>

      {/* ── HEADER ── */}
      <header className='site-header' ref={headerRef}>
        <a href='#' className='logo-link' aria-label='Карина Якимова — главная'>
          <img
            className='header-logo'
            src={asset("logo.svg")}
            width='682'
            height='182'
            alt=''
            decoding='async'
          />
        </a>

        <nav className='header-nav' aria-label='Основная навигация'>
          <a href='#about'>Обо мне</a>
          <a href='#services'>Услуги</a>
          <a href='#process'>Формат</a>
          <a href='#pricing'>Стоимость</a>
          <a href='#contacts'>Контакты</a>
        </nav>

        <button
          className='btn-primary header-cta'
          style={{ display: "none" }}
          onClick={openModal}
          type='button'
        >
          Записаться
        </button>
        <style>{`@media(min-width:901px){.header-cta{display:inline-flex!important;}}`}</style>

        <button
          className='hamburger'
          type='button'
          aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setIsMenuOpen((v) => !v)}
        >
          {isMenuOpen ? "×" : "≡"}
        </button>
      </header>

      {/* mobile nav */}
      <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <a href='#about'>Обо мне</a>
        <a href='#services'>Услуги</a>
        <a href='#process'>Формат работы</a>
        <a href='#pricing'>Стоимость</a>
        <a href='#contacts'>Контакты</a>
        <button
          className='btn-primary'
          style={{ width: "fit-content", marginTop: 4 }}
          type='button'
          onClick={openModal}
        >
          Записаться
        </button>
      </div>

      {/* ── HERO ── */}
      <main>
        <div className='site-wrap'>
          <section id='about' className='hero' style={{ scrollMarginTop: 124 }}>
            <div data-fade>
              <p className='hero-tag'>Практикующий психолог</p>
              <h1 className='hero-h1'>
                Опора и ясность —<br />
                <em>шаг за шагом</em>
              </h1>
              <p className='hero-desc'>
                Помогаю справляться с повседневными трудностями, находить опору
                и понимать себя. Студентка 4 курса по направлению «Кризисная
                психология и медиация в образовании».
              </p>
              <div className='hero-actions'>
                <button
                  className='btn-primary'
                  type='button'
                  onClick={openModal}
                >
                  Записаться
                </button>
                <a className='hero-link' href='#services'>
                  Смотреть услуги
                </a>
              </div>
              <ul className='hero-pills' style={{ listStyle: "none" }}>
                <li className='hero-pill'>Яндекс Телемост</li>
                <li className='hero-pill'>Индивидуально</li>
                <li className='hero-pill'>Разово или длительно</li>
              </ul>
            </div>

            <div data-fade data-delay='2'>
              <div className='hero-card'>
                <img
                  src={asset("photos/yoga-sunrise.png")}
                  alt=''
                  className='hero-card-img'
                />
                <div className='hero-card-body'>
                  <p className='section-label'>Бережное сопровождение</p>
                  <p className='hero-card-quote'>
                    Рядом в том темпе,
                    <br />
                    который вам доступен
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ── MOOD ── */}
        <div className='site-wrap'>
          <section className='mood-strip'>
            <div data-fade>
              <p className='section-label'>Настроение</p>
              <h2 className='section-h2'>
                Пространство <em>для себя</em>
              </h2>
            </div>
            <div className='mood-grid'>
              {[
                "photos/meadow.png",
                "photos/lake-quote.png",
                "photos/yoga-sunrise.png",
              ].map((src, i) => (
                <div key={src} data-fade data-delay={String(i + 1)}>
                  <img src={asset(src)} alt='' className='mood-img' />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── SERVICES ── */}
        <div className='site-wrap'>
          <section
            id='services'
            className='services-section'
            style={{ scrollMarginTop: 124 }}
          >
            <div data-fade>
              <p className='section-label'>Услуги</p>
              <h2 className='section-h2'>
                С чем <em>я работаю</em>
              </h2>
            </div>
            <div className='services-grid' data-fade data-delay='1'>
              {services.map((item) => (
                <article className='service-card' key={item.title}>
                  <p className='service-num'>{item.num}</p>
                  <h3 className='service-title'>{item.title}</h3>
                  <p className='service-desc'>{item.description}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* ── PROCESS ── */}
        <div className='site-wrap'>
          <section
            id='process'
            className='process-section'
            style={{ scrollMarginTop: 124 }}
          >
            <div data-fade>
              <p className='section-label'>Процесс</p>
              <h2 className='section-h2'>
                Как мы будем <em>работать</em>
              </h2>
            </div>
            <ol className='process-list' style={{ listStyle: "none" }}>
              {steps.map((step, i) => (
                <li
                  className='process-item'
                  key={step.title}
                  data-fade
                  data-delay={String(i + 1)}
                >
                  <span className='process-num'>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className='process-title'>{step.title}</p>
                    <p className='process-body'>{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* ── TRUST ── */}
        <div className='site-wrap'>
          <section className='trust-section'>
            <div data-fade>
              <p className='section-label'>Доверие</p>
              <h2 className='section-h2' style={{ marginBottom: 28 }}>
                Важно <em>знать</em>
              </h2>
              <div className='trust-inner'>
                <div className='trust-icon'>🌿</div>
                <p className='trust-text'>
                  Я сама регулярно прохожу <strong>личную терапию</strong> и
                  работаю с<strong> супервизором</strong> — это моя
                  профессиональная этика и залог качества вашей поддержки.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* ── PRICING ── */}
        <div className='site-wrap'>
          <section
            id='pricing'
            className='pricing-section'
            style={{ scrollMarginTop: 124 }}
          >
            <div data-fade>
              <p className='section-label'>Оплата</p>

              <h2 className='section-h2'>
                Запись и <em>оплата</em>
              </h2>
            </div>

            <div className='pricing-inner'>
              <div className='pricing-card' data-fade data-delay='1'>
                <p className='pricing-label'>Информация</p>

                <p className='pricing-amount'>Оплата</p>

                <p className='pricing-note'>
                  Фиксированной стоимости нет — сколько желаете и можете. Оплата производится до начала сессии посредством
                  банковского перевода по номеру телефона или номеру карты.
                  Подробная информация о минимальной стоимости сеанса
                  представлена на странице записи по ссылке.
                </p>
              </div>

              <a
                href='https://vk.cc/cXJ3c3'
                target='_blank'
                rel='noopener noreferrer'
                className='pricing-card'
                data-fade
                data-delay='2'
                style={{
                  background: "linear-gradient(150deg,#f3ebe0,#ede4d5)",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <p className='pricing-label'>Онлайн-запись</p>

                <p
                  className='pricing-amount'
                  style={{
                    fontSize: 36,
                    marginTop: 14,
                  }}
                >
                  Перейти →
                </p>

                <p className='pricing-note'>
                  Нажмите, чтобы перейти к записи и оплате.
                </p>
              </a>
            </div>
          </section>
        </div>
        {/* ── CONTACTS ── */}
        <div className='site-wrap'>
          <section
            id='contacts'
            className='contacts-section'
            style={{ scrollMarginTop: 124 }}
          >
            <div className='contacts-inner' data-fade>
              <div>
                <p
                  className='section-label'
                  style={{ color: "rgba(250,246,240,.4)" }}
                >
                  Контакты
                </p>
                <h2 className='contacts-h2'>
                  Записаться
                  <br />
                  или <em>задать вопрос</em>
                </h2>
                <p className='contacts-sub'>
                  Напишите примерный запрос — обсудим формат и сможем ли
                  поработать вместе.
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: 12,
                    letterSpacing: ".14em",
                    textTransform: "uppercase",
                    color: "rgba(250,246,240,.38)",
                    marginBottom: 14,
                  }}
                >
                  Связаться
                </p>
                <div className='contacts-actions'>
                  <a className='contact-link-btn' href={`tel:${phoneTel}`}>
                    <span>📞</span> {phoneDisplay}
                  </a>
                  {telegramUsername ? (
                    <a
                      className='contact-link-btn'
                      href={`https://t.me/${telegramUsername}`}
                      target='_blank'
                      rel='noreferrer'
                    >
                      <span>✈️</span> @{telegramUsername}
                    </a>
                  ) : (
                    <span
                      style={{ fontSize: 13, color: "rgba(250,246,240,.45)" }}
                    >
                      Telegram — по этому же номеру.
                    </span>
                  )}
                  <button
                    className='contact-link-btn'
                    type='button'
                    onClick={openModal}
                    style={{
                      border: "1.5px solid rgba(228,169,122,.5)",
                      color: "#e4a97a",
                    }}
                  >
                    ✉️ Оставить заявку
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className='site-footer'>
        <p>Карина Якимова · Практикующий психолог · Онлайн</p>
        <p style={{ fontSize: 11 }}>© {new Date().getFullYear()}</p>
      </footer>

      {/* ── MODAL ── */}
      <div
        className={`modal-overlay ${isModalOpen ? "open" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}
        aria-hidden={!isModalOpen}
      >
        <div
          className='modal-box'
          role='dialog'
          aria-modal='true'
          aria-labelledby='modal-title'
        >
          <button
            className='modal-close'
            type='button'
            aria-label='Закрыть'
            onClick={closeModal}
          >
            ×
          </button>

          <p className='section-label'>Обратная связь</p>
          <h2 id='modal-title' className='modal-h2'>
            Оставьте заявку
          </h2>
          <p className='modal-sub'>
            Укажите имя, контакт и кратко ваш запрос — отвечу после записи.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className='form-group'>
              <label className='form-label' htmlFor='f-name'>
                Имя
              </label>
              <input
                id='f-name'
                ref={nameInputRef}
                className='form-input'
                type='text'
                name='name'
                required
                placeholder='Ваше имя'
              />
            </div>
            <div className='form-group'>
              <label className='form-label' htmlFor='f-contact'>
                Контакт
              </label>
              <input
                id='f-contact'
                className='form-input'
                type='text'
                name='contact'
                required
                placeholder='Телефон или @username'
              />
            </div>
            <div className='form-group'>
              <label className='form-label' htmlFor='f-message'>
                Сообщение
              </label>
              <textarea
                id='f-message'
                className='form-input'
                name='message'
                rows='4'
                required
                placeholder='Коротко опишите запрос'
              />
            </div>
            <button
              className='btn-primary'
              type='submit'
              disabled={isSubmitting}
              style={{ marginTop: 20, opacity: isSubmitting ? 0.65 : 1 }}
            >
              {isSubmitting ? "Отправляем…" : "Отправить заявку"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
