addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Get the original response
  const response = await fetch(request)
  
  // Check if it's an HTML page
  const contentType = response.headers.get('content-type')
  if (!contentType || !contentType.includes('text/html')) {
    return response
  }

  // Get the HTML content
  const html = await response.text()

  // Create the hreflang tag
  const hreflangTag = '<link rel="alternate" hreflang="en-us" href="' + request.url + '" />'

  // Insert the hreflang tag into the head section
  const modifiedHtml = html.replace(
    /<head>/i,
    '<head>\n    ' + hreflangTag
  )

  // Return modified response
  return new Response(modifiedHtml, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  })
}