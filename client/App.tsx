import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import LanguageSettings from "./pages/LanguageSettings";

// 7 Main Module Pages
import DefensiveOps from "./pages/modules/DefensiveOps";
import DefensiveOpsEnhanced from "./pages/modules/DefensiveOpsEnhanced";
import OffensiveTools from "./pages/modules/OffensiveTools";
import Surveillance from "./pages/modules/Surveillance";
import NetworkControl from "./pages/modules/NetworkControl";
import AIAssistant from "./pages/modules/AIAssistant";
import Reporting from "./pages/modules/Reporting";
import CosmicSettings from "./pages/modules/CosmicSettings";

// Legacy individual tool pages (for backwards compatibility)
import SerpentTrap from "./pages/SerpentTrap";
import Deterrence3D from "./pages/Deterrence3D";
import ScriptGenerator from "./pages/ScriptGenerator";
import VPNShield from "./pages/VPNShield";
import SystemScanner from "./pages/SystemScanner";
import AISentinel from "./pages/AISentinel";
import BlackRoom from "./pages/BlackRoom";
import PolicyCommander from "./pages/PolicyCommander";
import CodeSniffer from "./pages/CodeSniffer";
import ChatOps from "./pages/ChatOps";
import CounterStrike from "./pages/CounterStrike";
import NetworkWatch from "./pages/NetworkWatch";
import VaultPass from "./pages/VaultPass";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
import AlertSystem from "./pages/AlertSystem";
import BackupChecker from "./pages/BackupChecker";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/language-settings" element={<LanguageSettings />} />

            {/* 7 Main Cyber Modules */}
            <Route path="/defensive-ops" element={<DefensiveOps />} />
            <Route path="/offensive-tools" element={<OffensiveTools />} />
            <Route path="/surveillance" element={<Surveillance />} />
            <Route path="/network-control" element={<NetworkControl />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/reporting" element={<Reporting />} />
            <Route path="/cosmic-settings" element={<CosmicSettings />} />

            {/* Legacy Individual Tools (backwards compatibility) */}
            <Route path="/serpent-trap" element={<SerpentTrap />} />
            <Route path="/3d-deterrence" element={<Deterrence3D />} />
            <Route path="/script-generator" element={<ScriptGenerator />} />
            <Route path="/vpn-shield" element={<VPNShield />} />
            <Route path="/system-scanner" element={<SystemScanner />} />
            <Route path="/ai-sentinel" element={<AISentinel />} />
            <Route path="/black-room" element={<BlackRoom />} />
            <Route path="/policy-commander" element={<PolicyCommander />} />
            <Route path="/code-sniffer" element={<CodeSniffer />} />
            <Route path="/chat-ops" element={<ChatOps />} />
            <Route path="/counter-strike" element={<CounterStrike />} />
            <Route path="/network-watch" element={<NetworkWatch />} />
            <Route path="/vault-pass" element={<VaultPass />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/alert-system" element={<AlertSystem />} />
            <Route path="/backup-checker" element={<BackupChecker />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
