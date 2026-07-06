export type ImageKey =
  | "aboutFarmer"
  | "galleryHarvest"
  | "galleryPackaging"
  | "galleryRoasting"
  | "galleryWarehouse"
  | "galleryWorkshop"
  | "heroPlantation"
  | "productGreen"
  | "productGrind"
  | "productRoasted";

export type IconKey =
  | "circleDot"
  | "coffee"
  | "flame"
  | "handHeart"
  | "headphones"
  | "leaf"
  | "mail"
  | "mapPin"
  | "messageCircle"
  | "package"
  | "shieldCheck"
  | "sprout"
  | "truck"
  | "warehouse"
  | "wrench";

export type EmphasisHeading = {
  before: string;
  emphasis: string;
  after: string;
};

type Link = {
  href: string;
  label: string;
};

type ImageContent = {
  image: ImageKey;
  alt: string;
};

export type SiteContent = {
  global: {
    brand: {
      name: string;
      logoLetter: string;
      homeHref: string;
    };
    nav: {
      menuAriaLabel: string;
      links: Link[];
      cta: Link;
    };
    whatsapp: {
      href: string;
      ariaLabel: string;
    };
    footer: {
      tagline: string;
      copyrightLocation: string;
    };
  };
  seo: {
    title: string;
    description: string;
    openGraphTitle: string;
    openGraphDescription: string;
    openGraphType: string;
    twitterCard: string;
  };
  system: {
    notFound: {
      code: string;
      title: string;
      description: string;
      homeLabel: string;
    };
    error: {
      title: string;
      description: string;
      retryLabel: string;
      homeLabel: string;
    };
  };
  hero: {
    backgroundImage: ImageKey;
    backgroundAlt: string;
    eyebrow: string;
    headlineStatic: string;
    typedPhrases: string[];
    description: string;
    ctas: Array<Link & { variant: "primary" | "secondary" }>;
    scrollLabel: string;
  };
  about: {
    image: ImageKey;
    imageAlt: string;
    badge: {
      label: string;
      value: string;
    };
    eyebrow: string;
    heading: EmphasisHeading;
    description: string;
    stats: Array<{
      value: number;
      suffix: string;
      label: string;
    }>;
  };
  gallery: {
    eyebrow: string;
    heading: EmphasisHeading;
    description: string;
    itemEyebrow: string;
    items: Array<ImageContent & { label: string; span: "default" | "large" | "tall" | "wide" }>;
  };
  supplyChain: {
    eyebrow: string;
    heading: EmphasisHeading;
    description: string;
    mobileHeading: EmphasisHeading;
    mobileDescription: string;
    currentStageLabel: string;
    stageAriaPrefix: string;
    stageAriaSuffix: string;
    cta: Link;
    stages: Array<
      ImageContent & {
        icon: IconKey;
        title: string;
        label: string;
        description: string;
      }
    >;
  };
  whyUs: {
    eyebrow: string;
    heading: EmphasisHeading;
    features: Array<{
      icon: IconKey;
      title: string;
      description: string;
    }>;
  };
  products: {
    eyebrow: string;
    heading: EmphasisHeading;
    description: string;
    cta: Link;
    items: Array<
      ImageContent & {
        emoji: string;
        name: string;
        description: string;
        features: string[];
        origin: string;
        originBadge: string;
      }
    >;
  };
  contact: {
    eyebrow: string;
    heading: EmphasisHeading;
    description: string;
    rows: Array<{
      icon: IconKey;
      label: string;
      value: string;
      href?: string;
    }>;
    map: {
      title: string;
      src: string;
    };
    form: {
      title: string;
      subtitle: string;
      fields: Array<{
        label: string;
        name: string;
        type: string;
        placeholder?: string;
      }>;
      messageLabel: string;
      submitLabel: string;
      successLabel: string;
    };
  };
};
