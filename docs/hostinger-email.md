# Activating commercial enquiry email

The website supports the existing Hostinger Email mailbox. No new paid service is required. Do not put mailbox credentials in GitHub, public JavaScript, NEXT_PUBLIC variables, screenshots or chat.

In the Hostinger Node application environment, set:

| Variable             | Value                                                        |
| -------------------- | ------------------------------------------------------------ |
| SMTP_HOST            | smtp.hostinger.com                                           |
| SMTP_PORT            | 465                                                          |
| SMTP_USER            | info@soeicam.com, or the actual authorised sending mailbox   |
| SMTP_PASSWORD        | The sending mailbox password, entered privately in Hostinger |
| ENQUIRY_TOKEN_SECRET | Optional separate long random secret                         |

The official Hostinger settings use SSL/TLS port 465: [configuration guide](https://www.hostinger.com/support/1575756-how-to-get-email-account-configuration-details-for-hostinger-email/). Verify the mailbox's actual settings in hPanel. Port 587 is supported only with required STARTTLS if your account supports it. Certificate verification is never disabled.

Rebuild/restart after configuration. Without SMTP_USER and SMTP_PASSWORD, the site deliberately offers WhatsApp and email drafts, not a fake on-site submission. The recipient is fixed to info@soeicam.com. Optional customer email becomes Reply-To; the customer cannot choose arbitrary recipients, attachments or URLs for the mailer to load.

Test one clearly identified enquiry after deployment, verify its arrival in the mailbox and spam folder, then verify Reply-To and a response. Confirm SPF/DKIM/DMARC in Hostinger. An SMTP acceptance response is not proof of inbox arrival or human reading. No live delivery was tested without credentials.

Anti-spam uses same-origin checks, length/type validation, a honeypot, signed time-limited challenge, a two-second minimum and per-process request budgets. The global budget is 60 POST attempts per 15 minutes. Set TRUST_PROXY_IP=true only if Hostinger confirms its proxy overwrites x-forwarded-for; this adds a hashed-IP limit of five attempts per 15 minutes. In-memory limits reset on restart and are not shared between replicas. Add provider/WAF or shared-store protection before scaling or when facing abuse; do not advertise this basic protection as a complete bot defence.

Messages are stored in the business mailbox, not a website database or CRM. The company should approve mailbox access, retention/deletion practices and the privacy notice before launch. Secrets and message content are not written to application logs by this handler.

The current Hostinger build fixes remain: a single next.config.js using CommonJS, `next build --webpack`, Next.js and optional SWC WASM both pinned to 16.3.8. Do not reintroduce the TypeScript config loader or its previous experimental strip-types flag.
