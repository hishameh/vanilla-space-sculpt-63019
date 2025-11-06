
import { useRef, useEffect, useState } from "react";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
import { ProjectEstimate } from "@/types/estimator";

interface CostTreeMapProps {
  estimate: ProjectEstimate;
  showLabels?: boolean;
}

interface TreeMapItem {
  name: string;
  size?: number;
  children?: TreeMapItem[];
  color?: string;
  percentage?: number;
}

// Enhanced color scheme for better readability
const COLORS = [
  "#8889DD", "#8DC77B", "#E2CF45", "#F89C74", "#E79796", 
  "#B085F5", "#71C2CC", "#F8C12D", "#A5D297"
];

// Color legend mapping
const COLOR_CATEGORIES = {
  "Construction": "#8889DD",
  "Core Components": "#8DC77B",
  "Finishes": "#E2CF45",
  "Interiors": "#F89C74"
};

const CostTreeMap = ({ estimate, showLabels = false }: CostTreeMapProps) => {
  const [data, setData] = useState<TreeMapItem[]>([]);
  
  useEffect(() => {
    // Convert estimate data to treemap format
    const formatData = () => {
      const baseRate = estimate.totalCost / estimate.area;
      
      const isIncluded = (value: any) => value && value !== 'none' && value !== '';
      
      const coreItems: TreeMapItem[] = [];
      if (isIncluded(estimate.civilQuality)) {
        coreItems.push({ 
          name: "Civil Quality", 
          size: estimate.categoryBreakdown.core * 0.2,
          percentage: (estimate.categoryBreakdown.core * 0.2 / estimate.totalCost) * 100
        });
      }
      if (isIncluded(estimate.plumbing)) {
        coreItems.push({ 
          name: "Plumbing", 
          size: estimate.categoryBreakdown.core * 0.25,
          percentage: (estimate.categoryBreakdown.core * 0.25 / estimate.totalCost) * 100
        });
      }
      if (isIncluded(estimate.electrical)) {
        coreItems.push({ 
          name: "Electrical", 
          size: estimate.categoryBreakdown.core * 0.25,
          percentage: (estimate.categoryBreakdown.core * 0.25 / estimate.totalCost) * 100
        });
      }
      if (isIncluded(estimate.ac)) {
        coreItems.push({ 
          name: "AC Systems", 
          size: estimate.categoryBreakdown.core * 0.2,
          percentage: (estimate.categoryBreakdown.core * 0.2 / estimate.totalCost) * 100
        });
      }
      if (isIncluded(estimate.elevator)) {
        coreItems.push({ 
          name: "Elevator", 
          size: estimate.categoryBreakdown.core * 0.1,
          percentage: (estimate.categoryBreakdown.core * 0.1 / estimate.totalCost) * 100
        });
      }
      
      const finishItems: TreeMapItem[] = [];
      if (isIncluded(estimate.buildingEnvelope)) {
        finishItems.push({ 
          name: "Building Envelope", 
          size: estimate.categoryBreakdown.finishes * 0.25,
          percentage: (estimate.categoryBreakdown.finishes * 0.25 / estimate.totalCost) * 100
        });
      }
      if (isIncluded(estimate.lighting)) {
        finishItems.push({ 
          name: "Lighting", 
          size: estimate.categoryBreakdown.finishes * 0.2,
          percentage: (estimate.categoryBreakdown.finishes * 0.2 / estimate.totalCost) * 100
        });
      }
      if (isIncluded(estimate.windows)) {
        finishItems.push({ 
          name: "Windows", 
          size: estimate.categoryBreakdown.finishes * 0.25,
          percentage: (estimate.categoryBreakdown.finishes * 0.25 / estimate.totalCost) * 100
        });
      }
      if (isIncluded(estimate.ceiling)) {
        finishItems.push({ 
          name: "Ceiling", 
          size: estimate.categoryBreakdown.finishes * 0.15,
          percentage: (estimate.categoryBreakdown.finishes * 0.15 / estimate.totalCost) * 100
        });
      }
      if (isIncluded(estimate.surfaces)) {
        finishItems.push({ 
          name: "Surfaces", 
          size: estimate.categoryBreakdown.finishes * 0.15,
          percentage: (estimate.categoryBreakdown.finishes * 0.15 / estimate.totalCost) * 100
        });
      }
      
      const interiorItems: TreeMapItem[] = [];
      if (isIncluded(estimate.fixedFurniture)) {
        interiorItems.push({ 
          name: "Fixed Furniture", 
          size: estimate.categoryBreakdown.interiors * 0.3,
          percentage: (estimate.categoryBreakdown.interiors * 0.3 / estimate.totalCost) * 100
        });
      }
      if (isIncluded(estimate.looseFurniture)) {
        interiorItems.push({ 
          name: "Loose Furniture", 
          size: estimate.categoryBreakdown.interiors * 0.25,
          percentage: (estimate.categoryBreakdown.interiors * 0.25 / estimate.totalCost) * 100
        });
      }
      if (isIncluded(estimate.furnishings)) {
        interiorItems.push({ 
          name: "Furnishings", 
          size: estimate.categoryBreakdown.interiors * 0.2,
          percentage: (estimate.categoryBreakdown.interiors * 0.2 / estimate.totalCost) * 100
        });
      }
      if (isIncluded(estimate.appliances)) {
        interiorItems.push({ 
          name: "Appliances", 
          size: estimate.categoryBreakdown.interiors * 0.15,
          percentage: (estimate.categoryBreakdown.interiors * 0.15 / estimate.totalCost) * 100
        });
      }
      if (isIncluded(estimate.artefacts)) {
        interiorItems.push({ 
          name: "Artefacts", 
          size: estimate.categoryBreakdown.interiors * 0.1,
          percentage: (estimate.categoryBreakdown.interiors * 0.1 / estimate.totalCost) * 100
        });
      }
      
      // Construction phase costs
      const constructionCost = estimate.phaseBreakdown.construction;
      const constructionItems: TreeMapItem[] = [
        { 
          name: "Structure & Foundation", 
          size: constructionCost * 0.5,
          percentage: (constructionCost * 0.5 / estimate.totalCost) * 100
        },
        { 
          name: "Masonry & Walls", 
          size: constructionCost * 0.3,
          percentage: (constructionCost * 0.3 / estimate.totalCost) * 100
        },
        { 
          name: "Other Construction", 
          size: constructionCost * 0.2,
          percentage: (constructionCost * 0.2 / estimate.totalCost) * 100
        }
      ];
      
      const categories = [];
      
      if (constructionItems.length > 0) {
        categories.push({ name: "Construction", children: constructionItems, color: COLOR_CATEGORIES["Construction"] });
      }
      if (coreItems.length > 0) {
        categories.push({ name: "Core Components", children: coreItems, color: COLOR_CATEGORIES["Core Components"] });
      }
      if (finishItems.length > 0) {
        categories.push({ name: "Finishes", children: finishItems, color: COLOR_CATEGORIES["Finishes"] });
      }
      if (interiorItems.length > 0) {
        categories.push({ name: "Interiors", children: interiorItems, color: COLOR_CATEGORIES["Interiors"] });
      }
      
      return [
        {
          name: "Total Cost",
          children: categories
        }
      ];
    };
    
    setData(formatData());
  }, [estimate]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(amount).replace('₹', '₹ ');
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-md shadow-md">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p className="text-vs">{formatCurrency(payload[0].value)}</p>
          {payload[0].payload.percentage && (
            <p className="text-xs text-gray-500">
              {payload[0].payload.percentage.toFixed(1)}% of total
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="h-[400px] w-full">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={data}
              dataKey="size"
              stroke="#fff"
              fill="#8884d8"
              content={<CustomizedContent showLabels={showLabels} />}
            >
              <Tooltip content={<CustomTooltip />} />
            </Treemap>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Loading cost breakdown...
          </div>
        )}
      </div>
      
      {/* Color legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-2">
        {Object.entries(COLOR_CATEGORIES).map(([category, color]) => (
          <div key={category} className="flex items-center">
            <div 
              className="w-4 h-4 mr-2 rounded-sm" 
              style={{ backgroundColor: color }}
            ></div>
            <span className="text-xs text-gray-600">{category}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Custom treemap rectangle component
const CustomizedContent = (props: any) => {
  const { root, depth, x, y, width, height, index, name, value, showLabels } = props;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(amount).replace('₹', '₹ ');
  };
  
  return (
    <g>
        <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: depth === 1 
            ? COLOR_CATEGORIES[name as keyof typeof COLOR_CATEGORIES] || COLORS[index % COLORS.length]
            : COLORS[index % COLORS.length],
          stroke: '#fff',
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
      />
      {/* Show labels on all depths if showLabels is true */}
      {(showLabels || depth === 1) && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          fill="#fff"
          fontSize={depth === 1 ? 14 : 12}
          fontWeight={depth === 1 ? "bold" : "normal"}
          className="drop-shadow-md"
          style={{ textShadow: "0px 0px 3px rgba(0,0,0,0.7)" }}
        >
          {name}
        </text>
      )}
      {(showLabels || depth === 1) && (
        <text
          x={x + width / 2}
          y={y + height / 2 + (depth === 1 ? 20 : 16)}
          textAnchor="middle"
          fill="#fff"
          fontSize={depth === 1 ? 12 : 10}
          className="drop-shadow-md"
          style={{ textShadow: "0px 0px 3px rgba(0,0,0,0.7)" }}
        >
          {formatCurrency(value)}
        </text>
      )}
      {!showLabels && depth === 2 && width > 70 && height > 25 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            fill="#fff"
            fontSize={10}
            style={{ textShadow: "0px 0px 3px rgba(0,0,0,0.7)" }}
          >
            {name}
          </text>
          {width > 100 && (
            <text
              x={x + width / 2}
              y={y + height / 2 + 14}
              textAnchor="middle"
              fill="#fff"
              fontSize={8}
              style={{ textShadow: "0px 0px 3px rgba(0,0,0,0.7)" }}
            >
              {formatCurrency(value)}
            </text>
          )}
        </>
      )}
    </g>
  );
};

export default CostTreeMap;
