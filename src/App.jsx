import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaTelegramPlane, FaVk } from "react-icons/fa";

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

/* ─── reusable atoms ─── */
const SectionLabel = ({ children, className = "" }) => (
  <p
    className={
      "inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-mist mb-3.5 before:block before:w-5 before:h-px before:bg-mist " +
      className
    }
  >
    {children}
  </p>
);

const SectionH2 = ({ children, className = "" }) => (
  <h2
    className={
      "font-serif font-normal text-[clamp(36px,5vw,58px)] leading-[1.06] text-bark [&_em]:italic [&_em]:text-copper " +
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
      "inline-flex items-center gap-1.5 bg-copper text-white border-0 cursor-pointer font-sans text-[13px] font-medium tracking-[0.06em] px-6 py-2.5 rounded-full no-underline shadow-[0_6px_22px_rgba(181,98,46,0.28)] transition-[background,transform,box-shadow] duration-200 hover:bg-copper2 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(181,98,46,0.38)] active:translate-y-0 disabled:opacity-65 " +
      className
    }
  />
);

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const nameInputRef = useRef(null);
  const closeTimerRef = useRef(null);
  const headerRef = useRef(null);

  useFadeIn();

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
      {/* ── HEADER ── */}
      <header
        ref={headerRef}
        className='sticky top-0 z-50 flex items-center justify-between h-[98px] md:h-[118px] px-[18px] md:px-10 bg-cream/90 backdrop-blur-md border-b border-[rgba(180,156,130,0.28)]'
      >
        <a
          href='#'
          aria-label='Карина Якимова — главная'
          className='flex items-center min-w-0 mr-2 leading-none no-underline'
        >
          <img
            src={asset("logo.svg")}
            width='682'
            height='182'
            alt=''
            decoding='async'
            className='block h-16 md:h-[90px] w-auto max-w-[calc(100vw-92px)] md:max-w-[min(100%,720px)]'
          />
        </a>

        <nav aria-label='Основная навигация' className='hidden lg:flex gap-9'>
          {[
            ["#about", "Обо мне"],
            ["#services", "Услуги"],
            ["#process", "Формат"],
            ["#pricing", "Стоимость"],
            ["#contacts", "Контакты"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className='text-[13px] tracking-[0.04em] text-sub no-underline transition-colors hover:text-ink'
            >
              {label}
            </a>
          ))}
        </nav>

        <BtnPrimary
          onClick={openModal}
          type='button'
          className='hidden lg:inline-flex'
        >
          Записаться
        </BtnPrimary>

        <button
          type='button'
          aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setIsMenuOpen((v) => !v)}
          className='lg:hidden flex items-center justify-center w-[42px] h-[42px] rounded-lg border-[1.5px] border-warm bg-transparent text-ink text-xl leading-none cursor-pointer'
        >
          {isMenuOpen ? "×" : "≡"}
        </button>
      </header>

      {/* mobile nav */}
      {isMenuOpen && (
        <div className='lg:hidden flex flex-col gap-4 px-[18px] py-5 bg-cream border-b border-[rgba(180,156,130,0.28)]'>
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
              className='text-[15px] text-sub no-underline'
            >
              {label}
            </a>
          ))}
          <BtnPrimary type='button' onClick={openModal} className='w-fit mt-1'>
            Записаться
          </BtnPrimary>
        </div>
      )}
      <main>
        {/* ── HERO ── */}
        <div className='max-w-[1180px] mx-auto px-[18px] md:px-10'>
          <section
            id='about'
            className='grid grid-cols-1 md:grid-cols-[1fr_420px] gap-10 md:gap-14 items-center py-[52px] md:py-[80px_70px] [scroll-margin-top:124px]'
          >
            <div data-fade>
              <p className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-mist bg-mist/10 px-3.5 py-[5px] rounded-full mb-6 before:content-[''] before:w-2 before:h-2 before:rounded-full before:bg-[#4ade80] before:animate-pulse before:shadow-[0_0_0_4px_rgba(74,222,128,0.35),0_0_12px_rgba(74,222,128,0.9)] before:shrink-0">
                Практикующий психолог
              </p>
              <h1 className='font-serif font-normal text-[clamp(52px,7vw,88px)] leading-none -tracking-[0.01em] text-bark [&_em]:italic [&_em]:text-copper'>
                Опора и ясность —<br />
                <em>шаг за шагом</em>
              </h1>
              <p className='mt-6 text-base leading-[1.8] text-sub max-w-[44ch]'>
                Помогаю справляться с повседневными трудностями, находить опору
                и понимать себя. Студентка 4 курса по направлению «Кризисная
                психология и медиация в образовании».
              </p>
              <div className='mt-9 flex items-center gap-5 flex-wrap'>
                <BtnPrimary type='button' onClick={openModal}>
                  Записаться
                </BtnPrimary>
                <a
                  href='#services'
                  className='text-[13px] font-medium tracking-[0.04em] text-mist no-underline border-b border-current pb-px transition-colors hover:text-mist2'
                >
                  Смотреть услуги
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
                    className='text-xs text-sub border border-warm rounded-full px-3.5 py-[5px] bg-white/55'
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <div
              data-fade
              data-delay='2'
              className='animate-[heroFloat_7s_ease-in-out_infinite]'
            >
              <div className='relative overflow-hidden rounded-[28px] border border-[rgba(180,156,130,0.45)] bg-[linear-gradient(155deg,#fff8f0_0%,#f4ede1_100%)] shadow-[0_30px_80px_rgba(90,70,50,0.12)] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.7),transparent_45%)] before:pointer-events-none'>
                <img
                  src={asset("photos/yoga-sunrise.png")}
                  alt=''
                  className='block w-full h-[260px] object-cover scale-[1.02] transition-transform duration-[6000ms] hover:scale-[1.06]'
                />
                <div className='px-7 pt-6 pb-7'>
                  <SectionLabel>Бережное сопровождение</SectionLabel>
                  <p className='font-serif italic text-[28px] font-normal text-copper leading-[1.35] mt-2.5'>
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
        <div className='max-w-[1180px] mx-auto px-[18px] md:px-10'>
          <section className='py-16 border-t border-[rgba(180,156,130,0.22)]'>
            <div data-fade>
              <SectionLabel>Настроение</SectionLabel>
              <SectionH2>
                Пространство <em>для себя</em>
              </SectionH2>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-[18px] mt-9'>
              {[
                "photos/meadow.png",
                "photos/lake-quote.png",
                "photos/yoga-sunrise.png",
              ].map((src, i) => (
                <div key={src} data-fade data-delay={String(i + 1)}>
                  <img
                    src={asset(src)}
                    alt=''
                    className='block w-full h-[220px] object-cover rounded-[20px]'
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── SERVICES ── */}
        <div className='max-w-[1180px] mx-auto px-[18px] md:px-10'>
          <section
            id='services'
            className='py-16 border-t border-[rgba(180,156,130,0.22)] [scroll-margin-top:124px]'
          >
            <div data-fade>
              <SectionLabel>Услуги</SectionLabel>
              <SectionH2>
                С чем <em>я работаю</em>
              </SectionH2>
            </div>
            <div
              data-fade
              data-delay='1'
              className='grid grid-cols-1 sm:grid-cols-2 mt-11 rounded-[24px] overflow-hidden border-[1.5px] border-[rgba(180,156,130,0.35)] divide-y divide-[rgba(180,156,130,0.35)] sm:divide-y-0 sm:[&>article]:border-r-[1.5px] sm:[&>article]:border-[rgba(180,156,130,0.35)] sm:[&>article:nth-child(2n)]:border-r-0 sm:[&>article:nth-child(-n+2)]:border-b-[1.5px]'
            >
              {services.map((item) => (
                <article
                  key={item.title}
                  className='px-8 pt-8 pb-9 bg-[#fdfaf6] transition-colors hover:bg-white relative'
                >
                  <p className='font-serif text-[13px] tracking-[0.18em] text-warm'>
                    {item.num}
                  </p>
                  <h3 className='font-serif text-[26px] font-medium text-bark mt-2 leading-[1.25]'>
                    {item.title}
                  </h3>
                  <p className='text-sm leading-[1.75] text-sub mt-3'>
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* ── PROCESS ── */}
        <div className='max-w-[1180px] mx-auto px-[18px] md:px-10'>
          <section
            id='process'
            className='py-16 border-t border-[rgba(180,156,130,0.22)] [scroll-margin-top:124px]'
          >
            <div data-fade>
              <SectionLabel>Процесс</SectionLabel>
              <SectionH2>
                Как мы будем <em>работать</em>
              </SectionH2>
            </div>
            <ol className='flex flex-col mt-11 list-none p-0'>
              {steps.map((step, i) => (
                <li
                  key={step.title}
                  data-fade
                  data-delay={String(i + 1)}
                  className='grid grid-cols-[48px_1fr] gap-6 py-7 border-b border-[rgba(180,156,130,0.22)] items-start first:border-t first:border-[rgba(180,156,130,0.22)]'
                >
                  <span className='font-serif text-[40px] font-light text-copper/20 leading-none'>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className='font-serif text-[22px] font-medium text-bark mb-2'>
                      {step.title}
                    </p>
                    <p className='text-[15px] leading-[1.75] text-sub'>
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* ── TRUST ── */}
        <div className='max-w-[1180px] mx-auto px-[18px] md:px-10'>
          <section className='py-16 border-t border-[rgba(180,156,130,0.22)]'>
            <div data-fade>
              <SectionLabel>Доверие</SectionLabel>
              <SectionH2 className='mb-7'>
                Важно <em>знать</em>
              </SectionH2>
              <div className='flex flex-col sm:flex-row items-start gap-5 sm:gap-10 p-9 sm:p-[52px_56px] rounded-[24px] border border-[rgba(180,156,130,0.38)] bg-[linear-gradient(130deg,#f8efe2_0%,#ede6d9_100%)]'>
                <div className='shrink-0 w-12 h-12 rounded-xl bg-copper flex items-center justify-center text-[22px]'>
                  🌿
                </div>
                <p className='text-base leading-[1.8] text-sub [&_strong]:text-bark [&_strong]:font-medium'>
                  Я сама регулярно прохожу <strong>личную терапию</strong> и
                  работаю с<strong> супервизором</strong> — это моя
                  профессиональная этика и залог качества вашей поддержки.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* ── PRICING ── */}
        <div className='max-w-[1180px] mx-auto px-[18px] md:px-10'>
          <section
            id='pricing'
            className='py-16 border-t border-[rgba(180,156,130,0.22)] [scroll-margin-top:124px]'
          >
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
                className='bg-[#fdfaf6] border-[1.5px] border-[rgba(180,156,130,0.35)] rounded-[20px] p-8 pb-9'
              >
                <p className='text-xs tracking-[0.12em] uppercase text-mist'>
                  Информация
                </p>
                <p className='font-serif text-[52px] font-normal text-bark leading-none mt-3 mb-1'>
                  Оплата
                </p>
                <p className='text-sm leading-[1.7] text-sub mt-3.5'>
                  Фиксированной стоимости нет — сколько желаете и можете. Оплата
                  производится до начала сессии посредством банковского перевода
                  по номеру телефона или номеру карты. Подробная информация о
                  минимальной стоимости сеанса представлена на странице записи
                  по ссылке.
                </p>
              </div>

              <a
                href='https://vk.cc/cXJ3c3'
                target='_blank'
                rel='noopener noreferrer'
                data-fade
                data-delay='2'
                className='border-[1.5px] border-[rgba(180,156,130,0.35)] rounded-[20px] p-8 pb-9 no-underline text-inherit bg-[linear-gradient(150deg,#f3ebe0,#ede4d5)]'
              >
                <p className='text-xs tracking-[0.12em] uppercase text-mist'>
                  Онлайн-запись
                </p>
                <p className='font-serif text-[36px] font-normal text-bark leading-none mt-3.5 mb-1'>
                  Перейти →
                </p>
                <p className='text-sm leading-[1.7] text-sub mt-3.5'>
                  Нажмите, чтобы перейти к записи и оплате.
                </p>
              </a>
            </div>
          </section>
        </div>

        {/* ── CONTACTS ── */}
        <div className='max-w-[1180px] mx-auto px-[18px] md:px-10'>
          <section
            id='contacts'
            className='pt-16 pb-20 border-t border-[rgba(180,156,130,0.22)] [scroll-margin-top:124px]'
          >
            <div
              data-fade
              className='grid grid-cols-1 md:grid-cols-2 gap-9 md:gap-12 items-start bg-bark rounded-[28px] p-9 sm:p-[56px_60px]'
            >
              <div>
                <p className='inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-cream/40 mb-3.5 before:block before:w-5 before:h-px before:bg-cream/40'>
                  Контакты
                </p>
                <h2 className='font-serif font-normal text-[clamp(32px,4.5vw,52px)] leading-[1.08] text-cream [&_em]:italic [&_em]:text-[#e4a97a]'>
                  Записаться
                  <br />
                  или <em>задать вопрос</em>
                </h2>
                <p className='text-[15px] leading-[1.8] text-cream/60 mt-4'>
                  Напишите примерный запрос — обсудим формат и сможем ли
                  поработать вместе.
                </p>
              </div>
              <div>
                <p className='text-xs tracking-[0.14em] uppercase text-cream/40 mb-3.5'>
                  Связаться
                </p>
                <div className='flex flex-col gap-3.5'>
                  <a
                    href={`tel:${phoneTel}`}
                    className='inline-flex items-center gap-2.5 text-sm font-medium text-cream no-underline bg-white/[0.08] border border-white/[0.14] rounded-full px-5 py-3 transition-colors hover:bg-white/[0.14] cursor-pointer w-fit'
                  >
                    <span>📞</span> {phoneDisplay}
                  </a>
                  {telegramUsername ? (
                    <a
                      href={`https://t.me/${telegramUsername}`}
                      target='_blank'
                      rel='noreferrer'
                      className='inline-flex items-center gap-2.5 text-sm font-medium text-cream no-underline bg-white/[0.08] border border-white/[0.14] rounded-full px-5 py-3 transition-colors hover:bg-white/[0.14] w-fit'
                    >
                      <span>✈️</span> @{telegramUsername}
                    </a>
                  ) : (
                    <span className='text-[13px] text-cream/45'>
                      Telegram — по этому же номеру.
                    </span>
                  )}
                  <a
                    href='https://t.me/krnykmva'
                    target='_blank'
                    rel='noreferrer'
                    className='inline-flex items-center gap-2.5 text-sm font-medium text-cream no-underline bg-white/[0.08] border border-white/[0.14] rounded-full px-5 py-3 transition-colors hover:bg-white/[0.14] w-fit'
                  >
                    <FaTelegramPlane className='text-[16px] shrink-0' />
                    Telegram-канал
                  </a>
                  <a
                    href='https://vk.ru/krnykmvapsy'
                    target='_blank'
                    rel='noreferrer'
                    className='inline-flex items-center gap-2.5 text-sm font-medium text-cream no-underline bg-white/[0.08] border border-white/[0.14] rounded-full px-5 py-3 transition-colors hover:bg-white/[0.14] w-fit'
                  >
                    <FaVk className='text-[16px] shrink-0' />
                    Сообщество ВКонтакте
                  </a>
                  <button
                    type='button'
                    onClick={openModal}
                    className='inline-flex items-center gap-2.5 text-sm font-medium text-[#e4a97a] bg-white/[0.08] border-[1.5px] border-[#e4a97a]/50 rounded-full px-5 py-3 transition-colors hover:bg-white/[0.14] cursor-pointer w-fit'
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
      <footer className='border-t border-[rgba(180,156,130,0.22)] py-[22px] md:py-7 px-[18px] md:px-10 flex flex-col md:flex-row gap-1.5 md:gap-0 justify-between items-center text-center md:text-left text-xs text-warm tracking-[0.06em]'>
        <p>Карина Якимова · Практикующий психолог · Онлайн</p>
        <p className='text-[11px]'>© {new Date().getFullYear()}</p>
      </footer>

      {/* ── MODAL ── */}
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}
        aria-hidden={!isModalOpen}
        className={
          "fixed inset-0 z-[100] grid place-items-center bg-[rgba(18,12,6,0.62)] backdrop-blur-[4px] transition-[opacity,visibility] duration-300 " +
          (isModalOpen ? "opacity-100 visible" : "opacity-0 invisible")
        }
      >
        <div
          role='dialog'
          aria-modal='true'
          aria-labelledby='modal-title'
          className={
            "relative z-[1] bg-[#fdfaf6] border border-[rgba(180,156,130,0.45)] rounded-[24px] p-10 pb-11 w-[min(540px,calc(100vw-36px))] shadow-[0_32px_64px_rgba(30,18,8,0.22)] transition-transform duration-300 " +
            (isModalOpen ? "translate-y-0" : "translate-y-4")
          }
        >
          <button
            type='button'
            aria-label='Закрыть'
            onClick={closeModal}
            className='absolute top-3.5 right-3.5 w-8 h-8 rounded-full border border-sand bg-white cursor-pointer text-lg leading-none text-sub flex items-center justify-center transition-colors hover:bg-sand'
          >
            ×
          </button>

          <SectionLabel>Обратная связь</SectionLabel>
          <h2
            id='modal-title'
            className='font-serif text-4xl font-normal text-bark mt-2.5'
          >
            Оставьте заявку
          </h2>
          <p className='text-[13px] leading-[1.7] text-sub mt-1.5'>
            Укажите имя, контакт и кратко ваш запрос — отвечу после записи.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {[
              {
                id: "f-name",
                label: "Имя",
                name: "name",
                type: "text",
                placeholder: "Ваше имя",
                ref: nameInputRef,
              },
              {
                id: "f-contact",
                label: "Контакт",
                name: "contact",
                type: "text",
                placeholder: "Телефон или @username",
              },
            ].map((f) => (
              <div key={f.id} className='flex flex-col gap-1.5 mt-4.5'>
                <label
                  htmlFor={f.id}
                  className='text-xs font-medium tracking-[0.08em] uppercase text-sub'
                >
                  {f.label}
                </label>
                <input
                  id={f.id}
                  ref={f.ref}
                  type={f.type}
                  name={f.name}
                  required
                  placeholder={f.placeholder}
                  className='w-full px-4 py-2.5 border-[1.5px] border-sand rounded-xl bg-white font-sans text-sm text-ink outline-none transition-[border-color,box-shadow] duration-200 focus:border-mist focus:shadow-[0_0_0_3px_rgba(95,116,100,0.14)]'
                />
              </div>
            ))}
            <div className='flex flex-col gap-1.5 mt-4.5'>
              <label
                htmlFor='f-message'
                className='text-xs font-medium tracking-[0.08em] uppercase text-sub'
              >
                Сообщение
              </label>
              <textarea
                id='f-message'
                name='message'
                rows='4'
                required
                placeholder='Коротко опишите запрос'
                className='w-full px-4 py-2.5 border-[1.5px] border-sand rounded-xl bg-white font-sans text-sm text-ink outline-none transition-[border-color,box-shadow] duration-200 resize-y min-h-[100px] focus:border-mist focus:shadow-[0_0_0_3px_rgba(95,116,100,0.14)]'
              />
            </div>
            <BtnPrimary type='submit' disabled={isSubmitting} className='mt-5'>
              {isSubmitting ? "Отправляем…" : "Отправить заявку"}
            </BtnPrimary>
          </form>
        </div>
      </div>
    </>
  );
}
