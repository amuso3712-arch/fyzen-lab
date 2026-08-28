# Telegram bot integration research

Telegram’s official Bot API documents `setWebhook` as an outgoing HTTPS webhook that sends an update whenever the bot receives one. Source: https://core.telegram.org/bots/api

Telegram Bot API webhook requests can be protected with the `secret_token` parameter on `setWebhook`; Telegram sends the value in the `X-Telegram-Bot-Api-Secret-Token` header. The header token is restricted to letters, numbers, underscores, and hyphens and can be 1–256 characters. Source: https://core.telegram.org/bots/api

The lighter alternative is manual polling with `getUpdates`, which avoids a public webhook endpoint but requires a continuously running worker and introduces polling latency. For this site’s timely bot-driven order/product intake, an HTTPS webhook with a secret header is the preferred architecture, subject to deployment URL availability and Telegram secret configuration.
