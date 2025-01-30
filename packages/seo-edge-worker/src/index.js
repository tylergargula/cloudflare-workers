import { isGoogleBot } from "./utils/userAgent";
import { getRulesForUrl, shouldProcessUrl } from "./rules";
import { updateMetadata } from "./utils/htmlParser";

export default {
  async fetch(request, env, ctx) {
    const url = request.url;
    const userAgent = request.headers.get("User-Agent") || "";

    // First, get the response
    const response = await fetch(request);
    const contentType = response.headers.get("content-type") || "";

    // Only process HTML content from Googlebot
    if (!contentType.includes("text/html") || !isGoogleBot(userAgent)) {
      return response;
    }

    // Get and apply rules if they exist
    const rules = getRulesForUrl(url);
    if (rules) {
      const originalHtml = await response.text();
      const transformedHtml = updateMetadata(originalHtml, rules);

      return new Response(transformedHtml, {
        headers: {
          ...Object.fromEntries(response.headers),
          "Content-Type": "text/html",
        },
      });
    }

    return response;
  },
};
