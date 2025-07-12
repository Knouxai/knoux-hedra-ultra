import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        fontFamily: "Orbitron, monospace",
        backgroundColor: "#000000",
        color: "#0ff",
      }}
    >
      <div className="text-center">
        <h1
          className="text-6xl font-bold mb-4"
          style={{
            color: "#0ff",
            textShadow:
              "0 0 5px #0ff, 0 0 10px #0ff, 0 0 20px #0ff, 0 0 40px #0ff",
          }}
        >
          404
        </h1>
        <p
          className="text-xl mb-8"
          style={{
            color: "#ff2fff",
            textShadow: "0 0 5px #ff2fff, 0 0 10px #ff2fff",
          }}
        >
          الصفحة غير موجودة | Page Not Found
        </p>
        <p
          className="text-sm mb-6"
          style={{
            color: "#e0f7fa",
            textShadow: "0 0 3px #0ff",
          }}
        >
          الصفحة التي تبحث عنها غير متوفرة في النظام السيبراني
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105"
          style={{
            color: "#0ff",
            border: "2px solid #0ff",
            backgroundColor: "rgba(0, 255, 255, 0.1)",
            textShadow: "0 0 5px #0ff",
            boxShadow: "0 0 10px rgba(0, 255, 255, 0.3)",
          }}
        >
          العودة للرئيسية | Return to Cyber Fortress
        </a>
      </div>
    </div>
  );
};

export default NotFound;
