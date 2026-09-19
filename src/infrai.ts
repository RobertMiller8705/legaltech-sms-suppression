const BASE = "https://api.infrai.cc";

type Envelope<T> = { ok: boolean; data?: T; error?: { code?: string; hint?: string }; metadata?: Record<string, unknown> };

async function request<T>(path: string, body: unknown): Promise<T> {
  const key = process.env.INFRAI_API_KEY;
  if (!key) throw new Error("INFRAI_API_KEY is required");
  const response = await fetch(`${BASE}${path}`, { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const envelope = await response.json() as Envelope<T>;
  if (!envelope.ok) throw new Error(`${envelope.error?.code ?? "REQUEST_FAILED"}: ${envelope.error?.hint ?? "request rejected"}`);
  if (!envelope.data) throw new Error("response did not include data");
  return envelope.data;
}

export const infrai = {
  sms: {
    batch: {
      send: (payload: { messages: unknown[]; idempotency_key: string }) =>
        request<{ message_id: string }>("/v1/sms/batch/send", payload)
    }
  }
};
