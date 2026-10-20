/**
 * Basic legal templates. They are placeholders to be reviewed by a lawyer
 * before going live (company details, jurisdiction, alcohol rules per country).
 */
export const legalPages: Record<string, { title: string; body: string }> = {
  terms: {
    title: "Terms of sale",
    body: `These terms apply to every order placed on lento.example by private customers ("you") with Lento S.r.l., [registered address], VAT IT00000000000 ("we").

## Age
We sell alcohol only to people aged 18 or over, or the legal drinking age in the country of delivery if higher. We may ask for proof of age at delivery.

## Prices
Retail prices include VAT and excise duty for the country of delivery. Trade prices are shown excluding VAT and apply only to approved business accounts.

## Orders and payment
An order is accepted when we send a confirmation e-mail. Payment is taken at checkout by card through our payment provider.

## Right of withdrawal
You may withdraw from the contract within 14 days of delivery without giving a reason, by writing to hello@lento.example. Products must be returned unopened. Perishable foods are excluded once opened.

## Applicable law
Italian law applies, without prejudice to the mandatory consumer protections of your country of residence.`,
  },
  shipping: {
    title: "Shipping & returns",
    body: `We ship to the United Kingdom, Ireland, Denmark, Sweden, Finland, Norway, the Netherlands, Belgium, Germany, Austria and Italy.

## Costs
Delivery is free for retail orders over €120 (or the equivalent in GBP). Below that, a flat fee of €12 applies. Trade deliveries are quoted on the pro-forma invoice.

## Times
Orders leave our bonded warehouse within 2 working days. Delivery usually takes 3–6 working days, longer for Norway and the UK because of customs clearance.

## Breakages
If a bottle arrives broken, send us a photo within 48 hours and we will replace or refund it.`,
  },
  privacy: {
    title: "Privacy policy",
    body: `Lento S.r.l. is the data controller for the personal data you give us when you order, create a trade account or write to us.

## What we collect
Name, contact details, delivery address, order history and, for trade accounts, company name and VAT number. Payment data is handled by our payment provider and never stored by us.

## Why
To process orders and invoices (contract and legal obligations), to verify VAT numbers through the European Commission VIES service and HMRC, and — only with your consent — to send newsletters.

## Your rights
You can access, correct or delete your data, object to processing or ask for portability by writing to privacy@lento.example. You can also complain to your data protection authority.`,
  },
  cookies: {
    title: "Cookies",
    body: `We use only the cookies needed for the site to work:

- lento_age — remembers that you confirmed you are of legal drinking age (1 year);
- lento_currency — remembers your currency (1 year);
- authjs.session-token — keeps trade customers signed in (session).

Your cart is stored in your browser's local storage. We do not use advertising or tracking cookies.`,
  },
};
