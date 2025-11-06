import { createContext, useState, useContext, useEffect, ReactNode } from "react";
// Assuming ComponentOption is imported here or in a type file
import { ProjectEstimate, initialEstimate, ComponentOption } from "@/types/estimator";
import { calculateCosts } from "@/utils/estimatorCalculations";
import { useToast } from "@/hooks/use-toast";
import { UserFormData } from "@/components/estimator/UserInfoForm";

type EstimatorContextType = {
  step: number;
  setStep: (step: number) => void;
  estimate: ProjectEstimate;
  updateEstimate: <K extends keyof ProjectEstimate>(field: K, value: ProjectEstimate[K]) => void;
  updateNestedEstimate: (category: keyof ProjectEstimate, field: string, value: any) => void;
  
  // ✅ ADDED: Dedicated handler for component options
  handleOptionChange: (field: keyof ProjectEstimate, value: ComponentOption) => void; 
  
  handleNext: () => void;
  handlePrevious: () => void;
  handleReset: () => void;
  isCalculating: boolean;
  handleSaveEstimate: () => void;
  totalSteps: number;
};

const EstimatorContext = createContext<EstimatorContextType | undefined>(undefined);

export const EstimatorProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [estimate, setEstimate] = useState<ProjectEstimate>(initialEstimate);
  const [isCalculating, setIsCalculating] = useState(false);
  
  const totalSteps = 5;

  // Recalculate costs whenever any relevant field changes
  useEffect(() => {
    if (estimate.projectType && estimate.area > 0) {
      setIsCalculating(true);
      
      try {
        const costEstimate = calculateCosts(estimate);
        setEstimate(prev => ({
          ...prev,
          totalCost: costEstimate.totalCost,
          phaseBreakdown: costEstimate.phaseBreakdown,
          categoryBreakdown: costEstimate.categoryBreakdown,
          timeline: costEstimate.timeline
        }));
      } catch (error) {
        console.error("Error calculating costs:", error);
      } finally {
        setIsCalculating(false);
      }
    }
  }, [
    estimate.projectType, estimate.area, estimate.areaUnit, estimate.city,
    estimate.plumbing, estimate.ac, estimate.electrical, estimate.elevator,
    estimate.lighting, estimate.windows, estimate.ceiling, estimate.surfaces,
    estimate.fixedFurniture, estimate.looseFurniture, estimate.furnishings, estimate.appliances,
    estimate.civilQuality, estimate.buildingEnvelope, estimate.artefacts
  ]);

  const updateEstimate = <K extends keyof ProjectEstimate>(field: K, value: ProjectEstimate[K]) => {
    setEstimate(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // ✅ FIX ADDITION: The dedicated handler for options
  const handleOptionChange = (field: keyof ProjectEstimate, value: ComponentOption) => {
    setEstimate(prev => ({
        ...prev,
        [field]: value
    }));
  };
  
  const updateNestedEstimate = (category: keyof ProjectEstimate, field: string, value: any) => {
    setEstimate(prev => {
      const categoryObj = prev[category];
      
      if (typeof categoryObj === 'object' && categoryObj !== null && !Array.isArray(categoryObj)) {
        return {
          ...prev,
          [category]: {
            ...categoryObj,
            [field]: value
          }
        };
      }
      return prev;
    });
  };

  const handleNext = () => {
    if (step < totalSteps) {
      if (step === 1 && (!estimate.state || !estimate.city)) {
        toast({ title: "Please select both state and city", variant: "destructive" });
        return;
      }
      
      if (step === 2 && !estimate.projectType) {
        toast({ title: "Please select a project type", variant: "destructive" });
        return;
      }
      
      if (step === 3 && !estimate.area) {
        toast({ title: "Please specify the area", variant: "destructive" });
        return;
      }
      
      setStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setEstimate(initialEstimate);
    setStep(1);
  };

  const handleSaveEstimate = () => {
    const formattedDate = new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    toast({
      title: "Report generated",
      description: `Your detailed estimate report has been generated on ${formattedDate}.`
    });
    
    console.log("Generating report for estimate:", estimate);
  };

  const value = {
    step,
    setStep,
    estimate,
    updateEstimate,
    updateNestedEstimate,
    handleOptionChange, // ✅ EXPOSED
    handleNext,
    handlePrevious,
    handleReset,
    isCalculating,
    handleSaveEstimate,
    totalSteps
  };

  return (
    <EstimatorContext.Provider value={value}>
      {children}
    </EstimatorContext.Provider>
  );
};

export const useEstimator = () => {
  const context = useContext(EstimatorContext);
  if (context === undefined) {
    throw new Error("useEstimator must be used within an EstimatorProvider");
  }
  return context;
};
