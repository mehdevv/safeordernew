import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { isClientAuthenticated } from "@/lib/client-auth";

import IndexPage from "@/pages/index";
import MerchantLogin from "@/pages/merchant/login";
import MerchantRegister from "@/pages/merchant/register";
import MerchantDashboard from "@/pages/merchant/dashboard";
import MerchantOrders from "@/pages/merchant/orders";
import MerchantStats from "@/pages/merchant/stats";
import MerchantInsights from "@/pages/merchant/insights";
import MerchantProfile from "@/pages/merchant/profile";
import MerchantProducts from "@/pages/merchant/products";

import OrderPublic from "@/pages/order/public";
import OrderConfirmation from "@/pages/order/confirmation";
import SafeTrack from "@/pages/track/index";
import SafeTrackResult from "@/pages/track/result";
import ClientOrders from "@/client/pages/orders";
import ClientFeedback from "@/client/pages/feedback";
import ClientLogin from "@/client/pages/login";
import ClientRegister from "@/client/pages/register";
import ClientDashboard from "@/client/pages/dashboard";

import "@/lib/auth"; // init auth

function ClientHomeRedirect() {
  const [, navigate] = useLocation();
  useEffect(() => {
    if (isClientAuthenticated()) {
      navigate("/client/dashboard");
    } else {
      navigate("/client/login");
    }
  }, [navigate]);
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-sm text-muted-foreground animate-pulse">Redirection…</p>
    </div>
  );
}

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* Public / Landing */}
      <Route path="/" component={IndexPage} />

      {/* Merchant */}
      <Route path="/merchant/login" component={MerchantLogin} />
      <Route path="/merchant/register" component={MerchantRegister} />
      <Route path="/merchant/dashboard" component={MerchantDashboard} />
      <Route path="/merchant/orders" component={MerchantOrders} />
      <Route path="/merchant/products" component={MerchantProducts} />
      <Route path="/merchant/stats" component={MerchantStats} />
      <Route path="/merchant/insights" component={MerchantInsights} />
      <Route path="/merchant/profile" component={MerchantProfile} />

      {/* Client */}
      <Route path="/order/:productId" component={OrderPublic} />
      <Route path="/order/:productId/confirmation" component={OrderConfirmation} />
      <Route path="/track" component={SafeTrack} />
      <Route path="/track/:code" component={SafeTrackResult} />
      <Route path="/client" component={ClientHomeRedirect} />
      <Route path="/client/login" component={ClientLogin} />
      <Route path="/client/register" component={ClientRegister} />
      <Route path="/client/dashboard" component={ClientDashboard} />
      <Route path="/client/orders" component={ClientOrders} />
      <Route path="/client/feedback/:orderId" component={ClientFeedback} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
