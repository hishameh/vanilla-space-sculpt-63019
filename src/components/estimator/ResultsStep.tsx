import { useState } from "react";
import { motion } from "framer-motion";
import { ProjectEstimate, ComponentOption } from "@/types/estimator";
import { Share, CheckCircle2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ImprovedCostVisualization from "./ImprovedCostVisualization";
import PhaseTimelineCost from "./PhaseTimelineCost";
import ContactCTAStrategy from "./ContactCTAStrategy";
import { generateEstimatePDF } from "@/utils/pdfExport";

interface ResultsStepProps {
  estimate: ProjectEstimate;
  onReset: () => void;
  onSave: () => void;
}

const ResultsStep = ({ estimate, onReset, onSave }: ResultsStepProps) => {
  const { toast } = useToast();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(amount).replace('₹', '₹ ');
  };
  
  const toSentenceCase = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;
  
  const handleShare = () => {
    const shareText = `My Construction Estimate:\n\n` +
      `Location: ${estimate.city}, ${estimate.state}\n` +
      `Project: ${toSentenceCase(estimate.projectType)}\n` +
      `Area: ${estimate.area} ${estimate.areaUnit}\n` +
      `Total Cost: ${formatCurrency(estimate.totalCost)}\n` +
      `Per ${estimate.areaUnit}: ${formatCurrency(Math.round(estimate.totalCost / estimate.area))}\n\n` +
      `Get your estimate at: ${window.location.origin}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Construction Cost Estimate',
        text: shareText,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(shareText).then(() => {
        toast({
          title: "Copied to clipboard!",
          description: "Share text has been copied to your clipboard."
        });
      });
    }
  };

  const handleDownloadPDF = () => {
    try {
      generateEstimatePDF(estimate);
      toast({
        title: "PDF Generated!",
        description: "Your estimate has been downloaded as a PDF."
      });
    } catch (error) {
      toast({
        title: "Error generating PDF",
        description: "There was a problem creating your PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Helper to check if component is included
  const isIncluded = (value: string | undefined): boolean => {
    return !!(value && value !== 'none' && value !== '');
  };

  // Helper to format level label
  const formatLevel = (level: ComponentOption) => {
    if (level === 'standard') return 'Standard';
    if (level === 'premium') return 'Premium';
    if (level === 'luxury') return 'Luxury';
    return level;
  };

  // Create pricing list for all selected components
  const pricingList = [
    isIncluded(estimate.civilQuality) && { 
      category: "Core Components",
      name: "Quality of Construction - Civil Materials", 
      level: estimate.civilQuality 
    },
    isIncluded(estimate.plumbing) && { 
      category: "Core Components",
      name: "Plumbing & Sanitary", 
      level: estimate.plumbing 
    },
    isIncluded(estimate.electrical) && { 
      category: "Core Components",
      name: "Electrical Systems", 
      level: estimate.electrical 
    },
    isIncluded(estimate.ac) && { 
      category: "Core Components",
      name: "AC & HVAC Systems", 
      level: estimate.ac 
    },
    isIncluded(estimate.elevator) && { 
      category: "Core Components",
      name: "Elevator/Lift", 
      level: estimate.elevator 
    },
    isIncluded(estimate.buildingEnvelope) && { 
      category: "Finishes",
      name: "Building Envelope & Facade", 
      level: estimate.buildingEnvelope 
    },
    isIncluded(estimate.lighting) && { 
      category: "Finishes",
      name: "Lighting Systems & Fixtures", 
      level: estimate.lighting 
    },
    isIncluded(estimate.windows) && { 
      category: "Finishes",
      name: "Windows & Glazing", 
      level: estimate.windows 
    },
    isIncluded(estimate.ceiling) && { 
      category: "Finishes",
      name: "Ceiling Design & Finishes", 
      level: estimate.ceiling 
    },
    isIncluded(estimate.surfaces) && { 
      category: "Finishes",
      name: "Wall & Floor Finishes", 
      level: estimate.surfaces 
    },
    isIncluded(estimate.fixedFurniture) && { 
      category: "Interiors",
      name: "Fixed Furniture & Cabinetry", 
      level: estimate.fixedFurniture 
    },
    isIncluded(estimate.looseFurniture) && { 
      category: "Interiors",
      name: "Loose Furniture", 
      level: estimate.looseFurniture 
    },
    isIncluded(estimate.furnishings) && { 
      category: "Interiors",
      name: "Furnishings & Soft Decor", 
      level: estimate.furnishings 
    },
    isIncluded(estimate.appliances) && { 
      category: "Interiors",
      name: "Appliances & Equipment", 
      level: estimate.appliances 
    },
    isIncluded(estimate.artefacts) && { 
      category: "Interiors",
      name: "Artefacts & Art Pieces", 
      level: estimate.artefacts 
    },
  ].filter(Boolean);
  
  return (
    <div className="space-y-6 overflow-y-auto overflow-x-hidden max-h-[85vh] px-2 pb-6">
      {/* Main Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-5 rounded-xl border border-vs/10 shadow-sm space-y-5"
      >
        <h2 className="text-xl font-bold text-vs-dark text-center">Your Construction Estimate</h2>
        
        {/* Project Details */}
        <div className="grid grid-cols-3 gap-4 pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-xs text-vs-dark/70 mb-1">Location</h3>
            <p className="font-semibold text-sm">{estimate.city}, {estimate.state}</p>
          </div>
          <div>
            <h3 className="text-xs text-vs-dark/70 mb-1">Project Type</h3>
            <p className="font-semibold text-sm">{toSentenceCase(estimate.projectType)}</p>
          </div>
          <div>
            <h3 className="text-xs text-vs-dark/70 mb-1">Area</h3>
            <p className="font-semibold text-sm">{estimate.area.toLocaleString()} {estimate.areaUnit}</p>
          </div>
        </div>
        
        {/* Total Cost - Prominent */}
        <div className="bg-gradient-to-br from-vs/10 to-vs/5 p-6 rounded-xl text-center">
          <h3 className="text-sm text-vs-dark/70 mb-2">Estimated Total Cost</h3>
          <p className="text-4xl font-bold text-vs mb-2">{formatCurrency(estimate.totalCost)}</p>
          <p className="text-sm text-vs-dark/70">
            {formatCurrency(Math.round(estimate.totalCost / estimate.area))} per {estimate.areaUnit}
          </p>
        </div>

        {/* Cost Breakdown Visualization */}
        <div>
          <h3 className="text-base font-semibold text-vs-dark mb-3">Cost Distribution</h3>
          <ImprovedCostVisualization estimate={estimate} />
        </div>

        {/* Timeline */}
        <div>
          <h3 className="text-base font-semibold text-vs-dark mb-3">Project Timeline & Costs</h3>
          <PhaseTimelineCost estimate={estimate} />
        </div>

        {/* Selected Features - List Format */}
        <div>
          <h3 className="text-base font-semibold text-vs-dark mb-3">Selected Components & Features</h3>
          <div className="space-y-3">
            {pricingList.map((item, index) => (
              <div 
                key={index} 
                className="flex items-start justify-between py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start gap-2 flex-1">
                  <CheckCircle2 size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.category}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-vs bg-vs/10 px-3 py-1 rounded-full whitespace-nowrap">
                  {formatLevel(item.level)}
                </span>
              </div>
            ))}
          </div>
          
          {pricingList.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">No components selected</p>
          )}
        </div>

        {/* Disclaimer */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-xs text-gray-700">
          <p className="font-medium text-orange-800 mb-1">Important Note:</p>
          <p>This is an indicative estimate based on standard inputs and market rates for {estimate.city}. Final costs may vary based on site conditions, material availability, contractor rates, and specific requirements. For an accurate detailed quote, please contact our team.</p>
        </div>
      </motion.div>

      {/* Contact CTA */}
      <ContactCTAStrategy estimate={estimate} />

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button 
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
        >
          <Download size={18} /> Download PDF
        </button>

        <button 
          onClick={handleShare}
          className="flex items-center gap-2 px-6 py-3 bg-vs hover:bg-vs-light text-white font-semibold rounded-lg transition-colors"
        >
          <Share size={18} /> Share Estimate
        </button>
        
        <button 
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          Start New Estimate
        </button>
      </div>
    </div>
  );
};

export default ResultsStep;
