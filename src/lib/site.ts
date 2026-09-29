// Business details and copy shown across the site, taken from the current sattva.com.au
// (September 2026). Confirm with the client before launch.
export const site = {
  name: "Sattva Homes",
  url: "https://sattva.com.au",
  tagline: "Homes in balance.",
  /** The slogan from the current site. */
  slogan: "Where smart living begins",
  description:
    "Sattva Homes is a Brisbane home builder with 128 single and double storey house designs. Find one to suit your block and visit our Willawong display home.",
  phone: "07 3708 1091",
  phoneHref: "tel:+61737081091",
  email: "info@sattva.com.au",
  address: {
    street: "71 Waters Street",
    suburb: "Willawong",
    state: "QLD",
    postcode: "4110",
  },
  hours: [
    { days: "Mon–Fri", time: "11am–6pm", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "11:00", closes: "18:00" },
    { days: "Sat–Sun", time: "9am–5pm", dayOfWeek: ["Saturday", "Sunday"], opens: "09:00", closes: "17:00" },
  ],
  stats: [
    { value: 73, prefix: "", suffix: "+", label: "Homes completed" },
    { value: 12, prefix: "", suffix: "+", label: "Building right now" },
    { value: 18341, prefix: "", suffix: "m²", label: "Of homes built" },
    { value: 24, prefix: "$", suffix: "M+", label: "In homes delivered" },
  ],
  /** Where the contact form lets people say they want to build. */
  buildLocations: ["Brisbane", "Adelaide"],
  acknowledgement:
    "Sattva Homes acknowledges the Traditional Custodians of the land on which we live, learn and work. We pay our respects to Elders past and present, and extend that respect to all Aboriginal and Torres Strait Islander peoples.",
  /** Display home welcome, from the current homepage. */
  displayHomeIntro:
    "Discover the perfect blend of elegance and modern living at our display home in the heart of Willawong. We invite you to experience the future of comfortable living and exceptional design.",
  /** "Why choose our floor plans?" from the current homepage. The expired $20,000 offer is left out. */
  values: [
    {
      title: "Tailored Designs",
      kicker: "Crafting uniqueness",
      text: "Our journey begins with you: your dreams, aspirations and the way you envision your home. Our architects and designers work closely with you to create a home design that captures your style, from contemporary elegance to timeless classics.",
    },
    {
      title: "Quality Craftsmanship",
      kicker: "Built to last",
      text: "We build homes that stand the test of time. Our skilled builders and trades take pride in their craft and attend to every detail, from the foundation to the finishing touches, using only top-tier materials.",
    },
    {
      title: "Transparency",
      kicker: "Your partner in every step",
      text: "Building your home should be open and collaborative. We keep communication clear from the first plans to the final walkthrough, and your questions, ideas and feedback are always welcome.",
    },
    {
      title: "Timely Delivery",
      kicker: "Your time matters",
      text: "We respect your time and the deadlines that matter to you. Our project management team plans and oversees every step so your home stays on schedule, without compromising on quality.",
    },
    {
      title: "Affordable Luxury",
      kicker: "Your dream, your budget",
      text: "A custom home doesn't have to mean extravagant costs. We tailor the project to your budget while still delivering quality and craftsmanship. Your home is an investment we respect.",
    },
  ],
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/designs", label: "Designs" },
  { href: "/#how-we-build", label: "How it works" },
  { href: "/contact", label: "Contact" },
] as const;

export const addressLine = `${site.address.street}, ${site.address.suburb} ${site.address.state} ${site.address.postcode}`;

/** Business details for search engines (schema.org), shown on every page. */
export const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "@id": `${site.url}/#business`,
  name: site.name,
  url: site.url,
  logo: `${site.url}/images/brand/sattva-logo.png`,
  image: `${site.url}/images/home/hero-gardenwood.jpg`,
  description: site.description,
  slogan: site.slogan,
  telephone: "+61 7 3708 1091",
  email: site.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.suburb,
    addressRegion: site.address.state,
    postalCode: site.address.postcode,
    addressCountry: "AU",
  },
  openingHoursSpecification: site.hours.map((h) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: h.dayOfWeek,
    opens: h.opens,
    closes: h.closes,
  })),
};

/** Renders a schema.org object as a JSON-LD script body, escaping "<" as the Next.js docs recommend. */
export function jsonLd(data: object): { __html: string } {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
