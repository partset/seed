export type NavLink = {
  label: string;
  href: string;
};

export type Stat = {
  id: string;
  label: string;
  value: number;
  duration: number;
  suffix?: string;
};

export type FooterLink = {
  label: string;
  href: string;
};

export const heroContent = {
  navLinks: [
    { label: "Home", href: "/" },
    { label: "Service", href: "#" },
    { label: "Play", href: "/play" },
    { label: "Contact", href: "#" },
    { label: "Mission", href: "#" },
  ] satisfies NavLink[],

  sideLabel: {
    leftText: "Your Marketing Agency",
    rightText: "Social Media Strategy & Business Consultation",
  },

  tagline:
    "Your journey is not alone. We make your dream come reality as your partner.",

  heroWord: "TEST",

  stats: [
    {
      id: "projects",
      label: "Projects Delivered",
      value: 25,
      duration: 1200,
      suffix: "+",
    },
    {
      id: "years",
      label: "Years in Business",
      value: 1,
      duration: 800,
      suffix: "+",
    },
    {
      id: "clients",
      label: "Clients",
      value: 15,
      duration: 1200,
      suffix: "+",
    },
  ] satisfies Stat[],

  cta: {
    label: "Chase Your Dream",
    href: "#",
  },

  footer: {
    location: "California, USA",
    timezone: "America/Los_Angeles",
    centerLinks: [
      { label: "Privacy Policy", href: "#" },
    ] satisfies FooterLink[],
    copyright: "© 2026 TEST. All rights reserved.",
    socialLinks: [
      { label: "Instagram", href: "#" },
      { label: "X", href: "#" },
    ] satisfies FooterLink[],
  },
};
