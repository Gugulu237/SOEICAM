import type { Language, Product } from "./products";

export const categoryKeys = [
  "stirred",
  "drinkable",
  "family",
  "professional",
] as const;
export type CategoryKey = (typeof categoryKeys)[number];
export function inCategory(product: Product, key: CategoryKey) {
  if (key === "family")
    return product.size === "1kg" || product.size === "2.5kg";
  if (key === "professional") return product.size === "10kg";
  return product.category === key;
}
export const categoryContent = {
  fr: {
    stirred: {
      title: "Yaourt brassé YOLA au Cameroun",
      short: "À la cuillère, du pot de 500 g au seau de 10 kg.",
      paragraphs: [
        "Une texture onctueuse à savourer à la cuillère : les yaourts brassés YOLA se déclinent en Nature, Non Sucré, Vanille, Fraise et Chocolat selon le format. Le pot de 500 g permet d'explorer les cinq parfums ; les contenants plus généreux répondent aux envies de partage.",
        "Choisissez 1 kg pour plusieurs moments de dégustation, 2,5 kg pour la table familiale ou une occasion entre proches. Le format 10 kg Nature Sucré fait l'objet d'une demande professionnelle : sa composition et son adéquation à une préparation doivent être vérifiées avec SOEICAM.",
      ],
    },
    drinkable: {
      title: "Yaourt à boire YOLA : découvrez les saveurs",
      short: "Des bouteilles de 250 g, 330 g et 500 g pour vos pauses.",
      paragraphs: [
        "Le yaourt à boire YOLA privilégie une consistance fluide et une bouteille facile à emporter. Nature ou Fraise en 250 g, Nature, Non Sucré, Fraise ou Vanille en 330 g : le choix dépend de votre parfum préféré et du format que vous souhaitez garder à portée de main.",
        "La bouteille Nature de 500 g est l'option la plus généreuse de cette gamme. Le 330 g réunit le plus grand choix de parfums à boire. À la maison, au bureau ou pendant un déplacement, conservez le produit selon les indications de son étiquette, y compris lors du transport.",
      ],
    },
    family: {
      title: "Yaourts YOLA à partager : 1 kg et 2,5 kg",
      short: "Deux formats généreux pour les habitudes de votre foyer.",
      paragraphs: [
        "Le yaourt brassé YOLA de 1 kg convient aux foyers qui souhaitent plusieurs portions d'un même parfum. Nature, Non Sucré et Vanille ont chacun leur fiche : comparez le profil gustatif plutôt que de choisir uniquement le volume du contenant.",
        "Les seaux de 2,5 kg Nature, Vanille et Fraise accompagnent les repas en groupe, les retrouvailles et les petites réceptions. Choisissez selon vos besoins réels et votre capacité de conservation au froid. Aucun nombre de portions n'est imposé : il dépend de votre façon de servir et des indications du produit.",
      ],
    },
    professional: {
      title: "YOLA 10 kg : le format professionnel",
      short:
        "Échangez avec SOEICAM sur vos besoins et la préparation envisagée.",
      paragraphs: [
        "Restaurants, traiteurs et entreprises de transformation peuvent demander des informations sur le seau YOLA de 10 kg. Le conditionnement photographié porte la désignation Nature Sucré. Ce détail compte pour un usage culinaire : il ne faut pas le considérer automatiquement comme un yaourt nature non sucré.",
        "Précisez votre activité, votre ville, les quantités envisagées et la recette ou l'application recherchée. SOEICAM pourra confirmer les caractéristiques et les modalités commerciales. L'adéquation aux sauces, marinades ou préparations de shawarma doit être validée ; aucune aptitude comme ferment pour le kossam n'est annoncée.",
      ],
    },
  },
  en: {
    stirred: {
      title: "YOLA stirred yogurt in Cameroon",
      short: "Spoonable yogurt, from 500 g pots to the 10 kg pack.",
      paragraphs: [
        "Smooth and spoonable, YOLA stirred yogurt comes in Natural, Unsweetened, Vanilla, Strawberry and Chocolate, depending on pack size. The 500 g range brings all five flavours together, while larger packs offer different ways to share the range.",
        "Choose 1 kg for repeated servings or 2.5 kg for family tables and get-togethers. The photographed 10 kg pack is labelled Nature Sucré and has a dedicated professional enquiry journey: confirm its specification and suitability for any planned preparation with SOEICAM.",
      ],
    },
    drinkable: {
      title: "YOLA drinking yogurt: discover every flavour",
      short: "250 g, 330 g and 500 g bottles for your everyday breaks.",
      paragraphs: [
        "YOLA drinking yogurt combines a flowing consistency with a bottle that is convenient to carry. Explore Natural and Strawberry in 250 g, or Natural, Unsweetened, Strawberry and Vanilla in 330 g. Choose the taste you enjoy and the bottle size that fits your routine.",
        "Natural 500 g is the most generous bottle in the current range. The 330 g format offers the widest choice of drinking-yogurt flavours. At home, at work or on a journey, follow the label's storage instructions and keep the product appropriately chilled during transport.",
      ],
    },
    family: {
      title: "YOLA sharing packs: 1 kg and 2.5 kg",
      short: "Generous stirred-yogurt formats for your household.",
      paragraphs: [
        "The YOLA 1 kg range suits households wanting several servings of one flavour. Natural, Unsweetened and Vanilla each have their own product page, making it easier to compare taste preferences as well as pack size.",
        "The 2.5 kg Natural, Vanilla and Strawberry packs offer a larger choice for group meals, family gatherings and small events. Consider how much you need and the chilled storage available. We do not promise a fixed number of servings: this depends on how you serve the product and its label instructions.",
      ],
    },
    professional: {
      title: "YOLA 10 kg for professional buyers",
      short: "Discuss your quantities and intended application with SOEICAM.",
      paragraphs: [
        "Restaurants, caterers and food-processing businesses can enquire about the YOLA 10 kg pack. The photographed packaging is labelled Nature Sucré, meaning sweetened natural flavour. This distinction matters in recipes: it should not automatically be treated as unsweetened plain yogurt.",
        "Tell SOEICAM your activity, location, approximate demand and planned use. The team can confirm product specifications and commercial terms. Suitability for sauces, marinades or shawarma preparation needs confirmation; no suitability as a fermentation starter for kossam is claimed.",
      ],
    },
  },
};

export const pageContent = {
  fr: {
    home: {
      title: "SOEICAM | Yaourts YOLA au Cameroun",
      description:
        "Découvrez YOLA par SOEICAM : yaourts brassés et à boire, parfums et formats du quotidien, du partage et des professionnels au Cameroun.",
      h1: "YOLA, le plaisir du yaourt au Cameroun",
    },
    products: {
      title: "Yaourts YOLA : brassés et à boire | SOEICAM",
      description:
        "Comparez les 19 références YOLA : yaourts brassés et à boire, cinq parfums et des formats de 250 g à 10 kg. Contactez SOEICAM.",
      h1: "Tous les yaourts YOLA",
    },
    about: {
      title: "SOEICAM, entreprise camerounaise et maison de YOLA",
      description:
        "SOEICAM SARL, entreprise fondée au Cameroun par des Camerounais, produit et commercialise les yaourts YOLA. Découvrez nos activités à Yaoundé.",
      h1: "SOEICAM, ancrée au Cameroun",
    },
    dairy: {
      title: "Du lait au yaourt : comprendre la filière | SOEICAM",
      description:
        "Comprenez la fermentation, les textures et la conservation du yaourt. Des repères sur la filière laitière au Cameroun et des guides pratiques.",
      h1: "Comprendre le lait et le yaourt au Cameroun",
    },
    contact: {
      title: "Contacter SOEICAM : produits YOLA et distribution",
      description:
        "Contactez SOEICAM à Odza, Yaoundé pour les yaourts YOLA, une demande de distribution ou le format 10 kg. Téléphone, WhatsApp et e-mail.",
      h1: "Contacter SOEICAM",
    },
    professionals: {
      title: "YOLA pour revendeurs et professionnels | SOEICAM",
      description:
        "Commerçants, distributeurs, restaurants et traiteurs : découvrez les formats YOLA et adressez votre demande commerciale à SOEICAM au Cameroun.",
      h1: "YOLA pour les commerçants et les professionnels",
    },
    privacy: {
      title: "Confidentialité et demandes commerciales | SOEICAM",
      description:
        "Comment SOEICAM utilise les informations de vos demandes, les échanges par e-mail et WhatsApp et les mesures d'audience facultatives.",
      h1: "Vos informations, votre choix",
    },
  },
  en: {
    home: {
      title: "SOEICAM | YOLA yogurt in Cameroon",
      description:
        "Discover YOLA by SOEICAM: stirred and drinking yogurts in flavours and formats for everyday breaks, family sharing and professional enquiries in Cameroon.",
      h1: "YOLA yogurt, made for Cameroon",
    },
    products: {
      title: "YOLA yogurt products: flavours and sizes | SOEICAM",
      description:
        "Compare all 19 YOLA products: stirred and drinking yogurt, five flavours and formats from 250 g to 10 kg. Enquire with SOEICAM in Cameroon.",
      h1: "Explore every YOLA yogurt",
    },
    about: {
      title: "About SOEICAM, the Cameroonian company behind YOLA",
      description:
        "SOEICAM SARL is a food-processing company founded in Cameroon by Cameroonians, producing and commercialising YOLA yogurt. Meet the company in Yaoundé.",
      h1: "SOEICAM, rooted in Cameroon",
    },
    dairy: {
      title: "From milk to yogurt: dairy knowledge | SOEICAM",
      description:
        "Understand yogurt fermentation, textures and careful storage. Explore the dairy chain in Cameroon and practical guides to choosing YOLA formats.",
      h1: "Understanding milk and yogurt in Cameroon",
    },
    contact: {
      title: "Contact SOEICAM: YOLA products and distribution",
      description:
        "Reach SOEICAM in Odza, Yaoundé for YOLA product information, distribution and 10 kg pack enquiries. Contact us by phone, WhatsApp or email.",
      h1: "Contact SOEICAM",
    },
    professionals: {
      title: "YOLA for retailers and professional buyers | SOEICAM",
      description:
        "Retailers, distributors, restaurants and caterers: explore YOLA yogurt formats and send a qualified commercial enquiry to SOEICAM in Cameroon.",
      h1: "YOLA for retailers and food-service professionals",
    },
    privacy: {
      title: "Privacy and commercial enquiries | SOEICAM",
      description:
        "How SOEICAM handles enquiry information, email and WhatsApp conversations, and optional audience measurement on this website.",
      h1: "Your information, your choice",
    },
  },
};
export type PageKey = keyof typeof pageContent.en;
export function pagePath(key: PageKey) {
  return key === "home" ? "/" : `/${key}`;
}
export function categoryPath(key: CategoryKey) {
  return `/products/category/${key}`;
}
export function getPage(language: Language, key: PageKey) {
  return pageContent[language][key];
}
