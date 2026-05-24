const normalizeTelegramError = (description = "") => {
  const normalized = String(description).toLowerCase();

  if (normalized.includes("chat not found")) {
    return "Telegram: чат не найден. Проверьте TELEGRAM_CHAT_ID и отправьте /start вашему боту.";
  }

  if (normalized.includes("can't send messages to the bot")) {
    return "Telegram: бот не может писать самому себе. Укажите chat id пользователя, группы или канала, а не id бота.";
  }

  return description || "Telegram не принял сообщение. Проверьте токен и chat id.";
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    res.status(200).json({
      ok: false,
      error: "Не настроены TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID на сервере.",
      code: "config_error",
    });
    return;
  }

  const name = String(req.body?.name || "").trim();
  const contact = String(req.body?.contact || "").trim();
  const message = String(req.body?.message || "").trim();
  const page = String(req.body?.page || "").trim();

  if (!name || !contact || !message) {
    res.status(200).json({
      ok: false,
      error: "Заполните обязательные поля формы.",
      code: "validation_error",
    });
    return;
  }

  const text = [
    "Новая заявка с сайта",
    "",
    `Имя: ${name}`,
    `Контакт: ${contact}`,
    `Сообщение: ${message}`,
    page ? `Страница: ${page}` : "",
    `Время: ${new Date().toLocaleString("ru-RU")}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          disable_web_page_preview: true,
        }),
      },
    );

    const telegramResult = await telegramResponse.json();

    if (!telegramResponse.ok || !telegramResult.ok) {
      res.status(200).json({
        ok: false,
        error: normalizeTelegramError(telegramResult?.description),
        code: "telegram_rejected",
      });
      return;
    }

    res.status(200).json({ ok: true });
  } catch {
    res.status(200).json({
      ok: false,
      error: "Ошибка подключения к Telegram API. Попробуйте позже.",
      code: "telegram_unreachable",
    });
  }
}
