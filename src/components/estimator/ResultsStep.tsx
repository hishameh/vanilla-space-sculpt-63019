import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Share2, Download, ArrowLeft } from 'lucide-react';
import { ProjectEstimate } from '@/types/estimator';
import { calculateArchitectFee } from '@/utils/architectFeeCalculations';
import { formatCurrency } from '@/utils/formatters';

interface ResultsStepProps {
  estimate: ProjectEstimate;
  onReset: () => void;
  onSave: () => void;
}

const ResultsStep: React.FC<ResultsStepProps> = ({ estimate, onReset, onSave }) => {
  const architectFee = calculateArchitectFee(
    estimate.projectType,
    estimate.totalCost,
    estimate.area,
    'Individual',
    estimate.complexity > 7 ? 'Premium' : 'Standard',
    true,
    true,
    'Standard',
    false,
    'INR'
  );

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Project Estimate',
        text: generateShareText(estimate, architectFee),
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const generateShareText = (estimate: ProjectEstimate, architectFee: any) => {
    return `Project Estimate for ${estimate.projectType}\n` +
           `Area: ${estimate.area} ${estimate.areaUnit}\n` +
           `Construction Cost: ₹${estimate.totalCost.toLocaleString()}\n` +
           `Professional Fee: ₹${architectFee.totalFee.toLocaleString()}`;
  };

  const pricingList = [
    { label: 'Civil Quality', value: estimate.civilQuality },
    { label: 'Plumbing', value: estimate.plumbing },
    { label: 'Electrical', value: estimate.electrical },
    { label: 'AC', value: estimate.ac },
    { label: 'Elevator', value: estimate.elevator },
    { label: 'Building Envelope', value: estimate.buildingEnvelope },
    { label: 'Lighting', value: estimate.lighting },
    { label: 'Windows', value: estimate.windows },
    { label: 'Ceiling', value: estimate.ceiling },
    { label: 'Surfaces', value: estimate.surfaces },
    { label: 'Fixed Furniture', value: estimate.fixedFurniture },
    { label: 'Loose Furniture', value: estimate.looseFurniture },
    { label: 'Furnishings', value: estimate.furnishings },
    { label: 'Appliances', value: estimate.appliances },
    { label: 'Artefacts', value: estimate.artefacts },
  ].filter(item => item.value !== 'none');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Project Overview */}
      <div className="glass-card border border-primary/5 rounded-2xl p-6">
        <div className="grid grid-cols-3 gap-4 pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-xs text-vs-dark/70 mb-1">Location</h3>
            <p className="font-semibold text-sm">{estimate.city}, {estimate.state}</p>
          </div>
          <div>
            <h3 className="text-xs text-vs-dark/70 mb-1">Project Type</h3>
            <p className="font-semibold text-sm">{toSentenceCase(estimate.projectType)}</p>
          </div>
          <div>
            <h3 className="text-xs text-vs-dark/70 mb-1">Area</h3>
            <p className="font-semibold text-sm">{estimate.area.toLocaleString()} {estimate.areaUnit}</p>
          </div>
        </div>

        {/* Construction Cost */}
        <div className="bg-gradient-to-br from-vs/10 to-vs/5 p-6 rounded-xl text-center mt-4">
          <h3 className="text-sm text-vs-dark/70 mb-2">Estimated Construction Cost</h3>
          <p className="text-4xl font-bold text-vs mb-2">
            {formatCurrency(estimate.totalCost)}
          </p>
          <p className="text-sm text-vs-dark/70">
            {formatCurrency(Math.round(estimate.totalCost / estimate.area))} per {estimate.areaUnit}
          </p>
        </div>

        {/* Professional Fee */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-xl text-center mt-4">
          <h3 className="text-sm text-vs-dark/70 mb-2">Professional Fee</h3>
          <p className="text-4xl font-bold text-primary mb-2">
            {formatCurrency(architectFee.totalFee)}
          </p>
          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            <div>
              <p className="text-vs-dark/70">Base Design Fee</p>
              <p className="font-semibold">{formatCurrency(architectFee.baseFee)}</p>
            </div>
            <div>
              <p className="text-vs-dark/70">FF&E Fee</p>
              <p className="font-semibold">{formatCurrency(architectFee.ffeFee)}</p>
            </div>
            <div>
              <p className="text-vs-dark/70">Landscape Fee</p>
              <p className="font-semibold">{formatCurrency(architectFee.landscapeFee)}</p>
            </div>
            <div>
              <p className="text-vs-dark/70">Visualization</p>
              <p className="font-semibold">{formatCurrency(architectFee.vizFee)}</p>
            </div>
          </div>
          <Link 
            to="/architect-fee" 
            className="text-primary hover:text-primary/80 text-sm mt-4 inline-block"
          >
            View Detailed Fee Breakdown →
          </Link>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="glass-card border border-primary/5 rounded-2xl p-6">
        <h3 className="text-base font-semibold text-vs-dark mb-4">Cost Distribution</h3>
        <div className="space-y-4">
          {Object.entries(estimate.categoryBreakdown).map(([category, amount]) => (
            <div key={category} className="relative">
              <div className="flex justify-between mb-1">
                <span className="text-sm">{toSentenceCase(category)}</span>
                <span className="text-sm font-semibold">{formatCurrency(amount)}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div 
                  className="h-full bg-vs rounded-full"
                  style={{ 
                    width: `${(amount / estimate.totalCost * 100).toFixed(1)}%` 
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="glass-card border border-primary/5 rounded-2xl p-6">
        <h3 className="text-base font-semibold text-vs-dark mb-4">Project Timeline</h3>
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="text-center">
              <p className="text-sm font-semibold">{estimate.timeline.phases.planning} months</p>
              <p className="text-xs text-vs-dark/70">Planning</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold">{estimate.timeline.phases.construction} months</p>
              <p className="text-xs text-vs-dark/70">Construction</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold">{estimate.timeline.phases.interiors} months</p>
              <p className="text-xs text-vs-dark/70">Interiors</p>
            </div>
          </div>
          <div className="h-2 bg-gray-100 rounded-full relative">
            <div className="absolute inset-0 flex">
              <div 
                className="h-full bg-blue-400 rounded-l-full"
                style={{ 
                  width: `${(estimate.timeline.phases.planning / estimate.timeline.totalMonths * 100)}%` 
                }}
              />
              <div 
                className="h-full bg-vs"
                style={{ 
                  width: `${(estimate.timeline.phases.construction / estimate.timeline.totalMonths * 100)}%` 
                }}
              />
              <div 
                className="h-full bg-green-400 rounded-r-full"
                style={{ 
                  width: `${(estimate.timeline.phases.interiors / estimate.timeline.totalMonths * 100)}%` 
                }}
              />
            </div>
          </div>
          <p className="text-center mt-4 text-sm font-semibold">
            Total Duration: {estimate.timeline.totalMonths} months
          </p>
        </div>
      </div>

      {/* Selected Components */}
      <div className="glass-card border border-primary/5 rounded-2xl p-6">
        <h3 className="text-base font-semibold text-vs-dark mb-4">Selected Components</h3>
        <div className="grid grid-cols-2 gap-4">
          {pricingList.map((item, index) => (
            <div 
              key={index}
              className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm"
            >
              <span className="text-sm">{item.label}</span>
              <span className="text-sm font-semibold capitalize">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm text-gray-700">
        <p className="font-medium text-orange-800 mb-2">Important Notes:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>This is an indicative estimate based on standard inputs and market rates for {estimate.city}</li>
          <li>Final costs may vary based on site conditions and specific requirements</li>
          <li>Professional fees are subject to scope finalization</li>
          <li>Timeline may vary based on approval processes and site conditions</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button 
          onClick={handleShare}
          className="flex items-center gap-2 px-6 py-3 bg-vs hover:bg-vs-light text-white font-semibold rounded-lg transition-colors"
        >
          <Share2 size={18} />
          Share Estimate
        </button>
        <button 
          onClick={onSave}
          className="flex items-center gap-2 px-6 py-3 bg-vs hover:bg-vs-light text-white font-semibold rounded-lg transition-colors"
        >
          <Download size={18} />
          Save as PDF
        </button>
        <button 
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 border border-vs text-vs hover:bg-vs/5 font-semibold rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
          Start New Estimate
        </button>
      </div>
    </motion.div>
  );
};

const toSentenceCase = (str: string) => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default ResultsStep;
