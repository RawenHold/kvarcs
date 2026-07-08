import { NextResponse } from "next/server";

export const runtime = "nodejs";

type TelegramPayload = {
  name?: unknown;
  phone?: unknown;
  comment?: unknown;
  selectedStone?: unknown;
  lang?: unknown;
};

const toCleanString = (value: unknown, maxLength = 1000) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

async function resolveChatId(token: string) {
  const configuredChatId = process.env.TELEGRAM_CHAT_ID;
  if (configuredChatId) return configuredChatId;

  const updatesResponse = await fetch(`https://api.telegram.org/bot${token}/getUpdates`, {
    cache: "no-store"
  });

  if (!updatesResponse.ok) return "";

  const data = (await updatesResponse.json()) as {
    ok?: boolean;
    result?: Array<{
      message?: { chat?: { id?: number | string } };
      channel_post?: { chat?: { id?: number | string } };
    }>;
  };

  const updates = data.result ?? [];
  for (let index = updates.length - 1; index >= 0; index -= 1) {
    const chatId = updates[index]?.message?.chat?.id ?? updates[index]?.channel_post?.chat?.id;
    if (chatId) return String(chatId);
  }

  return "";
}

export async function POST(request: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    return NextResponse.json({ error: "Telegram token is not configured" }, { status: 503 });
  }

  let payload: TelegramPayload;

  try {
    payload = (await request.json()) as TelegramPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = toCleanString(payload.name, 120);
  const phone = toCleanString(payload.phone, 80);
  const comment = toCleanString(payload.comment, 1200);
  const selectedStone = toCleanString(payload.selectedStone, 160);
  const lang = toCleanString(payload.lang, 12);

  if (!name || !phone) {
    return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
  }

  const chatId = await resolveChatId(token);

  if (!chatId) {
    return NextResponse.json(
      { error: "Telegram chat is not configured. Send any message to the bot or set TELEGRAM_CHAT_ID." },
      { status: 503 }
    );
  }

  const text = [
    "Новая заявка с kvarcs.uz",
    "",
    `Имя: ${name}`,
    `Телефон: ${phone}`,
    selectedStone ? `Коллекция: ${selectedStone}` : "",
    comment ? `Комментарий: ${comment}` : "",
    lang ? `Язык сайта: ${lang}` : "",
    `Дата: ${new Date().toLocaleString("ru-RU", { timeZone: "Asia/Tashkent" })}`
  ]
    .filter(Boolean)
    .join("\n");

  const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: chatId,
      text
    })
  });

  if (!telegramResponse.ok) {
    const errorText = await telegramResponse.text();
    console.error("Telegram sendMessage failed", telegramResponse.status, errorText.slice(0, 200));
    return NextResponse.json({ error: "Failed to send message" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
