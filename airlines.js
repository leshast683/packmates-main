/* Packmates — Airline baggage data */
const PACKMATES_AIRLINES = [
  { name: 'American Airlines',  iata: 'AA', region: 'US',
    carry:   { dims: '56×36×23 cm', weight: 'No limit' },
    checked: { weight: '23 kg / 50 lbs', fee: '$30' } },

  { name: 'Delta Air Lines',    iata: 'DL', region: 'US',
    carry:   { dims: '56×36×23 cm', weight: 'No limit' },
    checked: { weight: '23 kg / 50 lbs', fee: '$30' } },

  { name: 'United Airlines',    iata: 'UA', region: 'US',
    carry:   { dims: '56×35×22 cm', weight: 'No limit' },
    checked: { weight: '23 kg / 50 lbs', fee: '$35' } },

  { name: 'Southwest Airlines', iata: 'WN', region: 'US',
    carry:   { dims: '61×41×25 cm', weight: 'No limit' },
    checked: { weight: '23 kg / 50 lbs', fee: 'Free ×2' } },

  { name: 'JetBlue',            iata: 'B6', region: 'US',
    carry:   { dims: '56×36×23 cm', weight: 'No limit' },
    checked: { weight: '23 kg / 50 lbs', fee: '$35' } },

  { name: 'Alaska Airlines',    iata: 'AS', region: 'US',
    carry:   { dims: '56×36×23 cm', weight: 'No limit' },
    checked: { weight: '23 kg / 50 lbs', fee: '$30' } },

  { name: 'Spirit Airlines',    iata: 'NK', region: 'US',
    carry:   { dims: '56×46×25 cm', weight: 'No limit' },
    checked: { weight: '18 kg / 40 lbs', fee: '$45+' } },

  { name: 'Frontier Airlines',  iata: 'F9', region: 'US',
    carry:   { dims: '61×41×25 cm', weight: 'No limit' },
    checked: { weight: '23 kg / 50 lbs', fee: '$45+' } },

  { name: 'Air Canada',         iata: 'AC', region: 'CA',
    carry:   { dims: '55×40×23 cm', weight: 'No limit' },
    checked: { weight: '23 kg / 50 lbs', fee: 'CA$30' } },

  { name: 'British Airways',    iata: 'BA', region: 'EU',
    carry:   { dims: '56×45×25 cm', weight: 'No limit' },
    checked: { weight: '23 kg / 50 lbs', fee: 'Included' } },

  { name: 'Ryanair',            iata: 'FR', region: 'EU',
    carry:   { dims: '40×20×25 cm', weight: '10 kg' },
    checked: { weight: '20 kg / 44 lbs', fee: '€25+' } },

  { name: 'EasyJet',            iata: 'U2', region: 'EU',
    carry:   { dims: '56×45×25 cm', weight: 'No limit' },
    checked: { weight: '23 kg / 50 lbs', fee: '£26+' } },

  { name: 'Wizz Air',           iata: 'W6', region: 'EU',
    carry:   { dims: '40×30×20 cm', weight: 'No limit' },
    checked: { weight: '20 kg / 44 lbs', fee: '€24+' } },

  { name: 'Lufthansa',          iata: 'LH', region: 'EU',
    carry:   { dims: '55×40×23 cm', weight: '8 kg' },
    checked: { weight: '23 kg / 50 lbs', fee: 'Included' } },

  { name: 'Air France',         iata: 'AF', region: 'EU',
    carry:   { dims: '55×35×25 cm', weight: '12 kg' },
    checked: { weight: '23 kg / 50 lbs', fee: 'Included' } },

  { name: 'KLM',                iata: 'KL', region: 'EU',
    carry:   { dims: '55×35×25 cm', weight: '12 kg' },
    checked: { weight: '23 kg / 50 lbs', fee: 'Included' } },

  { name: 'Turkish Airlines',   iata: 'TK', region: 'EU',
    carry:   { dims: '55×40×23 cm', weight: '8 kg' },
    checked: { weight: '23 kg / 50 lbs', fee: 'Included' } },

  { name: 'Emirates',           iata: 'EK', region: 'ME',
    carry:   { dims: '55×38×20 cm', weight: '7 kg' },
    checked: { weight: '23 kg / 50 lbs', fee: 'Included' } },

  { name: 'Qatar Airways',      iata: 'QR', region: 'ME',
    carry:   { dims: '50×37×25 cm', weight: '7 kg' },
    checked: { weight: '23 kg / 50 lbs', fee: 'Included' } },

  { name: 'Singapore Airlines', iata: 'SQ', region: 'AS',
    carry:   { dims: '55×45×25 cm', weight: '7 kg' },
    checked: { weight: '30 kg / 66 lbs', fee: 'Included' } },

  { name: 'Cathay Pacific',     iata: 'CX', region: 'AS',
    carry:   { dims: '56×36×23 cm', weight: '7 kg' },
    checked: { weight: '23 kg / 50 lbs', fee: 'Included' } },

  { name: 'ANA',                iata: 'NH', region: 'AS',
    carry:   { dims: '55×40×25 cm', weight: '10 kg' },
    checked: { weight: '23 kg / 50 lbs', fee: 'Included' } },

  { name: 'LATAM Airlines',     iata: 'LA', region: 'SA',
    carry:   { dims: '55×35×25 cm', weight: '8 kg' },
    checked: { weight: '23 kg / 50 lbs', fee: '$30' } },

  { name: 'Aeromexico',         iata: 'AM', region: 'MX',
    carry:   { dims: '55×40×25 cm', weight: '10 kg' },
    checked: { weight: '25 kg / 55 lbs', fee: 'Included' } },
];
