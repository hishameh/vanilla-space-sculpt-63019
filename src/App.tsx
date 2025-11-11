import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

// Import pages
import Home from './pages/Home';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import ArchitectFee from './pages/ArchitectFee';
import ArchitectFeeCalculator from './pages/ArchitectFeeCalculator';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter basename="/vanilla-space-sculpt-63019">
          <Routes>
            {/* Main landing page */}
            <Route path="/" element={<Home />} />
            
            {/* Estimator page */}
            <Route path="/estimator" element={<Index />} />
            
            {/* Architect fee calculators */}
            <Route path="/architect-fee" element={<ArchitectFee />} />
            <Route path="/architect-fee-calculator" element={<ArchitectFeeCalculator />} />
            
            {/* 404 page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
