# 🔐 Secrets Setup Guide

This guide explains how to obtain each secret required for the GitHub Actions deployment.

## 1. Cloudflare API Token (CF_API_TOKEN)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Select "Create Custom Token"
4. Set permissions:
   - Account - Workers Scripts - Edit
   - Account - Workers KV Storage - Edit
   - Zone - DNS - Edit (if using custom domain)
5. Set account and zone resources as needed
6. Create token and copy it

## 2. Cloudflare Account ID (CF_ACCOUNT_ID)

1. Log into [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your account
3. Your Account ID is shown in the URL: `https://dash.cloudflare.com/<Account ID>`
4. It's also visible in the right sidebar under "API"

## 3. Telegram Bot Token (TELEGRAM_BOT_TOKEN)

1. Open Telegram and message [@BotFather](https://t.me/botfather)
2. Send `/newbot`
3. Follow instructions to create your bot
4. BotFather will provide a token like: `123456789:ABCdefGHIjklmNOPqrstUVwxyz`
5. Copy this token

## 4. Telegram Chat ID (TELEGRAM_CHAT_ID)

1. Message [@userinfobot](https://t.me/userinfobot) on Telegram
2. Send `/start`
3. The bot will reply with your Chat ID (a number like `123456789`)

## 5. KV Namespace ID (KV_NAMESPACE_ID)

```bash
# Install Wrangler CLI if you haven't
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create KV namespace
wrangler kv:namespace create BIRTHDAYS

# The command will output something like:
# Add the following to your wrangler.toml:
# kv_namespaces = [
#   { binding = "BIRTHDAYS", id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" }
# ]
# Copy the id value
```

## 6. Domain (DOMAIN)

If using a custom domain:
1. Add your domain to Cloudflare (if not already)
2. Create a DNS record:
   - Type: CNAME
   - Name: birthday-reminder (or your subdomain)
   - Target: workers.dev
3. Use the full domain (e.g., `birthday-reminder.yourdomain.com`)

## Adding Secrets to GitHub

1. Go to your GitHub repository
2. Click Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add each secret:

| Secret Name | Example Value |
|------------|---------------|
| CF_API_TOKEN | d23eb3f7c37d68... |
| CF_ACCOUNT_ID | a1b2c3d4e5f6... |
| TELEGRAM_BOT_TOKEN | 123456789:ABCdef... |
| TELEGRAM_CHAT_ID | 123456789 |
| KV_NAMESPACE_ID | e1b2c3d4-5e6f... |
| DOMAIN | birthday-reminder.yourdomain.com |

## Local Development Setup

Create a `.dev.vars` file for local development:

```env
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

And a local `wrangler.toml`:

```toml
name = "birthday-reminder"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[triggers]
crons = ["0 9 * * *"]

[vars]
TELEGRAM_BOT_TOKEN = "your_bot_token"
TELEGRAM_CHAT_ID = "your_chat_id"

[[kv_namespaces]]
binding = "BIRTHDAYS"
id = "your_kv_namespace_id"
```

⚠️ Remember: Never commit these files to Git!