"use client";
import { Check, Copy, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLanguage } from "./SiteShell";
import Link from "./LocalizedLink";
import { company, whatsappUrl } from "@/lib/company";
import { products, categories } from "@/lib/products";
import { productName, productDisplayName } from "@/lib/product-content";
import {
  customerTypes,
  customerLabels,
  validateEnquiry,
} from "@/lib/enquiries";
import { track } from "@/lib/analytics";
export default function ContactPage({
  emailEnabled,
  initialProduct = "",
  initialType = "",
}: {
  emailEnabled: boolean;
  initialProduct?: string;
  initialType?: string;
}) {
  const { copy, language } = useLanguage();
  const fr = language === "fr";
  const selected = products.find((p) => p.slug === initialProduct);
  const [category, setCategory] = useState(selected?.category || "");
  const [product, setProduct] = useState(selected?.slug || "");
  const [copied, setCopied] = useState(false);
  const [channel, setChannel] = useState(emailEnabled ? "site" : "whatsapp");
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [handoff, setHandoff] = useState("");
  const started = useRef(false);
  useEffect(() => {
    if (!emailEnabled) return;
    const controller = new AbortController();
    fetch("/api/enquiries", { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setToken(d?.token || ""))
      .catch(() => {});
    return () => controller.abort();
  }, [emailEnabled]);
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(company.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setStatus(
        fr
          ? "Vous pouvez sélectionner l'adresse e-mail ci-dessus."
          : "You can select the email address above.",
      );
    }
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    setHandoff("");
    const data = new FormData(event.currentTarget);
    const payload = Object.fromEntries(data.entries());
    const enquiry = validateEnquiry({
      ...payload,
      language,
      privacy: data.get("privacy") === "on",
    });
    if (!enquiry) {
      setStatus(
        fr
          ? "Vérifiez les coordonnées et complétez les champs obligatoires."
          : "Please check your contact details and complete the required fields.",
      );
      return;
    }
    const chosen = products.find((p) => p.slug === enquiry.product);
    const labels = fr
      ? [
          "Nom",
          "Téléphone",
          "Ville",
          "Client",
          "Produit",
          "Quantité",
          "Message",
        ]
      : ["Name", "Phone", "City", "Customer", "Product", "Quantity", "Message"];
    const values = [
      enquiry.name,
      enquiry.phone,
      enquiry.city,
      customerLabels[language][enquiry.customerType],
      chosen
        ? productName(chosen, language)
        : enquiry.category
          ? categories[language][enquiry.category as "stirred" | "drinkable"]
          : "YOLA",
      enquiry.quantity || "-",
      enquiry.message,
    ];
    const message = `${fr ? "Bonjour SOEICAM, voici ma demande :" : "Hello SOEICAM, here is my enquiry:"}\n\n${labels.map((l, i) => `${l}: ${values[i]}`).join("\n")}${enquiry.email ? `\nEmail: ${enquiry.email}` : ""}`;
    if (channel !== "site") {
      const url =
        channel === "whatsapp"
          ? whatsappUrl(message)
          : `mailto:${company.email}?subject=${encodeURIComponent(copy.contact.enquiry)}&body=${encodeURIComponent(message)}`;
      track(channel === "whatsapp" ? "whatsapp_click" : "email_draft_opened", {
        product_id: product || undefined,
        customer_type: enquiry.customerType,
        language,
        channel,
      });
      setHandoff(url);
      if (channel === "whatsapp")
        window.open(url, "_blank", "noopener,noreferrer");
      else window.location.href = url;
      setStatus(
        fr
          ? "Message préparé. Envoyez-le dans WhatsApp ou votre messagerie pour le transmettre à SOEICAM."
          : "Message prepared. Send it in WhatsApp or your email app to deliver it to SOEICAM.",
      );
      return;
    }
    if (!token) {
      setStatus(
        fr
          ? "L'envoi sur le site n'est pas disponible. Choisissez WhatsApp ou le brouillon e-mail."
          : "On-site sending is unavailable. Choose WhatsApp or an email draft.",
      );
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...enquiry,
          token,
          website: data.get("website") || "",
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.accepted)
        throw new Error(result.error || "delivery");
      setStatus(
        fr
          ? "Votre demande a été acceptée par notre serveur de messagerie. SOEICAM pourra vous répondre avec les coordonnées fournies."
          : "Your enquiry was accepted by our email server. SOEICAM can reply using the contact details you provided.",
      );
      track("generate_lead", {
        product_id: product || undefined,
        customer_type: enquiry.customerType,
        language,
        channel: "site",
      });
      if (
        enquiry.customerType === "distributor" ||
        enquiry.customerType === "retailer"
      )
        track("distributor_enquiry_submitted", {
          language,
          customer_type: enquiry.customerType,
        });
    } catch (error) {
      const limited = error instanceof Error && error.message === "rate_limit";
      setStatus(
        limited
          ? fr
            ? "Trop de tentatives. Patientez avant de réessayer ou appelez-nous."
            : "Too many attempts. Please wait before retrying or call us."
          : fr
            ? "L'envoi n'a pas pu être confirmé. Réessayez dans un instant, ou utilisez WhatsApp ou le brouillon e-mail."
            : "Sending could not be confirmed. Try again shortly, or use WhatsApp or an email draft.",
      );
    } finally {
      setBusy(false);
    }
  }
  const label = (french: string, english: string) => (fr ? french : english);
  return (
    <>
      <section className="page-hero contact-hero">
        <div className="page-container">
          <span className="eyebrow green">{copy.contact.eyebrow}</span>
          <h1>{copy.contact.title}</h1>
          <p>{copy.contact.intro}</p>
        </div>
      </section>
      <section className="contact-layout page-container">
        <div className="contact-details">
          <div className="contact-item">
            <Phone size={27} />
            <div>
              <h2>{copy.contact.phone}</h2>
              <a
                onClick={() => track("phone_click", { language })}
                href={`tel:${company.telephone}`}
              >
                {company.phone}
              </a>
              <a href="tel:+237681218946">{company.otherPhone}</a>
            </div>
          </div>
          <div className="contact-item">
            <Mail size={27} />
            <div>
              <h2>{copy.contact.email}</h2>
              <a href={`mailto:${company.email}`}>{company.email}</a>
              <button className="copy-email" type="button" onClick={copyEmail}>
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? copy.contact.copied : copy.contact.copy}
              </button>
            </div>
          </div>
          <div className="contact-item">
            <MapPin size={27} />
            <div>
              <h2>{copy.contact.visit}</h2>
              <p>{copy.contact.address}</p>
              <a
                className="text-link"
                href="https://www.google.com/maps/search/?api=1&query=Rue+Sion+1+Odza+Yaounde"
                target="_blank"
                rel="noopener noreferrer"
              >
                {copy.contact.map}
              </a>
            </div>
          </div>
          <a
            className="whatsapp-panel"
            onClick={() =>
              track("whatsapp_click", { language, channel: "whatsapp" })
            }
            href={whatsappUrl(
              fr
                ? "Bonjour SOEICAM, je souhaite avoir des renseignements sur les produits YOLA."
                : "Hello SOEICAM, I would like information about YOLA products.",
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={28} />
            <span>
              <strong>{copy.contact.whatsapp}</strong>
              <small>{copy.contact.whatsappText}</small>
            </span>
          </a>
        </div>
        <div className="contact-form-area">
          <h2>{copy.contact.formTitle}</h2>
          <form
            onSubmit={submit}
            onFocus={() => {
              if (!started.current) {
                started.current = true;
                track(
                  initialType === "foodservice"
                    ? "professional_enquiry_started"
                    : "enquiry_started",
                  { language, product_id: product || undefined },
                );
              }
            }}
          >
            <div className="form-row">
              <label>
                {label("Nom complet", "Full name")} *
                <input
                  name="name"
                  autoComplete="name"
                  minLength={2}
                  maxLength={100}
                  required
                />
              </label>
              <label>
                {label("Téléphone / WhatsApp", "Phone / WhatsApp")} *
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  minLength={7}
                  maxLength={30}
                  required
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                {label("E-mail (facultatif)", "Email (optional)")}
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                />
              </label>
              <label>
                {label("Ville / localisation", "City / location")} *
                <input
                  name="city"
                  autoComplete="address-level2"
                  minLength={2}
                  maxLength={120}
                  required
                />
              </label>
            </div>
            <label>
              {label("Vous êtes", "Customer type")} *
              <select
                name="customerType"
                defaultValue={
                  customerTypes.includes(
                    initialType as (typeof customerTypes)[number],
                  )
                    ? initialType
                    : "consumer"
                }
              >
                {customerTypes.map((t) => (
                  <option key={t} value={t}>
                    {customerLabels[language][t]}
                  </option>
                ))}
              </select>
            </label>
            <div className="form-row">
              <label>
                {label("Gamme recherchée", "Interested category")}
                <select
                  name="category"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setProduct("");
                  }}
                >
                  <option value="">
                    {label("Toutes / à préciser", "Any / not sure")}
                  </option>
                  <option value="stirred">
                    {categories[language].stirred}
                  </option>
                  <option value="drinkable">
                    {categories[language].drinkable}
                  </option>
                </select>
              </label>
              <label>
                {label(
                  "Produit, parfum et format",
                  "Product, flavour and size",
                )}
                <select
                  name="product"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                >
                  <option value="">
                    {label("À préciser", "Not sure yet")}
                  </option>
                  {products
                    .filter((p) => !category || p.category === category)
                    .map((p) => (
                      <option key={p.slug} value={p.slug}>
                        {productDisplayName(p, language)}
                      </option>
                    ))}
                </select>
              </label>
            </div>
            <label>
              {label(
                "Quantité ou fréquence souhaitée (facultatif)",
                "Approximate quantity or frequency (optional)",
              )}
              <input name="quantity" maxLength={160} />
            </label>
            <label>
              {copy.contact.message} *
              <textarea
                name="message"
                minLength={10}
                maxLength={3000}
                placeholder={copy.contact.messagePlaceholder}
                rows={5}
                required
              />
            </label>
            <div className="bot-trap" aria-hidden="true">
              <label>
                Website
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <label className="privacy-check">
              <input name="privacy" type="checkbox" required />
              <span>
                {label(
                  "J'accepte que SOEICAM utilise ces informations pour répondre à ma demande.",
                  "I agree that SOEICAM may use this information to respond to my enquiry.",
                )}{" "}
                <Link href="/privacy">
                  {label("Confidentialité", "Privacy")}
                </Link>
              </span>
            </label>
            <label>
              {label(
                "Comment transmettre la demande",
                "How to send your enquiry",
              )}
              <select
                value={channel}
                onChange={(e) => {
                  setChannel(e.target.value);
                  setStatus("");
                  setHandoff("");
                }}
              >
                {emailEnabled && (
                  <option value="site">
                    {label("Envoyer sur le site", "Send on this website")}
                  </option>
                )}
                <option value="whatsapp">WhatsApp</option>
                <option value="email">
                  {label("Brouillon e-mail", "Email draft")}
                </option>
              </select>
            </label>
            <button
              className="button button-primary"
              disabled={busy}
              type="submit"
            >
              {busy
                ? label("Envoi en cours…", "Sending…")
                : channel === "site"
                  ? label("Envoyer ma demande", "Send my enquiry")
                  : channel === "whatsapp"
                    ? label("Préparer sur WhatsApp", "Prepare in WhatsApp")
                    : copy.contact.submit}
            </button>
            <p className="form-note">
              {channel === "site"
                ? label(
                    "Votre demande est envoyée à l'e-mail professionnel de SOEICAM.",
                    "Your enquiry is sent to SOEICAM's business email.",
                  )
                : label(
                    "Le message n'est pas envoyé automatiquement : confirmez l'envoi dans l'application.",
                    "Messages are not sent automatically: send them in the external application.",
                  )}
            </p>
            <div role="status" aria-live="polite" className="form-status">
              {status}
              {handoff && (
                <p>
                  <a
                    className="text-link"
                    href={handoff}
                    target={channel === "whatsapp" ? "_blank" : undefined}
                    rel="noopener noreferrer"
                  >
                    {label(
                      "Ouvrir le message préparé",
                      "Open the prepared message",
                    )}
                  </a>
                </p>
              )}
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
