import type { ExportedHandler } from "@cloudflare/workers-types";
import { Env } from "./Env";
import { checkBirthdays } from "./utils";
import { sendMessage, handleTelegramCommand } from "./bot";

export default {
  // Handle scheduled birthday checks
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log("[SCHEDULED] Checking birthdays...");
    const messages = await checkBirthdays(env);
    console.log("[SCHEDULED] Found messages:", messages);
    
    if (messages.length > 0) {
      const message = messages.join("\n");
      await ctx.waitUntil(sendMessage(env, message));
      console.log("[SCHEDULED] Sent messages successfully");
    }
  },

  // Handle incoming HTTP requests (Telegram webhooks)
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    console.log("[WEBHOOK] Received request:", request.method, request.url);

    try {
      const payload = await request.json();
      console.log("[WEBHOOK] Parsed payload:", JSON.stringify(payload, null, 2));
      
      // Get the message text directly from the message object
      const message = payload.message || payload.edited_message;
      
      if (!message?.text) {
        console.log("[WEBHOOK] No text in message");
        return new Response("No text found", { status: 400 });
      }

      // Process the command
      const text = message.text.trim();
      console.log("[WEBHOOK] Processing command:", text);
      
      try {
        // Handle the command and wait for response
        const response = await handleTelegramCommand(env, text);
        console.log("[WEBHOOK] Command response:", response);
        
        // Send response back to Telegram
        if (response) {
          await sendMessage(env, response);
          console.log("[WEBHOOK] Response sent to Telegram");
        }
        
        return new Response("OK", { status: 200 });
      } catch (error) {
        console.error("[WEBHOOK] Error sending response:", error);
        return new Response(`Error sending response: ${error.message}`, { status: 500 });
      }

    } catch (error) {
      console.error("[WEBHOOK] Error processing request:", error);
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  },
} satisfies ExportedHandler<Env>;
