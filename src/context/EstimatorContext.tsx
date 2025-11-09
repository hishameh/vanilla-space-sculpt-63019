import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { ProjectEstimate, ComponentOption } from "@/types/estimator";
import { useToast } from "@/hooks/use-toast";

interface EstimatorContextType {
  step: number;
  totalSteps: number;
  estimate: ProjectEstimate;
  isCalculating: boolean;
  setStep: (step: number) => void;
  updateEstimate: (key: keyof ProjectEstimate, value: any) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  handleReset: () => void;
  handleSaveEstimate: () => void;
  handleOptionChange: (component: string, option: ComponentOption) => void;
}

const EstimatorContext = createContext<EstimatorContextType | undefined>(undefined);

// Location-based cost multipliers
const LOCATION_MULTIPLIERS: Record<string, number> = {
  // Tier 1 Cities - High cost
  "Mumbai": 1.30,
  "Navi Mumbai": 1.25,
  "Thane": 1.22,
  "Delhi": 1.25,
  "New Delhi": 1.25,
  "Gurgaon": 1.28,
  "Noida": 1.22,
  "Bangalore": 1.20,
  "Bengaluru": 1.20,
  "Hyderabad": 1.15,
  "Chennai": 1.15,
  "Pune": 1.15,
  
  // Tier 2 Cities - Medium cost
  "Ahmedabad": 1.10,
  "Surat": 1.08,
  "Jaipur": 1.10,
  "Kochi": 1.05,
  "Coimbatore": 1.05,
  "Indore": 1.05,
  "Chandigarh": 1.12,
  "Lucknow": 1.02,
  "Visakhapatnam": 1.00,
  "Nagpur": 1.00,
  "Vadodara": 1.05,
  
  // Tier 3 and others - Base cost
  "default": 0.95
};

// Component pricing per square meter (in INR)
const COMPONENT_PRICING: Record<string, Record<ComponentOption, number>> = {
  civilQuality: { none: 0, standard: 650, premium: 1100, luxury: 2000 },
  plumbing: { none: 0, standard: 450, premium: 850, luxury: 1600 },
  electrical: { none: 0, standard: 400, premium: 750, luxury: 1500 },
  ac: { none: 0, standard: 900, premium: 1600, luxury: 3000 },
  elevator: { none: 0, standard: 450, premium: 850, luxury: 1800 },
  buildingEnvelope: { none: 0, standard: 350, premium: 700, luxury: 1400 },
  lighting: { none: 0, standard: 300, premium: 650, luxury: 1400 },
  windows: { none: 0, standard: 400, premium: 800, luxury: 1700 },
  ceiling: { none: 0, standard: 280, premium: 550, luxury: 1200 },
  surfaces: { none: 0, standard: 450, premium: 900, luxury: 2000 },
  fixedFurniture: { none: 0, standard: 850, premium: 1500, luxury: 2800 },
  looseFurniture: { none: 0, standard: 550, premium: 1100, luxury: 2500 },
  furnishings: { none: 0, standard: 200, premium: 450, luxury: 1000 },
  appliances: { none: 0, standard: 350, premium: 750, luxury: 1800 },
  artefacts: { none: 0, standard: 150, premium: 400, luxury: 1000 },
};

// Base construction cost per square meter (foundation, structure, masonry)
const BASE_CONSTRUCTION_COST: Record<string, number> = {
  residential: 1200,
  commercial: 1500,
  "mixed-use": 1800,
};

const initialEstimate: ProjectEstimate = {
  state: "",
  city: "",
  projectType: "",
  area: 0,
  areaUnit: "sqft",
  complexity: 5,
  selectedMaterials: [],
  civilQuality: "standard",
  plumbing: "standard",
  ac: "standard",
  electrical: "standard",
  elevator: "none",
  buildingEnvelope: "standard",
  lighting: "standard",
  windows: "standard",
  ceiling: "standard",
  surfaces: "standard",
  fixedFurniture: "standard",
  looseFurniture: "standard",
  furnishings: "standard",
  appliances: "standard",
  artefacts: "none",
  totalCost: 0,
  categoryBreakdown: {
    construction: 0,
    core: 0,
    finishes: 0,
    interiors: 0,
  },
  phaseBreakdown: {
    planning: 0,
    construction: 0,
    interiors: 0,
  },
  timeline: {
    totalMonths: 0,
    phases: {
      planning: 0,
      construction: 0,
      interiors: 0,
    },
  },
};

export const EstimatorProvider = ({ children }: { children: React.ReactNode }) => {
  const [step, setStep] = useState(1);
  const [estimate, setEstimate] = useState<ProjectEstimate>(initialEstimate);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();
  const totalSteps = 5;

  // Get location multiplier
  const getLocationMultiplier = useCallback((city: string): number => {
    return LOCATION_MULTIPLIERS[city] || LOCATION_MULTIPLIERS["default"];
  }, []);

  // Get project type multiplier
  const getProjectTypeMultiplier = useCallback((projectType: string, complexity: number): number => {
    let baseMultiplier = 1.0;
    
    if (projectType === "commercial") {
      baseMultiplier = 1.15;
    } else if (projectType === "mixed-use") {
      baseMultiplier = 1.25;
    }
    
    // Add complexity adjustment
    const complexityAdjustment = (complexity - 5) * 0.05;
    return baseMultiplier * (1 + complexityAdjustment);
  }, []);

  // Calculate construction cost
  const calculateConstructionCost = useCallback((
    projectType: string,
    areaInSqM: number,
    civilQuality: ComponentOption
  ): number => {
    const baseCost = BASE_CONSTRUCTION_COST[projectType] || BASE_CONSTRUCTION_COST.residential;
    
    // Quality multiplier for construction
    let qualityMultiplier = 1.0;
    if (civilQuality === "premium") qualityMultiplier = 1.6;
    else if (civilQuality === "luxury") qualityMultiplier = 2.8;
    else if (civilQuality === "none") qualityMultiplier = 0; // Interior-only projects
    
    return baseCost * areaInSqM * qualityMultiplier;
  }, []);

  // Calculate component costs
  const calculateComponentCosts = useCallback((
    estimate: ProjectEstimate,
    areaInSqM: number
  ): { core: number; finishes: number; interiors: number } => {
    const core = [
      COMPONENT_PRICING.civilQuality[estimate.civilQuality] * areaInSqM * 0.15,
      COMPONENT_PRICING.plumbing[estimate.plumbing] * areaInSqM,
      COMPONENT_PRICING.electrical[estimate.electrical] * areaInSqM,
      COMPONENT_PRICING.ac[estimate.ac] * areaInSqM,
      COMPONENT_PRICING.elevator[estimate.elevator] * areaInSqM,
    ].reduce((sum, cost) => sum + cost, 0);

    const finishes = [
      COMPONENT_PRICING.buildingEnvelope[estimate.buildingEnvelope] * areaInSqM,
      COMPONENT_PRICING.lighting[estimate.lighting] * areaInSqM,
      COMPONENT_PRICING.windows[estimate.windows] * areaInSqM,
      COMPONENT_PRICING.ceiling[estimate.ceiling] * areaInSqM,
      COMPONENT_PRICING.surfaces[estimate.surfaces] * areaInSqM,
    ].reduce((sum, cost) => sum + cost, 0);

    const interiors = [
      COMPONENT_PRICING.fixedFurniture[estimate.fixedFurniture] * areaInSqM,
      COMPONENT_PRICING.looseFurniture[estimate.looseFurniture] * areaInSqM,
      COMPONENT_PRICING.furnishings[estimate.furnishings] * areaInSqM,
      COMPONENT_PRICING.appliances[estimate.appliances] * areaInSqM,
      COMPONENT_PRICING.artefacts[estimate.artefacts] * areaInSqM,
    ].reduce((sum, cost) => sum + cost, 0);

    return { core, finishes, interiors };
  }, []);

  // Calculate timeline
  const calculateTimeline = useCallback((
    projectType: string,
    area: number,
    areaUnit: string,
    complexity: number
  ) => {
    // Convert to approximate building size units
    const sizeUnits = area / (areaUnit === "sqft" ? 1000 : 100);
    
    // Base timeline in months
    let planningMonths = 2;
    let constructionMonths = 6;
    let interiorsMonths = 2;
    
    // Project type adjustment
    if (projectType === "commercial") {
      planningMonths += 1;
      constructionMonths += 2;
      interiorsMonths += 1;
    } else if (projectType === "mixed-use") {
      planningMonths += 2;
      constructionMonths += 4;
      interiorsMonths += 1;
    }
    
    // Area adjustment (add time for larger projects)
    const areaAddition = Math.floor(sizeUnits / 2);
    constructionMonths += areaAddition;
    interiorsMonths += Math.floor(areaAddition / 2);
    
    // Complexity adjustment
    const complexityFactor = 1 + ((complexity - 5) * 0.1);
    constructionMonths = Math.ceil(constructionMonths * complexityFactor);
    interiorsMonths = Math.ceil(interiorsMonths * complexityFactor);
    
    // Ensure minimum values
    planningMonths = Math.max(1, Math.round(planningMonths));
    constructionMonths = Math.max(3, Math.round(constructionMonths));
    interiorsMonths = Math.max(1, Math.round(interiorsMonths));
    
    return {
      totalMonths: planningMonths + constructionMonths + interiorsMonths,
      phases: {
        planning: planningMonths,
        construction: constructionMonths,
        interiors: interiorsMonths,
      },
    };
  }, []);

  // Main calculation function
  const calculateFullEstimate = useCallback((currentEstimate: ProjectEstimate): ProjectEstimate => {
    // Convert area to square meters for calculation
    const areaInSqM = currentEstimate.areaUnit === "sqft" 
      ? currentEstimate.area * 0.092903 
      : currentEstimate.area;

    // 1. Calculate base construction cost
    const constructionCost = calculateConstructionCost(
      currentEstimate.projectType,
      areaInSqM,
      currentEstimate.civilQuality
    );

    // 2. Calculate component costs
    const { core, finishes, interiors } = calculateComponentCosts(currentEstimate, areaInSqM);

    // 3. Calculate subtotal before adjustments
    let subtotal = constructionCost + core + finishes + interiors;

    // 4. Apply location multiplier
    const locationMultiplier = getLocationMultiplier(currentEstimate.city);
    subtotal *= locationMultiplier;

    // 5. Apply project type and complexity multiplier
    const projectMultiplier = getProjectTypeMultiplier(
      currentEstimate.projectType,
      currentEstimate.complexity
    );
    subtotal *= projectMultiplier;

    // 6. Add professional fees and overheads (12-15% of subtotal)
    const professionalFees = subtotal * 0.13;
    
    // 7. Add contingency (8-10% of subtotal)
    const contingency = subtotal * 0.09;

    // 8. Calculate total before tax
    const totalBeforeTax = subtotal + professionalFees + contingency;

    // 9. Add GST (currently 18% on construction services, simplified)
    const gst = totalBeforeTax * 0.12; // Average effective rate

    // 10. Final total cost
    const totalCost = totalBeforeTax + gst;

    // 11. Calculate phase breakdown
    const planningCost = totalCost * 0.08;
    const constructionPhaseCost = constructionCost + (core * 0.6) + professionalFees * 0.5;
    const interiorsPhaseCost = interiors + finishes + (core * 0.4) + professionalFees * 0.5 + contingency + gst;

    // 12. Calculate timeline
    const timeline = calculateTimeline(
      currentEstimate.projectType,
      currentEstimate.area,
      currentEstimate.areaUnit,
      currentEstimate.complexity
    );

    return {
      ...currentEstimate,
      totalCost: Math.round(totalCost),
      categoryBreakdown: {
        construction: Math.round(constructionCost),
        core: Math.round(core),
        finishes: Math.round(finishes),
        interiors: Math.round(interiors),
      },
      phaseBreakdown: {
        planning: Math.round(planningCost),
        construction: Math.round(constructionPhaseCost),
        interiors: Math.round(interiorsPhaseCost),
      },
      timeline,
    };
  }, [calculateConstructionCost, calculateComponentCosts, getLocationMultiplier, getProjectTypeMultiplier, calculateTimeline]);

  // Recalculate whenever relevant fields change
  useEffect(() => {
    if (estimate.area > 0 && estimate.projectType && estimate.city) {
      const updatedEstimate = calculateFullEstimate(estimate);
      setEstimate(updatedEstimate);
    }
  }, [
    estimate.area,
    estimate.areaUnit,
    estimate.projectType,
    estimate.city,
    estimate.complexity,
    estimate.civilQuality,
    estimate.plumbing,
    estimate.electrical,
    estimate.ac,
    estimate.elevator,
    estimate.buildingEnvelope,
    estimate.lighting,
    estimate.windows,
    estimate.ceiling,
    estimate.surfaces,
    estimate.fixedFurniture,
    estimate.looseFurniture,
    estimate.furnishings,
    estimate.appliances,
    estimate.artefacts,
  ]);

  const updateEstimate = useCallback((key: keyof ProjectEstimate, value: any) => {
    setEstimate((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const handleOptionChange = useCallback((component: string, option: ComponentOption) => {
    updateEstimate(component as keyof ProjectEstimate, option);
  }, [updateEstimate]);

  const validateStep = useCallback((currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        if (!estimate.state || !estimate.city) {
          toast({
            title: "Location Required",
            description: "Please select your project location.",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 2:
        if (!estimate.projectType) {
          toast({
            title: "Project Type Required",
            description: "Please select your project type.",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 3:
        if (estimate.area <= 0) {
          toast({
            title: "Area Required",
            description: "Please enter a valid project area.",
            variant: "destructive",
          });
          return false;
        }
        // Validate reasonable area ranges
        const maxArea = estimate.areaUnit === "sqft" ? 50000 : 4645;
        if (estimate.area > maxArea) {
          toast({
            title: "Large Project",
            description: "Very large projects may require custom estimation. Please contact us for accurate pricing.",
          });
        }
        break;
      case 4:
        // Validate at least core components are selected
        const requiredComponents = [estimate.civilQuality, estimate.plumbing, estimate.electrical];
        const hasAllRequired = requiredComponents.every(c => c && c !== 'none');
        
        if (!hasAllRequired) {
          toast({
            title: "Required Components",
            description: "Please select quality levels for all required components (Civil, Plumbing, Electrical).",
            variant: "destructive",
          });
          return false;
        }
        
        // Warn about quality mismatches
        if (estimate.civilQuality === "luxury" && 
            (estimate.plumbing === "standard" || estimate.electrical === "standard")) {
          toast({
            title: "Quality Mismatch",
            description: "Consider upgrading other components to match luxury civil quality for consistency.",
          });
        }
        break;
    }
    return true;
  }, [estimate, toast]);

  const handleNext = useCallback(() => {
    if (!validateStep(step)) return;
    
    if (step < totalSteps) {
      if (step === 4) {
        // Calculate final estimate before showing results
        setIsCalculating(true);
        setTimeout(() => {
          const finalEstimate = calculateFullEstimate(estimate);
          setEstimate(finalEstimate);
          setIsCalculating(false);
          setStep(5);
        }, 1000);
      } else {
        setStep(step + 1);
      }
    }
  }, [step, estimate, validateStep, calculateFullEstimate]);

  const handlePrevious = useCallback(() => {
    if (step > 1) {
      setStep(step - 1);
    }
  }, [step]);

  const handleReset = useCallback(() => {
    setEstimate(initialEstimate);
    setStep(1);
    toast({
      title: "Estimate Reset",
      description: "Starting a new estimate.",
    });
  }, [toast]);

  const handleSaveEstimate = useCallback(() => {
    // Save to localStorage
    const savedEstimates = JSON.parse(localStorage.getItem("savedEstimates") || "[]");
    const newEstimate = {
      ...estimate,
      savedAt: new Date().toISOString(),
      id: Date.now().toString(),
    };
    savedEstimates.push(newEstimate);
    localStorage.setItem("savedEstimates", JSON.stringify(savedEstimates));
    
    toast({
      title: "Estimate Saved",
      description: "Your estimate has been saved successfully.",
    });
  }, [estimate, toast]);

  return (
    <EstimatorContext.Provider
      value={{
        step,
        totalSteps,
        estimate,
        isCalculating,
        setStep,
        updateEstimate,
        handleNext,
        handlePrevious,
        handleReset,
        handleSaveEstimate,
        handleOptionChange,
      }}
    >
      {children}
    </EstimatorContext.Provider>
  );
};

export const useEstimator = () => {
  const context = useContext(EstimatorContext);
  if (!context) {
    throw new Error("useEstimator must be used within EstimatorProvider");
  }
  return context;
};
// Add to existing imports
import { calculateArchitectFee } from '@/utils/feeCalculations';

// Inside EstimatorContext
const calculateFullEstimate = useCallback((estimate: ProjectEstimate): ProjectEstimate => {
  // ... existing calculation logic ...

  const architectFee = calculateArchitectFee(
    estimate.projectType,
    totalCost,
    estimate.area,
    'Individual',
    estimate.complexity === 'premium' ? 'Premium' : 'Standard',
    true,
    true,
    'Standard',
    false,
    'INR'
  );

  return {
    ...estimate,
    totalCost,
    categoryBreakdown,
    phaseBreakdown,
    timeline,
    architectFee // Add architect fee to the estimate
  };
}, [/* existing dependencies */]);
