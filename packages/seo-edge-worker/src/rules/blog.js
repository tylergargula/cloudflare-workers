/**
 * SEO rules for blog posts
 */

// Default blog post meta structure to inherit from
const defaultBlogMeta = {
  additionalMeta: {
    "og:type": "article",
    robots: "index, follow",
  },
};

// Individual blog post rules
export const blogRules = {
  "/automated-seo-redirect-mapping": {
    title:
      "Automated SEO Redirect Mapping With Python - SEO Redirect Automation - Python SEO Redirect Mapping - Screaming Frog Redirect Mappings",
    metaDescription:
      "SEO Redirect Automation,Python SEO Redirect Mapping with Screaming Frog. Learn how to leverage Screaming Frog and Python to automate the creation of an SEO redirect mapping for site migrations.",
    additionalMeta: {
      ...defaultBlogMeta.additionalMeta,
      canonical: "https://tylergargula.dev/automated-seo-redirect-mapping/",
      "og:title": "Automated SEO Redirect Mapping Guide",
      "og:description":
        "Learn how to automate SEO redirect mapping for successful website migrations.",
    },
  },
  // Add more blog posts as needed
};

/**
 * Get rules for a specific blog URL
 * @param {string} url - Full URL of the request
 * @returns {object|null} - Matching rule set or null if no match
 */
export function getBlogRules(url) {
  const urlObj = new URL(url);
  let path = urlObj.pathname.replace(/\/$/, ""); // Remove trailing slash if present
  return blogRules[path] || null;
}

/**
 * Check if URL is a blog post
 * @param {string} url - URL to check
 * @returns {boolean} - Whether the URL is a blog post
 */
export function isBlogPost(url) {
  const urlObj = new URL(url);
  const path = urlObj.pathname.replace(/\/$/, ""); // Remove trailing slash for consistent matching
  return Object.keys(blogRules).includes(path);
}
