import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Onboarding from "@/pages/onboarding";
import Dashboard from "@/pages/dashboard";
import Dance from "@/pages/dance";
import Nutrition from "@/pages/nutrition";
import Chatbot from "@/pages/chatbot";
import Navbar from "./components/layout/navbar";
import Footer from "./components/layout/footer";
import MobileNav from "./components/layout/mobile-nav";
import { useUser } from "./contexts/user-context";

function App() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          <p className="text-lg font-medium">Loading BeatBurn...</p>
        </div>
      </div>
    );
  }
  
  return (
    <TooltipProvider>
      <div className="flex min-h-screen flex-col">
        {user && <Navbar />}
        <main className="flex-1">
          <Router />
        </main>
        {user && (
          <>
            <Footer />
            <MobileNav />
          </>
        )}
      </div>
      <Toaster />
    </TooltipProvider>
  );
}

function Router() {
  const { user } = useUser();
  
  return (
    <Switch>
      <Route path="/" component={user ? Dashboard : Onboarding} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dance" component={Dance} />
      <Route path="/nutrition" component={Nutrition} />
      <Route path="/chatbot" component={Chatbot} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;
