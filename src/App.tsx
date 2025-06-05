
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DarkModeProvider } from "@/contexts/DarkModeContext";
import { UserProvider } from "@/contexts/UserContext";
import Index from "./pages/Index";
import CodeHub from "./pages/CodeHub";
import ChatRoom from "./pages/ChatRoom";
import Profile from "./pages/Profile";
import AvatarProfile from "./pages/AvatarProfile";
import AiPlayground from "./pages/AiPlayground";
import Invite from "./pages/Invite";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DarkModeProvider>
          <UserProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/codehub" element={<CodeHub />} />
                  <Route path="/chat" element={<ChatRoom />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/avatar" element={<AvatarProfile />} />
                  <Route path="/ai-playground" element={<AiPlayground />} />
                  <Route path="/invite" element={<Invite />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </UserProvider>
        </DarkModeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
