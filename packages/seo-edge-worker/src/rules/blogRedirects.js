// src/rules/blogRedirects.js
const redirectRules = {
  "/seo-image-optimization-linux-commands":
    "/blog/seo-image-optimization-linux-commands",
  "/seo-image-optimization-linux-commands/":
    "/blog/seo-image-optimization-linux-commands", // handle both with and without trailing slash
};

export const shouldRedirect = (url) => {
  const path = new URL(url).pathname;
  return path in redirectRules;
};

export const getRedirectUrl = (url) => {
  const currentUrl = new URL(url);
  const path = currentUrl.pathname;

  if (path in redirectRules) {
    return `${currentUrl.origin}${redirectRules[path]}`;
  }
  return url;
};

// We don't need URL rewriting since we want the content to be served from the /blog path
export const shouldRewrite = () => false;
export const getOriginalUrl = (url) => url;
