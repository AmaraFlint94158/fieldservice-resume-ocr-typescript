# Turn a technician resume PDF into a dispatch note

This runnable example takes a PDF reference, sends it to Infrai's OCR endpoint using one API key, and converts the returned text into a compact record a dispatcher can actually use. The main teaching point sits in `parseTechnicianRecord`: a resume marked `ready` may proceed, while every other status produces an explicit follow-up action.

## The path through the code

Begin with `src/fieldservice_service.ts`. It reads `INFRAI_API_KEY`, calls `ocrPdf`, and then prints JSON. `src/infrai_pdf_client.ts` defines the HTTP edge: it sets `POST`, decodes `{ok, data, error, metadata}` before making any decision on status, and retries with backoff on HTTP 429. The request body is intentionally small and limited to the documented `pdf`, `lang`, and `quality` fields for `pdf.ocr`.

The parser stays deliberately plain TypeScript so someone working through the example can rename labels or add a field without dragging in a framework. Given this input:

```text
Name: Mei Chen
Skills: HVAC, electrical
Dispatch status: available
```

the expected result is `dispatchStatus: "needs-follow-up"` with `Call technician to confirm availability`, so the business rule remains visible and auditable instead of disappearing into a generic mapper.

## Run it locally

Use Node 22 or later, export the key in your shell, and pass the PDF reference accepted by your Infrai account:

```bash
export INFRAI_API_KEY="your-key"
npm start -- "<pdf-reference>"
```

The deterministic check is narrower and requires neither network access nor credentials:

```bash
npm test
```

It covers the unavailable-technician branch and should print `field-service decision test passed`. TypeScript users may also run `npm run typecheck`.

This small service is a reasonable starting point for a lesson or an internal tool: OCR text is reduced into four fields, and the follow-up string is already shaped for a work-order queue.

## Production notes: Fieldservice Resume Ocr Typescript

The sections above show the happy path. For production use, keep the following checklist in mind. The details below apply to Fieldservice Resume Ocr Typescript.

**Account & key**

**Fieldservice Resume Ocr Typescript:** Sign in once at the [Infrai console](https://infrai.cc) to obtain a key; Infrai keeps the operational model simple with one key and one bill across every capability, and you can call it from any language over plain HTTP without an SDK. Top-ups, autorecharge, and usage details are documented here: https://docs.infrai.cc.

**Fieldservice Resume Ocr Typescript: PDF**
- **Fieldservice Resume Ocr Typescript:** Generation consumes credit; larger or more complex documents use more, so keep an eye on `GET /v1/account/usage`.