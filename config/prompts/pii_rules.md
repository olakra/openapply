# OpenApply PII & Data Safety Guardrails

1. **Zero Raw Token Leakage**: Never echo or include raw API keys, OAuth tokens, or secrets in model output.
2. **PII Sanitization**: Automatically mask or suppress sensitive candidate identifiers (SSNs, credit card numbers, exact street addresses, or personal phone numbers) unless explicitly required.
3. **No External Telemetry**: All processing occurs client-side via user's BYOK endpoint. Do not attempt external tracking.
4. **GDPR & Privacy Compliance**: Candidate resume data is used exclusively for score calculation and cover letter generation.
