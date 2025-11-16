import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ComponentOption = 'none' | 'standard' | 'premium' | 'luxury';

const COMPONENT_PRICING: Record<string, Record<ComponentOption, number>> = {
  civilQuality: { none: 0, standard: 850, premium: 1150, luxury: 1530 },
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
  landscape: { none: 0, standard: 120, premium: 280, luxury: 650 },
};

const COMPONENT_DETAILS: Record<string, Record<ComponentOption, string[]>> = {
  civilQuality: {
    none: [],
    standard: ['Basic foundation', 'Standard bricks', 'Regular cement'],
    premium: ['Enhanced foundation', 'Premium bricks', 'High-grade cement'],
    luxury: ['Premium foundation', 'Luxury blocks', 'Superior cement']
  },
  plumbing: {
    none: [],
    standard: ['CPVC pipes', 'Standard fixtures'],
    premium: ['Premium CPVC', 'Mid-range fixtures'],
    luxury: ['Copper pipes', 'Luxury fixtures']
  },
  electrical: {
    none: [],
    standard: ['Standard wiring', 'Basic switches'],
    premium: ['Premium wiring', 'Modular switches'],
    luxury: ['Armoured cables', 'Designer switches']
  },
  ac: { none: [], standard: ['Split AC'], premium: ['VRF ready'], luxury: ['VRF system'] },
  elevator: { none: [], standard: ['Basic shaft'], premium: ['Enhanced shaft'], luxury: ['Premium shaft'] },
  buildingEnvelope: { none: [], standard: ['Basic paint'], premium: ['Textured exterior'], luxury: ['Designer facade'] },
  lighting: { none: [], standard: ['LED fixtures'], premium: ['Designer LED'], luxury: ['Premium fixtures'] },
  windows: { none: [], standard: ['UPVC windows'], premium: ['Premium UPVC'], luxury: ['Aluminium'] },
  ceiling: { none: [], standard: ['Gypsum board'], premium: ['Designer gypsum'], luxury: ['Premium materials'] },
  surfaces: { none: [], standard: ['Vitrified tiles'], premium: ['Premium tiles'], luxury: ['Imported tiles'] },
  fixedFurniture: { none: [], standard: ['Plywood cabinets'], premium: ['BWR plywood'], luxury: ['Marine plywood'] },
  looseFurniture: { none: [], standard: ['Essential furniture'], premium: ['Designer furniture'], luxury: ['Premium furniture'] },
  furnishings: { none: [], standard: ['Basic curtains'], premium: ['Designer curtains'], luxury: ['Premium drapes'] },
  appliances: { none: [], standard: ['Basic appliances'], premium: ['Mid-range'], luxury: ['Premium'] },
  artefacts: { none: [], standard: ['Basic decor'], premium: ['Designer decor'], luxury: ['Premium decor'] },
  landscape: { none: [], standard: ['Basic landscaping'], premium: ['Designer landscape'], luxury: ['Premium landscape'] },
};

export const PROJECT_TYPES = {
  'interior-only': {
    label: 'Interior Only',
    description: 'Interior design and furnishing without construction',
    excludes: ['civilQuality', 'buildingEnvelope', 'landscape'],
    baseRate: 0,
  },
  'core-shell': {
    label: 'Core & Shell',
    description: 'Basic construction with MEP systems',
    excludes: ['fixedFurniture', 'looseFurniture', 'furnishings', 'appliances', 'artefacts', 'landscape'],
    baseRate: 850,
  },
  'full-project': {
    label: 'Full Project',
    description: 'Complete construction and interiors',
    excludes: ['landscape'],
    baseRate: 850,
  },
  'full-landscape': {
    label: 'Full Project with Landscape',
    description: 'Everything including outdoor spaces',
    excludes: [],
    baseRate: 850,
  },
  'renovation': {
    label: 'Renovation',
    description: 'Renovation and refurbishment of existing spaces',
    excludes: ['civilQuality', 'buildingEnvelope'],
    baseRate: 600,
  },
};

interface ProjectEstimate {
  state: string;
  city: string;
  projectType: string;
  buildingType: string;
  area: number;
  areaUnit: string;
  civilQuality: ComponentOption;
  plumbing: ComponentOption;
  electrical: ComponentOption;
  ac: ComponentOption;
  elevator: ComponentOption;
  buildingEnvelope: ComponentOption;
  lighting: ComponentOption;
  windows: ComponentOption;
  ceiling: ComponentOption;
  surfaces: ComponentOption;
  fixedFurniture: ComponentOption;
  looseFurniture: ComponentOption;
  furnishings: ComponentOption;
  appliances: ComponentOption;
  artefacts: ComponentOption;
  landscape: ComponentOption;
  totalCost: number;
  componentCosts: Record<string, number>;
  categoryBreakdown: {
    construction: number;
    core: number;
    finishes: number;
    interiors: number;
    landscape: number;
  };
  phaseBreakdown: {
    planning: number;
    construction: number;
    interiors: number;
  };
  timeline: {
    totalMonths: number;
    phases: {
      planning: number;
      construction: number;
      interiors: number;
    };
  };
}

interface EstimatorContextType {
  step: number;
  totalSteps: number;
  estimate: ProjectEstimate;
  isCalculating: boolean;
  componentDetails: typeof COMPONENT_DETAILS;
  projectTypes: typeof PROJECT_TYPES;
  updateEstimate: (field: keyof ProjectEstimate, value: any) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  handleReset: () => void;
  handleSaveEstimate: () => void;
  handleOptionChange: (component: string, option: ComponentOption) => void;
  setStep: (step: number) => void;
  calculateRealTimeCost: () => void;
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
  projectType: 'full-project',
  buildingType: 'residential',
  area: 1000,
  areaUnit: 'sqft',
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
  landscape: 'none',
  totalCost: 0,
  categoryBreakdown: { construction: 0, core: 0, finishes: 0, interiors: 0, landscape: 0 },
  phaseBreakdown: { planning: 0, construction: 0, interiors: 0 },
  timeline: { totalMonths: 0, phases: { planning: 0, construction: 0, interiors: 0 } },
  componentCosts: {},
};

export const EstimatorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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

  const calculateRealTimeCost = () => {
    const areaInSqM = estimate.areaUnit === 'sqft' ? estimate.area * 0.092903 : estimate.area;
    const projectConfig = PROJECT_TYPES[estimate.projectType as keyof typeof PROJECT_TYPES];
    
    let totalCost = 0;
    const componentCosts: Record<string, number> = {};
    let constructionCost = 0, coreCost = 0, finishesCost = 0, interiorsCost = 0, landscapeCost = 0;

    Object.keys(COMPONENT_PRICING).forEach(comp => {
      if (!projectConfig?.excludes.includes(comp)) {
        const value = estimate[comp as keyof ProjectEstimate] as ComponentOption;
        const cost = (COMPONENT_PRICING[comp]?.[value] || 0) * areaInSqM;
        
        if (cost > 0) {
          componentCosts[comp] = cost;
          totalCost += cost;
          if (comp === 'civilQuality') constructionCost += cost;
          else if (['plumbing', 'electrical', 'ac', 'elevator'].includes(comp)) coreCost += cost;
          else if (['buildingEnvelope', 'lighting', 'windows', 'ceiling', 'surfaces'].includes(comp)) finishesCost += cost;
          else if (['fixedFurniture', 'looseFurniture', 'furnishings', 'appliances', 'artefacts'].includes(comp)) interiorsCost += cost;
          else if (comp === 'landscape') landscapeCost += cost;
        }
      }
    });

    const baseMonths = 8;
    const planningMonths = Math.ceil(baseMonths * 0.15);
    const constructionMonths = Math.ceil(baseMonths * 0.55);
    const interiorsMonths = Math.ceil(baseMonths * 0.30);

    setEstimate(prev => ({
      ...prev,
      totalCost,
      componentCosts,
      categoryBreakdown: { construction: constructionCost, core: coreCost, finishes: finishesCost, interiors: interiorsCost, landscape: landscapeCost },
      phaseBreakdown: { planning: totalCost * 0.10, construction: constructionCost + coreCost, interiors: finishesCost + interiorsCost + landscapeCost },
      timeline: { totalMonths: planningMonths + constructionMonths + interiorsMonths, phases: { planning: planningMonths, construction: constructionMonths, interiors: interiorsMonths } },
    }));
  };

  useEffect(() => {
    if (step >= 2) calculateRealTimeCost();
  }, [estimate.area, estimate.civilQuality, estimate.plumbing, step]);

  const handleNext = () => { if (step < totalSteps) setStep(step + 1); };
  const handlePrevious = () => { if (step > 1) setStep(step - 1); };
  const handleReset = () => { setEstimate(initialEstimate); setStep(1); };
  const handleSaveEstimate = () => { console.log('Saving estimate:', estimate); };

  return (
    <EstimatorContext.Provider value={{
      step, totalSteps, estimate, isCalculating, componentDetails: COMPONENT_DETAILS,
      projectTypes: PROJECT_TYPES, updateEstimate, handleNext, handlePrevious, handleReset,
      handleSaveEstimate, handleOptionChange, setStep, calculateRealTimeCost,
    }}>
      {children}
    </EstimatorContext.Provider>
  );
};
