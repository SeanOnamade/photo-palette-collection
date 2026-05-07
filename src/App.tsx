
import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy-load heavy pages so their JS + data only downloads when the route is visited
const PhotographyPortfolio = lazy(() => import("./pages/PhotographyPortfolio"));
const About = lazy(() => import("./pages/About"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-portfolio-bg">
    <div className="w-8 h-8 border-2 border-portfolio-accent border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/portfolio" element={<PhotographyPortfolio />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<About />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
