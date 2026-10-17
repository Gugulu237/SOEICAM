"use client";
import Link from "./LocalizedLink";
import { useLanguage } from "./SiteShell";
export default function HomeDiscovery() {
  const { language } = useLanguage();
  const fr = language === "fr";
  const formats = fr
    ? [
        [
          "Votre pause",
          "Bouteilles de 250 g, 330 g et 500 g, ou brassés de 500 g : choisissez votre façon de savourer YOLA.",
          "/products",
        ],
        [
          "À partager",
          "Nature, Non Sucré ou Vanille en 1 kg ; Nature, Vanille ou Fraise en 2,5 kg.",
          "/products/category/family",
        ],
        [
          "Votre activité",
          "Revendeurs et professionnels : présentez vos besoins, du choix des références au format de 10 kg.",
          "/professionals",
        ],
      ]
    : [
        [
          "Your everyday break",
          "250 g, 330 g and 500 g bottles, or 500 g stirred yogurt: find your way to enjoy YOLA.",
          "/products",
        ],
        [
          "Something to share",
          "Natural, Unsweetened or Vanilla in 1 kg; Natural, Vanilla or Strawberry in 2.5 kg.",
          "/products/category/family",
        ],
        [
          "For your business",
          "Retailers and professional buyers: discuss your needs, from a selection of flavours to the 10 kg pack.",
          "/professionals",
        ],
      ];
  return (
    <>
      <section className="discovery-section page-container">
        <h2 className="brand-script">
          {fr ? "Un format pour chaque moment" : "A format for every occasion"}
        </h2>
        <div className="activity-grid">
          {formats.map(([title, text, href]) => (
            <article key={href}>
              <h3>{title}</h3>
              <p>{text}</p>
              <Link className="text-link" href={href}>
                {fr ? "Découvrir" : "Explore"}
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="faq-section page-container">
        <h2 className="brand-script">
          {fr ? "Vos questions sur YOLA" : "Your questions about YOLA"}
        </h2>
        <details>
          <summary>
            {fr
              ? "Qui produit les yaourts YOLA ?"
              : "Who produces YOLA yogurt?"}
          </summary>
          <p>
            {fr
              ? "YOLA est la marque de yaourts produits et commercialisés par SOEICAM SARL, une entreprise camerounaise de transformation alimentaire."
              : "YOLA is the yogurt brand produced and commercialised by SOEICAM SARL, a Cameroonian food-processing company."}
          </p>
        </details>
        <details>
          <summary>
            {fr
              ? "Quelles saveurs sont disponibles ?"
              : "Which flavours can I explore?"}
          </summary>
          <p>
            {fr
              ? "Nature, Non Sucré, Vanille, Fraise et Chocolat, selon la catégorie et le format. Le catalogue affiche chaque référence avec sa photo."
              : "Natural, Unsweetened, Vanilla, Strawberry and Chocolate, depending on category and pack size. Every variant has a photograph in the catalogue."}{" "}
            <Link href="/products">
              {fr ? "Voir la gamme" : "See the range"}
            </Link>
          </p>
        </details>
        <details>
          <summary>
            {fr
              ? "Comment demander un approvisionnement ?"
              : "How can I enquire about supply?"}
          </summary>
          <p>
            {fr
              ? "Indiquez votre ville, votre activité et les produits recherchés. SOEICAM confirmera les disponibilités et les modalités commerciales directement avec vous."
              : "Share your city, business type and the products you are interested in. SOEICAM will discuss availability and commercial terms directly with you."}{" "}
            <Link href="/contact">
              {fr ? "Faire une demande" : "Make an enquiry"}
            </Link>
          </p>
        </details>
      </section>
    </>
  );
}
