import { ComponentOption } from "@/types/estimator";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface QualityLevel {
  label: string;
  value: ComponentOption;
  price: number;
  description: string;
}

interface QualityLevelSelectorProps {
  component: string;
  currentValue: ComponentOption;
  onChange: (value: ComponentOption) => void;
  required?: boolean;
}

const QualityLevelSelector = ({
  component,
  currentValue,
  onChange,
  required = false,
}: QualityLevelSelectorProps) => {
  // Define quality levels with descriptions and prices per sqm
  const qualityLevels: QualityLevel[] = [
    {
      label: "Not Required",
      value: "none",
      price: 0,
      description: "This component will not be included in the construction",
    },
    {
      label: "Standard",
      value: "standard",
      price: component === "civilQuality" ? 500 : component === "plumbing" ? 400 : component === "ac" ? 800 : component === "electrical" ? 350 : 600,
      description: "Good quality materials with professional installation. Balanced approach for most residential and commercial projects.",
    },
    {
      label: "Premium",
      value: "premium",
      price: component === "civilQuality" ? 900 : component === "plumbing" ? 700 : component === "ac" ? 1400 : component === "electrical" ? 650 : 1100,
      description: "High-grade materials and expert installation. Enhanced durability, aesthetics, and performance for quality-focused projects.",
    },
    {
      label: "Luxury",
      value: "luxury",
      price: component === "civilQuality" ? 1800 : component === "plumbing" ? 1400 : component === "ac" ? 2800 : component === "electrical" ? 1300 : 2200,
      description: "Highest quality materials with master craftsmanship. Premium finishes, cutting-edge technology, and exceptional attention to detail.",
    },
  ];

  // Filter out "Not Required" for required components
  const availableLevels = required
    ? qualityLevels.filter((level) => level.value !== "none")
    : qualityLevels;

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {availableLevels.map((level) => (
          <TooltipProvider key={level.value} delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onChange(level.value)}
                  className={`relative p-4 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md ${
                    currentValue === level.value
                      ? "border-vs bg-vs/5 shadow-sm"
                      : "border-gray-200 hover:border-vs/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{level.label}</span>
                    <Info className="size-4 text-muted-foreground" />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {level.price === 0 ? (
                      <span className="font-medium">₹0</span>
                    ) : (
                      <>
                        <span className="font-medium">₹{level.price}</span>
                        <span>/m²</span>
                      </>
                    )}
                  </div>
                  {currentValue === level.value && (
                    <div className="absolute top-2 right-2 size-2 rounded-full bg-vs" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-sm">{level.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
      {currentValue && (
        <>
          <p className="text-xs text-muted-foreground pl-1">
            Selected: <span className="font-medium">
              {qualityLevels.find(l => l.value === currentValue)?.label}
            </span>
            {qualityLevels.find(l => l.value === currentValue)?.price! > 0 && (
              <span> - ₹{qualityLevels.find(l => l.value === currentValue)?.price}/m²</span>
            )}
          </p>
          <p className="text-xs text-muted-foreground pl-1 mt-1">
            {qualityLevels.find(l => l.value === currentValue)?.description}
          </p>
        </>
      )}
    </div>
  );
};

export default QualityLevelSelector;
