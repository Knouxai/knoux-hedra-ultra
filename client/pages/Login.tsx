import { useState } from "react";
import {
  Shield,
  Eye,
  EyeOff,
  Lock,
  Fingerprint,
  Smartphone,
} from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [authMethod, setAuthMethod] = useState<
    "password" | "otp" | "biometric"
  >("password");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to dashboard
      window.location.href = "/";
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-cyber-dark cyber-grid flex items-center justify-center p-4">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyber-neon rounded-full animate-float opacity-60"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-cyber-neon-pink rounded-full animate-float animation-delay-1000 opacity-40"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-cyber-neon-blue rounded-full animate-float animation-delay-2000 opacity-50"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-cyber-neon-green rounded-full animate-float animation-delay-3000 opacity-50"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl glass-cyber flex items-center justify-center animate-glow-pulse">
            <Shield className="w-10 h-10 text-cyber-neon" />
          </div>
          <h1 className="text-4xl font-bold text-cyber-neon neon-glow mb-2">
            KNOX Sentinel
          </h1>
          <p className="text-cyber-purple-light">Premium Vault Gate</p>
          <div className="mt-2 text-xs text-cyber-purple-light">
            Cosmic Cyber Shield™ v1.0 Alpha
          </div>
        </div>

        {/* Login Form */}
        <div className="glass-cyber rounded-2xl p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-cyber-neon mb-2">
              Access Control
            </h2>
            <p className="text-cyber-purple-light text-sm">
              Authenticate to enter your cyber fortress
            </p>
          </div>

          {/* Auth Method Selector */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setAuthMethod("password")}
              className={`flex-1 p-3 rounded-lg border transition-all ${
                authMethod === "password"
                  ? "border-cyber-neon bg-cyber-neon/10 text-cyber-neon"
                  : "border-cyber-glass-border text-cyber-purple-light hover:border-cyber-neon/50"
              }`}
            >
              <Lock className="w-4 h-4 mx-auto mb-1" />
              <div className="text-xs">Password</div>
            </button>
            <button
              onClick={() => setAuthMethod("otp")}
              className={`flex-1 p-3 rounded-lg border transition-all ${
                authMethod === "otp"
                  ? "border-cyber-neon bg-cyber-neon/10 text-cyber-neon"
                  : "border-cyber-glass-border text-cyber-purple-light hover:border-cyber-neon/50"
              }`}
            >
              <Smartphone className="w-4 h-4 mx-auto mb-1" />
              <div className="text-xs">OTP</div>
            </button>
            <button
              onClick={() => setAuthMethod("biometric")}
              className={`flex-1 p-3 rounded-lg border transition-all ${
                authMethod === "biometric"
                  ? "border-cyber-neon bg-cyber-neon/10 text-cyber-neon"
                  : "border-cyber-glass-border text-cyber-purple-light hover:border-cyber-neon/50"
              }`}
            >
              <Fingerprint className="w-4 h-4 mx-auto mb-1" />
              <div className="text-xs">Biometric</div>
            </button>
          </div>

          <form onSubmit={handleLogin}>
            {/* Username */}
            <div className="mb-4">
              <label className="block text-cyber-purple-light text-sm font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg bg-cyber-dark/50 border border-cyber-glass-border text-cyber-neon placeholder-cyber-purple-light/50 focus:border-cyber-neon focus:outline-none focus:ring-1 focus:ring-cyber-neon transition-all"
                placeholder="Enter your username"
                defaultValue="knoux"
              />
            </div>

            {/* Password Field */}
            {authMethod === "password" && (
              <div className="mb-6">
                <label className="block text-cyber-purple-light text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-3 pr-12 rounded-lg bg-cyber-dark/50 border border-cyber-glass-border text-cyber-neon placeholder-cyber-purple-light/50 focus:border-cyber-neon focus:outline-none focus:ring-1 focus:ring-cyber-neon transition-all"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyber-purple-light hover:text-cyber-neon transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* OTP Field */}
            {authMethod === "otp" && (
              <div className="mb-6">
                <label className="block text-cyber-purple-light text-sm font-medium mb-2">
                  One-Time Password
                </label>
                <input
                  type="text"
                  maxLength={6}
                  className="w-full px-4 py-3 rounded-lg bg-cyber-dark/50 border border-cyber-glass-border text-cyber-neon placeholder-cyber-purple-light/50 focus:border-cyber-neon focus:outline-none focus:ring-1 focus:ring-cyber-neon transition-all text-center text-2xl font-mono tracking-widest"
                  placeholder="000000"
                />
                <p className="text-xs text-cyber-purple-light mt-2">
                  Check your authenticator app for the 6-digit code
                </p>
              </div>
            )}

            {/* Biometric */}
            {authMethod === "biometric" && (
              <div className="mb-6 text-center">
                <div className="w-24 h-24 mx-auto rounded-full glass-cyber flex items-center justify-center mb-4 animate-glow-pulse cursor-pointer hover:scale-105 transition-transform">
                  <Fingerprint className="w-12 h-12 text-cyber-neon" />
                </div>
                <p className="text-cyber-purple-light text-sm">
                  Touch the sensor to authenticate
                </p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-cyber py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-cyber-neon border-t-transparent rounded-full animate-spin"></div>
                  Authenticating...
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Shield className="w-5 h-5" />
                  Access Vault
                </span>
              )}
            </button>

            {/* Additional Options */}
            <div className="mt-6 text-center space-y-2">
              <button
                type="button"
                className="text-cyber-purple-light hover:text-cyber-neon transition-colors text-sm"
              >
                Forgot your credentials?
              </button>
              <div className="text-xs text-cyber-purple-light">
                Powered by <span className="text-cyber-neon">knoux7-core</span>{" "}
                security protocols
              </div>
            </div>
          </form>
        </div>

        {/* Security Notice */}
        <div className="mt-6 glass-card rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">
              Secure Connection
            </span>
          </div>
          <p className="text-xs text-cyber-purple-light">
            AES-512 encrypted • Zero-knowledge architecture
          </p>
        </div>
      </div>
    </div>
  );
}
