import { strict as assert } from "node:assert";
import { matterSchema, shouldSend } from "./suppression.js";

const matter = matterSchema.parse({ matterId: "M-17", phone: "+14155550123", event: "deadline", text: "Your filing deadline is tomorrow." });
assert.equal(shouldSend(matter, new Set(["+14155550123"])), false);
assert.equal(shouldSend(matter, new Set()), true);
console.log("suppression decision test passed");
