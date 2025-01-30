import { homepageRules, isHomepage } from "./homepage";
import { blogRules, getBlogRules, isBlogPost } from "./blog";
// Import other section rules as needed

/**
 * Get rules for any URL
 * @param {string} url - Full URL of the request
 * @returns {object|null} - Matching rule set or null if no match
 */
export function getRulesForUrl(url) {
  // Check homepage first
  if (isHomepage(url)) {
    return homepageRules;
  }

  // Check blog posts
  if (isBlogPost(url)) {
    return getBlogRules(url);
  }

  // Add other sections here
  // if (isServicesPage(url)) {
  //   return getServicesRules(url);
  // }

  return null;
}

/**
 * Check if URL should be processed
 * @param {string} url - URL to check
 * @param {string} contentType - Content-Type header
 * @returns {boolean} - Whether the URL should be processed
 */
export function shouldProcessUrl(url, contentType) {
  if (!contentType || !contentType.includes("text/html")) {
    return false;
  }

  const urlObj = new URL(url);
  const skipPaths = [
    "/wp-admin",
    "/wp-json",
    "/wp-content",
    "/_static",
    "/assets",
  ];

  return !skipPaths.some((path) => urlObj.pathname.startsWith(path));
}
