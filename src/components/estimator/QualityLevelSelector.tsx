import { ComponentOption } from "@/types/estimator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { X, Check, Star, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface QualityLevelSelectorProps {
  component: string;
  currentValue: ComponentOption;
  onChange: (value: ComponentOption) => void;
  disabled?: boolean;
}

const options = [
  { value: "none" as ComponentOption, label: "Not Required", icon: X, color: "text-gray-500" },
  { value: "standard" as ComponentOption, label: "Standard", icon: Check, color: "text-blue-600" },
  { value: "premium" as ComponentOption, label: "Premium", icon: Star, color: "text-purple-600" },
  { value: "luxury" as ComponentOption, label: "Luxury", icon: Crown, color: "text-amber-600" },
];

const QualityLevelSelector = ({ 
  component, 
  currentValue, 
  onChange, 
  disabled = false 
}: QualityLevelSelectorProps) => {
  return (
    <RadioGroup
      value={currentValue || "none"}
      onValueChange={(value) => onChange(value as ComponentOption)}
      disabled={disabled}
      className="grid grid-cols-2 md:grid-cols-4 gap-3"
    >
      {options.map((option) => {
        const Icon = option.icon;
        const isSelected = currentValue === option.value;
        
        return (
          <div key={option.value} className="relative">
            <RadioGroupItem
              value={option.value}
              id={`${component}-${option.value}`}
              className="peer sr-only"
            />
            <Label
              htmlFor={`${component}-${option.value}`}
              className={cn(
                "flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all",
                "hover:bg-vs/5 hover:border-vs/30",
                isSelected 
                  ? "bg-vs/10 border-vs text-vs-dark shadow-sm" 
                  : "bg-white border-gray-200 text-gray-700",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <Icon className={cn("size-6 mb-2", isSelected ? "text-vs" : option.color)} />
              <span className="text-sm font-medium text-center">{option.label}</span>
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  );
};

export default QualityLevelSelector;
