import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { lazy, Suspense } from "react";

// Lazy load non-critical routes for better initial page load
const SleepQuiz = lazy(() => import("@/pages/SleepQuiz"));
const DebugQuiz = lazy(() => import("@/pages/DebugQuiz"));
const DemoPage = lazy(() => import("@/pages/DemoPage"));
const LPManager = lazy(() => import('./pages/LPManager'));
const UseCasePage = lazy(() => import("./pages/UseCasePage"));
const FramedStory = lazy(() => import("./pages/FramedStory"));
import { ProductLandingTemplate } from "./templates/ProductLandingTemplate";
import { 
  getConfigBySlug, 
  downAlternativeConfig,
  restorativeAlignmentConfig,
  hotelQualityConfig,
  neckPainReliefConfig,
  sideSleeperConfig,
  valentineGiftConfig,
  mothersDayConfig,
  fathersDayConfig,
  blackFridayConfig,
  fiveStarHotelComfortConfig,
  getAllSlugs
} from "./config";

/**
 * Landing Page Route Component
 * Renders a landing page based on the slug parameter
 */
function LandingPage({ params }: { params: { slug: string } }) {
  const config = getConfigBySlug(params.slug);
  
  if (!config) {
    return <NotFound />;
  }
  
  // Use UseCasePage for use-case category configs
  if (config.category === 'use-case') {
    return <UseCasePage config={config} />;
  }
  
  return <ProductLandingTemplate config={config} />;
}
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      {/* ============================================ */}
      {/* MAIN ROUTE - Down Alternative (5-Star Hotel) */}
      {/* ============================================ */}
      <Route path={"/"}>
        {() => <ProductLandingTemplate config={downAlternativeConfig} />}
      </Route>
      <Route path={"/down-alternative"}>
        {() => <ProductLandingTemplate config={downAlternativeConfig} />}
      </Route>
      
      {/* ============================================ */}
      {/* SLEEP QUIZ FUNNEL */}
      {/* ============================================ */}
      <Route path="/quiz">
        {() => <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d3a5c]"></div></div>}><SleepQuiz /></Suspense>}
      </Route>
      <Route path="/debug-quiz">
        {() => <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d3a5c]"></div></div>}><DebugQuiz /></Suspense>}
      </Route>
      <Route path="/demo">
        {() => <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d3a5c]"></div></div>}><DemoPage /></Suspense>}
      </Route>
      
      {/* ============================================ */}
      {/* ADMIN - Unified LP Manager (Pages + Settings) */}
      {/* ============================================ */}
      <Route path={"/admin"}>
        {() => <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d3a5c]"></div></div>}><LPManager /></Suspense>}
      </Route>
      
      {/* Dynamic landing page routes via /admin/:slug */}
      <Route path={"/admin/:slug"}>
        {(params) => <LandingPage params={params} />}
      </Route>
      
      {/* ============================================ */}
      {/* DIRECT SLUG ROUTES - Add new variants here */}
      {/* ============================================ */}
      
      {/* Restorative Alignment variant */}
      <Route path="/down-pillow-restorative-alignment">
        {() => <ProductLandingTemplate config={restorativeAlignmentConfig} />}
      </Route>
      
      {/* Hotel Quality variant */}
      <Route path={"/hotel-quality-pillow"}>
        {() => <ProductLandingTemplate config={hotelQualityConfig} />}
      </Route>
      
      {/* Neck Pain Relief variant */}
      <Route path={"/neck-pain-relief-pillow"}>
        {() => <ProductLandingTemplate config={neckPainReliefConfig} />}
      </Route>
      
      {/* Side Sleeper Solution (Use Case) */}
      <Route path={"/side-sleeper-pillow"}>
        {() => <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d3a5c]"></div></div>}><UseCasePage config={sideSleeperConfig} /></Suspense>}
      </Route>
      
      {/* Valentine's Day Gift variant */}
      <Route path="/valentine-gift">
        {() => <ProductLandingTemplate config={valentineGiftConfig} />}
      </Route>
      
      {/* Mother's Day Gift variant */}
      <Route path={"/mothers-day-gift"}>
        {() => <ProductLandingTemplate config={mothersDayConfig} />}
      </Route>
      
      {/* Father's Day Gift variant */}
      <Route path={"/fathers-day-gift"}>
        {() => <ProductLandingTemplate config={fathersDayConfig} />}
      </Route>
      
      {/* Black Friday Sale variant */}
      <Route path={"/black-friday"}>
        {() => <ProductLandingTemplate config={blackFridayConfig} />}
      </Route>
      
      {/* ============================================ */}
      {/* FRAMED STORIES - Conversion Funnels */}
      {/* ============================================ */}
      
      {/* 5-Star Hotel Comfort Framed Story */}
      <Route path={"/5-star-hotel-comfort"}>
        {() => <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d3a5c]"></div></div>}><FramedStory config={fiveStarHotelComfortConfig} /></Suspense>}
      </Route>
      
      {/* ============================================ */}
      {/* ERROR ROUTES */}
      {/* ============================================ */}
      
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
