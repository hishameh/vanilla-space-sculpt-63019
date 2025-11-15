import React from 'react';
import { EstimatorProvider, useEstimator } from './context/EstimatorContext';

const EstimatorFlow = () => {
  const { step, estimate, handleNext, handlePrevious, updateEstimate, handleOptionChange } = useEstimator();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 mb-8">Project Details</h1>
          
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Project Area
              </label>
              <div className="flex gap-4">
                <input
                  type="number"
                  value={estimate.area}
                  onChange={(e) => updateEstimate('area', Number(e.target.value))}
                  className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-lg"
                  placeholder="1000"
                />
                <select
                  value={estimate.areaUnit}
                  onChange={(e) => updateEstimate('areaUnit', e.target.value)}
                  className="px-4 py-3 border-2 border-slate-300 rounded-lg"
                >
                  <option value="sqft">sq.ft.</option>
                  <option value="sqm">sq.m.</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Building Type
              </label>
              <select
                value={estimate.buildingType}
                onChange={(e) => updateEstimate('buildingType', e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg"
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="mixed-use">Mixed-Use</option>
              </select>
            </div>

            <button
              onClick={handleNext}
              className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    const components = [
      { key: 'civilQuality', label: 'Civil Quality' },
      { key: 'plumbing', label: 'Plumbing' },
      { key: 'electrical', label: 'Electrical' },
      { key: 'ac', label: 'Air Conditioning' },
      { key: 'lighting', label: 'Lighting' },
      { key: 'windows', label: 'Windows' },
      { key: 'surfaces', label: 'Surfaces' },
      { key: 'fixedFurniture', label: 'Fixed Furniture' },
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="sticky top-0 z-50 bg-white shadow-lg border-b-4 border-blue-600 p-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Total Estimated Cost</h2>
              <p className="text-sm text-slate-600">{estimate.area} {estimate.areaUnit}</p>
            </div>
            <div className="text-4xl font-bold text-blue-600">
              {formatCurrency(estimate.totalCost)}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Select Components</h1>
          
          <div className="space-y-6">
            {components.map((component) => {
              const currentValue = estimate[component.key as keyof typeof estimate] as string;
              
              return (
                <div key={component.key} className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-xl font-semibold mb-4">{component.label}</h3>
                  
                  <div className="grid grid-cols-4 gap-3">
                    {(['none', 'standard', 'premium', 'luxury'] as const).map((option) => (
                      <button
                        key={option}
                        onClick={() => handleOptionChange(component.key, option)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          currentValue === option
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-sm font-semibold capitalize">{option}</div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              className="px-6 py-3 text-slate-700 font-medium"
            >
              ← Previous
            </button>
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold"
            >
              View Report →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Cost Summary</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="text-5xl font-bold text-blue-600 mb-2">
              {formatCurrency(estimate.totalCost)}
            </div>
            <div className="text-slate-600">
              {formatCurrency(estimate.totalCost / estimate.area)} per {estimate.areaUnit}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between p-4 bg-slate-50 rounded-lg">
              <span className="font-medium">Construction</span>
              <span className="font-bold">{formatCurrency(estimate.categoryBreakdown.construction)}</span>
            </div>
            <div className="flex justify-between p-4 bg-blue-50 rounded-lg">
              <span className="font-medium">Core Systems</span>
              <span className="font-bold">{formatCurrency(estimate.categoryBreakdown.core)}</span>
            </div>
            <div className="flex justify-between p-4 bg-purple-50 rounded-lg">
              <span className="font-medium">Finishes</span>
              <span className="font-bold">{formatCurrency(estimate.categoryBreakdown.finishes)}</span>
            </div>
            <div className="flex justify-between p-4 bg-amber-50 rounded-lg">
              <span className="font-medium">Interiors</span>
              <span className="font-bold">{formatCurrency(estimate.categoryBreakdown.interiors)}</span>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Timeline: {estimate.timeline.totalMonths} Months</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Planning & Design</span>
                <span className="font-semibold">{estimate.timeline.phases.planning} months</span>
              </div>
              <div className="flex justify-between">
                <span>Construction</span>
                <span className="font-semibold">{estimate.timeline.phases.construction} months</span>
              </div>
              <div className="flex justify-between">
                <span>Interiors & Finishes</span>
                <span className="font-semibold">{estimate.timeline.phases.interiors} months</span>
              </div>
            </div>
          </div>

          <button
            onClick={handlePrevious}
            className="w-full mt-8 px-6 py-3 text-slate-700 font-medium border-2 border-slate-200 rounded-lg hover:bg-slate-50"
          >
            ← Back to Components
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <EstimatorProvider>
      <EstimatorFlow />
    </EstimatorProvider>
  );
}

export default App;
