import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Globe,
  Check,
  ArrowLeft,
  Languages,
  RotateCcw,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function LanguageSettings() {
  const { language, setLanguage, t, isRTL } = useLanguage();
  const [selectedLang, setSelectedLang] = useState<Language>(language);
  const navigate = useNavigate();

  const languages = [
    {
      code: "ar" as Language,
      name: "العر��ية",
      nativeName: "العربية",
      flag: "🇸🇦",
      direction: "rtl",
      description: "اللغة العربية - Right to Left",
    },
    {
      code: "en" as Language,
      name: "English",
      nativeName: "English",
      flag: "🇺🇸",
      direction: "ltr",
      description: "English Language - Left to Right",
    },
  ];

  const handleLanguageChange = (lang: Language) => {
    setSelectedLang(lang);
  };

  const applyLanguage = () => {
    setLanguage(selectedLang);
    // إشعار المستخدم بالتغيير
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const resetToDefault = () => {
    setSelectedLang("ar");
  };

  return (
    <div className="min-h-screen bg-cyber-dark text-foreground relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-purple-900/10 to-pink-900/20"></div>

      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-cyan-400 rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-40 pt-6 pb-4">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className={`flex items-center gap-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <ArrowLeft className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
              {t("general.back")}
            </Button>
            <div
              className={`h-6 w-px bg-cyan-400/30 ${isRTL ? "mr-4" : "ml-4"}`}
            ></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <Languages className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  {t("language.title")}
                </h1>
                <p className="text-gray-400 text-sm">
                  {t("language.subtitle")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-30 pt-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Language Selection */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-cyber border-cyber-purple/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-cyan-400">
                    <Globe className="w-5 h-5" />
                    {t("language.change")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {languages.map((lang) => (
                    <div
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer group ${
                        selectedLang === lang.code
                          ? "border-cyan-400 bg-cyan-400/10 shadow-cyber"
                          : "border-gray-700 hover:border-cyan-400/50 hover:bg-gray-800/50"
                      }`}
                    >
                      <div
                        className={`flex items-center gap-4 ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <div className="text-3xl">{lang.flag}</div>
                        <div className="flex-1">
                          <div
                            className={`flex items-center gap-3 ${
                              isRTL ? "flex-row-reverse" : ""
                            }`}
                          >
                            <h3 className="text-lg font-bold text-white">
                              {lang.nativeName}
                            </h3>
                            {selectedLang === lang.code && (
                              <Check className="w-5 h-5 text-cyan-400" />
                            )}
                          </div>
                          <p className="text-gray-400 text-sm">
                            {lang.description}
                          </p>
                          <div
                            className={`flex items-center gap-2 mt-2 ${
                              isRTL ? "flex-row-reverse" : ""
                            }`}
                          >
                            <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">
                              {lang.direction.toUpperCase()}
                            </span>
                            {language === lang.code && (
                              <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-300">
                                {t("language.current")}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight
                          className={`w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors ${
                            isRTL ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      {/* Selection indicator */}
                      {selectedLang === lang.code && (
                        <div className="absolute inset-0 rounded-xl border-2 border-cyan-400 pointer-events-none">
                          <div className="absolute -inset-1 rounded-xl border border-cyan-400/50 animate-ping"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className={`flex gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Button
                  onClick={applyLanguage}
                  disabled={selectedLang === language}
                  className="flex-1 btn-cyber text-lg py-3"
                >
                  <Check className="w-5 h-5 mr-2" />
                  {t("language.apply")}
                </Button>
                <Button
                  variant="outline"
                  onClick={resetToDefault}
                  className="px-6 py-3 border-gray-600 hover:border-cyan-400 text-gray-300 hover:text-cyan-400"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="space-y-6">
              <Card className="glass-cyber border-cyber-purple/30">
                <CardHeader>
                  <CardTitle className="text-purple-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-700">
                    <div
                      className={`text-sm space-y-2 ${
                        selectedLang === "ar" ? "text-right" : "text-left"
                      }`}
                      dir={selectedLang === "ar" ? "rtl" : "ltr"}
                    >
                      <div className="text-cyan-400 font-bold">
                        {selectedLang === "ar"
                          ? "KNOX Sentinel"
                          : "KNOX Sentinel"}
                      </div>
                      <div className="text-gray-300">
                        {selectedLang === "ar"
                          ? "نظام الحماية السيبرانية المتقدم"
                          : "Advanced Cybersecurity Protection System"}
                      </div>
                      <div className="text-green-400 text-xs">
                        {selectedLang === "ar" ? "● نشط" : "● Active"}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-400 space-y-1">
                    <div>{t("language.direction")}:</div>
                    <div className="text-cyan-400">
                      {selectedLang === "ar"
                        ? t("language.rtl")
                        : t("language.ltr")}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Language Info */}
              <Card className="glass-cyber border-cyber-purple/30">
                <CardContent className="pt-6">
                  <div className="text-center space-y-3">
                    <div className="text-4xl">
                      {languages.find((l) => l.code === selectedLang)?.flag}
                    </div>
                    <div className="text-lg font-bold text-white">
                      {
                        languages.find((l) => l.code === selectedLang)
                          ?.nativeName
                      }
                    </div>
                    <div className="text-sm text-gray-400">
                      {
                        languages.find((l) => l.code === selectedLang)
                          ?.description
                      }
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}
