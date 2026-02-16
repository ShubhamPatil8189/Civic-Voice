import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams, useNavigate } from "react-router-dom";

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
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Updateprofile from "./pages/UpdateProfile";
import Register from "./pages/Register";
import { LanguageProvider } from "./context/LanguageContext";
import StoryMode from "./pages/StoryMode";
import './i18n'; // Import i18n configuration


const queryClient = new QueryClient();

// ✅ StoryMode Wrapper (Accepting new feature)
const StoryModeWrapper = () => {
  const { schemeId } = useParams();
  const navigate = useNavigate();

  return (
    <StoryMode
      schemeId={schemeId}
      onClose={() => navigate("/")}
      onApply={() => navigate(`/eligibility/${schemeId}`)}
    />
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <LanguageProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
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

              {/* ✅ Story Mode route */}
              <Route path="/story/:schemeId" element={<StoryModeWrapper />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/update-profile" element={<Updateprofile />} />

              {/* Catch-all 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>

          {/* Bottom navigation */}
          <BottomNav />
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
