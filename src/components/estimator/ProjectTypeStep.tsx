
import { motion } from "framer-motion";
import { Building2, Home, Hammer, TreePine, Paintbrush } from "lucide-react";
import { cn } from "@/lib/utils";
import AnimatedText from "@/components/AnimatedText";

type ProjectType = "interior-only" | "core-shell" | "full-project" | "full-landscape" | "renovation";

interface ProjectOption {
  id: ProjectType;
  title: string;
  description: string;
  icon: React.ReactNode;
  details: string[];
}

interface ProjectTypeStepProps {
  selectedType: string;
  onSelect: (type: ProjectType) => void;
}

const ProjectTypeStep = ({ selectedType, onSelect }: ProjectTypeStepProps) => {
  const projectOptions: ProjectOption[] = [
    {
      id: "interior-only",
      title: "Interior Only",
      description: "Interior design and furnishing without construction",
      icon: <Paintbrush className="size-6" />,
      details: ["Furniture & Fixtures", "Finishes", "Furnishings & Decor"]
    },
    {
      id: "core-shell",
      title: "Core & Shell",
      description: "Basic construction with MEP systems",
      icon: <Building className="size-6" />,
      details: ["Construction", "Plumbing & Electrical", "HVAC Systems"]
    },
    {
      id: "full-project",
      title: "Full Project",
      description: "Complete construction and interiors",
      icon: <Home className="size-6" />,
      details: ["Construction", "Interiors", "Complete Finishes"]
    },
    {
      id: "full-landscape",
      title: "Full Project + Landscape",
      description: "Everything including outdoor spaces",
      icon: <TreePine className="size-6" />,
      details: ["Construction", "Interiors", "Landscape Design"]
    },
    {
      id: "renovation",
      title: "Renovation",
      description: "Renovation and refurbishment of existing spaces",
      icon: <Hammer className="size-6" />,
      details: ["Remodeling", "Upgrades", "Refresh Interiors"]
    }
  ];

  return (
    <div>
      <AnimatedText
        text="What type of project are you planning?"
        className="text-2xl font-display mb-8 text-center"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectOptions.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={cn(
              "group flex flex-col justify-between border rounded-xl p-6 cursor-pointer transition-all duration-300",
              selectedType === option.id
                ? "border-vs bg-vs/5 shadow-lg"
                : "border-primary/10 hover:border-primary/30 hover:shadow-md"
            )}
            onClick={() => onSelect(option.id)}
          >
            <div>
              <div className="flex items-start gap-4 mb-4">
                <div className={cn(
                  "flex-shrink-0 flex items-center justify-center size-12 rounded-lg transition-colors",
                  selectedType === option.id
                    ? "bg-vs text-white"
                    : "bg-primary/5 text-primary/70 group-hover:bg-primary/10"
                )}>
                  {option.icon}
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-1 text-[#4f090c]">{option.title}</h3>
                  <p className="text-[#4f090c]/70 text-sm">{option.description}</p>
                </div>
              </div>

              <ul className="space-y-1 ml-16">
                {option.details.map((detail, idx) => (
                  <li key={idx} className="text-[#4f090c]/60 text-sm flex items-center">
                    <span className="mr-2 text-vs">•</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            <div className={cn(
              "mt-4 h-1 rounded-full bg-vs/20 overflow-hidden",
              selectedType === option.id ? "opacity-100" : "opacity-0 group-hover:opacity-50"
            )}>
              <motion.div
                className="h-full bg-vs"
                initial={{ width: "0%" }}
                animate={{ width: selectedType === option.id ? "100%" : "0%" }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 text-center text-[#4f090c]/70 text-sm">
        <p>Choose the option that best describes your project scope</p>
      </div>
    </div>
  );
};

export default ProjectTypeStep;
