/**
 * Where each product photo comes from. Generated while assembling the demo.
 *
 * - "retailer": bottle shots taken from online wine shops, used only for this
 *   non-public demo. They must be replaced with photos supplied by the
 *   producers (or your own) before the shop goes live.
 * - "licensed": freely licensed photos (Wikimedia Commons). They show the kind
 *   of product, not the producer's own pack, and their licence requires the
 *   credit shown on the Credits page.
 */
export type PhotoCredit =
  | { kind: "retailer"; source: string; url: string }
  | { kind: "licensed"; source: string; author: string; license: string; url: string; title: string };

export const photoCredits: Record<string, PhotoCredit> = {
  "cascina-fontana-dolcetto-d-alba": {
    "kind": "retailer",
    "source": "Bottle of Italy",
    "url": "https://cdn.shopify.com/s/files/1/0538/2268/5356/files/Dolcettod_AlbaDOC-CascinaFontana-min_88079f75-e2c8-4a9a-a0b3-fda130607756.jpg"
  },
  "cascina-fontana-langhe-freisa": {
    "kind": "retailer",
    "source": "Bottle of Italy",
    "url": "https://cdn.shopify.com/s/files/1/0538/2268/5356/files/FreisaLangheDOC-CascinaFontana-min.jpg"
  },
  "cascina-fontana-barbera-d-alba": {
    "kind": "retailer",
    "source": "Bottle of Italy",
    "url": "https://cdn.shopify.com/s/files/1/0538/2268/5356/files/Barberad_AlbaDOC-CascinaFontana-min.jpg"
  },
  "cascina-fontana-langhe-nebbiolo": {
    "kind": "retailer",
    "source": "Xtrawine",
    "url": "https://cdn.shopify.com/s/files/1/0652/6789/2395/files/cascina-fontana-langhe-nebbiolo-2024_60489_1_1824f002-c32f-4385-acdd-7e014154510a.webp"
  },
  "cascina-fontana-barolo": {
    "kind": "retailer",
    "source": "Flatiron Wines",
    "url": "https://cdn.shopify.com/s/files/1/0125/1518/0601/files/Cascina-Fontana-Barolo-2020-Red-Wine-Flatiron-Wines-Spirits-New-York_b05ad95b.jpg"
  },
  "rinaldi-dolcetto-d-alba": {
    "kind": "retailer",
    "source": "Leon & Son",
    "url": "https://cdn.shopify.com/s/files/1/0680/5327/0827/files/2012GiuseppeRinaldiDolcettod_Alba_Piedmont_Italy.jpg"
  },
  "rinaldi-barolo-tre-tine": {
    "kind": "retailer",
    "source": "Bottle of Italy",
    "url": "https://cdn.shopify.com/s/files/1/0538/2268/5356/files/Barolo-DOC-Tre-Tine-G-Rinaldi-Bottle-of-Italy.jpg"
  },
  "rinaldi-barolo-brunate": {
    "kind": "retailer",
    "source": "Flatiron Wines",
    "url": "https://cdn.shopify.com/s/files/1/0125/1518/0601/files/Giuseppe-Rinaldi-Barolo-Brunate-2021-Red-Wine-Flatiron-Wines-Spirits-New-York.jpg"
  },
  "lino-maga-barbacarlo": {
    "kind": "retailer",
    "source": "Xtrawine",
    "url": "https://cdn.shopify.com/s/files/1/0652/6789/2395/files/lino-maga-barbacarlo-2021_51588_1_7c26cc55-fcb4-49dc-a5bf-1ffe2f61829a.webp"
  },
  "lino-maga-montebuono": {
    "kind": "retailer",
    "source": "Bottle of Italy",
    "url": "https://cdn.shopify.com/s/files/1/0538/2268/5356/files/Montebuono-LinoMaga-min.jpg"
  },
  "vallisassoli-33-33-33": {
    "kind": "retailer",
    "source": "Leon & Son",
    "url": "https://cdn.shopify.com/s/files/1/0680/5327/0827/files/2019Vallisassoli_33_33_33_CampaniaIGPBianco.jpg"
  },
  "vallisassoli-michelangelo-magnum": {
    "kind": "retailer",
    "source": "Leon & Son",
    "url": "https://cdn.shopify.com/s/files/1/0680/5327/0827/files/2019VallisassoliMichelangeloCampaniaIGPBianco1.5LMagnum.jpg"
  },
  "le-ripi-sogni-e-follia": {
    "kind": "retailer",
    "source": "Leon & Son",
    "url": "https://cdn.shopify.com/s/files/1/0680/5327/0827/files/2021PodereLeRipi_Sogni_Follia_RossodiMontalcino_Tuscany_Italy.jpg"
  },
  "le-ripi-cielo-d-ulisse": {
    "kind": "retailer",
    "source": "Leon & Son",
    "url": "https://cdn.shopify.com/s/files/1/0680/5327/0827/files/2020PodereLeRipi_Cielod_Ulisse_BrunellodiMontalcinoDOCG_Italy.jpg"
  },
  "le-ripi-amore-e-magia": {
    "kind": "retailer",
    "source": "Leon & Son",
    "url": "https://cdn.shopify.com/s/files/1/0680/5327/0827/files/2020PodereLeRipi_Amore_Magia_BrunellodiMontalcinoDOCG_Italy.jpg"
  },
  "le-ripi-lupi-e-sirene": {
    "kind": "retailer",
    "source": "Leon & Son",
    "url": "https://cdn.shopify.com/s/files/1/0680/5327/0827/files/2019PodereLeRipi_LupieSirene_Riserva_BrunellodiMontalcinoDOCG_Italy.jpg"
  },
  "tinessa-ognostro-bianco": {
    "kind": "retailer",
    "source": "More Natural Wine",
    "url": "https://cdn.shopify.com/s/files/1/0221/6407/8692/products/Ognostro-bianco.png"
  },
  "tinessa-ognostro-rosso": {
    "kind": "retailer",
    "source": "Biondivino",
    "url": "https://cdn.shopify.com/s/files/1/1016/7695/products/MarcoTinessaOgnostroRossoAglianicoCampania2017.jpg"
  },
  "le-boncie-cinque": {
    "kind": "retailer",
    "source": "Leon & Son",
    "url": "https://cdn.shopify.com/s/files/1/0680/5327/0827/files/2023PodereLeBoncieToscanaRosso_Cinque_Tuscany_Italy.jpg"
  },
  "le-boncie-chiesamonti": {
    "kind": "retailer",
    "source": "Leon & Son",
    "url": "https://cdn.shopify.com/s/files/1/0680/5327/0827/files/2023PodereLeBoncie_Chiesamonti_ToscanaRossoIGT_Tuscany_Italy.jpg"
  },
  "le-boncie-le-trame": {
    "kind": "retailer",
    "source": "Bottle of Italy",
    "url": "https://cdn.shopify.com/s/files/1/0538/2268/5356/files/Sangiovese-IGT-Le-Trame-Le-Boncie-Bottle-of-Italy.jpg"
  },
  "rinaldi-langhe-nebbiolo": {
    "kind": "retailer",
    "source": "Callmewine",
    "url": "https://cdn.shopify.com/s/files/1/0650/4356/2708/files/nebbiolo-giuseppe-rinaldi-2022_61451_742bdc02-b81b-49b3-bd39-efd4c4bc1f19.jpg"
  }
};
