import { Env } from "./Env";
import { setBirthday, getAllBirthdays, deleteBirthday } from "./utils";

export const sendMessage = async (env: Env, message: string) => {
  if (!message) return;

  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = env;
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: "HTML"
    })
  });
};

export const handleTelegramCommand = async (env: Env, text: string): Promise<string> => {
  const parts = text.split(" ");
  const command = parts[0].toLowerCase();

  switch (command) {
    case "/add":
    case "/addbirthday": {
      if (parts.length !== 3) {
        return "Usage: /add <name> <YYYY-MM-DD>";
      }
      const [, name, date] = parts;
      const success = await setBirthday(env, name, date);
      return success 
        ? `✅ Birthday added for ${name} on ${date}`
        : "❌ Failed to add birthday. Please use format: YYYY-MM-DD";
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
        return "Usage: /delete <name>";
      }
      const name = parts[1];
      const success = await deleteBirthday(env, name);
      return success
        ? `✅ Deleted birthday for ${name}`
        : "❌ Failed to delete birthday";
    }

    case "/help":
    case "/start": {
      return `🎂 Birthday Reminder Bot

Available commands:

/add <name> <YYYY-MM-DD> - Add a birthday
/list - Show all birthdays
/delete <name> - Remove a birthday
/help - Show this help message

Examples:
/add John 1990-12-25
/delete John`;
    }

    default:
      return "Unknown command. Type /help for available commands.";
  }
};
