/**
 * Checks if the user agent string belongs to Googlebot
 * @param {string} userAgent - The User-Agent header string
 * @returns {boolean} - True if the request is from Googlebot
 */
export function isGoogleBot(userAgent) {
  const googleBotPatterns = [
    /Googlebot/i,
    /Googlebot-Image/i,
    /Googlebot-News/i,
    /Googlebot-Video/i,
    /Googlebot-Mobile/i,
    /AdsBot-Google/i,
  ];

  return googleBotPatterns.some((pattern) => pattern.test(userAgent));
}

/**
 * Validates if the Googlebot request is authentic
 * This can be expanded later to include IP validation
 * @param {string} userAgent - The User-Agent header string
 * @param {string} ip - The IP address of the requester
 * @returns {Promise<boolean>} - True if the request is from a valid Googlebot
 */
export async function isAuthenticGoogleBot(userAgent, ip) {
  // Basic check for now
  return isGoogleBot(userAgent);

  // TODO: Implement reverse DNS lookup and validation
  // https://developers.google.com/search/docs/crawling-indexing/verifying-googlebot
}
