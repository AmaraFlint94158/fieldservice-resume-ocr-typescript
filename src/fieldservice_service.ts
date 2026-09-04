import { ocrPdf } from "./infrai_pdf_client.ts";
import { parseTechnicianRecord } from "./fieldservice_parser.ts";

const pdf = process.argv[2];
if (!pdf) {
  console.error("Usage: npm start -- <pdf-reference>");
  process.exit(1);
}
const text = await ocrPdf(pdf, { lang: "eng", quality: "standard" });
console.log(JSON.stringify(parseTechnicianRecord(text), null, 2));
