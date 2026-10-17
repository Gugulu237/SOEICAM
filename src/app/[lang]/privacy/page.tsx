import { company } from "@/lib/company";
import { seo } from "@/lib/seo";
import { getPage } from "@/lib/pages";
import { routeLanguage, type LocaleProps } from "@/lib/route-language";
export async function generateMetadata({ params }: LocaleProps) {
  const lang = await routeLanguage(params);
  const c = getPage(lang, "privacy");
  return seo(lang, "/privacy", c.title, c.description);
}
export default async function Page({ params }: LocaleProps) {
  const lang = await routeLanguage(params);
  const fr = lang === "fr";
  const sections = fr
    ? [
        [
          "Vos demandes commerciales",
          "Le formulaire recueille vos coordonnées, votre ville, votre type de clientèle et votre demande pour permettre à SOEICAM SARL de vous répondre. N'incluez pas d'informations médicales, de pièces d'identité ou d'autres données sensibles. Lorsque l'envoi sur le site est activé, la demande est transmise à la boîte professionnelle de SOEICAM via Hostinger Email. Ce site ne dispose pas d'un CRM ni d'une base de demandes.",
        ],
        [
          "WhatsApp et votre messagerie",
          "Les options WhatsApp et brouillon e-mail préparent un message dans un service externe. Vous devez l'envoyer vous-même ; l'ouverture de l'application ne constitue pas un envoi à SOEICAM. Les conditions de confidentialité de votre messagerie et de WhatsApp s'appliquent à ces services.",
        ],
        [
          "Mesure d'audience facultative",
          "La mesure Google Analytics n'est chargée que si elle est configurée et que vous l'acceptez. Vous pouvez refuser sans perdre l'accès au site ou aux demandes. Les événements de mesure n'incluent pas votre nom, téléphone, e-mail ou message. Le choix est conservé localement dans votre navigateur et peut être modifié avec le bouton de confidentialité, lorsqu'il est affiché.",
        ],
        [
          "Sécurité et échanges",
          "Le formulaire utilise des contrôles de validité, un champ anti-robot et une limitation temporaire des tentatives. Ne transmettez jamais de mot de passe. La réception par le serveur de messagerie ne garantit pas que le message a été lu ; appelez-nous pour une demande urgente.",
        ],
        [
          "Questions sur vos informations",
          "Pour demander des précisions sur l'utilisation de vos informations, leur correction ou leur suppression dans les échanges commerciaux, contactez SOEICAM. Notre équipe examine votre demande et les éventuelles obligations de conservation applicables.",
        ],
      ]
    : [
        [
          "Commercial enquiries",
          "The form collects contact details, city, customer type and your enquiry so SOEICAM SARL can respond. Do not include medical information, identity documents or other sensitive data. When on-site sending is enabled, enquiries are delivered to SOEICAM's business mailbox through Hostinger Email. This website does not operate a CRM or an enquiry database.",
        ],
        [
          "WhatsApp and your email app",
          "WhatsApp and email-draft options prepare a message in an external service. You must send it yourself; opening an application is not a submission to SOEICAM. Your email provider's and WhatsApp's privacy terms apply to those services.",
        ],
        [
          "Optional audience measurement",
          "Google Analytics loads only when configured and you accept it. Declining does not affect website access or enquiries. Measurement events do not include your name, telephone number, email address or message. Your choice is kept locally in your browser and can be changed using the privacy button when it is displayed.",
        ],
        [
          "Security and conversations",
          "The form uses validation, a bot-trap field and temporary request limits. Never send passwords. Acceptance by the email server does not guarantee that a message has been read; please call for urgent enquiries.",
        ],
        [
          "Questions about your information",
          "Contact SOEICAM to ask about the use, correction or deletion of information in commercial conversations. Our team will review your request and any applicable record-retention obligations.",
        ],
      ];
  return (
    <>
      <section className="page-hero">
        <div className="page-container">
          <h1>{getPage(lang, "privacy").h1}</h1>
        </div>
      </section>
      <div className="editorial page-container">
        {sections.map(([title, text]) => (
          <section key={title}>
            <h2>{title}</h2>
            <p>{text}</p>
          </section>
        ))}
        <p>
          SOEICAM SARL
          <br />
          {company.address}
          <br />
          <a href={`mailto:${company.email}`}>{company.email}</a>
          <br />
          <a href={`tel:${company.telephone}`}>{company.phone}</a>
        </p>
      </div>
    </>
  );
}
