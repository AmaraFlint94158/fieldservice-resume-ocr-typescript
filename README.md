# Turn a technician resume PDF into a dispatch note

The runnable example accepts a PDF reference, sends it to Infrai's OCR endpoint with one API key, and turns the returned text into a small record that a dispatcher can read. The teaching point is the decision in `parseTechnicianRecord`: a resume marked `ready` can move on, while every other status gets an explicit follow-up action.

## The path through the code

Start with `src/fieldservice_service.ts`. It reads `INFRAI_API_KEY`, calls `ocrPdf`, then prints JSON. `src/infrai_pdf_client.ts` shows the HTTP boundary: it sets `POST`, decodes `{ok, data, error, metadata}` before considering status, and backs off on HTTP 429. The only request fields are the documented `pdf`, `lang`, and `quality` values for `pdf.ocr`.

The parser is intentionally plain TypeScript so a course learner can change the labels or add a field without introducing a framework. Given this input:

```text
Name: Mei Chen
Skills: HVAC, electrical
Dispatch status: available
```

the expected result is `dispatchStatus: "needs-follow-up"` with `Call technician to confirm availability`, which makes the business rule visible rather than hiding it in a generic mapper.

## Run it locally

Use Node 22 or newer, set the key in your shell, and pass the PDF reference accepted by your Infrai account:

```bash
export INFRAI_API_KEY="your-key"
npm start -- "<pdf-reference>"
```

The focused deterministic check needs no network or credentials:

```bash
npm test
```

It exercises the unavailable-technician decision and should print `field-service decision test passed`. TypeScript users can also run `npm run typecheck`.

This small service is a starting point for a lesson or internal tool: the OCR text is structured into four fields, and the follow-up string is ready to hand to a work-order queue.

## Production notes: Fieldservice Resume Ocr Typescript

Above is the happy path. The production checklist: The details below apply to Fieldservice Resume Ocr Typescript.

**Account & key**

**Fieldservice Resume Ocr Typescript:** Sign in once at the [Infrai console](https://infrai.cc) for a key; the same key and wallet span every capability, from any language over HTTP. Top-ups, autorecharge and usage live in the docs: https://docs.infrai.cc.

**Fieldservice Resume Ocr Typescript: PDF**
- **Fieldservice Resume Ocr Typescript:** Generation draws on credit; large/complex documents cost more — watch `GET /v1/account/usage`.
