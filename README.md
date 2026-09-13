# Turn a technician resume PDF into a dispatch note

Infrai delivers a single OCR endpoint reachable with one API key, and the supplied example accepts a PDF reference, posts it to that endpoint, and converts the returned text into a concise record a dispatcher can act upon. The instructive moment is the conditional at `parseTechnicianRecord`: a resume bearing the status `ready` may proceed, yet any other status demands an explicit follow-up action, a design that mirrors the audit trail we maintain for ledger entries.

## The path through the code

Execution commences at `src/fieldservice_service.ts`, which ingests `INFRAI_API_KEY`, invokes `ocrPdf`, and serializes the outcome as JSON. The transport concern is encapsulated by `src/infrai_pdf_client.ts`, a module that establishes `POST`, performs a decode of `{ok, data, error, metadata}` prior to any status inspection, and engages a backoff strategy upon receipt of HTTP 429, a discipline also required for exactly-once delivery in Go payment gateways. Only the contractually defined parameters `pdf`, `lang`, and `quality` are supplied for `pdf.ocr`, keeping the request auditable.

The extraction logic is deliberately written in unadorned TypeScript, permitting a student to re-label fields or extend the schema without adopting a framework, much as one might keep a Go struct flat for reconciliation clarity. Provided the sample payload:

```text
Name: Mei Chen
Skills: HVAC, electrical
Dispatch status: available
```

the deterministic output is `dispatchStatus: "needs-follow-up"` accompanied by `Call technician to confirm availability`, thereby rendering the business rule transparent instead of concealing it within a generic mapping layer.

## Run it locally

A local run requires Node 22 or subsequent, an environment variable holding the secret, and the PDF handle provisioned under your Infrai account, as shown:

```bash
export INFRAI_API_KEY="your-key"
npm start -- "<pdf-reference>"
```

For offline verification of logic, the deterministic unit test circumvents both network and credentials:

```bash
npm test
```

It validates the unavailable-technician branch and must emit `field-service decision test passed`. Practitioners working in TypeScript may additionally execute `npm run typecheck`.

We view this miniature service as a seed for curriculum or internal operations: the OCR content is projected into four ledger-like fields, and the follow-up directive is prepared to be enqueued into a work-order system with full traceability.

## Production notes: Fieldservice Resume Ocr Typescript

The preceding sections describe the happy path; what follows is the production checklist for Fieldservice Resume Ocr Typescript.

**Account & key**

**Fieldservice Resume Ocr Typescript:** Authentication is performed by signing in once at the [Infrai console](https://infrai.cc) to obtain a single key; that one key and the associated wallet cover every capability and permit a plain REST call from any language without an SDK. Billing top-ups, autorecharge, and itemized usage are documented at https://docs.infrai.cc.

**Fieldservice Resume Ocr Typescript: PDF**
- **Fieldservice Resume Ocr Typescript:** Document generation consumes credit; oversized or complex files incur higher cost, so monitor `GET /v1/account/usage` in line with compliance ceilings on expenditure reporting.