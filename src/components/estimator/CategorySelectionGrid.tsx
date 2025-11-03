// 🏡 Corrected CategorySelectionGrid.tsx

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ComponentOption } from "@/types/estimator"; 
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CategorySelectionGridProps {
  categories: Record<string, CategoryConfig>;
  selectedOptions: Record<string, ComponentOption>; 
  onOptionChange: (component: string, option: ComponentOption) => void;
  sectionTitle?: string;
  sectionDescription?: string;
}

interface CategoryConfig {
  title: string;
  icon: React.ReactNode;
  options: Record<string, string>;
  required?: boolean;
  optional?: boolean;
  enabled?: boolean; // We rely on this for general component disablement
}

const CategorySelectionGrid = ({
  categories,
  selectedOptions,
  onOptionChange,
  sectionTitle = "Categories",
  sectionDescription = "Select your preferred options for each category."
}: CategorySelectionGridProps) => {
  const [hoveredOption, setHoveredOption] = useState<{component: string, option: string} | null>(null);

  // This handler is correct: it clears the state with ""
  const handleOptionClick = (key: string, option: string, isDisabled: boolean) => {
    if (isDisabled) return;
    
    if (selectedOptions[key] === option) {
      onOptionChange(key, ''); // ✅ Using empty string for deselect (as fixed before)
    } else {
      onOptionChange(key, option as ComponentOption);
    }
  };

  return (
    <div className="space-y-8">
      {/* ... Header Content ... */}

      <div className="grid grid-cols-1 gap-8">
        {Object.entries(categories).map(([key, category]) => {
          // 🔑 Use the 'enabled' property from the category config object (which comes from InteriorsStep props)
          const isDisabled = category.enabled === false; 
          // Note: The logic for optional/required checks is simplified here to just use `category.enabled`

          return (
            <div key={key} className={cn("space-y-4", isDisabled && "opacity-50 pointer-events-none")}>
              {/* ... Category Title and Icons ... */}

              <TooltipProvider>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(category.options).map(([option, description]) => {
                    // ✅ FINAL CHECK: isSelected relies purely on the selectedOptions prop
                    const isSelected = selectedOptions[key] === option;
                    
                    return (
                      <Tooltip key={option} delayDuration={300}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => handleOptionClick(key, option, isDisabled)}
                            disabled={isDisabled}
                            className={cn(
                              "rounded-full px-4 py-2 text-sm capitalize transition-all",
                              isSelected && !isDisabled // ✅ isSelected determines color
                                ? "bg-vs text-white"
                                : isDisabled
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-vs/10 text-vs-dark hover:bg-vs/20"
                            )}
                            onMouseEnter={() => !isDisabled && setHoveredOption({component: key, option})}
                            onMouseLeave={() => setHoveredOption(null)}
                          >
                            {option === 'basic' ? 'Standard' : option === 'mid' ? 'Premium' : 'Luxury'}
                          </button>
                        </TooltipTrigger>
                        {/* ... Tooltip Content ... */}
                      </Tooltip>
                    );
                  })}
                </div>
              </TooltipProvider>

              {/* ... Mobile Hover Content ... */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySelectionGrid;
