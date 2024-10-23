addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
    }
)

const greetings = {
  'en': 'Welcome!',
  'es': '¡Bienvenidos!',
  'fr': 'Bienvenue!',
  'de': 'Willkommen!',
  'it': 'Benvenuto!',
  'pt': 'Bem-vindo!',
  'ja': 'ようこそ!',
  'ko': '환영합니다!',
  'zh': '欢迎!',
  'default': 'Welcome!'
};

async function handleRequest(request) {
    console.log('Worker is running')
    
    const url = new URL(request.url)
    console.log('URL:', request.url)
    console.log('Pathname:', url.pathname)

    if (url.pathname !== '/') {
        console.log('Not homepage, skipping')
        return fetch(request)
    }

    console.log('Homepage detected')
    const response = await fetch(request)
    
    const contentType = response.headers.get('content-type')
    console.log('Content-Type:', contentType)
    if (!contentType || !contentType.includes('text/html')) {
        return response
    }

    const acceptLanguage = request.headers.get('accept-language') || 'en'
    const browserLanguage = acceptLanguage.split(',')[0].split('-')[0].toLowerCase()

    const greeting = greetings[browserLanguage] || greetings['default']

    let html = await response.text()

    const eyebrowHtml = `
  <div class="alignwide is-layout-constrained" style="
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #666;
    font-weight: 500;
    margin-left: auto !important;
    margin-right: auto !important;
    max-width: var(--wp--style--global--wide-size);
    display: block;
  ">
    ${greeting}
  </div>
`

  const targetH1 = '<h1 class="alignwide wp-block-heading" style="margin-bottom:var(--wp--preset--spacing--60)">Technical SEO &amp; Software Dev.</h1>'

  const modifiedHtml = html.replace(
    targetH1, 
    eyebrowHtml + targetH1
  )

    return new Response(modifiedHtml, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
    })
}