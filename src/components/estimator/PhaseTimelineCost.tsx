import { ProjectEstimate } from "@/types/estimator";

interface PhaseTimelineCostProps {
  estimate: ProjectEstimate;
}

interface Phase {
  name: string;
  duration: number;
  cost: number;
  percentage: number;
  color: string;
  startMonth: number;
  endMonth: number;
}

const PhaseTimelineCost = ({ estimate }: PhaseTimelineCostProps) => {
  const formatCurrency = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value).replace('₹', '₹');
  };

  // Timeline phases with costs
  const phases: Phase[] = [
    { 
      name: "Home Design & Approval", 
      duration: estimate.timeline.phases.planning,
      cost: estimate.phaseBreakdown.planning,
      percentage: (estimate.phaseBreakdown.planning / estimate.totalCost) * 100,
      color: "#FFD700",
      startMonth: 1,
      endMonth: estimate.timeline.phases.planning
    },
    { 
      name: "Excavation", 
      duration: Math.ceil(estimate.timeline.phases.construction * 0.1),
      cost: estimate.phaseBreakdown.construction * 0.05,
      percentage: (estimate.phaseBreakdown.construction * 0.05 / estimate.totalCost) * 100,
      color: "#228B22",
      startMonth: estimate.timeline.phases.planning + 1,
      endMonth: estimate.timeline.phases.planning + Math.ceil(estimate.timeline.phases.construction * 0.1)
    },
    { 
      name: "Footing & Foundation", 
      duration: Math.ceil(estimate.timeline.phases.construction * 0.25),
      cost: estimate.categoryBreakdown.construction * 0.25,
      percentage: (estimate.categoryBreakdown.construction * 0.25 / estimate.totalCost) * 100,
      color: "#000000",
      startMonth: estimate.timeline.phases.planning + Math.ceil(estimate.timeline.phases.construction * 0.1) + 1,
      endMonth: estimate.timeline.phases.planning + Math.ceil(estimate.timeline.phases.construction * 0.35)
    },
    { 
      name: "RCC Work - Columns & Slabs", 
      duration: Math.ceil(estimate.timeline.phases.construction * 0.25),
      cost: estimate.categoryBreakdown.construction * 0.40,
      percentage: (estimate.categoryBreakdown.construction * 0.40 / estimate.totalCost) * 100,
      color: "#0000FF",
      startMonth: estimate.timeline.phases.planning + Math.ceil(estimate.timeline.phases.construction * 0.35) + 1,
      endMonth: estimate.timeline.phases.planning + Math.ceil(estimate.timeline.phases.construction * 0.60)
    },
    { 
      name: "Roof Slab", 
      duration: Math.ceil(estimate.timeline.phases.construction * 0.20),
      cost: estimate.categoryBreakdown.construction * 0.30,
      percentage: (estimate.categoryBreakdown.construction * 0.30 / estimate.totalCost) * 100,
      color: "#FF0000",
      startMonth: estimate.timeline.phases.planning + Math.ceil(estimate.timeline.phases.construction * 0.60) + 1,
      endMonth: estimate.timeline.phases.planning + Math.ceil(estimate.timeline.phases.construction * 0.80)
    },
    { 
      name: "Brickwork and Plastering", 
      duration: Math.ceil(estimate.timeline.phases.construction * 0.15),
      cost: estimate.categoryBreakdown.finishes * 0.30,
      percentage: (estimate.categoryBreakdown.finishes * 0.30 / estimate.totalCost) * 100,
      color: "#FFC0CB",
      startMonth: estimate.timeline.phases.planning + Math.ceil(estimate.timeline.phases.construction * 0.80) + 1,
      endMonth: estimate.timeline.phases.planning + estimate.timeline.phases.construction
    },
    { 
      name: "Flooring & Tiling", 
      duration: Math.ceil(estimate.timeline.phases.interiors * 0.30),
      cost: estimate.categoryBreakdown.finishes * 0.40,
      percentage: (estimate.categoryBreakdown.finishes * 0.40 / estimate.totalCost) * 100,
      color: "#800080",
      startMonth: estimate.timeline.phases.planning + estimate.timeline.phases.construction + 1,
      endMonth: estimate.timeline.phases.planning + estimate.timeline.phases.construction + Math.ceil(estimate.timeline.phases.interiors * 0.30)
    },
    { 
      name: "Electric Wiring", 
      duration: Math.ceil(estimate.timeline.phases.interiors * 0.25),
      cost: estimate.categoryBreakdown.core * 0.35,
      percentage: (estimate.categoryBreakdown.core * 0.35 / estimate.totalCost) * 100,
      color: "#FFA500",
      startMonth: estimate.timeline.phases.planning + estimate.timeline.phases.construction + Math.ceil(estimate.timeline.phases.interiors * 0.30) + 1,
      endMonth: estimate.timeline.phases.planning + estimate.timeline.phases.construction + Math.ceil(estimate.timeline.phases.interiors * 0.55)
    },
    { 
      name: "Water Supply & Plumbing", 
      duration: Math.ceil(estimate.timeline.phases.interiors * 0.30),
      cost: estimate.categoryBreakdown.core * 0.40,
      percentage: (estimate.categoryBreakdown.core * 0.40 / estimate.totalCost) * 100,
      color: "#808080",
      startMonth: estimate.timeline.phases.planning + estimate.timeline.phases.construction + Math.ceil(estimate.timeline.phases.interiors * 0.55) + 1,
      endMonth: estimate.timeline.phases.planning + estimate.timeline.phases.construction + Math.ceil(estimate.timeline.phases.interiors * 0.85)
    },
    { 
      name: "Door & Windows", 
      duration: Math.ceil(estimate.timeline.phases.interiors * 0.15),
      cost: estimate.categoryBreakdown.finishes * 0.30,
      percentage: (estimate.categoryBreakdown.finishes * 0.30 / estimate.totalCost) * 100,
      color: "#A0522D",
      startMonth: estimate.timeline.phases.planning + estimate.timeline.phases.construction + Math.ceil(estimate.timeline.phases.interiors * 0.85) + 1,
      endMonth: estimate.timeline.totalMonths
    },
  ];

  const totalDuration = estimate.timeline.totalMonths;

  return (
    <div className="space-y-3">
      {/* Overall duration banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-center">
        <p className="text-xs text-yellow-800">
          <span className="font-semibold">Overall duration:</span> {totalDuration} Months ({Math.round(totalDuration * 30)} Days)
        </p>
      </div>

      {/* Phase breakdown */}
      <div className="space-y-2">
        {phases.map((phase, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-gray-700 font-medium">{phase.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">
                  {phase.duration} {phase.duration === 1 ? 'Month' : 'Months'}
                </span>
                <span className="text-vs font-semibold">{formatCurrency(phase.cost)}</span>
              </div>
            </div>
            
            {/* Timeline bar */}
            <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
              <div 
                className="absolute top-0 h-full flex items-center px-2 text-white text-[10px] font-medium transition-all"
                style={{ 
                  backgroundColor: phase.color,
                  width: `${(phase.duration / totalDuration) * 100}%`,
                  left: `${((phase.startMonth - 1) / totalDuration) * 100}%`
                }}
              >
                <span className="truncate">
                  {phase.duration > 1 ? `${phase.duration} months` : '1 month'}
                </span>
              </div>
            </div>

            {/* Cost percentage */}
            <div className="flex justify-between text-[10px] text-gray-500">
              <span>Month {phase.startMonth} - {phase.endMonth}</span>
              <span>{phase.percentage.toFixed(1)}% of total</span>
            </div>
          </div>
        ))}
      </div>

      {/* Timeline ruler */}
      <div className="mt-4">
        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
          {Array.from({ length: Math.min(totalDuration + 1, 13) }, (_, i) => (
            <span key={i}>M{i}</span>
          ))}
        </div>
        <div className="h-1 bg-gray-200 w-full rounded-full"></div>
      </div>

      {/* Cost distribution summary */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        <div className="bg-blue-50 p-2 rounded-lg">
          <p className="text-[10px] text-blue-600 mb-0.5">Construction Phase</p>
          <p className="text-sm font-bold text-blue-900">
            {formatCurrency(estimate.phaseBreakdown.construction)}
          </p>
          <p className="text-[10px] text-blue-700">
            {((estimate.phaseBreakdown.construction / estimate.totalCost) * 100).toFixed(0)}% of total
          </p>
        </div>
        
        <div className="bg-purple-50 p-2 rounded-lg">
          <p className="text-[10px] text-purple-600 mb-0.5">Finishes & Interiors</p>
          <p className="text-sm font-bold text-purple-900">
            {formatCurrency(estimate.phaseBreakdown.interiors)}
          </p>
          <p className="text-[10px] text-purple-700">
            {((estimate.phaseBreakdown.interiors / estimate.totalCost) * 100).toFixed(0)}% of total
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhaseTimelineCost;
