import { getRulesForUrl, shouldProcessUrl } from "./rules";
import { updateMetadata } from "./utils/htmlParser";
import { injectSummary } from "./utils/injector";

async function getSummaryForPath(pathname, env) {
  try {
    // First check the new table (seo_element_testing)
    const { results } = await env.DB.prepare(
      "SELECT url_title, url_description FROM seo_element_testing WHERE url_path = ?"
    )
      .bind(pathname)
      .all();

    if (results && results.length > 0) {
      return {
        title: results[0].url_title,
        description: results[0].url_description,
        source: "new_db",
      };
    }

    // Fallback to the old table if needed
    const { results: oldResults } = await env.DB.prepare(
      "SELECT llm_summary FROM page_content WHERE url_path = ?"
    )
      .bind(pathname)
      .all();

    return oldResults && oldResults.length > 0
      ? { summary: oldResults[0].llm_summary, source: "old_db" }
      : null;
  } catch (error) {
    console.error("[DB Error]", error);
    return null;
  }
}

async function processHtml(html, url, env, userAgent) {
  try {
    let modified = false;

    // Apply SEO rules if they exist
    const rules = getRulesForUrl(url.href);
    if (rules) {
      console.log("[Metadata] Applying SEO rules for", url.pathname);
      html = updateMetadata(html, rules);
      modified = true;
    }

    // Check and inject data from either database
    const data = await getSummaryForPath(url.pathname, env);

    if (data) {
      console.log(`[Data] Found data for ${url.pathname} from ${data.source}`);
      console.log("[Debug] User Agent:", userAgent);

      if (data.source === "new_db") {
        // Handle data from the new database
        html = updateMetadata(html, {
          title: data.title,
          description: data.description,
        });
        modified = true;
      } else if (data.source === "old_db" && data.summary) {
        // Handle data from the old database
        html = await injectSummary(html, data.summary);
        modified = true;
      }
    }

    return { html, modified };
  } catch (error) {
    console.error("[ProcessHTML Error]", error);
    return { html, modified: false };
  }
}

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const userAgent = request.headers.get("User-Agent") || "";

      // Check for AI referrer redirect first
      const aiRedirectResponse = await env.AI_REDIRECT.fetch(request.clone());
      if (aiRedirectResponse.status === 302) {
        console.log("[AI Redirect] Redirecting due to AI referrer");
        return aiRedirectResponse;
      }

      // Fetch the normal response
      const response = await fetch(request);

      // Ensure we have a valid response
      if (!response) {
        console.log("[Error] No response received");
        return fetch(request);
      }

      const contentType = response.headers.get("content-type") || "";

      // Only process HTML content
      if (!contentType.includes("text/html")) {
        console.log("[Skip] Non-HTML content:", contentType);
        return response;
      }

      let html = await response.text();

      // Skip processing if we don't have valid HTML
      if (!html) {
        console.log("[Skip] No HTML content to process");
        return response;
      }

      // Process HTML with SEO rules and database metadata
      const { html: processedHtml, modified } = await processHtml(
        html,
        url,
        env,
        userAgent
      );

      // Return modified response if changes were made
      if (modified && processedHtml) {
        console.log("[Response] Returning modified HTML for", url.pathname);
        return new Response(processedHtml, {
          headers: {
            ...Object.fromEntries(response.headers),
            "Content-Type": "text/html",
          },
        });
      }

      // If no modifications were made or processing failed, return original response
      console.log("[Response] No modifications needed for", url.pathname);
      return new Response(html, {
        headers: {
          ...Object.fromEntries(response.headers),
          "Content-Type": "text/html",
        },
      });
    } catch (err) {
      console.error("[Error]", err);
      // On any error, fall back to original request
      return fetch(request);
    }
  },
};
