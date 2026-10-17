import Link from "next/link";
import Image from "next/image";
import { seo, breadcrumbSchema } from "@/lib/seo";
import { getPage } from "@/lib/pages";
import { routeLanguage, type LocaleProps } from "@/lib/route-language";
import { localizedPath } from "@/lib/locales";
import JsonLd from "@/components/JsonLd";
export async function generateMetadata({ params }: LocaleProps) {
  const lang = await routeLanguage(params);
  const c = getPage(lang, "professionals");
  return seo(lang, "/professionals", c.title, c.description);
}
export default async function Page({ params }: LocaleProps) {
  const lang = await routeLanguage(params);
  const fr = lang === "fr";
  const c = getPage(lang, "professionals");
  const path = (p: string) => localizedPath(lang, p);
  return (
    <>
      <JsonLd
        data={breadcrumbSchema(lang, [
          { name: fr ? "Accueil" : "Home", path: "/" },
          { name: c.h1, path: "/professionals" },
        ])}
      />
      <section className="page-hero catalog-hero">
        <div className="page-container">
          <span className="eyebrow green">SOEICAM / YOLA</span>
          <h1>{c.h1}</h1>
          <p>
            {fr
              ? "Deux parcours pour un échange commercial utile : proposer YOLA à vos clients ou étudier un format pour votre activité."
              : "Two focused enquiry journeys: carry YOLA for your customers or discuss a format for your business."}
          </p>
        </div>
      </section>
      <section className="page-container business-journeys">
        <article>
          <h2 className="brand-script">
            {fr ? "Distribution et revente" : "Distribution and resale"}
          </h2>
          <p>
            {fr
              ? "Boutiques, supérettes, supermarchés, grossistes et distributeurs : comparez les yaourts brassés et à boire, leurs parfums et leurs formats. Indiquez les références recherchées et votre ville pour engager la discussion."
              : "Shops, minimarkets, supermarkets, wholesalers and distributors: compare stirred and drinking yogurts, flavours and pack sizes. Share your preferred products and your city to start a conversation."}
          </p>
          <p>
            {fr
              ? "Les disponibilités, tarifs, quantités et possibilités d'approvisionnement sont confirmés directement par SOEICAM. Aucune couverture de livraison n'est présumée."
              : "Availability, prices, quantities and supply arrangements are confirmed directly by SOEICAM. Delivery coverage is not assumed."}
          </p>
          <Link
            className="button button-primary"
            href={path("/contact?type=distributor")}
          >
            {fr ? "Demander un approvisionnement" : "Enquire about supply"}
          </Link>
          <Link className="text-link" href={path("/products")}>
            {fr ? "Comparer les références" : "Compare products"}
          </Link>
        </article>
        <article>
          <h2 className="brand-script">
            {fr
              ? "Restauration et transformation"
              : "Food service and processing"}
          </h2>
          <p>
            {fr
              ? "Restaurants, hôtels, cafétérias, traiteurs et transformateurs : présentez vos quantités et l'utilisation envisagée. Les formats de 1 kg, 2,5 kg et 10 kg peuvent être étudiés selon votre besoin et les caractéristiques du produit."
              : "Restaurants, hotels, cafeterias, caterers and processors: share your quantities and intended application. Discuss 1 kg, 2.5 kg and 10 kg formats according to your requirements and the product specification."}
          </p>
          <p>
            {fr
              ? "Le seau de 10 kg photographié est Nature Sucré. Vérifiez son adéquation avant toute utilisation en sauce, marinade ou préparation de shawarma. Il n'est pas présenté comme un ferment pour le kossam."
              : "The photographed 10 kg pack is Nature Sucré, a sweetened natural-flavour yogurt. Confirm suitability before using it in sauces, marinades or shawarma preparations. It is not presented as a starter culture for kossam."}
          </p>
          <Link
            className="button button-primary"
            href={path("/contact?type=foodservice&product=stirred-nature-10kg")}
          >
            {fr
              ? "Présenter mon besoin professionnel"
              : "Discuss my professional requirements"}
          </Link>
          <Link
            className="text-link"
            href={path("/products/stirred-nature-10kg")}
          >
            {fr ? "Découvrir YOLA 10 kg" : "Explore YOLA 10 kg"}
          </Link>
        </article>
      </section>
      <section className="professional-pack">
        <div className="page-container professional-pack-inner">
          <div className="professional-image">
            <Image
              src="/brand/products/stirred-10kg-nature.png"
              alt={
                fr
                  ? "Seau YOLA Nature Sucré 10 kg"
                  : "YOLA Nature Sucré 10 kg pack"
              }
              fill
              sizes="(max-width: 700px) 80vw, 400px"
            />
          </div>
          <div>
            <h2 className="brand-script">
              {fr ? "Préparons votre demande" : "Make your enquiry useful"}
            </h2>
            <ul>
              {(fr
                ? [
                    "Votre activité et votre point de contact",
                    "La ville et le lieu d'approvisionnement envisagé",
                    "Les références, quantités et la fréquence souhaitées",
                    "Les contraintes de stockage et l'application recherchée",
                  ]
                : [
                    "Your business and contact details",
                    "Your city and proposed supply location",
                    "Preferred products, quantities and frequency",
                    "Storage constraints and the intended application",
                  ]
              ).map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <Link className="text-link" href={path("/contact")}>
              {fr ? "Échanger avec SOEICAM" : "Contact SOEICAM"}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
