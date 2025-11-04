import { Droplet, Wind, Zap, ArrowUp } from "lucide-react";
import { ComponentOption } from "@/types/estimator";
import QualityLevelSelector from "./QualityLevelSelector";
import { Badge } from "@/components/ui/badge";

interface ComponentsStepProps {
  plumbing: ComponentOption;
  ac: ComponentOption;
  electrical: ComponentOption;
  elevator: ComponentOption;
  onOptionChange: (component: string, option: ComponentOption) => void;
}

const ComponentsStep = ({
  plumbing,
  ac,
  electrical,
  elevator,
  onOptionChange,
}: ComponentsStepProps) => {
  const components = [
    {
      key: "plumbing",
      title: "Plumbing Fixtures & Sanitary",
      icon: <Droplet className="size-6" />,
      value: plumbing,
      required: true,
      description: "Water supply, drainage, and sanitary fixtures",
    },
    {
      key: "ac",
      title: "A.C. Systems",
      icon: <Wind className="size-6" />,
      value: ac,
      required: false,
      description: "Air conditioning and climate control",
    },
    {
      key: "electrical",
      title: "Electrical Works",
      icon: <Zap className="size-6" />,
      value: electrical,
      required: true,
      description: "Wiring, switches, outlets, and electrical panels",
    },
    {
      key: "elevator",
      title: "Elevators/Lifts",
      icon: <ArrowUp className="size-6" />,
      value: elevator,
      required: false,
      description: "Vertical transportation systems",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Core Building Components</h3>
        <p className="text-sm text-muted-foreground">
          Select the quality level for each component. Choose "Not Required" to exclude optional items.
        </p>
      </div>

      {components.map((component) => (
        <div key={component.key} className="space-y-3 pb-6 border-b last:border-b-0">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-vs/10 text-vs">
              {component.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-vs-dark">{component.title}</h4>
                {component.required && (
                  <Badge variant="outline" className="text-xs border-vs/30 text-vs">
                    Required
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{component.description}</p>
            </div>
          </div>
          
          <QualityLevelSelector
            component={component.key}
            currentValue={component.value}
            onChange={(value) => onOptionChange(component.key, value)}
          />
        </div>
      ))}
    </div>
  );
};

export default ComponentsStep;
