"use client";

import { Check, Copy, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { useLanguage } from "@/components/SiteShell";

export default function ContactPage() {
  const { copy, language } = useLanguage();
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    await navigator.clipboard.writeText("info@soeicam.com");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function sendDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const subject = String(form.get("subject") || copy.contact.enquiry).trim();
    const message = String(form.get("message") || "").trim();
    const body = `${message}\n\n${name}\n${email}`;
    window.location.href = `mailto:info@soeicam.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  const whatsappText = language === "fr" ? "Bonjour SOEICAM, je souhaite avoir des renseignements sur vos produits Yola." : "Hello SOEICAM, I would like information about your Yola products.";

  return <>
    <section className="page-hero contact-hero"><div className="page-container"><span className="eyebrow green">{copy.contact.eyebrow}</span><h1>{copy.contact.title}</h1><p>{copy.contact.intro}</p></div></section>
    <section className="contact-layout page-container"><div className="contact-details">
      <div className="contact-item"><Phone size={27} strokeWidth={1.6} /><div><h2>{copy.contact.phone}</h2><a href="tel:+237681218946">+237 681 21 89 46</a><a href="tel:+237688642293">+237 688 64 22 93</a></div></div>
      <div className="contact-item"><Mail size={27} strokeWidth={1.6} /><div><h2>{copy.contact.email}</h2><a href="mailto:info@soeicam.com">info@soeicam.com</a><button className="copy-email" type="button" onClick={copyEmail}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? copy.contact.copied : copy.contact.copy}</button></div></div>
      <div className="contact-item"><MapPin size={27} strokeWidth={1.6} /><div><h2>{copy.contact.visit}</h2><p>{copy.contact.address}</p><a className="text-link dark" href="https://www.google.com/maps/search/?api=1&query=Rue+Sion+1+Yaounde" target="_blank" rel="noopener noreferrer">{copy.contact.map}</a></div></div>
      <a className="whatsapp-panel" href={`https://wa.me/237681218946?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={28} /><span><strong>{copy.contact.whatsapp}</strong><small>{copy.contact.whatsappText}</small></span></a>
    </div><div className="contact-form-area"><h2>{copy.contact.formTitle}</h2><form onSubmit={sendDraft}><div className="form-row"><label>{copy.contact.name}<input name="name" type="text" autoComplete="name" required /></label><label>{copy.contact.emailField}<input name="email" type="email" autoComplete="email" required /></label></div><label>{copy.contact.subject}<input name="subject" type="text" placeholder={copy.contact.subjectPlaceholder} required /></label><label>{copy.contact.message}<textarea name="message" placeholder={copy.contact.messagePlaceholder} rows={7} required /></label><button className="button button-primary" type="submit">{copy.contact.submit}</button><p className="form-note">{copy.contact.formNote}</p></form></div></section>
  </>;
}
