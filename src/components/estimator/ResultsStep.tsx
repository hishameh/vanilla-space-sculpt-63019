import React from 'react';
import { motion } from 'framer-motion';
import { Download, ArrowLeft } from 'lucide-react';
import { ProjectEstimate } from '@/types/estimator';
import { calculateArchitectFee } from '@/utils/architectFeeCalculations';
import { generateEstimatePDF } from '@/utils/pdfExport';
import { useToast } from '@/hooks/use-toast';
import ContactCTAStrategy from './ContactCTAStrategy';
import EnhancedCostChart from './EnhancedCostChart';
import PhaseTimelineCost from './PhaseTimelineCost';
import ImprovedCostVisualization from './ImprovedCostVisualization';

interface ResultsStepProps {
  estimate: ProjectEstimate;
  onReset: () => void;
  onSave: () => void;
}

const ResultsStep: React.FC<ResultsStepProps> = ({ estimate, onReset }) => {
  const { toast } = useToast();

  const handleDownloadPDF = () => {
    try {
      generateEstimatePDF(estimate);
      toast({
        title: "PDF Downloaded!",
        description: "Your estimate summary has been downloaded."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatCost = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount).replace('₹', '₹ ');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      {/* Left Column - Main Results */}
      <div className="lg:col-span-2 space-y-6">
        {/* Project Overview */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-3 gap-4 pb-4 border-b border-gray-100">
            <div>
              <h3 className="text-xs text-gray-500 mb-1">Location</h3>
              <p className="font-semibold text-sm">{estimate.city}, {estimate.state}</p>
            </div>
            <div>
              <h3 className="text-xs text-gray-500 mb-1">Project Type</h3>
              <p className="font-semibold text-sm capitalize">{estimate.projectType}</p>
            </div>
            <div>
              <h3 className="text-xs text-gray-500 mb-1">Area</h3>
              <p className="font-semibold text-sm">{estimate.area.toLocaleString()} {estimate.areaUnit}</p>
            </div>
          </div>

          {/* Construction Cost */}
          <div className="bg-gradient-to-br from-vs/10 to-vs/5 p-6 rounded-xl text-center mt-4">
            <h3 className="text-sm text-vs-dark/70 mb-2">Estimated Construction Cost</h3>
            <p className="text-4xl font-bold text-vs mb-2">
              {formatCost(estimate.totalCost)}
            </p>
            <p className="text-sm text-vs-dark/70">
              {formatCost(Math.round(estimate.totalCost / estimate.area))} per {estimate.areaUnit}
            </p>
          </div>
        </div>

        {/* Cost Visualization */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-base font-semibold text-vs-dark mb-4">Cost Distribution</h3>
          <EnhancedCostChart data={estimate.categoryBreakdown} totalCost={estimate.totalCost} />
          <div className="mt-6">
            <ImprovedCostVisualization estimate={estimate} />
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-base font-semibold text-vs-dark mb-4">Project Timeline & Phases</h3>
          <PhaseTimelineCost estimate={estimate} />
        </div>

        {/* Important Notes */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm">
          <p className="font-medium text-orange-800 mb-2">Important Notes:</p>
          <ul className="list-disc pl-4 space-y-1 text-xs text-gray-700">
            <li>This is an indicative estimate based on standard inputs and market rates for {estimate.city}</li>
            <li>Final costs may vary based on site conditions and specific requirements</li>
            <li>For an accurate detailed quote, please contact our team</li>
          </ul>
        </div>
      </div>

      {/* Right Column - Contact CTA */}
      <div className="lg:col-span-1 space-y-6">
        <ContactCTAStrategy estimate={estimate} />

        {/* Action Buttons */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
          <h4 className="text-sm font-semibold text-vs-dark mb-2">Actions</h4>
          
          <button 
            onClick={handleDownloadPDF}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-vs hover:bg-vs-light text-white font-semibold rounded-lg transition-colors text-sm"
          >
            <Download size={16} />
            Save as PDF
          </button>

          <button 
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-vs text-vs hover:bg-vs/5 font-semibold rounded-lg transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Start New Estimate
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultsStep;
