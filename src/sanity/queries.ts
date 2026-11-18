export const FAQ_CATEGORIES_QUERY = `*[_type == "faqCategory"] | order(order asc){
  "id": slug.current,
  title,
  "items": *[_type == "faq" && references(^._id)] | order(order asc){
    "id": _id,
    question,
    answer,
    featuredOrder
  }
}`;

export const PRICING_QUERY = `{
  "plans": *[_type == "plan"] | order(order asc){
    "id": slug.current,
    name,
    priceMonthly,
    priceAnnual,
    priceLabel,
    description,
    features,
    ctaLabel,
    emphasis
  },
  "annualFeeNote": *[_type == "pricingSettings"][0].annualFeeNote
}`;

export const LEGAL_DOCUMENT_QUERY = `*[_type == "legalDocument" && kind == $kind]
  | order(updatedOn desc)[0]{ title, description, version, updatedOn, body }`;
