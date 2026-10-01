/**
 * Minimal localized copy for push notifications, keyed the same way as
 * lib/i18n.js's profiles.language values (en/es/uk/pt, falling back to
 * en for anything else/unset). Kept separate from lib/i18n.js since that
 * file is browser-only (relies on `document`/`localStorage`) and these
 * templates are needed from Vercel serverless functions instead.
 */
/* inactivityNudge has 20 distinct variants rather than one repeated
   message, so a person nudged twice a week for weeks on end sees real
   variety instead of the same line over and over - see
   api/notify-inactive-users.js's rotation logic (picks the next one
   based on how many this person has already received, wrapping at 20).
   First 10: feature/engagement angles (trip planning, the smart
   checklist itself, community/social, the streak/badge system,
   destination inspiration, weather-aware packing, collaborative
   packing, badge-progress, seasonal daydreaming, quick/easy trip
   creation). Second 10: concrete packing/travel tips (roll vs fold,
   carry-on backup outfit, packing cubes, wearing bulky items, document
   backups, luggage tags, rechecking the forecast, an empty water
   bottle, offline maps, leaving room for souvenirs). */
const PUSH_COPY = {
  en: {
    tripReminder3d: (dest) => ({ title: 'Trip coming up! 🧳', body: `Your trip to ${dest} is in 3 days — is your packing list ready?` }),
    tripReminder1d: (dest) => ({ title: 'Trip tomorrow! ⏰', body: `Your trip to ${dest} starts tomorrow. Last chance to finish packing!` }),
    weatherChange: (dest) => ({ title: 'Weather update 🌦️', body: `The forecast for ${dest} just changed — check if your packing list still fits.` }),
    inactivityNudge: [
      () => ({ title: 'Where to next? ✈️', body: 'Start a new trip and get a packing list built around your destination, dates, and activities.' }),
      () => ({ title: "Never forget an item again 🧳", body: 'Packmates AI builds your checklist from real weather and plans — not a generic template.' }),
      () => ({ title: 'See where others are headed 🌍', body: 'Browse Community Travelers on Packmates AI for real trip and packing inspiration.' }),
      () => ({ title: 'Keep your streak going 🔥', body: "Your packing streak and traveler level are waiting — don't let them go cold." }),
      () => ({ title: 'Need inspiration? 💡', body: 'Check out curated packing lists for top destinations on Packmates AI.' }),
      () => ({ title: 'Packs for the weather, not just the trip 🌦️', body: 'Get a list that adjusts to the real forecast for your destination — not a one-size-fits-all template.' }),
      () => ({ title: 'Pack together 🤝', body: 'Share your packing list with travel companions and check items off together in real time.' }),
      () => ({ title: "You're close to leveling up 🏅", body: 'Keep packing and planning trips to reach your next traveler badge on Packmates AI.' }),
      () => ({ title: 'Dreaming of your next getaway? 🏖️✈️', body: 'Turn it into a real trip — Packmates AI handles the packing list for you.' }),
      () => ({ title: 'Plan a trip in seconds ⚡', body: 'Just enter your destination and dates — Packmates AI builds the rest of your packing list.' }),
      () => ({ title: 'Roll, don\'t fold 👕', body: 'Rolling your clothes instead of folding them saves up to 30% more suitcase space.' }),
      () => ({ title: 'Pack a backup outfit in your carry-on 🎒', body: 'Keep a change of clothes and essentials with you in case checked luggage is delayed.' }),
      () => ({ title: 'Try packing cubes 📦', body: 'Packing cubes keep your bag organized and compress bulky items to save space.' }),
      () => ({ title: 'Wear your bulkiest items 🧥', body: 'Travel in your heaviest shoes and jacket to free up suitcase space for everything else.' }),
      () => ({ title: 'Back up your documents 📄🛂', body: 'Keep a photo or digital copy of your passport and ID in case the originals get lost.' }),
      () => ({ title: 'Tag your bag inside and out 🏷️', body: 'Put a tag with your contact info both outside and inside your suitcase.' }),
      () => ({ title: 'Check the forecast one more time 🌤️', body: 'Weather can shift — recheck your destination\'s forecast the day before you leave.' }),
      () => ({ title: 'Bring an empty water bottle 💧', body: 'Fill it up after airport security instead of buying one — better for your wallet too.' }),
      () => ({ title: 'Download offline maps 🗺️', body: 'Grab offline maps for your destination before you go, in case you lose signal.' }),
      () => ({ title: 'Leave room for souvenirs 🎁', body: 'Pack a foldable bag or leave a little extra space for anything you pick up on the trip.' }),
    ],
  },
  es: {
    tripReminder3d: (dest) => ({ title: '¡Se acerca tu viaje! 🧳', body: `Tu viaje a ${dest} es en 3 días — ¿ya tienes lista tu lista de empaque?` }),
    tripReminder1d: (dest) => ({ title: '¡Viaje mañana! ⏰', body: `Tu viaje a ${dest} empieza mañana. ¡Última oportunidad para terminar de empacar!` }),
    weatherChange: (dest) => ({ title: 'Actualización del clima 🌦️', body: `El pronóstico para ${dest} acaba de cambiar — revisa si tu lista de empaque sigue siendo la correcta.` }),
    inactivityNudge: [
      () => ({ title: '¿A dónde vas ahora? ✈️', body: 'Crea un nuevo viaje y obtén una lista de empaque según tu destino, fechas y actividades.' }),
      () => ({ title: 'Nunca olvides nada 🧳', body: 'Packmates AI arma tu lista con el clima real y tus planes — no con una plantilla genérica.' }),
      () => ({ title: 'Mira a dónde van otros 🌍', body: 'Explora Viajeros de la Comunidad en Packmates AI para inspirarte con viajes reales.' }),
      () => ({ title: 'Mantén tu racha activa 🔥', body: 'Tu racha de empaque y tu nivel de viajero te esperan — no dejes que se enfríen.' }),
      () => ({ title: '¿Buscas inspiración? 💡', body: 'Descubre listas de empaque para los destinos más populares en Packmates AI.' }),
      () => ({ title: 'Empaca según el clima, no solo el viaje 🌦️', body: 'Obtén una lista que se adapta al pronóstico real de tu destino — no una plantilla genérica.' }),
      () => ({ title: 'Empaquen juntos 🤝', body: 'Comparte tu lista de empaque con tus compañeros de viaje y marquen los artículos juntos en tiempo real.' }),
      () => ({ title: 'Estás cerca de subir de nivel 🏅', body: 'Sigue empacando y planeando viajes para alcanzar tu próxima insignia de viajero en Packmates AI.' }),
      () => ({ title: '¿Soñando con tu próxima escapada? 🏖️✈️', body: 'Convértela en un viaje real — Packmates AI se encarga de tu lista de empaque.' }),
      () => ({ title: 'Planea un viaje en segundos ⚡', body: 'Solo ingresa tu destino y fechas — Packmates AI arma el resto de tu lista de empaque.' }),
      () => ({ title: 'Enrolla, no dobles 👕', body: 'Enrollar tu ropa en lugar de doblarla puede ahorrar hasta un 30% más de espacio en la maleta.' }),
      () => ({ title: 'Lleva una muda en tu equipaje de mano 🎒', body: 'Guarda una muda y lo esencial contigo por si se retrasa el equipaje facturado.' }),
      () => ({ title: 'Prueba los organizadores de equipaje 📦', body: 'Los organizadores (packing cubes) mantienen tu maleta ordenada y comprimen la ropa voluminosa.' }),
      () => ({ title: 'Usa tus prendas más voluminosas 🧥', body: 'Viaja con tus zapatos y chaqueta más pesados puestos para ahorrar espacio en la maleta.' }),
      () => ({ title: 'Respalda tus documentos 📄🛂', body: 'Guarda una foto o copia digital de tu pasaporte e identificación por si pierdes los originales.' }),
      () => ({ title: 'Etiqueta tu maleta por dentro y por fuera 🏷️', body: 'Pon una etiqueta con tus datos de contacto tanto por fuera como por dentro de tu maleta.' }),
      () => ({ title: 'Revisa el clima una vez más 🌤️', body: 'El clima puede cambiar — revisa el pronóstico de tu destino un día antes de salir.' }),
      () => ({ title: 'Lleva una botella de agua vacía 💧', body: 'Llénala después de pasar seguridad en vez de comprar una — también ahorras dinero.' }),
      () => ({ title: 'Descarga mapas sin conexión 🗺️', body: 'Descarga mapas sin conexión de tu destino antes de salir, por si no tienes señal.' }),
      () => ({ title: 'Deja espacio para souvenirs 🎁', body: 'Lleva una bolsa plegable o deja espacio extra para lo que compres en el viaje.' }),
    ],
  },
  uk: {
    tripReminder3d: (dest) => ({ title: 'Скоро подорож! 🧳', body: `Ваша подорож до ${dest} через 3 дні — список речей готовий?` }),
    tripReminder1d: (dest) => ({ title: 'Подорож завтра! ⏰', body: `Ваша подорож до ${dest} починається завтра. Останній шанс закінчити пакування!` }),
    weatherChange: (dest) => ({ title: 'Оновлення погоди 🌦️', body: `Прогноз для ${dest} щойно змінився — перевірте, чи актуальний ваш список речей.` }),
    inactivityNudge: [
      () => ({ title: 'Куди далі? ✈️', body: 'Створіть нову подорож і отримайте список речей на основі напрямку, дат і активностей.' }),
      () => ({ title: 'Більше нічого не забувайте 🧳', body: 'Packmates AI складає список на основі реальної погоди й планів — а не шаблону.' }),
      () => ({ title: 'Подивіться, куди їдуть інші 🌍', body: 'Перегляньте Мандрівників спільноти в Packmates AI для реального натхнення.' }),
      () => ({ title: 'Не втрачайте серію 🔥', body: 'Ваша серія пакування та рівень мандрівника чекають — не дайте їм згаснути.' }),
      () => ({ title: 'Потрібне натхнення? 💡', body: 'Перегляньте добірку списків речей для популярних напрямків у Packmates AI.' }),
      () => ({ title: 'Пакуйтеся під погоду, а не лише під поїздку 🌦️', body: 'Отримайте список, що враховує реальний прогноз для вашого напрямку — а не шаблон на всі випадки.' }),
      () => ({ title: 'Пакуйтеся разом 🤝', body: 'Поділіться списком речей із супутниками та відмічайте пункти разом у реальному часі.' }),
      () => ({ title: 'Ви близько до нового рівня 🏅', body: 'Продовжуйте пакувати та планувати подорожі, щоб отримати новий бейдж мандрівника в Packmates AI.' }),
      () => ({ title: 'Мрієте про наступну подорож? 🏖️✈️', body: 'Перетворіть це на реальну подорож — Packmates AI подбає про список речей.' }),
      () => ({ title: 'Сплануйте подорож за секунди ⚡', body: 'Просто вкажіть напрямок і дати — Packmates AI створить решту вашого списку речей.' }),
      () => ({ title: 'Згортайте, а не складайте 👕', body: 'Згортання одягу замість складання економить до 30% більше місця у валізі.' }),
      () => ({ title: 'Візьміть зміну одягу в ручну поклажу 🎒', body: 'Тримайте зміну одягу та необхідне з собою на випадок затримки багажу.' }),
      () => ({ title: 'Спробуйте органайзери для валізи 📦', body: 'Органайзери тримають речі впорядкованими та стискають об\'ємний одяг.' }),
      () => ({ title: 'Носіть найоб\'ємніші речі 🧥', body: 'Одягніть найважче взуття та куртку під час подорожі, щоб звільнити місце у валізі.' }),
      () => ({ title: 'Зробіть копію документів 📄🛂', body: 'Зберігайте фото або цифрову копію паспорта й документів на випадок їх втрати.' }),
      () => ({ title: 'Прикріпіть бирки зовні та всередині 🏷️', body: 'Прикріпіть бирку з контактами як зовні, так і всередині валізи.' }),
      () => ({ title: 'Перевірте погоду ще раз 🌤️', body: 'Погода може змінитися — перевірте прогноз для напрямку за день до виїзду.' }),
      () => ({ title: 'Візьміть порожню пляшку для води 💧', body: 'Наповніть її після контролю безпеки замість купівлі нової — це ще й економія.' }),
      () => ({ title: 'Завантажте офлайн-карти 🗺️', body: 'Завантажте офлайн-карти напрямку заздалегідь, на випадок відсутності зв\'язку.' }),
      () => ({ title: 'Залиште місце для сувенірів 🎁', body: 'Візьміть складану сумку або залиште трохи вільного місця для сувенірів.' }),
    ],
  },
  pt: {
    tripReminder3d: (dest) => ({ title: 'Viagem chegando! 🧳', body: `Sua viagem para ${dest} é em 3 dias — sua lista de itens já está pronta?` }),
    tripReminder1d: (dest) => ({ title: 'Viagem amanhã! ⏰', body: `Sua viagem para ${dest} começa amanhã. Última chance de terminar de arrumar as malas!` }),
    weatherChange: (dest) => ({ title: 'Atualização do clima 🌦️', body: `A previsão para ${dest} acabou de mudar — confira se sua lista de itens ainda está adequada.` }),
    inactivityNudge: [
      () => ({ title: 'Para onde agora? ✈️', body: 'Crie uma nova viagem e receba uma lista de itens baseada no destino, datas e atividades.' }),
      () => ({ title: 'Nunca mais esqueça nada 🧳', body: 'O Packmates AI monta sua lista com o clima real e seus planos — não um modelo genérico.' }),
      () => ({ title: 'Veja para onde os outros vão 🌍', body: 'Explore Viajantes da Comunidade no Packmates AI e se inspire com viagens reais.' }),
      () => ({ title: 'Mantenha sua sequência 🔥', body: 'Sua sequência de empacotamento e nível de viajante estão esperando — não deixe esfriar.' }),
      () => ({ title: 'Precisando de inspiração? 💡', body: 'Confira listas de empaque selecionadas para os destinos mais populares no Packmates AI.' }),
      () => ({ title: 'Empacote para o clima, não só para a viagem 🌦️', body: 'Receba uma lista que se ajusta à previsão real do seu destino — não um modelo genérico.' }),
      () => ({ title: 'Empacotem juntos 🤝', body: 'Compartilhe sua lista de itens com seus companheiros de viagem e marquem os itens juntos em tempo real.' }),
      () => ({ title: 'Você está perto de subir de nível 🏅', body: 'Continue empacotando e planejando viagens para alcançar seu próximo emblema de viajante no Packmates AI.' }),
      () => ({ title: 'Sonhando com sua próxima viagem? 🏖️✈️', body: 'Transforme isso em uma viagem real — o Packmates AI cuida da lista de itens para você.' }),
      () => ({ title: 'Planeje uma viagem em segundos ⚡', body: 'Basta informar o destino e as datas — o Packmates AI monta o resto da sua lista de itens.' }),
      () => ({ title: 'Enrole, não dobre 👕', body: 'Enrolar suas roupas em vez de dobrar pode economizar até 30% mais espaço na mala.' }),
      () => ({ title: 'Leve uma muda na bagagem de mão 🎒', body: 'Leve uma muda de roupa e itens essenciais com você caso a despachada atrase.' }),
      () => ({ title: 'Use organizadores de mala 📦', body: 'Os organizadores (packing cubes) mantêm sua mala organizada e comprimem itens volumosos.' }),
      () => ({ title: 'Use suas peças mais volumosas 🧥', body: 'Viaje usando seus sapatos e casaco mais pesados para liberar espaço na mala.' }),
      () => ({ title: 'Faça uma cópia dos documentos 📄🛂', body: 'Guarde uma foto ou cópia digital do seu passaporte e identidade caso perca os originais.' }),
      () => ({ title: 'Coloque etiquetas por dentro e por fora 🏷️', body: 'Coloque uma etiqueta com seus dados de contato por fora e por dentro da mala.' }),
      () => ({ title: 'Confira o clima de novo 🌤️', body: 'O clima pode mudar — confira a previsão do seu destino um dia antes de viajar.' }),
      () => ({ title: 'Leve uma garrafa de água vazia 💧', body: 'Encha depois da segurança em vez de comprar uma — também economiza dinheiro.' }),
      () => ({ title: 'Baixe mapas offline 🗺️', body: 'Baixe mapas offline do seu destino antes de viajar, caso fique sem sinal.' }),
      () => ({ title: 'Deixe espaço para lembrancinhas 🎁', body: 'Leve uma bolsa dobrável ou deixe espaço extra para o que comprar na viagem.' }),
    ],
  },
};

function pushCopy(lang, key, ...args) {
  const dict = PUSH_COPY[lang] || PUSH_COPY.en;
  const entry = dict[key] || PUSH_COPY.en[key];
  if (Array.isArray(entry)) {
    const index = args[0] || 0;
    const fn = entry[index % entry.length];
    return fn();
  }
  return entry(...args);
}

module.exports = { pushCopy };
