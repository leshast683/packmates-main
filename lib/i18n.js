// ═══════════════════════════════════════════════════════════════
//  Packmates AI — i18n foundation.
//
//  Single source of truth for UI strings, ready for more languages
//  without any further refactoring: adding a language is just adding
//  a key to TRANSLATIONS (and LANGUAGE_NAMES so it shows up in the
//  switcher) - no template/DOM changes needed anywhere.
//
//  Item/category names from lib/packing-items.js are a SEPARATE
//  translation surface (they're also used as storage/matching keys,
//  so their canonical English `name` fields must never change) -
//  that layer is planned for a later pass, not covered here.
//
//  language preference is stored locally only, in pm_profile.language
//  (see profile.html's _pmProfile()/_savePmProfile() for the existing
//  merge-write convention this follows). It is NOT synced to Supabase
//  yet - the `profiles` table (auth.js saveProfile/syncProfile) has a
//  fixed, explicit column list with no `language` column today. Once
//  that column exists, setLang() below is the only place that needs
//  to change to start syncing it.
// ═══════════════════════════════════════════════════════════════

const LANGUAGE_NAMES = {
  en: 'English',
};

const TRANSLATIONS = {
  en: {
    // ── Profile: hero ──
    'profile.hero.greeting': 'Hey, Traveler! 👋',
    'profile.hero.greetingWithName': 'Hey, {name}! 👋',
    'profile.hero.travelerFallback': 'Traveler',
    'profile.hero.locationDefault': 'Explorer',
    'profile.hero.joinedDefault': 'Joined recently',
    'profile.hero.joinedWithDate': 'Joined {date}',
    'profile.hero.packmatesCountSingular': '{count} Packmate',
    'profile.hero.packmatesCountPlural': '{count} Packmates',
    'profile.hero.editLabel': 'Edit Profile',
    'profile.hero.namePlaceholder': 'Display name',
    'profile.hero.locationPlaceholder': 'Your city (e.g. San Francisco, CA)',
    'profile.hero.bioPlaceholder': 'Short bio (max 30 chars)',
    'profile.hero.save': 'Save',
    'profile.hero.cancel': 'Cancel',
    'profile.hero.levelSuffix': 'Level',

    // ── Profile: stats row ──
    'profile.stats.trips': 'Trips',
    'profile.stats.allTime': 'All time',
    'profile.stats.itemsPacked': 'Items Packed',
    'profile.stats.currentTrip': 'Current trip',
    'profile.stats.destinations': 'Destinations',
    'profile.stats.explored': 'Explored',
    'profile.stats.packmates': 'Packmates',
    'profile.stats.viewAll': 'View all →',

    // ── Profile: body cards ──
    'profile.travelStyle.title': 'Your Travel Style',
    'profile.travelStyle.subtitle': 'Based on your trips and packing habits',
    'profile.recentLists.title': 'Recent Packing Lists',
    'profile.timeline.title': 'Travel Timeline',
    'profile.timeline.viewTrip': 'View trip →',
    'profile.timeline.empty': 'No trips yet.',
    'profile.timeline.planFirst': 'Plan your first one →',
    'profile.aiInsights.title': 'AI Packing Insights',
    'profile.aiInsights.subtitle': 'Smart insights from your packing history',
    'profile.aiInsights.viewAll': 'View all',

    // ── Profile: settings list ──
    'profile.settings.title': 'Settings',

    'profile.settings.personal.title': 'Personal Data',
    'profile.settings.personal.subtitle': 'Name, email, phone & gender',
    'profile.settings.personal.fullName': 'Full Name',
    'profile.settings.personal.fullNamePlaceholder': 'Your full name',
    'profile.settings.personal.email': 'Email',
    'profile.settings.personal.emailPlaceholder': 'you@example.com',
    'profile.settings.personal.phone': 'Phone',
    'profile.settings.personal.phonePlaceholder': '+1 (555) 000-0000',
    'profile.settings.personal.gender': 'Gender',
    'profile.settings.personal.genderMale': 'Male',
    'profile.settings.personal.genderFemale': 'Female',
    'profile.settings.personal.genderNonbinary': 'Non-binary',
    'profile.settings.personal.saveBtn': 'Save Changes',

    'profile.settings.security.title': 'Security',
    'profile.settings.security.subtitle': 'Password & login security',
    'profile.settings.security.current': 'Current Password',
    'profile.settings.security.new': 'New Password',
    'profile.settings.security.newHint': 'Min. 8 characters',
    'profile.settings.security.confirm': 'Confirm New Password',
    'profile.settings.security.saveBtn': 'Update Password',

    'profile.settings.subscription.title': 'Subscription',
    'profile.settings.subscription.subtitle': 'Manage your plan',
    'profile.settings.subscription.freeBadge': 'Free Plan',
    'profile.settings.subscription.freeTierTitle': 'Free Tier',
    'profile.settings.subscription.freeTierDesc': 'Up to 3 packing lists · Basic features',
    'profile.settings.subscription.activeBadge': 'Active',
    'profile.settings.subscription.upgradeDesc': 'Upgrade to Pro for unlimited lists, smart weather packing, and real-time collaboration.',
    'profile.settings.subscription.upgradeBtn': 'Upgrade to Pro →',

    'profile.settings.notifications.title': 'Notifications',
    'profile.settings.notifications.subtitle': 'Alerts and emails',
    'profile.settings.notifications.email': 'Email Alerts',
    'profile.settings.notifications.emailSub': 'Trip reminders and updates',
    'profile.settings.notifications.push': 'Push Notifications',
    'profile.settings.notifications.pushSub': 'In-app alerts',
    'profile.settings.notifications.reminders': 'Packing Reminders',
    'profile.settings.notifications.remindersSub': '24h before departure',
    'profile.settings.notifications.newsletter': 'Weekly Newsletter',
    'profile.settings.notifications.newsletterSub': 'Tips, feature updates, and news — once a week',

    'profile.settings.privacy.title': 'Privacy',
    'profile.settings.privacy.subtitle': 'Data controls & visibility',
    'profile.settings.privacy.analytics': 'Analytics',
    'profile.settings.privacy.analyticsSub': 'Help improve Packmates AI',
    'profile.settings.privacy.personalise': 'Personalisation',
    'profile.settings.privacy.personaliseSub': 'Tailored suggestions',
    'profile.settings.privacy.share': 'Share Usage Data',
    'profile.settings.privacy.shareSub': 'Anonymous statistics',
    'profile.settings.privacy.discoverable': 'Show me in Community Travelers',
    'profile.settings.privacy.discoverableSub': 'Your name and photo become visible to other Packmates AI users on the Discover page',
    'profile.settings.privacy.exportBtn': 'Export My Data',
    'profile.settings.privacy.deleteBtn': 'Delete Account',

    'profile.settings.language.title': 'Language',
    'profile.settings.language.subtitle': 'Choose your app language',

    'profile.settings.help.title': 'Help Center',
    'profile.settings.help.subtitle': 'Support and FAQs',
    'profile.faq.q1': 'How do I create a packing list?',
    'profile.faq.a1': 'Head to the Dashboard and tap "New Trip". Give it a destination, set your travel dates and activities, then your smart packing list is generated automatically.',
    'profile.faq.q2': 'Can I share lists with others?',
    'profile.faq.a2': 'Yes! Open any trip, tap the share icon, and send an invite link. Collaborators can view and check off items in real time.',
    'profile.faq.q3': 'I forgot my password. What do I do?',
    'profile.faq.a3': 'On the login screen tap "Forgot password?" and enter your email. We\'ll send a reset link. Check your spam folder if it doesn\'t arrive.',
    'profile.faq.q4': 'How do I contact support?',
    'profile.faq.a4': 'Email us at support@packmates.app. We typically respond within 24 hours on business days.',

    // ── Profile: modals ──
    'profile.deleteModal.title': 'Delete account?',
    'profile.deleteModal.body': 'This will permanently erase all your trips, packing lists, and account data. This action cannot be undone.',
    'profile.deleteModal.cancel': 'Cancel',
    'profile.deleteModal.confirm': 'Yes, delete everything',
    'profile.logoutModal.title': 'Sign out?',
    'profile.logoutModal.body': "You'll need to sign back in to access your packing lists and settings.",
    'profile.logoutModal.stay': 'Stay',
    'profile.logoutModal.confirm': 'Sign Out',

    // ── Profile: toasts ──
    'profile.toast.profileUpdated': 'Profile updated!',
    'profile.toast.genderSaved': 'Gender saved — packing suggestions updated!',
    'profile.toast.passwordUpdated': 'Password updated!',
    'profile.toast.notifSaved': 'Notification preferences saved!',
    'profile.toast.privacySaved': 'Privacy settings saved!',
    'profile.toast.dataDownloading': 'Your data is downloading…',
    'profile.toast.avatarUpdated': 'Profile photo updated!',
    'profile.toast.proComingSoon': 'Pro plan is coming in the future!',
    'profile.toast.signingOut': 'Signing out…',

    // ── Dashboard (index.html / index.js) ──
    'dash.greeting.morning': 'Good morning,',
    'dash.greeting.afternoon': 'Good afternoon,',
    'dash.greeting.evening': 'Good evening,',
    'dash.newTrip': 'New Trip',
    'dash.searchPlaceholder': 'Search destinations…',
    'dash.stats.trips': 'Trips',
    'dash.stats.itemsPacked': 'Items Packed',
    'dash.stats.destinations': 'Destinations',
    'dash.section.othersPacked': 'Others Also Packed',
    'dash.section.explore': 'Explore Destinations',
    'dash.section.seeAll': 'See all →',
    'dash.section.yourTrips': 'Your Trips',
    'dash.readyToStart': 'Ready to start?',
    'dash.weather.label': 'Destination Weather',
    'dash.weather.planTripFirst': 'Plan a trip first',
    'dash.weather.noDestination': 'No destination',
    'dash.weather.feelsLike': 'Feels like',
    'dash.weather.feelsLikeValue': 'Feels like {temp}°',
    'dash.weather.humidity': 'Humidity',
    'dash.weather.wind': 'Wind',

    'dash.confirm.deleteTitle': 'Delete trip?',
    'dash.confirm.leaveTitle': 'Leave trip?',
    'dash.confirm.deleteOk': 'Delete',
    'dash.confirm.leaveOk': 'Leave',
    'dash.confirm.deleteWarning': 'Delete trip to {destination}? This cannot be undone.',
    'dash.confirm.leaveWarning': "Leave trip to {destination}? You'll no longer see it or your packing progress — the trip itself stays intact for everyone else.",
    'dash.confirm.deleteWarningSharedSingular': 'Delete trip to {destination}? {count} other packmate will lose access to it too. This cannot be undone.',
    'dash.confirm.deleteWarningSharedPlural': 'Delete trip to {destination}? {count} other packmates will lose access to it too. This cannot be undone.',
    'dash.error.deleteFailed': 'Could not delete this trip. Please check your connection and try again.',
    'dash.deleteLabel': 'Delete trip',
    'dash.leaveLabel': 'Leave trip',
    'dash.aboutBlurb': 'Packmates AI builds your packing checklist from your real destination, travel dates, weather, and planned activities — not a generic template. Add a trip, and get a weather-aware packing list that updates as your plans change, synced live with everyone traveling with you. Browse trending destinations, track your packing streak, and keep every trip organized in one place.',
  },
};

function getLang() {
  try {
    const saved = JSON.parse(localStorage.getItem('pm_profile') || '{}').language;
    if (saved && TRANSLATIONS[saved]) return saved;
  } catch (e) {}
  const device = (navigator.language || 'en').slice(0, 2).toLowerCase();
  return TRANSLATIONS[device] ? device : 'en';
}

/* vars: optional {name: 'Alex'} map - substitutes {name} placeholders
   in the translated string. Word order around the placeholder is part
   of each language's own translation, not fixed by the caller, so this
   stays safe to use once more languages exist. */
function t(key, vars) {
  const lang = getLang();
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  let str = dict[key] ?? TRANSLATIONS.en[key] ?? key;
  if (vars) {
    Object.keys(vars).forEach(k => { str = str.split('{' + k + '}').join(vars[k]); });
  }
  return str;
}

function setLang(lang) {
  if (!TRANSLATIONS[lang]) return;
  let merged;
  try { merged = { ...JSON.parse(localStorage.getItem('pm_profile') || '{}'), language: lang }; }
  catch (e) { merged = { language: lang }; }
  localStorage.setItem('pm_profile', JSON.stringify(merged));
  /* Same DB.saveProfile() call every other profile field uses (auth.js) -
     harmless no-op server-side today since 'language' isn't a profiles
     column yet; starts syncing automatically the day that column exists,
     no code change needed here. */
  if (typeof DB !== 'undefined' && DB.saveProfile) DB.saveProfile(merged);
  location.reload();
}

/* Walks [data-i18n] (textContent) and [data-i18n-attr] (one or more
   "attr:key" pairs, semicolon-separated, e.g. data-i18n-attr="placeholder:profile.hero.namePlaceholder")
   and fills in the current language's strings. Call after any DOM
   this needs to cover is in place (static markup: on load; JS-rendered
   sections: right after they're inserted). */
function applyTranslations(root) {
  const scope = root || document;
  scope.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  scope.querySelectorAll('[data-i18n-attr]').forEach(el => {
    el.getAttribute('data-i18n-attr').split(';').forEach(pair => {
      const idx = pair.indexOf(':');
      if (idx === -1) return;
      const attr = pair.slice(0, idx).trim();
      const key = pair.slice(idx + 1).trim();
      if (attr && key) el.setAttribute(attr, t(key));
    });
  });
  document.documentElement.lang = getLang();
}
