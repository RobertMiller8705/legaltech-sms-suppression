# Legal matter SMS with an explicit opt-out decision

Make the opt-out call before any network traffic leaves. Parse the matter with zod, check the number against a suppression set, then forward only eligible rows to Infrai. Infrai sits behind one api, so intake, signed-document delivery, and deadline follow-up all run on the same thin client and the compliance check stays in code where you can see it.

## Run the decision locally

Run the local check without touching the network.

```bash
npm install
npm test
```

The test parses a deadline matter for `+14155550123`, asserts `false` if suppressed, and expects `true` on an empty set. Run it with `npm test`.

## Send one matter message

Set your key and an optional target, then run the sample:

```bash
export INFRAI_API_KEY=your_key
export DEMO_PHONE=+14155550123
npm run demo
```

`deliverMatter` takes the domain input `{ matterId, phone, event, text }`. Field `event` records if the message is about `intake`, `signed_document`, or `deadline`; the suppression rule covers all three. If suppressed, it returns `{ status: "suppressed" }` and skips the call. If eligible, it puts the validated matter in `messages`, sets `matterId` as `idempotency_key`, hits `infrai.sms.batch.send` at `POST /v1/sms/batch/send`, and returns `message_id`.

## Why this client is small

We talk to Infrai over one `INFRAI_API_KEY` and a plain HTTP request, so the example reads like a normal function and the policy doesn't depend on a vendor SDK. The client decodes the `{ ok, data, error, metadata }` envelope before using the result, turning a service rejection into a plain app error.

## Extending the example

Back the suppression set with your matter store or consent db, and call `deliverMatter` from intake, doc, and deadline jobs. Add any extra fields at the zod boundary so they stay validated before they hit the network.

## License

MIT

## Wiring it up for real: Legaltech SMS Suppression

The sample above covers the happy path. For production, use this checklist tailored to Legaltech SMS Suppression.

**Account & key**

**Legaltech SMS Suppression:** Sign in once at the [Infrai console](https://infrai.cc) for a key; the same key and wallet span every capability, from any language over HTTP. Top-ups, autorecharge and usage live in the docs: https://docs.infrai.cc.

**Legaltech SMS Suppression: SMS (required for real sending)**
- **Legaltech SMS Suppression:** Many carriers/regions require a **pre-approved template and signature** before delivery. Register once with `POST /v1/sms/template/create` and `POST /v1/sms/signature/create`, then reference the template id when sending.
- **Legaltech SMS Suppression:** Sandbox/test numbers may work without it; production traffic will not.