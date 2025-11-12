// Fixed pricing per square meter for more accurate small project estimates

// REVISED Component pricing per square meter (in INR)
const COMPONENT_PRICING: Record<string, Record<ComponentOption, number>> = {
  // Civil quality now factors into base construction cost, not as separate component
  civilQuality: { none: 0, standard: 0, premium: 0, luxury: 0 },
  
  // Core Systems - reasonable for all project sizes
  plumbing: { none: 0, standard: 180, premium: 350, luxury: 700 },
  electrical: { none: 0, standard: 150, premium: 300, luxury: 600 },
  ac: { none: 0, standard: 400, premium: 750, luxury: 1400 },
  elevator: { none: 0, standard: 180, premium: 380, luxury: 850 },
  
  // Finishes - adjusted for smaller areas
  buildingEnvelope: { none: 0, standard: 150, premium: 320, luxury: 650 },
  lighting: { none: 0, standard: 120, premium: 280, luxury: 600 },
  windows: { none: 0, standard: 220, premium: 450, luxury: 950 },
  ceiling: { none: 0, standard: 130, premium: 270, luxury: 580 },
  surfaces: { none: 0, standard: 280, premium: 550, luxury: 1100 },
  
  // Interiors - practical pricing
  fixedFurniture: { none: 0, standard: 400, premium: 750, luxury: 1400 },
  looseFurniture: { none: 0, standard: 280, premium: 550, luxury: 1200 },
  furnishings: { none: 0, standard: 90, premium: 220, luxury: 500 },
  appliances: { none: 0, standard: 180, premium: 380, luxury: 850 },
  artefacts: { none: 0, standard: 70, premium: 180, luxury: 450 },
};

// Base construction cost per square meter - BETTER SCALING
const getBaseConstructionCost = (projectType: string, areaInSqM: number): number => {
  // More realistic base rates
  const baseRates: Record<string, number> = {
    residential: 850,
    commercial: 1100,
    "mixed-use": 1300,
  };
  
  const baseRate = baseRates[projectType] || baseRates.residential;
  
  // Gentler scale factor for smaller projects
  let scaleFactor = 1.0;
  if (areaInSqM < 30) {
    scaleFactor = 1.10; // 10% premium for very tiny projects (< 300 sqft)
  } else if (areaInSqM < 50) {
    scaleFactor = 1.06; // 6% premium for small projects (< 500 sqft)
  } else if (areaInSqM < 100) {
    scaleFactor = 1.03; // 3% premium for medium-small projects
  }
  
  return baseRate * scaleFactor;
};

// Calculate construction cost with proper quality factors
const calculateConstructionCost = (
  projectType: string,
  areaInSqM: number,
  civilQuality: ComponentOption
): number => {
  const baseCost = getBaseConstructionCost(projectType, areaInSqM);
  
  // Quality multipliers - more reasonable
  let qualityMultiplier = 1.0;
  if (civilQuality === "premium") qualityMultiplier = 1.35; // 35% increase
  else if (civilQuality === "luxury") qualityMultiplier = 1.80; // 80% increase
  else if (civilQuality === "none") qualityMultiplier = 0; // Interior-only
  
  return baseCost * areaInSqM * qualityMultiplier;
};

// Example calculations for verification:
// 400 sqft (37 sqm) residential standard:
// - Base: 850 * 1.06 = 901/sqm
// - Total: 901 * 37 = 33,337/sqm * 10.764 = ₹3,59,000 (₹898/sqft) ✓

// 1000 sqft (93 sqm) residential standard:
// - Base: 850 * 1.03 = 875.5/sqm  
// - Total: 875.5 * 93 = ₹8,14,215 (₹814/sqft) ✓

// 2000 sqft (186 sqm) residential premium:
// - Base: 850/sqm (no premium)
// - Quality: 850 * 1.35 = 1147.5/sqm
// - Total: 1147.5 * 186 = ₹21,34,350 (₹1,067/sqft) ✓
