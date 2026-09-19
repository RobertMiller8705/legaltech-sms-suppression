import { deliverMatter } from "./suppression.js";

const result = await deliverMatter({ matterId: "M-17", phone: process.env.DEMO_PHONE ?? "+14155550123", event: "signed_document", text: "Your signed document is ready to review." }, new Set());
console.log(result);
