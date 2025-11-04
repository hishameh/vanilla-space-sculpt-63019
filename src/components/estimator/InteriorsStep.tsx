import { Armchair, Sofa, Palette, Microwave } from "lucide-react";
import { ComponentOption } from "@/types/estimator";
import QualityLevelSelector from "./QualityLevelSelector";

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
  onOptionChange,
}: InteriorsStepProps) => {
  const interiors = [
    {
      key: "fixedFurniture",
      title: "Fixed Furniture",
      icon: <Armchair className="size-6" />,
      value: fixedFurniture,
      description: "Built-in wardrobes, kitchen cabinets, and storage units",
    },
    {
      key: "looseFurniture",
      title: "Loose Furniture",
      icon: <Sofa className="size-6" />,
      value: looseFurniture,
      description: "Movable furniture like sofas, beds, and dining sets",
    },
    {
      key: "furnishings",
      title: "Decorative Elements",
      icon: <Palette className="size-6" />,
      value: furnishings,
      description: "Curtains, blinds, artwork, and decorative accessories",
    },
    {
      key: "appliances",
      title: "Appliances & Fixtures",
      icon: <Microwave className="size-6" />,
      value: appliances,
      description: "Kitchen and home appliances, smart home devices",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Interiors & Furnishings</h3>
        <p className="text-sm text-muted-foreground">
          Select the quality level for interior elements. All items are optional - choose "Not Required" to skip.
        </p>
      </div>

      {interiors.map((interior) => (
        <div key={interior.key} className="space-y-3 pb-6 border-b last:border-b-0">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-vs/10 text-vs">
              {interior.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-vs-dark mb-1">{interior.title}</h4>
              <p className="text-sm text-muted-foreground">{interior.description}</p>
            </div>
          </div>
          
          <QualityLevelSelector
            component={interior.key}
            currentValue={interior.value}
            onChange={(value) => onOptionChange(interior.key, value)}
          />
        </div>
      ))}
    </div>
  );
};

export default InteriorsStep;
