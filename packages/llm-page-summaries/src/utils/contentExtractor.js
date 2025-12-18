export function extractMainContent(html) {
  if (!html || typeof html !== "string") {
    console.error("[Extractor] Invalid HTML input");
    return null;
  }

  try {
    // First try to find main tag
    let mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);

    // If no main tag, try article tag
    if (!mainMatch) {
      mainMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
    }

    // If still no match, try body tag
    if (!mainMatch) {
      mainMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    }

    if (!mainMatch) {
      console.log("[Extractor] No content tags found");
      return null;
    }

    const cleanContent = mainMatch[1]
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleanContent) {
      console.log("[Extractor] No content after cleaning");
      return null;
    }

    console.log("[Extractor] Successfully extracted content");
    return cleanContent;
  } catch (error) {
    console.error("[Extractor] Error:", error);
    return null;
  }
}
