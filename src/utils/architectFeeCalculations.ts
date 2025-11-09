import { ArchitectFeeRates, ArchitectFeeCalculation, defaultArchitectFeeRates } from '../types/architectFee';

export function calculateArchitectFee(
  projectType: string,
  constructionCost: number,
  area: number,
  clientType: string = "Individual",
  complexity: string = "Standard",
  includeFFE: boolean = true,
  includeLandscape: boolean = true,
  vizPackage: string = "Standard",
  isRush: boolean = false,
  currency: string = "INR",
  rates: ArchitectFeeRates = defaultArchitectFeeRates
): ArchitectFeeCalculation {
  if (!constructionCost || !area) {
    return {
      baseFee: 0,
      ffeFee: 0,
      landscapeFee: 0,
      vizFee: 0,
      overheadAllocation: 0,
      profit: 0,
      tax: 0,
      totalFee: 0,
      currency
    };
  }

  const typ = rates.typologies[projectType] || rates.typologies["Individual House"];
  const clientMult = rates.clientMultipliers[clientType] || 1;
  const complexityMult = rates.complexity[complexity] || 1;
  const premiumMult = rates.premiumMultiplier;
  const rushMult = isRush ? rates.rushMultiplier : 1;

  let rawFee = typ.model === "PERCENT" ? 
    constructionCost * typ.rate : 
    area * typ.rate;

  const feeAfterMultipliers = rawFee * clientMult * complexityMult * premiumMult * rushMult;
  const baseFee = Math.max(typ.min || 0, rates.minimumFeeStudio || 0, feeAfterMultipliers);

  const ffeFee = includeFFE ? 
    Math.max(
      rates.typologies["FF&E Procurement"].min,
      constructionCost * 0.15 * rates.typologies["FF&E Procurement"].rate
    ) : 0;

  const landscapeFee = includeLandscape ? 
    Math.max(
      rates.typologies["Landscape - Detailed"].min,
      area * rates.typologies["Landscape - Detailed"].rate
    ) : 0;

  const vizFee = rates.vizPrices[vizPackage] || 0;
  const overheadAllocation = 80000 / 3;

  const subtotal = baseFee + ffeFee + landscapeFee + vizFee + overheadAllocation;
  const profit = Math.round(subtotal * rates.profitMargin);
  const tax = Math.round((subtotal + profit) * rates.taxRate);
  const totalFee = subtotal + profit + tax;

  const fx = rates.conversionRates[currency] || 1;
  const totalInCurrency = +(totalFee / fx).toFixed(2);

  return {
    baseFee,
    ffeFee,
    landscapeFee,
    vizFee,
    overheadAllocation,
    profit,
    tax,
    totalFee: totalInCurrency,
    currency
  };
}
