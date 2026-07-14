// ═══════════════════════════════════════════════════════════════
//  ITEM DATABASE — single source of truth; also mirrored in packing-data.js
// ═══════════════════════════════════════════════════════════════
const ITEM_DB = {
    'Essentials': [
        { name: 'Passport',              suggest: p => true },
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
    ],
    'Toiletries': [
        { name: 'Toothbrush',  suggest: p => true },
        { name: 'Toothpaste',  suggest: p => true },
        { name: 'Shampoo',     suggest: p => true },
        { name: 'Conditioner', suggest: p => true },
        { name: 'Body Wash',   suggest: p => true },
        { name: 'Deodorant',   suggest: p => true },
        { name: 'Razor',       suggest: p => true },
        { name: 'Moisturizer', suggest: p => true },
        { name: 'Sunscreen',   suggest: p => p.hot || p.beach || p.hiking || p.camping },
        { name: 'Lip Balm',    suggest: p => p.cold || p.snowy || p.windy || p.ski },
        { name: 'Hair Brush',         suggest: p => true },
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
        { name: 'Water Bottle',    suggest: p => p.gym || p.hiking || p.hot },
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
        { name: 'Water Bottle',    suggest: p => p.hiking },
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
        { name: 'Water Bottle', suggest: p => p.hot || p.hiking },
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
        { name: 'Water Bottle', suggest: p => p.themePark },
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
        { name: 'Water Bottle', suggest: p => p.festival },
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
        { name: 'Water Bottle',   suggest: p => p.roadTrip },
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
        { name: 'Water Bottle',      suggest: p => p.citySightseeing },
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
    const month = tripData.fromDate ? new Date(tripData.fromDate).getMonth() + 1 : null;
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

    return { hot, cold, snowy, rainy, windy, beach, ski, hiking, camping, swimming, gym, business, nightOut, baby, themePark, festival, roadTrip, citySightseeing, dining, cruise };
}

// ═══════════════════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════════════════
const tripData    = JSON.parse(localStorage.getItem('currentTrip') || '{}');
const profile     = buildTripProfile(tripData);
const userGender  = (() => { try { return (Auth?.getSession?.()?.gender) || JSON.parse(localStorage.getItem('pm_session') || 'null')?.gender || 'nonbinary'; } catch { return 'nonbinary'; } })();
const _ALL_P = { hot:true, cold:true, beach:true, gym:true, business:true, hiking:true, camping:true, rainy:true, swimming:true, ski:true, snowy:true, windy:true, citySightseeing:true, dining:true, nightOut:true, baby:true, themePark:true, festival:true, roadTrip:true, cruise:true };
function getItemGender(cat, name) {
    const item = (ITEM_DB[cat] || []).find(i => i.name === name);
    if (!item) return null;
    const forMale   = item.suggest(_ALL_P, 'male');
    const forFemale = item.suggest(_ALL_P, 'female');
    if (forMale && !forFemale) return 'male';
    if (!forMale && forFemale) return 'female';
    return null;
}

// City banner image
const cityBanner = document.getElementById('cityBanner');

function applyHeroBanner(url) {
    if (!cityBanner || !url) return;
    cityBanner.style.backgroundImage = `url('${url}')`;
    cityBanner.classList.add('has-image');
    document.querySelector('body > main')?.classList.add('has-city-banner');
}

async function fetchAndCacheCityImage(dest) {
    try {
        const PEXELS_KEY = 'vnk5OqRIBUtBdRV9LUp1oaAn2QiAB5lO0HL8GwM5WrRRQZt5GOaFlVIq';
        const res  = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(dest)}+city+travel&orientation=landscape&per_page=5&size=large`,
            { headers: { Authorization: PEXELS_KEY } }
        );
        const data = await res.json();
        const url  = data.photos?.[0]?.src?.large || null;
        if (url) {
            // Save back to trip so next load is instant
            const saved = JSON.parse(localStorage.getItem('currentTrip') || '{}');
            saved.imageUrl = url;
            localStorage.setItem('currentTrip', JSON.stringify(saved));
        }
        return url;
    } catch { return null; }
}

if (tripData.imageUrl) {
    applyHeroBanner(tripData.imageUrl);
} else if (tripData.destination) {
    fetchAndCacheCityImage(tripData.destination).then(applyHeroBanner);
}

const destination = tripData.destination || 'Trip';
const fromDate    = tripData.fromDate    || '';
const toDate      = tripData.toDate      || '';
const travelers   = tripData.travelers   || 1;

function formatDate(d) {
    if (!d) return '';
    const [y, m, day] = d.split('-');
    return `${parseInt(m)}/${parseInt(day)}/${y}`;
}
function tripDays(from, to) {
    if (!from || !to) return null;
    return Math.max(1, Math.round((new Date(to) - new Date(from)) / 86400000) + 1);
}

const days = tripDays(fromDate, toDate);

function getItemKey(cat, name) { return `${cat}::${name}`; }

// Per-trip pack state lives under pm_pack_${tripId}
const _PACK_KEY = tripData.id ? `pm_pack_${tripData.id}` : null;
const _packRaw  = _PACK_KEY ? JSON.parse(localStorage.getItem(_PACK_KEY) || '{}') : {};
// itemState: { "Cat::Item": { packed: bool, qty: number } }
let itemState   = _packRaw.itemState   || {};
// dismissed: Set of keys the user deleted from suggestions
let dismissed   = new Set(_packRaw.dismissed   || []);
// customItems: { category: [name, ...] }  — user-added
let customItems = _packRaw.customItems || {};

function saveState() {
    if (!_PACK_KEY) return;
    const state = { itemState, dismissed: [...dismissed], customItems };
    localStorage.setItem(_PACK_KEY, JSON.stringify(state));
    /* Sync to Supabase via DB layer (debounced inside DB.savePackState) */
    if (typeof DB !== 'undefined' && tripData.id) {
        DB.savePackState(tripData.id, state);
    }
}

// ── Header ──
document.getElementById('packingListTitle').textContent = destination + ' – Packing List';
const metaParts = [];
if (fromDate && toDate) metaParts.push(`${formatDate(fromDate)} – ${formatDate(toDate)}`);
if (days)               metaParts.push(`${days} day${days !== 1 ? 's' : ''}`);
metaParts.push(`${travelers} traveler${travelers !== 1 ? 's' : ''}`);
const metaEl = document.getElementById('packingSummaryMeta');
if (metaEl) metaEl.textContent = metaParts.join(' · ');

// ── Profile badge ──
const profileBadges = [];
function _act(img, label) {
    return `<span class="pb-chip"><img class="pb-icon" src="img/${img}" alt="">${label}</span>`;
}
function _txt(label) {
    return `<span class="pb-chip pb-chip--weather">${label}</span>`;
}
if (profile.hot)             profileBadges.push(_act('weather_warm.png',  'Warm'));
if (profile.cold)            profileBadges.push(_act('weather_cold.png',  'Cold'));
if (profile.snowy)           profileBadges.push(_act('weather_snowy.png', 'Snowy'));
if (profile.rainy)           profileBadges.push(_act('weather_rainy.png', 'Rainy'));
if (profile.windy)           profileBadges.push(_act('weather_windy.png', 'Windy'));
if (profile.beach)           profileBadges.push(_act('activity_beach.png',       'Beach'));
if (profile.ski)             profileBadges.push(_act('activity_snowsports.png',  'Ski'));
if (profile.hiking)          profileBadges.push(_act('activity_hiking.png',      'Hiking'));
if (profile.camping)         profileBadges.push(_act('activity_camping.png',     'Camping'));
if (profile.swimming)        profileBadges.push(_act('activity_swimming.png',    'Swimming'));
if (profile.gym)             profileBadges.push(_act('activity_gym.png',         'Gym'));
if (profile.business)        profileBadges.push(_act('activity_business.png',    'Business'));
if (profile.nightOut)        profileBadges.push(_act('activity_nightout.png',    'Night Out'));
if (profile.baby)            profileBadges.push(_act('activity_baby.png',        'Baby'));
if (profile.themePark)       profileBadges.push(_act('activity_themepark.png',   'Theme Park'));
if (profile.festival)        profileBadges.push(_act('activity_festival.png',    'Festival'));
if (profile.roadTrip)        profileBadges.push(_act('activity_roadtrip.png',    'Road Trip'));
if (profile.citySightseeing) profileBadges.push(_act('activity_sightseeing.png', 'Sightseeing'));
if (profile.dining)          profileBadges.push(_act('activity_dining.png',      'Dining'));
if (profile.cruise)          profileBadges.push(_act('activity_cruise.png',      'Cruise'));

// ── Count helpers ──
// Essentials and Electronics are always suggested — cannot be dismissed
const ALWAYS_SUGGEST_CATS = new Set(['Essentials', 'Electronics']);

function getSuggestedKeys() {
    const keys = [];
    const seenNames = new Set();
    Object.entries(ITEM_DB).forEach(([cat, items]) => {
        items.forEach(item => {
            if (!item.suggest(profile, userGender)) return;
            // Essentials & Electronics always appear regardless of dismissed state
            if (!ALWAYS_SUGGEST_CATS.has(cat) && dismissed.has(getItemKey(cat, item.name))) return;
            const normName = item.name.toLowerCase().trim();
            if (seenNames.has(normName)) return;
            seenNames.add(normName);
            keys.push(getItemKey(cat, item.name));
        });
    });
    // custom items always included
    Object.entries(customItems).forEach(([cat, names]) => {
        names.forEach(name => keys.push(getItemKey(cat, name)));
    });
    return keys;
}

function updateCounts() {
    const all    = getSuggestedKeys();
    const packed = all.filter(k => itemState[k]?.packed).length;
    const left   = all.length - packed;
    // Percentage is based on all suggested keys (profile-matched, not dismissed)
    // but we also factor in dismissed count so artificially small lists don't show 100%
    const dismissedSuggestedCount = (() => {
        let n = 0;
        Object.entries(ITEM_DB).forEach(([cat, items]) => {
            items.forEach(item => {
                if (item.suggest(profile, userGender) && dismissed.has(getItemKey(cat, item.name))) n++;
            });
        });
        return n;
    })();
    const totalForPct = all.length + dismissedSuggestedCount;
    const pct = PackingMath.calcPackedPct(packed, totalForPct);

    const packedEl   = document.getElementById('packedCount');
    const totalEl    = document.getElementById('totalCount');
    const unpackedEl = document.getElementById('unpackedCount');
    const fillEl     = document.getElementById('progressFill');
    const pctEl      = document.getElementById('progressPct');

    if (packedEl)   packedEl.textContent   = packed;
    if (totalEl)    totalEl.textContent    = all.length;
    if (unpackedEl) unpackedEl.textContent = left;
    if (fillEl)     fillEl.style.width     = pct + '%';
    if (pctEl)      pctEl.textContent      = pct + '%';

    // Show dismissed bar when items have been hidden
    const dismissedBar = document.getElementById('dismissedBar');
    const dismissedCountEl = document.getElementById('dismissedCount');
    if (dismissedBar) {
        if (dismissedSuggestedCount > 0) {
            dismissedBar.style.display = 'block';
            if (dismissedCountEl) dismissedCountEl.textContent = dismissedSuggestedCount;
        } else {
            dismissedBar.style.display = 'none';
        }
    }

    // Finish banner: only show when all ACTIVE items are packed
    const finishEl  = document.getElementById('finishPackingBanner');
    const titleEl   = document.getElementById('finishBannerTitle');
    const subEl     = document.getElementById('finishBannerSub');
    const btnEl     = document.getElementById('finishBannerBtn');
    if (finishEl) {
        const allActivePacked = all.length > 0 && left === 0;
        finishEl.classList.toggle('pl-finish-banner--visible', allActivePacked);
        if (allActivePacked && dismissedSuggestedCount > 0) {
            if (titleEl) titleEl.textContent = 'All visible items packed!';
            if (subEl)   subEl.textContent   = `${dismissedSuggestedCount} item${dismissedSuggestedCount !== 1 ? 's' : ''} still hidden — restore to review`;
            if (btnEl) { btnEl.textContent = 'Restore hidden'; btnEl.onclick = restoreDismissed; }
        } else {
            if (titleEl) titleEl.textContent = "You're all packed!";
            if (subEl)   subEl.textContent   = 'Every item on your list is checked off';
            if (btnEl) { btnEl.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg> Back to Trip'; btnEl.onclick = () => location.href = 'tripPreview.html'; }
        }
    }

    if (_PACK_KEY) {
        try {
            const raw = JSON.parse(localStorage.getItem(_PACK_KEY) || '{}');
            raw.suggestedTotal  = all.length;
            raw.totalSuggested  = totalForPct; // full count (includes dismissed)
            localStorage.setItem(_PACK_KEY, JSON.stringify(raw));
        } catch(e) {}
    }
    _broadcastState();
}

function restoreDismissed() {
    dismissed.clear();
    saveState();
    renderList();
    updateCounts();
}

// ── Render ──
let currentFilter  = 'all';
let showAllItems   = false;
let currentSearch  = '';

// PACKING_ICONS, CAT_FALLBACK_ICONS, getItemIcon — see packing-icons.js


function buildItemRow(cat, name, isCustom) {
    const key    = getItemKey(cat, name);
    const state  = itemState[key] || { packed: false, qty: 1 };
    const packed = state.packed;

    const article = document.createElement('article');
    article.className = `packing-item${packed ? ' packing-item--packed' : ''}`;
    article.dataset.status = packed ? 'packed' : 'not-packed';

    const iconSvg = getItemIcon(name, cat);
    const itemGender = isCustom ? null : getItemGender(cat, name);
    const iconStyle = itemGender === 'male'
        ? ' style="background:rgba(59,130,246,0.12);border-color:rgba(59,130,246,0.25);"'
        : itemGender === 'female'
        ? ' style="background:rgba(236,72,153,0.1);border-color:rgba(236,72,153,0.22);"'
        : '';
    const genderBadge = itemGender === 'male'
        ? '<span class="pl-gender-badge pl-gender-badge--male">♂</span>'
        : itemGender === 'female'
        ? '<span class="pl-gender-badge pl-gender-badge--female">♀</span>'
        : '';
    article.innerHTML = `
        <button class="packing-check${packed ? ' packing-check--checked' : ''}" aria-label="${packed ? 'Mark as not packed' : 'Mark as packed'}"></button>
        <div class="pl-item-icon-wrap"${iconStyle}>${iconSvg}</div>
        <div class="packing-item-content">
            <div class="packing-item-top">
                <h3 class="packing-item-name" style="${packed ? 'text-decoration:line-through;color:#99a8b4;' : ''}">${name}</h3>
                <div style="display:flex;align-items:center;gap:5px;">
                    <button class="qty-btn" data-key="${key}" data-delta="-1" style="width:18px;height:18px;border-radius:50%;border:1px solid #cdd6de;background:#f7fafc;cursor:pointer;font-size:0.75rem;display:inline-flex;align-items:center;justify-content:center;padding:0;flex-shrink:0;">−</button>
                    <span class="packing-quantity qty-display" data-key="${key}">x${state.qty}</span>
                    <button class="qty-btn" data-key="${key}" data-delta="1" style="width:18px;height:18px;border-radius:50%;border:1px solid #cdd6de;background:#f7fafc;cursor:pointer;font-size:0.75rem;display:inline-flex;align-items:center;justify-content:center;padding:0;flex-shrink:0;">+</button>
                    ${ALWAYS_SUGGEST_CATS.has(cat) ? '' : `<button class="dismiss-btn" data-key="${key}" data-cat="${cat}" data-name="${name}" title="Remove suggestion" style="width:18px;height:18px;border-radius:50%;border:none;background:#fdecea;cursor:pointer;font-size:0.7rem;display:inline-flex;align-items:center;justify-content:center;padding:0;flex-shrink:0;color:#c0392b;">✕</button>`}
                </div>
            </div>
            <div class="packing-item-meta">
                ${genderBadge}<span class="packing-tag">${cat}</span>
                <span class="packing-status ${packed ? 'packing-status--packed' : 'packing-status--not-packed'}">${packed ? 'Packed' : 'Unpacked'}</span>
            </div>
        </div>`;

    // Toggle packed
    article.querySelector('.packing-check').addEventListener('click', () => {
        const cur = itemState[key] || { packed: false, qty: 1 };
        cur.packed = !cur.packed;
        itemState[key] = cur;
        saveState();
        renderList();
        updateCounts();
        // Trigger milestone notifications after state changes
        if (window.Notify) setTimeout(() => Notify.checkTrip(), 0);
    });

    // Qty buttons
    article.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            const cur = itemState[btn.dataset.key] || { packed: false, qty: 1 };
            cur.qty = Math.max(1, (cur.qty || 1) + parseInt(btn.dataset.delta));
            itemState[btn.dataset.key] = cur;
            saveState();
            document.querySelectorAll(`.qty-display[data-key="${btn.dataset.key}"]`)
                .forEach(el => el.textContent = `x${cur.qty}`);
        });
    });

    // Dismiss (delete) button (not shown for Essentials / Electronics)
    const dismissBtn = article.querySelector('.dismiss-btn');
    if (!dismissBtn) return article;
    dismissBtn.addEventListener('click', e => {
        e.stopPropagation();
        const k = e.currentTarget.dataset.key;
        dismissed.add(k);
        // Also remove from custom items if it was custom
        const cat2  = e.currentTarget.dataset.cat;
        const name2 = e.currentTarget.dataset.name;
        if (customItems[cat2]) {
            customItems[cat2] = customItems[cat2].filter(n => n !== name2);
            if (!customItems[cat2].length) delete customItems[cat2];
        }
        saveState();
        renderList();
        updateCounts();
    });

    return article;
}

function buildCategorySection(cat, itemEntries) {
    // itemEntries: [{ name, isSuggested }]
    const filtered = itemEntries.filter(({ name, isSuggested }) => {
        if (currentSearch) {
            if (!name.toLowerCase().includes(currentSearch)) return false;
        } else {
            if (!isSuggested && !showAllItems) return false;
        }
        const key    = getItemKey(cat, name);
        const packed = itemState[key]?.packed || false;
        if (currentFilter === 'packed')     return packed;
        if (currentFilter === 'not-packed') return !packed;
        return true;
    });
    if (!filtered.length) return null;

    const section = document.createElement('div');
    section.className = 'packing-category-section';

    const hasSuggested = filtered.some(e => e.isSuggested);
    section.innerHTML = `
        <div class="packing-category-header">
            ${hasSuggested ? '<span class="suggested-dot"></span>' : ''}
            ${cat}
            ${hasSuggested ? '<span class="packing-suggested-badge">✨ Suggested</span>' : ''}
        </div>`;

    filtered.forEach(({ name }) => {
        const row = buildItemRow(cat, name, false);
        section.appendChild(row);
    });
    return section;
}

// Render the "Adapted for your trip" banner once into its stable container
(function initProfileBanner() {
    const wrap = document.getElementById('profileBannerWrap');
    if (!wrap || !profileBadges.length) return;
    wrap.innerHTML = `<div class="packing-suggested-banner"><span class="pb-title">Adapted for your trip</span><div class="pb-badges">${profileBadges.join('')}</div></div>`;
})();

function renderList() {
    currentSearch = (document.getElementById('plSearch')?.value || '').toLowerCase().trim();
    const body = document.getElementById('packingListBody');
    body.innerHTML = '';

    // Build per-category entries
    const seenSuggestedNames = new Set();
    Object.entries(ITEM_DB).forEach(([cat, dbItems]) => {
        const entries = dbItems
            .filter(item => {
                if (!item.suggest(_ALL_P, userGender)) return false;
                const key = getItemKey(cat, item.name);
                // Essentials & Electronics always count as suggested even if dismissed
                const alwaysCat = ALWAYS_SUGGEST_CATS.has(cat);
                const isSugg = item.suggest(profile, userGender) && (!dismissed.has(key) || alwaysCat);
                if (!isSugg) return showAllItems || !!currentSearch;
                // Deduplicate suggested items by name across categories
                const normName = item.name.toLowerCase().trim();
                if (seenSuggestedNames.has(normName)) return false;
                seenSuggestedNames.add(normName);
                return true;
            })
            .map(item => ({
                name: item.name,
                isSuggested: item.suggest(profile, userGender) && (!dismissed.has(getItemKey(cat, item.name)) || ALWAYS_SUGGEST_CATS.has(cat))
            }));

        if (!entries.length) return;

        // For non-suggested items shown via "show all", mark them
        const section = buildCategorySection(cat, entries);
        if (section) body.appendChild(section);
    });

    // Custom-added items
    Object.entries(customItems).forEach(([cat, names]) => {
        if (!names.length) return;
        const section = document.createElement('div');
        section.className = 'packing-category-section';
        section.innerHTML = `<div class="packing-category-header">${cat} <span style="font-size:0.6rem;font-weight:500;color:#5f9d30;text-transform:none;letter-spacing:0;">custom</span></div>`;
        names.forEach(name => {
            if (currentSearch && !name.toLowerCase().includes(currentSearch)) return;
            const key    = getItemKey(cat, name);
            const packed = itemState[key]?.packed || false;
            if (currentFilter === 'packed'     && !packed) return;
            if (currentFilter === 'not-packed' && packed)  return;
            section.appendChild(buildItemRow(cat, name, true));
        });
        if (section.children.length > 1) body.appendChild(section);
    });

    // "Show all / Fewer items" toggle
    const toggle = document.createElement('button');
    toggle.style.cssText = 'margin:16px auto 4px;display:block;background:none;border:1px solid #cdd6de;border-radius:999px;padding:6px 18px;font-size:0.78rem;cursor:pointer;color:#4b5a66;font-family:inherit;';
    toggle.textContent = showAllItems ? '↑ Show suggested items only' : '↓ Browse all items';
    toggle.addEventListener('click', () => {
        showAllItems = !showAllItems;
        renderList();
    });
    body.appendChild(toggle);
}

// ── Filters ──
document.querySelectorAll('.pl-filter, .packing-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.pl-filter, .packing-filter-btn').forEach(b => {
            b.classList.remove('active', 'packing-filter-btn--active');
        });
        btn.classList.add('active', 'packing-filter-btn--active');
        currentFilter = btn.dataset.filter;
        renderList();
    });
});

// ── Search filter ──
const plSearch = document.getElementById('plSearch');
if (plSearch) {
    plSearch.addEventListener('input', () => renderList());
}

// ── Add item modal ──
const modal = document.getElementById('addItemModal');
document.getElementById('openAddItemModal').addEventListener('click', () => {
    modal.classList.add('is-visible');
    modal.setAttribute('aria-hidden', 'false');
});
document.getElementById('closeAddItemModal').addEventListener('click', closeModal);
document.getElementById('cancelAddItem').addEventListener('click', e => { e.preventDefault(); closeModal(); });

function closeModal() {
    modal.classList.remove('is-visible');
    modal.setAttribute('aria-hidden', 'true');
}

document.getElementById('addItemForm').addEventListener('submit', e => {
    e.preventDefault();
    const name     = document.getElementById('newItemName').value.trim();
    const category = document.getElementById('newItemCategory').value;
    const qty      = parseInt(document.getElementById('newItemQty').value) || 1;
    if (!name) return;

    // Check if it's already in ITEM_DB and just dismissed — un-dismiss instead
    const key    = getItemKey(category, name);
    const inDB   = ITEM_DB[category]?.some(i => i.name === name);
    if (inDB) {
        dismissed.delete(key);   // restore suggestion
    } else {
        if (!customItems[category]) customItems[category] = [];
        if (!customItems[category].includes(name)) customItems[category].push(name);
    }
    itemState[key] = { packed: false, qty };
    saveState();
    renderList();
    updateCounts();

    document.getElementById('newItemName').value = '';
    document.getElementById('newItemQty').value  = 1;
    closeModal();
});

// ── Init ──
let _collabChannel   = null;
let _collabTripId    = null;
let _syncInProgress  = false;
renderList();
updateCounts();

// ══════════════════════════════════════════════════════
//  SHARE & COLLAB
// ══════════════════════════════════════════════════════

function _encodeShare() {
    const items = Object.entries(itemState).map(([k, v]) => [k, v.packed ? 1 : 0, v.qty || 1]);
    const payload = {
        v: 1,
        sid:  tripData.id || '',
        dest: tripData.destination || '',
        from: tripData.fromDate    || '',
        to:   tripData.toDate      || '',
        trav: tripData.travelers   || 1,
        by:   (() => { try { return JSON.parse(localStorage.getItem('pm_session') || 'null')?.name || 'A friend'; } catch { return 'A friend'; } })(),
        items,
        custom:    JSON.parse(JSON.stringify(customItems)),
        dismissed: [...dismissed],
    };
    return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
}

function _buildShareUrl() {
    const base = window.location.href.split('?')[0];
    return `${base}?join=${_encodeShare()}`;
}

// Share modal
const shareModal    = document.getElementById('shareModal');
const shareUrlInput = document.getElementById('shareUrl');
document.getElementById('openShareModal').addEventListener('click', () => {
    const url = _buildShareUrl();
    shareUrlInput.value = url;
    document.getElementById('shareCopied').style.display = 'none';
    shareModal.classList.add('is-visible');
});
document.getElementById('closeShareModal').addEventListener('click', () => shareModal.classList.remove('is-visible'));
shareModal.addEventListener('click', e => { if (e.target === shareModal) shareModal.classList.remove('is-visible'); });

document.getElementById('copyShareUrl').addEventListener('click', () => {
    navigator.clipboard.writeText(shareUrlInput.value).then(() => {
        const copied = document.getElementById('shareCopied');
        copied.style.display = 'block';
        setTimeout(() => { copied.style.display = 'none'; }, 2000);
    });
});

// Check for ?join= param on load
(function checkJoinParam() {
    const params = new URLSearchParams(window.location.search);
    const code   = params.get('join');
    if (!code) return;
    try {
        const payload = JSON.parse(decodeURIComponent(escape(atob(code))));
        if (!payload || payload.v !== 1) return;

        const joinBanner = document.getElementById('joinBanner');
        const joinTitle  = document.getElementById('joinTitle');
        const joinSub    = document.getElementById('joinSub');
        const joinAvatar = document.getElementById('joinAvatar');

        if (joinTitle)  joinTitle.textContent = `${payload.dest} Packing List`;
        if (joinSub)    joinSub.textContent   = `Shared by ${payload.by} — join to pack together`;
        if (joinAvatar) joinAvatar.textContent = (payload.by || 'PM').slice(0, 2).toUpperCase();
        if (joinBanner) joinBanner.style.display = 'flex';

        document.getElementById('joinAcceptBtn').addEventListener('click', () => {
            _acceptJoin(payload);
            joinBanner.style.display = 'none';
        });
        document.getElementById('joinDismissBtn').addEventListener('click', () => {
            joinBanner.style.display = 'none';
            // Strip ?join param from URL without reload
            history.replaceState(null, '', window.location.pathname);
        });
    } catch(e) {}
})();

function _acceptJoin(payload) {
    // This creates a NEW trip owned by the recipient, seeded from the
    // sender's shared snapshot — it must NOT reuse payload.sid (the
    // sender's own trip id). Supabase's trips table only allows the
    // owning user_id to write a given id; reusing it would make every
    // recipient's DB.saveTrip() upsert collide with a row they don't own.
    const tripId = 'shared_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    const _esc = s => String(s ?? '').replace(/[<>"'&]/g, c => ({'<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','&':'&amp;'}[c]));
    const newTrip = {
        id:          tripId,
        destination: _esc(payload.dest),
        fromDate:    payload.from,
        toDate:      payload.to,
        travelers:   Math.max(1, Math.min(100, parseInt(payload.trav) || 1)),
        imageUrl:    tripData.imageUrl || '',
    };

    // Merge pack state: remote items take precedence
    const newItemState = {};
    (payload.items || []).forEach(([k, packed, qty]) => {
        newItemState[k] = { packed: !!packed, qty: qty || 1 };
    });

    // Sanitize custom items (category keys + item names) from shared payload
    const rawCustom = payload.custom || {};
    const safeCustom = {};
    Object.entries(rawCustom).forEach(([cat, names]) => {
        const safeCat = _esc(String(cat));
        if (safeCat && Array.isArray(names))
            safeCustom[safeCat] = names.map(n => _esc(String(n))).filter(Boolean);
    });

    // Save trip + pack state to localStorage + Supabase
    const joinPackState = { itemState: newItemState, dismissed: payload.dismissed || [], customItems: safeCustom };
    if (typeof DB !== 'undefined') {
        DB.saveTrip(newTrip);
        DB.savePackState(tripId, joinPackState);
    } else {
        const trips = JSON.parse(localStorage.getItem('pm_trips') || '[]');
        if (!trips.find(t => t.id === tripId)) trips.push(newTrip);
        localStorage.setItem('pm_trips', JSON.stringify(trips));
        localStorage.setItem('currentTrip', JSON.stringify(newTrip));
        localStorage.setItem(`pm_pack_${tripId}`, JSON.stringify(joinPackState));
    }

    // Reload page to pick up the joined trip state
    history.replaceState(null, '', window.location.pathname);
    location.reload();
}

// BroadcastChannel for same-browser cross-tab live sync
(function initCollabSync() {
    const tid = tripData.id;
    if (!tid || typeof BroadcastChannel === 'undefined') return;
    _collabTripId  = tid;
    _collabChannel = new BroadcastChannel(`pm_pl_${tid}`);

    _collabChannel.onmessage = e => {
        const msg = e.data;
        if (!msg) return;

        if (msg.type === 'ping') {
            // Another tab just opened — show collab bar and ping back
            const bar = document.getElementById('collabBar');
            const lbl = document.getElementById('collabLabel');
            if (bar) bar.style.display = 'flex';
            if (lbl) lbl.textContent = 'Packing together';
            try { _collabChannel.postMessage({ type: 'pong' }); } catch(e) {}
        }

        if (msg.type === 'pong') {
            const bar = document.getElementById('collabBar');
            const lbl = document.getElementById('collabLabel');
            if (bar) bar.style.display = 'flex';
            if (lbl) lbl.textContent = 'Packing together';
        }

        if (msg.type === 'state') {
            let changed = false;
            (msg.items || []).forEach(([k, packed, qty]) => {
                const cur = itemState[k] || {};
                if (cur.packed !== !!packed) {
                    itemState[k] = { packed: !!packed, qty: qty || 1 };
                    changed = true;
                }
            });
            if (changed) {
                _syncInProgress = true;
                saveState(); renderList(); updateCounts();
                _syncInProgress = false;
            }
        }
    };

    // Announce presence to other tabs
    try { _collabChannel.postMessage({ type: 'ping' }); } catch(e) {}
})();

function _broadcastState() {
    if (!_collabChannel || _syncInProgress) return;
    const items = Object.entries(itemState).map(([k, v]) => [k, v.packed ? 1 : 0, v.qty || 1]);
    try { _collabChannel.postMessage({ type: 'state', items }); } catch(e) {}
}

// ── Supabase Realtime: live packing collaboration ACROSS devices/users ──
// BroadcastChannel above only ever worked between tabs of the same
// browser on the same device — not real collaboration between two
// different people. This subscribes to postgres_changes on
// packing_state for this trip, same pattern as index.js's trips-realtime
// channel, so a packmate checking something off on their own phone
// actually shows up here live.
let _collabRealtimeMembers = new Map(); // user_id -> name, for the "who's packing" label
(async function initRealtimeCollab() {
    const tid = tripData.id;
    if (!tid || typeof window._pm_sbLoaded === 'undefined') return;
    const sbClient = await window._pm_sbLoaded;
    if (!sbClient) return;
    const { data: { session } } = await sbClient.auth.getSession();
    if (!session) return;
    const myUserId = session.user.id;

    if (typeof Auth !== 'undefined') {
        Auth.getTripMembers(tid).then(members => {
            members.forEach(m => _collabRealtimeMembers.set(m.user_id, m.name || 'A packmate'));
        });
    }

    sbClient.channel(`packing-state-${tid}`)
        .on('postgres_changes', {
            event: '*', schema: 'public', table: 'packing_state',
            filter: `trip_id=eq.${tid}`,
        }, payload => {
            const row = payload.new;
            if (!row || row.user_id === myUserId) return; // ignore our own write echoing back

            const bar = document.getElementById('collabBar');
            const lbl = document.getElementById('collabLabel');
            const who = _collabRealtimeMembers.get(row.user_id) || 'A packmate';
            if (bar) bar.style.display = 'flex';
            if (lbl) lbl.textContent = `${who} is packing too`;

            let changed = false;
            Object.entries(row.item_state || {}).forEach(([k, v]) => {
                const cur = itemState[k] || {};
                if (cur.packed !== !!v.packed) {
                    itemState[k] = { packed: !!v.packed, qty: v.qty || cur.qty || 1 };
                    changed = true;
                }
            });
            if (changed) {
                _syncInProgress = true;
                saveState(); renderList(); updateCounts();
                _syncInProgress = false;
            }
        })
        .subscribe();
})();

/* ── Supabase background sync: pull fresh pack state, reload once if changed ── */
if (!sessionStorage.getItem('pm_pl_synced') && tripData.id) {
    (async () => {
        const before = localStorage.getItem(`pm_pack_${tripData.id}`);
        const changed = await DB.syncPackState(tripData.id);
        if (changed && localStorage.getItem(`pm_pack_${tripData.id}`) !== before) {
            sessionStorage.setItem('pm_pl_synced', '1');
            location.reload();
        }
    })().catch(() => {});
}
