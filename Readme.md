# ��� Birthday Reminder Bot

A Telegram bot that helps you remember birthdays, built with Cloudflare Workers. Never forget a birthday again!

## ✨ Features

- 📝 **Easy Birthday Management**
  - Add birthdays with `/add name MM-DD`
  - List all birthdays with `/list`
  - Delete birthdays with `/delete name`

- ⏰ **Smart Notifications**
  - Get notified on the birthday
  - Receive reminder 1 week before
  - Get heads-up 2 days before

- 🛠 **Technical Features**
  - Serverless architecture using Cloudflare Workers
  - Persistent storage with Cloudflare KV
  - Daily automated checks
  - Zero maintenance required

## 🚀 Quick Start

1. **Create Your Bot**
   ```bash
   # Message @BotFather on Telegram
   /newbot
   # Follow instructions and save your bot token
   ```

2. **Get Your Chat ID**
   ```bash
   # Message @userinfobot on Telegram
   /start
   # Save your chat ID
   ```

3. **Setup Project**
   ```bash
   # Clone repository
   git clone https://github.com/yourusername/birthday-reminder-bot.git
   cd birthday-reminder-bot

   # Install dependencies
   npm install

   # Install Wrangler CLI
   npm install -g wrangler
   ```

4. **Configure Wrangler**
   ```bash
   # Login to Cloudflare
   wrangler login

   # Create KV namespace
   wrangler kv:namespace create BIRTHDAYS
   ```

5. **Update Configuration**
   Copy `wrangler.toml.example` to `wrangler.toml` and update:
   ```toml
   [vars]
   TELEGRAM_BOT_TOKEN = "your-bot-token"
   TELEGRAM_CHAT_ID = "your-chat-id"

   [[kv_namespaces]]
   binding = "BIRTHDAYS"
   id = "your-kv-namespace-id"
   ```

6. **Deploy**
   ```bash
   wrangler deploy
   ```

## 💬 Usage

```
/add John 12-25     # Add John's birthday on December 25
/list               # Show all birthdays
/delete John        # Remove John's birthday
/help               # Show all commands
```

## 🔧 Development

```bash
# Run locally
wrangler dev

# Deploy changes
wrangler deploy

# View logs
wrangler tail
```

## 🏗 Architecture

- **Cloudflare Workers**: Serverless platform for running the bot
- **Cloudflare KV**: Key-value storage for birthday data
- **Telegram Bot API**: Communication interface with users
- **Cron Triggers**: Daily checks for upcoming birthdays

## 📝 Environment Variables

| Variable | Description |
|----------|-------------|
| `TELEGRAM_BOT_TOKEN` | Your Telegram bot token from @BotFather |
| `TELEGRAM_CHAT_ID` | Your Telegram chat ID for notifications |

## ��� Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

MIT License - See [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Telegram Bot API](https://core.telegram.org/bots/api)

