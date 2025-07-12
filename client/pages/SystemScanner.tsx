import { ArrowLeft, ShieldCheck, Zap, Trash2, Cpu, Power, RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom";

const tools = [
  {
    name: "Full Scan",
    description: "فحص شامل لكل الملفات، العمليات، المنافذ، والخدمات.",
    icon: <ShieldCheck className="w-6 h-6 text-cyber-neon" />,
    action: () => alert("Running Full Scan...")
  },
  {
    name: "Rootkit Checker",
    description: "كشف البرمجيات الخبيثة المخفية والمتجذّرة في النظام.",
    icon: <Zap className="w-6 h-6 text-cyber-neon" />,
    action: () => alert("Checking for rootkits...")
  },
  {
    name: "RAM Purge",
    description: "تحرير الذاكرة العشوائية وتسريع النظام مباشرة.",
    icon: <Cpu className="w-6 h-6 text-cyber-neon" />,
    action: () => alert("Purging RAM...")
  },
  {
    name: "Junk Cleaner",
    description: "حذف الملفات المؤقتة والمهملة لتحرير المساحة.",
    icon: <Trash2 className="w-6 h-6 text-cyber-neon" />,
    action: () => alert("Cleaning junk files...")
  },
  {
    name: "Startup Optimizer",
    description: "إدارة وتحسين عناصر بدء التشغيل لتسريع الإقلاع.",
    icon: <Power className="w-6 h-6 text-cyber-neon" />,
    action: () => alert("Optimizing startup items...")
  },
  {
    name: "Refresh Services",
    description: "إعادة تهيئة الخدمات لتسريع النظام واستقراره.",
    icon: <RefreshCcw className="w-6 h-6 text-cyber-neon" />,
    action: () => alert("Refreshing services...")
  }
];

export default function SystemScanner() {
  return (
    <div className="min-h-screen bg-cyber-dark cyber-grid">
      <header className="p-6">
        <div className="glass-cyber rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="w-10 h-10 rounded-lg glass-cyber flex items-center justify-center hover:scale-110 transition-transform"
            >
              <ArrowLeft className="w-5 h-5 text-cyber-neon" />
            </Link>
            <div className="w-12 h-12 rounded-xl glass-cyber flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-cyber-neon animate-glow-pulse" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-cyber-neon neon-glow">
                محرك التحسين والتنظيف الفائق
              </h1>
              <p className="text-cyber-purple-light">
                أدوات ذكية لتحسين وتسريع النظام بأمان
              </p>
            </div>
          </div>
        </div>
      </header>
      <main className="p-6">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool, idx) => (
            <div
              key={idx}
              className="glass-card p-6 rounded-xl shadow-lg flex flex-col items-center text-center hover:scale-105 transition-transform"
            >
              <div className="mb-4">{tool.icon}</div>
              <h3 className="text-lg font-bold text-cyber-neon mb-2">
                {tool.name}
              </h3>
              <p className="text-sm text-cyber-purple-light mb-4">
                {tool.description}
              </p>
              <button
                onClick={tool.action}
                className="btn-cyber w-full mt-auto"
              >
                تنفيذ الآن
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
