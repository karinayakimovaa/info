import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const port = Number(process.env.API_PORT || process.env.PORT || 8787);

app.use(express.json({ limit: "200kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/feedback", async (req, res) => {
  const fail = (error, code = "unknown_error") =>
    res.json({ ok: false, error, code });
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    fail(
      "Не настроены TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID на сервере.",
      "config_error",
    );
    return;
  }

  const name = String(req.body?.name || "").trim();
  const contact = String(req.body?.contact || "").trim();
  const message = String(req.body?.message || "").trim();
  const page = String(req.body?.page || "").trim();

  if (!name || !contact || !message) {
    fail("Заполните обязательные поля формы.", "validation_error");
    return;
  }

  const text = [
    "Новая заявка",
    "",
    `Имя: ${name}`,
    `Контакт: ${contact}`,
    `Сообщение: ${message}`,
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
      const description = String(telegramResult?.description || "");
      const normalized = description.toLowerCase();
      const chatNotFound = normalized.includes("chat not found");
      const cantSendToBot = normalized.includes(
        "can't send messages to the bot",
      );

      fail(
        chatNotFound
          ? "Telegram: чат не найден. Проверьте TELEGRAM_CHAT_ID и отправьте /start вашему боту."
          : cantSendToBot
            ? "Telegram: бот не может писать самому себе. Укажите chat id пользователя, группы или канала, а не id бота."
            : description ||
              "Telegram не принял сообщение. Проверьте токен и chat id.",
        "telegram_rejected",
      );
      return;
    }

    res.json({ ok: true });
  } catch {
    fail(
      "Ошибка подключения к Telegram API. Попробуйте позже.",
      "telegram_unreachable",
    );
  }
});

app.listen(port, () => {
  console.log(`Feedback API listening on http://localhost:${port}`);
});
