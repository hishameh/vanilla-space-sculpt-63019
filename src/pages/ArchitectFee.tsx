import React from 'react';
import { calculateArchitectFee } from '@/utils/feeCalculations';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { EstimatorProvider, useEstimator } from '@/context/EstimatorContext';

const ArchitectFeeContent = () => {
  const { estimate } = useEstimator();

  const architectFee = calculateArchitectFee(
    estimate.projectType || 'residential',
    estimate.totalCost || 0,
    estimate.area || 1000,
    'Individual',
    estimate.complexity > 7 ? 'Premium' : 'Standard',
    true,
    true,
    'Standard',
    false,
    'INR'
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background py-4 px-4 pt-32">
        <div className="container-custom max-w-5xl mx-auto">
          <div className="text-center mb-4">
            <h1 className="text-3xl md:text-4xl font-display mb-2">
              Architect Fee Calculator
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
              Calculate professional fees based on your project details
            </p>
          </div>

          <div className="glass-card border border-primary/5 rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">Project Summary</h3>
                <div className="space-y-2 text-sm">
                  <div>Project Type: {estimate.projectType || 'Not set'}</div>
                  <div>Area: {estimate.area || 0} {estimate.areaUnit}</div>
                  <div>Estimated Cost: ₹{(estimate.totalCost || 0).toLocaleString()}</div>
                  <div>Complexity: {estimate.complexity || 'Standard'}</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Fee Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Base Design Fee:</span>
                    <span>₹{architectFee.baseFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>FF&E Fee:</span>
                    <span>₹{architectFee.ffeFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Landscape Design:</span>
                    <span>₹{architectFee.landscapeFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Visualization Package:</span>
                    <span>₹{architectFee.vizFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overhead:</span>
                    <span>₹{architectFee.overheadAllocation.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total Professional Fee:</span>
                    <span>₹{architectFee.totalFee.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const ArchitectFee = () => {
  return (
    <EstimatorProvider>
      <ArchitectFeeContent />
    </EstimatorProvider>
  );
};

export default ArchitectFee;
