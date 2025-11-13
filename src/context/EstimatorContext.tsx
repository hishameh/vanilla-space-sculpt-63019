import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProjectEstimate, ComponentOption } from '@/types/estimator';

// Component pricing per square meter (in INR)
const COMPONENT_PRICING: Record<string, Record<ComponentOption, number>> = {
  civilQuality: { none: 0, standard: 0, premium: 0, luxury: 0 },
  plumbing: { none: 0, standard: 180, premium: 350, luxury: 700 },
  electrical: { none: 0, standard: 150, premium: 300, luxury: 600 },
  ac: { none: 0, standard: 400, premium: 750, luxury: 1400 },
  elevator: { none: 0, standard: 180, premium: 380, luxury: 850 },
  buildingEnvelope: { none: 0, standard: 150, premium: 320, luxury: 650 },
  lighting: { none: 0, standard: 120, premium: 280, luxury: 600 },
  windows: { none: 0, standard: 220, premium: 450, luxury: 950 },
  ceiling: { none: 0, standard: 130, premium: 270, luxury: 580 },
  surfaces: { none: 0, standard: 280, premium: 550, luxury: 1100 },
  fixedFurniture: { none: 0, standard: 400, premium: 750, luxury: 1400 },
  looseFurniture: { none: 0, standard: 280, premium: 550, luxury: 1200 },
  furnishings: { none: 0, standard: 90, premium: 220, luxury: 500 },
  appliances: { none: 0, standard: 180, premium: 380, luxury: 850 },
  artefacts: { none: 0, standard: 70, premium: 180, luxury: 450 },
};

const getBaseConstructionCost = (projectType: string, areaInSqM: number): number => {
  const baseRates: Record<string, number> = {
    residential: 850,
    commercial: 1100,
    "mixed-use": 1300,
  };
  
  const baseRate = baseRates[projectType] || baseRates.residential;
  
  let scaleFactor = 1.0;
  if (areaInSqM < 30) {
    scaleFactor = 1.10;
  } else if (areaInSqM < 50) {
    scaleFactor = 1.06;
  } else if (areaInSqM < 100) {
    scaleFactor = 1.03;
  }
  
  return baseRate * scaleFactor;
};

const calculateConstructionCost = (
  projectType: string,
  areaInSqM: number,
  civilQuality: ComponentOption
): number => {
  const baseCost = getBaseConstructionCost(projectType, areaInSqM);
  
  let qualityMultiplier = 1.0;
  if (civilQuality === "premium") qualityMultiplier = 1.35;
  else if (civilQuality === "luxury") qualityMultiplier = 1.80;
  else if (civilQuality === "none") qualityMultiplier = 0;
  
  return baseCost * areaInSqM * qualityMultiplier;
};

interface EstimatorContextType {
  step: number;
  totalSteps: number;
  estimate: ProjectEstimate;
  isCalculating: boolean;
  updateEstimate: (field: keyof ProjectEstimate, value: any) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  handleReset: () => void;
  handleSaveEstimate: () => void;
  handleOptionChange: (component: string, option: ComponentOption) => void;
  setStep: (step: number) => void;
}

const EstimatorContext = createContext<EstimatorContextType | undefined>(undefined);

export const useEstimator = () => {
  const context = useContext(EstimatorContext);
  if (!context) {
    throw new Error('useEstimator must be used within EstimatorProvider');
  }
  return context;
};

const initialEstimate: ProjectEstimate = {
  state: '',
  city: '',
  projectType: 'residential',
  area: 1000,
  areaUnit: 'sqft',
  complexity: 5,
  selectedMaterials: [],
  civilQuality: 'standard',
  plumbing: 'standard',
  electrical: 'standard',
  ac: 'standard',
  elevator: 'none',
  buildingEnvelope: 'standard',
  lighting: 'standard',
  windows: 'standard',
  ceiling: 'standard',
  surfaces: 'standard',
  fixedFurniture: 'standard',
  looseFurniture: 'standard',
  furnishings: 'standard',
  appliances: 'standard',
  artefacts: 'none',
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

export const EstimatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [step, setStep] = useState(1);
  const [estimate, setEstimate] = useState<ProjectEstimate>(initialEstimate);
  const [isCalculating, setIsCalculating] = useState(false);
  const totalSteps = 5;

  const updateEstimate = (field: keyof ProjectEstimate, value: any) => {
    setEstimate(prev => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (component: string, option: ComponentOption) => {
    updateEstimate(component as keyof ProjectEstimate, option);
  };

  const calculateEstimate = () => {
    const areaInSqM = estimate.areaUnit === 'sqft' 
      ? estimate.area * 0.092903 
      : estimate.area;

    const constructionCost = calculateConstructionCost(
      estimate.projectType,
      areaInSqM,
      estimate.civilQuality
    );

    let coreCost = 0;
    let finishesCost = 0;
    let interiorsCost = 0;

    // Calculate component costs
    const coreComponents = ['plumbing', 'electrical', 'ac', 'elevator'];
    const finishComponents = ['buildingEnvelope', 'lighting', 'windows', 'ceiling', 'surfaces'];
    const interiorComponents = ['fixedFurniture', 'looseFurniture', 'furnishings', 'appliances', 'artefacts'];

    coreComponents.forEach(comp => {
      const value = estimate[comp as keyof ProjectEstimate] as ComponentOption;
      coreCost += (COMPONENT_PRICING[comp]?.[value] || 0) * areaInSqM;
    });

    finishComponents.forEach(comp => {
      const value = estimate[comp as keyof ProjectEstimate] as ComponentOption;
      finishesCost += (COMPONENT_PRICING[comp]?.[value] || 0) * areaInSqM;
    });

    interiorComponents.forEach(comp => {
      const value = estimate[comp as keyof ProjectEstimate] as ComponentOption;
      interiorsCost += (COMPONENT_PRICING[comp]?.[value] || 0) * areaInSqM;
    });

    const totalCost = constructionCost + coreCost + finishesCost + interiorsCost;

    // Calculate timeline
    const baseMonths = estimate.projectType === 'residential' ? 8 : 10;
    const planningMonths = Math.ceil(baseMonths * 0.2);
    const constructionMonths = Math.ceil(baseMonths * 0.5);
    const interiorsMonths = Math.ceil(baseMonths * 0.3);

    setEstimate(prev => ({
      ...prev,
      totalCost,
      categoryBreakdown: {
        construction: constructionCost,
        core: coreCost,
        finishes: finishesCost,
        interiors: interiorsCost,
      },
      phaseBreakdown: {
        planning: totalCost * 0.1,
        construction: constructionCost + coreCost,
        interiors: finishesCost + interiorsCost,
      },
      timeline: {
        totalMonths: planningMonths + constructionMonths + interiorsMonths,
        phases: {
          planning: planningMonths,
          construction: constructionMonths,
          interiors: interiorsMonths,
        },
      },
    }));
  };

  useEffect(() => {
    if (step === 5) {
      calculateEstimate();
    }
  }, [step]);

  const handleNext = () => {
    if (step < totalSteps) {
      setIsCalculating(true);
      setTimeout(() => {
        setStep(step + 1);
        setIsCalculating(false);
      }, 300);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleReset = () => {
    setEstimate(initialEstimate);
    setStep(1);
  };

  const handleSaveEstimate = () => {
    console.log('Saving estimate:', estimate);
  };

  return (
    <EstimatorContext.Provider
      value={{
        step,
        totalSteps,
        estimate,
        isCalculating,
        updateEstimate,
        handleNext,
        handlePrevious,
        handleReset,
        handleSaveEstimate,
        handleOptionChange,
        setStep,
      }}
    >
      {children}
    </EstimatorContext.Provider>
  );
};
