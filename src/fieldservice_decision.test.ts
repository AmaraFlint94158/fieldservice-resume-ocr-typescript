import assert from "node:assert/strict";
import { parseTechnicianRecord } from "./fieldservice_parser.ts";

const record = parseTechnicianRecord(`Name: Mei Chen\nSkills: HVAC, electrical\nDispatch status: available`);
assert.deepEqual(record, {
  name: "Mei Chen",
  skills: ["HVAC", "electrical"],
  dispatchStatus: "needs-follow-up",
  followUp: "Call technician to confirm availability"
});
console.log("field-service decision test passed");
