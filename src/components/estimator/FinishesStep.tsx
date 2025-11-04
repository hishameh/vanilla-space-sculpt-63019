import { Lightbulb, DoorOpen, Layers, Brush } from "lucide-react";
import { ComponentOption } from "@/types/estimator";
import QualityLevelSelector from "./QualityLevelSelector";

interface FinishesStepProps {
  lighting: ComponentOption;
  windows: ComponentOption;
  ceiling: ComponentOption;
  surfaces: ComponentOption;
  onOptionChange: (component: string, option: ComponentOption) => void;
}

const FinishesStep = ({
  lighting,
  windows,
  ceiling,
  surfaces,
  onOptionChange,
}: FinishesStepProps) => {
  const finishes = [
    {
      key: "lighting",
      title: "Lighting Solutions",
      icon: <Lightbulb className="size-6" />,
      value: lighting,
      description: "Interior and exterior lighting fixtures and systems",
    },
    {
      key: "windows",
      title: "Windows & Doors",
      icon: <DoorOpen className="size-6" />,
      value: windows,
      description: "Window frames, glass, and door installations",
    },
    {
      key: "ceiling",
      title: "Ceiling Treatments",
      icon: <Layers className="size-6" />,
      value: ceiling,
      description: "False ceiling, acoustic treatments, and finishes",
    },
    {
      key: "surfaces",
      title: "Wall & Floor Surfaces",
      icon: <Brush className="size-6" />,
      value: surfaces,
      description: "Paint, wallpaper, tiles, and flooring materials",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Finishes & Surfaces</h3>
        <p className="text-sm text-muted-foreground">
          Select the quality level for finishes. All items are optional - choose "Not Required" to skip.
        </p>
      </div>

      {finishes.map((finish) => (
        <div key={finish.key} className="space-y-3 pb-6 border-b last:border-b-0">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-vs/10 text-vs">
              {finish.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-vs-dark mb-1">{finish.title}</h4>
              <p className="text-sm text-muted-foreground">{finish.description}</p>
            </div>
          </div>
          
          <QualityLevelSelector
            component={finish.key}
            currentValue={finish.value}
            onChange={(value) => onOptionChange(finish.key, value)}
          />
        </div>
      ))}
    </div>
  );
};

export default FinishesStep;
