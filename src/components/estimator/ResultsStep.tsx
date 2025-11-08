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
              ({formatCurrency(Math.round(estimate.totalCost / estimate.area))} per {estimate.areaUnit})
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 justify-center">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-vs text-white rounded-lg hover:bg-vs/90 transition-colors text-sm"
          >
            <Share className="w-4 h-4" />
            Share Estimate
          </button>
          <button
            onClick={() => setIsUserFormOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-vs border border-vs rounded-lg hover:bg-vs/5 transition-colors text-sm"
          >
            <Flag className="w-4 h-4" />
            Get Detailed Quote
          </button>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="breakdown" className="text-xs">
            <PieChart className="w-4 h-4 mr-1" />
            Cost Breakdown
          </TabsTrigger>
          <TabsTrigger value="timeline" className="text-xs">
            <Calendar className="w-4 h-4 mr-1" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="features" className="text-xs">
            <CheckCheck className="w-4 h-4 mr-1" />
            Included Features
          </TabsTrigger>
        </TabsList>

        <TabsContent value="breakdown" className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-4 rounded-xl border border-vs/10 shadow-sm"
          >
            <h3 className="text-sm font-semibold text-vs-dark mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Detailed Cost Structure
            </h3>
            <div className="h-[420px] overflow-hidden">
              <ImprovedCostVisualization estimate={estimate} />
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-4 rounded-xl border border-vs/10 shadow-sm"
          >
            <PhaseTimelineCost estimate={estimate} />
          </motion.div>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {Object.entries(includedFeatures).map(([key, category]) => (
              category.items.length > 0 && (
                <div key={key} className="bg-white p-4 rounded-xl border border-vs/10 shadow-sm">
                  <h3 className="text-sm font-semibold text-vs-dark mb-3">{category.title}</h3>
                  <div className="space-y-2">
                    {category.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                        <span className="text-xs text-vs-dark/80">{item.name}</span>
                        <span className="text-xs font-medium text-vs">{formatLevel(item.level)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>

      <UserInfoForm
        isOpen={isUserFormOpen}
        onClose={() => setIsUserFormOpen(false)}
        onSubmit={handleUserFormSubmit}
      />
    </div>
  );
};

export default ResultsStep;
