'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const translations = {
  en: {
    // Hero
    heroTitle: 'Book Your Appointment or Turn at a Barbershop or Hair Salon',
    heroHighlight: 'Appointment',
    heroDescription: 'The smartest way to book barbershop and hair salon services. Choose between scheduling a fixed appointment or reserving your turn with our Turn-Based Booking system. Connect with professional barbers and hair stylists — enjoy your perfect look, your way.',
    // Rotating Hero Titles
    heroRotating1: 'Book your appointment or reserve your turn at a barbershop or hair salon.',
    heroRotating2: 'Book a mobile barber or hair stylist who comes to your door.',
    heroRotating3: 'Explore job opportunities in barbering and hair styling.',
    searchPlaceholder: 'Search barbershop, hair salon...',
    search: 'Search',
    bookMobileBarber: 'Mobile Barber Service',
    learnBarbering: 'Learn Barbering',
    shopSupplies: 'Shop Supplies',
    careerOpportunities: 'Career Opportunities',
    
    // Header
    features: 'Features',
    howItWorks: 'How It Works',
    app: 'App',
    barberSpace: 'Barber Space',
    login: 'Login',
    signUp: 'Sign Up',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    
    // How It Works
    howItWorksTitle: 'How It Works',
    howItWorksSubtitle: 'Simple Steps',
    step1Title: 'Search & Discover',
    step1Desc: 'Find the perfect barbershop or hair salon near you. Browse profiles, read reviews, and compare services.',
    step2Title: 'Book Instantly',
    step2Desc: 'Choose your preferred time slot and service. Confirm your appointment in just a few taps.',
    step3Title: 'Enjoy Your Look',
    step3Desc: 'Visit your barbershop or hair salon, or get a mobile barber service at your location. Pay seamlessly and rate your experience.',
    startBookingNow: 'Start Booking Now',
    
    // Features
    ourFeatures: 'Our Features',
    everythingYouNeed: 'Everything You Need',
    barberSalonBooking: 'Barbershop & Hair Salon Booking',
    barberSalonBookingDesc: 'Book appointments instantly at your favorite barbershops and hair salons.',
    mobileBarberBooking: 'Mobile Barber Service',
    mobileBarberBookingDesc: 'Book a professional barber to come to your home or office for haircuts and beard grooming.',
    learnBarberingSec: 'Learn Barbering',
    learnBarberingDesc: 'Master the art of barbering with professional courses and tutorials.',
    shopSuppliesSec: 'Shop Supplies',
    shopSuppliesDesc: 'Premium barbering tools, clippers, scissors, and styling products.',
    careerOpportunitiesSec: 'Career Opportunities',
    careerOpportunitiesDesc: 'Find your dream job and connect with top barbershops and hair salons looking for talent.',
    barberCommunity: 'Barber Community',
    barberCommunityDesc: 'Join a thriving community of professional barbers and hair stylists worldwide.',
    
    // Barber Features
    forBarbers: 'For Barbers',
    growYourBusiness: 'Grow Your',
    business: 'Business',
    registerAsBarber: 'Register as Barber',
    alreadyRegistered: 'Already registered?',
    loginToDashboard: 'Login to dashboard',
    
    // App Showcase
    premiumExperience: 'Premium Experience',
    mobileApp: 'A Mobile App',
    youllLove: "You'll Love",
    appDescription: 'Experience seamless booking with our beautifully designed mobile app. Built for speed, crafted for simplicity, and designed to make your grooming routine effortless.',
    downloadOnThe: 'Download on the',
    appStore: 'App Store',
    getItOn: 'Get it on',
    googlePlay: 'Google Play',
    
    // Footer
    product: 'Product',
    company: 'Company',
    support: 'Support',
    barbers: 'For Barbers',
    aboutUs: 'About Us',
    careers: 'Careers',
    blog: 'Blog',
    pressKit: 'Press Kit',
    helpCenter: 'Help Center',
    contactUs: 'Contact Us',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    registerAsBarberFooter: 'Register as Barber',
    barberDashboard: 'Barber Dashboard',
    successStories: 'Success Stories',
    partnerProgram: 'Partner Program',
    pricing: 'Pricing',
    downloadApp: 'Download App',
    allRightsReserved: 'All rights reserved.',
    footerDescription: 'The smartest way to book barbershop and hair salon appointments. Join thousands of satisfied customers and professionals on our platform.',
    
    // How It Works Highlights
    verifiedProfiles: 'Verified profiles',
    realReviews: 'Real reviews',
    portfolioGallery: 'Portfolio gallery',
    realTimeAvailability: 'Real-time availability',
    turnBasedBooking: 'Turn-Based Booking',
    instantConfirmation: 'Instant confirmation',
    noWaiting: 'No waiting',
    premiumService: 'Premium service',
    rateReview: 'Rate & review',
    howItWorksDesc: 'Simple, fast, and hassle-free. Your perfect appointment or turn at a barbershop or hair salon is just a few taps away.',
    
    // Barber Features Section
    barberFeaturesDesc: "Join thousands of successful barbers who've transformed their business with BarberBook's powerful tools.",
    professionalProfile: 'Professional Profile',
    professionalProfileDesc: 'Showcase your skills, portfolio, services, and pricing to attract more clients.',
    smartScheduling: 'Smart Scheduling',
    smartSchedulingDesc: 'Manage appointments and turn-based bookings digitally. Reduce no-shows with automated reminders.',
    flexiblePayments: 'Flexible Payments',
    flexiblePaymentsDesc: 'Accept online payments or cash. Get instant payouts to your bank account.',
    businessAnalytics: 'Business Analytics',
    businessAnalyticsDesc: 'Track daily income, monitor metrics, and gain insights to grow your business.',
    clientManagement: 'Client Management',
    clientManagementDesc: 'Build lasting relationships with customers. Store preferences and booking history.',
    marketingTools: 'Marketing Tools',
    marketingToolsDesc: 'Get discovered by new customers. Run promotions and build your brand.',
    readyToTransform: 'Ready to Transform Your Business?',
    joinBarberBookToday: 'Join BarberBook today and start accepting online bookings within minutes. No technical skills required.',
    instantPayouts: 'Instant payouts',
    fullControl: 'Full control',
    securePlatform: 'Secure platform',
    premiumFeatures: 'Premium features',
    
    // App Showcase
    intuitiveInterface: 'Intuitive Interface',
    smartNotifications: 'Smart Notifications',
    saveFavorites: 'Save Favorites',
    rateAndReview: 'Rate & Review',
    bookingDetails: 'Booking Details',
    confirmedAppointment: 'Confirmed appointment',
    reviews: 'reviews',
    services: 'Services',
    classicHaircut: 'Classic Haircut',
    beardTrim: 'Beard Trim',
    total: 'Total',
    reschedule: 'Reschedule',
    navigate: 'Navigate',
    reminder: 'Reminder',
    appointmentIn30Min: 'Your appointment in 30 min',
    paymentSuccess: 'Payment Success',
    
    // Customer Features
    forCustomers: 'For Customers',
    perfectHaircut: 'Perfect Haircut',
    everythingForHaircut: 'Everything You Need for the',
    customerFeaturesDesc: 'From instant booking to doorstep service, we\'ve got every aspect of your grooming needs covered.',
    appointmentBooking: 'Appointment Booking',
    appointmentBookingDesc: 'Schedule your visit at a specific date and time. Book your preferred slot instantly with just a few taps.',
    turnBasedBookingFeature: 'Turn-Based Booking',
    turnBasedBookingFeatureDesc: 'Reserve your service spot based on booking order. Receive real-time updates on your position and arrive exactly when it\'s your turn.',
    mobileBarberFeature: 'Mobile Barber Service',
    mobileBarberFeatureDesc: 'Book a professional barber to come to your location. Premium haircut and beard grooming at your doorstep.',
    secureBookingGuarantee: 'Secure Booking Guarantee',
    secureBookingGuaranteeDesc: 'Your bookings are protected. Get full refunds for cancellations and no-shows.',
    realTimeAvailabilityFeature: 'Real-Time Availability',
    realTimeAvailabilityFeatureDesc: 'See live availability of all barbershops and hair salons near you. Never book a slot that\'s already taken.',
    
    // CTA Section
    availableNow: 'Available Now',
    downloadBarberBook: 'Download BarberBook',
    today: 'Today',
    ctaDescription: 'Join thousands of satisfied customers who have transformed their grooming experience. Download now and book your first barbershop or hair salon appointment in under 60 seconds.',
    downloadOnThe: 'Download on the',
    appStore: 'App Store',
    getItOn: 'Get it on',
    googlePlay: 'Google Play',
    activeUsers: 'Active Users',
    barbers: 'Barbers',
    bookingsMade: 'Bookings Made',
    appRating: 'App Rating',
    areYouBarber: 'Are you a barber?',
    registerBarbershopToday: 'Register your barbershop today',
  },
  
  fr: {
    // Hero
    heroTitle: 'Réservez Votre Rendez-vous ou Tour chez un Barbier ou Salon de Coiffure',
    heroHighlight: 'Rendez-vous',
    heroDescription: 'La façon la plus intelligente de réserver vos services barbier et salon de coiffure. Choisissez entre un rendez-vous fixe ou la réservation par ordre d\'arrivée. Connectez-vous avec des professionnels — profitez de votre look parfait, à votre façon.',
    // Rotating Hero Titles
    heroRotating1: 'Réservez votre rendez-vous ou votre tour chez un barbier ou salon de coiffure.',
    heroRotating2: 'Réservez un barbier ou coiffeur mobile qui vient chez vous.',
    heroRotating3: 'Explorez les opportunités d\'emploi dans le domaine de la coiffure.',
    searchPlaceholder: 'Rechercher barbier, salon de coiffure...',
    search: 'Rechercher',
    bookMobileBarber: 'Barbier à Domicile',
    learnBarbering: 'Formation Barbier',
    shopSupplies: 'Boutique',
    careerOpportunities: 'Emplois',
    
    // Header
    features: 'Fonctionnalités',
    howItWorks: 'Comment Ça Marche',
    app: 'Application',
    barberSpace: 'Espace Pro',
    login: 'Connexion',
    signUp: "S'inscrire",
    lightMode: 'Mode Clair',
    darkMode: 'Mode Sombre',
    
    // How It Works
    howItWorksTitle: 'Comment Ça Marche',
    howItWorksSubtitle: 'Étapes Simples',
    step1Title: 'Rechercher & Découvrir',
    step1Desc: 'Trouvez le barbier ou salon de coiffure parfait près de chez vous. Parcourez les profils, lisez les avis et comparez les services.',
    step2Title: 'Réserver Instantanément',
    step2Desc: 'Choisissez votre créneau horaire et service préférés. Confirmez votre rendez-vous en quelques clics.',
    step3Title: 'Profitez de Votre Look',
    step3Desc: 'Rendez-vous chez votre barbier ou salon de coiffure, ou faites venir un barbier à domicile. Payez facilement et évaluez votre expérience.',
    startBookingNow: 'Commencer à Réserver',
    
    // Features
    ourFeatures: 'Nos Fonctionnalités',
    everythingYouNeed: 'Tout Ce Dont Vous Avez Besoin',
    barberSalonBooking: 'Barbier & Salon de Coiffure',
    barberSalonBookingDesc: 'Réservez instantanément des rendez-vous dans vos barbiers et salons de coiffure préférés.',
    mobileBarberBooking: 'Barbier à Domicile',
    mobileBarberBookingDesc: 'Réservez un barbier professionnel à domicile ou au bureau pour coupe et barbe.',
    learnBarberingSec: 'Formation Barbier',
    learnBarberingDesc: 'Maîtrisez l\'art du métier de barbier avec des cours et tutoriels professionnels.',
    shopSuppliesSec: 'Acheter des Fournitures',
    shopSuppliesDesc: 'Outils de coiffure premium, tondeuses, ciseaux et produits de coiffage.',
    careerOpportunitiesSec: 'Opportunités de Carrière',
    careerOpportunitiesDesc: 'Trouvez l\'emploi de vos rêves et connectez-vous avec les meilleurs barbiers et salons de coiffure.',
    barberCommunity: 'Communauté de Barbiers',
    barberCommunityDesc: 'Rejoignez une communauté florissante de barbiers et coiffeurs professionnels du monde entier.',
    
    // Barber Features
    forBarbers: 'Pour les Barbiers',
    growYourBusiness: 'Développez Votre',
    business: 'Activité',
    registerAsBarber: 'S\'inscrire comme Barbier',
    alreadyRegistered: 'Déjà inscrit?',
    loginToDashboard: 'Connexion au tableau de bord',
    
    // App Showcase
    premiumExperience: 'Expérience Premium',
    mobileApp: 'Une Application Mobile',
    youllLove: 'Que Vous Adorerez',
    appDescription: 'Vivez une réservation fluide avec notre application mobile magnifiquement conçue. Construite pour la vitesse, conçue pour la simplicité, et pensée pour rendre votre routine de soins sans effort.',
    downloadOnThe: 'Télécharger sur',
    appStore: 'App Store',
    getItOn: 'Disponible sur',
    googlePlay: 'Google Play',
    
    // Footer
    product: 'Produit',
    company: 'Entreprise',
    support: 'Support',
    barbers: 'Pour les Barbiers',
    aboutUs: 'À Propos',
    careers: 'Carrières',
    blog: 'Blog',
    pressKit: 'Kit Presse',
    helpCenter: 'Centre d\'Aide',
    contactUs: 'Contactez-Nous',
    privacyPolicy: 'Politique de Confidentialité',
    termsOfService: 'Conditions d\'Utilisation',
    registerAsBarberFooter: 'S\'inscrire comme Barbier',
    barberDashboard: 'Tableau de Bord Barbier',
    successStories: 'Témoignages',
    partnerProgram: 'Programme Partenaire',
    pricing: 'Tarifs',
    downloadApp: 'Télécharger l\'App',
    allRightsReserved: 'Tous droits réservés.',
    footerDescription: 'La façon la plus intelligente de réserver des rendez-vous barbier et salon de coiffure. Rejoignez des milliers de clients et professionnels satisfaits sur notre plateforme.',
    
    // How It Works Highlights
    verifiedProfiles: 'Profils vérifiés',
    realReviews: 'Avis réels',
    portfolioGallery: 'Galerie portfolio',
    realTimeAvailability: 'Disponibilité en temps réel',
    turnBasedBooking: 'Réservation par Ordre',
    instantConfirmation: 'Confirmation instantanée',
    noWaiting: 'Sans attente',
    premiumService: 'Service premium',
    rateReview: 'Noter & évaluer',
    howItWorksDesc: 'Simple, rapide et sans tracas. Votre rendez-vous ou tour chez un barbier ou salon de coiffure est à quelques clics.',
    
    // Barber Features Section
    barberFeaturesDesc: 'Rejoignez des milliers de barbiers qui ont transformé leur activité avec les outils puissants de BarberBook.',
    professionalProfile: 'Profil Professionnel',
    professionalProfileDesc: 'Présentez vos compétences, portfolio, services et tarifs pour attirer plus de clients.',
    smartScheduling: 'Planification Intelligente',
    smartSchedulingDesc: 'Gérez les rendez-vous et réservations par ordre numériquement. Réduisez les absences avec des rappels automatiques.',
    flexiblePayments: 'Paiements Flexibles',
    flexiblePaymentsDesc: 'Acceptez les paiements en ligne ou en espèces. Recevez des virements instantanés.',
    businessAnalytics: 'Analyses Business',
    businessAnalyticsDesc: 'Suivez vos revenus quotidiens, surveillez les métriques et obtenez des insights pour développer votre activité.',
    clientManagement: 'Gestion des Clients',
    clientManagementDesc: 'Construisez des relations durables avec vos clients. Stockez préférences et historique.',
    marketingTools: 'Outils Marketing',
    marketingToolsDesc: 'Soyez découvert par de nouveaux clients. Lancez des promotions et développez votre marque.',
    readyToTransform: 'Prêt à Transformer Votre Entreprise?',
    joinBarberBookToday: 'Rejoignez BarberBook aujourd\'hui et commencez à accepter des réservations en ligne en quelques minutes. Aucune compétence technique requise.',
    instantPayouts: 'Virements instantanés',
    fullControl: 'Contrôle total',
    securePlatform: 'Plateforme sécurisée',
    premiumFeatures: 'Fonctionnalités premium',
    
    // App Showcase
    intuitiveInterface: 'Interface Intuitive',
    smartNotifications: 'Notifications Intelligentes',
    saveFavorites: 'Sauvegarder Favoris',
    rateAndReview: 'Noter & Évaluer',
    bookingDetails: 'Détails de Réservation',
    confirmedAppointment: 'Rendez-vous confirmé',
    reviews: 'avis',
    services: 'Services',
    classicHaircut: 'Coupe Classique',
    beardTrim: 'Taille de Barbe',
    total: 'Total',
    reschedule: 'Reprogrammer',
    navigate: 'Naviguer',
    reminder: 'Rappel',
    appointmentIn30Min: 'Votre rendez-vous dans 30 min',
    paymentSuccess: 'Paiement Réussi',
    
    // Customer Features
    forCustomers: 'Pour les Clients',
    perfectHaircut: 'Coupe Parfaite',
    everythingForHaircut: 'Tout ce Dont Vous Avez Besoin pour la',
    customerFeaturesDesc: 'De la réservation instantanée au service à domicile, nous couvrons tous les aspects de vos besoins de soins.',
    appointmentBooking: 'Réservation sur Rendez-vous',
    appointmentBookingDesc: 'Planifiez votre visite à une date et heure précises. Réservez votre créneau préféré en quelques clics.',
    turnBasedBookingFeature: 'Réservation par Ordre',
    turnBasedBookingFeatureDesc: 'Réservez votre place selon votre ordre d\'inscription. Recevez des mises à jour en temps réel et arrivez quand c\'est votre tour.',
    mobileBarberFeature: 'Barbier à Domicile',
    mobileBarberFeatureDesc: 'Réservez un barbier professionnel à domicile. Coupe et soins de barbe premium chez vous.',
    secureBookingGuarantee: 'Garantie de Réservation Sécurisée',
    secureBookingGuaranteeDesc: 'Vos réservations sont protégées. Remboursement complet pour les annulations et absences.',
    realTimeAvailabilityFeature: 'Disponibilité en Temps Réel',
    realTimeAvailabilityFeatureDesc: 'Consultez la disponibilité en direct de tous les barbiers et salons près de vous. Ne réservez jamais un créneau déjà pris.',
    
    // CTA Section
    availableNow: 'Disponible Maintenant',
    downloadBarberBook: 'Téléchargez BarberBook',
    today: 'Aujourd\'hui',
    ctaDescription: 'Rejoignez des milliers de clients satisfaits qui ont transformé leur expérience de soins. Téléchargez maintenant et réservez votre premier rendez-vous en moins de 60 secondes.',
    downloadOnThe: 'Télécharger sur',
    appStore: 'App Store',
    getItOn: 'Télécharger sur',
    googlePlay: 'Google Play',
    activeUsers: 'Utilisateurs Actifs',
    barbers: 'Barbiers',
    bookingsMade: 'Réservations',
    appRating: 'Note App',
    areYouBarber: 'Êtes-vous barbier ?',
    registerBarbershopToday: 'Inscrivez votre barbershop dès aujourd\'hui',
  },
  
  ar: {
    // Hero
    heroTitle: 'احجز موعدك أو دورك في صالون الحلاقة أو صالون تصفيف الشعر',
    heroHighlight: 'بسهولة',
    heroDescription: 'الطريقة الأذكى لحجز خدمات صالون الحلاقة وتصفيف الشعر. اختر بين حجز موعد محدد أو الحجز حسب ترتيب التسجيل. تواصل مع الحلاقين ومصففي الشعر المحترفين — استمتع بإطلالتك المثالية بطريقتك.',
    // Rotating Hero Titles
    heroRotating1: 'احجز موعدك أو دورك في صالون الحلاقة أو صالون تصفيف الشعر.',
    heroRotating2: 'احجز حلاقاً متنقلاً أو مصفف شعر يأتي إلى باب منزلك.',
    heroRotating3: 'اكتشف فرص العمل في مجال الحلاقة وتصفيف الشعر.',
    searchPlaceholder: 'ابحث عن صالون حلاقة، صالون شعر...',
    search: 'بحث',
    bookMobileBarber: 'حلاق متنقل',
    learnBarbering: 'تعلم الحلاقة',
    shopSupplies: 'المتجر',
    careerOpportunities: 'الوظائف',
    
    // Header
    features: 'المميزات',
    howItWorks: 'كيف يعمل',
    app: 'التطبيق',
    barberSpace: 'مساحة الحلاق',
    login: 'تسجيل الدخول',
    signUp: 'إنشاء حساب',
    lightMode: 'الوضع الفاتح',
    darkMode: 'الوضع الداكن',
    
    // How It Works
    howItWorksTitle: 'كيف يعمل',
    howItWorksSubtitle: 'خطوات بسيطة',
    step1Title: 'ابحث واكتشف',
    step1Desc: 'اعثر على صالون الحلاقة أو صالون تصفيف الشعر المثالي بالقرب منك. تصفح الملفات، اقرأ التقييمات، وقارن الخدمات.',
    step2Title: 'احجز فوراً',
    step2Desc: 'اختر الوقت والخدمة المفضلين. أكد موعدك ببضع نقرات.',
    step3Title: 'استمتع بإطلالتك',
    step3Desc: 'قم بزيارة صالون الحلاقة أو صالون الشعر، أو احصل على خدمة حلاق متنقل في موقعك. ادفع بسهولة وقيّم تجربتك.',
    startBookingNow: 'ابدأ الحجز الآن',
    
    // Features
    ourFeatures: 'مميزاتنا',
    everythingYouNeed: 'كل ما تحتاجه',
    barberSalonBooking: 'حجز صالون حلاقة وشعر',
    barberSalonBookingDesc: 'احجز مواعيد فورية في صالونات الحلاقة وتصفيف الشعر المفضلة لديك.',
    mobileBarberBooking: 'حلاق متنقل',
    mobileBarberBookingDesc: 'احجز حلاق محترف للقدوم إلى منزلك أو مكتبك لقص الشعر وتهذيب اللحية.',
    learnBarberingSec: 'تعلم الحلاقة',
    learnBarberingDesc: 'أتقن فن الحلاقة مع دورات ودروس احترافية.',
    shopSuppliesSec: 'تسوق المستلزمات',
    shopSuppliesDesc: 'أدوات حلاقة متميزة، مقصات، ومنتجات تصفيف.',
    careerOpportunitiesSec: 'فرص العمل',
    careerOpportunitiesDesc: 'اعثر على وظيفة أحلامك وتواصل مع أفضل صالونات الحلاقة وتصفيف الشعر.',
    barberCommunity: 'مجتمع الحلاقين',
    barberCommunityDesc: 'انضم إلى مجتمع مزدهر من الحلاقين ومصففي الشعر المحترفين حول العالم.',
    
    // Barber Features
    forBarbers: 'للحلاقين',
    growYourBusiness: 'طوّر',
    business: 'عملك',
    registerAsBarber: 'سجل كحلاق',
    alreadyRegistered: 'مسجل بالفعل؟',
    loginToDashboard: 'تسجيل الدخول للوحة التحكم',
    
    // App Showcase
    premiumExperience: 'تجربة متميزة',
    mobileApp: 'تطبيق جوال',
    youllLove: 'ستحبه',
    appDescription: 'استمتع بحجز سلس مع تطبيقنا المصمم بشكل جميل. مبني للسرعة، مصمم للبساطة، لجعل روتين العناية بك سهلاً.',
    downloadOnThe: 'حمّل من',
    appStore: 'آب ستور',
    getItOn: 'احصل عليه من',
    googlePlay: 'جوجل بلاي',
    
    // Footer
    product: 'المنتج',
    company: 'الشركة',
    support: 'الدعم',
    barbers: 'للحلاقين',
    aboutUs: 'من نحن',
    careers: 'الوظائف',
    blog: 'المدونة',
    pressKit: 'الملف الصحفي',
    helpCenter: 'مركز المساعدة',
    contactUs: 'اتصل بنا',
    privacyPolicy: 'سياسة الخصوصية',
    termsOfService: 'شروط الخدمة',
    registerAsBarberFooter: 'سجل كحلاق',
    barberDashboard: 'لوحة تحكم الحلاق',
    successStories: 'قصص النجاح',
    partnerProgram: 'برنامج الشراكة',
    pricing: 'الأسعار',
    downloadApp: 'تحميل التطبيق',
    allRightsReserved: 'جميع الحقوق محفوظة.',
    footerDescription: 'الطريقة الأذكى لحجز مواعيد صالون الحلاقة وتصفيف الشعر. انضم إلى الآلاف من العملاء والمحترفين الراضين على منصتنا.',
    
    // How It Works Highlights
    verifiedProfiles: 'ملفات موثقة',
    realReviews: 'تقييمات حقيقية',
    portfolioGallery: 'معرض الأعمال',
    realTimeAvailability: 'التوفر الفوري',
    turnBasedBooking: 'قوائم الانتظار',
    instantConfirmation: 'تأكيد فوري',
    noWaiting: 'بدون انتظار',
    premiumService: 'خدمة متميزة',
    rateReview: 'قيّم وراجع',
    howItWorksDesc: 'بسيط، سريع، وبدون متاعب. موعدك أو دورك في صالون الحلاقة أو صالون تصفيف الشعر على بعد نقرات قليلة.',
    
    // Barber Features Section
    barberFeaturesDesc: 'انضم إلى آلاف الحلاقين الناجحين الذين حولوا أعمالهم مع أدوات باربر بوك القوية.',
    professionalProfile: 'الملف المهني',
    professionalProfileDesc: 'اعرض مهاراتك وأعمالك وخدماتك وأسعارك لجذب المزيد من العملاء.',
    smartScheduling: 'الجدولة الذكية',
    smartSchedulingDesc: 'إدارة المواعيد وقوائم الانتظار رقمياً. قلل من الغياب مع التذكيرات التلقائية.',
    flexiblePayments: 'دفع مرن',
    flexiblePaymentsDesc: 'اقبل الدفع الإلكتروني أو النقدي. احصل على تحويلات فورية.',
    businessAnalytics: 'تحليلات الأعمال',
    businessAnalyticsDesc: 'تتبع دخلك اليومي، راقب المقاييس، واحصل على رؤى لتنمية عملك.',
    clientManagement: 'إدارة العملاء',
    clientManagementDesc: 'ابنِ علاقات دائمة مع عملائك. احفظ التفضيلات والسجل.',
    marketingTools: 'أدوات التسويق',
    marketingToolsDesc: 'اجعل العملاء الجدد يكتشفونك. أطلق العروض وابنِ علامتك التجارية.',
    readyToTransform: 'مستعد لتحويل عملك؟',
    joinBarberBookToday: 'انضم إلى باربر بوك اليوم وابدأ في قبول الحجوزات في دقائق. لا تحتاج مهارات تقنية.',
    instantPayouts: 'تحويلات فورية',
    fullControl: 'تحكم كامل',
    securePlatform: 'منصة آمنة',
    premiumFeatures: 'مميزات متميزة',
    
    // App Showcase
    intuitiveInterface: 'واجهة سهلة',
    smartNotifications: 'إشعارات ذكية',
    saveFavorites: 'حفظ المفضلة',
    rateAndReview: 'قيّم وراجع',
    bookingDetails: 'تفاصيل الحجز',
    confirmedAppointment: 'موعد مؤكد',
    reviews: 'تقييم',
    services: 'الخدمات',
    classicHaircut: 'قصة كلاسيكية',
    beardTrim: 'تهذيب اللحية',
    total: 'المجموع',
    reschedule: 'إعادة جدولة',
    navigate: 'التنقل',
    reminder: 'تذكير',
    appointmentIn30Min: 'موعدك بعد 30 دقيقة',
    paymentSuccess: 'تم الدفع بنجاح',
    
    // Customer Features
    forCustomers: 'للعملاء',
    perfectHaircut: 'القصة المثالية',
    everythingForHaircut: 'كل ما تحتاجه لـ',
    customerFeaturesDesc: 'من الحجز الفوري إلى الخدمة المنزلية، غطينا كل جوانب احتياجاتك.',
    appointmentBooking: 'حجز موعد',
    appointmentBookingDesc: 'حدد موعدك في تاريخ ووقت محددين. احجز الوقت المناسب لك بنقرات قليلة.',
    turnBasedBookingFeature: 'الحجز عبر قوائم الانتظار',
    turnBasedBookingFeatureDesc: 'احجز مكانك في قائمة الانتظار بناءً على ترتيب التسجيل. احصل على تحديثات فورية عن موقعك واحضر عندما يحين دورك.',
    mobileBarberFeature: 'خدمة حلاق متنقل',
    mobileBarberFeatureDesc: 'احجز حلاق محترف للقدوم إليك. قص شعر وتهذيب لحية فاخر على بابك.',
    secureBookingGuarantee: 'ضمان الحجز الآمن',
    secureBookingGuaranteeDesc: 'حجوزاتك محمية. استرداد كامل للإلغاءات وعدم الحضور.',
    realTimeAvailabilityFeature: 'التوفر الفوري',
    realTimeAvailabilityFeatureDesc: 'شاهد التوفر المباشر لجميع صالونات الحلاقة والشعر بالقرب منك. لن تحجز موعداً محجوز مسبقاً.',
    
    // CTA Section
    availableNow: 'متوفر الآن',
    downloadBarberBook: 'حمّل باربر بوك',
    today: 'اليوم',
    ctaDescription: 'انضم إلى آلاف العملاء الراضين الذين حولوا تجربة العناية بالمظهر. حمّل الآن واحجز أول موعد لك في صالون حلاقة أو شعر في أقل من 60 ثانية.',
    downloadOnThe: 'حمّل من',
    appStore: 'آب ستور',
    getItOn: 'احصل عليه من',
    googlePlay: 'جوجل بلاي',
    activeUsers: 'مستخدم نشط',
    barbers: 'حلاق',
    bookingsMade: 'حجز مكتمل',
    appRating: 'تقييم التطبيق',
    areYouBarber: 'هل أنت حلاق؟',
    registerBarbershopToday: 'سجّل صالونك اليوم',
  }
};

const LanguageContext = createContext();

const locales = ['en', 'fr', 'ar'];

export function LanguageProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Get locale from URL
  const getLocaleFromPath = useCallback(() => {
    const segments = pathname.split('/');
    const urlLocale = segments[1];
    return locales.includes(urlLocale) ? urlLocale : 'en';
  }, [pathname]);
  
  const [locale, setLocale] = useState(() => {
    if (typeof window !== 'undefined') {
      const segments = window.location.pathname.split('/');
      const urlLocale = segments[1];
      return locales.includes(urlLocale) ? urlLocale : 'en';
    }
    return 'en';
  });
  
  // Sync locale with URL pathname
  useEffect(() => {
    const segments = pathname.split('/');
    const urlLocale = segments[1];
    if (locales.includes(urlLocale) && urlLocale !== locale) {
      setLocale(urlLocale);
      // Set document direction
      if (typeof document !== 'undefined') {
        if (urlLocale === 'ar') {
          document.documentElement.dir = 'rtl';
          document.documentElement.lang = 'ar';
        } else {
          document.documentElement.dir = 'ltr';
          document.documentElement.lang = urlLocale;
        }
      }
    }
  }, [pathname]);
  
  const t = (key) => {
    return translations[locale]?.[key] || translations['en']?.[key] || key;
  };
  
  const changeLanguage = useCallback((langCode) => {
    if (!locales.includes(langCode)) return;
    
    setLocale(langCode);
    
    // Set document direction for Arabic
    if (typeof document !== 'undefined') {
      if (langCode === 'ar') {
        document.documentElement.dir = 'rtl';
        document.documentElement.lang = 'ar';
      } else {
        document.documentElement.dir = 'ltr';
        document.documentElement.lang = langCode;
      }
    }
    
    // Navigate to new locale URL
    const segments = pathname.split('/');
    if (locales.includes(segments[1])) {
      segments[1] = langCode;
    } else {
      segments.splice(1, 0, langCode);
    }
    const newPath = segments.join('/') || `/${langCode}`;
    router.push(newPath);
  }, [pathname, router]);
  
  return (
    <LanguageContext.Provider value={{ locale, t, changeLanguage, locales }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
