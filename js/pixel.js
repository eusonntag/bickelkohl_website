// ===== Facebook Pixel + Conversions API (CAPI) =====
// Deduplicação: cada evento gera um eventID único compartilhado
// entre o pixel browser e o CAPI para evitar contagem dupla.
//
// ⚠️  NOTA DE SEGURANÇA: Em produção, o ideal é rotear as
// chamadas CAPI por uma função serverless (Vercel, Netlify, etc.)
// para não expor o token no código cliente.

(function () {
  const PIXEL_ID   = '1272067420484452';
  const CAPI_TOKEN = 'EAAIfuT2YhssBQ8HtZBf7DyyrpFYyaZAqZC7iTvweHLIeY79Yt8YBwQXREuLo3uXR90pg1OKRoliZCCmeZCobvP9IxW1eBW5Bg80gWilgwdxyHoKy4zZBcUFWXvzwG1pmhnZAbU6nZCAZCg8eaN0gZCQ35saucrFMMh9t2y3HepLT3UO6OHB7M88x5YcrFlEF5BVr3XYwZDZD';
  const CAPI_URL   = 'https://graph.facebook.com/v21.0/' + PIXEL_ID + '/events';

  // --- Gera um event_id único por evento ---
  function genEventId() {
    return 'ev_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
  }

  // --- Envia evento via Conversions API ---
  function sendCAPI(eventName, eventId) {
    var payload = {
      data: [{
        event_name:        eventName,
        event_time:        Math.floor(Date.now() / 1000),
        event_id:          eventId,
        event_source_url:  window.location.href,
        action_source:     'website',
        client_user_agent: navigator.userAgent
      }]
    };

    fetch(CAPI_URL + '?access_token=' + CAPI_TOKEN, {
      method:    'POST',
      headers:   { 'Content-Type': 'application/json' },
      body:      JSON.stringify(payload),
      keepalive: true   // garante envio mesmo se o usuário navegar para fora
    }).catch(function () {}); // falha silenciosa
  }

  // --- Init do pixel ---
  if (typeof fbq === 'undefined') return;
  fbq('init', PIXEL_ID);

  // ---- PageView ----
  var pageviewId = genEventId();
  fbq('track', 'PageView', {}, { eventID: pageviewId });
  sendCAPI('PageView', pageviewId);

  // ---- Contact (todos os cliques em links do WhatsApp) ----
  function fireContact() {
    var contactId = genEventId();
    fbq('track', 'Contact', {}, { eventID: contactId });
    sendCAPI('Contact', contactId);
  }

  // Delegação de evento: captura qualquer link wa.me na página
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href*="wa.me"]');
    if (link) fireContact();
  });

  // Formulário de contato (também abre WhatsApp)
  var form = document.getElementById('contactForm');
  if (form) {
    // Fase de captura para disparar antes do submit do main.js
    form.addEventListener('submit', fireContact, true);
  }
})();
