import React from 'react';
import { ArchitectFeeCalculation } from '../../types/architectFee';

interface FeeBreakdownProps {
  fee: ArchitectFeeCalculation;
}

const FeeBreakdown: React.FC<FeeBreakdownProps> = ({ fee }) => {
  return (
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
  );
};

export default FeeBreakdown;
