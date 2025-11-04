import { Sofa, Armchair, Flower, Tv } from "lucide-react";
import { ComponentOption } from "@/types/estimator";
import CategorySelectionGrid from "./CategorySelectionGrid";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface InteriorsStepProps {
  fixedFurniture: ComponentOption;
  looseFurniture: ComponentOption;
  furnishings: ComponentOption;
  appliances: ComponentOption;
  onOptionChange: (component: string, option: ComponentOption) => void;
}

const InteriorsStep = ({ 
  fixedFurniture, 
  looseFurniture, 
  furnishings, 
  appliances, 
  onOptionChange 
}: InteriorsStepProps) => {

  // Function to check if a component is currently enabled (has a truthy value like "basic", "mid", "premium")
  const isComponentEnabled = (componentValue: ComponentOption): boolean => !!componentValue;

  // Handle toggling component inclusion
  const handleToggleComponent = (component: string, enabled: boolean) => {
    // Update the context state directly
    if (!enabled) {
      // If turning OFF, set the context state to empty string (deselected/not included)
      onOptionChange(component, '');
    } else {
      // If turning ON, set a default value in the context state
      onOptionChange(component, 'basic');
    }
  };

  // Define the current selected options object for easier access
  const selectedOptions = {
    fixedFurniture,
    looseFurniture,
    furnishings,
    appliances
  };

  // Define categories, deriving the 'enabled' status from the current props
  const categories = {
    fixedFurniture: {
      title: "Fixed Furniture",
      icon: <Sofa className="size-6" />,
      options: {
        basic: "Laminate finish storage units and basic built-ins",
        mid: "Veneer finish with better hardware and organization",
        premium: "Custom designed units with premium finishes and automation"
      },
      optional: true,
      enabled: isComponentEnabled(fixedFurniture)
    },
    looseFurniture: {
      title: "Loose Furniture",
      icon: <Armchair className="size-6" />,
      options: {
        basic: "Basic furniture package with standard pieces",
        mid: "Designer furniture with premium materials",
        premium: "Luxury custom-made furniture pieces"
      },
      optional: true,
      enabled: isComponentEnabled(looseFurniture)
    },
    furnishings: {
      title: "Furnishings",
      icon: <Flower className="size-6" />,
      options: {
        basic: "Basic curtains, blinds, and soft furnishings",
        mid: "Designer fabrics and custom window treatments",
        premium: "Luxury fabrics, motorized systems, and artwork"
      },
      optional: true,
      enabled: isComponentEnabled(furnishings)
    },
    appliances: {
      title: "Appliances",
      icon: <Tv className="size-6" />,
      options: {
        basic: "Standard home appliances and electronics",
        mid: "Premium branded appliances with smart features",
        premium: "High-end luxury appliances and home automation"
      },
      optional: true,
      enabled: isComponentEnabled(appliances)
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">Interior Elements</h3>
        <p className="text-muted-foreground">
          Select optional interior components and their quality levels
        </p>
      </div>

      <div className="space-y-6">
        {Object.entries(categories).map(([key, category]) => {
          const isEnabled = category.enabled;
          
          return (
            <div key={key} className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <div className="text-vs">{category.icon}</div>
                  <div>
                    <h4 className="font-semibold">{category.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {category.optional ? "Optional component" : "Required component"}
                    </p>
                  </div>
                </div>
                
                {category.optional && (
                  <div className="flex items-center gap-2">
                    <Label 
                      htmlFor={`toggle-${key}`}
                      className={cn(
                        "text-sm font-medium cursor-pointer",
                        isEnabled ? "text-vs" : "text-muted-foreground"
                      )}
                    >
                      {isEnabled ? "Included" : "Not Included"}
                    </Label>
                    <Switch
                      id={`toggle-${key}`}
                      checked={isEnabled}
                      onCheckedChange={(checked) => handleToggleComponent(key, checked)}
                      className={cn(
                        "data-[state=checked]:bg-vs",
                        !isEnabled && "bg-muted"
                      )}
                    />
                  </div>
                )}
              </div>

              {isEnabled && (
                <div className="pl-4">
                  <CategorySelectionGrid
                    categories={{ [key]: category }}
                    selectedOptions={selectedOptions}
                    onOptionChange={onOptionChange}
                    sectionTitle=""
                    sectionDescription=""
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InteriorsStep;
