/**
 * https://github.com/cvzi/telegram-bot-cloudflare
 */

import { FetchEvent } from "@cloudflare/workers-types";

export interface Env {
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
  SECRET: string;
}

// const TOKEN: string = TELEGRAM_BOT_TOKEN; // Get it from @BotFather https://core.telegram.org/bots#6-botfather
const WEBHOOK: string = "/endpoint";
// const SECRET: string = "123"; // A-Z, a-z, 0-9, _ and -

/**
 * Wait for requests to the worker
 */
addEventListener(
  "fetch",
  ({ event, env, ctx }: { event: any; env: Env; ctx: any }) => {
    const { TELEGRAM_BOT_TOKEN, SECRET } = env as Env;
    const url: URL = new URL(event.request.url);
    if (url.pathname === WEBHOOK) {
      event.respondWith(handleWebhook(event));
    } else if (url.pathname === "/registerWebhook") {
      event.respondWith(registerWebhook(event, url, WEBHOOK, SECRET));
    } else if (url.pathname === "/unRegisterWebhook") {
      event.respondWith(unRegisterWebhook(event));
    } else {
      event.respondWith(new Response("No handler for this request"));
    }
  }
);

/**
 * Handle requests to WEBHOOK
 * https://core.telegram.org/bots/api#update
 */
async function handleWebhook(event: any): Promise<Response> {
  const { SECRET } = event.env as Env;
  // Check secret
  if (event.request.headers.get("X-Telegram-Bot-Api-Secret-Token") !== SECRET) {
    return new Response("Unauthorized", { status: 403 });
  }

  // Read request body synchronously
  const update: any = await event.request.json();
  // Deal with response asynchronously
  event.waitUntil(onUpdate(update));

  return new Response("Ok");
}

/**
 * Handle incoming Update
 * https://core.telegram.org/bots/api#update
 */
async function onUpdate(update) {
  if ("message" in update) {
    await onMessage(update.message);
  }
}

/**
 * Handle incoming Message
 * https://core.telegram.org/bots/api#message
 */
function onMessage(message) {
  return sendPlainText(message.chat.id, "Echo:\n" + message.text);
}

/**
 * Send plain text message
 * https://core.telegram.org/bots/api#sendmessage
 */
async function sendPlainText(chatId: string, text: string): Promise<any> {
  return (
    await fetch(
      apiUrl("sendMessage", {
        chat_id: chatId,
        text,
      })
    )
  ).json();
}

/**
 * Set webhook to this worker's url
 * https://core.telegram.org/bots/api#setwebhook
 */
async function registerWebhook(event, requestUrl, suffix, secret) {
  // https://core.telegram.org/bots/api#setwebhook
  const webhookUrl = `${requestUrl.protocol}//${requestUrl.hostname}${suffix}`;
  const r = await (
    await fetch(apiUrl("setWebhook", { url: webhookUrl, secret_token: secret }))
  ).json();
  return new Response("ok" in r && r.ok ? "Ok" : JSON.stringify(r, null, 2));
}

/**
 * Remove webhook
 * https://core.telegram.org/bots/api#setwebhook
 */
async function unRegisterWebhook(event) {
  const r = await (await fetch(apiUrl("setWebhook", { url: "" }))).json();
  return new Response("ok" in r && r.ok ? "Ok" : JSON.stringify(r, null, 2));
}

/**
 * Return url to telegram api, optionally with parameters added
 */
function apiUrl(
  methodName: string,
  params: { [key: string]: string } | null = null
) {
  let query = "";
  if (params) {
    query = "?" + new URLSearchParams(params).toString();
  }
  return `https://api.telegram.org/bot${TOKEN}/${methodName}${query}`;
}
