import { useState } from "react";
import { motion } from "framer-motion";
import { Ruler, SwitchCamera } from "lucide-react";
import { cn } from "@/lib/utils";
import AnimatedText from "@/components/AnimatedText";

interface AreaStepProps {
  area: number;O
  areaUnit: "sqft" | "sqm";
  projectType: string;
  onAreaChange: (area: number) => void;
  onUnitChange: (unit: "sqft" | "sqm") => void;
}

const AreaStep = ({ area, areaUnit, projectType, onAreaChange, onUnitChange }: AreaStepProps) => {
  // Use area prop as the initial value, ensuring synchronization
  const [inputValue, setInputValue] = useState(area > 0 ? area.toString() : "");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty string or digits only
    if (value === "" || /^\d+$/.test(value)) {
      setInputValue(value);
      // Pass the updated number to the parent
      onAreaChange(value ? parseInt(value) : 0);
    }
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setInputValue(value.toString());
    onAreaChange(value);
  };

  const toggleUnit = () => {
    const newUnit = areaUnit === "sqft" ? "sqm" : "sqft";
    onUnitChange(newUnit);
    
    // Convert area value
    if (area > 0) {
      let convertedArea = area; // Use a variable to store the result

      if (newUnit === "sqm") {
        // Convert from sqft to sqm (1 sqft ≈ 0.0929 sqm, so divide by 10.764)
        convertedArea = Math.round(area / 10.764);
      } else {
        // Convert from sqm to sqft
        convertedArea = Math.round(area * 10.764);
      }
      
      onAreaChange(convertedArea); // Update parent state with converted value
      
      // ✅ FIX APPLIED HERE: Synchronize local state with the converted value
      setInputValue(convertedArea.toString());
    }
  };

  const getPresetOptions = () => {
    const multiplier = areaUnit === "sqft" ? 1 : 0.092903; // 1 sqft = 0.092903 sqm
    
    if (projectType === "residential") {
      return [
        { label: `Small (${Math.round(1000 * multiplier)} ${areaUnit})`, value: Math.round(1000 * multiplier) },
        { label: `Medium (${Math.round(2000 * multiplier)} ${areaUnit})`, value: Math.round(2000 * multiplier) },
        { label: `Large (${Math.round(3500 * multiplier)} ${areaUnit})`, value: Math.round(3500 * multiplier) },
      ];
    } else if (projectType === "commercial") {
      return [
        { label: `Small Office (${Math.round(2000 * multiplier)} ${areaUnit})`, value: Math.round(2000 * multiplier) },
        { label: `Medium (${Math.round(5000 * multiplier)} ${areaUnit})`, value: Math.round(5000 * multiplier) },
        { label: `Large (${Math.round(10000 * multiplier)} ${areaUnit})`, value: Math.round(10000 * multiplier) },
      ];
    } else if (projectType === "mixed-use") {
      return [
        { label: `Small Project (${Math.round(5000 * multiplier)} ${areaUnit})`, value: Math.round(5000 * multiplier) },
        { label: `Medium (${Math.round(15000 * multiplier)} ${areaUnit})`, value: Math.round(15000 * multiplier) },
        { label: `Large (${Math.round(30000 * multiplier)} ${areaUnit})`, value: Math.round(30000 * multiplier) },
      ];
    }
    
    return [
      { label: `Small (${Math.round(1000 * multiplier)} ${areaUnit})`, value: Math.round(1000 * multiplier) },
      { label: `Medium (${Math.round(3000 * multiplier)} ${areaUnit})`, value: Math.round(3000 * multiplier) },
      { label: `Large (${Math.round(8000 * multiplier)} ${areaUnit})`, value: Math.round(8000 * multiplier) },
    ];
  };

  const presetOptions = getPresetOptions();
  
  const getMaxRange = () => {
    const multiplier = areaUnit === "sqft" ? 1 : 0.092903;
    
    switch (projectType) {
      case "residential": return Math.round(5000 * multiplier);
      case "commercial": return Math.round(20000 * multiplier);
      case "mixed-use": return Math.round(50000 * multiplier);
      default: return Math.round(10000 * multiplier);
    }
  };
  
  const maxRange = getMaxRange();

  return (
    <div>
      <AnimatedText 
        text="What's the approximate area of your project?"
        className="text-2xl font-display mb-8 text-center"
      />
      
      <div className="flex items-center justify-center mb-12">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className="w-full text-4xl text-center font-display border-b-2 border-primary/20 focus:border-vs outline-none py-2 bg-transparent"
            placeholder="0"
          />
          <div className="absolute right-0 bottom-3 text-[#4f090c]">
            {areaUnit}
          </div>
          
          <button 
            onClick={toggleUnit}
            className="absolute -right-12 bottom-3 text-vs hover:text-vs-light transition-colors"
            title={`Switch to ${areaUnit === "sqft" ? "square meters" : "square feet"}`}
          >
            <SwitchCamera size={20} />
          </button>
          
          <motion.div 
            className={cn(
              "absolute -bottom-2 left-0 h-1 bg-vs rounded-full",
              area > 0 ? "opacity-100" : "opacity-0"
            )}
            animate={{ 
              // Ensure the range calculation uses the maxRange correctly
              width: area > 0 ? `${Math.min((area / maxRange) * 100, 100)}%` : "0%" 
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
      
      <div className="mb-12">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[#4f090c]/70 text-sm">0 {areaUnit}</span>
          <span className="text-[#4f090c]/70 text-sm">{maxRange.toLocaleString()} {areaUnit}</span>
        </div>
        
        <input
          type="range"
          min="0"
          max={maxRange}
          // The slider value should always match the 'area' prop
          step={areaUnit === "sqft" ? "50" : "10"}
          value={area} 
          onChange={handleRangeChange}
          className="w-full h-2 bg-primary/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-vs"
        />
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4 text-[#4f090c]">Common sizes:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {presetOptions.map((option, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={cn(
                "flex flex-col items-center justify-center p-4 border rounded-xl transition-all",
                // This checks the selection status
                area === option.value 
                  ? "border-vs bg-vs/5" 
                  : "border-primary/10 hover:bg-primary/5"
              )}
              onClick={() => {
                // Clicking a preset updates both local and parent state
                setInputValue(option.value.toString());
                onAreaChange(option.value);
              }}
            >
              <Ruler className={cn(
                "mb-2 size-5",
                area === option.value ? "text-vs" : "text-primary/60"
              )} />
              <span className="text-sm">{option.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
      
      <div className="mt-8 text-center text-[#4f090c]/70 text-sm">
        <p>Enter the area or use the slider to set your project size. Toggle between square feet and square meters as needed.</p>
      </div>
    </div>
  );
};

export default AreaStep;
