import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "summarist",
  eventKey: process.env.INNGEST_EVENT_KEY, // Required for production
});
