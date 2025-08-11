
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import EventDetails from "./pages/EventDetails";
import BookingPage from "./pages/BookingPage";
import UserDashboard from "./pages/UserDashboard";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import CreateEvent from "./pages/CreateEvent";
import ManageEvents from "./pages/ManageEvents";
import ViewTicket from "./pages/ViewTicket";
import NotFound from "./pages/NotFound";
import ChatBot from "@/components/ChatBot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/book/:id" element={<BookingPage />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/organizer" element={<OrganizerDashboard />} />
            <Route path="/organizer/create" element={<CreateEvent />} />
            <Route path="/organizer/events" element={<ManageEvents />} />
            <Route path="/ticket/:id" element={<ViewTicket />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatBot />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
