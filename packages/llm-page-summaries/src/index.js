import { injectSummary } from "./utils/injector";

export default {
  async fetch(request, env) {
    try {
      if (request.method !== "GET") {
        console.log("[Skip] Non-GET request");
        return fetch(request);
      }

      const url = new URL(request.url);
      const pathname = url.pathname;

      const userAgent = request.headers.get("user-agent");
      console.log(`[Debug] User-Agent: ${userAgent}`);

      // For Googlebot requests, let the SEO worker handle it directly
      if (userAgent?.includes("Googlebot")) {
        console.log("[Debug] Detected Googlebot, forwarding to SEO worker");
        // Forward the original request to ensure prerender works
        return fetch(request, {
          cf: {
            worker: {
              serviceBinding: "seo_edge",
            },
          },
        });
      }

      // For non-Googlebot requests, proceed with normal flow
      console.log("[SEO Worker] Calling SEO Edge Worker");
      const seoResponse = await fetch(request, {
        cf: {
          worker: {
            serviceBinding: "seo_edge",
          },
        },
      });

      const { results } = await env.DB.prepare(
        "SELECT llm_summary FROM page_content WHERE url_path = ?"
      )
        .bind(pathname)
        .all();

      if (!results || results.length === 0) {
        console.log(`[Skip] No pre-generated summary found for ${pathname}`);
        return seoResponse;
      }

      const summary = results[0].llm_summary;
      const contentType = seoResponse.headers.get("content-type") || "";

      if (!contentType.includes("text/html")) {
        console.log("[Skip] Non-HTML content");
        return seoResponse;
      }

      const html = await seoResponse.text();
      console.log("[Process] Adding summary to prerendered HTML");
      const modifiedHtml = await injectSummary(html, summary);

      // Ensure we're returning a valid Response object
      return new Response(modifiedHtml, {
        headers: seoResponse.headers,
        status: seoResponse.status,
        statusText: seoResponse.statusText,
      });
    } catch (error) {
      console.error("[Error]", error);
      // Forward to SEO worker on error
      return fetch(request, {
        cf: {
          worker: {
            serviceBinding: "seo_edge",
          },
        },
      });
    }
  },
};
