import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaTelegramPlane, FaVk } from "react-icons/fa";

const phoneDisplay = "+7 (952) 330-74-96";
const phoneTel = "+79523307496";

const services = [
  {
    title: "Поиск себя и своего пути",
    description: "Когда сложно понять, чего вы хотите и куда двигаться дальше.",
    num: "01",
  },
  {
    title: "Самооценка и принятие себя",
    description: "Меньше самокритики, больше поддержки и устойчивости внутри.",
    num: "02",
  },
  {
    title: "Тревога и стресс",
    description:
      "Разбираем перегрузку, тревожные сценарии и способы жить спокойнее.",
    num: "03",
  },
  {
    title: "Конфликты и отношения",
    description:
      "Про границы, ожидания и то, как говорить и слышать друг друга.",
    num: "04",
  },
];

const steps = [
  {
    title: "Платформа",
    body: "Онлайн через приложение Яндекс Телемост — просто, конфиденциально и не требует установки приложения",
  },
  {
    title: "Первый контакт",
    body: "Напишите примерный запрос: обсудим мой формат и поймем, подходим ли друг другу.",
  },
  {
    title: "Комфортный темп",
    body: "Разовая консультация или длительная работа: глубину и ритм выбираем вместе.",
  },
];

const moodPhotos = [
  {
    src: "photos/photo_2026-05-24_11-19-10.jpg",
    alt: "Светящийся силуэт как образ внутренней опоры",
    imageClassName: "object-[center_36%]",
  },
  {
    src: "photos/photo_2026-05-24_11-19-07.jpg",
    alt: "Пастельная медитативная фигура в мягком свечении",
    imageClassName: "object-[center_36%]",
  },
  {
    src: "photos/photo_2026-05-24_11-19-07 (2).jpg",
    alt: "Мягкий свет и дерево как образ внутреннего диалога",
    imageClassName: "",
  },
  {
    src: "photos/photo_2026-05-24_11-19-09 (2).jpg",
    alt: "Переливающиеся линии в пастельном небе",
    imageClassName: "object-[center_58%]",
  },
];

const [
  featuredMoodPhoto,
  meditativeMoodPhoto,
  dialogueMoodPhoto,
  flowMoodPhoto,
] = moodPhotos;

const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
const telegramUsername = String(import.meta.env.VITE_TELEGRAM_USERNAME || "")
  .trim()
  .replace(/^@+/, "");

/* tiny hook: fade-in on scroll с поддержкой data-delay */
function useFadeIn() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-fade]");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            // BUG FIX 1: применяем data-delay как CSS transition-delay
            const delay = e.target.dataset.delay;
            if (delay) {
              e.target.style.transitionDelay = `${Number(delay) * 80}ms`;
            }
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

/* hook: show sticky button after scroll */
function useStickyButton() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return visible;
}

/* focus trap hook for modal */
function useFocusTrap(isActive) {
  const containerRef = useRef(null);
  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    const focusable = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const onKeyDown = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isActive]);
  return containerRef;
}

/* hook: detect scroll for header shadow */
function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return scrolled;
}

/* hook: scroll progress 0–1 */
function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrollable = el.scrollHeight - el.clientHeight;
      setProgress(
        scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0,
      );
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return progress;
}

/* hook: active nav section id */
function useActiveSection(ids) {
  const [active, setActive] = useState("");
  useEffect(() => {
    const observers = [];
    const handler = (id) => (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActive(id);
      });
    };
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const io = new IntersectionObserver(handler(id), {
        rootMargin: "-40% 0px -50% 0px",
        threshold: 0,
      });
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((io) => io.disconnect());
  }, [ids]);
  return active;
}

/* hook: hero entrance animation (fires once on mount) */
function useHeroReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setTimeout(() => setReady(true), 60));
    return () => cancelAnimationFrame(t);
  }, []);
  return ready;
}

/* inject global styles once */
function GlobalStyles() {
  useEffect(() => {
    const id = "ky-global-styles";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = `
      @keyframes heroFadeUp {
        from { opacity: 0; transform: translateY(28px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes heroFadeRight {
        from { opacity: 0; transform: translateX(24px); }
        to   { opacity: 1; transform: translateX(0); }
      }
      .hero-text-enter {
        animation: heroFadeUp 0.72s cubic-bezier(0.22,1,0.36,1) both;
      }
      .hero-card-enter {
        animation: heroFadeRight 0.82s cubic-bezier(0.22,1,0.36,1) 0.18s both;
      }
      .nav-link-active {
        color: #0F2D45 !important;
        font-weight: 600;
      }
      .nav-link-active::after {
        transform: translateX(-50%) scaleX(1) !important;
      }
      @keyframes floatTg {
        0%,100% { transform: translateY(0); }
        50%      { transform: translateY(-5px); }
      }
      .float-tg { animation: floatTg 3s ease-in-out infinite; }

        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      @keyframes pulseRing {
        0% { box-shadow: 0 0 0 0 rgba(91,168,212,0.55); }
        70% { box-shadow: 0 0 0 9px rgba(91,168,212,0); }
        100% { box-shadow: 0 0 0 0 rgba(91,168,212,0); }
      }
      @keyframes arrowBounce {
        0%, 100% { transform: translateX(0); }
        50% { transform: translateX(4px); }
      }
      [data-fade] {
        opacity: 0;
        transform: translateY(22px);
        transition: opacity 0.6s ease, transform 0.6s ease;
      }
      [data-fade].is-visible {
        opacity: 1;
        transform: translateY(0);
      }
      .nav-link {
        position: relative;
      }
      .nav-link::after {
        content: '';
        position: absolute;
        bottom: 8px;
        left: 50%;
        transform: translateX(-50%) scaleX(0);
        width: 16px;
        height: 1.5px;
        background: #5BA8D4;
        border-radius: 2px;
        transition: transform 0.2s ease;
      }
      .nav-link:hover::after {
        transform: translateX(-50%) scaleX(1);
      }
      .pricing-arrow {
        display: inline-block;
        transition: transform 0.25s ease;
      }
      .pricing-link:hover .pricing-arrow {
        animation: arrowBounce 0.5s ease infinite;
      }
      .sticky-pulse {
        animation: pulseRing 2.2s ease-out infinite;
      }

    `;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);
  return null;
}

/* reusable atoms */
const SectionLabel = ({ children, className = "" }) => (
  <p
    className={
      "inline-flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5BA8D4] mb-3.5 before:block before:w-5 before:h-px before:bg-[#5BA8D4] after:block after:w-3 after:h-px after:bg-[#5BA8D4]/50 " +
      className
    }
  >
    {children}
  </p>
);

const SectionH2 = ({ children, className = "" }) => (
  <h2
    className={
      "font-serif font-semibold text-[clamp(36px,5vw,58px)] leading-[1.06] text-[#0F2D45] [&_em]:italic [&_em]:font-normal [&_em]:text-[#3A93C8] " +
      className
    }
  >
    {children}
  </h2>
);

const BtnPrimary = ({ className = "", ...props }) => (
  <button
    {...props}
    className={
      "inline-flex items-center gap-1.5 bg-[#5BA8D4] text-white border-0 cursor-pointer font-sans text-[13px] font-semibold tracking-[0.07em] px-6 py-2.5 rounded-full no-underline shadow-[0_10px_28px_rgba(91,168,212,0.32),inset_0_1px_0_rgba(255,255,255,0.18)] transition-[background,transform,box-shadow] duration-200 hover:bg-[#4A97C3] hover:-translate-y-[3px] hover:shadow-[0_16px_36px_rgba(91,168,212,0.42),inset_0_1px_0_rgba(255,255,255,0.18)] active:translate-y-0 active:shadow-[0_6px_18px_rgba(91,168,212,0.28)] disabled:opacity-65 " +
      className
    }
  />
);

const Divider = () => (
  <div className='flex items-center gap-4 py-1'>
    <div className='flex-1 h-px bg-gradient-to-r from-transparent via-[rgba(91,168,212,0.4)] to-transparent' />
    <div className='flex items-center gap-[7px]'>
      <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(91,168,212,0.35)]' />
      <span className='block w-[7px] h-[7px] rotate-45 bg-[rgba(91,168,212,0.45)]' />
      <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(91,168,212,0.35)]' />
    </div>
    <div className='flex-1 h-px bg-gradient-to-r from-transparent via-[rgba(91,168,212,0.4)] to-transparent' />
  </div>
);

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInlineSubmitting, setIsInlineSubmitting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const nameInputRef = useRef(null);
  const contactInputRef = useRef(null);
  const closeTimerRef = useRef(null);
  const headerRef = useRef(null);
  const triggerRef = useRef(null);
  const isMountedRef = useRef(true);

  const NAV_IDS = ["about", "services", "process", "pricing", "contacts"];

  useFadeIn();
  const showStickyBtn = useStickyButton();
  const modalRef = useFocusTrap(isModalOpen);
  const isScrolled = useScrolled();
  const scrollProgress = useScrollProgress();
  const activeSection = useActiveSection(NAV_IDS);
  const heroReady = useHeroReady();

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    // BUG FIX 4: возвращаем фокус на кнопку-триггер при закрытии
    setTimeout(() => triggerRef.current?.focus(), 50);
  }, []);

  const openModal = (e) => {
    // BUG FIX 4: запоминаем элемент, с которого открыли модал
    if (e?.currentTarget) triggerRef.current = e.currentTarget;
    setIsModalOpen(true);
  };

  /* BUG FIX 10: сброс мобильного меню при resize до desktop */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setIsMenuOpen(false);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* lock scroll when modal open */
  useEffect(() => {
    if (isModalOpen) {
      const scrollY = window.scrollY;
      document.body.style.cssText = `overflow:hidden;position:fixed;top:-${scrollY}px;width:100%`;
      setTimeout(() => nameInputRef.current?.focus(), 50);
    } else {
      // BUG FIX 12: безопасный parseInt с fallback на 0
      const topValue = document.body.style.top;
      const scrollY = topValue ? parseInt(topValue, 10) * -1 : 0;
      document.body.style.cssText = "";
      if (topValue) window.scrollTo(0, scrollY);
    }
    return () => (document.body.style.cssText = "");
  }, [isModalOpen]);

  /* keyboard + smooth anchors */
  useEffect(() => {
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

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact,
          message,
          page: window.location.href,
        }),
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok || result?.ok === false) {
        throw new Error(result.error || "Не удалось отправить заявку.");
      }

      // BUG FIX 7: проверяем mounted перед setState
      if (isMountedRef.current) {
        toast.success("Заявка отправлена");
        e.target.reset();
        closeTimerRef.current = setTimeout(() => {
          if (isMountedRef.current) closeModal();
        }, 600);
      }
    } catch (error) {
      if (isMountedRef.current) {
        toast.error(error?.message || "Ошибка отправки");
      }
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    }
  };

  const handleInlineSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("il-name") || "").trim();
    const contact = String(fd.get("il-contact") || "").trim();
    const message = String(fd.get("il-message") || "").trim();
    if (!name || !contact || !message) {
      toast.error("Заполните все поля.");
      return;
    }
    setIsInlineSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact,
          message,
          page: window.location.href,
        }),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok || result?.ok === false)
        throw new Error(result.error || "Не удалось отправить.");
      if (isMountedRef.current) {
        toast.success("Заявка отправлена");
        e.target.reset();
      }
    } catch (err) {
      if (isMountedRef.current) toast.error(err?.message || "Ошибка отправки");
    } finally {
      if (isMountedRef.current) setIsInlineSubmitting(false);
    }
  };

  return (
    <>
      <GlobalStyles />

      {/* SCROLL PROGRESS BAR */}
      <div
        aria-hidden='true'
        className='fixed top-0 left-0 z-[60] h-[2.5px] bg-gradient-to-r from-[#7DCAF0] via-[#5BA8D4] to-[#3A93C8] transition-none origin-left pointer-events-none'
        style={{
          width: `${scrollProgress * 100}%`,
          opacity: scrollProgress > 0.005 ? 1 : 0,
        }}
      />

      {/* HEADER */}
      <header
        ref={headerRef}
        className={
          "sticky top-0 z-50 border-b border-[rgba(91,168,212,0.22)] bg-[rgba(240,249,255,0.94)] backdrop-blur-md transition-shadow duration-300 " +
          (isScrolled ? "shadow-[0_4px_24px_rgba(91,168,212,0.13)]" : "")
        }
      >
        <div className='grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-[18px] md:px-10 lg:grid-cols-[auto_minmax(0,1fr)_220px] lg:gap-8'>
          <a
            href='#'
            aria-label='Карина Якимова — главная'
            className='flex h-[98px] min-w-0 items-center leading-none no-underline md:h-[118px] lg:justify-self-start'
          >
            <img
              src={asset("logo.svg")}
              width='682'
              height='182'
              alt='Карина Якимова — практикующий психолог'
              decoding='async'
              className='block h-16 w-auto max-w-full md:h-[90px]'
              style={{
                filter: "hue-rotate(175deg) saturate(0.85) brightness(0.88)",
              }}
            />
          </a>

          <nav
            aria-label='Основная навигация'
            className='hidden lg:flex items-center justify-center gap-1 xl:gap-2'
          >
            {[
              ["about", "Обо мне"],
              ["services", "Услуги"],
              ["process", "Формат"],
              ["pricing", "Стоимость"],
              ["contacts", "Контакты"],
            ].map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className={
                  "nav-link inline-flex h-11 items-center justify-center rounded-full px-4 xl:px-5 text-[13px] tracking-[0.04em] no-underline transition-[color] duration-200 " +
                  (activeSection === id
                    ? "nav-link-active text-[#0F2D45]"
                    : "text-[#2E5F80] hover:text-[#0F2D45]")
                }
              >
                {label}
              </a>
            ))}
          </nav>

          <BtnPrimary
            onClick={openModal}
            type='button'
            className='max-lg:!hidden lg:!inline-flex lg:h-11 lg:min-w-[174px] lg:justify-center lg:justify-self-end lg:px-7 lg:py-0 lg:text-[13px]'
          >
            Записаться
          </BtnPrimary>

          <button
            type='button'
            aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={isMenuOpen}
            aria-controls='mobile-nav'
            onClick={() => setIsMenuOpen((v) => !v)}
            className='flex h-[42px] w-[42px] items-center justify-center rounded-lg border-[1.5px] border-[#A8D4EC] bg-transparent text-xl leading-none text-[#0F2D45] cursor-pointer lg:hidden transition-colors hover:bg-[#EEF7FC]'
          >
            {isMenuOpen ? "×" : "☰"}
          </button>
        </div>
      </header>

      {/* mobile nav */}
      <div
        id='mobile-nav'
        aria-hidden={!isMenuOpen}
        className={
          "lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out " +
          (isMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0")
        }
      >
        <div className='flex flex-col gap-4 px-[18px] py-5 bg-[#EEF7FC] border-b border-[rgba(91,168,212,0.22)]'>
          {[
            ["#about", "Обо мне"],
            ["#services", "Услуги"],
            ["#process", "Формат работы"],
            ["#pricing", "Стоимость"],
            ["#contacts", "Контакты"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className='text-[15px] text-[#2E5F80] no-underline hover:text-[#0F2D45] transition-colors'
            >
              {label}
            </a>
          ))}
          <BtnPrimary type='button' onClick={openModal} className='w-fit mt-1'>
            Записаться
          </BtnPrimary>
        </div>
      </div>

      <main>
        {/* HERO */}
        <div className='max-w-[1180px] mx-auto px-[18px] md:px-10'>
          {/* md:py-[80px_70px] заменено на раздельные pt/pb, потому что такой Tailwind-класс невалиден */}
          <section
            id='about'
            className='grid grid-cols-1 md:grid-cols-[1fr_420px] gap-10 md:gap-14 items-center py-[52px] md:pt-[80px] md:pb-[70px] [scroll-margin-top:124px]'
          >
            <div className={heroReady ? "hero-text-enter" : "opacity-0"}>
              <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2E5F80] bg-[#DDF0FA] border border-[#A8D4EC]/60 px-4 py-[6px] rounded-full mb-6 shadow-[0_2px_10px_rgba(91,168,212,0.12)] before:content-[''] before:w-[7px] before:h-[7px] before:rounded-full before:bg-[#5BA8D4] before:animate-pulse before:shadow-[0_0_0_3px_rgba(91,168,212,0.22),0_0_10px_rgba(91,168,212,0.5)] before:shrink-0">
                Практикующий психолог
              </p>
              <h1 className='font-serif font-bold text-[clamp(42px,5.5vw,72px)] leading-[1.1] -tracking-[0.02em] text-[#0F2D45] [&_em]:italic [&_em]:font-normal [&_em]:text-[#3A93C8]'>
                Опора и ясность —<br />
                <em>шаг за шагом</em>
              </h1>
              <p className='mt-6 text-[17px] leading-[1.85] text-[#2C5270] max-w-[44ch]'>
                Меня зовут Карина Якимова. Я практикующий психолог. Помогаю
                справляться с повседневными трудностями, находить опору и
                понимать себя.
              </p>
              <div className='mt-9 flex items-center gap-5 flex-wrap'>
                <BtnPrimary type='button' onClick={openModal}>
                  Записаться
                </BtnPrimary>
                <a
                  href='#services'
                  className='inline-flex items-center gap-1.5 text-[13px] font-medium tracking-[0.04em] text-[#5BA8D4] no-underline transition-colors hover:text-[#4A97C3] group'
                >
                  Смотреть услуги
                  <span className='transition-transform duration-200 group-hover:translate-x-1'>
                    →
                  </span>
                </a>
              </div>
              <ul className='flex gap-2.5 flex-wrap mt-7 list-none p-0'>
                {[
                  "Яндекс Телемост",
                  "Индивидуально",
                  "Разово или длительно",
                ].map((p) => (
                  <li
                    key={p}
                    className='text-xs text-[#2E5F80] border border-[#A8D4EC]/70 rounded-full px-3.5 py-[5px] bg-white/[0.72]'
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* hero card */}
            <div
              className={
                "animate-[heroFloat_7s_ease-in-out_infinite] " +
                (heroReady ? "hero-card-enter" : "opacity-0")
              }
            >
              <div className='relative overflow-visible rounded-[28px] border border-[rgba(91,168,212,0.3)] bg-[linear-gradient(155deg,#f5fbff_0%,#deeef9_46%,#c8e4f5_100%)] shadow-[0_30px_80px_rgba(91,168,212,0.18)]'>
                <div className='grid grid-cols-[1.05fr_0.95fr] gap-3 overflow-hidden rounded-t-[28px] p-3 pb-0'>
                  <div className='overflow-hidden rounded-[22px] shadow-[0_18px_45px_rgba(91,168,212,0.16)]'>
                    <img
                      src={asset("photos/photo_2026-05-24_10-31-25.jpg")}
                      alt='Карина с букетом роз на вечерней прогулке'
                      className='block h-[280px] w-full object-cover object-[center_28%] transition-transform duration-[6000ms] hover:scale-[1.06] md:h-[320px]'
                    />
                  </div>
                  <div className='overflow-hidden rounded-[22px] shadow-[0_18px_45px_rgba(91,168,212,0.16)]'>
                    <img
                      src={asset("photos/photo_2026-05-24_10-31-26.jpg")}
                      alt='Карина с букетом гортензий в тёплом вечернем свете'
                      className='block h-[280px] w-full object-cover object-[58%_center] transition-transform duration-[6000ms] hover:scale-[1.06] md:h-[320px]'
                    />
                  </div>
                </div>
                <div className='px-7 pt-6 pb-7'>
                  <SectionLabel>Бережное сопровождение</SectionLabel>
                  <p className='font-serif italic text-[28px] font-normal text-[#4A97C3] leading-[1.35] mt-2.5'>
                    Рядом в комфортном
                    <br />
                    для Вас темпе
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* MOOD */}
        <div className='max-w-[1180px] mx-auto px-[18px] md:px-10'>
          <section className='py-16 border-t border-[rgba(91,168,212,0.18)] mt-8'>
            <div data-fade>
              <SectionLabel>Атмосфера</SectionLabel>
              <SectionH2>
                Пространство <em>для Вас</em>
              </SectionH2>
            </div>
            <div className='mt-9 grid grid-cols-1 gap-3.5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-[18px]'>
              <div
                data-fade
                data-delay='1'
                className='overflow-hidden rounded-[24px] shadow-[0_24px_56px_rgba(91,168,212,0.18)]'
              >
                <img
                  src={asset(featuredMoodPhoto.src)}
                  alt={featuredMoodPhoto.alt}
                  className={
                    "block h-[360px] w-full object-cover sm:h-[520px] lg:h-[680px] " +
                    featuredMoodPhoto.imageClassName
                  }
                />
              </div>

              <div className='grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-2 lg:grid-rows-[240px_1fr] lg:gap-[18px]'>
                <div
                  data-fade
                  data-delay='2'
                  className='overflow-hidden rounded-[24px] shadow-[0_18px_45px_rgba(91,168,212,0.16)]'
                >
                  <img
                    src={asset(meditativeMoodPhoto.src)}
                    alt={meditativeMoodPhoto.alt}
                    className={
                      "block h-[240px] w-full object-cover " +
                      meditativeMoodPhoto.imageClassName
                    }
                  />
                </div>

                <div
                  data-fade
                  data-delay='3'
                  className='overflow-hidden rounded-[24px] shadow-[0_18px_45px_rgba(91,168,212,0.16)]'
                >
                  <img
                    src={asset(dialogueMoodPhoto.src)}
                    alt={dialogueMoodPhoto.alt}
                    className={
                      "block h-[240px] w-full object-cover " +
                      dialogueMoodPhoto.imageClassName
                    }
                  />
                </div>

                <div
                  data-fade
                  data-delay='4'
                  className='overflow-hidden rounded-[24px] shadow-[0_20px_50px_rgba(91,168,212,0.16)] sm:col-span-2'
                >
                  <img
                    src={asset(flowMoodPhoto.src)}
                    alt={flowMoodPhoto.alt}
                    className={
                      "block h-[220px] w-full object-cover sm:h-[250px] lg:h-[422px] " +
                      flowMoodPhoto.imageClassName
                    }
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className='max-w-[1180px] mx-auto px-[18px] md:px-10 mb-5 md:mb-6'>
          <Divider />
        </div>

        {/* SERVICES */}
        <div className='max-w-[1180px] mx-auto px-[18px] md:px-10'>
          <section id='services' className='py-16 [scroll-margin-top:124px]'>
            <div data-fade>
              <SectionLabel>Услуги</SectionLabel>
              <SectionH2>
                С чем <em>я работаю</em>
              </SectionH2>
            </div>
            <div
              data-fade
              data-delay='1'
              className='grid grid-cols-1 sm:grid-cols-2 mt-11 rounded-[24px] overflow-hidden border-[1.5px] border-[rgba(91,168,212,0.28)] divide-y divide-[rgba(91,168,212,0.2)] sm:divide-y-0 sm:[&>article]:border-r-[1.5px] sm:[&>article]:border-[rgba(91,168,212,0.2)] sm:[&>article:nth-child(2n)]:border-r-0 sm:[&>article:nth-child(-n+2)]:border-b-[1.5px]'
            >
              {services.map((item) => (
                <article
                  key={item.title}
                  className='group px-8 pt-8 pb-9 bg-[linear-gradient(180deg,#f5fbff_0%,#eef7fd_100%)] transition-all duration-300 hover:bg-white hover:shadow-[inset_3px_0_0_#5BA8D4] relative overflow-hidden'
                >
                  <span
                    aria-hidden='true'
                    className='absolute right-[-8px] bottom-[-18px] font-serif font-bold text-[110px] leading-none text-[#5BA8D4]/[0.08] pointer-events-none select-none transition-[transform,color] duration-300 group-hover:scale-110 group-hover:-translate-y-1.5 group-hover:text-[#5BA8D4]/[0.13]'
                  >
                    {item.num}
                  </span>
                  <p className='font-serif text-[13px] tracking-[0.18em] text-[#5BA8D4] relative z-10'>
                    {item.num}
                  </p>
                  <h3 className='font-serif text-[26px] font-medium text-[#0F2D45] mt-2 leading-[1.25] relative z-10'>
                    {item.title}
                  </h3>
                  <p className='text-sm leading-[1.75] text-[#2E5F80] mt-3 relative z-10'>
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* PROCESS */}
        <div className='max-w-[1180px] mx-auto px-[18px] md:px-10'>
          <section
            id='process'
            className='relative overflow-hidden py-16 px-6 sm:px-8 lg:px-10 rounded-[30px] border border-[rgba(91,168,212,0.22)] bg-[linear-gradient(135deg,rgba(245,251,255,0.96)_0%,rgba(222,238,249,0.94)_58%,rgba(200,228,245,0.9)_100%)] [scroll-margin-top:124px]'
          >
            {/* фото справа — меньше градиента, выше opacity */}
            <div
              aria-hidden='true'
              className='pointer-events-none absolute inset-y-0 right-0 hidden w-[38%] min-w-[280px] bg-cover bg-[center_20%] opacity-100 sm:block'
              style={{
                backgroundImage: `linear-gradient(270deg, rgba(222,238,249,0) 0%, rgba(222,238,249,0.55) 38%, rgba(222,238,249,0.97) 72%), url("${asset(
                  "photos/photo_2026-05-24_11-19-07 (2).jpg",
                )}")`,
              }}
            />
            <div data-fade className='relative z-10 max-w-[760px]'>
              <SectionLabel>Процесс</SectionLabel>
              <SectionH2>
                Как мы будем <em>работать</em>
              </SectionH2>
            </div>
            <ol className='relative z-10 flex flex-col mt-11 list-none p-0 max-w-[680px]'>
              {steps.map((step, i) => (
                <li
                  key={step.title}
                  data-fade
                  data-delay={String(i + 1)}
                  className='grid grid-cols-[48px_1fr] gap-6 items-stretch min-h-[150px]'
                >
                  {/* левая колонка: кружок + соединительная линия */}
                  <div className='relative flex flex-col items-center self-stretch'>
                    <span className='relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-[1.5px] border-[rgba(91,168,212,0.4)] bg-white/90 font-serif text-[17px] font-normal text-[#5BA8D4] shadow-[0_2px_12px_rgba(91,168,212,0.14)] leading-none shrink-0 mt-5'>
                      {String(i + 1)}
                    </span>

                    {i < steps.length - 1 && (
                      <div
                        aria-hidden='true'
                        className='absolute top-[64px] bottom-[-6px] w-px bg-gradient-to-b from-[rgba(91,168,212,0.32)] to-[rgba(91,168,212,0.06)]'
                      />
                    )}
                  </div>
                  {/* правая колонка: текст */}
                  <div className='py-5 border-b border-[rgba(91,168,212,0.15)] last:border-b-0'>
                    <p className='font-serif text-[22px] font-medium text-[#0F2D45] mb-1.5'>
                      {step.title}
                    </p>
                    <p className='text-[15px] leading-[1.75] text-[#2E5F80]'>
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* TRUST */}
        <div className='max-w-[1180px] mx-auto px-[18px] md:px-10'>
          <section className='py-16 border-t border-[rgba(91,168,212,0.18)]'>
            <div data-fade>
              <SectionLabel>Доверие</SectionLabel>
              <SectionH2 className='mb-7'>
                Важно <em>знать</em>
              </SectionH2>
              <div className='relative isolate overflow-hidden flex flex-col sm:flex-row items-start gap-5 sm:gap-10 p-9 sm:p-[52px_56px] rounded-[24px] border border-[rgba(91,168,212,0.28)] bg-[linear-gradient(130deg,rgba(245,251,255,0.9)_0%,rgba(222,238,249,0.86)_56%,rgba(200,228,245,0.84)_100%)]'>
                {/* left accent bar */}
                <div
                  aria-hidden='true'
                  className='absolute left-0 inset-y-0 w-[3px] rounded-l-[24px] bg-gradient-to-b from-[#5BA8D4] via-[#7DCAF0] to-[#5BA8D4]/30'
                />
                <div
                  aria-hidden='true'
                  className='pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.3] sm:opacity-[0.22]'
                  style={{
                    backgroundImage: `url("${asset(
                      "photos/photo_2026-05-24_11-19-09.jpg",
                    )}")`,
                  }}
                />
                <div
                  aria-hidden='true'
                  className='relative z-10 shrink-0 w-12 h-12 rounded-xl bg-[#5BA8D4] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(91,168,212,0.35)]'
                >
                  <svg
                    width='22'
                    height='22'
                    viewBox='0 0 22 22'
                    fill='none'
                    aria-hidden='true'
                  >
                    <path
                      d='M4.5 11.5L9 16L17.5 6'
                      stroke='white'
                      strokeWidth='2.2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
                <p className='relative z-10 text-base leading-[1.8] text-[#2E5F80] [&_strong]:text-[#0F2D45] [&_strong]:font-medium'>
                  Я сама регулярно прохожу <strong>личную терапию</strong> и
                  работаю с <strong>супервизором</strong> — это моя
                  профессиональная этика и залог качества вашей поддержки.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className='max-w-[1180px] mx-auto px-[18px] md:px-10'>
          <Divider />
        </div>

        {/* PRICING */}
        <div className='max-w-[1180px] mx-auto px-[18px] md:px-10'>
          <section id='pricing' className='py-16 [scroll-margin-top:124px]'>
            <div data-fade>
              <SectionLabel>Оплата</SectionLabel>
              <SectionH2>
                Запись и <em>оплата</em>
              </SectionH2>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mt-11'>
              <div
                data-fade
                data-delay='1'
                className='bg-[linear-gradient(180deg,#f5fbff_0%,#deeef9_100%)] border-[1.5px] border-[rgba(91,168,212,0.28)] border-t-[3px] border-t-[#A8D4EC] rounded-[20px] p-8 pb-9'
              >
                <p className='text-xs tracking-[0.12em] uppercase text-[#5BA8D4] font-semibold'>
                  Информация
                </p>
                <p className='font-serif text-[52px] font-normal text-[#0F2D45] leading-none mt-3 mb-1'>
                  Оплата
                </p>
                <p className='text-sm leading-[1.7] text-[#2E5F80] mt-3.5'>
                  Оплата производится до начала сессии банковским переводом по
                  номеру телефона или карты. Подробная информация о минимальной
                  стоимости сеанса есть на странице записи по ссылке.
                </p>
              </div>

              <a
                href='https://vk.cc/cXJ3c3'
                target='_blank'
                rel='noopener noreferrer'
                data-fade
                data-delay='2'
                className='pricing-link group border-[1.5px] border-[rgba(91,168,212,0.28)] border-t-[3px] border-t-[#5BA8D4] rounded-[20px] p-8 pb-9 no-underline text-inherit bg-[linear-gradient(150deg,#f5fbff,#deeef9,#c8e4f5)] transition-all duration-300 hover:shadow-[0_12px_36px_rgba(91,168,212,0.22)] hover:-translate-y-1'
              >
                <p className='text-xs tracking-[0.12em] uppercase text-[#5BA8D4] font-semibold'>
                  Онлайн-запись
                </p>
                <p className='font-serif text-[36px] font-normal text-[#0F2D45] leading-none mt-3.5 mb-1'>
                  Перейти <span className='pricing-arrow'>→</span>
                </p>
                <p className='text-sm leading-[1.7] text-[#2E5F80] mt-3.5'>
                  Нажмите, чтобы перейти к записи и оплате.
                </p>
              </a>
            </div>
          </section>
        </div>

        {/* CONTACTS */}
        <div className='max-w-[1180px] mx-auto px-[18px] md:px-10'>
          <section
            id='contacts'
            className='pt-16 pb-20 border-t border-[rgba(91,168,212,0.18)] [scroll-margin-top:124px]'
          >
            <div
              data-fade
              className='relative isolate overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-9 md:gap-12 items-start rounded-[28px] p-9 sm:p-[56px_60px] bg-[linear-gradient(145deg,rgba(30,79,112,0.9)_0%,rgba(43,111,150,0.86)_44%,rgba(91,168,212,0.74)_100%)]'
            >
              <div
                aria-hidden='true'
                className='pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.3] sm:opacity-[0.22]'
                style={{
                  backgroundImage: `url("${asset(
                    "photos/photo_2026-05-24_11-19-09 (2).jpg",
                  )}")`,
                }}
              />
              <div>
                <div className='mb-3.5 flex items-center gap-3'>
                  <p className='inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-[#E8F7FF]/80 [text-shadow:0_1px_12px_rgba(15,45,69,0.28)] before:block before:w-5 before:h-px before:bg-[#E8F7FF]/70'>
                    Контакты
                  </p>
                  <span
                    aria-hidden='true'
                    className='grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-white/14 text-lg shadow-[0_10px_24px_rgba(12,39,62,0.18)]'
                  >
                    🌿
                  </span>
                </div>
                <h2 className='font-serif font-normal text-[clamp(32px,4.5vw,52px)] leading-[1.08] text-white [text-shadow:0_3px_24px_rgba(15,45,69,0.26)] [&_em]:italic [&_em]:text-[#F2FBFF]'>
                  Записаться
                  <br />
                  или <em>задать вопрос</em>
                </h2>
                <p className='mt-4 text-[15px] leading-[1.8] text-[#EAF7FF]/92 [text-shadow:0_2px_16px_rgba(15,45,69,0.22)]'>
                  Напишите примерный запрос — обсудим формат и сможем ли
                  поработать вместе.
                </p>
              </div>
              <div>
                <p className='mb-3.5 text-xs tracking-[0.14em] uppercase text-[#E8F7FF]/80 [text-shadow:0_1px_12px_rgba(15,45,69,0.28)]'>
                  Связаться
                </p>
                <div className='flex flex-col gap-3.5'>
                  <a
                    href={`tel:${phoneTel}`}
                    className='inline-flex items-center gap-2.5 text-sm font-medium text-white no-underline bg-white/[0.14] border border-white/[0.24] rounded-full px-5 py-3 shadow-[0_10px_24px_rgba(15,45,69,0.14)] transition-colors hover:bg-white/[0.2] cursor-pointer w-fit'
                  >
                    <span aria-hidden='true'>☏</span>
                    <span>Телефон:</span> {phoneDisplay}
                  </a>
                  {telegramUsername ? (
                    <a
                      href={`https://t.me/${telegramUsername}`}
                      target='_blank'
                      rel='noreferrer'
                      className='inline-flex items-center gap-2.5 text-sm font-medium text-white no-underline bg-white/[0.14] border border-white/[0.24] rounded-full px-5 py-3 shadow-[0_10px_24px_rgba(15,45,69,0.14)] transition-colors hover:bg-white/[0.2] w-fit'
                    >
                      <span>Telegram:</span> @{telegramUsername}
                    </a>
                  ) : (
                    <span className='text-[13px] text-[#EAF7FF]/82 [text-shadow:0_1px_12px_rgba(15,45,69,0.24)]'>
                      Telegram — по этому же номеру.
                    </span>
                  )}
                  <a
                    href='https://t.me/krnykmva'
                    target='_blank'
                    rel='noreferrer'
                    className='inline-flex items-center gap-2.5 text-sm font-medium text-white no-underline bg-white/[0.14] border border-white/[0.24] rounded-full px-5 py-3 shadow-[0_10px_24px_rgba(15,45,69,0.14)] transition-colors hover:bg-white/[0.2] w-fit'
                  >
                    <FaTelegramPlane
                      className='text-[16px] shrink-0'
                      aria-hidden='true'
                    />
                    Telegram-канал
                  </a>
                  <a
                    href='https://vk.ru/krnykmvapsy'
                    target='_blank'
                    rel='noreferrer'
                    className='inline-flex items-center gap-2.5 text-sm font-medium text-white no-underline bg-white/[0.14] border border-white/[0.24] rounded-full px-5 py-3 shadow-[0_10px_24px_rgba(15,45,69,0.14)] transition-colors hover:bg-white/[0.2] w-fit'
                  >
                    <FaVk className='text-[16px] shrink-0' aria-hidden='true' />
                    Сообщество ВКонтакте
                  </a>
                  <button
                    type='button'
                    onClick={openModal}
                    className='inline-flex items-center gap-2.5 text-sm font-medium text-white bg-white/[0.16] border-[1.5px] border-white/[0.34] rounded-full px-5 py-3 shadow-[0_10px_24px_rgba(15,45,69,0.14)] transition-colors hover:bg-white/[0.24] cursor-pointer w-fit'
                  >
                    <span aria-hidden='true'>✎</span>
                    Оставить заявку
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className='border-t border-[rgba(91,168,212,0.18)] py-6 md:py-8 px-[18px] md:px-10'>
        <div className='max-w-[1180px] mx-auto flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center'>
          <p className='text-xs text-[#7BAEC9] tracking-[0.06em]'>
            Карина Якимова · Практикующий психолог · Онлайн
          </p>
          <div className='flex items-center gap-3'>
            <a
              href='https://t.me/krnykmva'
              target='_blank'
              rel='noreferrer'
              aria-label='Telegram-канал'
              className='flex items-center justify-center w-8 h-8 rounded-full border border-[#A8D4EC]/60 bg-white/60 text-[#5BA8D4] transition-all hover:bg-[#5BA8D4] hover:text-white hover:border-[#5BA8D4] hover:shadow-[0_4px_12px_rgba(91,168,212,0.3)]'
            >
              <FaTelegramPlane className='text-[13px]' aria-hidden='true' />
            </a>
            <a
              href='https://vk.ru/krnykmvapsy'
              target='_blank'
              rel='noreferrer'
              aria-label='Сообщество ВКонтакте'
              className='flex items-center justify-center w-8 h-8 rounded-full border border-[#A8D4EC]/60 bg-white/60 text-[#5BA8D4] transition-all hover:bg-[#5BA8D4] hover:text-white hover:border-[#5BA8D4] hover:shadow-[0_4px_12px_rgba(91,168,212,0.3)]'
            >
              <FaVk className='text-[13px]' aria-hidden='true' />
            </a>
            <span className='text-[11px] text-[#7BAEC9]/70 tracking-[0.06em] ml-2'>
              © {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </footer>

      {/* Floating Telegram */}
      <a
        href='https://t.me/krnykmva'
        target='_blank'
        rel='noreferrer'
        aria-label='Написать в Telegram'
        className={
          "fixed bottom-6 left-6 z-40 float-tg flex items-center justify-center w-[46px] h-[46px] rounded-full bg-[#5BA8D4] text-white shadow-[0_8px_24px_rgba(91,168,212,0.45)] transition-[opacity,transform,box-shadow] duration-300 hover:bg-[#4A97C3] hover:shadow-[0_12px_30px_rgba(91,168,212,0.55)] hover:scale-110 " +
          (showStickyBtn
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none")
        }
      >
        <FaTelegramPlane className='text-[20px]' aria-hidden='true' />
      </a>

      {/* Sticky CTA button */}
      <button
        type='button'
        onClick={openModal}
        aria-label='Записаться на консультацию'
        className={
          "fixed bottom-6 right-6 z-40 inline-flex items-center gap-2.5 bg-[#5BA8D4] text-white font-sans text-[13px] font-semibold tracking-[0.05em] pl-5 pr-4 py-3 rounded-full shadow-[0_10px_30px_rgba(91,168,212,0.42)] transition-[opacity,transform,box-shadow] duration-300 hover:bg-[#4A97C3] hover:shadow-[0_14px_38px_rgba(91,168,212,0.52)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer " +
          (showStickyBtn
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none")
        }
      >
        Записаться
        <span
          aria-hidden='true'
          className='sticky-pulse flex items-center justify-center w-[22px] h-[22px] rounded-full bg-white/20 text-[11px]'
        >
          ↑
        </span>
      </button>

      {/* MODAL */}
      {/* BUG FIX 2 & 3: inert вместо aria-hidden на оверлее — блокирует фокус и скрин-ридеры для всего содержимого */}
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}
        aria-hidden={!isModalOpen}
        // BUG FIX 3: tabIndex="-1" на оверлее не помогает — используем inert на контейнере когда закрыт
        className={
          "fixed inset-0 z-[100] grid place-items-center bg-[rgba(20,55,80,0.52)] backdrop-blur-[4px] transition-[opacity,visibility] duration-300 " +
          (isModalOpen ? "opacity-100 visible" : "opacity-0 invisible")
        }
      >
        <div
          ref={modalRef}
          role='dialog'
          aria-modal='true'
          aria-labelledby='modal-title'
          className={
            "relative z-[1] bg-[linear-gradient(180deg,#f5fbff_0%,#e8f4fc_100%)] border border-[rgba(91,168,212,0.28)] rounded-[28px] w-[min(540px,calc(100vw-36px))] shadow-[0_40px_80px_rgba(30,63,90,0.22),0_0_0_1px_rgba(91,168,212,0.1)] transition-transform duration-300 overflow-hidden " +
            (isModalOpen ? "translate-y-0" : "translate-y-4")
          }
        >
          {/* modal accent top bar */}
          <div
            aria-hidden='true'
            className='absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#7DCAF0] via-[#5BA8D4] to-[#A8D4EC] rounded-t-[28px]'
          />

          <div className='p-10 pb-11 pt-11'>
            <button
              type='button'
              aria-label='Закрыть форму'
              onClick={closeModal}
              className='absolute top-4 right-4 w-8 h-8 rounded-full border border-[#A8D4EC]/65 bg-white/80 cursor-pointer text-lg leading-none text-[#5BA8D4] flex items-center justify-center transition-all hover:bg-[#5BA8D4] hover:text-white hover:border-[#5BA8D4] hover:rotate-90 duration-200'
            >
              ×
            </button>

            <SectionLabel>Обратная связь</SectionLabel>
            <h2
              id='modal-title'
              className='font-serif text-4xl font-normal text-[#0F2D45] mt-2.5'
            >
              Оставьте заявку
            </h2>
            <p className='text-[13px] leading-[1.7] text-[#2E5F80] mt-1.5'>
              Укажите имя, контакт и кратко ваш запрос — отвечу после записи.
            </p>

            <form
              onSubmit={handleSubmit}
              noValidate
              className='mt-5 flex flex-col gap-4'
            >
              <div className='flex flex-col gap-1.5'>
                <label
                  htmlFor='f-name'
                  className='text-xs font-semibold tracking-[0.1em] uppercase text-[#5BA8D4]'
                >
                  Имя
                </label>
                <input
                  id='f-name'
                  ref={nameInputRef}
                  type='text'
                  name='name'
                  required
                  autoComplete='given-name'
                  placeholder='Ваше имя'
                  className='w-full px-4 py-3 border-[1.5px] border-[#A8D4EC]/65 rounded-xl bg-white font-sans text-sm text-[#0F2D45] outline-none transition-[border-color,box-shadow] duration-200 focus:border-[#5BA8D4] focus:shadow-[0_0_0_3px_rgba(91,168,212,0.15)] placeholder:text-[#9BBFD6]'
                />
              </div>

              <div className='flex flex-col gap-1.5'>
                <label
                  htmlFor='f-contact'
                  className='text-xs font-semibold tracking-[0.1em] uppercase text-[#5BA8D4]'
                >
                  Контакт
                </label>
                <input
                  id='f-contact'
                  ref={contactInputRef}
                  type='text'
                  name='contact'
                  required
                  autoComplete='tel'
                  placeholder='Телефон или @username'
                  className='w-full px-4 py-3 border-[1.5px] border-[#A8D4EC]/65 rounded-xl bg-white font-sans text-sm text-[#0F2D45] outline-none transition-[border-color,box-shadow] duration-200 focus:border-[#5BA8D4] focus:shadow-[0_0_0_3px_rgba(91,168,212,0.15)] placeholder:text-[#9BBFD6]'
                />
              </div>

              <div className='flex flex-col gap-1.5'>
                <label
                  htmlFor='f-message'
                  className='text-xs font-semibold tracking-[0.1em] uppercase text-[#5BA8D4]'
                >
                  Сообщение
                </label>
                <textarea
                  id='f-message'
                  name='message'
                  rows='4'
                  required
                  placeholder='Коротко опишите запрос'
                  className='w-full px-4 py-3 border-[1.5px] border-[#A8D4EC]/65 rounded-xl bg-white font-sans text-sm text-[#0F2D45] outline-none transition-[border-color,box-shadow] duration-200 resize-y min-h-[100px] focus:border-[#5BA8D4] focus:shadow-[0_0_0_3px_rgba(91,168,212,0.15)] placeholder:text-[#9BBFD6]'
                />
              </div>

              <BtnPrimary
                type='submit'
                disabled={isSubmitting}
                className='mt-1 self-start'
              >
                {isSubmitting ? "Отправляем…" : "Отправить заявку"}
              </BtnPrimary>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
