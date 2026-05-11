import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const services = [
  "Краткое описание услуги.",
  "Краткое описание услуги.",
  "Краткое описание услуги.",
];

const steps = ["text", "text", "text"];

const reviews = ["Короткая цитата клиента.", "Еще одна короткая цитата."];

const titleFont = "[font-family:'Cormorant_Garamond',serif]";
const telegramUsername = String(import.meta.env.VITE_TELEGRAM_USERNAME || "")
  .trim()
  .replace(/^@+/, "");

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const nameInputRef = useRef(null);
  const closeTimerRef = useRef(null);
  const headerRef = useRef(null);

  const closeModal = useCallback(() => setIsModalOpen(false), []);
  const openModal = () => setIsModalOpen(true);

  useEffect(() => {
    if (isModalOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      nameInputRef.current?.focus();
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
      }
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [isModalOpen]);

  useEffect(() => {
    document.documentElement.classList.add("scroll-smooth");

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal();
        setIsMenuOpen(false);
      }
    };

    const onAnchorClick = (event) => {
      const anchor = event.target.closest('a[href^="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      const headerOffset = headerRef.current?.offsetHeight ?? 80;
      const top =
        target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: "smooth" });
      setIsMenuOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onAnchorClick);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onAnchorClick);
      document.documentElement.classList.remove("scroll-smooth");
    };
  }, [closeModal]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;
  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const form = event.currentTarget;
    const formData = new FormData(form);
  
    const payload = {
      name: String(formData.get("name") || "").trim(),
      contact: String(formData.get("contact") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      page: window.location.href,
    };
  
    if (!payload.name || !payload.contact || !payload.message) {
      toast.error("Заполните все поля.");
      return;
    }
  
    if (!botToken || !chatId) {
      toast.error("Telegram bot не настроен.");
      return;
    }
  
    setIsSubmitting(true);
  
    const text = [
      "Новая заявка",
      "",
      `Имя: ${payload.name}`,
      `Контакт: ${payload.contact}`,
      `Сообщение: ${payload.message}`,
    ].join("\n");
  
    try {
      const body = new URLSearchParams({
        chat_id: chatId,
        text,
      });
  
      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body,
        }
      );
  
      if (!response.ok) {
        throw new Error("Ошибка Telegram API");
      }
  
      toast.success("Заявка отправлена");
  
      form.reset();
  
      closeTimerRef.current = setTimeout(() => {
        closeModal();
      }, 600);
    } catch (error) {
      console.error(error);
      toast.error("Ошибка отправки");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_0_0,_#f8f3eb_0%,_transparent_42%),radial-gradient(circle_at_90%_12%,_#ecd5bd_0%,_transparent_35%),#f3ede3] px-3 py-3 text-[#241f1a] [font-family:Manrope,sans-serif] md:px-6 md:py-5">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-[#d8cab8] bg-[linear-gradient(180deg,rgba(255,250,244,0.92),rgba(255,250,244,1))] shadow-[0_24px_44px_rgba(59,38,20,0.14)]">
        <div className="pointer-events-none absolute -right-28 -top-32 h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(228,176,149,0.38),transparent_70%)]" />
        <div className="pointer-events-none absolute -bottom-40 -left-24 h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(95,116,101,0.28),transparent_66%)]" />

        <header
          ref={headerRef}
          className="sticky top-0 z-40 border-b border-[#d8cab8cc] bg-[#fffaf4eb] px-3 py-2 backdrop-blur md:px-8 md:py-0"
        >
          <div className="flex items-center justify-between gap-3 md:gap-6">
            <a
              href="#"
              className="flex items-center"
              aria-label="Karina Yakimova — главная"
            >
              <svg
                width="520"
                height="120"
                viewBox="0 0 420 80"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-hidden="true"
                className="h-20 w-auto md:h-[120px]"
              >
                <style>{`
                  .ky-name { font-family: 'Cormorant Garamond', Cormorant, Georgia, serif; font-size: 22px; font-weight: 600; letter-spacing: 0.16em; fill: #2c1a0e; }
                  .ky-sub  { font-family: 'Cormorant Garamond', Cormorant, Georgia, serif; font-size: 9.5px; font-weight: 400; letter-spacing: 0.34em; fill: #5c3d2e; }
                  .ky-mono { font-family: 'Cormorant Garamond', Cormorant, Georgia, serif; font-size: 52px; font-weight: 400; fill: none; stroke: #7a3e1e; stroke-width: 1; dominant-baseline: central; }
                  .ky-mfill{ font-family: 'Cormorant Garamond', Cormorant, Georgia, serif; font-size: 52px; font-weight: 400; fill: #2c1a0e; opacity: 0.07; dominant-baseline: central; }
                  .ky-circ { stroke: #7a5c44; stroke-width: 0.7; fill: none; }
                  .ky-line { stroke: #7a5c44; stroke-width: 0.6; }
                  .ky-div  { stroke: #4a2e1a; stroke-width: 0.7; }
                `}</style>
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  className="ky-circ"
                  strokeDasharray="2 4"
                />
                <text className="ky-mfill" x="40" y="40" textAnchor="middle">
                  K
                </text>
                <text className="ky-mono" x="40" y="40" textAnchor="middle">
                  K
                </text>
                <circle cx="40" cy="3" r="2.2" fill="#7a3e1e" />
                <line className="ky-div" x1="84" y1="14" x2="84" y2="66" />
                <text className="ky-name" x="98" y="36">
                  KARINA YAKIMOVA
                </text>
                <line className="ky-line" x1="98" y1="48" x2="338" y2="48" />
                <text className="ky-sub" x="98" y="62">
                  ПСИХОЛОГ · КОУЧ
                </text>
              </svg>
            </a>

            <nav className="hidden flex-1 items-center justify-center gap-10 text-[15px] text-[#6d6157] md:flex">
              <a className="transition hover:text-[#241f1a]" href="#about">
                Обо мне
              </a>
              <a className="transition hover:text-[#241f1a]" href="#services">
                Услуги
              </a>
              <a className="transition hover:text-[#241f1a]" href="#process">
                Формат работы
              </a>
              <a className="transition hover:text-[#241f1a]" href="#contacts">
                Контакты
              </a>
            </nav>

            <button
              className="hidden rounded-full bg-[#bb6c45] px-4 py-2 text-sm font-bold text-white shadow-[0_10px_24px_rgba(187,108,69,0.3)] transition hover:-translate-y-0.5 hover:bg-[#a45c39] md:inline-flex"
              type="button"
              onClick={openModal}
            >
              Записаться
            </button>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d8cab8] text-[#5f7465] md:hidden"
              aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
              onClick={() => setIsMenuOpen((value) => !value)}
            >
              <span className="text-xl leading-none">
                {isMenuOpen ? "×" : "≡"}
              </span>
            </button>
          </div>

          <div className={`${isMenuOpen ? "block" : "hidden"} pt-2 md:hidden`}>
            <nav className="flex flex-col gap-2 pb-2 text-sm text-[#6d6157]">
              <a className="transition hover:text-[#241f1a]" href="#about">
                Обо мне
              </a>
              <a className="transition hover:text-[#241f1a]" href="#services">
                Услуги
              </a>
              <a className="transition hover:text-[#241f1a]" href="#process">
                Формат работы
              </a>
              <a className="transition hover:text-[#241f1a]" href="#contacts">
                Контакты
              </a>
              <button
                className="mt-1 w-max rounded-full bg-[#bb6c45] px-4 py-2 text-sm font-bold text-white shadow-[0_10px_24px_rgba(187,108,69,0.3)] transition hover:-translate-y-0.5 hover:bg-[#a45c39]"
                type="button"
                onClick={openModal}
              >
                Записаться
              </button>
            </nav>
          </div>
        </header>

        <main className="relative z-10 px-4 pb-5 pt-4 md:px-8 md:pb-6 md:pt-8">
          <div id="about" className="scroll-mt-28">
            <section className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[26px] border border-[#d8cab8f2] bg-[#fffdf8] p-5 md:p-9">
                <p className="inline-flex rounded-full bg-[#eaf0ea] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#5f7465]">
                  text
                </p>
                <h1
                  className={`${titleFont} mt-4 text-4xl leading-[1.04] md:text-6xl`}
                >
                  text
                </h1>
                <p className="mt-4 max-w-[46ch] text-[15px] leading-7 text-[#6d6157] md:text-base">
                  text
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <button
                    className="rounded-full bg-[#bb6c45] px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(187,108,69,0.36)] transition hover:-translate-y-0.5 hover:bg-[#a45c39]"
                    type="button"
                    onClick={openModal}
                  >
                    Начать
                  </button>
                  <a
                    className="text-sm font-bold text-[#5f7465]"
                    href="#services"
                  >
                    Смотреть услуги
                  </a>
                </div>

                <ul className="mt-5 flex flex-wrap gap-2">
                  <li className="rounded-full border border-dashed border-[#d8cab8] bg-[#fffaf4] px-3 py-1.5 text-sm text-[#6d6157]">
                    Онлайн и очно
                  </li>
                  <li className="rounded-full border border-dashed border-[#d8cab8] bg-[#fffaf4] px-3 py-1.5 text-sm text-[#6d6157]">
                    Индивидуальные сессии
                  </li>
                  <li className="rounded-full border border-dashed border-[#d8cab8] bg-[#fffaf4] px-3 py-1.5 text-sm text-[#6d6157]">
                    Гибкий график
                  </li>
                </ul>
              </div>

              <aside className="rounded-[26px] border border-[#d8cab8f2] bg-[linear-gradient(165deg,#fff6ec,#fffdf8)] p-5 md:p-8">
                <div className="mb-4 grid h-48 place-items-center rounded-2xl border border-dashed border-[#c8b29c] bg-[#fff7ef] text-sm font-semibold text-[#9a6f56] md:h-56">
                  Фото
                </div>
                <p className="inline-flex rounded-full bg-[#eaf0ea] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#5f7465]">
                  text
                </p>
                <h2 className={`${titleFont} mt-4 text-3xl leading-tight`}>
                  Коротко о вас
                </h2>
                <p className="mt-3 text-[15px] leading-7 text-[#6d6157] md:text-base">
                  text
                </p>
                <p className={`${titleFont} mt-6 text-3xl text-[#bb6c45]`}>
                  text
                </p>
              </aside>
            </section>
          </div>

          <section className="mt-6">
            <div className="px-1 pb-3">
              <p className="inline-flex rounded-full bg-[#eaf0ea] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#5f7465]">
                Фото
              </p>
              <h2
                className={`${titleFont} mt-3 text-3xl leading-tight md:text-5xl`}
              >
                Места для изображений
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="grid h-44 place-items-center rounded-[26px] border border-dashed border-[#c8b29c] bg-[#fff7ef] text-sm font-semibold text-[#9a6f56] md:h-52">
                Фото 
              </div>
              <div className="grid h-44 place-items-center rounded-[26px] border border-dashed border-[#c8b29c] bg-[#fff7ef] text-sm font-semibold text-[#9a6f56] md:h-52">
                Фото 
              </div>
              <div className="grid h-44 place-items-center rounded-[26px] border border-dashed border-[#c8b29c] bg-[#fff7ef] text-sm font-semibold text-[#9a6f56] md:h-52">
                Фото
              </div>
            </div>
          </section>

          <div id="services" className="mt-6 scroll-mt-28">
            <section>
              <div className="px-1 pb-3">
                <p className="inline-flex rounded-full bg-[#eaf0ea] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#5f7465]">
                  Услуги
                </p>
                <h2
                  className={`${titleFont} mt-3 text-3xl leading-tight md:text-5xl`}
                >
                  С чем вы помогаете
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {services.map((item, index) => (
                  <article
                    key={index}
                    className="rounded-[26px] border border-[#d8cab8f2] bg-[#fffdf8] p-5"
                  >
                    <span className="mb-4 inline-block h-[18px] w-[18px] rounded-full bg-[linear-gradient(145deg,#e4b095,#bb6c45)]" />
                    <h3 className={`${titleFont} text-2xl`}>
                      Услуга 0{index + 1}
                    </h3>
                    <p className="mt-2 text-[15px] leading-7 text-[#6d6157] md:text-base">
                      {item}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <div id="process" className="mt-6 scroll-mt-28">
            <section>
              <div className="px-1 pb-3">
                <p className="inline-flex rounded-full bg-[#eaf0ea] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#5f7465]">
                  Процесс
                </p>
                <h2
                  className={`${titleFont} mt-3 text-3xl leading-tight md:text-5xl`}
                >
                  Как проходит работа
                </h2>
              </div>

              <ol className="grid gap-4 md:grid-cols-3">
                {steps.map((step, index) => (
                  <li
                    key={index}
                    className="rounded-[26px] border border-[#d8cab8f2] bg-[#fffdf8] p-5"
                  >
                    <h3 className={`${titleFont} text-2xl`}>Шаг {index + 1}</h3>
                    <p className="mt-2 text-[15px] leading-7 text-[#6d6157] md:text-base">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <section className="mt-6">
            <div className="px-1 pb-3">
              <p className="inline-flex rounded-full bg-[#eaf0ea] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#5f7465]">
                Отзывы
              </p>
              <h2
                className={`${titleFont} mt-3 text-3xl leading-tight md:text-5xl`}
              >
                Что говорят клиенты
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {reviews.map((review, index) => (
                <figure
                  key={index}
                  className="m-0 rounded-[26px] border border-[#d8cab8f2] bg-[#fffdf8] p-5"
                >
                  <div className="mb-4 grid h-20 w-20 place-items-center rounded-2xl border border-dashed border-[#c8b29c] bg-[#fff7ef] text-xs font-semibold text-[#9a6f56]">
                    Фото
                  </div>
                  <blockquote
                    className={`${titleFont} text-[30px] leading-tight`}
                  >
                    &quot;{review}&quot;
                  </blockquote>
                  <figcaption className="mt-4 text-sm text-[#6d6157]">
                    Имя клиента, контекст
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        </main>

        <div id="contacts" className="scroll-mt-28">
          <section className="relative z-10 mx-4 mt-1 grid gap-3 rounded-[26px] border border-[#d8cab8f2] bg-[linear-gradient(130deg,#fff9f2_0%,#f1ebdf_100%)] p-5 md:mx-8 md:p-6">
            <p className="inline-flex w-max rounded-full bg-[#eaf0ea] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#5f7465]">
              Контакты
            </p>
            <h2 className={`${titleFont} text-3xl leading-tight md:text-4xl`}>
              Готовы записаться?
            </h2>
            <p className="text-[15px] leading-7 text-[#6d6157] md:text-base">
              Укажите контакты и условия работы.
            </p>
            <button
              className="w-max rounded-full bg-[#bb6c45] px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(187,108,69,0.36)] transition hover:-translate-y-0.5 hover:bg-[#a45c39]"
              type="button"
              onClick={openModal}
            >
              Оставить заявку
            </button>
          </section>
        </div>

        <footer className="relative z-10 flex flex-col gap-1 px-4 py-5 text-sm text-[#6d6157] md:flex-row md:justify-between md:px-8 md:py-7">
          <p>Имя, психолог</p>
        </footer>
      </div>

      <div
        className={`fixed inset-0 z-50 grid place-items-center transition ${
          isModalOpen
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0"
        }`}
        {...(isModalOpen ? { "aria-hidden": false } : {})}
      >
        <div
          className="absolute inset-0 bg-[rgba(18,14,10,0.58)] backdrop-blur-[3px]"
          onClick={closeModal}
        />

        <div
          className="relative z-10 mx-4 w-full max-w-[560px] rounded-[22px] border border-[#d8cab8] bg-[#fffaf5] p-5 shadow-[0_24px_44px_rgba(59,38,20,0.14)]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-title"
        >
          <button
            className="absolute right-2 top-2 h-8 w-8 rounded-full border border-[#d8cab8] bg-white text-lg leading-none text-[#6d6157]"
            type="button"
            aria-label="Закрыть"
            onClick={closeModal}
          >
            ×
          </button>

          <p className="inline-flex rounded-full bg-[#eaf0ea] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#5f7465]">
            Обратная связь
          </p>
          <h2 id="feedback-title" className={`${titleFont} mt-3 text-3xl`}>
            Оставьте заявку
          </h2>
          <p className="mt-2 text-sm text-[#6d6157]">Заполните поля</p>

          <form className="mt-4 grid gap-3" onSubmit={handleSubmit} noValidate>
            <label className="grid gap-1 text-sm text-[#6d6157]">
              Имя
              <input
                ref={nameInputRef}
                type="text"
                name="name"
                required
                placeholder="Ваше имя"
                className="w-full rounded-xl border border-[#d8cab8] bg-white px-3 py-2 text-[#241f1a] outline-none ring-[#5f746559] transition focus:ring-2"
              />
            </label>

            <label className="grid gap-1 text-sm text-[#6d6157]">
              Контакт
              <input
                type="text"
                name="contact"
                required
                placeholder="Телефон или @username"
                className="w-full rounded-xl border border-[#d8cab8] bg-white px-3 py-2 text-[#241f1a] outline-none ring-[#5f746559] transition focus:ring-2"
              />
            </label>

            <label className="grid gap-1 text-sm text-[#6d6157]">
              Сообщение
              <textarea
                name="message"
                rows="4"
                required
                placeholder="Коротко опишите запрос"
                className="w-full rounded-xl border border-[#d8cab8] bg-white px-3 py-2 text-[#241f1a] outline-none ring-[#5f746559] transition focus:ring-2"
              ></textarea>
            </label>

            <button
              className="mt-1 w-max rounded-full bg-[#bb6c45] px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(187,108,69,0.36)] transition hover:-translate-y-0.5 hover:bg-[#a45c39] disabled:cursor-default disabled:opacity-70 disabled:shadow-none disabled:hover:translate-y-0"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Отправляем..." : "Отправить"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
