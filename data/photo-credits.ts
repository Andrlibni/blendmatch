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
  },
  "colatura-di-alici-di-cetara": {
    "kind": "licensed",
    "source": "Wikimedia Commons",
    "author": "Gugerell",
    "license": "CC0",
    "url": "https://commons.wikimedia.org/wiki/File:Colatura_di_alici_a.jpg",
    "title": "Colatura di alici a.jpg"
  },
  "alici-di-menaica": {
    "kind": "licensed",
    "source": "Wikimedia Commons",
    "author": "Roger469",
    "license": "CC BY-SA 3.0",
    "url": "https://commons.wikimedia.org/wiki/File:Acciughe_sotto_sale.arbanella_di_acciughe_mature.jpg",
    "title": "Acciughe sotto sale.arbanella di acciughe mature.jpg"
  },
  "cece-di-cicerale": {
    "kind": "licensed",
    "source": "Wikimedia Commons",
    "author": "Fumikas Sagisavas",
    "license": "CC0",
    "url": "https://commons.wikimedia.org/wiki/File:Chickpeas%F0%9F%AB%98.jpg",
    "title": "Chickpeas🫘.jpg"
  },
  "oliva-salella-ammaccata": {
    "kind": "licensed",
    "source": "Wikimedia Commons",
    "author": "Shixart1985",
    "license": "CC BY 2.0",
    "url": "https://commons.wikimedia.org/wiki/File:Fresh_green_olives_and_black_olives_served_at_a_food_display.jpg",
    "title": "Fresh green olives and black olives served at a food display.jpg"
  },
  "conciato-romano": {
    "kind": "licensed",
    "source": "Wikimedia Commons",
    "author": "Jan-Tore Egge",
    "license": "CC BY-SA 4.0",
    "url": "https://commons.wikimedia.org/wiki/File:Pecorino_Metello.jpg",
    "title": "Pecorino Metello.jpg"
  },
  "fagiolo-dente-di-morto": {
    "kind": "licensed",
    "source": "Wikimedia Commons",
    "author": "Fumikas Sagisavas",
    "license": "CC0",
    "url": "https://commons.wikimedia.org/wiki/File:White_kidney_beans%F0%9F%AB%98.jpg",
    "title": "White kidney beans🫘.jpg"
  },
  "antichi-pomodori-di-napoli-pelati": {
    "kind": "licensed",
    "source": "Wikimedia Commons",
    "author": "Anna.Massini",
    "license": "CC BY-SA 4.0",
    "url": "https://commons.wikimedia.org/wiki/File:Pomodori_San_Marzano_in_maturazione_-_biologici.jpg",
    "title": "Pomodori San Marzano in maturazione - biologici.jpg"
  },
  "miele-dei-prati-del-matese": {
    "kind": "licensed",
    "source": "Wikimedia Commons",
    "author": "Shixart1985",
    "license": "CC BY 2.0",
    "url": "https://commons.wikimedia.org/wiki/File:Dipper_stick_and_honey_in_a_jar.jpg",
    "title": "Dipper stick and honey in a jar.jpg"
  },
  "pecorino-di-carmasciano": {
    "kind": "licensed",
    "source": "Wikimedia Commons",
    "author": "Unknown",
    "license": "CC BY-SA 3.0",
    "url": "https://commons.wikimedia.org/wiki/File:Pecorino_Rosso_Volterrano_one_Quarter_on_whole_TOTAL.jpg",
    "title": "Pecorino Rosso Volterrano one Quarter on whole TOTAL.jpg"
  },
  "fico-monnato-di-prignano": {
    "kind": "licensed",
    "source": "Wikimedia Commons",
    "author": "Ranjithkumar Murugesan",
    "license": "CC0",
    "url": "https://commons.wikimedia.org/wiki/File:DRIED_FIGS.jpg",
    "title": "DRIED FIGS.jpg"
  }
};

/** Landscape photos for the home page, producers and stories, keyed by "folder/slug". */
export const editorialCredits: Record<string, Extract<PhotoCredit, { kind: "licensed" }>> = {
  "home/hero": {
    "kind": "licensed",
    "source": "Wikimedia Commons",
    "author": "Giorgio Galeotti",
    "license": "CC BY 4.0",
    "url": "https://commons.wikimedia.org/wiki/File:Vineyards_-_Barolo,_Cuneo,_Itay_-_November_2,_2021.jpg",
    "title": "Vineyards - Barolo, Cuneo, Itay - November 2, 2021.jpg"
  },
  "producers/cascina-fontana": {
    "kind": "licensed",
    "source": "Wikimedia Commons",
    "author": "Christoph Strässler",
    "license": "CC BY-SA 2.0",
    "url": "https://commons.wikimedia.org/wiki/File:Castiglione_Falletto,_Piemonte,_Italy.jpg",
    "title": "Castiglione Falletto, Piemonte, Italy.jpg"
  },
  "producers/giuseppe-rinaldi": {
    "kind": "licensed",
    "source": "Wikimedia Commons",
    "author": "Christoph Strässler",
    "license": "CC BY-SA 2.0",
    "url": "https://commons.wikimedia.org/wiki/File:Barolo,_Piemonte,_Italy.jpg",
    "title": "Barolo, Piemonte, Italy.jpg"
  },
  "producers/lino-maga": {
    "kind": "licensed",
    "source": "Wikimedia Commons",
    "author": "Terensky",
    "license": "CC BY 3.0",
    "url": "https://commons.wikimedia.org/wiki/File:%22Monte%22_Fratello_-_panoramio.jpg",
    "title": "\"Monte\" Fratello - panoramio.jpg"
  },
  "producers/vallisassoli": {
    "kind": "licensed",
    "source": "Wikimedia Commons",
    "author": "Decan",
    "license": "CC BY-SA 4.0",
    "url": "https://commons.wikimedia.org/wiki/File:Cervinara_-_Partenio_visto_da_Via_Taiano.jpg",
    "title": "Cervinara - Partenio visto da Via Taiano.jpg"
  },
  "producers/podere-le-ripi": {
    "kind": "licensed",
    "source": "Wikimedia Commons",
    "author": "Tommaso laviano",
    "license": "CC BY-SA 4.0",
    "url": "https://commons.wikimedia.org/wiki/File:Camigliano(frazione_montalcino)-vista-colline-06.jpg",
    "title": "Camigliano(frazione montalcino)-vista-colline-06.jpg"
  },
  "producers/marco-tinessa": {
    "kind": "licensed",
    "source": "Wikimedia Commons",
    "author": "VallVit",
    "license": "CC BY 3.0",
    "url": "https://commons.wikimedia.org/wiki/File:Solopaca,_vigne_e_montagne_2.jpg",
    "title": "Solopaca, vigne e montagne 2.jpg"
  },
  "producers/le-boncie": {
    "kind": "licensed",
    "source": "Wikimedia Commons",
    "author": "Tom Chance",
    "license": "CC BY-SA 2.0",
    "url": "https://commons.wikimedia.org/wiki/File:Vineyards_in_the_Chianti_Classico_valleys.jpg",
    "title": "Vineyards in the Chianti Classico valleys.jpg"
  },
  "stories/barbacarlo-a-name-won-in-court": {
    "kind": "licensed",
    "source": "Wikimedia Commons",
    "author": "Terensky",
    "license": "CC BY 3.0",
    "url": "https://commons.wikimedia.org/wiki/File:Da_Sant%27Antonino,_verso_Sud_-_panoramio.jpg",
    "title": "Da Sant'Antonino, verso Sud - panoramio.jpg"
  },
  "stories/barolo-come-una-volta": {
    "kind": "licensed",
    "source": "Wikimedia Commons",
    "author": "Christoph Strässler",
    "license": "CC BY-SA 2.0",
    "url": "https://commons.wikimedia.org/wiki/File:Castiglione_Falletto_and_La_Morra,_Piemonte,_Italy.jpg",
    "title": "Castiglione Falletto and La Morra, Piemonte, Italy.jpg"
  },
  "stories/leaving-the-appellation": {
    "kind": "licensed",
    "source": "Wikimedia Commons",
    "author": "Anna.Massini",
    "license": "CC BY 4.0",
    "url": "https://commons.wikimedia.org/wiki/File:Campagna_nei_pressi_di_Castelnuovo_Berardenga.jpg",
    "title": "Campagna nei pressi di Castelnuovo Berardenga.jpg"
  }
};
