addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

const languageGreetings = {
    'en': 'WELCOME!',
    'es': '¡BIENVENIDO!',
    'fr': 'BIENVENUE!',
    'de': 'WILLKOMMEN!',
    'it': 'BENVENUTO!',
    'pt': 'BEM-VINDO!',
    'ja': 'ようこそ!',
    'ko': '환영합니다!',
    'zh': '欢迎!',
    'default': 'WELCOME!'
};

const locationGreetings = {
    // Europe
    'FR': 'Bonjour de France! 🇫🇷',
    'DE': 'Guten Tag aus Deutschland! 🇩🇪',
    'IT': 'Ciao dall\'Italia! 🇮🇹',
    'ES': '¡Hola desde España! 🇪🇸',
    'PT': 'Olá de Portugal! 🇵🇹',
    
    // Asia
    'JP': 'ようこそ日本から! 🇯🇵',
    'KR': '한국에서 환영합니다! 🇰🇷',
    'CN': '来自中国的问候! 🇨🇳',
    
    // Americas
    'US': 'Greetings from the USA! 🇺🇸',
    'CA': 'Hello from Canada! 🇨🇦',
    'MX': '¡Saludos desde México! 🇲🇽',
    'BR': 'Saudações do Brasil! 🇧🇷',
    
    'default': 'Welcome, global visitor! 🌍'
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

    // Get User-Agent first to check for bots
    const userAgent = request.headers.get('user-agent') || ''
    
    let greetingContent = ''
    if (userAgent.includes('Googlebot')) {
        greetingContent = 'HELLO GOOGLEBOT! 🤖<br> Is this cloaking? You decide! (please rank my site better)'
    } else {
        // Only get language and location for non-bot visitors
        const acceptLanguage = request.headers.get('accept-language') || 'en'
        const browserLanguage = acceptLanguage.split(',')[0].split('-')[0].toLowerCase()
        const country = request.cf?.country || 'default'
        console.log('Detected country:', country)

        const languageGreeting = languageGreetings[browserLanguage] || languageGreetings['default']
        const locationGreeting = locationGreetings[country] || locationGreetings['default']
        
        greetingContent = `${languageGreeting}<br>${locationGreeting}`
    }

    let html = await response.text()

    const eyebrowHtml = `
    <div class="alignwide is-layout-constrained" style="
        font-size: 0.875rem;
        letter-spacing: 0.1em;
        color: #666;
        font-weight: 500;
        margin-left: auto !important;
        margin-right: auto !important;
        max-width: var(--wp--style--global--wide-size);
        display: block;
    ">
        ${greetingContent}
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