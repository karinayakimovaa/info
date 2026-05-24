<<<<<<< HEAD
export const translations = {
  ru: {
    locale: "ru",
    htmlLang: "ru",
    nav: {
      about: "Обо мне",
      services: "Услуги",
      process: "Формат",
      processLong: "Формат работы",
      pricing: "Стоимость",
      contacts: "Контакты",
      book: "Записаться",
      openMenu: "Открыть меню",
      closeMenu: "Закрыть меню",
    },
    hero: {
      tag: "Практикующий психолог",
      title1: "Опора и ясность —",
      title2: "шаг за шагом",
      desc: "Помогаю справляться с повседневными трудностями, находить опору и понимать себя. Студентка 4 курса по направлению «Кризисная психология и медиация в образовании».",
      cta: "Записаться",
      seeServices: "Смотреть услуги",
      pills: ["Яндекс Телемост", "Индивидуально", "Разово или длительно"],
      cardLabel: "Бережное сопровождение",
      cardQuote1: "Рядом в том темпе,",
      cardQuote2: "который вам доступен",
    },
    mood: {
      label: "Настроение",
      title1: "Пространство ",
      title2: "для себя",
    },
    services: {
      label: "Услуги",
      title1: "С чем ",
      title2: "я работаю",
      items: [
        {
          title: "Поиск себя и своего пути",
          description: "Когда сложно понять, чего вы хотите, и куда двигаться дальше.",
          num: "01",
        },
        {
          title: "Самооценка и принятие себя",
          description: "Опора во внутреннем диалоге: меньше самокритики, больше поддержки к себе.",
          num: "02",
        },
        {
          title: "Тревога и стресс",
          description: "Разбираем перегрузку, тревожные сценарии и то, что мешает жить спокойнее.",
          num: "03",
        },
        {
          title: "Конфликты и отношения",
          description: "Понятнее про границы, ожидания и то, как говорить и слышать друг друга.",
          num: "04",
        },
      ],
    },
    process: {
      label: "Процесс",
      title1: "Как мы будем ",
      title2: "работать",
      steps: [
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
      ],
    },
    trust: {
      label: "Доверие",
      title1: "Важно ",
      title2: "знать",
      bodyHtml: (
        <>
          Я сама регулярно прохожу <strong>личную терапию</strong> и работаю с
          <strong> супервизором</strong> — это моя профессиональная этика и залог качества вашей поддержки.
        </>
      ),
    },
    pricing: {
      label: "Оплата",
      title1: "Запись и ",
      title2: "оплата",
      cardLabel: "Информация",
      cardTitle: "Оплата",
      cardNote:
        "Фиксированной стоимости нет — сколько желаете и можете. Оплата производится до начала сессии посредством банковского перевода по номеру телефона или номеру карты. Подробная информация о минимальной стоимости сеанса представлена на странице записи по ссылке.",
      bookLabel: "Онлайн-запись",
      bookCta: "Перейти →",
      bookNote: "Нажмите, чтобы перейти к записи и оплате.",
    },
    contacts: {
      label: "Контакты",
      title1: "Записаться",
      title2: "или ",
      title3: "задать вопрос",
      sub: "Напишите примерный запрос — обсудим формат и сможем ли поработать вместе.",
      connect: "Связаться",
      tgChannel: "Telegram-канал",
      vkCommunity: "Сообщество ВКонтакте",
      tgFallback: "Telegram — по этому же номеру.",
      submitReq: "✉️ Оставить заявку",
    },
    footer: "Карина Якимова · Практикующий психолог · Онлайн",
    modal: {
      label: "Обратная связь",
      title: "Оставьте заявку",
      sub: "Укажите имя, контакт и кратко ваш запрос — отвечу после записи.",
      name: "Имя",
      namePh: "Ваше имя",
      contact: "Контакт",
      contactPh: "Телефон или @username",
      message: "Сообщение",
      messagePh: "Коротко опишите запрос",
      submit: "Отправить заявку",
      submitting: "Отправляем…",
      close: "Закрыть",
      requestHeader: "Новая заявка",
      errEmpty: "Заполните все поля.",
      errBot: "Telegram bot не настроен.",
      ok: "Заявка отправлена",
      err: "Ошибка отправки",
    },
    langToggle: "EN",
  },

  en: {
    locale: "en",
    htmlLang: "en",
    nav: {
      about: "About",
      services: "Services",
      process: "Format",
      processLong: "How we work",
      pricing: "Pricing",
      contacts: "Contacts",
      book: "Book a session",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    hero: {
      tag: "Practicing psychologist",
      title1: "Support and clarity —",
      title2: "step by step",
      desc: "I help with everyday difficulties, finding inner support and understanding yourself. 4th-year student majoring in “Crisis psychology and mediation in education”.",
      cta: "Book a session",
      seeServices: "See services",
      pills: ["Yandex Telemost", "One-on-one", "One-off or ongoing"],
      cardLabel: "Gentle guidance",
      cardQuote1: "Walking with you",
      cardQuote2: "at your own pace",
    },
    mood: {
      label: "Mood",
      title1: "Space ",
      title2: "for yourself",
    },
    services: {
      label: "Services",
      title1: "What I ",
      title2: "work with",
      items: [
        {
          title: "Finding yourself and your path",
          description: "When it’s hard to understand what you want and where to go next.",
          num: "01",
        },
        {
          title: "Self-esteem and self-acceptance",
          description: "Support in your inner dialogue: less self-criticism, more kindness to yourself.",
          num: "02",
        },
        {
          title: "Anxiety and stress",
          description: "We work through overwhelm, anxious scenarios and what gets in the way of calm.",
          num: "03",
        },
        {
          title: "Conflicts and relationships",
          description: "More clarity about boundaries, expectations and how to speak and truly hear one another.",
          num: "04",
        },
      ],
    },
    process: {
      label: "Process",
      title1: "How we’ll ",
      title2: "work together",
      steps: [
        {
          title: "Platform",
          body: "Online via Yandex Telemost — easy to join, confidential, no app installation required.",
        },
        {
          title: "First contact",
          body: "Send a short description of your request — we’ll see if I can help and if this format suits you.",
        },
        {
          title: "Your own pace",
          body: "A one-off consultation or ongoing therapy — we choose the depth and rhythm together.",
        },
      ],
    },
    trust: {
      label: "Trust",
      title1: "Good to ",
      title2: "know",
      bodyHtml: (
        <>
          I regularly attend <strong>personal therapy</strong> and work with a
          <strong> supervisor</strong> — this is my professional ethics and the foundation of quality support for you.
        </>
      ),
    },
    pricing: {
      label: "Payment",
      title1: "Booking & ",
      title2: "payment",
      cardLabel: "Information",
      cardTitle: "Payment",
      cardNote:
        "There is no fixed fee — pay what you wish and can afford. Payment is made before the session by bank transfer to a phone number or card. Details on the minimum session fee are on the booking page.",
      bookLabel: "Online booking",
      bookCta: "Open →",
      bookNote: "Click to proceed to booking and payment.",
    },
    contacts: {
      label: "Contacts",
      title1: "Book a session",
      title2: "or ",
      title3: "ask a question",
      sub: "Send a short description of your request — we’ll discuss the format and whether we’re a good fit.",
      connect: "Get in touch",
      tgChannel: "Telegram channel",
      vkCommunity: "VK community",
      tgFallback: "Telegram — at the same number.",
      submitReq: "✉️ Send a request",
    },
    footer: "Karina Yakimova · Practicing psychologist · Online",
    modal: {
      label: "Get in touch",
      title: "Send a request",
      sub: "Please share your name, contact and a brief request — I’ll reply after booking.",
      name: "Name",
      namePh: "Your name",
      contact: "Contact",
      contactPh: "Phone or @username",
      message: "Message",
      messagePh: "Briefly describe your request",
      submit: "Send request",
      submitting: "Sending…",
      close: "Close",
      requestHeader: "New request",
      errEmpty: "Please fill in all fields.",
      errBot: "Telegram bot is not configured.",
      ok: "Request sent",
      err: "Failed to send",
    },
    langToggle: "RU",
  },
};
=======
export const translations = {
  ru: {
    locale: "ru",
    htmlLang: "ru",
    nav: {
      about: "Обо мне",
      services: "Услуги",
      process: "Формат",
      processLong: "Формат работы",
      pricing: "Стоимость",
      contacts: "Контакты",
      book: "Записаться",
      openMenu: "Открыть меню",
      closeMenu: "Закрыть меню",
    },
    hero: {
      tag: "Практикующий психолог",
      title1: "Опора и ясность —",
      title2: "шаг за шагом",
      desc: "Помогаю справляться с повседневными трудностями, находить опору и понимать себя. Студентка 4 курса по направлению «Кризисная психология и медиация в образовании».",
      cta: "Записаться",
      seeServices: "Смотреть услуги",
      pills: ["Яндекс Телемост", "Индивидуально", "Разово или длительно"],
      cardLabel: "Бережное сопровождение",
      cardQuote1: "Рядом в том темпе,",
      cardQuote2: "который вам доступен",
    },
    mood: {
      label: "Настроение",
      title1: "Пространство ",
      title2: "для себя",
    },
    services: {
      label: "Услуги",
      title1: "С чем ",
      title2: "я работаю",
      items: [
        {
          title: "Поиск себя и своего пути",
          description: "Когда сложно понять, чего вы хотите, и куда двигаться дальше.",
          num: "01",
        },
        {
          title: "Самооценка и принятие себя",
          description: "Опора во внутреннем диалоге: меньше самокритики, больше поддержки к себе.",
          num: "02",
        },
        {
          title: "Тревога и стресс",
          description: "Разбираем перегрузку, тревожные сценарии и то, что мешает жить спокойнее.",
          num: "03",
        },
        {
          title: "Конфликты и отношения",
          description: "Понятнее про границы, ожидания и то, как говорить и слышать друг друга.",
          num: "04",
        },
      ],
    },
    process: {
      label: "Процесс",
      title1: "Как мы будем ",
      title2: "работать",
      steps: [
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
      ],
    },
    trust: {
      label: "Доверие",
      title1: "Важно ",
      title2: "знать",
      bodyHtml: (
        <>
          Я сама регулярно прохожу <strong>личную терапию</strong> и работаю с
          <strong> супервизором</strong> — это моя профессиональная этика и залог качества вашей поддержки.
        </>
      ),
    },
    pricing: {
      label: "Оплата",
      title1: "Запись и ",
      title2: "оплата",
      cardLabel: "Информация",
      cardTitle: "Оплата",
      cardNote:
        "Фиксированной стоимости нет — сколько желаете и можете. Оплата производится до начала сессии посредством банковского перевода по номеру телефона или номеру карты. Подробная информация о минимальной стоимости сеанса представлена на странице записи по ссылке.",
      bookLabel: "Онлайн-запись",
      bookCta: "Перейти →",
      bookNote: "Нажмите, чтобы перейти к записи и оплате.",
    },
    contacts: {
      label: "Контакты",
      title1: "Записаться",
      title2: "или ",
      title3: "задать вопрос",
      sub: "Напишите примерный запрос — обсудим формат и сможем ли поработать вместе.",
      connect: "Связаться",
      tgChannel: "Telegram-канал",
      vkCommunity: "Сообщество ВКонтакте",
      tgFallback: "Telegram — по этому же номеру.",
      submitReq: "✉️ Оставить заявку",
    },
    footer: "Карина Якимова · Практикующий психолог · Онлайн",
    modal: {
      label: "Обратная связь",
      title: "Оставьте заявку",
      sub: "Укажите имя, контакт и кратко ваш запрос — отвечу после записи.",
      name: "Имя",
      namePh: "Ваше имя",
      contact: "Контакт",
      contactPh: "Телефон или @username",
      message: "Сообщение",
      messagePh: "Коротко опишите запрос",
      submit: "Отправить заявку",
      submitting: "Отправляем…",
      close: "Закрыть",
      requestHeader: "Новая заявка",
      errEmpty: "Заполните все поля.",
      errBot: "Telegram bot не настроен.",
      ok: "Заявка отправлена",
      err: "Ошибка отправки",
    },
    langToggle: "EN",
  },

  en: {
    locale: "en",
    htmlLang: "en",
    nav: {
      about: "About",
      services: "Services",
      process: "Format",
      processLong: "How we work",
      pricing: "Pricing",
      contacts: "Contacts",
      book: "Book a session",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    hero: {
      tag: "Practicing psychologist",
      title1: "Support and clarity —",
      title2: "step by step",
      desc: "I help with everyday difficulties, finding inner support and understanding yourself. 4th-year student majoring in “Crisis psychology and mediation in education”.",
      cta: "Book a session",
      seeServices: "See services",
      pills: ["Yandex Telemost", "One-on-one", "One-off or ongoing"],
      cardLabel: "Gentle guidance",
      cardQuote1: "Walking with you",
      cardQuote2: "at your own pace",
    },
    mood: {
      label: "Mood",
      title1: "Space ",
      title2: "for yourself",
    },
    services: {
      label: "Services",
      title1: "What I ",
      title2: "work with",
      items: [
        {
          title: "Finding yourself and your path",
          description: "When it’s hard to understand what you want and where to go next.",
          num: "01",
        },
        {
          title: "Self-esteem and self-acceptance",
          description: "Support in your inner dialogue: less self-criticism, more kindness to yourself.",
          num: "02",
        },
        {
          title: "Anxiety and stress",
          description: "We work through overwhelm, anxious scenarios and what gets in the way of calm.",
          num: "03",
        },
        {
          title: "Conflicts and relationships",
          description: "More clarity about boundaries, expectations and how to speak and truly hear one another.",
          num: "04",
        },
      ],
    },
    process: {
      label: "Process",
      title1: "How we’ll ",
      title2: "work together",
      steps: [
        {
          title: "Platform",
          body: "Online via Yandex Telemost — easy to join, confidential, no app installation required.",
        },
        {
          title: "First contact",
          body: "Send a short description of your request — we’ll see if I can help and if this format suits you.",
        },
        {
          title: "Your own pace",
          body: "A one-off consultation or ongoing therapy — we choose the depth and rhythm together.",
        },
      ],
    },
    trust: {
      label: "Trust",
      title1: "Good to ",
      title2: "know",
      bodyHtml: (
        <>
          I regularly attend <strong>personal therapy</strong> and work with a
          <strong> supervisor</strong> — this is my professional ethics and the foundation of quality support for you.
        </>
      ),
    },
    pricing: {
      label: "Payment",
      title1: "Booking & ",
      title2: "payment",
      cardLabel: "Information",
      cardTitle: "Payment",
      cardNote:
        "There is no fixed fee — pay what you wish and can afford. Payment is made before the session by bank transfer to a phone number or card. Details on the minimum session fee are on the booking page.",
      bookLabel: "Online booking",
      bookCta: "Open →",
      bookNote: "Click to proceed to booking and payment.",
    },
    contacts: {
      label: "Contacts",
      title1: "Book a session",
      title2: "or ",
      title3: "ask a question",
      sub: "Send a short description of your request — we’ll discuss the format and whether we’re a good fit.",
      connect: "Get in touch",
      tgChannel: "Telegram channel",
      vkCommunity: "VK community",
      tgFallback: "Telegram — at the same number.",
      submitReq: "✉️ Send a request",
    },
    footer: "Karina Yakimova · Practicing psychologist · Online",
    modal: {
      label: "Get in touch",
      title: "Send a request",
      sub: "Please share your name, contact and a brief request — I’ll reply after booking.",
      name: "Name",
      namePh: "Your name",
      contact: "Contact",
      contactPh: "Phone or @username",
      message: "Message",
      messagePh: "Briefly describe your request",
      submit: "Send request",
      submitting: "Sending…",
      close: "Close",
      requestHeader: "New request",
      errEmpty: "Please fill in all fields.",
      errBot: "Telegram bot is not configured.",
      ok: "Request sent",
      err: "Failed to send",
    },
    langToggle: "RU",
  },
};
>>>>>>> b46cee1ecea512b185b547bd2e00dec3055b81ad
