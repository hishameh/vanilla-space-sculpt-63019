import React from 'react';
import { ArchitectFeeRates } from '../../types/architectFee';

interface ProjectDetailsProps {
  input: any;
  onInputChange: (field: string, value: any) => void;
  rates: ArchitectFeeRates;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ input, onInputChange, rates }) => {
  return (
    <div className="glass-card border border-primary/5 rounded-2xl p-6">
      <h2 className="font-semibold mb-4">Project Details</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Project Name</label>
          <input
            type="text"
            value={input.projectName}
            onChange={(e) => onInputChange('projectName', e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Client Name</label>
          <input
            type="text"
            value={input.clientName}
            onChange={(e) => onInputChange('clientName', e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Project Type</label>
          <select
            value={input.projectType}
            onChange={(e) => onInputChange('projectType', e.target.value)}
            className="w-full p-2 border rounded"
          >
            {Object.keys(rates.typologies).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Client Type</label>
          <select
            value={input.clientType}
            onChange={(e) => onInputChange('clientType', e.target.value)}
            className="w-full p-2 border rounded"
          >
            {Object.keys(rates.clientMultipliers).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Area (sqm)</label>
          <input
            type="number"
            value={input.area}
            onChange={(e) => onInputChange('area', parseFloat(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Construction Cost (INR)</label>
          <input
            type="number"
            value={input.constructionCost}
            onChange={(e) => onInputChange('constructionCost', parseFloat(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Complexity</label>
          <select
            value={input.complexity}
            onChange={(e) => onInputChange('complexity', e.target.value)}
            className="w-full p-2 border rounded"
          >
            {Object.keys(rates.complexity).map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={input.includeFFE}
              onChange={(e) => onInputChange('includeFFE', e.target.checked)}
              className="mr-2"
            />
            Include FF&E
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={input.includeLandscape}
              onChange={(e) => onInputChange('includeLandscape', e.target.checked)}
              className="mr-2"
            />
            Include Landscape
          </label>
        </div>

        <div>
          <label className="block text-sm mb-1">Visualization Package</label>
          <select
            value={input.vizPackage}
            onChange={(e) => onInputChange('vizPackage', e.target.value)}
            className="w-full p-2 border rounded"
          >
            {Object.keys(rates.vizPrices).map(pkg => (
              <option key={pkg} value={pkg}>{pkg}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={input.isRush}
              onChange={(e) => onInputChange('isRush', e.target.checked)}
              className="mr-2"
            />
            Rush Project (25% premium)
          </label>
        </div>

        <div>
          <label className="block text-sm mb-1">Currency</label>
          <select
            value={input.currency}
            onChange={(e) => onInputChange('currency', e.target.value)}
            className="w-full p-2 border rounded"
          >
            {Object.keys(rates.conversionRates).map(currency => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
