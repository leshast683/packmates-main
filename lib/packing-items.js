// ═══════════════════════════════════════════════════════════════
//  SHARED PACKING ITEM DATABASE — single source of truth.
//
//  Previously duplicated three times (packing-list.js, tripPreview.html's
//  own inline copy, and an unused orphaned packing-data.js), each of
//  which had drifted from the others — different items, different match
//  predicates (some used `.when()`, some `.suggest()`), tripPreview.html's
//  copy was missing the `windy`/`cruise` profile flags entirely, and it
//  read/wrote packing state from different (non-trip-scoped!) localStorage
//  keys than the real packing list page. Net effect: the sidebar packing
//  panel on a trip's preview page and the actual packing-list.html page
//  could show genuinely different items for the same trip.
//
//  Loaded by both packing-list.html and tripPreview.html, before their
//  own page scripts.
// ═══════════════════════════════════════════════════════════════
const ITEM_DB = {
    'Essentials': [
        { name: 'Passport',              suggest: p => p.isInternational },
        { name: 'ID',                    suggest: p => true },
        { name: 'Cash',                  suggest: p => true },
        { name: 'Credit Card',           suggest: p => true },
        { name: 'Phone',                 suggest: p => true },
        { name: 'Charger',               suggest: p => true },
        { name: 'Headphones',            suggest: p => true },
        { name: 'Power Bank',            suggest: p => true },
        { name: 'Keys',                  suggest: p => true },
        { name: 'Sleep Mask',            suggest: p => true },
        { name: 'Neck Pillow',           suggest: p => true },
        { name: 'Hand Sanitizer',        suggest: p => true },
        { name: 'Prescription Medication', suggest: p => true },
        { name: 'Allergy Medication',    suggest: p => p.springAllergy },
    ],
    'Toiletries': [
        { name: 'Toothbrush',  suggest: p => true },
        { name: 'Toothpaste',  suggest: p => true },
        { name: 'Shampoo',     suggest: p => true },
        { name: 'Conditioner', suggest: p => true },
        { name: 'Body Wash',   suggest: p => true },
        { name: 'Deodorant',   suggest: p => true },
        { name: 'Razor',       suggest: p => true },
        { name: 'Nail Clippers', suggest: p => true },
        { name: 'Face Mask',   suggest: p => true },
        { name: 'Moisturizer', suggest: p => true },
        { name: 'Sunscreen',   suggest: p => p.hot || p.beach || p.hiking || p.camping },
        { name: 'Lip Balm',    suggest: p => p.cold || p.snowy || p.windy || p.ski },
        { name: 'Hair Brush',         suggest: p => true },
        { name: 'Hairspray',          suggest: p => true },
        { name: 'Comb',               suggest: p => true },
        { name: 'Mouthwash',          suggest: p => true },
        { name: 'Makeup Remover',     suggest: (p, g) => g !== 'male' },
        { name: 'Makeup Wipes',       suggest: (p, g) => g !== 'male' },
        { name: 'Antibacterial Wipes',suggest: p => true },
        { name: 'Moisturizing Spray', suggest: (p, g) => g !== 'male' },
        { name: 'Perfume/Cologne',    suggest: p => true },
        { name: 'Makeup',                    suggest: (p, g) => g !== 'male' },
        { name: 'Feminine Hygiene Products', suggest: (p, g) => g !== 'male' },
        { name: 'Shaving Cream',             suggest: (p, g) => g !== 'female' },
    ],
    'Accessories': [
        { name: 'Earrings', suggest: p => true },
    ],
    'Clothing': [
        { name: 'T-Shirts',           suggest: p => true },
        { name: 'Tank Tops',          suggest: p => p.hot || p.beach || p.gym },
        { name: 'Long Sleeve Shirts', suggest: p => !p.hot || p.hiking || p.camping },
        { name: 'Button-Down Shirts', suggest: p => p.business },
        { name: 'Polo Shirts',        suggest: p => p.business || (!p.beach && !p.hot) },
        { name: 'Blouse',             suggest: (p, g) => g !== 'male' && (p.business || p.hot) },
        { name: 'Hoodie',             suggest: p => !p.hot && !p.beach },
        { name: 'Cardigan',           suggest: p => !p.hot || p.business },
        { name: 'Sweater',            suggest: p => p.cold || p.snowy },
        { name: 'Vest',               suggest: p => p.cold || p.hiking },
        { name: 'Jeans',              suggest: p => !p.hot && !p.beach },
        { name: 'Pants',              suggest: p => !p.beach || p.business || p.hiking },
        { name: 'Chinos',             suggest: p => p.business || (!p.hot && !p.beach) },
        { name: 'Sweatpants',         suggest: p => p.gym || p.camping },
        { name: 'Leggings',           suggest: p => p.gym || p.hiking || p.cold },
        { name: 'Shorts',             suggest: p => p.hot || p.beach || p.gym },
        { name: 'Skirt',              suggest: (p, g) => g !== 'male' && (p.hot || p.beach || (p.business && !p.cold)) },
        { name: 'Dress',              suggest: (p, g) => g !== 'male' && (p.hot || p.beach || (p.business && !p.cold)) },
        { name: 'Jacket',             suggest: p => !p.hot && !p.beach },
        { name: 'Rain Jacket',        suggest: p => p.rainy || p.hiking || p.camping },
        { name: 'Coat',               suggest: p => p.cold || p.snowy },
        { name: 'Underwear',          suggest: p => true },
        { name: 'Sports Bra',         suggest: (p, g) => g !== 'male' && (p.gym || p.beach || p.hiking || p.swimming) },
        { name: 'Socks',              suggest: p => true },
        { name: 'Thermal Underwear',  suggest: p => p.cold || p.snowy || p.ski },
        { name: 'Pajamas',            suggest: p => true },
        { name: 'Scarf',              suggest: p => p.cold || p.snowy },
        { name: 'Gloves',             suggest: p => p.ski },
        { name: 'Beanie',             suggest: p => p.cold || p.snowy || p.ski },
        { name: 'Wool Socks',         suggest: p => p.cold || p.snowy || p.ski || p.hiking },
        { name: 'Leather Jacket',     suggest: p => !p.beach && !p.gym && !p.hiking && !p.hot },
        { name: 'Beret',              suggest: (p, g) => g !== 'male' },
        { name: 'Bra',                suggest: (p, g) => g !== 'male' },
        { name: 'Tracksuit',          suggest: p => p.gym || p.camping },
        { name: 'Robe',               suggest: p => false },
        { name: 'Headband',           suggest: (p, g) => g !== 'male' },
        { name: 'Purse',              suggest: (p, g) => g !== 'male' },
        { name: 'Lingerie',           suggest: (p, g) => g !== 'male' },
        { name: 'High-Waisted Jeans', suggest: (p, g) => g !== 'male' },
        { name: 'Belt',               suggest: p => true },
    ],
    'Shoes': [
        { name: 'Sneakers',         suggest: p => true },
        { name: 'Running Shoes',    suggest: p => p.gym || p.hiking },
        { name: 'Sandals',          suggest: p => p.hot || p.beach },
        { name: 'Platform Sandals', suggest: (p, g) => g !== 'male' && (p.hot || p.beach) },
        { name: 'Flip Flops',       suggest: p => p.beach || p.swimming },
        { name: 'Loafers',          suggest: p => p.business || (!p.hiking && !p.beach && !p.cold) },
        { name: 'Boots',            suggest: p => p.cold || p.hiking },
        { name: 'Platform Boots',   suggest: (p, g) => g !== 'male' && !p.beach },
        { name: 'Heels',            suggest: (p, g) => g !== 'male' && !p.cold },
        { name: 'Ballet Flats',     suggest: (p, g) => g !== 'male' && !p.hiking && !p.cold },
        { name: 'Crocs',            suggest: p => p.beach || p.camping },
        { name: 'Tennis Shoes',     suggest: p => p.gym },
        { name: 'Walking Shoes',    suggest: p => p.citySightseeing || p.themePark },
    ],
    'Electronics': [
        { name: 'Laptop',            suggest: p => true },
        { name: 'Laptop Charger',    suggest: p => true },
        { name: 'Power Bank',        suggest: p => true },
        { name: 'USB Drive',         suggest: p => true },
        { name: 'Camera',            suggest: p => true },
        { name: 'Action Camera',     suggest: p => true },
        { name: 'Tripod',            suggest: p => true },
        { name: 'Hair Straightener', suggest: (p, g) => g !== 'male' },
        { name: 'Smart Watch',       suggest: p => true },
        { name: 'Drone',             suggest: p => true },
        { name: 'Selfie Stick',      suggest: p => true },
    ],
    'Business Trip': [
        { name: 'Dress Shirts',   suggest: p => p.business },
        { name: 'Dress Pants',    suggest: p => p.business },
        { name: 'Blazer',         suggest: p => p.business },
        { name: 'Suit',           suggest: (p, g) => g !== 'female' && p.business },
        { name: 'Pencil Skirt',   suggest: (p, g) => g !== 'male' && p.business },
        { name: 'Dress Shoes',    suggest: p => p.business },
        { name: 'Tie',            suggest: (p, g) => g !== 'female' && p.business },
        { name: 'Business Cards', suggest: p => p.business },
        { name: 'Notebook',       suggest: p => p.business },
    ],
    'Gym': [
        { name: 'Workout Clothes', suggest: p => p.gym },
        { name: 'Sports Shoes',    suggest: p => p.gym },
        { name: 'Gym Towel',       suggest: p => p.gym },
        { name: 'Water Bottle',    suggest: p => p.gym },
    ],
    'Beach': [
        { name: 'Swimming Trunks', suggest: (p, g) => g !== 'female' && p.beach },
        { name: 'Bikini',          suggest: (p, g) => g !== 'male' && p.beach },
        { name: 'Beach Towel', suggest: p => p.beach },
        { name: 'Sunglasses',  suggest: p => p.beach || p.hot },
        { name: 'Sun Hat',     suggest: p => p.beach || p.hot },
        { name: 'Sunscreen',   suggest: p => p.beach || p.hot },
        { name: 'Beach Bag',            suggest: p => p.beach },
        { name: 'Waterproof Phone Case',suggest: p => p.beach || p.swimming },
        { name: 'Aloe Vera Gel',        suggest: p => p.beach || p.hot },
        { name: 'Snorkel Set',          suggest: p => p.beach },
        { name: 'Portable Speaker',     suggest: p => p.beach || p.hiking || p.camping },
    ],
    'Swimming': [
        { name: 'Goggles',    suggest: p => p.swimming },
        { name: 'Swim Cap',   suggest: p => p.swimming },
        { name: 'Aqua Shoes',  suggest: p => p.swimming },
    ],
    'Snow Sports': [
        { name: 'Thermal Base Layer', suggest: p => p.ski },
        { name: 'Ski Jacket',         suggest: p => p.ski },
        { name: 'Ski Pants',          suggest: p => p.ski },
        { name: 'Gloves',             suggest: p => p.ski },
        { name: 'Beanie',             suggest: p => p.ski || p.cold },
        { name: 'Ski Goggles',         suggest: p => p.ski },
        { name: 'Wool Socks',         suggest: p => p.ski || p.cold },
        { name: 'Ski Boots',          suggest: p => p.ski },
    ],
    'Hiking': [
        { name: 'Hiking Boots',    suggest: p => p.hiking },
        { name: 'Hiking Socks',    suggest: p => p.hiking },
        { name: 'Backpack',        suggest: p => p.hiking || p.camping },
        { name: 'Rain Jacket',     suggest: p => p.hiking && p.rainy },
        { name: 'Sunscreen',       suggest: p => p.hiking },
        { name: 'Insect Repellent',suggest: p => p.hiking || p.camping },
        { name: 'Snacks',          suggest: p => p.hiking || p.camping },
        { name: 'Hydration Pack',       suggest: p => p.hiking },
        { name: 'First Aid Kit',        suggest: p => p.hiking || p.camping || p.roadTrip || p.ski },
    ],
    'Camping': [
        { name: 'Tent',            suggest: p => p.camping },
        { name: 'Sleeping Bag',    suggest: p => p.camping },

        { name: 'Camp Stove',      suggest: p => p.camping },
        { name: 'Food',            suggest: p => p.camping },
        { name: 'Insect Repellent', suggest: p => p.camping },
        { name: 'Firestarter',      suggest: p => p.camping },
    ],
    'Rainy Weather': [
        { name: 'Umbrella',                  suggest: p => p.rainy },
        { name: 'Rain Jacket',               suggest: p => p.rainy },
        { name: 'Waterproof Backpack Cover', suggest: p => p.rainy || p.hiking },
        { name: 'Poncho',                    suggest: p => p.rainy },
        { name: 'Trench Coat',               suggest: (p, g) => g !== 'male' && p.rainy },
        { name: 'Rain Boots',                suggest: p => p.rainy },
    ],
    'Hot & Sunny Weather': [
        { name: 'Sunglasses',   suggest: p => p.hot || p.beach },
        { name: 'Sun Hat',      suggest: p => p.hot || p.beach },
        { name: 'Reusable Water Bottle', suggest: p => p.hot },
        { name: 'Visor',        suggest: p => p.hot || p.beach },
    ],
    'Snowy Weather': [
        { name: 'Thermal Socks',      suggest: p => p.snowy || p.cold },
        { name: 'Scarf',              suggest: p => p.snowy || p.cold },
        { name: 'Snow Boots',         suggest: p => p.snowy },
        { name: 'Hand Warmers',       suggest: p => p.snowy || p.cold },
        { name: 'Thermal Underwear',  suggest: p => p.snowy || p.cold },
        { name: 'Heavy Puffer Jacket',suggest: p => p.snowy },
    ],
    'Windy Weather': [
        { name: 'Lip Balm',           suggest: p => p.windy || p.cold },
        { name: 'Windbreaker Jacket', suggest: p => p.windy },
        { name: 'Hair Ties',          suggest: (p, g) => g !== 'male' && p.windy },
        { name: 'Beanie / Ear Muffs', suggest: p => p.windy || p.cold },
    ],
    'Cold Weather': [
        { name: 'Warm Boots',        suggest: p => p.cold || p.snowy },
        { name: 'Scarf',             suggest: p => p.cold || p.snowy },
        { name: 'Heavy Coat',        suggest: p => p.cold || p.snowy },
        { name: 'Wool Socks',        suggest: p => p.cold || p.snowy },
        { name: 'Thermal Underwear', suggest: p => p.cold || p.snowy },
        { name: 'Fleece Sweater',    suggest: p => p.cold || p.snowy },
        { name: 'Bomber Jacket',     suggest: p => p.cold || p.snowy },
        { name: 'Hoodie',            suggest: p => p.cold || p.snowy },
        { name: 'Fleece Vest',       suggest: p => p.cold || p.snowy },
        { name: 'Puffer Vest',       suggest: p => p.cold || p.snowy },
        { name: 'Mittens',           suggest: p => p.cold || p.snowy },
    ],
    'Night Out': [
        { name: 'Dress',                 suggest: (p, g) => g !== 'male' && p.nightOut },
        { name: 'Mini Dress',            suggest: (p, g) => g !== 'male' && p.nightOut },
        { name: 'Maxi Dress',            suggest: (p, g) => g !== 'male' && p.nightOut },
        { name: 'Cocktail Dress',        suggest: (p, g) => g !== 'male' && p.nightOut },
        { name: 'Heels',                 suggest: (p, g) => g !== 'male' && p.nightOut },
        { name: 'Dress Shoes',           suggest: (p, g) => g !== 'female' && p.nightOut },
        { name: 'Blazer',                suggest: p => p.nightOut },
        { name: 'Clutch Purse',          suggest: (p, g) => g !== 'male' && p.nightOut },
        { name: 'Perfume/Cologne',       suggest: p => p.nightOut },
        { name: 'Makeup Kit',            suggest: (p, g) => g !== 'male' && p.nightOut },
        { name: 'Hair Styling Products', suggest: p => p.nightOut },
        { name: 'Watch',                 suggest: p => p.nightOut },
        { name: 'Jewelry',               suggest: (p, g) => g !== 'male' && p.nightOut },
        { name: 'Fashion Tape',          suggest: (p, g) => g !== 'male' && p.nightOut },
        { name: 'Jumpsuit',              suggest: p => p.nightOut },
    ],
    'Baby': [
        { name: 'Diapers',           suggest: p => p.baby },
        { name: 'Baby Wipes',        suggest: p => p.baby },
        { name: 'Baby Bottle',       suggest: p => p.baby },
        { name: 'Baby Clothes',      suggest: p => p.baby },
        { name: 'Diaper Bag',        suggest: p => p.baby },
        { name: 'Stroller',          suggest: p => p.baby },
    ],
    'Theme Park': [
        { name: 'Sneakers',     suggest: p => p.themePark },
        { name: 'Sunscreen',    suggest: p => p.themePark && p.hot },
        { name: 'Sunglasses',   suggest: p => p.themePark },
        { name: 'Sun Hat',      suggest: p => p.themePark && p.hot },
        { name: 'Power Bank',   suggest: p => p.themePark },
        { name: 'Camera',       suggest: p => p.themePark },
        { name: 'Backpack',     suggest: p => p.themePark },
        { name: 'Snacks',       suggest: p => p.themePark },
        { name: 'Fanny Pack',   suggest: p => p.themePark },
    ],
    'Festival': [
        { name: 'Tent',         suggest: p => p.festival },
        { name: 'Sleeping Bag', suggest: p => p.festival },
        { name: 'Sunscreen',    suggest: p => p.festival && p.hot },
        { name: 'Sunglasses',   suggest: p => p.festival },
        { name: 'Sun Hat',      suggest: p => p.festival && p.hot },
        { name: 'Power Bank',   suggest: p => p.festival },
        { name: 'Raincoat',     suggest: p => p.festival && p.rainy },
        { name: 'Fanny Pack',   suggest: p => p.festival },
        { name: 'Portable Fan',    suggest: p => p.festival && p.hot },
        { name: 'Clear Backpack',  suggest: p => p.festival },
        { name: 'Bandana',         suggest: p => p.festival },
        { name: 'Cowboy Hat',      suggest: p => p.festival },
        { name: 'Ear Plugs',       suggest: p => p.festival || p.nightOut },
        { name: 'Body Glitter',    suggest: p => p.festival },
    ],
    'Road Trip': [
        { name: 'Sunglasses',     suggest: p => p.roadTrip },
        { name: 'Power Bank',     suggest: p => p.roadTrip },
        { name: 'Camera',         suggest: p => p.roadTrip },
        { name: 'Headphones',     suggest: p => p.roadTrip },
        { name: 'Snacks',         suggest: p => p.roadTrip },
        { name: 'Car Charger',    suggest: p => p.roadTrip },
        { name: 'Travel Pillow',  suggest: p => p.roadTrip },
        { name: 'Car Blanket',    suggest: p => p.roadTrip && p.cold },
        { name: 'Car Sunshade',      suggest: p => p.roadTrip && p.hot },
        { name: 'Paper Maps',        suggest: p => p.roadTrip },
    ],
    'City Sightseeing': [
        { name: 'Sneakers',          suggest: p => p.citySightseeing },
        { name: 'Camera',            suggest: p => p.citySightseeing },
        { name: 'Sunglasses',        suggest: p => p.citySightseeing },
        { name: 'Sun Hat',           suggest: p => p.citySightseeing && p.hot },
        { name: 'Sunscreen',         suggest: p => p.citySightseeing && p.hot },
        { name: 'Power Bank',        suggest: p => p.citySightseeing },
        { name: 'Backpack',          suggest: p => p.citySightseeing },
        { name: 'Raincoat',          suggest: p => p.citySightseeing && p.rainy },
        { name: 'Travel Guidebook',  suggest: p => p.citySightseeing },
        { name: 'Portable Umbrella',  suggest: p => p.citySightseeing && p.rainy },
    ],
    'Dining': [
        { name: 'Dress',              suggest: (p, g) => g !== 'male' && p.dining },
        { name: 'Dress Shoes',        suggest: (p, g) => g !== 'female' && p.dining },
        { name: 'Blazer',             suggest: p => p.dining },
        { name: 'Button-Down Shirts', suggest: (p, g) => g !== 'female' && p.dining },
        { name: 'Dress Pants',        suggest: (p, g) => g !== 'female' && p.dining },
        { name: 'Heels',              suggest: (p, g) => g !== 'male' && p.dining },
        { name: 'Tie',                suggest: (p, g) => g !== 'female' && p.dining },
    ],
    'Cruise': [
        { name: 'Matching Set',              suggest: p => p.cruise },
        { name: 'Beach Kimono',              suggest: p => p.cruise },
        { name: 'Floral Top',                suggest: p => p.cruise },
        { name: 'Panama Hat',                suggest: p => p.cruise },
        { name: 'Motion Sickness Medication', suggest: p => p.cruise },
        { name: 'Waterproof Sandals',         suggest: p => p.cruise },
    ],
};

// ═══════════════════════════════════════════════════════════════
//  DESTINATION LISTS
// ═══════════════════════════════════════════════════════════════
const BEACH_DESTS    = ['miami','hawaii','bali','cancun','maldives','ibiza','florida','bahamas','caribbean','phuket','tulum','cabo','st. lucia','dominican','jamaica','aruba','barbados','key west','malibu','santa monica','san diego','costa rica','rio','kopaonik'];
const SKI_DESTS      = ['aspen','vail','whistler','verbier','zermatt','alps','jackson hole','tahoe','banff','park city','breckenridge','steamboat','telluride','killington','courchevel'];
const ALWAYS_COLD    = ['alaska','iceland','norway','sweden','finland','greenland','lapland','siberia','antarctica','faroe'];
const RAINY_DESTS    = ['london','amsterdam','portland','seattle','dublin','edinburgh','vancouver','brussels','glasgow','bergen','reykjavik'];
const HOT_DRY_DESTS  = ['las vegas','phoenix','dubai','doha','riyadh','cairo','marrakech','tucson','palm springs','abu dhabi'];
const WINDY_DESTS    = ['chicago','wellington','cape town','patagonia','scotland','ireland','netherlands','ireland','north sea'];
const FOUR_SEASON    = ['new york','nyc','chicago','boston','montreal','toronto','moscow','berlin','warsaw','denver','minneapolis','detroit','cleveland','buffalo','milwaukee','philadelphia','pittsburgh','cincinnati','columbus','indianapolis','kansas city','st. louis','omaha','baltimore','washington','paris','vienna','budapest','prague','milan','zurich','munich','frankfurt','amsterdam','lviv','kyiv','krakow','riga','vilnius','tallinn','sofia','bucharest','belgrade','zagreb','ljubljana','bratislava','rome','madrid','barcelona','lisbon','athens','oslo','stockholm','helsinki','copenhagen','brussels','antwerp','lyon','marseille','istanbul','tbilisi','yerevan','baku','minsk','chisinau','sarajevo','skopje','tirana','podgorica'];

// ═══════════════════════════════════════════════════════════════
//  TRIP PROFILE BUILDER
// ═══════════════════════════════════════════════════════════════
function buildTripProfile(tripData) {
    const dest  = (tripData.destination || '').toLowerCase();
    // fromDate is a <input type="date"> value, always "YYYY-MM-DD" - parsed
    // via new Date(...).getMonth() this used to silently shift by a day in
    // any timezone behind UTC (e.g. "2026-06-01" parses as UTC midnight,
    // which is still May 31 evening in US timezones), throwing off
    // month-boundary logic like springAllergy below. Slicing the string
    // directly sidesteps Date/timezone parsing entirely.
    const month = tripData.fromDate ? parseInt(tripData.fromDate.slice(5, 7), 10) : null;
    const sel   = tripData.activityCategories || [];

    const isBeachDest    = BEACH_DESTS.some(k => dest.includes(k));
    const isSkiDest      = SKI_DESTS.some(k => dest.includes(k));
    const isColdDest     = ALWAYS_COLD.some(k => dest.includes(k));
    const isRainyDest    = RAINY_DESTS.some(k => dest.includes(k));
    const isHotDryDest   = HOT_DRY_DESTS.some(k => dest.includes(k));
    const isWindyDest    = WINDY_DESTS.some(k => dest.includes(k));
    const isFourSeason   = FOUR_SEASON.some(c => dest.includes(c));

    // Start from destination character
    let hot   = isBeachDest || isHotDryDest;
    let cold  = isColdDest || isSkiDest;
    let snowy = isColdDest || isSkiDest;
    let rainy = isRainyDest;
    let windy = isWindyDest || isRainyDest;

    // Override with seasonal data for four-season cities
    if (month && isFourSeason && !isBeachDest && !isSkiDest) {
        hot   = [6, 7, 8].includes(month);
        cold  = [11, 12, 1, 2, 3].includes(month);
        snowy = [12, 1, 2].includes(month);
        rainy = [4, 5, 9, 10].includes(month);
        windy = rainy || cold;
    }

    // Activity flags (user chips + destination)
    const beach           = isBeachDest || sel.includes('Beach');
    const ski             = isSkiDest   || sel.includes('Snow Sports');
    const hiking          = sel.includes('Hiking');
    const camping         = sel.includes('Camping');
    const swimming        = beach || sel.includes('Swimming');
    const gym             = sel.includes('Gym');
    const business        = sel.includes('Business Trip');
    const nightOut        = sel.includes('Night Out');
    const baby            = sel.includes('Baby');
    const themePark       = sel.includes('Theme Park');
    const festival        = sel.includes('Festival');
    const roadTrip        = sel.includes('Road Trip');
    const citySightseeing = sel.includes('City Sightseeing');
    const dining          = sel.includes('Dining');
    const cruise          = sel.includes('Cruise');

    // Activities can modify weather profile
    if (beach)    hot   = true;
    if (ski)    { cold  = true; snowy = true; }

    // destinationCountry comes from the geocoding suggestion the user
    // picked in newTrip.html — null for trips saved before this was
    // tracked, or when a destination was typed without picking a
    // suggestion. Unknown defaults to international: suggesting Passport
    // when it isn't needed is a minor inconvenience, silently dropping it
    // from a real international trip is a much worse one.
    const isInternational = tripData.destinationCountry
        ? tripData.destinationCountry !== 'United States'
        : true;

    // Spring allergy (tree/grass pollen) season - trip's start date falls
    // in March through May. Month boundaries line up exactly with the
    // requested Mar 1 - May 31 range, so the existing month number is
    // enough without separate day-level checks.
    const springAllergy = month !== null && month >= 3 && month <= 5;

    return { hot, cold, snowy, rainy, windy, beach, ski, hiking, camping, swimming, gym, business, nightOut, baby, themePark, festival, roadTrip, citySightseeing, dining, cruise, isInternational, springAllergy };
}

// Essentials and Electronics are always suggested — cannot be dismissed
const ALWAYS_SUGGEST_CATS = new Set(['Essentials', 'Electronics']);

function getItemKey(cat, name) { return `${cat}::${name}`; }

// The canonical "what's on the packing list for this trip" computation —
// both packing-list.html and tripPreview.html's sidebar call this with
// their own trip profile/gender/dismissed-set/custom-items so they can
// never again independently drift on what counts as suggested.
function getSuggestedItemKeys({ profile, userGender, dismissed, customItems }) {
    const keys = [];
    const seenNames = new Set();
    Object.entries(ITEM_DB).forEach(([cat, items]) => {
        items.forEach(item => {
            if (!item.suggest(profile, userGender)) return;
            if (!ALWAYS_SUGGEST_CATS.has(cat) && dismissed.has(getItemKey(cat, item.name))) return;
            const normName = item.name.toLowerCase().trim();
            if (seenNames.has(normName)) return;
            seenNames.add(normName);
            keys.push(getItemKey(cat, item.name));
        });
    });
    Object.entries(customItems || {}).forEach(([cat, names]) => {
        names.forEach(name => keys.push(getItemKey(cat, name)));
    });
    return keys;
}
