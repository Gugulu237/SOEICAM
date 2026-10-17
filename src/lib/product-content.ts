import { categories, flavors, sizeLabels } from "./products";
import type { Language, Product } from "./products";

type Copy = {
  short: string;
  paragraphs: string[];
  taste: string;
  occasions: string[];
};
type Pair = { en: Copy; fr: Copy };
const entry = (
  short: string,
  paragraphs: string[],
  taste: string,
  occasions: string[],
): Copy => ({ short, paragraphs, taste, occasions });

export const productContent: Record<string, Pair> = {
  "stirred-nature-500g": {
    en: entry(
      "Discover the familiar Nature flavour in a smooth YOLA stirred yogurt. The 500 g pot brings a gently sweet dairy character to breakfast, a snack or a simple dessert.",
      [
        "Nature is the reference point for discovering the YOLA stirred range: a familiar dairy taste, gentle sweetness and a smooth consistency enjoyed with a spoon. Choose it when you want the classic flavour rather than vanilla, strawberry or chocolate.",
        "The 500 g format fits a breakfast table or a yogurt break later in the day. Serve chilled on its own, or pair with cereal or fruit added at home. SOEICAM also offers Nature in larger packs for shared occasions; contact the team to check availability.",
      ],
      "Familiar dairy notes and gentle sweetness; smooth stirred texture.",
      [
        "Breakfast with cereal",
        "An everyday yogurt break",
        "A chilled dessert",
      ],
    ),
    fr: entry(
      "Retrouvez le goût Nature de YOLA dans un yaourt brassé onctueux. Le pot de 500 g associe une douceur familière et un caractère laitier pour le petit-déjeuner, une pause ou un dessert.",
      [
        "Nature est le point de départ pour découvrir les yaourts brassés YOLA : un goût laitier familier, une douceur légère et une texture lisse à savourer à la cuillère. Cette référence privilégie la simplicité, sans parfum de vanille, de fraise ou de chocolat.",
        "Le format 500 g trouve sa place au petit-déjeuner ou lors d'une pause dans la journée. À déguster frais, seul ou avec des céréales et des fruits ajoutés à la maison. Pour partager, découvrez aussi les formats Nature plus généreux. Contactez SOEICAM pour connaître leur disponibilité.",
      ],
      "Notes laitières familières, douceur légère et texture brassée lisse.",
      [
        "Petit-déjeuner avec des céréales",
        "Pause au quotidien",
        "Dessert frais",
      ],
    ),
  },
  "stirred-unsweetened-500g": {
    en: entry(
      "Choose the YOLA reference labelled Non Sucré when you prefer a less-sweet yogurt profile. Its smooth stirred texture and yogurt tang offer a different experience from the sweetened Nature range.",
      [
        "YOLA Non Sucré 500 g puts the characteristic dairy taste and light yogurt tang at the centre of the experience. Its stirred texture is smooth and spoonable, for people who prefer a less-sweet flavour profile rather than a flavoured treat.",
        "Enjoy it chilled at breakfast or customise a bowl with ingredients you choose yourself. It is a distinct reference from YOLA Nature, not a medical or dietary recommendation. The name Non Sucré should not be read as a guarantee of zero total sugars: consult the packaging for ingredients and nutrition information.",
      ],
      "Dairy-forward with a light yogurt tang; smooth and spoonable.",
      [
        "Breakfast bowls",
        "A less-sweet snack preference",
        "Custom pairings at home",
      ],
    ),
    fr: entry(
      "Choisissez la référence YOLA Non Sucré si vous préférez un profil moins doux. Sa texture brassée onctueuse et sa légère acidité laitière la distinguent de la gamme Nature sucrée.",
      [
        "Le YOLA Non Sucré 500 g met en avant le caractère laitier et la légère acidité du yaourt. Sa texture brassée se déguste à la cuillère et s'adresse aux personnes qui recherchent un profil moins doux qu'un yaourt parfumé.",
        "Servez-le frais au petit-déjeuner ou composez votre bol avec les accompagnements de votre choix. Il s'agit d'une référence différente du Nature, sans recommandation médicale ou diététique. La dénomination Non Sucré ne signifie pas nécessairement zéro sucres totaux : consultez l'emballage pour les ingrédients et les informations nutritionnelles.",
      ],
      "Caractère laitier, légère acidité et texture lisse à la cuillère.",
      [
        "Bols du petit-déjeuner",
        "Préférence pour une pause moins douce",
        "Accompagnements au choix",
      ],
    ),
  },
  "stirred-vanilla-500g": {
    en: entry(
      "A soft vanilla aroma meets YOLA's smooth stirred texture in this 500 g pot. A gentle, aromatic choice for a chilled snack or a familiar dessert after a meal.",
      [
        "Vanilla gives this YOLA stirred yogurt a soft aromatic character while keeping the smooth, creamy experience of the range. Its gentle sweetness makes it an alternative to the fruity strawberry and more chocolate-led varieties.",
        "Choose the 500 g pot for a chilled yogurt break or as part of breakfast. Serve on its own to enjoy the vanilla notes, or add your own cereal topping. For households that return to this flavour often, the YOLA Vanilla range also includes 1 kg and 2.5 kg options. Ask SOEICAM about the formats currently available.",
      ],
      "Soft vanilla aroma, gentle sweetness and creamy stirred texture.",
      [
        "Aromatic breakfast bowls",
        "Chilled snacks",
        "A simple after-meal dessert",
      ],
    ),
    fr: entry(
      "Un parfum de vanille doux accompagne la texture brassée onctueuse de YOLA dans ce pot de 500 g. Une saveur aromatique pour une pause fraîche ou un dessert après le repas.",
      [
        "La vanille apporte à ce yaourt brassé YOLA un caractère aromatique doux, tout en conservant la texture lisse et crémeuse de la gamme. Sa douceur en fait une autre façon de découvrir YOLA, à côté des références Fraise et Chocolat.",
        "Le pot de 500 g accompagne une pause fraîche ou un petit-déjeuner. Dégustez-le seul pour apprécier son parfum, ou ajoutez vos céréales préférées. Pour les foyers qui apprécient régulièrement cette saveur, YOLA Vanille existe aussi en 1 kg et 2,5 kg. Renseignez-vous auprès de SOEICAM sur les formats disponibles.",
      ],
      "Parfum de vanille doux, saveur délicate et texture brassée crémeuse.",
      [
        "Bols aromatiques au petit-déjeuner",
        "Pauses fraîches",
        "Dessert après le repas",
      ],
    ),
  },
  "stirred-strawberry-500g": {
    en: entry(
      "YOLA Strawberry 500 g pairs a recognisable fruit-flavoured character with a creamy stirred texture. Enjoy a refreshing spoonful as a snack or a fruity finish to a meal.",
      [
        "This strawberry-flavoured YOLA yogurt brings a fruity change of pace to the stirred range. Its creamy, spoonable consistency carries a recognisable strawberry character, making it a choice for people who enjoy fruit-flavoured desserts rather than a classic Nature taste.",
        "Serve the 500 g pot chilled for a snack or after a meal. It can also join a breakfast table alongside ingredients selected at home. The flavour description does not imply the presence of fruit pieces. If you are choosing for a group, discover the separate Strawberry 2.5 kg family pack and enquire about availability.",
      ],
      "Recognisable strawberry flavour with a creamy, refreshing finish.",
      ["A fruity snack", "Dessert after a meal", "Family flavour discovery"],
    ),
    fr: entry(
      "YOLA Fraise 500 g réunit un parfum fruité reconnaissable et une texture brassée crémeuse. Une pause rafraîchissante à la cuillère ou une touche gourmande pour terminer le repas.",
      [
        "Ce yaourt YOLA au parfum de fraise apporte une note fruitée à la gamme brassée. Sa consistance crémeuse, à déguster à la cuillère, accompagne une saveur reconnaissable pour celles et ceux qui préfèrent un dessert parfumé au goût Nature classique.",
        "Servez le pot de 500 g frais, lors d'une pause ou après le repas. Il peut aussi accompagner le petit-déjeuner et les ingrédients choisis à la maison. La description du parfum ne suppose pas la présence de morceaux de fruits. Pour un groupe, découvrez le format familial Fraise 2,5 kg et demandez sa disponibilité.",
      ],
      "Parfum de fraise reconnaissable et texture crémeuse rafraîchissante.",
      [
        "Pause fruitée",
        "Dessert après le repas",
        "Découverte des saveurs en famille",
      ],
    ),
  },
  "stirred-chocolate-500g": {
    en: entry(
      "For a more indulgent YOLA moment, discover rich chocolate notes and luxurious stirred creaminess. Served chilled, the 500 g pot balances a satisfying chocolate character with a refreshing yogurt finish.",
      [
        "Chocolate is the indulgent expression of YOLA's 500 g stirred range. Rich chocolate notes meet a smooth, luxurious creaminess, for a dessert-style yogurt experience distinct from the lighter aromatic character of Vanilla or the fruity direction of Strawberry.",
        "Chilling brings a refreshing contrast to the satisfying chocolate flavour. Enjoy it slowly with a spoon as an after-meal treat or a special yogurt break. This is a flavour description, not a claim about a particular cocoa origin or chocolate percentage. Contact SOEICAM to ask about availability for personal enjoyment or resale.",
      ],
      "Rich chocolate notes, luxurious creaminess and a refreshing chilled finish.",
      [
        "An indulgent dessert",
        "A chocolate-led yogurt break",
        "Retail flavour variety",
      ],
    ),
    fr: entry(
      "Pour une pause YOLA plus gourmande, découvrez des notes chocolatées riches et une texture brassée généreusement crémeuse. Servi frais, le pot de 500 g associe intensité du chocolat et sensation rafraîchissante.",
      [
        "Chocolat est l'expression gourmande de la gamme brassée YOLA 500 g. Des notes chocolatées riches rencontrent une texture lisse et généreusement crémeuse, pour une expérience de dessert différente du parfum délicat de Vanille ou du caractère fruité de Fraise.",
        "La dégustation fraîche apporte un contraste rafraîchissant à la saveur chocolatée. Savourez-le à la cuillère après le repas ou lors d'une pause particulière. Cette description ne revendique ni origine de cacao ni pourcentage de chocolat. Contactez SOEICAM pour connaître les disponibilités, pour votre consommation ou votre point de vente.",
      ],
      "Notes chocolatées riches, onctuosité généreuse et finale fraîche.",
      [
        "Dessert gourmand",
        "Pause chocolatée",
        "Diversifier les parfums en magasin",
      ],
    ),
  },
  "stirred-nature-1kg": {
    en: entry(
      "Bring the familiar YOLA Nature taste to a shared table. The 1 kg pot offers a more generous format for households serving smooth stirred yogurt across several yogurt occasions.",
      [
        "YOLA Nature 1 kg keeps the familiar dairy character and gentle sweetness of the Nature range in a pack designed for more generous use. It is a practical step up from the 500 g reference when yogurt is regularly part of the household table.",
        "Spoon into separate bowls for breakfast, set out chosen accompaniments, or serve as a chilled dessert after a shared meal. The pack does not come with a promised number of portions: servings depend on your needs. Compare the 2.5 kg Nature format for larger gatherings and ask SOEICAM which size is available.",
      ],
      "Familiar Nature flavour, gentle sweetness and smooth stirred texture.",
      ["Shared breakfasts", "Household yogurt routines", "Dessert bowls"],
    ),
    fr: entry(
      "Invitez le goût familier YOLA Nature à une table partagée. Le pot de 1 kg offre un format généreux pour les foyers qui apprécient le yaourt brassé à plusieurs moments de la journée.",
      [
        "YOLA Nature 1 kg conserve le caractère laitier familier et la douceur légère de la gamme Nature dans un contenant plus généreux. C'est une autre option que le pot de 500 g lorsque le yaourt trouve régulièrement sa place à la table du foyer.",
        "Répartissez-le dans des bols au petit-déjeuner, proposez les accompagnements de votre choix ou servez-le frais après un repas partagé. Aucun nombre de portions n'est promis : chacun adapte la quantité à ses besoins. Comparez aussi le Nature 2,5 kg pour les grandes tablées et contactez SOEICAM pour la disponibilité.",
      ],
      "Goût Nature familier, douceur légère et texture brassée lisse.",
      [
        "Petits-déjeuners partagés",
        "Habitudes gourmandes du foyer",
        "Desserts en bols",
      ],
    ),
  },
  "stirred-unsweetened-1kg": {
    en: entry(
      "The YOLA Non Sucré preference, in a 1 kg shared format. A smooth, dairy-forward stirred yogurt for households that prefer a less-sweet profile and want to choose their own accompaniments.",
      [
        "Non Sucré 1 kg brings YOLA's less-sweet flavour direction to a larger pot. Its dairy-forward taste and light yogurt tang make it different from the sweetened Nature and Vanilla options in this format.",
        "Use separate bowls to let everyone choose their own accompaniments at breakfast or snack time. The generous pack is useful for repeat yogurt occasions without specifying a serving yield. Non Sucré is the product designation, not a zero-sugar or medical claim. Check the label for composition information and contact SOEICAM when comparing this reference with the smaller 500 g version.",
      ],
      "Dairy-forward, lightly tangy and smooth rather than dessert-sweet.",
      [
        "Shared breakfast bowls",
        "Custom accompaniments",
        "A less-sweet household preference",
      ],
    ),
    fr: entry(
      "Retrouvez la préférence YOLA Non Sucré en pot de 1 kg à partager. Un yaourt brassé au caractère laitier pour les foyers qui recherchent un profil moins doux et des accompagnements au choix.",
      [
        "Non Sucré 1 kg propose le profil moins doux de YOLA dans un grand pot. Son caractère laitier et sa légère acidité le distinguent des références Nature sucrée et Vanille proposées dans le même format.",
        "Servez des bols séparés pour permettre à chacun de choisir ses accompagnements au petit-déjeuner ou à la pause. Le contenant généreux convient à plusieurs occasions, sans nombre de portions annoncé. Non Sucré reste une dénomination de produit, et non une promesse de zéro sucre ou une allégation médicale. Consultez l'étiquette et demandez conseil à SOEICAM pour comparer les formats.",
      ],
      "Caractère laitier, légère acidité et texture lisse, moins douce qu'un dessert parfumé.",
      [
        "Bols à partager au petit-déjeuner",
        "Accompagnements personnalisés",
        "Préférence moins douce du foyer",
      ],
    ),
  },
  "stirred-vanilla-1kg": {
    en: entry(
      "Share YOLA's soft vanilla aroma in a generous 1 kg pot. Its creamy stirred consistency suits family breakfasts, chilled dessert bowls and households that return to this aromatic flavour regularly.",
      [
        "Vanilla 1 kg is for people who want an aromatic YOLA flavour at the shared table. A soft vanilla character and gentle sweetness accompany the creamy stirred texture, offering a different experience from the Nature and Non Sucré references in the same size.",
        "Serve chilled in bowls and let each person choose a topping, or use it as a simple shared dessert. Compared with the 500 g pot, this format puts more yogurt into one container without prescribing portions. For larger gatherings, explore Vanilla 2.5 kg. Ask SOEICAM about supply and current availability.",
      ],
      "Soft vanilla aroma and gently sweet creaminess.",
      [
        "Family breakfasts",
        "Shared aromatic desserts",
        "Regular vanilla enjoyment",
      ],
    ),
    fr: entry(
      "Partagez le parfum doux de YOLA Vanille dans un pot généreux de 1 kg. Sa texture brassée crémeuse accompagne les petits-déjeuners en famille et les desserts frais des amateurs de vanille.",
      [
        "Vanille 1 kg s'adresse à celles et ceux qui apprécient une saveur aromatique à la table familiale. Un parfum doux et une douceur légère accompagnent la texture brassée crémeuse, pour une expérience distincte de Nature et Non Sucré dans le même format.",
        "Servez-le frais dans des bols, avec des accompagnements choisis par chacun, ou proposez un dessert simple à partager. Plus généreux que le pot de 500 g, ce contenant ne fixe pas le nombre de portions. Pour les plus grandes tablées, découvrez Vanille 2,5 kg. Contactez SOEICAM pour les disponibilités et l'approvisionnement.",
      ],
      "Parfum de vanille doux et onctuosité légèrement sucrée.",
      [
        "Petits-déjeuners en famille",
        "Desserts parfumés à partager",
        "Plaisir régulier de la vanille",
      ],
    ),
  },
  "stirred-nature-2.5kg": {
    en: entry(
      "A family-oriented YOLA Nature pack for generous shared occasions. The 2.5 kg bucket brings the classic gently sweet stirred flavour to group breakfasts, household gatherings and dessert service.",
      [
        "YOLA Nature 2.5 kg is the family pack for a larger shared table. It carries the familiar Nature taste and smooth stirred consistency into a generous bucket, offering an alternative to buying smaller formats for every yogurt occasion.",
        "Think of a group breakfast, a household gathering or a dessert served into separate bowls. Portion sizes remain your choice; no serving count or yield is promised. This is the Nature reference, distinct from Non Sucré. Compare the available Vanilla and Strawberry family packs, and contact SOEICAM for availability or enquiries for a small catering occasion.",
      ],
      "Classic dairy taste, gentle sweetness and smooth spoonable consistency.",
      ["Group breakfasts", "Family gatherings", "Shared dessert service"],
    ),
    fr: entry(
      "Un format familial YOLA Nature pour les moments généreux à partager. Le seau de 2,5 kg apporte le goût brassé classique, légèrement doux, aux petits-déjeuners de groupe et aux desserts des grandes tablées.",
      [
        "YOLA Nature 2,5 kg est le format familial des tables plus nombreuses. Le goût Nature familier et la consistance brassée onctueuse se retrouvent dans un seau généreux, comme autre option aux petits conditionnements pour les occasions partagées.",
        "Pensez à un petit-déjeuner de groupe, une réunion familiale ou un dessert réparti dans des bols. Vous choisissez les portions : aucun rendement ni nombre de parts n'est annoncé. Cette référence Nature se distingue de Non Sucré. Comparez les formats familiaux Vanille et Fraise et renseignez-vous auprès de SOEICAM, y compris pour une petite réception.",
      ],
      "Goût laitier classique, douceur légère et consistance onctueuse à la cuillère.",
      [
        "Petits-déjeuners de groupe",
        "Réunions familiales",
        "Service de desserts à partager",
      ],
    ),
  },
  "stirred-vanilla-2.5kg": {
    en: entry(
      "Give shared yogurt occasions an aromatic twist with YOLA Vanilla 2.5 kg. This family bucket offers creamy stirred yogurt for gatherings, generous household breakfasts and chilled desserts served to a group.",
      [
        "Vanilla 2.5 kg gives the YOLA family-pack range a soft aromatic option. The creamy stirred texture and gentle vanilla character suit people looking for a flavoured alternative to Nature when gathering around the same table.",
        "Serve chilled into individual bowls at a family breakfast, celebration or small catering occasion. The pack can be compared with Vanilla 1 kg when planning how much to order, without assuming a fixed number of servings. Strawberry and Nature provide other flavour directions in the 2.5 kg range. Contact SOEICAM to discuss your event or household requirements.",
      ],
      "Soft aromatic vanilla carried by a creamy stirred texture.",
      [
        "Family celebrations",
        "Generous breakfasts",
        "Dessert bowls for a gathering",
      ],
    ),
    fr: entry(
      "Apportez une note aromatique aux moments partagés avec YOLA Vanille 2,5 kg. Ce seau familial propose un yaourt brassé crémeux pour les réunions, les petits-déjeuners généreux et les desserts servis à plusieurs.",
      [
        "Vanille 2,5 kg offre une option aromatique à la gamme familiale YOLA. Sa texture brassée crémeuse et son parfum doux conviennent aux amateurs d'une saveur différente de Nature lorsqu'ils se retrouvent autour d'une même table.",
        "Servez-le frais dans des bols lors d'un petit-déjeuner familial, d'une célébration ou d'une petite réception. Comparez-le au Vanille 1 kg pour préparer votre commande, sans présumer d'un nombre fixe de portions. Fraise et Nature apportent d'autres profils dans la gamme 2,5 kg. Présentez vos besoins à SOEICAM pour connaître les disponibilités.",
      ],
      "Parfum de vanille doux dans une texture brassée crémeuse.",
      [
        "Célébrations familiales",
        "Petits-déjeuners généreux",
        "Desserts pour une réunion",
      ],
    ),
  },
  "stirred-strawberry-2.5kg": {
    en: entry(
      "Bring a fruity YOLA flavour to the whole table with Strawberry 2.5 kg. This family bucket combines recognisable strawberry notes with smooth stirred yogurt for gatherings and shared dessert occasions.",
      [
        "The Strawberry family pack is the fruity direction of YOLA's 2.5 kg range. Its recognisable strawberry flavour and creamy stirred texture make it an alternative to the classic Nature and softly aromatic Vanilla packs.",
        "Choose it for a family gathering, a group snack or chilled dessert bowls at a celebration. Fruit flavour does not by itself indicate pieces of fruit in the recipe. Plan quantities according to your own serving needs rather than an assumed yield. The Strawberry 500 g reference offers the same flavour direction in a smaller format; ask SOEICAM which pack suits your enquiry.",
      ],
      "Fruity strawberry character and smooth stirred creaminess.",
      ["Family gatherings", "Group snacks", "Celebration desserts"],
    ),
    fr: entry(
      "Invitez une saveur fruitée à toute la table avec YOLA Fraise 2,5 kg. Ce seau familial réunit un parfum de fraise reconnaissable et un yaourt brassé onctueux pour les réunions et les desserts partagés.",
      [
        "Le format familial Fraise est l'option fruitée de la gamme YOLA 2,5 kg. Son parfum reconnaissable et sa texture brassée crémeuse proposent une autre expérience que le goût Nature classique ou le parfum doux de Vanille.",
        "Choisissez-le pour une réunion familiale, un goûter de groupe ou des desserts frais lors d'une célébration. Un parfum fruité ne suppose pas la présence de morceaux de fruits. Préparez les quantités selon vos besoins, sans rendement présumé. La référence Fraise 500 g permet aussi de choisir un plus petit format. Demandez à SOEICAM les conditionnements disponibles.",
      ],
      "Parfum de fraise fruité et onctuosité brassée lisse.",
      ["Réunions de famille", "Goûters de groupe", "Desserts de célébration"],
    ),
  },
  "stirred-nature-10kg": {
    en: entry(
      "Discuss YOLA's 10 kg stirred yogurt pack with SOEICAM for professional requirements. The photographed pack is labelled Nature Sucré; recipe suitability, quantities and supply arrangements should be confirmed before ordering.",
      [
        "YOLA 10 kg is the large stirred-yogurt reference for professional enquiries from food-service operators, caterers, restaurants and food businesses. The available product photograph identifies this pack as Nature Sucré: it should not be assumed to be an unsweetened cooking yogurt.",
        "A larger container can be considered when planning repeated dessert service or dairy-based preparations, subject to your own recipe requirements. For sauces, marinades, shawarma or further transformation, first request the technical specification and confirm whether this particular sweetened reference is suitable. We do not present it as a validated starter for kossam or other fermentation.",
        "Tell SOEICAM your intended application, approximate demand and location. The team can discuss availability and commercial arrangements directly. No minimum order, delivery coverage, shelf life, yield or professional performance is implied here.",
      ],
      "Photographed designation: Nature Sucré. Technical suitability must be confirmed for each professional application.",
      [
        "Professional product assessment",
        "Dessert-service planning",
        "Supply and technical enquiries",
      ],
    ),
    fr: entry(
      "Échangez avec SOEICAM sur le yaourt brassé YOLA 10 kg pour vos besoins professionnels. Le visuel porte Nature Sucré : validez l'adéquation à vos recettes, les quantités et l'approvisionnement avant commande.",
      [
        "YOLA 10 kg est la grande référence brassée destinée aux demandes des professionnels de la restauration, des traiteurs et des entreprises alimentaires. La photo disponible identifie ce conditionnement comme Nature Sucré : il ne faut donc pas le considérer automatiquement comme un yaourt de cuisine non sucré.",
        "Un grand contenant peut être étudié pour un service régulier de desserts ou des préparations à base de produits laitiers, selon vos recettes. Pour les sauces, marinades, shawarmas ou une transformation ultérieure, demandez d'abord la fiche technique et confirmez l'adéquation de cette référence sucrée. Elle n'est pas présentée comme un ferment validé pour le kossam ou une autre fermentation.",
        "Précisez votre application, votre demande approximative et votre localisation à SOEICAM. Les disponibilités et modalités commerciales se discutent directement. Aucun minimum de commande, délai de livraison, durée de conservation ou rendement n'est annoncé ici.",
      ],
      "Dénomination photographiée : Nature Sucré. Adéquation technique à confirmer selon l'application professionnelle.",
      [
        "Évaluation d'un produit professionnel",
        "Préparation d'un service de desserts",
        "Demandes techniques et d'approvisionnement",
      ],
    ),
  },
  "drinkable-nature-250g": {
    en: entry(
      "Take the familiar YOLA Nature taste in a compact 250 g bottle. Its smooth drinkable consistency makes this an individual option for a chilled yogurt break away from the table.",
      [
        "Nature 250 g is the small-bottle option in YOLA's drinkable range. It brings a familiar dairy flavour and an easy-to-drink consistency to occasions when you would rather drink yogurt than use a spoon.",
        "Choose this compact format for a break at work, at school or while travelling, keeping it refrigerated as directed on the label. It differs from the Strawberry bottle through its classic Nature flavour. For a larger bottle, explore the 330 g and 500 g Nature references. Contact SOEICAM to discuss the right selection for your household or shop.",
      ],
      "Familiar Nature dairy taste in a smooth drinkable format.",
      [
        "A compact yogurt break",
        "Work or school breaks",
        "Choosing a smaller bottle",
      ],
    ),
    fr: entry(
      "Emportez le goût familier YOLA Nature dans une petite bouteille de 250 g. Sa consistance fluide en fait une option individuelle pour une pause yaourt fraîche, sans dégustation à la cuillère.",
      [
        "Nature 250 g est le petit format de la gamme YOLA à boire. Il associe une saveur laitière familière et une consistance facile à boire pour les moments où l'on préfère une bouteille à un pot dégusté à la cuillère.",
        "Choisissez ce conditionnement compact pour une pause au travail, à l'école ou en déplacement, en respectant la conservation indiquée sur l'étiquette. Il se distingue de Fraise par son goût Nature classique. Pour une bouteille plus généreuse, découvrez Nature 330 g et 500 g. Contactez SOEICAM pour composer une sélection adaptée à votre foyer ou votre commerce.",
      ],
      "Goût laitier Nature familier et consistance fluide à boire.",
      [
        "Petite pause yaourt",
        "Pauses au travail ou à l'école",
        "Choisir une petite bouteille",
      ],
    ),
  },
  "drinkable-strawberry-250g": {
    en: entry(
      "A fruity YOLA break in a small 250 g bottle. Strawberry flavour and a smooth drinkable texture offer an alternative to classic Nature when you want a compact, refreshing yogurt format.",
      [
        "YOLA Strawberry 250 g gives the small drinkable format a recognisable fruity character. Its smooth consistency is made for drinking rather than spooning, with a strawberry-flavoured direction distinct from the Nature bottle in the same size.",
        "Enjoy chilled during a short break, alongside a snack or as part of an outing where the bottle can be kept refrigerated as instructed. A fruit flavour is not a statement that fruit pieces are included. Explore Strawberry 330 g for a larger drinkable option, or the stirred range if you prefer a spoonable yogurt. Ask SOEICAM about availability.",
      ],
      "Recognisable strawberry flavour in a smooth drinkable consistency.",
      [
        "A fruity short break",
        "A small bottle with a snack",
        "Exploring drinkable flavours",
      ],
    ),
    fr: entry(
      "Une pause YOLA fruitée en petite bouteille de 250 g. Le parfum de fraise et la texture fluide proposent une autre option que Nature pour un format yaourt compact et rafraîchissant.",
      [
        "YOLA Fraise 250 g apporte un caractère fruité reconnaissable au petit format à boire. Sa consistance fluide se déguste en bouteille plutôt qu'à la cuillère, avec un parfum différent de la référence Nature de même taille.",
        "Savourez-le frais lors d'une courte pause, avec une collation ou pendant une sortie permettant de respecter la conservation indiquée. Le parfum ne constitue pas une affirmation de présence de morceaux de fruits. Découvrez Fraise 330 g pour une bouteille plus généreuse, ou la gamme brassée si vous préférez la cuillère. Demandez les disponibilités à SOEICAM.",
      ],
      "Parfum de fraise reconnaissable et consistance fluide à boire.",
      [
        "Courte pause fruitée",
        "Petite bouteille avec une collation",
        "Découverte des parfums à boire",
      ],
    ),
  },
  "drinkable-nature-330g": {
    en: entry(
      "Discover YOLA Nature in the central 330 g drinking format. A familiar dairy taste and smooth consistency offer a practical middle-sized bottle between the smaller 250 g and generous 500 g references.",
      [
        "YOLA Nature 330 g offers a middle-sized bottle within the drinkable range. Its familiar dairy character and smooth consistency suit people who enjoy the classic YOLA taste in a bottle rather than a spoonable pot.",
        "Choose it for a chilled break or alongside a meal, while following the label's storage directions. This format also lets you discover Strawberry, Vanilla and Non Sucré in the same bottle size, each with its own flavour direction. Compare with Nature 250 g or 500 g when choosing a quantity. Contact SOEICAM for product or resale enquiries.",
      ],
      "Classic Nature dairy character with a smooth, easy-to-drink texture.",
      [
        "An everyday chilled break",
        "Alongside a meal",
        "Comparing the 330 g range",
      ],
    ),
    fr: entry(
      "Découvrez YOLA Nature dans le format à boire de 330 g. Un goût laitier familier et une consistance fluide pour une bouteille intermédiaire entre le petit 250 g et le généreux 500 g.",
      [
        "YOLA Nature 330 g propose une bouteille intermédiaire dans la gamme à boire. Son caractère laitier familier et sa texture fluide conviennent aux personnes qui apprécient le goût YOLA classique en bouteille plutôt qu'en pot à la cuillère.",
        "Choisissez-le pour une pause fraîche ou avec un repas, en suivant les indications de conservation de l'étiquette. Ce format permet aussi de découvrir Fraise, Vanille et Non Sucré, avec leurs profils propres. Comparez Nature 250 g et 500 g pour choisir votre quantité. Contactez SOEICAM pour un renseignement produit ou une demande de revente.",
      ],
      "Caractère laitier Nature classique et texture fluide facile à boire.",
      [
        "Pause fraîche au quotidien",
        "Avec un repas",
        "Comparer les références 330 g",
      ],
    ),
  },
  "drinkable-unsweetened-330g": {
    en: entry(
      "YOLA Non Sucré 330 g offers a less-sweet direction within the drinkable range. Its dairy-forward character and easy-to-drink consistency give an alternative to Nature, Strawberry and Vanilla in the same bottle size.",
      [
        "The 330 g Non Sucré reference combines a smooth drinkable consistency with a dairy-forward, lightly tangy taste. Choose it because you prefer that flavour profile, rather than treating the product name as a health recommendation.",
        "Enjoy chilled on its own or alongside a meal, keeping the bottle refrigerated according to its label. This is the Non Sucré designation, not a claim of zero total sugars or suitability for a medical condition. For a spoonable alternative, explore YOLA Non Sucré stirred yogurt in 500 g and 1 kg formats. Contact SOEICAM to compare availability.",
      ],
      "Dairy-forward and lightly tangy; smooth drinkable consistency.",
      [
        "A less-sweet flavour preference",
        "Alongside a meal",
        "An alternative to flavoured bottles",
      ],
    ),
    fr: entry(
      "YOLA Non Sucré 330 g propose un profil moins doux dans la gamme à boire. Son caractère laitier et sa consistance fluide offrent une alternative à Nature, Fraise et Vanille dans le même format.",
      [
        "La référence Non Sucré 330 g associe une consistance fluide à un goût laitier légèrement acidulé. Choisissez-la pour votre préférence de saveur, sans interpréter son nom comme une recommandation de santé.",
        "Dégustez-la fraîche, seule ou avec un repas, et conservez la bouteille selon son étiquette. La dénomination Non Sucré ne revendique ni zéro sucres totaux ni une adéquation à une situation médicale. Pour une autre texture, découvrez les brassés Non Sucré 500 g et 1 kg à la cuillère. Contactez SOEICAM pour comparer les références disponibles.",
      ],
      "Caractère laitier légèrement acidulé et consistance fluide à boire.",
      [
        "Préférence pour un profil moins doux",
        "Avec un repas",
        "Alternative aux bouteilles parfumées",
      ],
    ),
  },
  "drinkable-strawberry-330g": {
    en: entry(
      "Bring a fruity note to a YOLA yogurt break with Strawberry 330 g. This middle-sized bottle pairs recognisable strawberry flavour with a smooth drinkable texture for refreshing everyday occasions.",
      [
        "Strawberry 330 g is the fruity option in YOLA's central drinkable format. Its recognisable strawberry character and smooth consistency provide a different experience from Nature's classic dairy taste or Vanilla's softer aromatic notes.",
        "Enjoy the bottle chilled at a break or alongside a snack, following the storage instructions on the label. Strawberry flavour does not imply fruit pieces. Compare the smaller Strawberry 250 g bottle when you want a compact format, or the stirred Strawberry pots when you prefer a spoon. Contact SOEICAM for enquiries about this reference or stocking the drinkable range.",
      ],
      "Fruity strawberry notes in a smooth, refreshing drinkable format.",
      [
        "Fruity yogurt breaks",
        "With a snack",
        "Discovering the 330 g flavours",
      ],
    ),
    fr: entry(
      "Apportez une note fruitée à votre pause avec YOLA Fraise 330 g. Cette bouteille intermédiaire associe un parfum de fraise reconnaissable et une texture fluide pour des moments frais au quotidien.",
      [
        "Fraise 330 g est l'option fruitée du format intermédiaire YOLA à boire. Son caractère de fraise reconnaissable et sa consistance lisse offrent une expérience différente du goût laitier Nature ou des notes plus douces de Vanille.",
        "Dégustez la bouteille fraîche pendant une pause ou avec une collation, selon les indications de conservation de l'étiquette. Un parfum de fraise ne suppose pas des morceaux de fruits. Comparez le petit Fraise 250 g, ou les pots brassés Fraise pour une dégustation à la cuillère. Contactez SOEICAM pour cette référence ou pour proposer la gamme dans votre commerce.",
      ],
      "Notes fruitées de fraise et texture fluide rafraîchissante.",
      [
        "Pauses yaourt fruitées",
        "Avec une collation",
        "Découvrir les parfums 330 g",
      ],
    ),
  },
  "drinkable-vanilla-330g": {
    en: entry(
      "Soft vanilla notes distinguish this YOLA 330 g bottle from the classic and fruity drinking yogurts. An aromatic, smooth option for a chilled break in the middle-sized drinkable format.",
      [
        "YOLA Vanilla 330 g gives the drinkable range a soft aromatic flavour. Smooth and easy to drink, it brings vanilla notes to a bottle format rather than the thicker experience of stirred Vanilla yogurt.",
        "Choose it chilled for a work break, an afternoon pause or alongside a snack, with storage guided by the label. The 330 g range also includes Nature, Strawberry and Non Sucré, making flavour comparison straightforward. If you enjoy vanilla with a spoon, explore the 500 g, 1 kg and 2.5 kg stirred references. Ask SOEICAM about availability and commercial supply.",
      ],
      "Soft vanilla aroma and smooth drinkable consistency.",
      [
        "An aromatic afternoon break",
        "With a snack",
        "Comparing drinkable and stirred vanilla",
      ],
    ),
    fr: entry(
      "Les notes douces de vanille distinguent cette bouteille YOLA 330 g des saveurs Nature et fruitées. Une option aromatique et fluide pour une pause fraîche dans le format à boire intermédiaire.",
      [
        "YOLA Vanille 330 g apporte une saveur aromatique douce à la gamme à boire. Sa consistance lisse permet de retrouver le parfum de vanille en bouteille, pour une expérience différente de la texture plus épaisse du brassé Vanille.",
        "Choisissez-le frais pour une pause au travail, dans l'après-midi ou avec une collation, en suivant la conservation de l'étiquette. Le format 330 g réunit aussi Nature, Fraise et Non Sucré pour comparer facilement les parfums. Si vous préférez la cuillère, découvrez les brassés Vanille 500 g, 1 kg et 2,5 kg. Renseignez-vous auprès de SOEICAM.",
      ],
      "Parfum de vanille doux et consistance fluide à boire.",
      [
        "Pause aromatique dans l'après-midi",
        "Avec une collation",
        "Comparer la vanille brassée et à boire",
      ],
    ),
  },
  "drinkable-nature-500g": {
    en: entry(
      "Choose the generous YOLA Nature drinking bottle when you prefer a larger format. The 500 g reference brings familiar dairy flavour and smooth drinkability to a chilled yogurt occasion.",
      [
        "Nature 500 g is the most generous bottle in the current YOLA drinkable inventory. It keeps the familiar Nature dairy taste in a smooth consistency intended for drinking, rather than the spoonable texture of the stirred range.",
        "This larger bottle is an option for people who prefer more yogurt in one container. Enjoy chilled with a meal or during a yogurt break, respecting the label's storage instructions. For a smaller amount, compare Nature 250 g and 330 g. Availability and professional supply are discussed directly with SOEICAM; the 500 g designation is retained as the official existing sales unit.",
      ],
      "Familiar Nature flavour with a smooth drinkable consistency.",
      [
        "A more generous yogurt break",
        "With a meal",
        "Choosing between bottle sizes",
      ],
    ),
    fr: entry(
      "Choisissez la bouteille généreuse YOLA Nature si vous préférez un plus grand format à boire. La référence 500 g associe un goût laitier familier et une consistance fluide pour une dégustation fraîche.",
      [
        "Nature 500 g est la bouteille la plus généreuse de l'inventaire YOLA à boire actuel. Elle conserve le goût laitier familier de Nature dans une consistance faite pour boire, différente de la texture à la cuillère de la gamme brassée.",
        "Ce conditionnement s'adresse aux personnes qui préfèrent davantage de yaourt dans une bouteille. Dégustez-le frais avec un repas ou lors d'une pause, en respectant la conservation de l'étiquette. Pour une quantité plus petite, comparez Nature 250 g et 330 g. SOEICAM vous renseigne sur la disponibilité et l'approvisionnement. L'unité commerciale existante de 500 g est conservée.",
      ],
      "Saveur Nature familière et consistance lisse à boire.",
      [
        "Pause yaourt plus généreuse",
        "Avec un repas",
        "Comparer les tailles de bouteilles",
      ],
    ),
  },
};

export function productName(product: Product, language: Language) {
  if (language === "en")
    return `YOLA ${flavors.en[product.flavor]} ${product.category === "drinkable" ? "drinking yogurt" : "stirred yogurt"} ${sizeLabels[product.size].replace(",", ".")}`;
  return `YOLA ${categories[language][product.category]} ${flavors[language][product.flavor]} ${sizeLabels[product.size]}`;
}
export function productDisplayName(product: Product, language: Language) {
  const flavor =
    language === "fr" && product.flavor === "unsweetened"
      ? "Non Sucré"
      : flavors[language][product.flavor];
  const size =
    language === "fr" ? product.size.replace(".", ",") : product.size;
  const category =
    product.category === "drinkable"
      ? language === "fr"
        ? " Yaourt à Boire"
        : " Drinking Yogurt"
      : "";
  return `Yola ${flavor} ${size}${category}`;
}
export function getProductContent(product: Product, language: Language) {
  const content = productContent[product.slug]?.[language];
  if (!content)
    throw new Error(`Missing product content: ${product.slug}/${language}`);
  const name = productName(product, language);
  return {
    ...content,
    name,
    displayName: productDisplayName(product, language),
    seoTitle: `${name} | SOEICAM`,
    metaDescription: content.short,
    alt: name,
  };
}
