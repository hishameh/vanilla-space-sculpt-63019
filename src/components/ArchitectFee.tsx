import React, { useState } from 'react';
import { defaultRates } from '../types/architectFee';

const ArchitectFee = () => {
  const [input, setInput] = useState({
    projectType: "Individual House",
    area: 1000,
    constructionCost: 5000000,
    complexity: "Standard",
  });

  const calculateFee = () => {
    const typ = defaultRates.typologies[input.projectType];
    const complexityMult = defaultRates.complexity[input.complexity];
    
    let baseFee = typ.model === "PERCENT" ? 
      input.constructionCost * typ.rate : 
      input.area * typ.rate;
    
    baseFee = Math.max(typ.min, baseFee * complexityMult);
    
    return {
      baseFee,
      total: baseFee * (1 + defaultRates.profitMargin)
    };
  };

  const fee = calculateFee();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Architect Fee Calculator</h1>
      
      <div className="space-y-4 max-w-md">
        <div>
          <label className="block mb-1">Project Type</label>
          <select
            value={input.projectType}
            onChange={(e) => setInput(prev => ({ ...prev, projectType: e.target.value }))}
            className="w-full p-2 border rounded"
          >
            {Object.keys(defaultRates.typologies).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Area (sqm)</label>
          <input
            type="number"
            value={input.area}
            onChange={(e) => setInput(prev => ({ ...prev, area: Number(e.target.value) }))}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Construction Cost (INR)</label>
          <input
            type="number"
            value={input.constructionCost}
            onChange={(e) => setInput(prev => ({ ...prev, constructionCost: Number(e.target.value) }))}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Complexity</label>
          <select
            value={input.complexity}
            onChange={(e) => setInput(prev => ({ ...prev, complexity: e.target.value }))}
            className="w-full p-2 border rounded"
          >
            {Object.keys(defaultRates.complexity).map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between mb-2">
            <span>Base Fee:</span>
            <span>₹{fee.baseFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total Fee:</span>
            <span>₹{fee.total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchitectFee;
