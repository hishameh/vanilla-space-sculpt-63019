import { useState } from "react";
import { cn } from "@/lib/utils";
import { ComponentOption } from "@/types/estimator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
  enabled?: boolean;
}

const CategorySelectionGrid = ({
  categories,
  selectedOptions,
  onOptionChange,
  sectionTitle = "Categories",
  sectionDescription = "Select your preferred options for each category."
}: CategorySelectionGridProps) => {
  const [hoveredOption, setHoveredOption] = useState<{component: string, option: string} | null>(null);

  const handleToggleChange = (key: string, value: string, isDisabled: boolean) => {
    if (isDisabled) return;
    
    // If clicking the same option that's already selected, deselect it
    if (value === selectedOptions[key]) {
      onOptionChange(key, "" as ComponentOption);
    } else if (value) {
      onOptionChange(key, value as ComponentOption);
    }
  };

  return (
    <div className="space-y-8">
      {sectionTitle && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium">{sectionTitle}</h3>
          {sectionDescription && <p className="text-sm text-muted-foreground">{sectionDescription}</p>}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        {Object.entries(categories).map(([key, category]) => {
          const isDisabled = 'optional' in category && category.optional && 'enabled' in category && !category.enabled;
          const isRequired = 'required' in category && category.required;

          return (
            <div key={key} className={cn("space-y-4", isDisabled && "opacity-50 pointer-events-none")}>
              <div className="flex items-center gap-3">
                <div className={cn("bg-vs/10 p-2 rounded-lg", isDisabled && "bg-gray-200")}>
                  {category.icon}
                </div>
                <h4 className={cn("font-medium", isDisabled && "text-gray-400")}>
                  {category.title}
                </h4>
                {isRequired && (
                  <span className="text-xs text-vs bg-vs/10 px-2 py-1 rounded-full font-medium">
                    Required
                  </span>
                )}
                {isDisabled && (
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                    Not Included
                  </span>
                )}
              </div>

              <TooltipProvider>
                <ToggleGroup
                  type="single"
                  value={selectedOptions[key] || ""}
                  onValueChange={(value) => handleToggleChange(key, value, isDisabled)}
                  className="flex flex-wrap gap-3"
                >
                  {Object.entries(category.options).map(([option, description]) => {
                    const isSelected = selectedOptions[key] === option;
                    
                    return (
                      <Tooltip key={option} delayDuration={300}>
                        <TooltipTrigger asChild>
                          <ToggleGroupItem
                            value={option}
                            disabled={isDisabled}
                            className={cn(
                              "rounded-full px-4 py-2 text-sm capitalize transition-all",
                              isSelected && !isDisabled
                                ? "bg-vs text-white"
                                : isDisabled
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-vs/10 text-vs-dark hover:bg-vs/20"
                            )}
                            onMouseEnter={() => !isDisabled && setHoveredOption({component: key, option})}
                            onMouseLeave={() => setHoveredOption(null)}
                          >
                            {option === 'basic' ? 'Standard' : option === 'mid' ? 'Premium' : 'Luxury'}
                          </ToggleGroupItem>
                        </TooltipTrigger>
                        <TooltipContent className="p-3 max-w-xs bg-white shadow-lg border border-gray-100">
                          <p className="text-xs text-gray-600">
                            {isDisabled ? "This component is not required for your project" : description}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </ToggleGroup>
              </TooltipProvider>

              {hoveredOption && hoveredOption.component === key && !isDisabled && (
                <div className="md:hidden p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">
                    {category.options[hoveredOption.option]}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySelectionGrid;
