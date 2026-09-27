/**
 * Minimal localized copy for push notifications, keyed the same way as
 * lib/i18n.js's profiles.language values (en/es/uk/pt, falling back to
 * en for anything else/unset). Kept separate from lib/i18n.js since that
 * file is browser-only (relies on `document`/`localStorage`) and these
 * templates are needed from Vercel serverless functions instead.
 */
const PUSH_COPY = {
  en: {
    tripReminder3d: (dest) => ({ title: 'Trip coming up!', body: `Your trip to ${dest} is in 3 days — is your packing list ready?` }),
    tripReminder1d: (dest) => ({ title: 'Trip tomorrow!', body: `Your trip to ${dest} starts tomorrow. Last chance to finish packing!` }),
    weatherChange: (dest) => ({ title: 'Weather update', body: `The forecast for ${dest} just changed — check if your packing list still fits.` }),
    inactivityNudge: () => ({ title: 'Planning a trip?', body: "It's been a while — come check your packing lists on Packmates AI." }),
  },
  es: {
    tripReminder3d: (dest) => ({ title: '¡Se acerca tu viaje!', body: `Tu viaje a ${dest} es en 3 días — ¿ya tienes lista tu lista de empaque?` }),
    tripReminder1d: (dest) => ({ title: '¡Viaje mañana!', body: `Tu viaje a ${dest} empieza mañana. ¡Última oportunidad para terminar de empacar!` }),
    weatherChange: (dest) => ({ title: 'Actualización del clima', body: `El pronóstico para ${dest} acaba de cambiar — revisa si tu lista de empaque sigue siendo la correcta.` }),
    inactivityNudge: () => ({ title: '¿Planeando un viaje?', body: 'Ha pasado un tiempo — revisa tus listas de empaque en Packmates AI.' }),
  },
  uk: {
    tripReminder3d: (dest) => ({ title: 'Скоро подорож!', body: `Ваша подорож до ${dest} через 3 дні — список речей готовий?` }),
    tripReminder1d: (dest) => ({ title: 'Подорож завтра!', body: `Ваша подорож до ${dest} починається завтра. Останній шанс закінчити пакування!` }),
    weatherChange: (dest) => ({ title: 'Оновлення погоди', body: `Прогноз для ${dest} щойно змінився — перевірте, чи актуальний ваш список речей.` }),
    inactivityNudge: () => ({ title: 'Плануєте подорож?', body: 'Давно вас не було — перегляньте свої списки речей у Packmates AI.' }),
  },
  pt: {
    tripReminder3d: (dest) => ({ title: 'Viagem chegando!', body: `Sua viagem para ${dest} é em 3 dias — sua lista de itens já está pronta?` }),
    tripReminder1d: (dest) => ({ title: 'Viagem amanhã!', body: `Sua viagem para ${dest} começa amanhã. Última chance de terminar de arrumar as malas!` }),
    weatherChange: (dest) => ({ title: 'Atualização do clima', body: `A previsão para ${dest} acabou de mudar — confira se sua lista de itens ainda está adequada.` }),
    inactivityNudge: () => ({ title: 'Planejando uma viagem?', body: 'Faz um tempo — dá uma olhada nas suas listas de empaque no Packmates AI.' }),
  },
};

function pushCopy(lang, key, ...args) {
  const dict = PUSH_COPY[lang] || PUSH_COPY.en;
  const fn = dict[key] || PUSH_COPY.en[key];
  return fn(...args);
}

module.exports = { pushCopy };
