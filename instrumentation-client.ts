import { initBotId } from "botid/client/core";

// Attach a BotID token to chat requests; app/api/chat verifies it with
// checkBotId(). Only this route is protected, so pages and the social card
// stay readable by link-preview fetchers.
initBotId({
  protect: [{ path: "/api/chat", method: "POST" }],
});
