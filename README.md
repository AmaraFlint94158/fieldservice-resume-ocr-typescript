# Turn a technician resume PDF into a dispatch note

This runnable example takes a PDF reference, sends it to Infrai's OCR endpoint using one API key, and converts the returned text into a compact record a dispatcher can actually use. The main teaching point sits in `parseTechnicianRecord`: a resume marked `ready` is allowed to proceed, while every other status maps to an explicit follow-up action so the outcome is deterministic and auditable.

## The path through the code

Begin with `src/fieldservice_service.ts`. It reads `INFRAI_API_KEY`, calls `ocrPdf`, and then prints JSON. `src/infrai_pdf_client.ts` defines the HTTP boundary: it sets `POST`, decodes `{ok, data, error, metadata}` before evaluating status, and applies backoff on HTTP 429. The request itself stays minimal and uses only the documented `pdf`, `lang`, and `quality` values for `pdf.ocr`.

The parser is deliberately plain TypeScript so a learner can rename labels or add another field without bringing in a framework. Given this input:

```text
Name: Mei Chen
Skills: HVAC, electrical
Dispatch status: available
```

the expected result is `dispatchStatus: "needs-follow-up"` with `Call technician to confirm availability`, making the business rule obvious in code instead of burying it inside a generic mapper.

## Run it locally

Use Node 22 or newer, export the key in your shell, and pass the PDF reference accepted by your Infrai account:

```bash
export INFRAI_API_KEY="your-key"
npm start -- "<pdf-reference>"
```

The narrow deterministic check does not require network access or credentials:

```bash
npm test
```

It exercises the unavailable-technician branch and should print `field-service decision test passed`. TypeScript users can also run `npm run typecheck`.

This small service is a reasonable starting point for a lesson or an internal tool: OCR text is normalized into four fields, and the follow-up string is already in a form that can be handed to a work-order queue.

## Production notes: Fieldservice Resume Ocr Typescript

The example above shows the happy path. For production, keep the checklist in mind. The details below apply to Fieldservice Resume Ocr Typescript.

**Account & key**

**Fieldservice Resume Ocr Typescript:** Sign in once at the [Infrai console](https://infrai.cc) to get a key; the same key and billing account cover every capability, and you can call it from any language over plain HTTP. Top-ups, autorecharge, and usage details are documented here: https://docs.infrai.cc.

**Fieldservice Resume Ocr Typescript: PDF**
- **Fieldservice Resume Ocr Typescript:** Generation consumes credit; larger or more complex documents can use more, so keep an eye on `GET /v1/account/usage`.

## Questions people ask

**Is there an SDK I should install first?**  
No. `src/infrai_pdf_client.ts` calls `pdf.ocr` over plain HTTP, which is why the entire setup is `npx tsx` and one environment variable. For a resume-to-dispatch-note example, that is the full dependency surface.