/**
 * Minimal localized copy for push notifications, keyed the same way as
 * lib/i18n.js's profiles.language values (en/es/uk/pt, falling back to
 * en for anything else/unset). Kept separate from lib/i18n.js since that
 * file is browser-only (relies on `document`/`localStorage`) and these
 * templates are needed from Vercel serverless functions instead.
 */
/* inactivityNudge has 30 distinct variants rather than one repeated
   message, so a person nudged twice a week for weeks on end sees real
   variety instead of the same line over and over - see
   api/notify-inactive-users.js's rotation logic (picks the next one
   based on how many this person has already received, wrapping at 30).
   Interleaved feature/tip, alternating one of each: feature/engagement
   angles (trip planning, the smart checklist itself, community/social,
   the streak/badge system, destination inspiration, weather-aware
   packing, collaborative packing, badge-progress, seasonal daydreaming,
   quick/easy trip creation, trending destinations, language support,
   packing-progress tracking, traveling with packmates, day-by-day
   forecast) paired with concrete packing/travel tips (roll vs fold,
   carry-on backup outfit, packing cubes, wearing bulky items, document
   backups, luggage tags, rechecking the forecast, an empty water
   bottle, offline maps, leaving room for souvenirs, compression bags,
   a portable charger, carry-on valuables, airline baggage limits,
   medication in original bottles). */
const PUSH_COPY = {
  en: {
    tripReminder3d: [
      (dest) => ({ title: `Trip coming up! 🧳`, body: `Your trip to ${dest} is in 3 days — is your packing list ready?` }),
      (dest) => ({ title: `3 days to go! ✈️`, body: `Time to finalize your packing list for ${dest} — your trip is just 3 days away.` }),
      (dest) => ({ title: `Almost time for ${dest}! 🗓️`, body: `3 days left to pack — check your list and make sure nothing\'s missing.` }),
    ],
    tripReminder1d: [
      (dest) => ({ title: `Trip tomorrow! ⏰`, body: `Your trip to ${dest} starts tomorrow. Last chance to finish packing!` }),
      (dest) => ({ title: `Tomorrow\'s the day! 🎒`, body: `${dest} is calling — make sure your packing list is all checked off.` }),
      (dest) => ({ title: `One more sleep until ${dest}! 🌙`, body: `Final packing check — tomorrow you leave!` }),
    ],
    weatherChange: [
      (dest) => ({ title: `Weather update 🌦️`, body: `The forecast for ${dest} just changed — check if your packing list still fits.` }),
      (dest) => ({ title: `Forecast shift for ${dest} 🌡️`, body: `Conditions have changed since you last checked — update your packing list if needed.` }),
      (dest) => ({ title: `Heads up: weather changed ⛅`, body: `${dest}\'s forecast looks different now — take a look before you pack.` }),
      (dest) => ({ title: `New forecast for ${dest} 🌧️`, body: `The weather\'s shifted — make sure you\'ve packed the right things.` }),
      (dest) => ({ title: `Pack accordingly! 🌤️`, body: `The forecast for ${dest} just updated — double-check your list matches the new conditions.` }),
    ],
    inactivityNudge: [
      () => ({ title: 'Where to next? ✈️', body: 'Start a new trip and get a packing list built around your destination, dates, and activities.' }),
      () => ({ title: 'Roll, don\'t fold 👕', body: 'Rolling your clothes instead of folding them saves up to 30% more suitcase space.' }),
      () => ({ title: "Never forget an item again 🧳", body: 'Packmates AI builds your checklist from real weather and plans — not a generic template.' }),
      () => ({ title: 'Pack a backup outfit in your carry-on 🎒', body: 'Keep a change of clothes and essentials with you in case checked luggage is delayed.' }),
      () => ({ title: 'See where others are headed 🌍', body: 'Browse Community Travelers on Packmates AI for real trip and packing inspiration.' }),
      () => ({ title: 'Try packing cubes 📦', body: 'Packing cubes keep your bag organized and compress bulky items to save space.' }),
      () => ({ title: 'Keep your streak going 🔥', body: "Your packing streak and traveler level are waiting — don't let them go cold." }),
      () => ({ title: 'Wear your bulkiest items 🧥', body: 'Travel in your heaviest shoes and jacket to free up suitcase space for everything else.' }),
      () => ({ title: 'Need inspiration? 💡', body: 'Check out curated packing lists for top destinations on Packmates AI.' }),
      () => ({ title: 'Back up your documents 📄🛂', body: 'Keep a photo or digital copy of your passport and ID in case the originals get lost.' }),
      () => ({ title: 'Packs for the weather, not just the trip 🌦️', body: 'Get a list that adjusts to the real forecast for your destination — not a one-size-fits-all template.' }),
      () => ({ title: 'Tag your bag inside and out 🏷️', body: 'Put a tag with your contact info both outside and inside your suitcase.' }),
      () => ({ title: 'Pack together 🤝', body: 'Share your packing list with travel companions and check items off together in real time.' }),
      () => ({ title: 'Check the forecast one more time 🌤️', body: 'Weather can shift — recheck your destination\'s forecast the day before you leave.' }),
      () => ({ title: "You're close to leveling up 🏅", body: 'Keep packing and planning trips to reach your next traveler badge on Packmates AI.' }),
      () => ({ title: 'Bring an empty water bottle 💧', body: 'Fill it up after airport security instead of buying one — better for your wallet too.' }),
      () => ({ title: 'Dreaming of your next getaway? 🏖️✈️', body: 'Turn it into a real trip — Packmates AI handles the packing list for you.' }),
      () => ({ title: 'Download offline maps 🗺️', body: 'Grab offline maps for your destination before you go, in case you lose signal.' }),
      () => ({ title: 'Plan a trip in seconds ⚡', body: 'Just enter your destination and dates — Packmates AI builds the rest of your packing list.' }),
      () => ({ title: 'Leave room for souvenirs 🎁', body: 'Pack a foldable bag or leave a little extra space for anything you pick up on the trip.' }),
      () => ({ title: 'Explore trending destinations 🔥', body: 'Browse the destinations other travelers are packing for right now on Packmates AI.' }),
      () => ({ title: 'Use compression bags 🧳', body: 'Compression bags squeeze bulky items like jackets and sweaters down to half their size.' }),
      () => ({ title: 'Now in your language 🌍', body: 'Packmates AI now speaks Spanish, Ukrainian, and Portuguese — switch anytime in Settings.' }),
      () => ({ title: 'Pack a portable charger 🔋', body: 'A charged power bank means you are never stuck with a dead phone on travel days.' }),
      () => ({ title: 'Watch your packing progress 📊', body: 'See exactly how much you have packed at a glance, right on your Home screen.' }),
      () => ({ title: 'Keep valuables in your carry-on 💎', body: 'Jewelry, electronics, and anything irreplaceable should stay with you, not in checked luggage.' }),
      () => ({ title: 'Bring your crew along 👨‍👩‍👧‍👦', body: 'Add packmates to any trip so everyone packs from the same live list.' }),
      () => ({ title: 'Check your airline\'s baggage limits 🧾', body: 'Weight and size rules vary by airline — confirm yours before you pack to avoid surprise fees.' }),
      () => ({ title: 'Know before you go ⛅', body: 'Check the day-by-day forecast for your destination, built right into your trip.' }),
      () => ({ title: 'Keep medications in their original bottles 💊', body: 'Labeled containers make security checks faster and avoid issues at customs.' }),
    ],
  },
  es: {
    tripReminder3d: [
      (dest) => ({ title: `¡Se acerca tu viaje! 🧳`, body: `Tu viaje a ${dest} es en 3 días — ¿ya tienes lista tu lista de empaque?` }),
      (dest) => ({ title: `¡Faltan 3 días! ✈️`, body: `Es hora de terminar tu lista de empaque para ${dest} — tu viaje está a solo 3 días.` }),
      (dest) => ({ title: `¡Ya casi es hora de ${dest}! 🗓️`, body: `Te quedan 3 días para empacar — revisa tu lista y asegúrate de no olvidar nada.` }),
    ],
    tripReminder1d: [
      (dest) => ({ title: `¡Viaje mañana! ⏰`, body: `Tu viaje a ${dest} empieza mañana. ¡Última oportunidad para terminar de empacar!` }),
      (dest) => ({ title: `¡Mañana es el día! 🎒`, body: `${dest} te espera — asegúrate de tener todo listo en tu lista de empaque.` }),
      (dest) => ({ title: `¡Una noche más para ${dest}! 🌙`, body: `¡Último chequeo de tu equipaje — mañana sales de viaje!` }),
    ],
    weatherChange: [
      (dest) => ({ title: `Actualización del clima 🌦️`, body: `El pronóstico para ${dest} acaba de cambiar — revisa si tu lista de empaque sigue siendo la correcta.` }),
      (dest) => ({ title: `Cambio en el pronóstico de ${dest} 🌡️`, body: `Las condiciones cambiaron desde la última vez que revisaste — actualiza tu lista si es necesario.` }),
      (dest) => ({ title: `Aviso: cambió el clima ⛅`, body: `El pronóstico de ${dest} se ve diferente ahora — échale un vistazo antes de empacar.` }),
      (dest) => ({ title: `Nuevo pronóstico para ${dest} 🌧️`, body: `El clima cambió — asegúrate de haber empacado lo correcto.` }),
      (dest) => ({ title: `¡Empaca según el clima! 🌤️`, body: `El pronóstico de ${dest} se actualizó — revisa que tu lista coincida con las nuevas condiciones.` }),
    ],
    inactivityNudge: [
      () => ({ title: '¿A dónde vas ahora? ✈️', body: 'Crea un nuevo viaje y obtén una lista de empaque según tu destino, fechas y actividades.' }),
      () => ({ title: 'Enrolla, no dobles 👕', body: 'Enrollar tu ropa en lugar de doblarla puede ahorrar hasta un 30% más de espacio en la maleta.' }),
      () => ({ title: 'Nunca olvides nada 🧳', body: 'Packmates AI arma tu lista con el clima real y tus planes — no con una plantilla genérica.' }),
      () => ({ title: 'Lleva una muda en tu equipaje de mano 🎒', body: 'Guarda una muda y lo esencial contigo por si se retrasa el equipaje facturado.' }),
      () => ({ title: 'Mira a dónde van otros 🌍', body: 'Explora Viajeros de la Comunidad en Packmates AI para inspirarte con viajes reales.' }),
      () => ({ title: 'Prueba los organizadores de equipaje 📦', body: 'Los organizadores (packing cubes) mantienen tu maleta ordenada y comprimen la ropa voluminosa.' }),
      () => ({ title: 'Mantén tu racha activa 🔥', body: 'Tu racha de empaque y tu nivel de viajero te esperan — no dejes que se enfríen.' }),
      () => ({ title: 'Usa tus prendas más voluminosas 🧥', body: 'Viaja con tus zapatos y chaqueta más pesados puestos para ahorrar espacio en la maleta.' }),
      () => ({ title: '¿Buscas inspiración? 💡', body: 'Descubre listas de empaque para los destinos más populares en Packmates AI.' }),
      () => ({ title: 'Respalda tus documentos 📄🛂', body: 'Guarda una foto o copia digital de tu pasaporte e identificación por si pierdes los originales.' }),
      () => ({ title: 'Empaca según el clima, no solo el viaje 🌦️', body: 'Obtén una lista que se adapta al pronóstico real de tu destino — no una plantilla genérica.' }),
      () => ({ title: 'Etiqueta tu maleta por dentro y por fuera 🏷️', body: 'Pon una etiqueta con tus datos de contacto tanto por fuera como por dentro de tu maleta.' }),
      () => ({ title: 'Empaquen juntos 🤝', body: 'Comparte tu lista de empaque con tus compañeros de viaje y marquen los artículos juntos en tiempo real.' }),
      () => ({ title: 'Revisa el clima una vez más 🌤️', body: 'El clima puede cambiar — revisa el pronóstico de tu destino un día antes de salir.' }),
      () => ({ title: 'Estás cerca de subir de nivel 🏅', body: 'Sigue empacando y planeando viajes para alcanzar tu próxima insignia de viajero en Packmates AI.' }),
      () => ({ title: 'Lleva una botella de agua vacía 💧', body: 'Llénala después de pasar seguridad en vez de comprar una — también ahorras dinero.' }),
      () => ({ title: '¿Soñando con tu próxima escapada? 🏖️✈️', body: 'Convértela en un viaje real — Packmates AI se encarga de tu lista de empaque.' }),
      () => ({ title: 'Descarga mapas sin conexión 🗺️', body: 'Descarga mapas sin conexión de tu destino antes de salir, por si no tienes señal.' }),
      () => ({ title: 'Planea un viaje en segundos ⚡', body: 'Solo ingresa tu destino y fechas — Packmates AI arma el resto de tu lista de empaque.' }),
      () => ({ title: 'Deja espacio para souvenirs 🎁', body: 'Lleva una bolsa plegable o deja espacio extra para lo que compres en el viaje.' }),
      () => ({ title: 'Explora destinos en tendencia 🔥', body: 'Descubre los destinos que otros viajeros están empacando ahora mismo en Packmates AI.' }),
      () => ({ title: 'Usa bolsas de compresión 🧳', body: 'Las bolsas de compresión reducen a la mitad el tamaño de prendas voluminosas como abrigos y suéteres.' }),
      () => ({ title: 'Ahora en tu idioma 🌍', body: 'Packmates AI ya habla español, ucraniano y portugués — cámbialo cuando quieras en Configuración.' }),
      () => ({ title: 'Lleva un cargador portátil 🔋', body: 'Una batería portátil cargada evita que te quedes sin batería en los días de viaje.' }),
      () => ({ title: 'Observa tu progreso de empaque 📊', body: 'Mira de un vistazo cuánto llevas empacado, directo en tu pantalla de inicio.' }),
      () => ({ title: 'Lleva tus objetos de valor en el equipaje de mano 💎', body: 'Joyas, electrónicos y cualquier cosa irremplazable deben ir contigo, no en el equipaje facturado.' }),
      () => ({ title: 'Viaja con tu grupo 👨‍👩‍👧‍👦', body: 'Agrega packmates a cualquier viaje para que todos empaquen desde la misma lista en vivo.' }),
      () => ({ title: 'Revisa los límites de equipaje de tu aerolínea 🧾', body: 'El peso y tamaño permitido varían según la aerolínea — confírmalo antes de empacar para evitar cargos sorpresa.' }),
      () => ({ title: 'Entérate antes de viajar ⛅', body: 'Consulta el pronóstico día a día de tu destino, directo en tu viaje.' }),
      () => ({ title: 'Lleva los medicamentos en sus frascos originales 💊', body: 'Los envases etiquetados agilizan los controles de seguridad y evitan problemas en aduana.' }),
    ],
  },
  uk: {
    tripReminder3d: [
      (dest) => ({ title: `Скоро подорож! 🧳`, body: `Ваша подорож до ${dest} через 3 дні — список речей готовий?` }),
      (dest) => ({ title: `Залишилось 3 дні! ✈️`, body: `Час завершити список речей для ${dest} — до подорожі залишилось лише 3 дні.` }),
      (dest) => ({ title: `Майже час їхати до ${dest}! 🗓️`, body: `Залишилось 3 дні на пакування — перевірте список і переконайтесь, що нічого не забули.` }),
    ],
    tripReminder1d: [
      (dest) => ({ title: `Подорож завтра! ⏰`, body: `Ваша подорож до ${dest} починається завтра. Останній шанс закінчити пакування!` }),
      (dest) => ({ title: `Завтра той самий день! 🎒`, body: `${dest} чекає на вас — перевірте, чи все позначено у списку речей.` }),
      (dest) => ({ title: `Ще одна ніч до ${dest}! 🌙`, body: `Останній чек пакування — завтра ви вирушаєте!` }),
    ],
    weatherChange: [
      (dest) => ({ title: `Оновлення погоди 🌦️`, body: `Прогноз для ${dest} щойно змінився — перевірте, чи актуальний ваш список речей.` }),
      (dest) => ({ title: `Зміна прогнозу для ${dest} 🌡️`, body: `Умови змінилися відтоді, як ви перевіряли востаннє — оновіть список речей за потреби.` }),
      (dest) => ({ title: `Увага: погода змінилася ⛅`, body: `Прогноз для ${dest} тепер виглядає інакше — перегляньте його перед пакуванням.` }),
      (dest) => ({ title: `Новий прогноз для ${dest} 🌧️`, body: `Погода змінилася — перевірте, чи спакували ви потрібні речі.` }),
      (dest) => ({ title: `Пакуйтеся за погодою! 🌤️`, body: `Прогноз для ${dest} щойно оновився — перевірте, чи відповідає ваш список новим умовам.` }),
    ],
    inactivityNudge: [
      () => ({ title: 'Куди далі? ✈️', body: 'Створіть нову подорож і отримайте список речей на основі напрямку, дат і активностей.' }),
      () => ({ title: 'Згортайте, а не складайте 👕', body: 'Згортання одягу замість складання економить до 30% більше місця у валізі.' }),
      () => ({ title: 'Більше нічого не забувайте 🧳', body: 'Packmates AI складає список на основі реальної погоди й планів — а не шаблону.' }),
      () => ({ title: 'Візьміть зміну одягу в ручну поклажу 🎒', body: 'Тримайте зміну одягу та необхідне з собою на випадок затримки багажу.' }),
      () => ({ title: 'Подивіться, куди їдуть інші 🌍', body: 'Перегляньте Мандрівників спільноти в Packmates AI для реального натхнення.' }),
      () => ({ title: 'Спробуйте органайзери для валізи 📦', body: 'Органайзери тримають речі впорядкованими та стискають об\'ємний одяг.' }),
      () => ({ title: 'Не втрачайте серію 🔥', body: 'Ваша серія пакування та рівень мандрівника чекають — не дайте їм згаснути.' }),
      () => ({ title: 'Носіть найоб\'ємніші речі 🧥', body: 'Одягніть найважче взуття та куртку під час подорожі, щоб звільнити місце у валізі.' }),
      () => ({ title: 'Потрібне натхнення? 💡', body: 'Перегляньте добірку списків речей для популярних напрямків у Packmates AI.' }),
      () => ({ title: 'Зробіть копію документів 📄🛂', body: 'Зберігайте фото або цифрову копію паспорта й документів на випадок їх втрати.' }),
      () => ({ title: 'Пакуйтеся під погоду, а не лише під поїздку 🌦️', body: 'Отримайте список, що враховує реальний прогноз для вашого напрямку — а не шаблон на всі випадки.' }),
      () => ({ title: 'Прикріпіть бирки зовні та всередині 🏷️', body: 'Прикріпіть бирку з контактами як зовні, так і всередині валізи.' }),
      () => ({ title: 'Пакуйтеся разом 🤝', body: 'Поділіться списком речей із супутниками та відмічайте пункти разом у реальному часі.' }),
      () => ({ title: 'Перевірте погоду ще раз 🌤️', body: 'Погода може змінитися — перевірте прогноз для напрямку за день до виїзду.' }),
      () => ({ title: 'Ви близько до нового рівня 🏅', body: 'Продовжуйте пакувати та планувати подорожі, щоб отримати новий бейдж мандрівника в Packmates AI.' }),
      () => ({ title: 'Візьміть порожню пляшку для води 💧', body: 'Наповніть її після контролю безпеки замість купівлі нової — це ще й економія.' }),
      () => ({ title: 'Мрієте про наступну подорож? 🏖️✈️', body: 'Перетворіть це на реальну подорож — Packmates AI подбає про список речей.' }),
      () => ({ title: 'Завантажте офлайн-карти 🗺️', body: 'Завантажте офлайн-карти напрямку заздалегідь, на випадок відсутності зв\'язку.' }),
      () => ({ title: 'Сплануйте подорож за секунди ⚡', body: 'Просто вкажіть напрямок і дати — Packmates AI створить решту вашого списку речей.' }),
      () => ({ title: 'Залиште місце для сувенірів 🎁', body: 'Візьміть складану сумку або залиште трохи вільного місця для сувенірів.' }),
      () => ({ title: 'Відкрийте популярні напрямки 🔥', body: 'Перегляньте напрямки, для яких зараз пакуються інші мандрівники в Packmates AI.' }),
      () => ({ title: 'Використовуйте компресійні мішки 🧳', body: 'Компресійні мішки зменшують обʼємні речі, як куртки й светри, удвічі.' }),
      () => ({ title: 'Тепер вашою мовою 🌍', body: 'Packmates AI тепер розмовляє іспанською, українською та португальською — змініть мову в будь-який час у Налаштуваннях.' }),
      () => ({ title: 'Візьміть портативний зарядний пристрій 🔋', body: 'Заряджений павербанк убереже вас від розрядженого телефону в дорозі.' }),
      () => ({ title: 'Стежте за прогресом пакування 📊', body: 'Дивіться, скільки ви вже спакували, одразу на головному екрані.' }),
      () => ({ title: 'Тримайте цінні речі в ручній поклажі 💎', body: 'Прикраси, електроніку та все незамінне краще тримати при собі, а не в зданому багажі.' }),
      () => ({ title: 'Подорожуйте з компанією 👨‍👩‍👧‍👦', body: 'Додайте супутників до подорожі, щоб усі пакувались за одним спільним списком.' }),
      () => ({ title: 'Перевірте норми багажу своєї авіакомпанії 🧾', body: 'Вага та розміри багажу відрізняються в різних авіакомпаній — перевірте заздалегідь, щоб уникнути доплат.' }),
      () => ({ title: 'Дізнайтесь прогноз заздалегідь ⛅', body: 'Перегляньте погоду на кожен день вашої подорожі прямо в додатку.' }),
      () => ({ title: 'Тримайте ліки в оригінальній упаковці 💊', body: 'Марковані упаковки прискорюють перевірку на безпеці та допомагають уникнути проблем на митниці.' }),
    ],
  },
  pt: {
    tripReminder3d: [
      (dest) => ({ title: `Viagem chegando! 🧳`, body: `Sua viagem para ${dest} é em 3 dias — sua lista de itens já está pronta?` }),
      (dest) => ({ title: `Faltam 3 dias! ✈️`, body: `Hora de finalizar sua lista de itens para ${dest} — sua viagem está a apenas 3 dias.` }),
      (dest) => ({ title: `Quase na hora de ${dest}! 🗓️`, body: `Faltam 3 dias para arrumar as malas — confira sua lista e garanta que nada ficou de fora.` }),
    ],
    tripReminder1d: [
      (dest) => ({ title: `Viagem amanhã! ⏰`, body: `Sua viagem para ${dest} começa amanhã. Última chance de terminar de arrumar as malas!` }),
      (dest) => ({ title: `Amanhã é o dia! 🎒`, body: `${dest} está esperando — confira se sua lista de itens está toda marcada.` }),
      (dest) => ({ title: `Mais uma noite até ${dest}! 🌙`, body: `Última checagem da mala — amanhã você viaja!` }),
    ],
    weatherChange: [
      (dest) => ({ title: `Atualização do clima 🌦️`, body: `A previsão para ${dest} acabou de mudar — confira se sua lista de itens ainda está adequada.` }),
      (dest) => ({ title: `Mudança na previsão de ${dest} 🌡️`, body: `As condições mudaram desde a última vez que você conferiu — atualize sua lista se necessário.` }),
      (dest) => ({ title: `Atenção: o clima mudou ⛅`, body: `A previsão de ${dest} está diferente agora — dê uma olhada antes de arrumar as malas.` }),
      (dest) => ({ title: `Nova previsão para ${dest} 🌧️`, body: `O clima mudou — confira se você arrumou as coisas certas.` }),
      (dest) => ({ title: `Empacote de acordo com o clima! 🌤️`, body: `A previsão de ${dest} foi atualizada — confira se sua lista combina com as novas condições.` }),
    ],
    inactivityNudge: [
      () => ({ title: 'Para onde agora? ✈️', body: 'Crie uma nova viagem e receba uma lista de itens baseada no destino, datas e atividades.' }),
      () => ({ title: 'Enrole, não dobre 👕', body: 'Enrolar suas roupas em vez de dobrar pode economizar até 30% mais espaço na mala.' }),
      () => ({ title: 'Nunca mais esqueça nada 🧳', body: 'O Packmates AI monta sua lista com o clima real e seus planos — não um modelo genérico.' }),
      () => ({ title: 'Leve uma muda na bagagem de mão 🎒', body: 'Leve uma muda de roupa e itens essenciais com você caso a despachada atrase.' }),
      () => ({ title: 'Veja para onde os outros vão 🌍', body: 'Explore Viajantes da Comunidade no Packmates AI e se inspire com viagens reais.' }),
      () => ({ title: 'Use organizadores de mala 📦', body: 'Os organizadores (packing cubes) mantêm sua mala organizada e comprimem itens volumosos.' }),
      () => ({ title: 'Mantenha sua sequência 🔥', body: 'Sua sequência de empacotamento e nível de viajante estão esperando — não deixe esfriar.' }),
      () => ({ title: 'Use suas peças mais volumosas 🧥', body: 'Viaje usando seus sapatos e casaco mais pesados para liberar espaço na mala.' }),
      () => ({ title: 'Precisando de inspiração? 💡', body: 'Confira listas de empaque selecionadas para os destinos mais populares no Packmates AI.' }),
      () => ({ title: 'Faça uma cópia dos documentos 📄🛂', body: 'Guarde uma foto ou cópia digital do seu passaporte e identidade caso perca os originais.' }),
      () => ({ title: 'Empacote para o clima, não só para a viagem 🌦️', body: 'Receba uma lista que se ajusta à previsão real do seu destino — não um modelo genérico.' }),
      () => ({ title: 'Coloque etiquetas por dentro e por fora 🏷️', body: 'Coloque uma etiqueta com seus dados de contato por fora e por dentro da mala.' }),
      () => ({ title: 'Empacotem juntos 🤝', body: 'Compartilhe sua lista de itens com seus companheiros de viagem e marquem os itens juntos em tempo real.' }),
      () => ({ title: 'Confira o clima de novo 🌤️', body: 'O clima pode mudar — confira a previsão do seu destino um dia antes de viajar.' }),
      () => ({ title: 'Você está perto de subir de nível 🏅', body: 'Continue empacotando e planejando viagens para alcançar seu próximo emblema de viajante no Packmates AI.' }),
      () => ({ title: 'Leve uma garrafa de água vazia 💧', body: 'Encha depois da segurança em vez de comprar uma — também economiza dinheiro.' }),
      () => ({ title: 'Sonhando com sua próxima viagem? 🏖️✈️', body: 'Transforme isso em uma viagem real — o Packmates AI cuida da lista de itens para você.' }),
      () => ({ title: 'Baixe mapas offline 🗺️', body: 'Baixe mapas offline do seu destino antes de viajar, caso fique sem sinal.' }),
      () => ({ title: 'Planeje uma viagem em segundos ⚡', body: 'Basta informar o destino e as datas — o Packmates AI monta o resto da sua lista de itens.' }),
      () => ({ title: 'Deixe espaço para lembrancinhas 🎁', body: 'Leve uma bolsa dobrável ou deixe espaço extra para o que comprar na viagem.' }),
      () => ({ title: 'Explore destinos em alta 🔥', body: 'Veja os destinos para os quais outros viajantes estão fazendo as malas agora no Packmates AI.' }),
      () => ({ title: 'Use sacos de compressão 🧳', body: 'Sacos de compressão reduzem pela metade o tamanho de itens volumosos como casacos e suéteres.' }),
      () => ({ title: 'Agora no seu idioma 🌍', body: 'O Packmates AI agora fala espanhol, ucraniano e português — mude quando quiser nas Configurações.' }),
      () => ({ title: 'Leve um carregador portátil 🔋', body: 'Um power bank carregado evita que seu celular fique sem bateria durante a viagem.' }),
      () => ({ title: 'Acompanhe seu progresso de empacotamento 📊', body: 'Veja rapidamente quanto você já empacotou, direto na tela inicial.' }),
      () => ({ title: 'Leve seus itens de valor na bagagem de mão 💎', body: 'Joias, eletrônicos e qualquer coisa insubstituível devem ficar com você, não na bagagem despachada.' }),
      () => ({ title: 'Viaje com seu grupo 👨‍👩‍👧‍👦', body: 'Adicione packmates a qualquer viagem para que todos empacotem a partir da mesma lista em tempo real.' }),
      () => ({ title: 'Confira os limites de bagagem da sua companhia aérea 🧾', body: 'Peso e tamanho permitidos variam por companhia — confirme antes de fazer as malas para evitar taxas surpresa.' }),
      () => ({ title: 'Saiba antes de viajar ⛅', body: 'Veja a previsão dia a dia do seu destino, direto na sua viagem.' }),
      () => ({ title: 'Leve os remédios nas embalagens originais 💊', body: 'Embalagens identificadas agilizam a inspeção de segurança e evitam problemas na alfândega.' }),
    ],
  },
};

/* Every template is now an array of variants (tripReminder3d/1d: 3 each,
   weatherChange: 5, inactivityNudge: 20) - `index` picks which one (wraps
   via modulo, so callers don't need to pre-clamp it), and any further
   args (just `dest`, for everything except inactivityNudge) get passed
   through to the chosen variant function. */
function pushCopy(lang, key, index, ...args) {
  const dict = PUSH_COPY[lang] || PUSH_COPY.en;
  const variants = dict[key] || PUSH_COPY.en[key];
  const fn = variants[(index || 0) % variants.length];
  return fn(...args);
}

/* Deterministic variant picker for the templates that have no reliable
   send history to rotate on (a trip's 3-day/1-day reminder each fire at
   most once ever, so there's nothing to "rotate" across) - hashes
   whatever varies the message (trip id alone for reminders; trip id +
   the new weather code/temp for weather changes, so a trip's *next*
   weather push is likely to land on a different variant than its last
   one) into a stable index, so the same inputs always pick the same
   variant rather than picking randomly on every cron run. */
function hashToIndex(seed, variantCount) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(h) % variantCount;
}

module.exports = { pushCopy, hashToIndex };
