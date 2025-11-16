// Component quality options
export type ComponentOption = "none" | "standard" | "premium" | "luxury";

// Category breakdown for cost visualization
export interface CategoryBreakdown {
  construction: number;
  core: number;
  finishes: number;
  interiors: number;
}

// Phase breakdown for project timeline
export interface PhaseBreakdown {
  planning: number;
  construction: number;
  interiors: number;
}

// Timeline information
export interface Timeline {
  totalMonths: number;
  phases: {
    planning: number;
    construction: number;
    interiors: number;
  };
}

// Main project estimate interface
export interface ProjectEstimate {
  // Location
  state: string;
  city: string;
  
  // Project basics
  projectType: string;
  area: number;
  areaUnit: "sqft" | "sqm";
  complexity: number;
  selectedMaterials: string[];
  
  // Core building components
  civilQuality: ComponentOption;
  plumbing: ComponentOption;
  electrical: ComponentOption;
  ac: ComponentOption;
  elevator: ComponentOption;
  
  // Finishes
  buildingEnvelope: ComponentOption;
  lighting: ComponentOption;
  windows: ComponentOption;
  ceiling: ComponentOption;
  surfaces: ComponentOption;
  
  // Interiors
  fixedFurniture: ComponentOption;
  looseFurniture: ComponentOption;
  furnishings: ComponentOption;
  appliances: ComponentOption;
  artefacts: ComponentOption;
  
  // Calculated values
  totalCost: number;
  categoryBreakdown: CategoryBreakdown;
  phaseBreakdown: PhaseBreakdown;
  timeline: Timeline;
  
  // Architect Fee related fields (optional)
  architectFee?: {
    baseFee: number;
    ffeFee: number;
    landscapeFee: number;
    vizFee: number;
    overheadAllocation: number;
    profit: number;
    tax: number;
    totalFee: number;
    currency: string;
  };
}

// For saved estimates
export interface SavedEstimate extends ProjectEstimate {
  id: string;
  savedAt: string;
}

// User form data
export interface UserFormData {
  name: string;
  email: string;
  phone?: string;
}
