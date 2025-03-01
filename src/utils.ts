import { Env } from "./Env";

interface Birthday {
  name: string;
  date: string;
}

const getTodayDate = () => new Date().toISOString().split("T")[0];

const isDateInRange = (date: string, range: number): boolean => {
  const today = new Date();
  const [, month, day] = date.split("-").map(Number);
  const targetDate = new Date(today.getFullYear(), month - 1, day);
  
  // Handle year wrap-around
  if (targetDate < today) {
    targetDate.setFullYear(today.getFullYear() + 1);
  }
  
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= range;
};

export const checkBirthdays = async (env: Env): Promise<string[]> => {
  const birthdays = await env.BIRTHDAYS.list();
  const messages: string[] = [];

  for (const key of birthdays.keys) {
    const birthday = await env.BIRTHDAYS.get(key.name);
    if (!birthday) continue;

    const { date, name } = JSON.parse(birthday) as Birthday;

    if (date === getTodayDate()) {
      messages.push(`🎉 Today is ${name}'s birthday! 🎂`);
    } else if (isDateInRange(date, 2)) {
      messages.push(`⚠️ ${name}'s birthday is in 2 days!`);
    } else if (isDateInRange(date, 7)) {
      messages.push(`📅 ${name}'s birthday is in one week!`);
    }
  }

  return messages;
};

export const setBirthday = async (env: Env, name: string, date: string): Promise<boolean> => {
  try {
    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return false;
    }
    await env.BIRTHDAYS.put(name, JSON.stringify({ name, date }));
    return true;
  } catch {
    return false;
  }
};

export const deleteBirthday = async (env: Env, name: string): Promise<boolean> => {
  try {
    await env.BIRTHDAYS.delete(name);
    return true;
  } catch {
    return false;
  }
};

export const getAllBirthdays = async (env: Env): Promise<Birthday[]> => {
  const birthdays = await env.BIRTHDAYS.list();
  const result: Birthday[] = [];
  
  for (const key of birthdays.keys) {
    const birthday = await env.BIRTHDAYS.get(key.name);
    if (birthday) {
      result.push(JSON.parse(birthday));
    }
  }
  
  return result.sort((a, b) => a.name.localeCompare(b.name));
};
