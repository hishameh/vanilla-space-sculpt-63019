
import { ComponentOption, ProjectEstimate } from "@/types/estimator";

export const calculateCosts = (estimate: ProjectEstimate) => {
  const baseRatesPerSqm: Record<string, number> = {
    'residential': 35000,
    'commercial': 45000,
    'mixed-use': 50000,
  };
  
  const areaInSqm = estimate.areaUnit === "sqft" ? estimate.area / 10.764 : estimate.area;
  
  const componentMultipliers: Record<string, Record<ComponentOption, number>> = {
    'plumbing': { 'none': 0, 'standard': 0.0, 'premium': 0.35, 'luxury': 0.8, '': 0 },
    'ac': { 'none': 0, 'standard': 0.0, 'premium': 0.4, 'luxury': 1.0, '': 0 },
    'electrical': { 'none': 0, 'standard': 0.0, 'premium': 0.3, 'luxury': 0.7, '': 0 },
    'elevator': { 'none': 0, 'standard': 0.0, 'premium': 0.5, 'luxury': 1.2, '': 0 },
    'lighting': { 'none': 0, 'standard': 0.0, 'premium': 0.35, 'luxury': 0.8, '': 0 },
    'windows': { 'none': 0, 'standard': 0.0, 'premium': 0.4, 'luxury': 0.9, '': 0 },
    'ceiling': { 'none': 0, 'standard': 0.0, 'premium': 0.3, 'luxury': 0.7, '': 0 },
    'surfaces': { 'none': 0, 'standard': 0.0, 'premium': 0.4, 'luxury': 1.0, '': 0 },
    'fixedFurniture': { 'none': 0, 'standard': 0.0, 'premium': 0.4, 'luxury': 0.9, '': 0 },
    'looseFurniture': { 'none': 0, 'standard': 0.0, 'premium': 0.35, 'luxury': 0.8, '': 0 },
    'furnishings': { 'none': 0, 'standard': 0.0, 'premium': 0.35, 'luxury': 0.8, '': 0 },
    'appliances': { 'none': 0, 'standard': 0.0, 'premium': 0.5, 'luxury': 1.2, '': 0 }
  };
  
  const locationMultiplier = 1.0;
  
  // Compute base cost first
  const baseRate = baseRatesPerSqm[estimate.projectType] || baseRatesPerSqm.residential;
  const baseCost = areaInSqm * baseRate * locationMultiplier;

  // Define category component lists
  const coreComponents = ['plumbing', 'ac', 'electrical', 'elevator'] as const;
  const finishesComponents = ['lighting', 'windows', 'ceiling', 'surfaces'] as const;
  const interiorsComponents = ['fixedFurniture', 'looseFurniture', 'furnishings', 'appliances'] as const;

  // Category shares of base cost (used for upgrade deltas)
  const coreShare = 0.3;
  const finishesShare = 0.25;
  const interiorsShare = 0.2;

  // Base amounts per component (share distributed across components)
  const coreBaseAmount = (baseCost * coreShare) / coreComponents.length;
  const finishesBaseAmount = (baseCost * finishesShare) / finishesComponents.length;
  const interiorsBaseAmount = (baseCost * interiorsShare) / interiorsComponents.length;

  // Additional costs based on selected upgrades (basic = 0)
  const coreComponentsCost = calculateCategoryTotal(
    [...coreComponents], componentMultipliers, estimate, coreBaseAmount
  );
  
  const finishesCost = calculateCategoryTotal(
    [...finishesComponents], componentMultipliers, estimate, finishesBaseAmount
  );
  
  const interiorsCost = calculateCategoryTotal(
    [...interiorsComponents], componentMultipliers, estimate, interiorsBaseAmount
  );
  
  const totalCost = (baseCost + coreComponentsCost + finishesCost + interiorsCost) * 1.1;
  
  const planningCost = totalCost * 0.15;
  const constructionCost = totalCost * 0.6;
  const interiorsCostTotal = totalCost * 0.25;
  
  const baseMonths = Math.max(6, Math.ceil(Math.sqrt(areaInSqm) / 5));
  const projectTypeMultiplier = estimate.projectType === 'commercial' ? 1.2 : 
                              estimate.projectType === 'mixed-use' ? 1.3 : 1.0;
  
  const totalMonths = Math.ceil(baseMonths * projectTypeMultiplier);
  const planningMonths = Math.ceil(totalMonths * 0.2);
  const constructionMonths = Math.ceil(totalMonths * 0.5);
  const interiorsMonths = Math.ceil(totalMonths * 0.3);
  
  return {
    totalCost,
    phaseBreakdown: {
      planning: planningCost,
      construction: constructionCost,
      interiors: interiorsCostTotal
    },
    categoryBreakdown: {
      core: coreComponentsCost,
      finishes: finishesCost,
      interiors: interiorsCost
    },
    timeline: {
      totalMonths,
      phases: {
        planning: planningMonths,
        construction: constructionMonths,
        interiors: interiorsMonths
      }
    }
  };
};

const calculateCategoryTotal = (
  components: string[], 
  multipliers: Record<string, Record<ComponentOption, number>>,
  estimate: ProjectEstimate,
  baseAmount: number
) => {
  let total = 0;
  
  components.forEach(component => {
    const option = estimate[component as keyof ProjectEstimate] as ComponentOption;
    // If not selected, subtract baseline share; if selected, add upgrade uplift (basic = 0)
    if (!option || option === 'none') {
      total -= baseAmount;
    } else {
      const multiplier = multipliers[component]?.[option];
      if (multiplier !== undefined && multiplier > 0) {
        total += baseAmount * multiplier;
      }
    }
  });
  
  return total;
};
