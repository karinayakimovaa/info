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
    body: "Онлайн через приложение Яндекс Телемост -  просто, конфиденциально и не требует установки приложения",
  },
  {
    title: "Первый контакт",
    body: "Напишите примерный запрос: обсудим мой формат и поймем, подходим ли друг другу.",
  },
  {
    title: "Комфортный темп — ваш",
    body: "Разовая консультация или длительная работа: глубину и ритм выбираем вместе.",
  },
];

const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
const telegramUsername = String(import.meta.env.VITE_TELEGRAM_USERNAME || "")
  .trim()
  .replace(/^@+/, "");

/* tiny hook: fade-in on scroll */
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

/* reusable atoms */
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
      "inline-flex items-center gap-1.5 bg-copper text-white border-0 cursor-pointer font-sans text-[13px] font-medium tracking-[0.06em] px-6 py-2.5 rounded-full no-underline shadow-[0_10px_28px_rgba(95,149,181,0.28)] transition-[background,transform,box-shadow] duration-200 hover:bg-copper2 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(95,149,181,0.38)] active:translate-y-0 disabled:opacity-65 " +
      className
    }
  />
);

/* ── Idea 3: Decorative divider ── */
const Divider = () => (
  <div className='flex items-center gap-4 py-1'>
    <div className='flex-1 h-px bg-gradient-to-r from-transparent via-[rgba(137,174,197,0.5)] to-transparent' />
    <div className='flex items-center gap-[7px]'>
      <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(137,174,197,0.38)]' />
      <span className='block w-[7px] h-[7px] rotate-45 bg-[rgba(137,174,197,0.46)]' />
      <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(137,174,197,0.38)]' />
    </div>
    <div className='flex-1 h-px bg-gradient-to-r from-transparent via-[rgba(137,174,197,0.5)] to-transparent' />
  </div>
);

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const nameInputRef = useRef(null);
  const closeTimerRef = useRef(null);
  const headerRef = useRef(null);

  useFadeIn();
  const showStickyBtn = useStickyButton();

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

      toast.success("Заявка отправлена");
      e.target.reset();
      closeTimerRef.current = setTimeout(closeModal, 600);
    } catch (error) {
      toast.error(error?.message || "Ошибка отправки");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* HEADER */}
      <header
        ref={headerRef}
        className='sticky top-0 z-50 border-b border-[rgba(137,174,197,0.24)] bg-[rgba(247,251,254,0.9)] backdrop-blur-md'
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
              alt=''
              decoding='async'
              className='block h-16 w-auto max-w-full md:h-[90px]'
            />
          </a>

          <nav
            aria-label='Основная навигация'
            className='hidden lg:flex items-center justify-center gap-1 xl:gap-2'
          >
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
                className='inline-flex h-11 items-center justify-center rounded-full px-4 xl:px-5 text-[13px] tracking-[0.04em] text-sub no-underline transition-[color,background-color] hover:bg-white/70 hover:text-ink'
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
            onClick={() => setIsMenuOpen((v) => !v)}
            className='flex h-[42px] w-[42px] items-center justify-center rounded-lg border-[1.5px] border-warm bg-transparent text-xl leading-none text-ink cursor-pointer lg:hidden'
          >
            {isMenuOpen ? "×" : "☰"}
          </button>
        </div>
      </header>

      {/* mobile nav */}
      {isMenuOpen && (
        <div className='lg:hidden flex flex-col gap-4 px-[18px] py-5 bg-ice border-b border-[rgba(137,174,197,0.24)]'>
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
        {/* HERO */}
        <div className='max-w-[1180px] mx-auto px-[18px] md:px-10'>
          <section
            id='about'
            className='grid grid-cols-1 md:grid-cols-[1fr_420px] gap-10 md:gap-14 items-center py-[52px] md:py-[80px_70px] [scroll-margin-top:124px]'
          >
            <div data-fade>
              <p className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-mist bg-powder/95 px-3.5 py-[5px] rounded-full mb-6 before:content-[''] before:w-2 before:h-2 before:rounded-full before:bg-[#8ccdf2] before:animate-pulse before:shadow-[0_0_0_4px_rgba(140,205,242,0.28),0_0_12px_rgba(140,205,242,0.62)] before:shrink-0">
                Практикующий психолог
              </p>
              <h1 className='font-serif font-normal text-[clamp(52px,7vw,88px)] leading-none -tracking-[0.01em] text-bark [&_em]:italic [&_em]:text-copper'>
                Опора и ясность —<br />
                <em>шаг за шагом</em>
              </h1>
              <p className='mt-6 text-base leading-[1.8] text-sub max-w-[44ch]'>
                Меня зовут Карина Якимова. Я практикующий психолог помогаю
                справляться с повседневными трудностями, находить опору и
                понимать себя.».
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
                    className='text-xs text-sub border border-sky/70 rounded-full px-3.5 py-[5px] bg-white/72'
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Idea 5: Quote badge on hero card ── */}
            <div
              data-fade
              data-delay='2'
              className='animate-[heroFloat_7s_ease-in-out_infinite]'
            >
              <div className='relative overflow-visible rounded-[28px] border border-[rgba(159,199,220,0.38)] bg-[linear-gradient(155deg,#fcfeff_0%,#eef7fd_46%,#dcecf7_100%)] shadow-[0_30px_80px_rgba(95,149,181,0.16)] before:absolute before:inset-0 before:rounded-[28px] before:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.84),transparent_45%)] before:pointer-events-none'>
                <div className='overflow-hidden rounded-t-[28px]'>
                  <img
                    src={asset("photos/yoga-sunrise.png")}
                    alt=''
                    className='block w-full h-[260px] object-cover scale-[1.02] transition-transform duration-[6000ms] hover:scale-[1.06]'
                  />
                </div>
                {/* Quote badge */}

                <div className='px-7 pt-6 pb-7'>
                  <SectionLabel>Бережное сопровождение</SectionLabel>
                  <p className='font-serif italic text-[28px] font-normal text-mist2 leading-[1.35] mt-2.5'>
                    Рядом в комфортном,
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
          <section className='py-16 border-t border-[rgba(137,174,197,0.2)] mt-8'>
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
                  className='block w-full h-[220px] object-cover rounded-[20px] shadow-[0_18px_45px_rgba(95,149,181,0.16)]'
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── Idea 3: Decorative divider ── */}
        <div className='max-w-[1180px] mx-auto px-[18px] md:px-10'>
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
            {/* ── Idea 2: Watermark number on hover ── */}
            <div
              data-fade
              data-delay='1'
              className='grid grid-cols-1 sm:grid-cols-2 mt-11 rounded-[24px] overflow-hidden border-[1.5px] border-[rgba(137,174,197,0.34)] divide-y divide-[rgba(137,174,197,0.3)] sm:divide-y-0 sm:[&>article]:border-r-[1.5px] sm:[&>article]:border-[rgba(137,174,197,0.3)] sm:[&>article:nth-child(2n)]:border-r-0 sm:[&>article:nth-child(-n+2)]:border-b-[1.5px]'
            >
              {services.map((item) => (
                <article
                  key={item.title}
                  className='group px-8 pt-8 pb-9 bg-[linear-gradient(180deg,#fdfefe_0%,#edf6fc_100%)] transition-colors hover:bg-white relative overflow-hidden'
                >
                  {/* Watermark */}
                  <span
                    aria-hidden='true'
                    className='absolute right-[-8px] bottom-[-18px] font-serif font-bold text-[110px] leading-none text-mist/[0.08] pointer-events-none select-none transition-[transform,color] duration-300 group-hover:scale-110 group-hover:-translate-y-1.5 group-hover:text-mist/[0.12]'
                  >
                    {item.num}
                  </span>
                  <p className='font-serif text-[13px] tracking-[0.18em] text-mist relative z-10'>
                    {item.num}
                  </p>
                  <h3 className='font-serif text-[26px] font-medium text-bark mt-2 leading-[1.25] relative z-10'>
                    {item.title}
                  </h3>
                  <p className='text-sm leading-[1.75] text-sub mt-3 relative z-10'>
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* ── Idea 3: Decorative divider ── */}
        <div className='max-w-[1180px] mx-auto px-[18px] md:px-10'>
          <Divider />
        </div>

        {/* PROCESS */}
        <div className='max-w-[1180px] mx-auto px-[18px] md:px-10'>
          <section id='process' className='py-16 [scroll-margin-top:124px]'>
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
                  className='grid grid-cols-[48px_1fr] gap-6 py-7 border-b border-[rgba(137,174,197,0.2)] items-start first:border-t first:border-[rgba(137,174,197,0.2)]'
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

        {/* TRUST */}
        <div className='max-w-[1180px] mx-auto px-[18px] md:px-10'>
          <section className='py-16 border-t border-[rgba(137,174,197,0.2)]'>
            <div data-fade>
              <SectionLabel>Доверие</SectionLabel>
              <SectionH2 className='mb-7'>
                Важно <em>знать</em>
              </SectionH2>
              <div className='flex flex-col sm:flex-row items-start gap-5 sm:gap-10 p-9 sm:p-[52px_56px] rounded-[24px] border border-[rgba(159,199,220,0.34)] bg-[linear-gradient(130deg,#fbfdff_0%,#eaf4fb_58%,#d8eaf5_100%)]'>
                <div className='shrink-0 w-12 h-12 rounded-xl bg-mist text-white flex items-center justify-center text-[22px]'>
                  ✓
                </div>
                <p className='text-base leading-[1.8] text-sub [&_strong]:text-bark [&_strong]:font-medium'>
                  Я сама регулярно прохожу <strong>личную терапию</strong> и
                  работаю с <strong>супервизором</strong> — это моя
                  профессиональная этика и залог качества вашей поддержки.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* ── Idea 3: Decorative divider ── */}
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
                className='bg-[linear-gradient(180deg,#fcfeff_0%,#edf6fc_100%)] border-[1.5px] border-[rgba(159,199,220,0.34)] rounded-[20px] p-8 pb-9'
              >
                <p className='text-xs tracking-[0.12em] uppercase text-mist'>
                  Информация
                </p>
                <p className='font-serif text-[52px] font-normal text-bark leading-none mt-3 mb-1'>
                  Оплата
                </p>
                <p className='text-sm leading-[1.7] text-sub mt-3.5'>
                  Фиксированной стоимости нет — сколько желаете и можете. Оплата
                  производится до начала сессии банковским переводом по номеру
                  телефона или карты. Подробная информация о минимальной
                  стоимости сеанса есть на странице записи по ссылке.
                </p>
              </div>

              <a
                href='https://vk.cc/cXJ3c3'
                target='_blank'
                rel='noopener noreferrer'
                data-fade
                data-delay='2'
                className='border-[1.5px] border-[rgba(159,199,220,0.34)] rounded-[20px] p-8 pb-9 no-underline text-inherit bg-[linear-gradient(150deg,#fcfeff,#edf6fc,#d9ebf6)]'
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

        {/* CONTACTS */}
        <div className='max-w-[1180px] mx-auto px-[18px] md:px-10'>
          <section
            id='contacts'
            className='pt-16 pb-20 border-t border-[rgba(137,174,197,0.2)] [scroll-margin-top:124px]'
          >
            <div
              data-fade
              className='grid grid-cols-1 md:grid-cols-2 gap-9 md:gap-12 items-start bg-[linear-gradient(145deg,#27475f_0%,#335f7b_46%,#78accd_100%)] rounded-[28px] p-9 sm:p-[56px_60px]'
            >
              <div>
                <div className='mb-3.5 flex items-center gap-3'>
                  <p className='inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-cream/40 before:block before:w-5 before:h-px before:bg-cream/40'>
                    Контакты
                  </p>
                  <span
                    aria-hidden='true'
                    className='grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/10 text-lg'
                  >
                    🌿
                  </span>
                </div>
                <h2 className='font-serif font-normal text-[clamp(32px,4.5vw,52px)] leading-[1.08] text-cream [&_em]:italic [&_em]:text-[#dff2ff]'>
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
                    <span aria-hidden='true'>☏</span>
                    <span>Телефон:</span> {phoneDisplay}
                  </a>
                  {telegramUsername ? (
                    <a
                      href={`https://t.me/${telegramUsername}`}
                      target='_blank'
                      rel='noreferrer'
                      className='inline-flex items-center gap-2.5 text-sm font-medium text-cream no-underline bg-white/[0.08] border border-white/[0.14] rounded-full px-5 py-3 transition-colors hover:bg-white/[0.14] w-fit'
                    >
                      <span>Telegram:</span> @{telegramUsername}
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
                    className='inline-flex items-center gap-2.5 text-sm font-medium text-[#dff2ff] bg-white/[0.08] border-[1.5px] border-[#dff2ff]/50 rounded-full px-5 py-3 transition-colors hover:bg-white/[0.14] cursor-pointer w-fit'
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
      <footer className='border-t border-[rgba(137,174,197,0.2)] py-[22px] md:py-7 px-[18px] md:px-10 flex flex-col md:flex-row gap-1.5 md:gap-0 justify-between items-center text-center md:text-left text-xs text-warm tracking-[0.06em]'>
        <p>Карина Якимова · Практикующий психолог · Онлайн</p>
        <p className='text-[11px]'>© {new Date().getFullYear()}</p>
      </footer>

      {/* ── Idea 4: Sticky CTA button ── */}
      <button
        type='button'
        onClick={openModal}
        aria-label='Записаться'
        className={
          "fixed bottom-6 right-6 z-40 inline-flex items-center gap-2.5 bg-copper text-white font-sans text-[13px] font-medium tracking-[0.05em] pl-5 pr-4 py-3 rounded-full shadow-[0_10px_30px_rgba(95,149,181,0.42)] transition-[opacity,transform,box-shadow] duration-300 hover:bg-copper2 hover:shadow-[0_14px_38px_rgba(95,149,181,0.52)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer " +
          (showStickyBtn
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none")
        }
      >
        Записаться
        <span className='flex items-center justify-center w-[22px] h-[22px] rounded-full bg-white/20 text-[11px]'>
          ↑
        </span>
      </button>

      {/* MODAL */}
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}
        aria-hidden={!isModalOpen}
        className={
          "fixed inset-0 z-[100] grid place-items-center bg-[rgba(26,52,69,0.52)] backdrop-blur-[4px] transition-[opacity,visibility] duration-300 " +
          (isModalOpen ? "opacity-100 visible" : "opacity-0 invisible")
        }
      >
        <div
          role='dialog'
          aria-modal='true'
          aria-labelledby='modal-title'
          className={
            "relative z-[1] bg-[linear-gradient(180deg,#fcfeff_0%,#edf6fc_100%)] border border-[rgba(159,199,220,0.34)] rounded-[24px] p-10 pb-11 w-[min(540px,calc(100vw-36px))] shadow-[0_32px_64px_rgba(63,111,141,0.22)] transition-transform duration-300 " +
            (isModalOpen ? "translate-y-0" : "translate-y-4")
          }
        >
          <button
            type='button'
            aria-label='Закрыть'
            onClick={closeModal}
            className='absolute top-3.5 right-3.5 w-8 h-8 rounded-full border border-sky/65 bg-white cursor-pointer text-lg leading-none text-sub flex items-center justify-center transition-colors hover:bg-powder'
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
                  className='w-full px-4 py-2.5 border-[1.5px] border-sky/65 rounded-xl bg-white font-sans text-sm text-ink outline-none transition-[border-color,box-shadow] duration-200 focus:border-mist focus:shadow-[0_0_0_3px_rgba(111,154,180,0.18)]'
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
                className='w-full px-4 py-2.5 border-[1.5px] border-sky/65 rounded-xl bg-white font-sans text-sm text-ink outline-none transition-[border-color,box-shadow] duration-200 resize-y min-h-[100px] focus:border-mist focus:shadow-[0_0_0_3px_rgba(111,154,180,0.18)]'
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
