// components/ProjectTypeSelector.tsx
import React from 'react';
import { useEstimator } from '@/contexts/EstimatorContext';
import { Building2, Home, Package, Trees, Wrench } from 'lucide-react';

const ProjectTypeSelector: React.FC = () => {
  const { estimate, updateEstimate, projectTypes, handleNext, handlePrevious } = useEstimator();

  const projectTypeOptions = [
    {
      value: 'interior-only',
      icon: Package,
      title: 'Interior Design Only',
      description: 'Complete interior finishing, furniture, and styling without structural work',
      features: ['No structural work', 'Full interior design', 'Furniture & fixtures', 'Décor & styling'],
      color: 'from-purple-600 to-purple-700',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      value: 'core-shell',
      icon: Building2,
      title: 'Core & Shell',
      description: 'Structure, MEP systems, and basic building envelope',
      features: ['Full structure', 'MEP systems', 'Basic envelope', 'No interior finishes'],
      color: 'from-slate-600 to-slate-700',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600',
    },
    {
      value: 'full-project',
      icon: Home,
      title: 'Full Project',
      description: 'Complete construction from foundation to interiors (excluding landscape)',
      features: ['Full construction', 'Complete interiors', 'All systems', 'No landscaping'],
      color: 'from-blue-600 to-blue-700',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      value: 'full-landscape',
      icon: Trees,
      title: 'Full Project + Landscape',
      description: 'Everything including outdoor spaces, gardens, and hardscaping',
      features: ['Full construction', 'Complete interiors', 'All systems', 'Full landscaping'],
      color: 'from-green-600 to-green-700',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      value: 'renovation',
      icon: Wrench,
      title: 'Renovation/Remodel',
      description: 'Updating and refurbishing existing structures',
      features: ['Structure updates', 'System upgrades', 'Interior refresh', 'Space optimization'],
      color: 'from-amber-600 to-amber-700',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
  ];

  const buildingTypeOptions = [
    {
      value: 'residential',
      title: 'Residential',
      description: 'Homes, apartments, villas',
      icon: '🏠',
    },
    {
      value: 'commercial',
      title: 'Commercial',
      description: 'Offices, retail, showrooms',
      icon: '🏢',
    },
    {
      value: 'mixed-use',
      title: 'Mixed-Use',
      description: 'Combined residential & commercial',
      icon: '🏘️',
    },
  ];

  const handleProjectTypeChange = (value: string) => {
    updateEstimate('projectType', value);
  };

  const handleBuildingTypeChange = (value: string) => {
    updateEstimate('buildingType', value);
  };

  const canProceed = estimate.projectType && estimate.buildingType && estimate.area > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8" style={{ cursor: 'default' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            What type of project are you planning?
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Choose the scope of work that best matches your project requirements
          </p>
        </div>

        {/* Project Type Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Project Scope</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectTypeOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = estimate.projectType === option.value;
              
              return (
                <button
                  key={option.value}
                  onClick={() => handleProjectTypeChange(option.value)}
                  className={`
                    relative p-6 rounded-2xl border-2 transition-all duration-300 text-left
                    ${isSelected 
                      ? 'border-blue-600 bg-white shadow-2xl scale-105' 
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg'
                    }
                  `}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Selected indicator */}
                  {isSelected && (
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`w-16 h-16 ${option.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-8 h-8 ${option.iconColor}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{option.title}</h3>
                  <p className="text-sm text-slate-600 mb-4">{option.description}</p>

                  {/* Features */}
                  <div className="space-y-2">
                    {option.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span className="text-xs text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Building Type Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Building Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {buildingTypeOptions.map((option) => {
              const isSelected = estimate.buildingType === option.value;
              
              return (
                <button
                  key={option.value}
                  onClick={() => handleBuildingTypeChange(option.value)}
                  className={`
                    p-6 rounded-xl border-2 transition-all duration-200 text-center
                    ${isSelected 
                      ? 'border-blue-600 bg-blue-50 shadow-lg scale-105' 
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                    }
                  `}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="text-4xl mb-3">{option.icon}</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{option.title}</h3>
                  <p className="text-sm text-slate-600">{option.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Area Input */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Project Area</h2>
          <div className="bg-white rounded-xl border-2 border-slate-200 p-8 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Area Size
                </label>
                <input
                  type="number"
                  value={estimate.area}
                  onChange={(e) => updateEstimate('area', Number(e.target.value))}
                  min="1"
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg text-lg font-semibold focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="1000"
                  style={{ cursor: 'text' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Unit
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => updateEstimate('areaUnit', 'sqft')}
                    className={`
                      px-4 py-3 rounded-lg border-2 font-semibold transition-all duration-200
                      ${estimate.areaUnit === 'sqft' 
                        ? 'border-blue-600 bg-blue-50 text-blue-700' 
                        : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                      }
                    `}
                    style={{ cursor: 'pointer' }}
                  >
                    sq.ft.
                  </button>
                  <button
                    onClick={() => updateEstimate('areaUnit', 'sqm')}
                    className={`
                      px-4 py-3 rounded-lg border-2 font-semibold transition-all duration-200
                      ${estimate.areaUnit === 'sqm' 
                        ? 'border-blue-600 bg-blue-50 text-blue-700' 
                        : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                      }
                    `}
                    style={{ cursor: 'pointer' }}
                  >
                    sq.m.
                  </button>
                </div>
              </div>
            </div>

            {estimate.area > 0 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-900 font-medium">
                  Project Size: {estimate.area} {estimate.areaUnit === 'sqft' ? 'square feet' : 'square meters'}
                  {estimate.areaUnit === 'sqft' && (
                    <span className="text-blue-700 ml-2">
                      (≈ {(estimate.area * 0.092903).toFixed(2)} sq.m.)
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Location (Optional) */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Location (Optional)</h2>
          <div className="bg-white rounded-xl border-2 border-slate-200 p-8 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  State
                </label>
                <input
                  type="text"
                  value={estimate.state}
                  onChange={(e) => updateEstimate('state', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., Karnataka"
                  style={{ cursor: 'text' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  City
                </label>
                <input
                  type="text"
                  value={estimate.city}
                  onChange={(e) => updateEstimate('city', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., Bangalore"
                  style={{ cursor: 'text' }}
                />
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-4">
              Location helps us provide more accurate estimates based on local material and labor costs
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-slate-200">
          <button
            onClick={handlePrevious}
            className="px-6 py-3 text-slate-700 hover:text-slate-900 font-medium transition-colors duration-200"
            style={{ cursor: 'pointer' }}
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`
              px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg
              ${canProceed
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }
            `}
            style={{ cursor: canProceed ? 'pointer' : 'not-allowed' }}
          >
            Continue to Components →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectTypeSelector;
