import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import VoiceAssistant from "./pages/VoiceAssistant";
import Eligibility from "./pages/Eligibility";
import Schemes from "./pages/Schemes";
import About from "./pages/About";
import Help from "./pages/Help";
import StepGuide from "./pages/StepGuide";
import Summary from "./pages/Summary";
import NotFound from "./pages/NotFound";
import BottomNav from "./components/layout/BottomNav";
import { LanguageProvider } from "./context/LanguageContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      
<LanguageProvider></LanguageProvider>
      <BrowserRouter>
        <div className="pb-16 md:pb-0">
          <Routes>
            {/* Landing page */}
            <Route path="/" element={<Landing />} />

            {/* Voice assistant */}
            <Route path="/voice-assistant" element={<VoiceAssistant />} />
            <Route path="/schemes" element={<Schemes />} />
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<Help />} />
            <Route path="/eligibility/:schemeId" element={<Eligibility />} />
            {/* Steps guide */}
            <Route path="/steps" element={<StepGuide />} />

            {/* Summary page */}
            <Route path="/summary" element={<Summary />} />

            {/* Catch-all 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>

        {/* Bottom navigation */}
        <BottomNav />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
