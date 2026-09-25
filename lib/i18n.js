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

    'newTrip.title': 'Plan a New Trip',
    'newTrip.subtitle': 'Fill in the details and get a smart packing list',
    'newTrip.back': 'Back',
    'newTrip.tripName': 'Trip Name',
    'newTrip.optional': '(optional)',
    'newTrip.tripNamePlaceholder': "e.g. Sarah's Bachelorette Trip",
    'newTrip.destination': 'Destination',
    'newTrip.destinationPlaceholder': 'Where are you going?',
    'newTrip.notFlying': 'Traveling by car or train',
    'newTrip.airline': 'Airline',
    'newTrip.airlineSearchPlaceholder': 'Search airline…',
    'newTrip.clear': 'Clear',
    'newTrip.departure': 'Departure',
    'newTrip.return': 'Return',
    'newTrip.travelers': 'Travelers',
    'newTrip.tripTypeActivities': 'Trip Type & Activities',
    'newTrip.activity.beach': 'Beach',
    'newTrip.activity.hiking': 'Hiking',
    'newTrip.activity.camping': 'Camping',
    'newTrip.activity.swimming': 'Swimming',
    'newTrip.activity.snowSports': 'Snow Sports',
    'newTrip.activity.gym': 'Gym',
    'newTrip.activity.business': 'Business',
    'newTrip.activity.nightOut': 'Night Out',
    'newTrip.activity.baby': 'Baby',
    'newTrip.activity.themePark': 'Theme Park',
    'newTrip.activity.festival': 'Festival',
    'newTrip.activity.roadTrip': 'Road Trip',
    'newTrip.activity.sightseeing': 'Sightseeing',
    'newTrip.activity.dining': 'Dining',
    'newTrip.activity.cruise': 'Cruise',
    'newTrip.notes': 'Notes',
    'newTrip.notesPlaceholder': 'Anything else to remember…',
    'newTrip.cancel': 'Cancel',
    'newTrip.createTrip': 'Create Trip',
    'newTrip.saving': 'Saving…',
    'newTrip.carryOn': 'Carry-on',
    'newTrip.checked': 'Checked',
    'newTrip.yourDestinationPlaceholder': 'Your destination',
    'newTrip.setTravelDatesPlaceholder': 'Set your travel dates',
    'newTrip.travelerCountSingular': '{count} traveler',
    'newTrip.travelerCountPlural': '{count} travelers',
    'newTrip.saveError': 'Your trip could not be saved. Please check your connection and try again.',
    'newTrip.tripCreatedNotification': 'Your trip to {destination} has been created!',

    'pack.pageTitle': '{destination} – Packing List',
    'pack.loading': 'Loading…',
    'pack.share': 'Share',
    'pack.backToTrip': 'Back to Trip',
    'pack.addItem': 'Add Item',
    'pack.close': 'Close',
    'pack.stats.packed': 'Packed',
    'pack.stats.total': 'Total',
    'pack.stats.remaining': 'Remaining',
    'pack.itemsHidden': 'items hidden',
    'pack.restoreAll': 'restore all',
    'pack.suggested.title': 'Suggested for your trip',
    'pack.suggested.body': 'Based on your destination and activities',
    'pack.filter.all': 'All',
    'pack.filter.toPack': 'To Pack',
    'pack.filter.packed': 'Packed ✓',
    'pack.searchPlaceholder': 'Search items…',
    'pack.daySingular': '{count} day',
    'pack.dayPlural': '{count} days',
    'pack.badge.warm': 'Warm',
    'pack.badge.cold': 'Cold',
    'pack.badge.snowy': 'Snowy',
    'pack.badge.rainy': 'Rainy',
    'pack.badge.windy': 'Windy',
    'pack.badge.beach': 'Beach',
    'pack.badge.ski': 'Ski',
    'pack.badge.hiking': 'Hiking',
    'pack.badge.camping': 'Camping',
    'pack.badge.swimming': 'Swimming',
    'pack.badge.gym': 'Gym',
    'pack.badge.business': 'Business',
    'pack.badge.nightOut': 'Night Out',
    'pack.badge.baby': 'Baby',
    'pack.badge.themePark': 'Theme Park',
    'pack.badge.festival': 'Festival',
    'pack.badge.roadTrip': 'Road Trip',
    'pack.badge.sightseeing': 'Sightseeing',
    'pack.badge.dining': 'Dining',
    'pack.badge.cruise': 'Cruise',
    'pack.adaptedForTrip': 'Adapted for your trip',
    'pack.finish.readyTitle': 'Ready to finish?',
    'pack.finish.readySub': 'Lock in your progress — you can edit again anytime',
    'pack.finish.finishBtn': 'Finish Packing',
    'pack.finish.allPackedTitle': "You're all packed!",
    'pack.finish.allPackedSub': 'Every item on your list is checked off',
    'pack.finish.allVisiblePackedTitle': 'All visible items packed!',
    'pack.finish.hiddenSingular': '{count} item still hidden — restore to review',
    'pack.finish.hiddenPlural': '{count} items still hidden — restore to review',
    'pack.finish.restoreHidden': 'Restore hidden',
    'pack.finish.completeTitle': 'Packing complete ✓',
    'pack.finish.packedSummarySingular': '{count} item packed — edit anytime if you forgot something',
    'pack.finish.packedSummaryPlural': '{count} items packed — edit anytime if you forgot something',
    'pack.finish.editList': 'Edit List',
    'pack.finish.progressSummary': '{packed} of {total} packed — lock in your progress',
    'pack.markPacked': 'Mark as packed',
    'pack.markUnpacked': 'Mark as not packed',
    'pack.deleteItem': 'Delete item',
    'pack.status.packed': 'Packed',
    'pack.status.unpacked': 'Unpacked',
    'pack.suggestedBadge': '✨ Suggested',
    'pack.customLabel': 'custom',
    'pack.showSuggestedOnly': '↑ Show suggested items only',
    'pack.browseAll': '↓ Browse all items',
    'pack.itemName': 'Item Name',
    'pack.itemNamePlaceholder': 'e.g. Sneakers',
    'pack.category': 'Category',
    'pack.quantity': 'Quantity',
    'pack.category.essentials': 'Essentials',
    'pack.category.toiletries': 'Toiletries',
    'pack.category.accessories': 'Accessories',
    'pack.category.clothing': 'Clothing',
    'pack.category.shoes': 'Shoes',
    'pack.category.electronics': 'Electronics',
    'pack.category.businessTrip': 'Business Trip',
    'pack.category.gym': 'Gym',
    'pack.category.beach': 'Beach',
    'pack.category.swimming': 'Swimming',
    'pack.category.snowSports': 'Snow Sports',
    'pack.category.hiking': 'Hiking',
    'pack.category.camping': 'Camping',
    'pack.category.nightOut': 'Night Out',
    'pack.category.baby': 'Baby',
    'pack.category.themePark': 'Theme Park',
    'pack.category.festival': 'Festival',
    'pack.category.roadTrip': 'Road Trip',
    'pack.category.citySightseeing': 'City Sightseeing',
    'pack.category.dining': 'Dining',
    'pack.category.cruise': 'Cruise',
    'pack.category.rainyWeather': 'Rainy Weather',
    'pack.category.hotSunnyWeather': 'Hot & Sunny Weather',
    'pack.category.snowyWeather': 'Snowy Weather',
    'pack.category.windyWeather': 'Windy Weather',
    'pack.category.coldWeather': 'Cold Weather',
    'pack.share.modalTitle': 'Share Packing List',
    'pack.share.desc': 'Share this link with your travel companions. Anyone with the link can join and pack together in real time.',
    'pack.share.copy': 'Copy',
    'pack.share.copied': 'Link copied!',
    'pack.share.via': 'Share via…',
    'pack.share.syncInfo': 'Changes sync live across all devices using the same link.',
    'pack.share.nativeTitle': '{destination} Packing List',
    'pack.share.nativeText': 'Pack together for {destination} on Packmates AI!',
    'pack.share.defaultTrip': 'Trip',
    'pack.share.defaultThisTrip': 'this trip',
    'pack.join.subtitle': 'Join to pack together in real time',
    'pack.join.accept': 'Join',
    'pack.join.sharedBy': 'Shared by {name} — join to pack together',
    'pack.collab.together': 'Packing together',
    'pack.collab.oneHere': '{name} is here too',
    'pack.collab.manyHere': '{count} packmates are here too',

    'joinTrip.title': 'Join a Trip',
    'joinTrip.subtitle': 'Enter the invite code shared by your packmate to join their trip and sync your packing list.',
    'joinTrip.inviteCode': 'Invite Code',
    'joinTrip.invalidCode': 'Invalid invite code. Double-check and try again.',
    'joinTrip.joinTripBtn': 'Join Trip',
    'joinTrip.or': 'or',
    'joinTrip.createOwnTrip': 'Create your own trip',
    'joinTrip.joining': 'Joining…',
    'joinTrip.joinError': 'Could not join this trip. Please try again.',
    'joinTrip.joinedNotification': 'You joined the trip to {destination}!',

    'login.welcomeBack': 'Welcome Back',
    'login.subtitle': 'Sign in to continue your adventure',
    'login.email': 'Email',
    'login.emailPlaceholder': 'you@example.com',
    'login.password': 'Password',
    'login.passwordPlaceholder': 'Enter your password',
    'login.show': 'Show',
    'login.hide': 'Hide',
    'login.rememberMe': 'Remember me',
    'login.forgotPassword': 'Forgot password?',
    'login.signIn': 'Sign In',
    'login.yourEmail': 'Your Email',
    'login.sendResetLink': 'Send Reset Link',
    'login.backToSignIn': 'Back to sign in',
    'login.orContinueWith': 'or continue with',
    'login.noAccount': "Don't have an account?",
    'login.signUp': 'Sign up',
    'login.sessionExpired': 'Your session expired. Please sign in again.',
    'login.passwordUpdated': 'Password updated! Sign in with your new password.',
    'login.resetPasswordTitle': 'Reset Password',
    'login.resetPasswordSubtitle': 'Enter your email to receive a password reset link',
    'login.enterEmailError': 'Please enter your email.',
    'login.sending': 'Sending…',
    'login.resetLinkSent': 'Check your email for a reset link.',
    'login.confirmationResent': 'Confirmation email resent — check your inbox.',
    'login.failedToResend': 'Failed to resend: {error}',
    'login.tryAgain': 'Try again',
    'login.tooManyAttemptsRetry': 'Too many failed attempts. Try again in {secs}s.',
    'login.signingIn': 'Signing in…',
    'login.confirmEmailFirst': 'Please confirm your email first.',
    'login.resendEmail': 'Resend email',
    'login.tooManyAttemptsWait': 'Too many failed attempts. Please wait {dur} seconds.',

    'signup.title': 'Create Account',
    'signup.subtitle': 'Join and start your first trip today',
    'signup.creatingAccount': 'Creating your account…',
    'signup.confirmationSentTo': 'We sent a confirmation link to',
    'signup.clickLinkToActivate': 'Click the link in your email to activate your account.',
    'signup.checkEmailBtn': 'Check your email →',
    'signup.resendPrompt': "Didn't receive it? Resend email",
    'signup.fullName': 'Full Name',
    'signup.namePlaceholder': 'Your name',
    'signup.passwordPlaceholderMin': 'Min. 8 characters',
    'signup.confirmPassword': 'Confirm Password',
    'signup.repeatPasswordPlaceholder': 'Repeat password',
    'signup.gender': 'Gender',
    'signup.genderMale': 'Male',
    'signup.genderFemale': 'Female',
    'signup.genderNonbinary': 'Non-binary',
    'signup.createAccountBtn': 'Create Account',
    'signup.alreadyHaveAccount': 'Already have an account?',
    'signup.signInLink': 'Sign in',
    'signup.strength.weak': 'Weak',
    'signup.strength.fair': 'Fair',
    'signup.strength.good': 'Good',
    'signup.strength.strong': 'Strong',
    'signup.resendSent': 'Sent! Check your inbox.',
    'signup.resendFailed': 'Failed — tap to try again',
    'signup.passwordMismatch': 'Passwords do not match.',
    'signup.selectGenderError': 'Please select your gender.',
    'signup.creatingAccountTitle': 'Creating account…',
    'signup.justAMoment': 'Just a moment',
    'signup.checkYourEmailTitle': 'Check your email',
    'signup.oneLastStep': 'One last step to get started',
    'signup.signupFailed': 'Sign up failed. Please try again.',

    'notif.title': 'Notifications',
    'notif.subtitle': 'Stay updated with your travel and packing activity',
    'notif.settingsBtn': 'Notification settings',
    'notif.stats.unread': 'Unread',
    'notif.today': 'Today',
    'notif.newLabel': 'New',
    'notif.latestUpdates': 'Latest updates',
    'notif.thisWeek': 'This Week',
    'notif.updatesLabel': 'Updates',
    'notif.recentActivity': 'Recent activity',
    'notif.allClear': 'All Clear',
    'notif.allCaughtUp': "You're all caught up",
    'notif.keepPacking': 'Keep packing! 🎒',
    'notif.filter.all': 'All',
    'notif.filter.trips': 'Trips',
    'notif.filter.packingList': 'Packing List',
    'notif.filter.system': 'System',
    'notif.filter.community': 'Community',
    'notif.markAllRead': 'Mark all as read',
    'notif.clearAllTitle': 'Clear all',
    'notif.clearAllAriaLabel': 'Clear all notifications',
    'notif.earlier': 'Earlier',
    'notif.emptyTitle': "You're all caught up!",
    'notif.emptySubtitle': "No notifications right now. We'll let you know when something happens.",
    'notif.defaultTripFallback': 'your trip',
    'notif.default.reminder': 'Remember to finish packing for <strong>{destination}!</strong>',
    'notif.default.packed': "You're all packed for <strong>{destination}</strong>! Ready to go 🎒",
    'notif.default.tripCreated': 'Your trip to <strong>{destination}</strong> has been created!',
    'notif.default.tripStartsSoon': 'Your trip starts soon — check your packing list!',
    'notif.default.liked': '<strong>{name}</strong> liked your packing list',
    'notif.default.addedAsPackmate': "You've been added as a <strong>Packmate</strong>",
    'notif.time.justNow': 'just now',
    'notif.time.minutesAgo': '{m}m ago',
    'notif.time.hourSingular': '{h} hour ago',
    'notif.time.hourPlural': '{h} hours ago',
    'notif.time.daySingular': '{d} day ago',
    'notif.time.dayPlural': '{d} days ago',
    'notif.time.weekSingular': '{w} week ago',
    'notif.time.weekPlural': '{w} weeks ago',
    'notif.hasNewUpdates': 'You have new updates',
    'notif.confirmClearAll': 'Clear all notifications?',

    'discover.trendingDestinations': 'Trending Destinations',
    'discover.communityTravelers': 'Community Travelers',
    'discover.inspirationForYou': 'Inspiration for you',
    'discover.tripsCount': '{count} trips',
    'discover.closeTravelerProfile': 'Close traveler profile',
    'discover.closeTripDetails': 'Close trip details',
    'discover.packmate': 'Packmate',
    'discover.packmateFollowing': 'Packmate ✓',
    'discover.packmateFollow': '+ Packmate',
    'discover.stats.trips': 'Trips',
    'discover.stats.countries': 'Countries',
    'discover.stats.itemsPacked': 'Items Packed',
    'discover.travelStyle': '🧭 Travel Style',
    'discover.favoriteDestinations': '📍 Favorite Destinations',
    'discover.favoriteActivities': '📈 Favorite Activities',
    'discover.recentPackingLists': '🧳 Recent Packing Lists',
    'discover.realMemberBadge': 'Member',
    'discover.realMemberTitle': 'Real Packmates member',
    'discover.joinedOn': '📅 Joined {date}',
    'discover.genderPrefix': '👤 {gender}',
    'discover.verifiedRealMember': '✓ Real Packmates member',
    'discover.noBioYet': "This traveler hasn't added a bio yet.",
    'discover.defaultMemberName': 'Packmates AI member',
    'discover.defaultCommunityCity': 'Packmates AI community',
    'discover.itemsBadge': '{count} items',
    'discover.public': 'Public',
    'discover.itineraryTab': 'Itinerary',
    'discover.packingListTab': 'Packing List',
    'discover.stats.days': 'Days',
    'discover.stats.travelers': 'Travelers',
    'discover.stats.items': 'Items',
    'discover.brief.visa': 'Visa',
    'discover.brief.currency': 'Currency',
    'discover.brief.weather': 'Weather',
    'discover.brief.safety': 'Safety',
    'discover.brief.weatherPicks': '🌤️ Weather Picks',

    'tripPreview.pastTripBadge': 'Past Trip',
    'tripPreview.fullPackingList': 'Full Packing List',
    'tripPreview.viewFullPackingList': 'View Full Packing List →',
    'tripPreview.viewingTogether': 'Viewing together',
    'tripPreview.invitePackmates': 'Invite Packmates',
    'tripPreview.copyLink': 'Copy Link',
    'tripPreview.copied': 'Copied!',
    'tripPreview.tripMembers': 'Trip Members',
    'tripPreview.addPackmateBtn': '+ Add packmate',
    'tripPreview.noPackmatesAvailable': "No packmates available to add — everyone you've traveled with is already on this trip, or you haven't shared a trip with anyone yet.",
    'tripPreview.tripItinerary': 'Trip Itinerary',
    'tripPreview.addActivity': '↳ Add Activity',
    'tripPreview.beforeYouGo': 'Before You Go',
    'tripPreview.filter.all': 'All',
    'tripPreview.filter.unpacked': 'Unpacked',
    'tripPreview.filter.packed': 'Packed',
    'tripPreview.addActivityModalTitle': 'Add Activity',
    'tripPreview.activityName': 'Activity Name',
    'tripPreview.activityNamePlaceholder': 'e.g. Central Park Walk',
    'tripPreview.type': 'Type',
    'tripPreview.add': 'Add',
    'tripPreview.adding': 'Adding…',
    'tripPreview.aPackmate': 'A packmate',
    'tripPreview.thisPackmate': 'this packmate',
    'tripPreview.owner': 'Owner',
    'tripPreview.removeFromTripTitle': 'Remove from trip',
    'tripPreview.removeFromTripAriaLabel': 'Remove {name} from trip',
    'tripPreview.confirmRemoveMember': "Remove {name} from this trip? They'll lose access to it and their packing progress.",
    'tripPreview.presence.oneViewing': '{name} is viewing this trip too',
    'tripPreview.presence.manyViewing': '{count} packmates are viewing this trip too',
    'tripPreview.packedProgress': '{packed}/{total} packed',
    'tripPreview.brief.defaultVisa': 'Check requirements',
    'tripPreview.brief.defaultCurrency': 'Local currency',
    'tripPreview.brief.defaultWeather': 'Varies',
    'tripPreview.brief.defaultSafety': 'Stay aware',
    'tripPreview.sevenDayForecast': '7-Day Forecast',
    'tripPreview.basedOnLastYear': 'Based on last year',
    'tripPreview.myTripFallback': 'my trip',
    'tripPreview.joinMyTripTitle': 'Join my trip to {destination}',
    'tripPreview.activity.sightseeing': 'Sightseeing',
    'tripPreview.activity.dining': 'Dining',
    'tripPreview.activity.beach': 'Beach',
    'tripPreview.activity.hiking': 'Hiking',
    'tripPreview.activity.camping': 'Camping',
    'tripPreview.activity.gym': 'Gym',
    'tripPreview.activity.swimming': 'Swimming',
    'tripPreview.activity.snowSports': 'Snow Sports',
    'tripPreview.activity.businessTrip': 'Business Trip',
    'tripPreview.activity.nightOut': 'Night Out',
    'tripPreview.activity.baby': 'Baby',
    'tripPreview.activity.themePark': 'Theme Park',
    'tripPreview.activity.festival': 'Festival',
    'tripPreview.activity.roadTrip': 'Road Trip',
    'tripPreview.activityTypeDefaultLabel': 'City Sightseeing',
  },
};

/* Category display names are translated separately from the canonical
   English strings used as ITEM_DB keys / getItemKey() storage keys /
   the "Add Item" <option value="..."> - those must never change language,
   only what's shown on screen. Falls back to the raw canonical string
   for any category not in this map (keeps unknown/custom categories
   readable instead of throwing). */
const CATEGORY_KEYS = {
  'Essentials': 'pack.category.essentials',
  'Toiletries': 'pack.category.toiletries',
  'Accessories': 'pack.category.accessories',
  'Clothing': 'pack.category.clothing',
  'Shoes': 'pack.category.shoes',
  'Electronics': 'pack.category.electronics',
  'Business Trip': 'pack.category.businessTrip',
  'Gym': 'pack.category.gym',
  'Beach': 'pack.category.beach',
  'Swimming': 'pack.category.swimming',
  'Snow Sports': 'pack.category.snowSports',
  'Hiking': 'pack.category.hiking',
  'Camping': 'pack.category.camping',
  'Rainy Weather': 'pack.category.rainyWeather',
  'Hot & Sunny Weather': 'pack.category.hotSunnyWeather',
  'Snowy Weather': 'pack.category.snowyWeather',
  'Windy Weather': 'pack.category.windyWeather',
  'Cold Weather': 'pack.category.coldWeather',
  'Night Out': 'pack.category.nightOut',
  'Baby': 'pack.category.baby',
  'Theme Park': 'pack.category.themePark',
  'Festival': 'pack.category.festival',
  'Road Trip': 'pack.category.roadTrip',
  'City Sightseeing': 'pack.category.citySightseeing',
  'Dining': 'pack.category.dining',
  'Cruise': 'pack.category.cruise',
};

function tCategory(cat) {
  const key = CATEGORY_KEYS[cat];
  return key ? tr(key) : cat;
}

/* Item names (lib/packing-items.js's 274 canonical English "name" fields)
   are a separate translation surface from everything above: they're used
   as literal storage/matching keys (getItemKey(cat, name), customItems
   arrays, dismissed sets) throughout packing-list.js, so the canonical
   name itself can never change. ITEM_TRANSLATIONS is empty today (English
   is the only populated language - see lib/i18n.js's TRANSLATIONS.en) but
   this is where a future language's item-name dictionary plugs in, keyed
   by the exact canonical name, without touching packing-items.js at all. */
const ITEM_TRANSLATIONS = {};

function tItem(name) {
  const lang = getLang();
  if (lang === 'en') return name;
  return (ITEM_TRANSLATIONS[lang] && ITEM_TRANSLATIONS[lang][name]) || name;
}

/* Itinerary activity "type" (tripPreview.html's Add Activity dropdown)
   is the same pattern as CATEGORY_KEYS above: the canonical value is
   stored on each activity object (act.type) and reused as-is when the
   user re-opens the dropdown, so translating the visible label must
   never touch that stored value. Falls back to the raw string for any
   type not in this map - covers getDefaultActivities()'s 'Food & Dining'
   default, which isn't one of the dropdown's own canonical options. */
const ACTIVITY_TYPE_KEYS = {
  'Sightseeing': 'tripPreview.activity.sightseeing',
  'Dining': 'tripPreview.activity.dining',
  'Beach': 'tripPreview.activity.beach',
  'Hiking': 'tripPreview.activity.hiking',
  'Camping': 'tripPreview.activity.camping',
  'Gym': 'tripPreview.activity.gym',
  'Swimming': 'tripPreview.activity.swimming',
  'Snow Sports': 'tripPreview.activity.snowSports',
  'Business Trip': 'tripPreview.activity.businessTrip',
  'Night Out': 'tripPreview.activity.nightOut',
  'Baby': 'tripPreview.activity.baby',
  'Theme Park': 'tripPreview.activity.themePark',
  'Festival': 'tripPreview.activity.festival',
  'Road Trip': 'tripPreview.activity.roadTrip',
};

function tActivityType(value) {
  const key = ACTIVITY_TYPE_KEYS[value];
  return key ? tr(key) : value;
}

function getLang() {
  try {
    const saved = JSON.parse(localStorage.getItem('pm_profile') || '{}').language;
    if (saved && TRANSLATIONS[saved]) return saved;
  } catch (e) {}
  const device = (navigator.language || 'en').slice(0, 2).toLowerCase();
  return TRANSLATIONS[device] ? device : 'en';
}

/* Named tr(), not t() - this codebase uses `t` everywhere as the loop
   variable for "trip" (.map(t => ...), etc.), which would silently
   shadow a global t() the moment a translation call happened inside
   one of those callbacks (exactly what broke the dashboard: t is not
   a function, thrown mid-render, halting everything after it).
   vars: optional {name: 'Alex'} map - substitutes {name} placeholders
   in the translated string. Word order around the placeholder is part
   of each language's own translation, not fixed by the caller, so this
   stays safe to use once more languages exist. */
function tr(key, vars) {
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
    el.textContent = tr(el.getAttribute('data-i18n'));
  });
  scope.querySelectorAll('[data-i18n-attr]').forEach(el => {
    el.getAttribute('data-i18n-attr').split(';').forEach(pair => {
      const idx = pair.indexOf(':');
      if (idx === -1) return;
      const attr = pair.slice(0, idx).trim();
      const key = pair.slice(idx + 1).trim();
      if (attr && key) el.setAttribute(attr, tr(key));
    });
  });
  document.documentElement.lang = getLang();
}
