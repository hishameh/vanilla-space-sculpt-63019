import React, { useState } from 'react';
import { defaultArchitectFeeRates } from '../../types/architectFee';
import { calculateArchitectFee } from '../../utils/architectFeeCalculations';
import ProjectDetails from './ProjectDetails';
import FeeBreakdown from './FeeBreakdown';

const ArchitectFeeCalculator = () => {
  const [input, setInput] = useState({
    projectName: "",
    clientName: "",
    projectType: "Individual House",
    clientType: "Individual",
    area: 1000,
    constructionCost: 5000000,
    complexity: "Standard",
    includeFFE: true,
    includeLandscape: true,
    vizPackage: "Standard",
    isRush: false,
    currency: "INR"
  });

  const fee = calculateArchitectFee(
    input.projectType,
    input.constructionCost,
    input.area,
    input.clientType,
    input.complexity,
    input.includeFFE,
    input.includeLandscape,
    input.vizPackage,
    input.isRush,
    input.currency
  );

  const handleInputChange = (field: string, value: any) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background py-4 px-4">
      <div className="container-custom max-w-5xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-3xl md:text-4xl font-display mb-2">
            Architect Fee Calculator
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
            Calculate professional fees based on your project specifications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProjectDetails 
            input={input} 
            onInputChange={handleInputChange} 
            rates={defaultArchitectFeeRates} 
          />
          <FeeBreakdown fee={fee} />
        </div>
      </div>
    </div>
  );
};

export default ArchitectFeeCalculator;
