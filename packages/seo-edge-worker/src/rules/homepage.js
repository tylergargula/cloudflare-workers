/**
 * SEO rules for the homepage
 */
export const homepageRules = {
  // URL pattern to match the homepage
  pattern: /^\/?$/, // Matches "/" or "" (empty path)

  // Title transformation
  title:
    "Tyler Gargula - Python SEO, Tech SEO, SEO Consultant, Technical SEO, SEO Migration Specialist, Chicago SEO SEO Director",

  // Meta description transformation
  metaDescription:
    "Python SEO, Tech SEO, SEO Consultant, Technical SEO, SEO Migration Specialist, SEO Specialist",

  // Additional meta tags
  additionalMeta: {
    robots: "index, follow",
    "og:title": "Tyler Gargula - Python SEO & Technical SEO Consultant",
    "og:description":
      "Python SEO, Tech SEO, SEO Consultant, Technical SEO, SEO Migration Specialist, SEO Specialist",
    "og:type": "website",
    "og:url": "https://tylergargula.dev/",
    "twitter:title": "Tyler Gargula - Python SEO & Technical SEO Consultant",
    "twitter:description":
      "Python SEO, Tech SEO, SEO Consultant, Technical SEO, SEO Migration Specialist, SEO Specialist",
  },
};

export function isHomepage(url) {
  const urlPath = new URL(url).pathname;
  return homepageRules.pattern.test(urlPath);
}

export function getHomepageRules(url) {
  return isHomepage(url) ? homepageRules : null;
}
