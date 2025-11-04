import { Sofa, Armchair, Flower, Tv } from "lucide-react";
import { ComponentOption } from "@/types/estimator";
import CategorySelectionGrid from "./CategorySelectionGrid";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
// Removed unused useState and useEffect imports
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
      // The 'enabled' flag is derived from the incoming prop state
      enabled: isComponentEnabled(fixedFurniture)
    },
    looseFurniture: {
      title: "Loose Furniture",
      icon: <Armchair className="size-6" />,
      options: {
