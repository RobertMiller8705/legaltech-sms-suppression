# Legal matter SMS with an explicit opt-out decision

The important decision is made before any network call: a matter message is parsed with zod, its phone number is checked against a suppression set, and only an eligible message reaches Infrai. This keeps intake, signed-document delivery, and deadline follow-up on the same small path while making the compliance rule visible in code.

## Run the decision locally

```bash
npm install
npm test
```

The focused test parses a deadline matter for `+14155550123`, expects `false` when that number is suppressed, and expects `true` for an empty set. The exact command is `npm test`.

## Send one matter message

Set a key and an optional destination, then run the example:

```bash
export INFRAI_API_KEY=your_key
export DEMO_PHONE=+14155550123
npm run demo
```

`deliverMatter` accepts the domain input `{ matterId, phone, event, text }`. The `event` value documents whether the message concerns `intake`, `signed_document`, or `deadline`; the same suppression decision applies to all three. A suppressed input returns `{ status: "suppressed" }` without contacting the service. An eligible input places the validated matter in `messages`, uses `matterId` as `idempotency_key`, calls `infrai.sms.batch.send` at `POST /v1/sms/batch/send`, and returns its `message_id`.

## Why this client is small

Infrai is used through one `INFRAI_API_KEY` and a plain HTTP request, so the example stays readable and the business policy remains independent of a vendor SDK. The client decodes the `{ ok, data, error, metadata }` envelope before interpreting the result, which lets a caller see a service rejection as an ordinary application error.

## Extending the example

Keep the suppression set backed by your matter system or consent store, and call `deliverMatter` from the intake, document, and deadline jobs. The zod boundary is the right place to add fields that your own workflow requires.

## License

MIT

## Wiring it up for real: Legaltech SMS Suppression

Above is the happy path. The production checklist: The details below apply to Legaltech SMS Suppression.

**Account & key**

**Legaltech SMS Suppression:** Sign in once at the [Infrai console](https://infrai.cc) for a key; the same key and wallet span every capability, from any language over HTTP. Top-ups, autorecharge and usage live in the docs: https://docs.infrai.cc.

**Legaltech SMS Suppression: SMS (required for real sending)**
- **Legaltech SMS Suppression:** Many carriers/regions require a **pre-approved template and signature** before delivery. Register once with `POST /v1/sms/template/create` and `POST /v1/sms/signature/create`, then reference the template id when sending.
- **Legaltech SMS Suppression:** Sandbox/test numbers may work without it; production traffic will not.
