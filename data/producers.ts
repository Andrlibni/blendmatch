import type { Producer } from "./types";

export const producers: Producer[] = [
  {
    slug: "casa-brezza",
    name: "Casa Brezza",
    region: "Friuli Venezia Giulia",
    area: "Carso, Trieste",
    founded: 1998,
    featured: true,
    hectares: 4.5,
    farming: "Organic, no irrigation, no added yeasts",
    tagline: "Vitovska and Ribolla on the Karst plateau, aged in buried amphorae.",
    story: `On the Karst above Trieste the soil is a thin red skin over limestone, and the bora wind can blow at a hundred kilometres an hour. Marta and Igor Brezza took over a handful of terraces here in 1998, breaking the rock by hand to plant Vitovska and Malvasia where Igor's grandfather had kept a few vines for the family.

The cellar is dug into the stone itself. It stays at twelve degrees all year, and in its floor sit eleven Georgian qvevri, buried up to the neck, where the white grapes ferment on their skins for weeks or months. Nothing is added except a little sulphur at bottling, when the vintage asks for it.

The wines are savoury rather than fruity: salt, dried herbs, tea, a grip that comes from the skins. They age for years, and they taste of the place in a way that is hard to fake — mineral, windswept, a little austere and very alive.`,
  },
  {
    slug: "vigna-lucerta",
    name: "Vigna Lucerta",
    region: "Sicily",
    area: "Vittoria, Ragusa",
    founded: 2009,
    featured: true,
    hectares: 7,
    farming: "Organic and biodynamic preparations, bush-trained vines",
    tagline: "Frappato and Grillo from red sands near the southern coast of Sicily.",
    story: `Vittoria is the corner of Sicily where the sea is close and the soil is red sand over white limestone. Giulia and Tommaso Ferla grew up here among greenhouses and industrial tomatoes, and in 2009 they bought back three hectares of old alberello vines their family had sold a generation earlier.

They named the estate after the lizards that sun themselves on the dry-stone walls. The vines are worked with a mule on the steepest rows, cover crops grow between them in winter, and harvest starts at dawn to keep the grapes cool. Fermentations start on their own, in concrete and old chestnut barrels.

Their Frappato is the opposite of the heavy Sicilian red people expect: pale, perfumed, best slightly chilled. The skin-contact Grillo is a recent experiment that has quickly become a favourite in wine bars from Copenhagen to London.`,
  },
  {
    slug: "podere-gelso",
    name: "Podere Gelso",
    region: "Emilia-Romagna",
    area: "Sorbara, Modena",
    founded: 1952,
    featured: true,
    hectares: 9,
    farming: "Organic, hand harvest, refermented in bottle",
    tagline: "Lambrusco the old way: dry, cloudy and refermented in the bottle.",
    story: `Between the Secchia and Panaro rivers the soil is silt and sand left by centuries of floods. This is the home of Lambrusco di Sorbara, the palest and most fragrant of the Lambruschi, and of Podere Gelso, a farm the Malagoli family has worked since 1952 — named after the mulberry tree that still shades the farmyard.

Before tanks and pressurised autoclaves, every farmer here made sparkling wine the same way: bottle the wine in spring with a little unfermented must and let it referment in the glass, leaving its sediment, the fondo, at the bottom. Alessandro Malagoli, the third generation, has gone back to exactly that.

The result is Lambrusco as it is drunk at home in Modena: dry, cloudy if you tip the bottle, low in alcohol, with acidity that cuts through tortellini, mortadella and anything fried. Total sulphur is often below fifteen milligrams per litre.`,
  },
  {
    slug: "antica-colatura-cetarese",
    name: "Antica Colatura Cetarese",
    region: "Campania",
    area: "Cetara, Amalfi Coast",
    founded: 1964,
    featured: false,
    farming: "Anchovies fished in the Gulf of Salerno, March to July",
    tagline: "A family of fishermen ageing anchovies in chestnut barrels.",
    story: `A fishing family in Cetara, one of the last villages on the Amalfi Coast where anchovies are still salted by hand in chestnut terzigni. They are members of the Slow Food Presìdio for traditional colatura, which sets rules for the fishing season, the salt and the length of maturation.`,
  },
  {
    slug: "masseria-somma",
    name: "Masseria Somma",
    region: "Campania",
    area: "Monte Somma, Vesuvius",
    founded: 1987,
    featured: false,
    farming: "Dry-farmed on volcanic soil",
    tagline: "Piennolo tomatoes grown on the slopes of Vesuvius.",
    story: `A small farm on the northern slope of Vesuvius growing the Piennolo tomato without irrigation in black volcanic sand. The tomatoes are harvested in summer, tied in bunches (the piennoli) to ripen slowly, and preserved whole in their juice with nothing else added.`,
  },
  {
    slug: "terre-di-serra",
    name: "Terre di Serra",
    region: "Marche",
    area: "Serra de' Conti, Ancona",
    founded: 1996,
    featured: false,
    farming: "Organic rotation with heritage cereals",
    tagline: "Keepers of the cicerchia, the forgotten legume of the Marche hills.",
    story: `A cooperative of growers in the hills of Serra de' Conti who saved the local cicerchia — grass pea — from disappearing in the 1990s. Today the Presìdio unites a handful of farms that sow it in rotation with old varieties of wheat.`,
  },
  {
    slug: "terre-di-ustica",
    name: "Terre d'Ustica",
    region: "Sicily",
    area: "Ustica island, Palermo",
    founded: 2001,
    featured: false,
    farming: "Hand-sown and hand-threshed on volcanic terraces",
    tagline: "Tiny lentils from a volcanic island north of Palermo.",
    story: `Three families on the island of Ustica who still sow lentils on small terraces of volcanic soil, threshing and cleaning them largely by hand. Without the Presìdio the crop would have disappeared from the island.`,
  },
  {
    slug: "campi-del-pratomagno",
    name: "Campi del Pratomagno",
    region: "Tuscany",
    area: "Pratomagno, Arezzo",
    founded: 2004,
    featured: false,
    farming: "Unirrigated hill terraces",
    tagline: "Zolfino beans from the terraces of the Pratomagno.",
    story: `A young farm restoring abandoned terraces on the Pratomagno ridge to grow fagiolo zolfino, a small, pale yellow bean with a thin skin and a creamy texture that Tuscans traditionally cooked in a flask in the embers.`,
  },
  {
    slug: "giardini-di-noto",
    name: "Giardini di Noto",
    region: "Sicily",
    area: "Noto, Siracusa",
    founded: 1979,
    featured: false,
    farming: "Old almond groves, organic",
    tagline: "Romana and Pizzuta almonds from the groves around Noto.",
    story: `An old family grove in the countryside of Noto, growing the Romana, Pizzuta and Fascionello almond varieties protected by the Presìdio. The almonds are shelled and peeled close to the farm and sold within the year.`,
  },
];

export function getProducer(slug: string) {
  return producers.find((p) => p.slug === slug);
}
