import { z } from "zod";
import { infrai } from "./infrai.js";

export const matterSchema = z.object({
  matterId: z.string().min(1),
  phone: z.string().regex(/^\+[1-9]\d{7,14}$/),
  event: z.enum(["intake", "signed_document", "deadline"]),
  text: z.string().min(1)
});
export type MatterMessage = z.infer<typeof matterSchema>;

export function shouldSend(message: MatterMessage, suppressed: ReadonlySet<string>): boolean {
  return !suppressed.has(message.phone);
}

export async function deliverMatter(message: unknown, suppressed: ReadonlySet<string>) {
  const parsed = matterSchema.parse(message);
  if (!shouldSend(parsed, suppressed)) return { status: "suppressed" as const, matterId: parsed.matterId };
  const sent = await infrai.sms.batch.send({ messages: [parsed], idempotency_key: parsed.matterId });
  return { status: "sent" as const, matterId: parsed.matterId, messageId: sent.message_id };
}
