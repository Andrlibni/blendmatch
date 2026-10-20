import type { Story } from "./types";

export const stories: Story[] = [
  {
    slug: "the-karst-in-amphora",
    kicker: "Carso, Friuli Venezia Giulia",
    title: "The Karst, in amphora",
    excerpt:
      "On a limestone plateau swept by the bora, Casa Brezza ferments white grapes on their skins in clay jars buried in the rock.",
    producer: "casa-brezza",
    products: ["ribolla-gialla-anfora", "vitovska-kamen", "malvasia-istriana"],
    readingMinutes: 4,
    body: `There is almost no soil on the Karst. What there is lies in red pockets between slabs of white limestone, and every vineyard here was made by hand, breaking the rock and carrying earth up from the dolines. When Marta and Igor Brezza started in 1998, they planted the same grapes Igor's grandfather had kept: Vitovska, Malvasia, a little Terrano.

## A cellar in the stone

The cellar is a cave cut into the plateau. Its floor holds eleven qvevri, the egg-shaped clay jars of Georgia, buried to the neck so that the rock keeps them at a steady twelve degrees. After harvest the white grapes go in whole, skins and all, and are left alone. Fermentation starts by itself. The jars are sealed, and opened again in spring.

What comes out is not what most people expect from a white wine. The colour is amber, the smell is of dried fruit, herbs and tea, and there is a grip on the palate — tannin from the skins — that makes these wines feel closer to reds at the table.

## Why skin contact

Skin contact is not a fashion on this border; it is how white wine was made here for centuries, on both sides of what is now the Italian–Slovenian frontier. The skins protect the wine, which is why the Brezzas can bottle with very little sulphur. And they carry the taste of the place: the salt of the sea ten kilometres away, the bitterness of the wild herbs that grow between the rows.

Open these bottles a little before dinner, serve them at cellar temperature rather than fridge-cold, and give them food with some substance.`,
  },
  {
    slug: "vittoria-lightly",
    kicker: "Vittoria, Sicily",
    title: "Vittoria, lightly",
    excerpt:
      "Sicilian red does not have to be heavy. In the red sands near Ragusa, Vigna Lucerta makes Frappato you can chill.",
    producer: "vigna-lucerta",
    products: ["frappato-lucerta", "grillo-scirocco", "terra-rossa-nero-frappato"],
    readingMinutes: 3,
    body: `Drive south from Ragusa towards the sea and the land flattens into red sand, broken by white limestone and by the long plastic roofs of the greenhouses that made this coast rich in the 1980s. Between them, a few old vineyards survived. Giulia and Tommaso Ferla bought back three hectares of them in 2009.

## The grape nobody bottled alone

Frappato was, for most of the last century, a supporting actor: a pale, perfumed grape used to soften the dark Nero d'Avola in the local blend. The Ferlas thought it deserved better. Their Frappato comes from forty-year-old bush vines on the sandiest plot, fermented in whole bunches and kept in concrete so that nothing covers its smell of wild strawberries and roses.

Serve it slightly cool, around fourteen degrees, with tuna, caponata or pizza. It is a red for the Mediterranean summer, and for northern restaurants that want a red wine their guests can drink with fish.

## A wind called Scirocco

In 2019 a hot African wind blew through the harvest. The Ferlas put some Grillo into a single amphora with its skins, to see what would happen. The wine that came out — citrus peel, honey, wild fennel and a gentle tannin — is now the one wine bars ask for first.`,
  },
  {
    slug: "bubbles-from-the-bottom",
    kicker: "Sorbara, Emilia-Romagna",
    title: "Bubbles from the bottom",
    excerpt:
      "Long before autoclaves, every Lambrusco was refermented in the bottle. Podere Gelso still makes it that way, sediment and all.",
    producer: "podere-gelso",
    products: ["sorbara-col-fondo", "nebbia-trebbiano-frizzante", "sorbara-col-fondo-magnum"],
    readingMinutes: 3,
    body: `In the farmhouses of the Po valley, sparkling wine was never a luxury. It was what you made every spring: bottle the new wine with a little sweet must kept back from harvest, and the yeast left in it would wake up in the warmth, turn the sugar into bubbles, and settle at the bottom of the bottle as a fine sediment. The fondo.

## Going back

From the 1960s, Lambrusco moved into pressurised tanks and became the sweet, cheap, fizzy red that conquered export markets. At Podere Gelso, Alessandro Malagoli, the third generation on the farm, decided to go back to his grandfather's method — no tank, no added sugar, no disgorging.

His Lambrusco di Sorbara is coral pink, bone dry, low in alcohol and sharply acidic. You can pour it clear, or tip the bottle and drink it cloudy, as they do at home in Modena. Total sulphur is often under fifteen milligrams per litre.

## At the table

The acidity is the point. It cuts through the fat of mortadella and tortellini in brodo, of fried dough and cured pork. It is a wine for lunch, for large tables, for not taking things too seriously — which is why we also bring it in magnum.`,
  },
  {
    slug: "why-we-import-presidi",
    kicker: "Slow Food Presìdi",
    title: "Why we import Presìdi",
    excerpt:
      "A drop of colatura, a jar of Piennolo tomatoes: small foods kept alive by the people who still make them, and by those who buy them.",
    products: [
      "colatura-di-alici-di-cetara",
      "pomodorino-del-piennolo-del-vesuvio",
      "cicerchia-di-serra-de-conti",
      "fagiolo-zolfino",
    ],
    readingMinutes: 4,
    body: `A Slow Food Presìdio is a promise made by a group of producers. They agree on how a traditional food should be made — which variety, which area, which season, which technique — and Slow Food helps them tell its story and find people who will pay a fair price for it. There are more than three hundred in Italy.

## Colatura, the old way

In Cetara, on the Amalfi Coast, anchovies fished between March and July are gutted, layered with sea salt in chestnut barrels and pressed under stones. Over many months a clear amber liquid forms. It is collected, poured back over the fish, and finally drawn off through a hole in the bottom of the barrel. This is colatura, the descendant of the Roman garum. A few drops on spaghetti with garlic and oil are enough.

## Seeds worth saving

Cicerchia from Serra de' Conti, zolfino beans from the Pratomagno, lentils from the island of Ustica: legumes that fed generations of farming families and then almost disappeared, because their yields were low and their work was hard. Each Presìdio is a handful of farms that decided to keep sowing them.

## What it means to buy them

We buy directly from these producers, at prices they set, and we sell to people and restaurants who will use them well. It is a very small trade. But for a food that exists in a few tonnes a year, a few hundred jars sold in Copenhagen or London can be the difference between keeping on and giving up.`,
  },
];

export function getStory(slug: string) {
  return stories.find((s) => s.slug === slug);
}
