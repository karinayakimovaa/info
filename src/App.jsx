import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const services = [
  "Краткое описание услуги.",
  "Краткое описание услуги.",
  "Краткое описание услуги.",
];

const steps = ["text", "text", "text"];

const reviews = [
  "Короткая цитата клиента.",
  "Еще одна короткая цитата.",
];

const titleFont = "[font-family:'Cormorant_Garamond',serif]";

const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

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
        target.getBoundingClientRect().top +
        window.scrollY -
        headerOffset;

      window.scrollTo({
        top,
        behavior: "smooth",
      });

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

    if (
      !payload.name ||
      !payload.contact ||
      !payload.message
    ) {
      toast.error("Заполните все поля.");
      return;
    }

    if (!botToken || !chatId) {
      toast.error(
        "Telegram bot не настроен."
      );

      console.error(
        "Missing env variables:",
        {
          VITE_TELEGRAM_BOT_TOKEN: !!botToken,
          VITE_TELEGRAM_CHAT_ID: !!chatId,
        }
      );

      return;
    }

    setIsSubmitting(true);

    const text = [
      "Новая заявка",
      "",
      `Имя: ${payload.name}`,
      `Контакт: ${payload.contact}`,
      `Сообщение: ${payload.message}`,
      `Страница: ${payload.page}`,
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
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
          body,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        console.error(
          "Telegram API Error:",
          errorText
        );

        throw new Error(
          "Ошибка Telegram API"
        );
      }

      toast.success("Заявка отправлена");

      form.reset();

      closeTimerRef.current = setTimeout(() => {
        closeModal();
      }, 600);
    } catch (error) {
      console.error(error);

      toast.error(
        "Ошибка отправки. Попробуйте позже."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_0_0,_#f8f3eb_0%,_transparent_42%),radial-gradient(circle_at_90%_12%,_#ecd5bd_0%,_transparent_35%),#f3ede3] px-3 py-3 text-[#241f1a] [font-family:Manrope,sans-serif] md:px-6 md:py-5">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-[#d8cab8] bg-[linear-gradient(180deg,rgba(255,250,244,0.92),rgba(255,250,244,1))] shadow-[0_24px_44px_rgba(59,38,20,0.14)]">

        <header
          ref={headerRef}
          className="sticky top-0 z-40 border-b border-[#d8cab8cc] bg-[#fffaf4eb] px-3 py-2 backdrop-blur md:px-8 md:py-0"
        >
          <div className="flex items-center justify-between gap-3 md:gap-6">

            <a
              href="#"
              className="flex items-center"
            >
              <span
                className={`${titleFont} text-2xl`}
              >
                KARINA YAKIMOVA
              </span>
            </a>

            <nav className="hidden flex-1 items-center justify-center gap-10 text-[15px] text-[#6d6157] md:flex">
              <a href="#about">
                Обо мне
              </a>

              <a href="#services">
                Услуги
              </a>

              <a href="#process">
                Формат работы
              </a>

              <a href="#contacts">
                Контакты
              </a>
            </nav>

            <button
              className="hidden rounded-full bg-[#bb6c45] px-4 py-2 text-sm font-bold text-white md:inline-flex"
              type="button"
              onClick={openModal}
            >
              Записаться
            </button>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d8cab8] md:hidden"
              onClick={() =>
                setIsMenuOpen(
                  (value) => !value
                )
              }
            >
              <span className="text-xl leading-none">
                {isMenuOpen ? "×" : "≡"}
              </span>
            </button>
          </div>
        </header>

        <main className="relative z-10 px-4 pb-5 pt-4 md:px-8 md:pb-6 md:pt-8">

          <section id="about">
            <h1
              className={`${titleFont} text-4xl md:text-6xl`}
            >
              text
            </h1>
          </section>

          <section
            id="services"
            className="mt-10"
          >
            <div className="grid gap-4 md:grid-cols-3">
              {services.map((item, index) => (
                <article
                  key={index}
                  className="rounded-[26px] border border-[#d8cab8f2] bg-[#fffdf8] p-5"
                >
                  <h3
                    className={`${titleFont} text-2xl`}
                  >
                    Услуга 0{index + 1}
                  </h3>

                  <p className="mt-2 text-[#6d6157]">
                    {item}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section
            id="process"
            className="mt-10"
          >
            <ol className="grid gap-4 md:grid-cols-3">
              {steps.map((step, index) => (
                <li
                  key={index}
                  className="rounded-[26px] border border-[#d8cab8f2] bg-[#fffdf8] p-5"
                >
                  <h3
                    className={`${titleFont} text-2xl`}
                  >
                    Шаг {index + 1}
                  </h3>

                  <p className="mt-2 text-[#6d6157]">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-10">
            <div className="grid gap-4 md:grid-cols-2">
              {reviews.map((review, index) => (
                <figure
                  key={index}
                  className="rounded-[26px] border border-[#d8cab8f2] bg-[#fffdf8] p-5"
                >
                  <blockquote
                    className={`${titleFont} text-[30px] leading-tight`}
                  >
                    "{review}"
                  </blockquote>
                </figure>
              ))}
            </div>
          </section>
        </main>

        <section
          id="contacts"
          className="mx-4 mb-6 rounded-[26px] border border-[#d8cab8f2] bg-[#fff9f2] p-5 md:mx-8"
        >
          <button
            className="rounded-full bg-[#bb6c45] px-5 py-2.5 text-sm font-bold text-white"
            type="button"
            onClick={openModal}
          >
            Оставить заявку
          </button>
        </section>
      </div>

      <div
        className={`fixed inset-0 z-50 grid place-items-center transition ${
          isModalOpen
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0"
        }`}
      >
        <div
          className="absolute inset-0 bg-[rgba(18,14,10,0.58)]"
          onClick={closeModal}
        />

        <div
          className="relative z-10 mx-4 w-full max-w-[560px] rounded-[22px] border border-[#d8cab8] bg-[#fffaf5] p-5"
        >
          <button
            className="absolute right-2 top-2 h-8 w-8 rounded-full border border-[#d8cab8]"
            type="button"
            onClick={closeModal}
          >
            ×
          </button>

          <h2
            className={`${titleFont} mt-3 text-3xl`}
          >
            Оставьте заявку
          </h2>

          <form
            className="mt-4 grid gap-3"
            onSubmit={handleSubmit}
            noValidate
          >
            <input
              ref={nameInputRef}
              type="text"
              name="name"
              required
              placeholder="Ваше имя"
              className="w-full rounded-xl border border-[#d8cab8] bg-white px-3 py-2"
            />

            <input
              type="text"
              name="contact"
              required
              placeholder="Телефон или Telegram"
              className="w-full rounded-xl border border-[#d8cab8] bg-white px-3 py-2"
            />

            <textarea
              name="message"
              rows="4"
              required
              placeholder="Коротко опишите запрос"
              className="w-full rounded-xl border border-[#d8cab8] bg-white px-3 py-2"
            />

            <button
              className="mt-1 w-max rounded-full bg-[#bb6c45] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-70"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Отправляем..."
                : "Отправить"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}