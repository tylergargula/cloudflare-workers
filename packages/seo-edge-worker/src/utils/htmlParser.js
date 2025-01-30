/**
 * Utility functions for parsing and modifying HTML content
 */

/**
 * Updates all metadata of an HTML document
 * @param {string} html - Original HTML content
 * @param {object} rules - Rules containing title, metaDescription, and additionalMeta
 * @returns {string} - Modified HTML content
 */
export function updateMetadata(html, rules) {
  // Create a staging area for all meta tags
  let metaTags = [];

  // Add meta description
  metaTags.push(`<meta name="description" content="${rules.metaDescription}">`);

  // Add additional meta tags
  if (rules.additionalMeta) {
    for (const [name, content] of Object.entries(rules.additionalMeta)) {
      if (name.startsWith("og:")) {
        metaTags.push(`<meta property="${name}" content="${content}">`);
      } else if (name.startsWith("twitter:")) {
        metaTags.push(`<meta name="${name}" content="${content}">`);
      } else if (name === "canonical") {
        // Handle canonical URL
        metaTags.push(`<link rel="canonical" href="${content}">`);
      } else {
        metaTags.push(`<meta name="${name}" content="${content}">`);
      }
    }
  }

  // Remove existing meta tags and canonical links
  html = html.replace(/<meta\s+name="description".*?>/gi, "");
  html = html.replace(/<meta\s+property="og:.*?>/gi, "");
  html = html.replace(/<meta\s+name="twitter:.*?>/gi, "");
  html = html.replace(/<link\s+rel="canonical".*?>/gi, "");

  // Update title
  html = html.replace(/<title>.*?<\/title>/i, `<title>${rules.title}</title>`);

  // Find the position after the opening head tag
  const headStartPos = html.toLowerCase().indexOf("<head>") + 6;

  // Insert all meta tags after the head opening tag
  const formattedMetaTags = "\n    " + metaTags.join("\n    ") + "\n";
  html =
    html.slice(0, headStartPos) + formattedMetaTags + html.slice(headStartPos);

  return html;
}
