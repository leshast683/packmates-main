// ═══════════════════════════════════════════════════════════════
//  ITEM DATABASE — sourced from List_database_packmate.xlsx
//  profile: { hot, cold, snowy, rainy, windy, beach, ski,
//             hiking, camping, swimming, gym, business,
//             nightOut, baby, themePark, festival,
//             roadTrip, citySightseeing, dining }
// ═══════════════════════════════════════════════════════════════
const ITEM_DB = {
    'Essentials': [
        { name: 'Passport',       suggest: p => true },
        { name: 'ID',             suggest: p => true },
        { name: 'Cash',           suggest: p => true },
        { name: 'Credit Card',    suggest: p => true },
        { name: 'Phone',          suggest: p => true },
        { name: 'Charger',        suggest: p => true },
        { name: 'Headphones',     suggest: p => true },
        { name: 'Power Bank',     suggest: p => true },
        { name: 'Keys',           suggest: p => true },
        { name: 'Sleep Mask',     suggest: p => true },
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
        { name: 'Sweatpants',         suggest: p => p.gym || p.camping || (!p.business && !p.beach) },
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
        { name: 'Leather Jacket',     suggest: p => !p.beach && !p.gym && !p.hiking },
        { name: 'Beret',              suggest: (p, g) => g !== 'male' },
        { name: 'Bra',                suggest: (p, g) => g !== 'male' },
        { name: 'Tracksuit',          suggest: p => p.gym || p.camping || (!p.business && !p.beach) },
        { name: 'Robe',               suggest: p => true },
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
        { name: 'Crocs',            suggest: p => p.beach || p.hot || p.camping },
        { name: 'Tennis Shoes',     suggest: p => p.gym || p.hot },
    ],
    'Electronics': [
        { name: 'Laptop',         suggest: p => p.business },
        { name: 'Laptop Charger', suggest: p => p.business },
        { name: 'Power Bank',     suggest: p => true },
        { name: 'USB Drive',      suggest: p => p.business },
        { name: 'Camera',         suggest: p => !p.business },
        { name: 'Action Camera',  suggest: p => p.hiking || p.camping || p.beach || p.ski },
        { name: 'Tripod',             suggest: p => !p.business },

        { name: 'Hair Straightener',  suggest: (p, g) => g !== 'male' },
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
        { name: 'Sandals',     suggest: p => p.beach || p.hot },
        { name: 'Sunscreen',   suggest: p => p.beach || p.hot },
        { name: 'Beach Bag',   suggest: p => p.beach },
    ],
    'Swimming': [
        { name: 'Swimming Trunks', suggest: (p, g) => g !== 'female' && p.swimming },
        { name: 'Bikini',          suggest: (p, g) => g !== 'male' && p.swimming },
        { name: 'Goggles',    suggest: p => p.swimming },
        { name: 'Swim Cap',   suggest: p => p.swimming },
        { name: 'Flip Flops', suggest: p => p.swimming || p.beach },
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
        { name: 'Hydration Pack',  suggest: p => p.hiking },
    ],
    'Camping': [
        { name: 'Tent',            suggest: p => p.camping },
        { name: 'Sleeping Bag',    suggest: p => p.camping },

        { name: 'Camp Stove',      suggest: p => p.camping },
        { name: 'Food',            suggest: p => p.camping },
        { name: 'Insect Repellent',suggest: p => p.camping },
    ],
    'Rainy Weather': [
        { name: 'Umbrella',                  suggest: p => p.rainy },
        { name: 'Rain Jacket',               suggest: p => p.rainy },
        { name: 'Rain Poncho',               suggest: p => p.rainy },
        { name: 'Waterproof Backpack Cover', suggest: p => p.rainy || p.hiking },
        { name: 'Poncho',                    suggest: p => p.rainy },
        { name: 'Trench Coat',               suggest: (p, g) => g !== 'male' && p.rainy },
        { name: 'Rain Boots',                suggest: p => p.rainy },
    ],
    'Hot & Sunny Weather': [
        { name: 'Sunscreen (SPF 50+)',   suggest: p => p.hot || p.beach },
        { name: 'Sunglasses',            suggest: p => p.hot || p.beach },
        { name: 'Sun Hat',               suggest: p => p.hot || p.beach },
        { name: 'Reusable Water Bottle', suggest: p => p.hot || p.hiking },
        { name: 'Visor',               suggest: p => p.hot || p.beach },
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
        { name: 'Jumpsuit',              suggest: p => p.nightOut },
        { name: 'Heels',                 suggest: (p, g) => g !== 'male' && p.nightOut },
        { name: 'Dress Shoes',           suggest: (p, g) => g !== 'female' && p.nightOut },
        { name: 'Blazer',                suggest: p => p.nightOut },
        { name: 'Clutch Purse',          suggest: (p, g) => g !== 'male' && p.nightOut },
        { name: 'Perfume/Cologne',       suggest: p => p.nightOut },
        { name: 'Makeup Kit',            suggest: (p, g) => g !== 'male' && p.nightOut },
        { name: 'Hair Styling Products', suggest: p => p.nightOut },
        { name: 'Watch',                 suggest: p => p.nightOut },
        { name: 'Jewelry',               suggest: (p, g) => g !== 'male' && p.nightOut },
    ],
    'Baby': [
        { name: 'Diapers',           suggest: p => p.baby },
        { name: 'Baby Wipes',        suggest: p => p.baby },
        { name: 'Baby Bottle',       suggest: p => p.baby },
        { name: 'Baby Clothes',      suggest: p => p.baby },
        { name: 'Baby Blanket',      suggest: p => p.baby },
        { name: 'Diaper Bag',        suggest: p => p.baby },
        { name: 'Stroller',          suggest: p => p.baby },
        { name: 'Baby Carrier',      suggest: p => p.baby },
        { name: 'Baby Sunscreen',    suggest: p => p.baby && p.hot },
        { name: 'Baby Food Pouches', suggest: p => p.baby },
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
        { name: 'Rain Poncho',  suggest: p => p.themePark && p.rainy },
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
        { name: 'Car Sunshade',   suggest: p => p.roadTrip && p.hot },
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
        { name: 'Portable Umbrella', suggest: p => p.citySightseeing && p.rainy },
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
        { name: 'Striped Shirt',             suggest: p => p.cruise },
        { name: 'Matching Set',              suggest: p => p.cruise },
        { name: 'Straw Bag',                 suggest: p => p.cruise },
        { name: 'Beach Kimono',              suggest: p => p.cruise },
        { name: 'Floral Top',                suggest: p => p.cruise },
        { name: 'Panama Hat',                suggest: p => p.cruise },
        { name: 'Motion Sickness Medication', suggest: p => p.cruise },
        { name: 'Waterproof Phone Pouch',    suggest: p => p.cruise },
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
const FOUR_SEASON    = ['new york','nyc','chicago','boston','montreal','toronto','moscow','berlin','warsaw','denver','minneapolis','detroit','cleveland','buffalo','milwaukee','philadelphia','pittsburgh','cincinnati','columbus','indianapolis','kansas city','st. louis','omaha','baltimore','washington','paris','vienna','budapest','prague','milan','zurich','munich','frankfurt','amsterdam'];

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
const userGender  = (() => { try { return JSON.parse(localStorage.getItem('pm_session') || 'null')?.gender || 'nonbinary'; } catch { return 'nonbinary'; } })();
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
if (cityBanner && tripData.imageUrl) {
    cityBanner.style.backgroundImage = `url('${tripData.imageUrl}')`;
    cityBanner.style.display = 'block';
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

// itemState: { "Cat::Item": { packed: bool, qty: number } }
let itemState   = JSON.parse(localStorage.getItem('packingItemState') || '{}');
// dismissed: Set of keys the user deleted from suggestions
let dismissed   = new Set(JSON.parse(localStorage.getItem('packingDismissed') || '[]'));
// customItems: { category: [name, ...] }  — user-added
let customItems = JSON.parse(localStorage.getItem('packingCustomItems') || '{}');

function saveState() {
    localStorage.setItem('packingItemState',  JSON.stringify(itemState));
    localStorage.setItem('packingDismissed',  JSON.stringify([...dismissed]));
    localStorage.setItem('packingCustomItems',JSON.stringify(customItems));
    // Mirror for tripPreview panel
    const mirror = {};
    Object.entries(itemState).forEach(([k, v]) => { mirror[k] = v.packed; });
    localStorage.setItem('packingState', JSON.stringify(mirror));
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
if (profile.hot)      profileBadges.push('☀️ Warm');
if (profile.cold)     profileBadges.push('🧊 Cold');
if (profile.snowy)    profileBadges.push('❄️ Snowy');
if (profile.rainy)    profileBadges.push('🌧️ Rainy');
if (profile.windy)    profileBadges.push('💨 Windy');
if (profile.beach)    profileBadges.push('🏖️ Beach');
if (profile.ski)      profileBadges.push('⛷️ Ski');
if (profile.hiking)   profileBadges.push('🥾 Hiking');
if (profile.camping)  profileBadges.push('⛺ Camping');
if (profile.swimming) profileBadges.push('🏊 Swimming');
if (profile.gym)             profileBadges.push('💪 Gym');
if (profile.business)        profileBadges.push('💼 Business');
if (profile.nightOut)        profileBadges.push('🌙 Night Out');
if (profile.baby)            profileBadges.push('👶 Baby');
if (profile.themePark)       profileBadges.push('🎢 Theme Park');
if (profile.festival)        profileBadges.push('🎪 Festival');
if (profile.roadTrip)        profileBadges.push('🚗 Road Trip');
if (profile.citySightseeing) profileBadges.push('🏙️ City Sightseeing');
if (profile.dining)          profileBadges.push('🍽️ Dining');
if (profile.cruise)          profileBadges.push('🚢 Cruise');

// ── Count helpers ──
function getSuggestedKeys() {
    const keys = [];
    Object.entries(ITEM_DB).forEach(([cat, items]) => {
        items.forEach(item => {
            if (item.suggest(profile, userGender) && !dismissed.has(getItemKey(cat, item.name)))
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
    const pct    = all.length ? Math.round(packed / all.length * 100) : 0;

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

    const finishEl = document.getElementById('finishPackingBanner');
    if (finishEl) finishEl.classList.toggle('pl-finish-banner--visible', pct === 100 && all.length > 0);
}

// ── Render ──
let currentFilter  = 'all';
let showAllItems   = false;

// ── 3D Item Icons ──
const PACKING_ICONS = {
passport:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-YxxWewuwXdRncaZSbQNORwOieVOP39.png" x="0" y="0" width="20" height="20"/></svg>`,
id_card:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-L5zctAjYpsgWJCCiLRhRHOitYnxfv6.png" x="0" y="0" width="20" height="20"/></svg>`,
cash:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-wnzXfGqb6aI838iS9TCufJSh2ToJP8.png" x="0" y="0" width="20" height="20"/></svg>`,
credit_card:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-xylXWxjRoBYdaH9IPOx1080olvl5Ur.png" x="0" y="0" width="20" height="20"/></svg>`,
phone:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-4InIbjutnVbO2RgfQjb4X5InSQnbWH.png" x="0" y="0" width="20" height="20"/></svg>`,
charger:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-KuYCB2ggXWqJ9fLErN8ArVlWCqFtTU.png" x="0" y="0" width="20" height="20"/></svg>`,
headphones:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/headphones.png" x="0" y="0" width="20" height="20"/></svg>`,
power_bank:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-KUiU6Lyx7ucBrdj6KmS1tmfbFOuHht.png" x="0" y="0" width="20" height="20"/></svg>`,
travel_adapter:`<svg viewBox="0 0 20 20" fill="none"><rect x="4.5" y="3.5" width="11" height="11" rx="3.5" fill="#92400e" opacity="0.35"/><rect x="5" y="3" width="11" height="11" rx="3.5" fill="#b45309"/><rect x="4" y="2.5" width="11" height="11" rx="3.5" fill="#f59e0b"/><rect x="4" y="2.5" width="11" height="4.5" rx="3.5" fill="#fbbf24"/><line x1="8.5" y1="13.5" x2="8.5" y2="17.5" stroke="#b45309" stroke-width="2.5" stroke-linecap="round"/><line x1="12" y1="13.5" x2="12" y2="17.5" stroke="#b45309" stroke-width="2.5" stroke-linecap="round"/><ellipse cx="6" cy="3.5" rx="1.5" ry="0.7" fill="rgba(255,255,255,0.35)"/></svg>`,
keys:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-1p1eEnprVg951vyBF9s7lYXmSCVSEY.png" x="0" y="0" width="20" height="20"/></svg>`,
sleep_mask:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-InGWJKD06MYNFrQzbIWEbQlf3amAfq.png" x="0" y="0" width="20" height="20"/></svg>`,
toothbrush:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-F5zA09gQTWbAIIRCjJTQ5FT7mORctP.png" x="0" y="0" width="20" height="20"/></svg>`,
toothpaste:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-ZbpP6jzw8ZxBokD0Go2PDaOSMhotke.png" x="0" y="0" width="20" height="20"/></svg>`,
conditioner:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-MbZzUetKofCRz1fZChkwXYAeCuL4JI.png" x="0" y="0" width="20" height="20"/></svg>`,
body_wash:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-iJFK52Qh7S0h9qlUdzOko2I4N2xsps.png" x="0" y="0" width="20" height="20"/></svg>`,
moisturizer:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-SR2FSFFLNsBRu5p1nohMqKGcahlWUx.png" x="0" y="0" width="20" height="20"/></svg>`,
mouthwash:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-AddCZZif2hlITBVkWKAeXZXYwii2lo.png" x="0" y="0" width="20" height="20"/></svg>`,
makeup_remover:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-MVz8IK9yFOBJ4bPcwo1g6mZKBUOveb.png" x="0" y="0" width="20" height="20"/></svg>`,
wipes_pack:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-OFjrhU0iMwWJN2wokugkAkar7QmhOl.png" x="0" y="0" width="20" height="20"/></svg>`,
antibacterial_wipes:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-NB6ynt4KVjucDWUAJn9mWzIgOp8MSt.png" x="0" y="0" width="20" height="20"/></svg>`,
spray_bottle:`<svg viewBox="0 0 20 20" fill="none"><rect x="6.5" y="7.5" width="7" height="11" rx="2.5" fill="#14532d" opacity="0.35"/><rect x="7" y="7" width="7" height="11" rx="2.5" fill="#166534"/><rect x="6" y="6.5" width="7" height="11" rx="2.5" fill="#16a34a"/><rect x="6" y="6.5" width="7" height="4.5" rx="2.5" fill="#22c55e"/><path d="M13 8 L16 8 L16 5" fill="none" stroke="#15803d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 5 L18.5 5" fill="none" stroke="#15803d" stroke-width="2" stroke-linecap="round"/><rect x="8.5" y="3.5" width="3" height="3.5" rx="1.5" fill="#14532d"/><rect x="8" y="2.5" width="4" height="1.5" rx="0.5" fill="#4ade80"/><ellipse cx="8" cy="7.5" rx="1.5" ry="0.7" fill="rgba(255,255,255,0.3)"/></svg>`,
shampoo:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-KBuzBkev8p7CT4ixZUl0i6hzyjsQgM.png" x="0" y="0" width="20" height="20"/></svg>`,
perfume:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-USYWgntKCcn9OMx7jLXrlx2zKxF9gA.png" x="0" y="0" width="20" height="20"/></svg>`,
makeup_palette:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-n8G31Cqh3JyKkxXgC4UC1NDwW6tD3A.png" x="0" y="0" width="20" height="20"/></svg>`,
hair_gel:`<svg viewBox="0 0 20 20" fill="none"><rect x="6.5" y="4.5" width="8" height="13" rx="2.5" fill="#1e3a5f" opacity="0.3"/><rect x="7" y="4" width="8" height="13" rx="2.5" fill="#1e40af"/><rect x="6" y="3.5" width="8" height="13" rx="2.5" fill="#3b82f6"/><rect x="6" y="3.5" width="8" height="5" rx="2.5" fill="#60a5fa"/><rect x="7.5" y="1" width="5" height="3" rx="1.5" fill="#1e40af"/><rect x="8" y="0.5" width="4" height="1.2" rx="0.5" fill="#93c5fd"/><line x1="7" y1="10.5" x2="14" y2="10.5" stroke="#1e3a8a" stroke-width="0.8"/><ellipse cx="8" cy="4.5" rx="1.5" ry="0.7" fill="rgba(255,255,255,0.35)"/></svg>`,
hair_styling:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-RCs6a5lnmDpabnkGxGlPRFAZV2yCV3.png" x="0" y="0" width="20" height="20"/></svg>`,
portable_fan:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-khBy1zgHQ8zb5pt9AZnBflDKfviFIX.png" x="0" y="0" width="20" height="20"/></svg>`,
bottle:`<svg viewBox="0 0 20 20" fill="none"><rect x="6.5" y="5.5" width="6" height="12" rx="2.5" fill="#0369a1" opacity="0.35"/><rect x="7" y="5" width="6" height="12" rx="2.5" fill="#0369a1"/><rect x="6" y="4.5" width="6" height="12" rx="2.5" fill="#38bdf8"/><rect x="6" y="4.5" width="6" height="5" rx="2.5" fill="#7dd3fc"/><rect x="7.5" y="2" width="3" height="3" rx="1.5" fill="#0284c7"/><rect x="8.5" y="1" width="1.5" height="1.5" rx="0.5" fill="#0ea5e9"/><line x1="7" y1="9.5" x2="11.5" y2="9.5" stroke="#bae6fd" stroke-width="0.7" opacity="0.8"/><ellipse cx="7.5" cy="5.5" rx="1.5" ry="0.7" fill="rgba(255,255,255,0.35)"/></svg>`,
deodorant:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-ZItoIQlaF0DEvRmduhr0U6hTHSE4sC.png" x="0" y="0" width="20" height="20"/></svg>`,
razor:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-f9yGhonZlOCD6T8TK90BDDYxg8d0YK.png" x="0" y="0" width="20" height="20"/></svg>`,
sunscreen:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-ixp9yadIpp3NmeQqoOdHkQHpqiwkwR.png" x="0" y="0" width="20" height="20"/></svg>`,
lip_balm:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-dRTPgE3MmCK504LAdEjKyEec0G0Iiy.png" x="0" y="0" width="20" height="20"/></svg>`,
hair_brush:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-pJqISMaDiCKUTHyyVYaaBEa6MvD2lu.png" x="0" y="0" width="20" height="20"/></svg>`,
tshirt:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-52nIRaI3O8Vzt3QLTNxUusBjCMUmRd.png" x="0" y="0" width="20" height="20"/></svg>`,
dress_shirt:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-jNFNutQXA079LwSjmfwJeFsid37vkh.png" x="0" y="0" width="20" height="20"/></svg>`,
shorts:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-krulqyuU0RnW7gD5cmNGVFYWTp04K3.png" x="0" y="0" width="20" height="20"/></svg>`,
pants:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-DHJqVcVymFgjko5ZSqVFp0Rhb4fFr3.png" x="0" y="0" width="20" height="20"/></svg>`,
chinos:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-DULdzV3uEdmGmIzORCmUox0QGw8W1z.png" x="0" y="0" width="20" height="20"/></svg>`,
dress:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-sjnsZFCzT6VnSOqmWOg9YE53KR68pi.png" x="0" y="0" width="20" height="20"/></svg>`,
skirt:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-ynfndwK4Pc7POcdzbtavaLFyf9MQZG.png" x="0" y="0" width="20" height="20"/></svg>`,
jacket:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-elw4GyvNsROSSzsDAUmaiKotqamYXy.png" x="0" y="0" width="20" height="20"/></svg>`,
hoodie:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-DFu4wXyJkFJaFa9c4eNam36XjlHHR0.png" x="0" y="0" width="20" height="20"/></svg>`,
socks:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-8rJkcLK2xgsgnmscdQmDusIkoRlkQn.png" x="0" y="0" width="20" height="20"/></svg>`,
wool_socks:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-wsHayAtLFxk5o1f2ZhsJOhwe1keftG.png" x="0" y="0" width="20" height="20"/></svg>`,
hiking_socks:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-5nM8u1foXqXsb2bZcquSCHWwEGFoSS.png" x="0" y="0" width="20" height="20"/></svg>`,
thermal_socks:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/thermal_socks.png" x="0" y="0" width="20" height="20"/></svg>`,
gloves:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-f6aak6Yv0iNA0ticTbBK4UWIFFmhbc.png" x="0" y="0" width="20" height="20"/></svg>`,
scarf:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-Qt5El3U2ZF2YXGHQzXibfjhxrRGHFu.png" x="0" y="0" width="20" height="20"/></svg>`,
beanie:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-SK0Aaj1m2uTI5PZjoFR0OG5vvC2LnS.png" x="0" y="0" width="20" height="20"/></svg>`,
swimsuit:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-C6d9HfLLNfniScaSDDzYHYzQf06hr5.png" x="0" y="0" width="20" height="20"/></svg>`,
underwear:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-j311WLBz7dERAzTfAqZqpCAlh8Kv3T.png" x="0" y="0" width="20" height="20"/></svg>`,
sneaker:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-kDQMGK825nue93CX9JpWUWLCVJsD98.png" x="0" y="0" width="20" height="20"/></svg>`,
sandal:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-DWMYeBZmNCGvylKhjqjHV3CRGeQvDR.png" x="0" y="0" width="20" height="20"/></svg>`,
boots:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-8FdFcdbAGGWvjntzWv0JfI4ZXopXxB.png" x="0" y="0" width="20" height="20"/></svg>`,
heels:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-KjfXgQXsBKzA8UjO5mY2h8W1af3YD1.png" x="0" y="0" width="20" height="20"/></svg>`,
laptop:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-UsyTZyMk2er8VfZu1T68Z4BbnfHYL1.png" x="0" y="0" width="20" height="20"/></svg>`,
laptop_charger:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-gzCDnX3TBsxwYWr2LuYrOQdNGa79ZD.png" x="0" y="0" width="20" height="20"/></svg>`,
camera:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/camera.png" x="0" y="0" width="20" height="20"/></svg>`,
action_camera:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-AmqZZr6gQE3C9i2NzN6ZywoONrlwQD.png" x="0" y="0" width="20" height="20"/></svg>`,
sunglasses:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-0CfnFe8TfwtwCzUStRx2sclgeZgqGI.png" x="0" y="0" width="20" height="20"/></svg>`,
sun_hat:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-tMMTRyfcwkP5GmHmEsBD2lZdN12BRz.png" x="0" y="0" width="20" height="20"/></svg>`,
backpack:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-53doFZDyMbmChPPHfnbbPjt0Zvlzq7.png" x="0" y="0" width="20" height="20"/></svg>`,
rain_cover:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-AbvH02C2XqrfmyICpipznmKPdgtcc1.png" x="0" y="0" width="20" height="20"/></svg>`,
towel:`<svg viewBox="0 0 20 20" fill="none"><rect x="3" y="6.5" width="15" height="9.5" fill="#0369a1" opacity="0.3"/><rect x="2.5" y="6" width="15" height="9.5" fill="#0284c7"/><ellipse cx="10" cy="6" rx="7.5" ry="2.5" fill="#38bdf8"/><ellipse cx="10" cy="15.5" rx="7.5" ry="2.5" fill="#0369a1"/><line x1="2.5" y1="9" x2="17.5" y2="9" stroke="#0369a1" stroke-width="1.5"/><line x1="2.5" y1="12.5" x2="17.5" y2="12.5" stroke="#0369a1" stroke-width="1.5"/><ellipse cx="8" cy="6" rx="3" ry="1.2" fill="rgba(255,255,255,0.35)"/></svg>`,
water_bottle:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-bmzLfyohXRZfMKDJgxQZocCGuZP9sC.png" x="0" y="0" width="20" height="20"/></svg>`,
umbrella:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-UoaYOG517tIhHK4E1CCxU83D6Add6c.png" x="0" y="0" width="20" height="20"/></svg>`,
goggles:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-6LkDZ8sF7kNrYLtUzmFAQEcD16oX4l.png" x="0" y="0" width="20" height="20"/></svg>`,
ski_goggles:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-dMjIw4NmjsDY6WCoBsMDEN6vj2bgsw.png" x="0" y="0" width="20" height="20"/></svg>`,
ski_jacket:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-QLiYzEDDA7Li0CAeyHmINy2WvXsb8W.png" x="0" y="0" width="20" height="20"/></svg>`,
insect_repellent:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-AkYUY4ijrAx50lIj9SJ1z5oVjn0uee.png" x="0" y="0" width="20" height="20"/></svg>`,
tent:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-ctCiP3glZeziQjunHWJqFIWQ66zGZ3.png" x="0" y="0" width="20" height="20"/></svg>`,
sleeping_bag:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/sleeping_bag.png" x="0" y="0" width="20" height="20"/></svg>`,
fanny_pack:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-C4cs8NtrXH5SzfJv6lMYisyGQu4QcO.png" x="0" y="0" width="20" height="20"/></svg>`,
snacks:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-nVpWHTp7s7T6Mhp1BjGdOUOhBSqWns.png" x="0" y="0" width="20" height="20"/></svg>`,
baby_bottle:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-OGmaUYElcQxL0MXidTpKtrdWi3UztG.png" x="0" y="0" width="20" height="20"/></svg>`,
baby_clothes:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-OwYoHmyqGQ3XlXi2ANnhOTkf1HgwB9.png" x="0" y="0" width="20" height="20"/></svg>`,
diapers:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-DpGKizvzkJZGDFt78F1l4Rg9PLzMHb.png" x="0" y="0" width="20" height="20"/></svg>`,
stroller:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-1slpvZJNJz3whlluyHiHoaIPoyP9t1.png" x="0" y="0" width="20" height="20"/></svg>`,
blazer:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-kMTBDO8YMouYhgo7LcVhz6KO8yiWWM.png" x="0" y="0" width="20" height="20"/></svg>`,
tie:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-ANhLFkrdwMpU4LhXbqhD0DfgddYVvj.png" x="0" y="0" width="20" height="20"/></svg>`,
notebook:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-PBF0FeYZPH4cDOId8eP4Rb1N9kvBIY.png" x="0" y="0" width="20" height="20"/></svg>`,
travel_guidebook:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/travel_guidebook.png" x="0" y="0" width="20" height="20"/></svg>`,
travel_pillow:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-smLqiLswTcAJ08IJnAfs3gyvfv0hlS.png" x="0" y="0" width="20" height="20"/></svg>`,
hand_warmers:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-n73OaxtUraodRbDA5Brm726CXkRqNO.png" x="0" y="0" width="20" height="20"/></svg>`,
food_pouch:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-jwAc5vxJ9fw8SIBITV0G4MLATKUrC5.png" x="0" y="0" width="20" height="20"/></svg>`,
food:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-33VvJwhvBY6bLifBr7b19hHHUyYgOv.png" x="0" y="0" width="20" height="20"/></svg>`,
tank_top:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-fBmSahOe73AFveP9atGtcZX8Q9Pcyx.png" x="0" y="0" width="20" height="20"/></svg>`,
long_sleeve:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-XfbHO3vWK3OEjtxdSeZfWpEq3CrYhi.png" x="0" y="0" width="20" height="20"/></svg>`,
polo:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-Q8xyu6uY6PDvgIiOduAKN7uwEMoeUV.png" x="0" y="0" width="20" height="20"/></svg>`,
rain_jacket:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-97KKWtM9HV87QqJDQH21dYGk2ZZRgL.png" x="0" y="0" width="20" height="20"/></svg>`,
coat:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-TkrQWYF1crUX72Bw695CydmHg0CmD2.png" x="0" y="0" width="20" height="20"/></svg>`,
raincoat:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-DUVLvs4tjPQsFuRiqVeKL31PJOsEI1.png" x="0" y="0" width="20" height="20"/></svg>`,
windbreaker:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-97KKWtM9HV87QqJDQH21dYGk2ZZRgL.png" x="0" y="0" width="20" height="20"/></svg>`,
puffer_jacket:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-GGEzZp2bzlrsQLZ4zt9vfa6dvCCDP0.png" x="0" y="0" width="20" height="20"/></svg>`,
sweater:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-JOVC2aaccDU3vjeJccY71hS0itv7qc.png" x="0" y="0" width="20" height="20"/></svg>`,
cardigan:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-cHSIjhsD6PtejH1h02XWWHZFrK6UkN.png" x="0" y="0" width="20" height="20"/></svg>`,
vest:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-h87B7sZdXGUqx5uQSWcde5ryodAbPK.png" x="0" y="0" width="20" height="20"/></svg>`,
jeans:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-DULdzV3uEdmGmIzORCmUox0QGw8W1z.png" x="0" y="0" width="20" height="20"/></svg>`,
sweatpants:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-hHw4TLJq4bb7NXCeCV9rH51aCDi4W6.png" x="0" y="0" width="20" height="20"/></svg>`,
leggings:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-fWfhhhUqJ8AHxeuYJgRMP9Jd96T6NB.png" x="0" y="0" width="20" height="20"/></svg>`,
thermal_base_layer:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-gOFI7RBtT9KlBFX9GpJ9cfJD8zAKFH.png" x="0" y="0" width="20" height="20"/></svg>`,
pajamas:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-ayTfnTrdL87tTq5ustqIVn8YP2GWhi.png" x="0" y="0" width="20" height="20"/></svg>`,
hiking_boots:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-IggFBTZj6FLZJOSOZIjFlIU8ntmuyv.png" x="0" y="0" width="20" height="20"/></svg>`,
dress_shoes:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-Q8LmT9GbMpWUZdjn0alFYIi2QU47Yl.png" x="0" y="0" width="20" height="20"/></svg>`,
loafers:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-Q8LmT9GbMpWUZdjn0alFYIi2QU47Yl.png" x="0" y="0" width="20" height="20"/></svg>`,
ski_boots:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-tSImYdQUhcP8oE49QroO68MOFJiFZe.png" x="0" y="0" width="20" height="20"/></svg>`,
flip_flops:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-jVQKf4o5VsajzoHbIU37DMrJwowKUm.png" x="0" y="0" width="20" height="20"/></svg>`,
usb_drive:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-t28cyW0ZqUKV1htNhbo0SzC8il3KPY.png" x="0" y="0" width="20" height="20"/></svg>`,
tripod:`<svg viewBox="0 0 20 20" fill="none"><rect x="8.5" y="1.5" width="4" height="6" rx="2" fill="#1f2937" opacity="0.35"/><rect x="9" y="1" width="4" height="6" rx="2" fill="#374151"/><rect x="8" y="0.5" width="4" height="6" rx="2" fill="#4b5563"/><rect x="8" y="0.5" width="4" height="2.5" rx="2" fill="#6b7280"/><line x1="10" y1="6.5" x2="3" y2="19" stroke="#374151" stroke-width="2.5" stroke-linecap="round"/><line x1="10" y1="6.5" x2="10" y2="19" stroke="#374151" stroke-width="2.5" stroke-linecap="round"/><line x1="10" y1="6.5" x2="17" y2="19" stroke="#374151" stroke-width="2.5" stroke-linecap="round"/><circle cx="10" cy="6.5" r="2.5" fill="#6b7280"/><circle cx="10" cy="6.5" r="1.2" fill="#374151"/></svg>`,
beach_towel:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-ttKfYZ4l4M0s8G8tY5sxxdsai6ROmm.png" x="0" y="0" width="20" height="20"/></svg>`,
gym_towel:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-UiLLbLcRMRZ5D6QgrgEYHvx2ut3ZGR.png" x="0" y="0" width="20" height="20"/></svg>`,
beach_bag:`<svg viewBox="0 0 20 20" fill="none"><path d="M4 7.5 L16 7.5 L15 17.5 L5 17.5Z" fill="#92400e" opacity="0.35"/><path d="M4 7 L16 7 L15 17 L5 17Z" fill="#b45309"/><path d="M4 6.5 L16 6.5 L16 10 L4 10Z" fill="#d97706"/><path d="M4 6.5 L16 6.5 L16 8 L4 8Z" fill="#f59e0b"/><line x1="6" y1="6.5" x2="5.5" y2="17" stroke="#78350f" stroke-width="0.8"/><line x1="9" y1="6.5" x2="9" y2="17" stroke="#78350f" stroke-width="0.8"/><line x1="12" y1="6.5" x2="12" y2="17" stroke="#78350f" stroke-width="0.8"/><line x1="15" y1="6.5" x2="14.5" y2="17" stroke="#78350f" stroke-width="0.8"/><path d="M7 2.5 Q7 0.5 10 0.5 Q13 0.5 13 2.5 L13 6.5 L7 6.5Z" fill="none" stroke="#d97706" stroke-width="1.8" stroke-linecap="round"/><ellipse cx="6" cy="7" rx="2" ry="0.8" fill="rgba(255,255,255,0.25)"/></svg>`,
clutch_purse:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-SssavTgpvON3oMwRMAlyQWUbD9H3xB.png" x="0" y="0" width="20" height="20"/></svg>`,
diaper_bag:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-f18BeARTmyKtaCcvbbROLCEtmBQLuN.png" x="0" y="0" width="20" height="20"/></svg>`,
tote_bag:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-pDLFY2aJ6Wy7iz4f6hQ9Gz8XKDf4HP.png" x="0" y="0" width="20" height="20"/></svg>`,
baby_wipes:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-nKj5LX1UWFA7mrHpVCmlabiLyJgWjB.png" x="0" y="0" width="20" height="20"/></svg>`,
baby_blanket:`<svg viewBox="0 0 20 20" fill="none"><path d="M2 6.5 Q2 4.5 4 4.5 L16 4.5 Q18 4.5 18 6.5 L18 14.5 Q18 16.5 16 16.5 L4 16.5 Q2 16.5 2 14.5Z" fill="#92400e" opacity="0.25"/><path d="M2 6 Q2 4 4 4 L16 4 Q18 4 18 6 L18 14 Q18 16 16 16 L4 16 Q2 16 2 14Z" fill="#fbbf24"/><path d="M2 6 Q2 4 4 4 L16 4 Q18 4 18 6 L18 9 Q10 10 2 9Z" fill="#fef3c7"/><path d="M2 6 Q2 4 4 4 L16 4 Q18 4 18 5 Q10 5.5 2 5Z" fill="rgba(255,255,255,0.4)"/><line x1="5" y1="7" x2="15" y2="7" stroke="#d97706" stroke-width="1"/><line x1="5" y1="10" x2="15" y2="10" stroke="#d97706" stroke-width="1"/><line x1="5" y1="13" x2="15" y2="13" stroke="#d97706" stroke-width="1"/></svg>`,
car_blanket:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-kXz5iXsbc2bca5Rn9pDHS2tpN0NVHl.png" x="0" y="0" width="20" height="20"/></svg>`,
baby_carrier:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-MSKYQPyjJlVazzoB0biPJTXKccgumv.png" x="0" y="0" width="20" height="20"/></svg>`,
onesie:`<svg viewBox="0 0 20 20" fill="none"><path d="M5 2.5 L1 4.5 L3 8.5 L5 7.5 L5 12.5 L15 12.5 L15 7.5 L17 8.5 L19 4.5 L15 2.5 Q13 5.5 10 5.5 Q7 5.5 5 2.5Z" fill="#d97706" opacity="0.4"/><path d="M5 2 L1 4 L3 8 L5 7 L5 12 L15 12 L15 7 L17 8 L19 4 L15 2 Q13 5 10 5 Q7 5 5 2Z" fill="#fbbf24"/><path d="M5 2 Q6.5 4.5 10 4.5 Q13.5 4.5 15 2 L14.5 2.5 Q13 5 10 5 Q7 5 5.5 2.5Z" fill="#fcd34d"/><path d="M5 2 L1 4 L3 8 L5 7 L5 8" fill="#fcd34d"/><path d="M5 12 L6 18 Q6 19.5 10 19.5 Q14 19.5 14 18 L15 12Z" fill="#f59e0b"/><line x1="10" y1="12" x2="10" y2="18" stroke="#d97706" stroke-width="0.8"/><circle cx="7" cy="15" r="1" fill="#fef9c3"/><circle cx="13" cy="15" r="1" fill="#fef9c3"/></svg>`,
swim_cap:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-sN6BdGo5TEUdURfnV9nfcfDBT95P6d.png" x="0" y="0" width="20" height="20"/></svg>`,
hydration_pack:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-aPBr0yfDJZNTeT5rBB6KUpr6PcK7xp.png" x="0" y="0" width="20" height="20"/></svg>`,
rain_poncho:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-H4fARjhiOvm5IIOOVTg1vHGnJOV26p.png" x="0" y="0" width="20" height="20"/></svg>`,
hair_ties:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-rq5WXNd7FvStgmMw5LSv8HDsZfIisf.png" x="0" y="0" width="20" height="20"/></svg>`,
comb:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-q97kccfhVQKROudjY5J3vdVm23krQO.png" x="0" y="0" width="20" height="20"/></svg>`,
sleeping_pad:`<svg viewBox="0 0 20 20" fill="none"><rect x="1" y="7.5" width="18" height="8" rx="3.5" fill="#14532d" opacity="0.35"/><rect x="1" y="7" width="18" height="8" rx="3.5" fill="#15803d"/><rect x="1" y="7" width="18" height="3.5" rx="3.5" fill="#22c55e"/><ellipse cx="4" cy="7.8" rx="1.5" ry="0.7" fill="rgba(255,255,255,0.25)"/><line x1="5" y1="10.5" x2="5" y2="15" stroke="#14532d" stroke-width="1.8"/><line x1="8.5" y1="10.5" x2="8.5" y2="15" stroke="#14532d" stroke-width="1.8"/><line x1="12" y1="10.5" x2="12" y2="15" stroke="#14532d" stroke-width="1.8"/><line x1="15.5" y1="10.5" x2="15.5" y2="15" stroke="#14532d" stroke-width="1.8"/></svg>`,
camp_stove:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-ZczH3AguUVgIBE56Xtz4ZxR9qf00k3.png" x="0" y="0" width="20" height="20"/></svg>`,
workout_clothes:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-mFyQc7fQv5gAOQ5uwEbgDeh0UdsiVp.png" x="0" y="0" width="20" height="20"/></svg>`,
car_charger:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-bw97fEWUphTdmGN6BLK1Eg3J4nFGKl.png" x="0" y="0" width="20" height="20"/></svg>`,
car_sunshade:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-JawLw7a2G3ba8jCKLlyFa92lYyUm01.png" x="0" y="0" width="20" height="20"/></svg>`,
generic:`<svg viewBox="0 0 20 20" fill="none"><rect x="3.5" y="3.5" width="13" height="13" rx="3.5" fill="#475569" opacity="0.35"/><rect x="3" y="3" width="13" height="13" rx="3.5" fill="#64748b"/><rect x="3" y="3" width="13" height="5" rx="3.5" fill="#94a3b8"/><ellipse cx="5.5" cy="3.8" rx="1.5" ry="0.7" fill="rgba(255,255,255,0.3)"/><line x1="6" y1="11" x2="14" y2="11" stroke="#f1f5f9" stroke-width="1.2" stroke-linecap="round"/><line x1="6" y1="13.5" x2="11" y2="13.5" stroke="#f1f5f9" stroke-width="1" stroke-linecap="round"/></svg>`,
beret:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-OvLfJkKY0Vrm7QLseh7IT6Bm6dJWaW.png" x="0" y="0" width="20" height="20"/></svg>`,
bra:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-lj1Ph4UkPsqBhFZHr36WlqE0DUrkX3.png" x="0" y="0" width="20" height="20"/></svg>`,
sports_bra:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-ndSpDTbVGjQpSjVmwprwYdllihjqSH.png" x="0" y="0" width="20" height="20"/></svg>`,
bomber_jacket:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-nrcvXJr22VXWX9PBtXNZ5UrplwAfhj.png" x="0" y="0" width="20" height="20"/></svg>`,
platform_sandals:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-foHQsqKXIma8sVkPZ4InkOTIhlxVnp.png" x="0" y="0" width="20" height="20"/></svg>`,
crocs:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-UaDOopPLRhMS296mFjwtpnyb41NCad.png" x="0" y="0" width="20" height="20"/></svg>`,
visor:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-buxqomwSVEJaZQ4HmLwMDGa9qiXUGo.png" x="0" y="0" width="20" height="20"/></svg>`,
blouse:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-R0WhSAAz3gy2fa55CqAiEIIxhpC52J.png" x="0" y="0" width="20" height="20"/></svg>`,
canvas_shoes:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-25Y9Z8CPr2GbrCOJekFo5jLy0sg3ce.png" x="0" y="0" width="20" height="20"/></svg>`,
mittens:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-Gv9RgCBoA64VLOWBH3yaV6uddea7fJ.png" x="0" y="0" width="20" height="20"/></svg>`,
bandana:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-83b2IeYjhg1sMlMwkBt4QgKBpsb5BN.png" x="0" y="0" width="20" height="20"/></svg>`,
tracksuit:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-5e7bMEeXHT9InsR4B0TQO7pIfAjFAx.png" x="0" y="0" width="20" height="20"/></svg>`,
fleece_vest:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-8TNOX5UwrO9W6xkFHdrxIne1tJRjQs.png" x="0" y="0" width="20" height="20"/></svg>`,
puffer_vest:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-8uXJHTpTD5jAsJSl5mCS3oEShP97vo.png" x="0" y="0" width="20" height="20"/></svg>`,
tennis_shoes:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-wzmb2LUWgt0zxCRp3ZqEvNf1qduRuR.png" x="0" y="0" width="20" height="20"/></svg>`,
trench_coat:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-DDKn2PTWGR8G1qAhmPXK04tkF0FAfc.png" x="0" y="0" width="20" height="20"/></svg>`,
headband:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-D0E2Fef6bWCImoSudI6fkKR0DVHeq9.png" x="0" y="0" width="20" height="20"/></svg>`,
ballet_flats:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-2b6oQmI4jp05liyQbylh2v3DxNbule.png" x="0" y="0" width="20" height="20"/></svg>`,
platform_boots:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-OICN6o1XPZdTbj3Kgh74Q29d7engGR.png" x="0" y="0" width="20" height="20"/></svg>`,
handbag:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-OAYK6HWr7j9IxNH5mk3vkntjQCJnwc.png" x="0" y="0" width="20" height="20"/></svg>`,
silk_robe:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-spcAZqVLpmLepvdPcNiQR9rfJA4mCX.png" x="0" y="0" width="20" height="20"/></svg>`,
clear_backpack:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-jNbReRdCpjzASHqX6wl70Mmw8SPtov.png" x="0" y="0" width="20" height="20"/></svg>`,
swimming_trunks:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-Hr614argQcTnSMkYH6BFodSeiuWjXl.png" x="0" y="0" width="20" height="20"/></svg>`,
bikini:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-fQUj5KYmAXrOyLMN48aHnBHYzzlsvP.png" x="0" y="0" width="20" height="20"/></svg>`,
rain_boots:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-GD1SIJA3DzHDREMulql6zjPWFazsgS.png" x="0" y="0" width="20" height="20"/></svg>`,
lingerie:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-wI99neuCjazgkbgcqQ5fIk7TImpMWv.png" x="0" y="0" width="20" height="20"/></svg>`,
high_waisted_jeans:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-Ge13nYg6DvdP52OPecVxzbEsaZrbTG.png" x="0" y="0" width="20" height="20"/></svg>`,
business_cards:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-BWHskVIbPlrZ8Wh8PjiuAvT9E3GKa9.png" x="0" y="0" width="20" height="20"/></svg>`,
curling_iron:`<svg viewBox="0 0 20 20" fill="none"><rect x="9" y="1" width="3" height="12" rx="1.5" fill="#7c3aed"/><rect x="9" y="1" width="3" height="5" rx="1.5" fill="#a78bfa"/><path d="M10.5 13 Q14 13 14 16 Q14 19 10.5 19 Q7 19 7 16 Q7 13 10.5 13Z" fill="none" stroke="#7c3aed" stroke-width="1.5"/><circle cx="10.5" cy="16" r="1.5" fill="#c4b5fd"/></svg>`,
hair_straightener:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-d0GAO5ycNDeZ700WGF58zQs6P3yEAi.png" x="0" y="0" width="20" height="20"/></svg>`,
feminine_hygiene:`<svg viewBox="0 0 20 20" fill="none"><rect x="7" y="2" width="6" height="14" rx="3" fill="#ec4899" opacity="0.4"/><rect x="7.5" y="2" width="5" height="14" rx="2.5" fill="#f472b6"/><rect x="7.5" y="2" width="5" height="5" rx="2.5" fill="#fbcfe8"/><rect x="9" y="0.5" width="2" height="2" rx="1" fill="#db2777"/></svg>`,
shaving_cream:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-jhrEvuxE1jo58gPPBZ1K17VWGqlytB.png" x="0" y="0" width="20" height="20"/></svg>`,
belt:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-J9sd8MEDwlXFpu3F8AlkniC2BLmtCu.png" x="0" y="0" width="20" height="20"/></svg>`,
suit:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-2eSeYYzqWreheiRapgbvisjDzfCpTj.png" x="0" y="0" width="20" height="20"/></svg>`,
mini_dress:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-IFAUCtCOj3POQwKUdSUl9TX29nMtEj.png" x="0" y="0" width="20" height="20"/></svg>`,
maxi_dress:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-YQn5FpNL17Scjgl6MSCTuXJU5IZX3V.png" x="0" y="0" width="20" height="20"/></svg>`,
watch:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-GMDUYJRKP7kEcXKVWjUVqk64HOpE0U.png" x="0" y="0" width="20" height="20"/></svg>`,
cowboy_hat:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-R2D8r79JBRWYLJGB18GgsUjN2s4Dzb.png" x="0" y="0" width="20" height="20"/></svg>`,
jewelry:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-93uU08ntOedKehh82hj8kDnFYCfYuC.png" x="0" y="0" width="20" height="20"/></svg>`,
pencil_skirt:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-4O7gnHvnEe3vjfgkJ4eI5m2pIKxj3z.png" x="0" y="0" width="20" height="20"/></svg>`,
jumpsuit:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/jumpsuit.png" x="0" y="0" width="20" height="20"/></svg>`,
floral_top:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/floral_top.png" x="0" y="0" width="20" height="20"/></svg>`,
beach_kimono:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/beach_kimono.png" x="0" y="0" width="20" height="20"/></svg>`,
cocktail_dress:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-tviL78KeLIxPWj8IfzBgmUoRVt8bOt.png" x="0" y="0" width="20" height="20"/></svg>`,
};

const CAT_FALLBACK_ICONS = {
  'Essentials':'passport','Toiletries':'bottle','Clothing':'tshirt','Shoes':'sneaker',
  'Electronics':'laptop','Business Trip':'blazer','Gym':'water_bottle','Beach':'sunscreen',
  'Swimming':'goggles','Snow Sports':'goggles','Hiking':'backpack','Camping':'tent',
  'Night Out':'heels','Baby':'baby_bottle','Theme Park':'backpack','Festival':'fanny_pack',
  'Road Trip':'water_bottle','City Sightseeing':'backpack','Dining':'blazer','Cruise':'sunscreen',
  'Rainy Weather':'umbrella','Hot & Sunny Weather':'sunscreen','Snowy Weather':'boots',
  'Windy Weather':'jacket','Cold Weather':'boots',
};

function getItemIcon(name, cat) {
  const n = name.toLowerCase();
  // Essentials / Documents
  if (n.includes('passport'))                            return PACKING_ICONS.passport;
  if (n === 'id')                                        return PACKING_ICONS.id_card;
  if (n.includes('cash'))                                return PACKING_ICONS.cash;
  if (n.includes('credit card'))                         return PACKING_ICONS.credit_card;
  if (n.includes('business card'))                       return PACKING_ICONS.business_cards;
  if (n.includes('sleep mask') || n.includes('eye mask')) return PACKING_ICONS.sleep_mask;
  if (n.includes('pillow'))                              return PACKING_ICONS.travel_pillow;
  if (n === 'keys' || n === 'key')                       return PACKING_ICONS.keys;
  if (n.includes('guidebook') || n.includes('travel guide'))      return PACKING_ICONS.travel_guidebook;
  if (n.includes('notebook'))                                      return PACKING_ICONS.notebook;
  // Electronics
  if (n.includes('laptop charger'))                      return PACKING_ICONS.laptop_charger;
  if (n.includes('laptop'))                              return PACKING_ICONS.laptop;
  if (n.includes('headphone'))                           return PACKING_ICONS.headphones;
  if (n.includes('phone'))                               return PACKING_ICONS.phone;
  if (n.includes('action camera') || n.includes('gopro')) return PACKING_ICONS.action_camera;
  if (n.includes('camera'))                              return PACKING_ICONS.camera;
  if (n.includes('power bank'))                          return PACKING_ICONS.power_bank;
  if (n.includes('car sunshade') || n.includes('sunshade') || n.includes('windshield shade')) return PACKING_ICONS.car_sunshade;
  if (n.includes('car charger'))                         return PACKING_ICONS.car_charger;
  if (n.includes('charger') || n.includes('charging'))   return PACKING_ICONS.charger;
  if (n.includes('adapter') || n.includes('adaptor'))    return PACKING_ICONS.travel_adapter;
  if (n.includes('usb'))                                 return PACKING_ICONS.usb_drive;
  if (n.includes('tripod'))                              return PACKING_ICONS.tripod;
  // Toiletries — each item unique
  if (n.includes('toothbrush'))                          return PACKING_ICONS.toothbrush;
  if (n.includes('toothpaste'))                          return PACKING_ICONS.toothpaste;
  if (n.includes('razor'))                               return PACKING_ICONS.razor;
  if (n.includes('sunscreen') || n.includes('spf'))      return PACKING_ICONS.sunscreen;
  if (n.includes('lip balm'))                            return PACKING_ICONS.lip_balm;
  if (n.includes('hair brush'))                          return PACKING_ICONS.hair_brush;
  if (n.includes('comb'))                                return PACKING_ICONS.comb;
  if (n.includes('deodorant'))                           return PACKING_ICONS.deodorant;
  if (n.includes('conditioner'))                         return PACKING_ICONS.conditioner;
  if (n.includes('body wash'))                           return PACKING_ICONS.body_wash;
  if (n.includes('moistur'))                             return PACKING_ICONS.moisturizer;
  if (n.includes('mouthwash'))                           return PACKING_ICONS.mouthwash;
  if (n.includes('makeup remover'))                      return PACKING_ICONS.makeup_remover;
  if (n.includes('antibacterial wipe')) return PACKING_ICONS.antibacterial_wipes;
  if (n.includes('makeup wipe') || n.includes('wipe')) return PACKING_ICONS.wipes_pack;
  if (n.includes('moisturizing spray') || n.includes('spray')) return PACKING_ICONS.spray_bottle;
  if (n.includes('shampoo'))                             return PACKING_ICONS.shampoo;
  if (n.includes('perfume') || n.includes('cologne'))    return PACKING_ICONS.perfume;
  if (n.includes('makeup kit') || n.includes('makeup palette') || n.includes('makeup')) return PACKING_ICONS.makeup_palette;
  if (n.includes('curling iron'))                         return PACKING_ICONS.curling_iron;
  if (n.includes('hair straightener') || n.includes('flat iron')) return PACKING_ICONS.hair_straightener;
  if (n.includes('hair styling') || n.includes('hair product'))        return PACKING_ICONS.hair_styling;
  if (n.includes('hair gel') || n.includes('hair wax'))                return PACKING_ICONS.hair_gel;
  if (n.includes('hair tie') || n.includes('hair ties') || n.includes('scrunchie') || n.includes('hair band')) return PACKING_ICONS.hair_ties;
  if (n.includes('feminine hygiene') || n.includes('tampon') || n.includes('pad') && n.includes('hygiene')) return PACKING_ICONS.feminine_hygiene;
  if (n.includes('shaving cream') || n.includes('shaving gel') || n.includes('shave cream')) return PACKING_ICONS.shaving_cream;
  if (n.includes('insect') || n.includes('repellent') || n.includes('bug spray')) return PACKING_ICONS.insect_repellent;
  // Accessories
  if (n.includes('sunglasses'))                          return PACKING_ICONS.sunglasses;
  if (n.includes('visor'))                               return PACKING_ICONS.visor;
  if (n.includes('bandana'))                             return PACKING_ICONS.bandana;
  if (n.includes('beret'))                               return PACKING_ICONS.beret;
  if (n.includes('headband'))                            return PACKING_ICONS.headband;
  if (n.includes('cowboy hat'))                           return PACKING_ICONS.cowboy_hat;
  if (n.includes('sun hat') || (n.includes('hat') && !n.includes('beanie'))) return PACKING_ICONS.sun_hat;
  if (n.includes('beanie') || n.includes('ear muff'))    return PACKING_ICONS.beanie;
  if (n.includes('scarf'))                               return PACKING_ICONS.scarf;
  if (n.includes('mitten'))                              return PACKING_ICONS.mittens;
  if (n.includes('gloves'))                              return PACKING_ICONS.gloves;
  if (n.includes('tie'))                                 return PACKING_ICONS.tie;
  // Clothing — most specific first
  if (n.includes('bikini'))                              return PACKING_ICONS.bikini;
  if (n.includes('swimming trunk') || n.includes('swim trunk')) return PACKING_ICONS.swimming_trunks;
  if (n.includes('swimsuit'))                            return PACKING_ICONS.swimsuit;
  if (n.includes('sports bra'))                          return PACKING_ICONS.sports_bra;
  if (n.includes('lingerie'))                            return PACKING_ICONS.lingerie;
  if (n.includes('bra'))                                 return PACKING_ICONS.bra;
  if (n.includes('tracksuit'))                           return PACKING_ICONS.tracksuit;
  if (n.includes('workout') || n.includes('gym outfit') || n.includes('athletic wear')) return PACKING_ICONS.workout_clothes;
  if (n.includes('robe'))                                return PACKING_ICONS.silk_robe;
  if (n.includes('pajama') || n.includes('pyjama'))      return PACKING_ICONS.pajamas;
  if (n.includes('ski goggle'))                           return PACKING_ICONS.ski_goggles;
  if (n.includes('ski jacket'))                           return PACKING_ICONS.ski_jacket;
  if (n.includes('thermal') || n.includes('long john'))  return PACKING_ICONS.thermal_base_layer;
  if (n.includes('underwear') || n.includes('briefs') || n.includes('boxers')) return PACKING_ICONS.underwear;
  if (n.includes('rain poncho') || n.includes('poncho')) return PACKING_ICONS.rain_poncho;
  if (n.includes('rain jacket'))                         return PACKING_ICONS.rain_jacket;
  if (n.includes('puffer') || n.includes('down jacket')) return PACKING_ICONS.puffer_jacket;
  if (n.includes('windbreaker'))                         return PACKING_ICONS.windbreaker;
  if (n.includes('trench'))                              return PACKING_ICONS.trench_coat;
  if (n.includes('raincoat'))                             return PACKING_ICONS.raincoat;
  if (n.includes('coat'))                                 return PACKING_ICONS.coat;
  if (n.includes('leather jacket'))                      return PACKING_ICONS.jacket;
  if (n.includes('bomber'))                              return PACKING_ICONS.bomber_jacket;
  if (n.includes('jacket'))                              return PACKING_ICONS.jacket;
  if (n.includes('suit') && !n.includes('swimsuit') && !n.includes('tracksuit')) return PACKING_ICONS.suit;
  if (n.includes('blazer') || n.includes('suit jacket')) return PACKING_ICONS.blazer;
  if (n.includes('cardigan'))                            return PACKING_ICONS.cardigan;
  if (n.includes('hoodie'))                              return PACKING_ICONS.hoodie;
  if (n.includes('fleece vest'))                         return PACKING_ICONS.fleece_vest;
  if (n.includes('puffer vest'))                         return PACKING_ICONS.puffer_vest;
  if (n.includes('sweater') || n.includes('fleece'))     return PACKING_ICONS.sweater;
  if (n.includes('vest'))                                return PACKING_ICONS.vest;
  if (n.includes('dress shirt'))                         return PACKING_ICONS.dress_shirt;
  if (n.includes('blouse'))                              return PACKING_ICONS.blouse;
  if (n.includes('button-down'))                         return PACKING_ICONS.dress_shirt;
  if (n.includes('polo'))                                return PACKING_ICONS.polo;
  if (n.includes('tank top'))                            return PACKING_ICONS.tank_top;
  if (n.includes('long sleeve'))                         return PACKING_ICONS.long_sleeve;
  if (n.includes('beach kimono') || n.includes('kimono'))     return PACKING_ICONS.beach_kimono;
  if (n.includes('floral top') || n.includes('floral shirt')) return PACKING_ICONS.floral_top;
  if (n.includes('t-shirt') || n.includes('shirt'))      return PACKING_ICONS.tshirt;
  if (n.includes('shorts'))                              return PACKING_ICONS.shorts;
  if (n.includes('legging'))                             return PACKING_ICONS.leggings;
  if (n.includes('sweatpant'))                           return PACKING_ICONS.sweatpants;
  if (n.includes('high-waisted jeans') || n.includes('high waisted jeans')) return PACKING_ICONS.high_waisted_jeans;
  if (n.includes('jeans') || n.includes('denim'))        return PACKING_ICONS.jeans;
  if (n.includes('chino') || n.includes('dress pant') || n.includes('trouser')) return PACKING_ICONS.chinos;
  if (n.includes('pant'))                                return PACKING_ICONS.pants;
  if (n.includes('cocktail dress'))                      return PACKING_ICONS.cocktail_dress;
  if (n.includes('mini dress'))                          return PACKING_ICONS.mini_dress;
  if (n.includes('maxi dress'))                          return PACKING_ICONS.maxi_dress;
  if (n.includes('jumpsuit'))                            return PACKING_ICONS.jumpsuit;
  if (n.includes('dress') && !n.includes('pant') && !n.includes('shirt') && !n.includes('shoe')) return PACKING_ICONS.dress;
  if (n.includes('pencil skirt'))                        return PACKING_ICONS.pencil_skirt;
  if (n.includes('skirt'))                               return PACKING_ICONS.skirt;
  if (n.includes('belt'))                                return PACKING_ICONS.belt;
  if (n.includes('onesie'))                              return PACKING_ICONS.onesie;
  if (n.includes('thermal sock'))                         return PACKING_ICONS.thermal_socks;
  if (n.includes('wool sock'))                            return PACKING_ICONS.wool_socks;
  if (n.includes('hiking sock'))                          return PACKING_ICONS.hiking_socks;
  if (n.includes('socks') || n.includes('sock'))         return PACKING_ICONS.socks;
  // Shoes — most specific first
  if (n.includes('ski boot'))                            return PACKING_ICONS.ski_boots;
  if (n.includes('hiking boot') || n.includes('hiking shoe') || n.includes('trail shoe')) return PACKING_ICONS.hiking_boots;
  if (n.includes('rain boot'))                           return PACKING_ICONS.rain_boots;
  if (n.includes('snow boot') || n.includes('winter boot') || n.includes('warm boot')) return PACKING_ICONS.boots;
  if (n.includes('loafer') || n.includes('slip-on'))     return PACKING_ICONS.loafers;
  if (n.includes('dress shoe') || n.includes('oxford') || n.includes('formal shoe')) return PACKING_ICONS.dress_shoes;
  if (n.includes('platform boot'))                       return PACKING_ICONS.platform_boots;
  if (n.includes('boot'))                                return PACKING_ICONS.boots;
  if (n.includes('heel'))                                return PACKING_ICONS.heels;
  if (n.includes('flip flop'))                           return PACKING_ICONS.flip_flops;
  if (n.includes('platform sandal'))                     return PACKING_ICONS.platform_sandals;
  if (n.includes('ballet flat') || n.includes('ballet shoe')) return PACKING_ICONS.ballet_flats;
  if (n.includes('croc'))                                return PACKING_ICONS.crocs;
  if (n.includes('sandal'))                              return PACKING_ICONS.sandal;
  if (n.includes('tennis shoe'))                         return PACKING_ICONS.tennis_shoes;
  if (n.includes('sneaker'))                             return PACKING_ICONS.canvas_shoes;
  if (n.includes('running shoe') || (n.includes('sport') && n.includes('shoe'))) return PACKING_ICONS.sneaker;
  // Bags
  if (n.includes('hydration pack'))                      return PACKING_ICONS.hydration_pack;
  if (n.includes('backpack cover') || n.includes('pack cover') || n.includes('waterproof cover')) return PACKING_ICONS.rain_cover;
  if (n.includes('clear backpack'))                      return PACKING_ICONS.clear_backpack;
  if (n.includes('backpack'))                            return PACKING_ICONS.backpack;
  if (n.includes('fanny pack'))                          return PACKING_ICONS.fanny_pack;
  if (n.includes('diaper bag'))                          return PACKING_ICONS.diaper_bag;
  if (n.includes('beach bag') || n.includes('beach tote')) return PACKING_ICONS.tote_bag;
  if (n.includes('clutch'))                              return PACKING_ICONS.clutch_purse;
  if (n.includes('jewelry') || n.includes('jewellery') || n.includes('necklace') || n.includes('bracelet') || n.includes('ring')) return PACKING_ICONS.jewelry;
  if (n.includes('watch'))                               return PACKING_ICONS.watch;
  if (n.includes('purse') || n.includes('handbag'))      return PACKING_ICONS.handbag;
  if (n.includes('tote'))                                return PACKING_ICONS.tote_bag;
  if (n.includes('bag'))                                 return PACKING_ICONS.tote_bag;
  // Towels
  if (n.includes('beach towel'))                         return PACKING_ICONS.beach_towel;
  if (n.includes('gym towel') || n.includes('sport towel')) return PACKING_ICONS.gym_towel;
  if (n.includes('towel'))                               return PACKING_ICONS.towel;
  // Water / Umbrella
  if (n.includes('water bottle') || n.includes('reusable water')) return PACKING_ICONS.water_bottle;
  if (n.includes('umbrella'))                            return PACKING_ICONS.umbrella;
  // Swimming / Sports
  if (n.includes('goggle'))                              return PACKING_ICONS.goggles;
  if (n.includes('swim cap'))                            return PACKING_ICONS.swim_cap;
  if (n.includes('portable fan'))                        return PACKING_ICONS.portable_fan;
  // Camping / Outdoors
  if (n.includes('tent'))                                return PACKING_ICONS.tent;
  if (n.includes('sleeping bag'))                        return PACKING_ICONS.sleeping_bag;
  if (n.includes('sleeping pad') || n.includes('foam mat') || n.includes('camp mat')) return PACKING_ICONS.sleeping_pad;
  if (n.includes('camp stove') || n.includes('camping stove') || n.includes('stove')) return PACKING_ICONS.camp_stove;
  if (n.includes('hand warmer'))                         return PACKING_ICONS.hand_warmers;
  // Baby
  if (n.includes('stroller'))                            return PACKING_ICONS.stroller;
  if (n.includes('baby bottle'))                         return PACKING_ICONS.baby_bottle;
  if (n.includes('diaper') && !n.includes('bag'))        return PACKING_ICONS.diapers;
  if (n.includes('baby wipe'))                           return PACKING_ICONS.baby_wipes;
  if (n.includes('car blanket'))                           return PACKING_ICONS.car_blanket;
  if (n.includes('baby blanket') || n.includes('blanket')) return PACKING_ICONS.baby_blanket;
  if (n.includes('baby carrier') || n.includes('carrier')) return PACKING_ICONS.baby_carrier;
  if (n.includes('baby cloth'))                          return PACKING_ICONS.baby_clothes;
  if (n.includes('baby'))                                return PACKING_ICONS.baby_bottle;
  // Food / Snacks
  if (n.includes('food pouch') || n.includes('baby food')) return PACKING_ICONS.food_pouch;
  if (n.includes('snack'))                                 return PACKING_ICONS.snacks;
  if (n.includes('food') && !n.includes('pouch'))         return PACKING_ICONS.food;
  return PACKING_ICONS[CAT_FALLBACK_ICONS[cat]] || PACKING_ICONS.generic;
}

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
                    <button class="dismiss-btn" data-key="${key}" data-cat="${cat}" data-name="${name}" title="Remove suggestion" style="width:18px;height:18px;border-radius:50%;border:none;background:#fdecea;cursor:pointer;font-size:0.7rem;display:inline-flex;align-items:center;justify-content:center;padding:0;flex-shrink:0;color:#c0392b;">✕</button>
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

    // Dismiss (delete) button
    article.querySelector('.dismiss-btn').addEventListener('click', e => {
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
        if (!isSuggested && !showAllItems) return false;
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

function renderList() {
    const body = document.getElementById('packingListBody');
    body.innerHTML = '';

    // Profile badges banner
    if (profileBadges.length) {
        const banner = document.createElement('div');
        banner.className = 'packing-suggested-banner';
        banner.innerHTML = `<strong>✨ Adapted for your trip</strong>${profileBadges.join('  ')}`;
        body.appendChild(banner);
    }

    // Build per-category entries
    Object.entries(ITEM_DB).forEach(([cat, dbItems]) => {
        const entries = dbItems
            .filter(item => {
                if (!item.suggest(_ALL_P, userGender)) return false;
                const key = getItemKey(cat, item.name);
                const isSugg = item.suggest(profile, userGender) && !dismissed.has(key);
                return isSugg || showAllItems;
            })
            .map(item => ({
                name: item.name,
                isSuggested: item.suggest(profile, userGender) && !dismissed.has(getItemKey(cat, item.name))
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
renderList();
updateCounts();
