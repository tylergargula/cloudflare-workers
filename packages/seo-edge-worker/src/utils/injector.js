export function injectSummary(html, summary) {
  if (!html || typeof html !== "string") {
    console.error("[Injector] Invalid HTML input");
    return html;
  }

  if (!summary || typeof summary !== "string") {
    console.error("[Injector] Invalid summary input");
    return html;
  }

  try {
    console.log("[Injector] Creating summary HTML element");
    const summaryHtml = `
      <div class="article-summary" style="
        background-color: #f0f7f0;
        font-size: 0.875rem;
        padding: 1.25rem;
        margin: 1.5rem 0;
        border-radius: 8px;
        border-left: 4px solid #10b981;
        font-family: system-ui, -apple-system, sans-serif;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        transition: all 0.3s ease;
        position: relative;
        background: linear-gradient(to right, #f0f7f0, #ffffff);
      ">
        <div style="
          display: flex;
          align-items: center;
          margin-bottom: 0.5rem;
          color: #047857;
          font-weight: 600;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 18px; height: 18px; margin-right: 8px; fill: #047857;">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2zm0-2h2V7h-2z"/>
          </svg>
          <strong>Who this is for:</strong>
        </div>
        <p style="
          margin: 0;
          line-height: 1.6;
          color: #374151;
        ">${summary}</p>
      </div>
      <style>
        .article-summary:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transform: translateY(-1px);
        }
      </style>
    `;

    const lottieRegex = /(<dotlottie-player[^>]*>.*?<\/dotlottie-player>)/is;

    if (!html.match(lottieRegex)) {
      console.log("[Injector] Warning: dotlottie-player not found");
      return html;
    }

    const modified = html.replace(lottieRegex, `$1${summaryHtml}`);

    console.log("[Injector] Successfully injected summary");
    return modified;
  } catch (error) {
    console.error("[Injector] Error:", error);
    return html;
  }
}
