import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Index() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="min-h-screen p-6"
      style={{
        fontFamily: "Orbitron, monospace",
        backgroundColor: "#000000",
        color: "#0ff",
      }}
    >
      {/* Container with neon glow effect */}
      <main
        className="max-w-6xl mx-auto p-6 rounded-2xl"
        style={{
          backgroundColor: "#0a0a0a",
          boxShadow: "0 0 10px #00e5ff, inset 0 0 20px #0ff",
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1
            className="text-4xl font-extrabold text-center tracking-widest select-none"
            style={{
              color: "#0ff",
              textShadow:
                "0 0 5px #0ff, 0 0 10px #0ff, 0 0 20px #0ff, 0 0 40px #0ff",
              letterSpacing: "0.15em",
            }}
          >
            الأقسام السبعة (Modules)
          </h1>

          <div
            className="text-sm font-mono"
            style={{
              color: "#e0f7fa",
              textShadow: "0 0 3px #0ff, 0 0 5px #0ff",
            }}
          >
            {currentTime.toLocaleTimeString("ar-SA")}
          </div>
        </div>

        {/* Knox Sentinel Branding */}
        <div className="text-center mb-8">
          <h2
            className="text-2xl font-bold mb-2"
            style={{
              color: "#d32fff",
              textShadow: "0 0 5px #d32fff, 0 0 10px #d32fff, 0 0 20px #d32fff",
            }}
          >
            KNOX Sentinel | Cosmic Cyber Shield™
          </h2>
          <p
            className="text-sm"
            style={{
              color: "#e0f7fa",
              textShadow: "0 0 3px #0ff",
            }}
          >
            مركز الأمان السيبراني المتقدم - knoux7-core
          </p>
        </div>

        {/* Modules Grid */}
        <div
          className="grid gap-8 mb-8"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          {/* Module 1: Defensive Ops */}
          <Link to="/defensive-ops">
            <section className="hover:scale-105 transition-transform duration-300 cursor-pointer">
              <h2
                className="text-lg font-semibold mb-2 select-none"
                style={{
                  color: "#ff2fff",
                  textShadow: "0 0 5px #ff2fff, 0 0 10px #ff2fff",
                  letterSpacing: "0.1em",
                }}
              >
                1️⃣ قسم الدفاع السيبراني (Defensive Ops)
              </h2>
              <ul className="space-y-2">
                {[
                  { icon: "🔰", text: "فحص الخدمات النشطة" },
                  { icon: "🛡️", text: "حماية منافذ النظام Ports Shield" },
                  {
                    icon: "🧬",
                    text: "تحليل العمليات الجارية (Process Monitor)",
                  },
                  {
                    icon: "🧯",
                    text: "منع البرمجيات الضارة (Real-time Blocker)",
                  },
                  { icon: "🔐", text: "إدارة كلمات المرور VaultPass™" },
                  { icon: "🗜️", text: "تشفير التقارير والمجلدات AES512" },
                  {
                    icon: "🚨",
                    text: "نظام تنبيه مباشر عند التهديد (Sentinel Alerts)",
                  },
                ].map((tool, index) => (
                  <li
                    key={index}
                    className="flex items-center space-x-2 rtl:space-x-reverse text-sm select-none"
                    style={{
                      color: "#e0f7fa",
                      textShadow: "0 0 3px #0ff, 0 0 5px #0ff",
                    }}
                  >
                    <span
                      className="text-xl flex-shrink-0"
                      style={{ color: "#ff2fff" }}
                    >
                      {tool.icon}
                    </span>
                    <span>{tool.text}</span>
                  </li>
                ))}
              </ul>
            </section>
          </Link>

          {/* Module 2: Offensive Tools */}
          <Link to="/offensive-tools">
            <section className="hover:scale-105 transition-transform duration-300 cursor-pointer">
              <h2
                className="text-lg font-semibold mb-2 select-none"
                style={{
                  color: "#ff2fff",
                  textShadow: "0 0 5px #ff2fff, 0 0 10px #ff2fff",
                  letterSpacing: "0.1em",
                }}
              >
                2️⃣ قسم الهجوم الأخلاقي (Offensive Tools)
              </h2>
              <ul className="space-y-2">
                {[
                  { icon: "🧨", text: "ماسح الثغرات الذكي (AutoRecon)" },
                  { icon: "🕷️", text: "Sniffer & Packet Interceptor" },
                  { icon: "💣", text: "توليد سكربتات هجوم تلقائية" },
                  { icon: "🎯", text: "استهداف WiFi/APs واختبار الاختراق" },
                  { icon: "🛰️", text: "أدوات OSINT للبحث العميق" },
                  { icon: "🎭", text: "انتحال MAC/ARP/Spoof" },
                  { icon: "🧪", text: "استغلال الثغرات المعروفة CVEs" },
                ].map((tool, index) => (
                  <li
                    key={index}
                    className="flex items-center space-x-2 rtl:space-x-reverse text-sm select-none"
                    style={{
                      color: "#e0f7fa",
                      textShadow: "0 0 3px #0ff, 0 0 5px #0ff",
                    }}
                  >
                    <span
                      className="text-xl flex-shrink-0"
                      style={{ color: "#ff2fff" }}
                    >
                      {tool.icon}
                    </span>
                    <span>{tool.text}</span>
                  </li>
                ))}
              </ul>
            </section>
          </Link>

          {/* Module 3: Surveillance */}
          <Link to="/surveillance">
            <section className="hover:scale-105 transition-transform duration-300 cursor-pointer">
              <h2
                className="text-lg font-semibold mb-2 select-none"
                style={{
                  color: "#ff2fff",
                  textShadow: "0 0 5px #ff2fff, 0 0 10px #ff2fff",
                  letterSpacing: "0.1em",
                }}
              >
                3️⃣ قسم أدوات المراقبة (Surveillance)
              </h2>
              <ul className="space-y-2">
                {[
                  {
                    icon: "🔎",
                    text: "مراقبة النظام بالكامل (System Watchdog)",
                  },
                  { icon: "👁️‍🗨️", text: "مراقبة الشبكة الحية" },
                  { icon: "📂", text: "تتبع فتح الملفات / السجلات" },
                  { icon: "🛠️", text: "مراقبة أدوات الطرف الثالث" },
                  { icon: "🔐", text: "كشف محاولات الدخول الغير مصرح" },
                  { icon: "📡", text: "مراقبة الكاميرا/الميكروفون (إن وجدت)" },
                  {
                    icon: "📊",
                    text: "تسجيل نشاط المستخدم بصمت (Optional Logging)",
                  },
                ].map((tool, index) => (
                  <li
                    key={index}
                    className="flex items-center space-x-2 rtl:space-x-reverse text-sm select-none"
                    style={{
                      color: "#e0f7fa",
                      textShadow: "0 0 3px #0ff, 0 0 5px #0ff",
                    }}
                  >
                    <span
                      className="text-xl flex-shrink-0"
                      style={{ color: "#ff2fff" }}
                    >
                      {tool.icon}
                    </span>
                    <span>{tool.text}</span>
                  </li>
                ))}
              </ul>
            </section>
          </Link>

          {/* Module 4: Network & VPN Control */}
          <Link to="/network-control">
            <section className="hover:scale-105 transition-transform duration-300 cursor-pointer">
              <h2
                className="text-lg font-semibold mb-2 select-none"
                style={{
                  color: "#ff2fff",
                  textShadow: "0 0 5px #ff2fff, 0 0 10px #ff2fff",
                  letterSpacing: "0.1em",
                }}
              >
                4️⃣ قسم إدارة الاتصال والشبكات (Net & VPN Control)
              </h2>
              <ul className="space-y-2">
                {[
                  { icon: "🕸️", text: "رسم خريطة الشبكة" },
                  { icon: "🛰️", text: "تفعيل VPN داخلي (WireGuard / OpenVPN)" },
                  { icon: "🔧", text: "أدوات DNS Leak Check" },
                  { icon: "🔦", text: "اكتشاف اتصال مشبوه أو Proxies" },
                  { icon: "📶", text: "اختبار السرعة والتحميل" },
                  { icon: "🗼", text: "حماية الشبكة المحلية LAN Defender" },
                  { icon: "🌍", text: "WebRTC Leak Blocker" },
                ].map((tool, index) => (
                  <li
                    key={index}
                    className="flex items-center space-x-2 rtl:space-x-reverse text-sm select-none"
                    style={{
                      color: "#e0f7fa",
                      textShadow: "0 0 3px #0ff, 0 0 5px #0ff",
                    }}
                  >
                    <span
                      className="text-xl flex-shrink-0"
                      style={{ color: "#ff2fff" }}
                    >
                      {tool.icon}
                    </span>
                    <span>{tool.text}</span>
                  </li>
                ))}
              </ul>
            </section>
          </Link>

          {/* Module 5: AI Cyber Assistant */}
          <Link to="/ai-assistant">
            <section className="hover:scale-105 transition-transform duration-300 cursor-pointer">
              <h2
                className="text-lg font-semibold mb-2 select-none"
                style={{
                  color: "#ff2fff",
                  textShadow: "0 0 5px #ff2fff, 0 0 10px #ff2fff",
                  letterSpacing: "0.1em",
                }}
              >
                5️⃣ قسم التفاعل مع الذكاء الاصطناعي (AI Cyber Assistant)
              </h2>
              <ul className="space-y-2">
                {[
                  {
                    icon: "🧠",
                    text: "توليد سكربت من وصف بسيط (Knoux ScriptGen)",
                  },
                  { icon: "🤖", text: "توصية بالأدوات الأنسب للهجمة/الدفاع" },
                  { icon: "📝", text: "تحليل ملف وشرح الثغرات الموجودة فيه" },
                  { icon: "💬", text: "محادثة أمنية مع ChatKnox AI" },
                  { icon: "📜", text: "اقتراح إعدادات أفضل لحماية النظام" },
                  { icon: "🧩", text: "استدعاء YOLO/Whisper لفحص صور/صوت" },
                  { icon: "🧠", text: "دعم الأوامر الصوتية للأدوات" },
                ].map((tool, index) => (
                  <li
                    key={index}
                    className="flex items-center space-x-2 rtl:space-x-reverse text-sm select-none"
                    style={{
                      color: "#e0f7fa",
                      textShadow: "0 0 3px #0ff, 0 0 5px #0ff",
                    }}
                  >
                    <span
                      className="text-xl flex-shrink-0"
                      style={{ color: "#ff2fff" }}
                    >
                      {tool.icon}
                    </span>
                    <span>{tool.text}</span>
                  </li>
                ))}
              </ul>
            </section>
          </Link>

          {/* Module 6: Encrypted Reporting */}
          <Link to="/reporting">
            <section className="hover:scale-105 transition-transform duration-300 cursor-pointer">
              <h2
                className="text-lg font-semibold mb-2 select-none"
                style={{
                  color: "#ff2fff",
                  textShadow: "0 0 5px #ff2fff, 0 0 10px #ff2fff",
                  letterSpacing: "0.1em",
                }}
              >
                6️⃣ قسم التقارير والتوثيق (Encrypted Reporting)
              </h2>
              <ul className="space-y-2">
                {[
                  { icon: "📥", text: "توليد تقارير PDF مشفرة" },
                  { icon: "🧾", text: "تقرير مفصل لكل عملية هجوم/دفاع" },
                  { icon: "🧬", text: "إضافة توقيع knoux على كل تقرير" },
                  { icon: "⏱️", text: "عرض المدة + النتائج + النسبة" },
                  { icon: "🔒", text: "حماية التقارير بكلمة مرور رئيسية" },
                  {
                    icon: "🔁",
                    text: "إرسال نسخة للتخزين المحلي أو السحابي (اختياري)",
                  },
                  { icon: "📂", text: "إدارة أرشيف التقارير" },
                ].map((tool, index) => (
                  <li
                    key={index}
                    className="flex items-center space-x-2 rtl:space-x-reverse text-sm select-none"
                    style={{
                      color: "#e0f7fa",
                      textShadow: "0 0 3px #0ff, 0 0 5px #0ff",
                    }}
                  >
                    <span
                      className="text-xl flex-shrink-0"
                      style={{ color: "#ff2fff" }}
                    >
                      {tool.icon}
                    </span>
                    <span>{tool.text}</span>
                  </li>
                ))}
              </ul>
            </section>
          </Link>

          {/* Module 7: Cosmic Settings */}
          <Link to="/cosmic-settings">
            <section className="hover:scale-105 transition-transform duration-300 cursor-pointer">
              <h2
                className="text-lg font-semibold mb-2 select-none"
                style={{
                  color: "#ff2fff",
                  textShadow: "0 0 5px #ff2fff, 0 0 10px #ff2fff",
                  letterSpacing: "0.1em",
                }}
              >
                7️⃣ قسم الإعدادات والتحكم (Cosmic Settings)
              </h2>
              <ul className="space-y-2">
                {[
                  { icon: "🎨", text: "تخصيص الواجهة بالكامل" },
                  { icon: "🌑", text: "الوضع الليلي/النهاري" },
                  { icon: "🔔", text: "إدارة التنبيهات (صوت/ضوء/تفاعل)" },
                  { icon: "🧪", text: "تفعيل أدوات محددة حسب الحالة" },
                  {
                    icon: "🛠️",
                    text: "إعدادات حماية متقدمة (جدار ناري داخلي)",
                  },
                  { icon: "👑", text: "تغيير صلاحيات الوصول للأدوات" },
                  {
                    icon: "🧠",
                    text: "اختيار موديل الذكاء الاصطناعي المستخدم",
                  },
                ].map((tool, index) => (
                  <li
                    key={index}
                    className="flex items-center space-x-2 rtl:space-x-reverse text-sm select-none"
                    style={{
                      color: "#e0f7fa",
                      textShadow: "0 0 3px #0ff, 0 0 5px #0ff",
                    }}
                  >
                    <span
                      className="text-xl flex-shrink-0"
                      style={{ color: "#ff2fff" }}
                    >
                      {tool.icon}
                    </span>
                    <span>{tool.text}</span>
                  </li>
                ))}
              </ul>
            </section>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p
            className="text-sm"
            style={{
              color: "#e0f7fa",
              textShadow: "0 0 3px #0ff",
            }}
          >
            <span
              style={{
                color: "#d32fff",
                fontWeight: "bold",
                textShadow: "0 0 5px #d32fff",
              }}
            >
              KNOX Sentinel
            </span>{" "}
            | Cosmic Cyber Shield™ v1.0 Alpha | knoux7-core 💎
          </p>
          <p
            className="text-xs mt-2"
            style={{
              color: "#b13fff",
            }}
          >
            "Welcome to your Cyber Fortress ⚡️" - مرحباً بك في قلعتك السيبرانية
          </p>
        </div>
      </main>

      {/* Global styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .modules-grid {
            grid-template-columns: 1fr !important;
          }
        }

        /* Hide scrollbar for better look */
        ::-webkit-scrollbar {
          display: none;
        }

        /* RTL support */
        [dir="rtl"] .space-x-reverse > :not([hidden]) ~ :not([hidden]) {
          --tw-space-x-reverse: 1;
          margin-right: calc(0.5rem * var(--tw-space-x-reverse));
          margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));
        }
      `}</style>
    </div>
  );
}
