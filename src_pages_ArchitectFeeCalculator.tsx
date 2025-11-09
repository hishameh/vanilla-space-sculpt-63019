import React, { useState } from 'react';
import { defaultArchitectFeeRates } from '@/types/architectFee';
import { calculateArchitectFee } from '@/utils/architectFeeCalculations';

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
          {/* Input Form */}
          <div className="glass-card border border-primary/5 rounded-2xl p-6">
            <h2 className="font-semibold mb-4">Project Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Project Name</label>
                <input
                  type="text"
                  value={input.projectName}
                  onChange={(e) => handleInputChange('projectName', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Client Name</label>
                <input
                  type="text"
                  value={input.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Project Type</label>
                <select
                  value={input.projectType}
                  onChange={(e) => handleInputChange('projectType', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  {Object.keys(defaultArchitectFeeRates.typologies).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Client Type</label>
                <select
                  value={input.clientType}
                  onChange={(e) => handleInputChange('clientType', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  {Object.keys(defaultArchitectFeeRates.clientMultipliers).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Area (sqm)</label>
                <input
                  type="number"
                  value={input.area}
                  onChange={(e) => handleInputChange('area', parseFloat(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Construction Cost (INR)</label>
                <input
                  type="number"
                  value={input.constructionCost}
                  onChange={(e) => handleInputChange('constructionCost', parseFloat(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Complexity</label>
                <select
                  value={input.complexity}
                  onChange={(e) => handleInputChange('complexity', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  {Object.keys(defaultArchitectFeeRates.complexity).map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={input.includeFFE}
                    onChange={(e) => handleInputChange('includeFFE', e.target.checked)}
                    className="mr-2"
                  />
                  Include FF&E
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={input.includeLandscape}
                    onChange={(e) => handleInputChange('includeLandscape', e.target.checked)}
                    className="mr-2"
                  />
                  Include Landscape
                </label>
              </div>

              <div>
                <label className="block text-sm mb-1">Visualization Package</label>
                <select
                  value={input.vizPackage}
                  onChange={(e) => handleInputChange('vizPackage', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  {Object.keys(defaultArchitectFeeRates.vizPrices).map(pkg => (
                    <option key={pkg} value={pkg}>{pkg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={input.isRush}
                    onChange={(e) => handleInputChange('isRush', e.target.checked)}
                    className="mr-2"
                  />
                  Rush Project (25% premium)
                </label>
              </div>

              <div>
                <label className="block text-sm mb-1">Currency</label>
                <select
                  value={input.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  {Object.keys(defaultArchitectFeeRates.conversionRates).map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="glass-card border border-primary/5 rounded-2xl p-6">
            <h2 className="font-semibold mb-4">Fee Breakdown</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Base Design Fee:</span>
                <span>{fee.currency} {fee.baseFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>FF&E Fee:</span>
                <span>{fee.currency} {fee.ffeFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Landscape Fee:</span>
                <span>{fee.currency} {fee.landscapeFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Visualization Package:</span>
                <span>{fee.currency} {fee.vizFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Overhead Allocation:</span>
                <span>{fee.currency} {fee.overheadAllocation.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Profit:</span>
                <span>{fee.currency} {fee.profit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>{fee.currency} {fee.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-4">
                <span>Total Professional Fee:</span>
                <span>{fee.currency} {fee.totalFee.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              <p>* All fees are indicative and subject to final project scope and requirements</p>
              <p>* Additional services may incur extra charges</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchitectFeeCalculator;