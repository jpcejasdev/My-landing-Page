const MAX_PER_HOUR = 15; // límite anti-spam de consultas por hora

function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    // Campo trampa anti-bots
    if (data.website) return json_({ ok: true });

    const name = clean_(data.name, 80);
    const phone = clean_(data.phone, 30);
    const email = clean_(data.email, 120);
    const reason = clean_(data.reason, 1000);
    const lang = data.lang === 'en' ? 'EN' : 'ES';

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    const phoneDigits = phone.replace(/\D/g, '');
    if (name.length < 2 || phoneDigits.length < 8 || !validEmail || reason.length < 10) {
      return json_({ ok: false, error: 'invalid' });
    }

    // Límite simple de envíos por hora
    const cache = CacheService.getScriptCache();
    const hourKey = 'count_' + Utilities.formatDate(new Date(), 'GMT', 'yyyyMMddHH');
    const count = Number(cache.get(hourKey) || 0);
    if (count >= MAX_PER_HOUR) return json_({ ok: false, error: 'rate_limited' });
    cache.put(hourKey, String(count + 1), 3600);

    const text = [
      '*Nueva consulta desde tu web* (' + lang + ')',
      '',
      '*Nombre:* ' + name,
      '*Celular:* ' + phone,
      '*Email:* ' + email,
      '',
      '*Motivo:*',
      reason,
      '',
      'Responder por WhatsApp: https://wa.me/' + phoneDigits
    ].join('\n');

    const ok = sendWhatsApp_(text);
    return json_({ ok: ok });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function probarWhatsApp() {
  const ok = sendWhatsApp_('✅ Prueba: el formulario de tu web ya puede enviarte mensajes.');
  Logger.log(ok ? 'Mensaje enviado. Revisá tu WhatsApp.' : 'Falló el envío. Revisá las Propiedades del script.');
}

function sendWhatsApp_(text) {
  const props = PropertiesService.getScriptProperties();
  const phone = props.getProperty('WHATSAPP_PHONE');
  const apikey = props.getProperty('CALLMEBOT_APIKEY');
  if (!phone || !apikey) throw new Error('Faltan WHATSAPP_PHONE o CALLMEBOT_APIKEY en Propiedades del script');

  const url = 'https://api.callmebot.com/whatsapp.php'
    + '?phone=' + encodeURIComponent(phone)
    + '&text=' + encodeURIComponent(text)
    + '&apikey=' + encodeURIComponent(apikey);

  const res = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  return res.getResponseCode() === 200;
}

// Quita caracteres de formato de WhatsApp para que nadie "inyecte" negritas, etc.
function clean_(value, max) {
  return String(value || '').replace(/[*_~`]/g, '').trim().slice(0, max);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
