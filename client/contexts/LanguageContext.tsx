import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "ar" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

// ترجمات النظام
const translations = {
  ar: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.defensive_ops": "العمليات الدفاعية",
    "nav.offensive_tools": "أدوات الهجوم الأخلاقي",
    "nav.surveillance": "المراقبة",
    "nav.network_control": "إدارة الشبكات",
    "nav.ai_assistant": "المساعد الذكي",
    "nav.reporting": "التقارير",
    "nav.cosmic_settings": "الإعدادات",
    "nav.language_settings": "إعدادات اللغة",

    // General
    "general.loading": "جاري التحميل...",
    "general.error": "خطأ",
    "general.retry": "إعادة المحاولة",
    "general.save": "حفظ",
    "general.cancel": "إلغاء",
    "general.close": "إغلاق",
    "general.back": "رجوع",
    "general.next": "التالي",
    "general.previous": "السابق",
    "general.settings": "الإعدادات",
    "general.status": "الحالة",
    "general.active": "نشط",
    "general.inactive": "غير نشط",
    "general.enabled": "مفعل",
    "general.disabled": "معطل",
    "general.running": "يعمل",
    "general.stopped": "متوقف",
    "general.success": "نجح",
    "general.failed": "فشل",
    "general.warning": "تحذير",
    "general.info": "معلومات",

    // Language Settings
    "language.title": "إعدادات اللغة",
    "language.subtitle": "اختر لغة واجهة KNOX Sentinel",
    "language.arabic": "العربية",
    "language.english": "English",
    "language.current": "اللغة الحالية",
    "language.change": "تغيير اللغة",
    "language.apply": "تطبيق",
    "language.direction": "اتجاه النص",
    "language.rtl": "من اليمين إلى اليسار",
    "language.ltr": "من اليسار إلى اليمين",

    // Tools
    "tools.execute": "تشغيل",
    "tools.stop": "إيقاف",
    "tools.status": "حالة الأداة",
    "tools.result": "النتيجة",
    "tools.duration": "المدة",
    "tools.details": "التفاصيل",
    "tools.config": "الإعدادات",
    "tools.logs": "السجلات",
    "tools.output": "الناتج",
    "tools.real_time": "مباشر",
    "tools.batch": "دفعي",

    // Dashboard
    "dashboard.title": "لوحة تحكم KNOX Sentinel",
    "dashboard.subtitle": "نظام الحماية السيبرانية المتقدم",
    "dashboard.active_systems": "الأنظمة النشطة",
    "dashboard.total_warnings": "إجمالي التحذيرات",
    "dashboard.system_integration": "تكامل النظام",
    "dashboard.live_mode": "الوضع المباشر",
    "dashboard.paused": "متوقف مؤقت",
    "dashboard.modules": "الوحدات",
    "dashboard.total_tools": "إجمالي الأدوات",
    "dashboard.running_tools": "الأدوات العاملة",

    // Modules
    "modules.defensive_ops": "العمليات الدفاعية",
    "modules.defensive_ops_desc": "أدوات الحماية والدفاع السيبراني المتقدمة",
    "modules.offensive_tools": "أدوات الهجوم الأخلاقي",
    "modules.offensive_tools_desc": "أدوات اختبار الاختراق والهجوم الأخلاقي",
    "modules.surveillance": "المراقبة",
    "modules.surveillance_desc": "أدوات المراقبة والتتبع المتقدمة",
    "modules.network_control": "إدارة الشبكات",
    "modules.network_control_desc": "إدارة الشبكات و VPN والاتصالات",
    "modules.ai_assistant": "المساعد الذكي",
    "modules.ai_assistant_desc": "مساعد ذكي للأمن السيبراني بالذكاء الاصطناعي",
    "modules.reporting": "التقارير المشفرة",
    "modules.reporting_desc": "توليد وإدارة التقارير الأمنية المشفرة",
    "modules.cosmic_settings": "الإعدادات الكونية",
    "modules.cosmic_settings_desc": "إعدادات النظام والتحكم الشامل",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.defensive_ops": "Defensive Ops",
    "nav.offensive_tools": "Offensive Tools",
    "nav.surveillance": "Surveillance",
    "nav.network_control": "Network Control",
    "nav.ai_assistant": "AI Assistant",
    "nav.reporting": "Reporting",
    "nav.cosmic_settings": "Cosmic Settings",
    "nav.language_settings": "Language Settings",

    // General
    "general.loading": "Loading...",
    "general.error": "Error",
    "general.retry": "Retry",
    "general.save": "Save",
    "general.cancel": "Cancel",
    "general.close": "Close",
    "general.back": "Back",
    "general.next": "Next",
    "general.previous": "Previous",
    "general.settings": "Settings",
    "general.status": "Status",
    "general.active": "Active",
    "general.inactive": "Inactive",
    "general.enabled": "Enabled",
    "general.disabled": "Disabled",
    "general.running": "Running",
    "general.stopped": "Stopped",
    "general.success": "Success",
    "general.failed": "Failed",
    "general.warning": "Warning",
    "general.info": "Info",

    // Language Settings
    "language.title": "Language Settings",
    "language.subtitle": "Choose your KNOX Sentinel interface language",
    "language.arabic": "العربية",
    "language.english": "English",
    "language.current": "Current Language",
    "language.change": "Change Language",
    "language.apply": "Apply",
    "language.direction": "Text Direction",
    "language.rtl": "Right to Left",
    "language.ltr": "Left to Right",

    // Tools
    "tools.execute": "Execute",
    "tools.stop": "Stop",
    "tools.status": "Tool Status",
    "tools.result": "Result",
    "tools.duration": "Duration",
    "tools.details": "Details",
    "tools.config": "Configuration",
    "tools.logs": "Logs",
    "tools.output": "Output",
    "tools.real_time": "Real-time",
    "tools.batch": "Batch",

    // Dashboard
    "dashboard.title": "KNOX Sentinel Dashboard",
    "dashboard.subtitle": "Advanced Cybersecurity Protection System",
    "dashboard.active_systems": "Active Systems",
    "dashboard.total_warnings": "Total Warnings",
    "dashboard.system_integration": "System Integration",
    "dashboard.live_mode": "Live Mode",
    "dashboard.paused": "Paused",
    "dashboard.modules": "Modules",
    "dashboard.total_tools": "Total Tools",
    "dashboard.running_tools": "Running Tools",

    // Modules
    "modules.defensive_ops": "Defensive Operations",
    "modules.defensive_ops_desc":
      "Advanced cybersecurity protection and defense tools",
    "modules.offensive_tools": "Offensive Tools",
    "modules.offensive_tools_desc":
      "Ethical penetration testing and offensive security tools",
    "modules.surveillance": "Surveillance",
    "modules.surveillance_desc": "Advanced monitoring and surveillance tools",
    "modules.network_control": "Network Control",
    "modules.network_control_desc": "Network and VPN connection management",
    "modules.ai_assistant": "AI Assistant",
    "modules.ai_assistant_desc":
      "AI-powered cybersecurity intelligent assistant",
    "modules.reporting": "Encrypted Reporting",
    "modules.reporting_desc":
      "Encrypted security report generation and management",
    "modules.cosmic_settings": "Cosmic Settings",
    "modules.cosmic_settings_desc": "Comprehensive system settings and control",
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // استرجاع اللغة المحفوظة أو تعيين العربية كافتراضي
    const saved = localStorage.getItem("knox-language");
    return (saved as Language) || "ar";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("knox-language", lang);

    // تطبيق اتجاه النص على الـ HTML
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const isRTL = language === "ar";

  // تطبيق اتجاه النص عند التحميل
  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language, isRTL]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
