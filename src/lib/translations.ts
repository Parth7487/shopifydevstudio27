export type Language =
  | "en"
  | "es"
  | "fr"
  | "de"
  | "it"
  | "pt"
  | "ja"
  | "zh"
  | "ko"
  | "ar"
  | "ru"
  | "in";

export const SUPPORTED_LANGUAGES: Record<Language, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  pt: "Português",
  ja: "日本語",
  zh: "中文",
  ko: "한국어",
  ar: "العربية",
  ru: "Русский",
  in: "Bahasa Indonesia",
};

export const COUNTRY_TO_LANGUAGE: Record<string, Language> = {
  US: "en",
  GB: "en",
  CA: "en",
  AU: "en",
  IN: "in",
  ES: "es",
  MX: "es",
  AR: "es",
  CO: "es",
  FR: "fr",
  DE: "de",
  AT: "de",
  CH: "de",
  IT: "it",
  PT: "pt",
  BR: "pt",
  JP: "ja",
  CN: "zh",
  TW: "zh",
  KR: "ko",
  SA: "ar",
  AE: "ar",
  RU: "ru",
  ID: "in",
};

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.services": "Services",
    "nav.process": "Process",
    "nav.about": "About",
    "nav.work": "Work",
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    "nav.documentation": "Documentation",
    "nav.support": "Support",
    "nav.faq": "FAQ",

    // Footer
    "footer.resources": "Resources",
    "footer.getInTouch": "Get in Touch",
    "footer.quickConnect": "Quick Connect",
    "footer.whatsapp": "WhatsApp",
    "footer.telegram": "Telegram",
    "footer.discord": "Discord",
    "footer.remote": "Remote, Worldwide",
    "footer.responseTime": "24h Response Time",
    "footer.available": "Available 7 days/week",
    "footer.copyright": "© {{year}} Shopify Dev Studio. All rights reserved.",
    "footer.description":
      "Premium Shopify theme development agency creating exceptional e-commerce experiences that drive results and exceed expectations.",
    "footer.urgentProject": "Urgent Project?",
    "footer.emergencySpaces":
      "2 emergency spaces available for quick turnaround projects",

    // Common
    "common.language": "Language",
    "common.selectLanguage": "Select Language",
    "common.loading": "Loading...",
  },
  es: {
    "nav.services": "Servicios",
    "nav.process": "Proceso",
    "nav.about": "Acerca de",
    "nav.work": "Trabajos",
    "nav.blog": "Blog",
    "nav.contact": "Contacto",
    "nav.documentation": "Documentación",
    "nav.support": "Soporte",
    "nav.faq": "Preguntas Frecuentes",

    "footer.resources": "Recursos",
    "footer.getInTouch": "Ponte en Contacto",
    "footer.quickConnect": "Conexión Rápida",
    "footer.whatsapp": "WhatsApp",
    "footer.telegram": "Telegram",
    "footer.discord": "Discord",
    "footer.remote": "Remoto, Worldwide",
    "footer.responseTime": "Respuesta en 24h",
    "footer.available": "Disponible 7 días a la semana",
    "footer.copyright":
      "© {{year}} Shopify Dev Studio. Todos los derechos reservados.",
    "footer.description":
      "Agencia premium de desarrollo de temas Shopify que crea experiencias de e-commerce excepcionales que generan resultados e superan expectativas.",
    "footer.urgentProject": "¿Proyecto Urgente?",
    "footer.emergencySpaces":
      "2 espacios de emergencia disponibles para proyectos de entrega rápida",

    "common.language": "Idioma",
    "common.selectLanguage": "Seleccionar Idioma",
    "common.loading": "Cargando...",
  },
  fr: {
    "nav.services": "Services",
    "nav.process": "Processus",
    "nav.about": "À propos",
    "nav.work": "Travaux",
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    "nav.documentation": "Documentation",
    "nav.support": "Support",
    "nav.faq": "FAQ",

    "footer.resources": "Ressources",
    "footer.getInTouch": "Nous Contacter",
    "footer.quickConnect": "Connexion Rapide",
    "footer.whatsapp": "WhatsApp",
    "footer.telegram": "Telegram",
    "footer.discord": "Discord",
    "footer.remote": "À distance, Partout",
    "footer.responseTime": "Réponse en 24h",
    "footer.available": "Disponible 7 jours par semaine",
    "footer.copyright": "© {{year}} Shopify Dev Studio. Tous droits réservés.",
    "footer.description":
      "Agence premium de développement de thèmes Shopify créant des expériences e-commerce exceptionnelles qui génèrent des résultats et dépassent les attentes.",
    "footer.urgentProject": "Projet Urgent?",
    "footer.emergencySpaces":
      "2 espaces d'urgence disponibles pour les projets à court terme",

    "common.language": "Langue",
    "common.selectLanguage": "Sélectionner la Langue",
    "common.loading": "Chargement...",
  },
  de: {
    "nav.services": "Dienstleistungen",
    "nav.process": "Prozess",
    "nav.about": "Über uns",
    "nav.work": "Arbeiten",
    "nav.blog": "Blog",
    "nav.contact": "Kontakt",
    "nav.documentation": "Dokumentation",
    "nav.support": "Unterstützung",
    "nav.faq": "FAQ",

    "footer.resources": "Ressourcen",
    "footer.getInTouch": "Kontakt aufnehmen",
    "footer.quickConnect": "Schnelle Verbindung",
    "footer.whatsapp": "WhatsApp",
    "footer.telegram": "Telegram",
    "footer.discord": "Discord",
    "footer.remote": "Remote, Weltweit",
    "footer.responseTime": "Antwort in 24h",
    "footer.available": "7 Tage die Woche verfügbar",
    "footer.copyright":
      "© {{year}} Shopify Dev Studio. Alle Rechte vorbehalten.",
    "footer.description":
      "Premium-Shopify-Theme-Entwicklungsagentur, die außergewöhnliche E-Commerce-Erfahrungen schafft, die Ergebnisse liefern und Erwartungen übertreffen.",
    "footer.urgentProject": "Dringendes Projekt?",
    "footer.emergencySpaces": "2 Notfallplätze für schnelle Projekte verfügbar",

    "common.language": "Sprache",
    "common.selectLanguage": "Sprache wählen",
    "common.loading": "Wird geladen...",
  },
  it: {
    "nav.services": "Servizi",
    "nav.process": "Processo",
    "nav.about": "Chi siamo",
    "nav.work": "Lavori",
    "nav.blog": "Blog",
    "nav.contact": "Contatti",
    "nav.documentation": "Documentazione",
    "nav.support": "Supporto",
    "nav.faq": "Domande Frequenti",

    "footer.resources": "Risorse",
    "footer.getInTouch": "Contattaci",
    "footer.quickConnect": "Connessione Rapida",
    "footer.whatsapp": "WhatsApp",
    "footer.telegram": "Telegram",
    "footer.discord": "Discord",
    "footer.remote": "Remoto, Mondiale",
    "footer.responseTime": "Risposta in 24h",
    "footer.available": "Disponibile 7 giorni a settimana",
    "footer.copyright":
      "© {{year}} Shopify Dev Studio. Tutti i diritti riservati.",
    "footer.description":
      "Agenzia premium di sviluppo temi Shopify che crea esperienze di e-commerce straordinarie che generano risultati e superano le aspettative.",
    "footer.urgentProject": "Progetto Urgente?",
    "footer.emergencySpaces":
      "2 spazi d'emergenza disponibili per progetti veloci",

    "common.language": "Lingua",
    "common.selectLanguage": "Seleziona Lingua",
    "common.loading": "Caricamento...",
  },
  pt: {
    "nav.services": "Serviços",
    "nav.process": "Processo",
    "nav.about": "Sobre",
    "nav.work": "Trabalhos",
    "nav.blog": "Blog",
    "nav.contact": "Contato",
    "nav.documentation": "Documentação",
    "nav.support": "Suporte",
    "nav.faq": "Perguntas Frequentes",

    "footer.resources": "Recursos",
    "footer.getInTouch": "Entre em Contato",
    "footer.quickConnect": "Conexão Rápida",
    "footer.whatsapp": "WhatsApp",
    "footer.telegram": "Telegram",
    "footer.discord": "Discord",
    "footer.remote": "Remoto, Worldwide",
    "footer.responseTime": "Resposta em 24h",
    "footer.available": "Disponível 7 dias por semana",
    "footer.copyright":
      "© {{year}} Shopify Dev Studio. Todos os direitos reservados.",
    "footer.description":
      "Agência premium de desenvolvimento de temas Shopify que cria experiências de e-commerce excepcionais que geram resultados e excedem expectativas.",
    "footer.urgentProject": "Projeto Urgente?",
    "footer.emergencySpaces":
      "2 espaços de emergência disponíveis para projetos de entrega rápida",

    "common.language": "Idioma",
    "common.selectLanguage": "Selecionar Idioma",
    "common.loading": "Carregando...",
  },
  ja: {
    "nav.services": "サービス",
    "nav.process": "プロセス",
    "nav.about": "について",
    "nav.work": "作品",
    "nav.blog": "ブログ",
    "nav.contact": "お問い合わせ",
    "nav.documentation": "ドキュメント",
    "nav.support": "サポート",
    "nav.faq": "よくある質問",

    "footer.resources": "リソース",
    "footer.getInTouch": "お問い合わせ",
    "footer.quickConnect": "クイック接続",
    "footer.whatsapp": "WhatsApp",
    "footer.telegram": "Telegram",
    "footer.discord": "Discord",
    "footer.remote": "リモート、世界中",
    "footer.responseTime": "24時間以内にお返事",
    "footer.available": "週7日利用可能",
    "footer.copyright":
      "© {{year}} Shopify Dev Studio. すべての権利を保有しています。",
    "footer.description":
      "優れたeコマース体験を生み出すプレミアムShopifyテーマ開発エージェンシー。",
    "footer.urgentProject": "緊急プロジェクト?",
    "footer.emergencySpaces":
      "迅速なプロジェクト用に2つの緊急スペースが利用可能",

    "common.language": "言語",
    "common.selectLanguage": "言語を選択",
    "common.loading": "読み込み中...",
  },
  zh: {
    "nav.services": "服务",
    "nav.process": "流程",
    "nav.about": "关于",
    "nav.work": "作品",
    "nav.blog": "博客",
    "nav.contact": "联系",
    "nav.documentation": "文档",
    "nav.support": "支持",
    "nav.faq": "常见问题",

    "footer.resources": "资源",
    "footer.getInTouch": "联系我们",
    "footer.quickConnect": "快速连接",
    "footer.whatsapp": "WhatsApp",
    "footer.telegram": "Telegram",
    "footer.discord": "Discord",
    "footer.remote": "远程，全球",
    "footer.responseTime": "24小时内回复",
    "footer.available": "每周7天可用",
    "footer.copyright": "© {{year}} Shopify Dev Studio. 版权所有。",
    "footer.description": "创建非凡电子商务体验的高级Shopify主题开发机构。",
    "footer.urgentProject": "紧急项目?",
    "footer.emergencySpaces": "可用2个紧急时段用于快速交付项目",

    "common.language": "语言",
    "common.selectLanguage": "选择语言",
    "common.loading": "加载中...",
  },
  ko: {
    "nav.services": "서비스",
    "nav.process": "프로세스",
    "nav.about": "소개",
    "nav.work": "작품",
    "nav.blog": "블로그",
    "nav.contact": "연락처",
    "nav.documentation": "문서",
    "nav.support": "지원",
    "nav.faq": "자주 묻는 질문",

    "footer.resources": "리소스",
    "footer.getInTouch": "연락 주세요",
    "footer.quickConnect": "빠른 연결",
    "footer.whatsapp": "WhatsApp",
    "footer.telegram": "Telegram",
    "footer.discord": "Discord",
    "footer.remote": "원격, 전 세계",
    "footer.responseTime": "24시간 이내 응답",
    "footer.available": "주 7일 이용 가능",
    "footer.copyright": "© {{year}} Shopify Dev Studio. 모든 권리 예약됨.",
    "footer.description":
      "뛰어난 전자상거래 경험을 창출하는 프리미엄 Shopify 테마 개발 에이전시.",
    "footer.urgentProject": "긴급 프로젝트?",
    "footer.emergencySpaces":
      "신속한 프로젝트를 위해 2개의 긴급 시간대 이용 가능",

    "common.language": "언어",
    "common.selectLanguage": "언어 선택",
    "common.loading": "로딩 중...",
  },
  ar: {
    "nav.services": "الخدمات",
    "nav.process": "العملية",
    "nav.about": "حول",
    "nav.work": "الأعمال",
    "nav.blog": "المدونة",
    "nav.contact": "تواصل",
    "nav.documentation": "التوثيق",
    "nav.support": "الدعم",
    "nav.faq": "الأسئلة الشائعة",

    "footer.resources": "الموارد",
    "footer.getInTouch": "تواصل معنا",
    "footer.quickConnect": "اتصال سريع",
    "footer.whatsapp": "واتساب",
    "footer.telegram": "تليجرام",
    "footer.discord": "ديسكورد",
    "footer.remote": "عن بُعد، عالميًا",
    "footer.responseTime": "الرد في 24 ساعة",
    "footer.available": "متاح 7 أيام في الأسبوع",
    "footer.copyright": "© {{year}} Shopify Dev Studio. جميع الحقوق محفوظة.",
    "footer.description":
      "وكالة تطوير مواضيع Shopify المتقدمة التي تخلق تجارب إلكترونية استثنائية.",
    "footer.urgentProject": "مشروع عاجل؟",
    "footer.emergencySpaces": "مساحتان طوارئ متاحتان للمشاريع السريعة",

    "common.language": "اللغة",
    "common.selectLanguage": "اختر اللغة",
    "common.loading": "جاري التحميل...",
  },
  ru: {
    "nav.services": "Услуги",
    "nav.process": "Процесс",
    "nav.about": "О нас",
    "nav.work": "Работы",
    "nav.blog": "Блог",
    "nav.contact": "Контакты",
    "nav.documentation": "Документация",
    "nav.support": "Поддержка",
    "nav.faq": "Часто задаваемые вопросы",

    "footer.resources": "Ресурсы",
    "footer.getInTouch": "Свяжитесь с нами",
    "footer.quickConnect": "Быстрое подключение",
    "footer.whatsapp": "WhatsApp",
    "footer.telegram": "Telegram",
    "footer.discord": "Discord",
    "footer.remote": "Удаленно, по всему миру",
    "footer.responseTime": "Ответ в течение 24 часов",
    "footer.available": "Доступно 7 дней в неделю",
    "footer.copyright": "© {{year}} Shopify Dev Studio. Все права защищены.",
    "footer.description":
      "Премиум-агентство по разработке тем Shopify, создающее исключительные электронные впечатления.",
    "footer.urgentProject": "Срочный проект?",
    "footer.emergencySpaces":
      "2 экстренных слота доступны для быстрых проектов",

    "common.language": "Язык",
    "common.selectLanguage": "Выберите язык",
    "common.loading": "Загрузка...",
  },
  in: {
    "nav.services": "Layanan",
    "nav.process": "Proses",
    "nav.about": "Tentang",
    "nav.work": "Pekerjaan",
    "nav.blog": "Blog",
    "nav.contact": "Kontak",
    "nav.documentation": "Dokumentasi",
    "nav.support": "Dukungan",
    "nav.faq": "Pertanyaan yang Sering Diajukan",

    "footer.resources": "Sumber Daya",
    "footer.getInTouch": "Hubungi Kami",
    "footer.quickConnect": "Koneksi Cepat",
    "footer.whatsapp": "WhatsApp",
    "footer.telegram": "Telegram",
    "footer.discord": "Discord",
    "footer.remote": "Remote, Seluruh Dunia",
    "footer.responseTime": "Respons dalam 24 jam",
    "footer.available": "Tersedia 7 hari seminggu",
    "footer.copyright": "© {{year}} Shopify Dev Studio. Semua hak dilindungi.",
    "footer.description":
      "Agen pengembangan tema Shopify premium yang menciptakan pengalaman e-commerce yang luar biasa.",
    "footer.urgentProject": "Proyek Mendesak?",
    "footer.emergencySpaces": "2 slot darurat tersedia untuk proyek cepat",

    "common.language": "Bahasa",
    "common.selectLanguage": "Pilih Bahasa",
    "common.loading": "Memuat...",
  },
};

export const getTranslation = (
  language: Language,
  key: string,
  replacements?: Record<string, string | number>,
): string => {
  let translation = translations[language]?.[key] ?? key;

  if (replacements) {
    Object.entries(replacements).forEach(([k, v]) => {
      translation = translation.replace(`{{${k}}}`, String(v));
    });
  }

  return translation;
};
