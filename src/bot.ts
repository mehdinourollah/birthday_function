import { Env } from "./Env";
import { setBirthday, getAllBirthdays, deleteBirthday } from "./utils";

export const sendMessage = async (env: Env, message: string) => {
  if (!message) return;

  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = env;
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML"
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[TELEGRAM] Failed to send message:", error);
      throw new Error(`Telegram API error: ${response.status} ${error}`);
    }

    return response;
  } catch (error) {
    console.error("[TELEGRAM] Error sending message:", error);
    throw error;
  }
};

export const handleTelegramCommand = async (env: Env, text: string): Promise<string> => {
  if (!text) return "No command provided. Type /help for available commands.";

  const parts = text.split(" ");
  const command = parts[0].toLowerCase();

  switch (command) {
    case "/add":
    case "/addbirthday": {
      if (parts.length !== 3) {
        return "Usage: /add NAME MM-DD";
      }
      const [, name, date] = parts;
      const success = await setBirthday(env, name, date);
      return success 
        ? `✅ Birthday added for ${name} on ${date}`
        : "❌ Failed to add birthday. Please use format: MM-DD (example: 12-25)";
    }

    case "/list":
    case "/birthdays": {
      const birthdays = await getAllBirthdays(env);
      if (birthdays.length === 0) {
        return "No birthdays saved yet.";
      }
      const list = birthdays
        .map(b => `• ${b.name}: ${b.date}`)
        .join("\n");
      return `📅 Saved birthdays:\n${list}`;
    }

    case "/delete":
    case "/remove": {
      if (parts.length !== 2) {
        return "Usage: /delete NAME";
      }
      const name = parts[1];
      const success = await deleteBirthday(env, name);
      return success
        ? `✅ Deleted birthday for ${name}`
        : "❌ Failed to delete birthday";
    }

    case "/help":
    case "/start": {
      return `🎂 <b>Birthday Reminder Bot</b>\n\n` +
             `Available commands:\n\n` +
             `/add NAME MM-DD - Add a birthday\n` +
             `/list - Show all birthdays\n` +
             `/delete NAME - Remove a birthday\n` +
             `/help - Show this help message\n\n` +
             `Examples:\n` +
             `/add John 12-25\n` +
             `/delete John`;
    }

    default:
      return "Unknown command. Type /help for available commands.";
  }
};
