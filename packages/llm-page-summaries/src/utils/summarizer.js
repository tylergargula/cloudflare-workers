export async function generateSummary(content, env) {
  if (!content || typeof content !== "string") {
    console.error("[Summarizer] Invalid content input");
    return null;
  }

  try {
    console.log("[Summarizer] Preparing content for summary");

    // Limit content length if needed
    const maxLength = 4000;
    const truncatedContent =
      content.length > maxLength
        ? content.slice(0, maxLength) + "..."
        : content;

    const messages = [
      {
        role: "system",
        content:
          "You are a technical content analyst, please analyze this text snippet: \n\n" +
          truncatedContent,
      },
      {
        role: "user",
        content: `Based on the content above, create 1 concise sentence (<= 160 characters) 'Who this is for' summary of the following text, 
          focusing on who this article is for and what benefit or use they can get out of the content.
          
          Rules: 
          1. Only give me the summary, do not provide an introductory explaining your actions.
          `,
      },
    ];

    console.log("[Summarizer] Calling LLM API");
    const llmResponse = await env.AI.run("@cf/meta/llama-3-8b-instruct", {
      messages,
    });

    if (!llmResponse || !llmResponse.response) {
      console.log("[Summarizer] No response from LLM");
      return null;
    }

    console.log("[Summarizer] Successfully generated summary");
    return llmResponse.response;
  } catch (error) {
    console.error("[Summarizer] Error:", error);
    return null;
  }
}
