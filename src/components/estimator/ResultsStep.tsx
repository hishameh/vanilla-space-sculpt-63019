import { useState } from "react";
import { motion } from "framer-motion";
import { ProjectEstimate, ComponentOption } from "@/types/estimator";
import { Share, Calendar, Flag, CheckCheck, HardHat, PieChart, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import UserInfoForm, { UserFormData } from "./UserInfoForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImprovedCostVisualization from "./ImprovedCostVisualization";
import PhaseTimelineCost from "./PhaseTimelineCost";

interface ResultsStepProps {
  estimate: ProjectEstimate;
  onReset: () => void;
  onSave: () => void;
}

const ResultsStep = ({ estimate, onReset, onSave }: ResultsStepProps) => {
  const { toast } = useToast();
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("breakdown");
  
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
    if (navigator.share) {
      navigator.share({
        title: 'My Construction Cost Estimate',
        text: `My estimated construction cost is ${formatCurrency(estimate.totalCost)} for a ${estimate.area} ${estimate.areaUnit} ${estimate.projectType} project.`,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      toast({
        title: "Sharing not supported",
        description: "Your browser does not support the Web Share API."
      });
    }
  };
  
  const handleUserFormSubmit = async (userData: UserFormData) => {
    setIsUserFormOpen(false);
    
    toast({
      title: "Report Generated!",
      description: "Your detailed cost estimate has been sent to your email and our team will contact you shortly.",
    });
    
    onSave();
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

  // Group features by category
  const includedFeatures = {
    core: {
      title: "Core Building Components",
      items: [
        isIncluded(estimate.civilQuality) && { name: "Quality of Construction - Civil Materials", level: estimate.civilQuality },
        isIncluded(estimate.plumbing) && { name: "Plumbing & Sanitary", level: estimate.plumbing },
        isIncluded(estimate.electrical) && { name: "Electrical Systems", level: estimate.electrical },
        isIncluded(estimate.ac) && { name: "AC & HVAC Systems", level: estimate.ac },
        isIncluded(estimate.elevator) && { name: "Vertical Transportation", level: estimate.elevator },
      ].filter(Boolean)
    },
    finishes: {
      title: "Finishes & Surfaces",
      items: [
        isIncluded(estimate.buildingEnvelope) && { name: "Building Envelope & Facade", level: estimate.buildingEnvelope },
        isIncluded(estimate.lighting) && { name: "Lighting Systems & Fixtures", level: estimate.lighting },
        isIncluded(estimate.windows) && { name: "Windows & Glazing Systems", level: estimate.windows },
        isIncluded(estimate.ceiling) && { name: "Ceiling Design & Finishes", level: estimate.ceiling },
        isIncluded(estimate.surfaces) && { name: "Wall & Floor Finishes", level: estimate.surfaces },
      ].filter(Boolean)
    },
    interiors: {
      title: "Interiors & Furnishings",
      items: [
        isIncluded(estimate.fixedFurniture) && { name: "Fixed Furniture & Cabinetry", level: estimate.fixedFurniture },
        isIncluded(estimate.looseFurniture) && { name: "Loose Furniture", level: estimate.looseFurniture },
        isIncluded(estimate.furnishings) && { name: "Furnishings & Soft Decor", level: estimate.furnishings },
        isIncluded(estimate.appliances) && { name: "Appliances & Equipment", level: estimate.appliances },
        isIncluded(estimate.artefacts) && { name: "Artefacts & Art Pieces", level: estimate.artefacts },
      ].filter(Boolean)
    }
  };
  
  return (
    <div className="space-y-6 overflow-y-auto overflow-x-hidden max-h-[80vh] px-2 pb-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-4 rounded-xl border border-vs/10 shadow-sm"
      >
        <div className="mb-4 p-2 bg-orange-50 border border-orange-100 rounded-lg text-xs text-vs-dark/80 text-center">
          <p>This is an indicative estimate. For refined analysis, <a href="#contact" className="text-vs font-medium underline">contact our team</a>.</p>
        </div>
        
        <h2 className="text-lg font-bold text-vs-dark text-center mb-3">Estimate Summary</h2>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <h3 className="text-xs text-vs-dark/70 mb-1">Location</h3>
            <p className="font-medium text-sm">{estimate.city}, {estimate.state}</p>
          </div>
          <div>
            <h3 className="text-xs text-vs-dark/70 mb-1">Project Type</h3>
            <p className="font-medium text-sm">{toSentenceCase(estimate.projectType)}</p>
          </div>
          <div>
            <h3 className="text-xs text-vs-dark/70 mb-1">Area</h3>
            <p className="font-medium text-sm">{estimate.area} {estimate.areaUnit}</p>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-3 mb-4">
          <div className="text-center">
            <h3 className="text-xs text-vs-dark/70 mb-1">Estimated Total Cost</h3>
            <p className="text-2xl font-bold text-vs">{formatCurrency(estimate.totalCost)}</p>
            <p className="text-xs text-vs-dark/60">
              ({formatCurrency(Math.round(estimate.totalCost / estimate.area)
