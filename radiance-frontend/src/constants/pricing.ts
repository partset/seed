export type PricingTier = {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
};

export const pricingTiers: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    price: "$750",
    description:
      "A simple, polished landing page to launch your online presence.",
    features: [
      "Custom landing page design",
      "Mobile-responsive layout",
      "Basic call-to-action sections",
    ],
    ctaLabel: "Learn More",
    ctaHref: "/contact",
  },
  {
    id: "growth",
    name: "Growth",
    price: "$1500+",
    description:
      "A landing page plus custom internal pages for a fuller website.",
    features: [
      "Everything in Starter",
      "Custom pages beyond the landing page",
      "Scalable structure for business growth",
    ],
    ctaLabel: "Learn More",
    ctaHref: "/contact",
  },
  {
    id: "commerce",
    name: "Commerce",
    price: "$2500+",
    description:
      "A landing page with ecommerce capabilities for selling online.",
    features: [
      "Everything in Growth",
      "Ecommerce functionality",
      "Product and checkout-ready experience",
    ],
    ctaLabel: "Learn More",
    ctaHref: "/contact",
  },
];

export const pricingCustomEstimate = {
  title: "Need something more custom?",
  description:
    "If none of these packages fit what you need, contact us with your goals and we’ll provide a reasonable estimate based on your project.",
  ctaLabel: "Contact Us",
  ctaHref: "/contact",
};
