
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ProjectEstimate, ComponentOption } from "@/types/estimator";
import { Download, Share, Calendar, Flag, CheckCheck, HardHat } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import UserInfoForm, { UserFormData } from "./UserInfoForm";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CostTreeMap from "./CostTreeMap";

interface ResultsStepProps {
  estimate: ProjectEstimate;
  onReset: () => void;
  onSave: () => void;
}

const ResultsStep = ({ estimate, onReset, onSave }: ResultsStepProps) => {
  const { toast } = useToast();
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("breakdown");
  
  useEffect(() => {
    // Ensure percentages are calculated properly
    const categories = estimate.categoryBreakdown;
    const total = estimate.totalCost;
    const percentages = Object.entries(categories).reduce((acc, [key, value]) => {
      acc[key] = Math.round((value / total) * 100);
      return acc;
    }, {} as Record<string, number>);
    console.log("Cost breakdown percentages:", percentages);
  }, [estimate]);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Construction Cost Estimate',
        text: `My estimated construction cost is ${formatCurrency(estimate.totalCost)} for a ${estimate.area} ${estimate.areaUnit} ${estimate.projectType} project.`,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      toast({
        title: "Sharing not supported",
        description: "Your browser does not support the Web Share API."
      });
    }
  };
  
  const handleUserFormSubmit = (userData: UserFormData) => {
    console.log("User data submitted:", userData);
    toast({
      title: "Report sent!",
      description: `We've sent the detailed cost report to ${userData.email}.`
    });
    setIsUserFormOpen(false);
    onSave();
  };

  // Helper to check if component is included
  const isIncluded = (value: string | undefined): boolean => {
    return !!(value && value !== 'none' && value !== '');
  };

  // Helper to format level label
  const formatLevel = (level: ComponentOption) => {
    if (level === 'standard') return 'Standard';
    if (level === 'premium') return 'Premium';
    if (level === 'luxury') return 'Luxury';
    return level;
  };

  // Group features by category
  const includedFeatures = {
    core: {
      title: "Core Building Components",
      items: [
        isIncluded(estimate.plumbing) && { name: "Plumbing & Sanitary", level: estimate.plumbing },
        isIncluded(estimate.electrical) && { name: "Electrical Systems", level: estimate.electrical },
        isIncluded(estimate.ac) && { name: "AC Systems", level: estimate.ac },
        isIncluded(estimate.elevator) && { name: "Elevators/Lifts", level: estimate.elevator },
      ].filter(Boolean)
    },
    finishes: {
      title: "Finishes & Surfaces",
      items: [
        isIncluded(estimate.lighting) && { name: "Lighting Solutions", level: estimate.lighting },
        isIncluded(estimate.windows) && { name: "Windows & Doors", level: estimate.windows },
        isIncluded(estimate.ceiling) && { name: "Ceiling Treatments", level: estimate.ceiling },
        isIncluded(estimate.surfaces) && { name: "Wall & Floor Surfaces", level: estimate.surfaces },
      ].filter(Boolean)
    },
    interiors: {
      title: "Interiors & Furnishings",
      items: [
        isIncluded(estimate.fixedFurniture) && { name: "Fixed Furniture", level: estimate.fixedFurniture },
        isIncluded(estimate.looseFurniture) && { name: "Loose Furniture", level: estimate.looseFurniture },
        isIncluded(estimate.furnishings) && { name: "Decorative Elements", level: estimate.furnishings },
        isIncluded(estimate.appliances) && { name: "Appliances & Fixtures", level: estimate.appliances },
      ].filter(Boolean)
    }
  };

  // Timeline phases in order with costs
  const timelinePhases = [
    { 
      name: "Planning & Approvals", 
      duration: estimate.timeline.phases.planning, 
      color: "#6366f1",
      cost: Math.round(estimate.totalCost * 0.08),
      startMonth: 1,
      endMonth: estimate.timeline.phases.planning
    },
    { 
      name: "Foundation & Structure", 
      duration: Math.ceil(estimate.timeline.phases.construction * 0.4), 
      color: "#8b5cf6",
      cost: Math.round(estimate.totalCost * 0.25), 
      startMonth: estimate.timeline.phases.planning + 1,
      endMonth: estimate.timeline.phases.planning + Math.ceil(estimate.timeline.phases.construction * 0.4)
    },
    { 
      name: "MEP Works", 
      duration: Math.ceil(estimate.timeline.phases.construction * 0.3), 
      color: "#ec4899",
      cost: Math.round(estimate.totalCost * 0.22),
      startMonth: estimate.timeline.phases.planning + Math.ceil(estimate.timeline.phases.construction * 0.4) + 1,
      endMonth: estimate.timeline.phases.planning + Math.ceil(estimate.timeline.phases.construction * 0.4) + Math.ceil(estimate.timeline.phases.construction * 0.3)
    },
    { 
      name: "Finishing Works", 
      duration: Math.ceil(estimate.timeline.phases.construction * 0.3), 
      color: "#f43f5e",
      cost: Math.round(estimate.totalCost * 0.25),
      startMonth: estimate.timeline.phases.planning + Math.ceil(estimate.timeline.phases.construction * 0.4) + Math.ceil(estimate.timeline.phases.construction * 0.3) + 1,
      endMonth: estimate.timeline.phases.planning + estimate.timeline.phases.construction
    },
    { 
      name: "Interiors & Furnishing", 
      duration: estimate.timeline.phases.interiors, 
      color: "#f97316",
      cost: Math.round(estimate.totalCost * 0.20),
      startMonth: estimate.timeline.phases.planning + estimate.timeline.phases.construction + 1,
      endMonth: estimate.timeline.totalMonths
    },
  ];
  
  return (
    <div className="space-y-8 overflow-y-auto max-h-[80vh] px-2 pb-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-xl border border-vs/10 shadow-sm"
      >
        <div className="mb-6 p-3 bg-orange-50 border border-orange-100 rounded-lg text-sm text-vs-dark/80 text-center">
          <p>This is an indicative estimate based on standard inputs. For a refined cost analysis tailored to your specific needs, <a href="#contact" className="text-vs font-medium underline">contact our team</a>.</p>
        </div>
        
        <h2 className="text-xl font-bold text-vs-dark text-center mb-4">Estimate Summary</h2>
        
        <div className="flex flex-wrap justify-between gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <h3 className="text-sm text-vs-dark/70 mb-1">Location</h3>
            <p className="font-medium">{estimate.city}, {estimate.state}</p>
          </div>
          <div className="flex-1 min-w-[200px]">
            <h3 className="text-sm text-vs-dark/70 mb-1">Project Type</h3>
            <p className="font-medium">{estimate.projectType}</p>
          </div>
          <div className="flex-1 min-w-[200px]">
            <h3 className="text-sm text-vs-dark/70 mb-1">Area</h3>
            <p className="font-medium">{estimate.area} {estimate.areaUnit}</p>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-4 mb-6">
          <div className="text-center">
            <h3 className="text-sm text-vs-dark/70 mb-1">Estimated Total Cost</h3>
            <p className="text-3xl font-bold text-vs">{formatCurrency(estimate.totalCost)}</p>
            <p className="text-sm text-vs-dark/60">
              ({formatCurrency(Math.round(estimate.totalCost / estimate.area))} per {estimate.areaUnit})
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="breakdown" onValueChange={setActiveTab} className="mt-8">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="breakdown">Detailed Breakdown</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>
          
          <TabsContent value="breakdown" className="pt-2">
            <div className="border-t border-gray-100 pt-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-vs-dark mb-4">Detailed Cost Structure</h3>
                <div className="text-center text-sm text-vs-dark/70 mb-2">
                  <p>Hover over sections to see details</p>
                </div>
                <div className="aspect-video">
                  <CostTreeMap estimate={estimate} showLabels={true} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {Object.entries(includedFeatures).map(([key, section]) => (
                  <div key={key} className="bg-vs/5 rounded-lg p-4">
                    <h4 className="font-medium text-vs mb-3">{section.title}</h4>
                    <ul className="space-y-2">
                      {section.items.length > 0 ? (
                        section.items.map((item, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCheck size={16} className="text-green-600 flex-shrink-0" />
                            <span>
                              {item.name}
                              {item.level && <span className="ml-1 text-xs bg-vs/20 text-vs-dark/70 px-2 py-0.5 rounded-full">
                                {formatLevel(item.level)}
                              </span>}
                            </span>
                          </li>
                        ))
                      ) : (
                        <li className="text-sm text-gray-500">No items selected</li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="timeline">
            <div className="pt-2">
              <h3 className="text-sm font-semibold text-vs-dark mb-4">Project Timeline Visualization</h3>
              
              {/* Enhanced progressive timeline view */}
              <div className="mb-8">
                <div className="flex items-center mb-2">
                  <div className="text-sm font-medium w-44">Project Phase</div>
                  <div className="text-sm text-vs-dark/70 flex-1">Timeline & Cost</div>
                </div>
                
                {timelinePhases.map((phase, index) => (
                  <div key={index} className="mb-5">
                    <div className="flex items-center mb-1">
                      <div className="text-sm font-medium w-44">{phase.name}</div>
                      <div className="flex-1">
                        <div className="flex items-center text-xs text-gray-500">
                          <span>Month {phase.startMonth}</span>
                          <span className="flex-1 text-center">→</span>
                          <span>Month {phase.endMonth}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-44 flex items-center">
                        <div className="h-4 w-4 rounded-full mr-2" style={{ backgroundColor: phase.color }}></div>
                        <span className="text-xs text-gray-500">{formatCurrency(phase.cost)}</span>
                      </div>
                      <div className="flex-1">
                        <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                          <div 
                            className="absolute top-0 left-0 h-full rounded-lg flex items-center pl-2 text-white text-xs font-medium"
                            style={{ 
                              backgroundColor: phase.color,
                              width: `${(phase.duration / estimate.timeline.totalMonths) * 100}%`,
                              marginLeft: `${((phase.startMonth - 1) / estimate.timeline.totalMonths) * 100}%`
                            }}
                          >
                            {phase.duration} {phase.duration === 1 ? 'month' : 'months'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Timeline ruler */}
                <div className="flex mt-4 mb-2">
                  {[...Array(estimate.timeline.totalMonths)].map((_, i) => (
                    <div key={i} className="flex-1 text-center text-xs text-gray-400">
                      M{i+1}
                    </div>
                  ))}
                </div>
                <div className="h-1 bg-gray-200 w-full rounded-full mb-6"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-vs/5 p-4 rounded-lg flex flex-col items-center">
                  <Calendar className="text-vs mb-2" size={24} />
                  <span className="text-xl font-bold text-vs">{estimate.timeline.phases.planning}</span>
                  <p className="text-sm text-vs-dark/70">Planning (months)</p>
                </div>
                
                <div className="bg-vs/5 p-4 rounded-lg flex flex-col items-center">
                  <HardHat className="text-vs mb-2" size={24} />
                  <span className="text-xl font-bold text-vs">{estimate.timeline.phases.construction}</span>
                  <p className="text-sm text-vs-dark/70">Construction (months)</p>
                </div>
                
                <div className="bg-vs/5 p-4 rounded-lg flex flex-col items-center">
                  <CheckCheck className="text-vs mb-2" size={24} />
                  <span className="text-xl font-bold text-vs">{estimate.timeline.phases.interiors}</span>
                  <p className="text-sm text-vs-dark/70">Interiors (months)</p>
                </div>
              </div>
              
              <div className="mt-4 bg-vs/10 p-4 rounded-lg flex items-center justify-center gap-3">
                <Flag className="text-vs" size={20} />
                <div>
                  <span className="text-2xl font-bold text-vs">{estimate.timeline.totalMonths}</span>
                  <p className="text-sm text-vs-dark/70">Total Project Timeline (months)</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
      
      <div className="flex flex-wrap gap-4 justify-center">
        <button 
          onClick={() => setIsUserFormOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-vs hover:bg-vs-light text-white rounded-lg transition-colors"
        >
          <Download size={18} /> Download Detailed Report
        </button>
        
        <button 
          onClick={handleShare}
          className="flex items-center gap-2 px-6 py-3 border border-vs text-vs rounded-lg hover:bg-vs/5 transition-colors"
        >
          <Share size={18} /> Share Estimate
        </button>
      </div>
      
      <UserInfoForm 
        isOpen={isUserFormOpen}
        onClose={() => setIsUserFormOpen(false)}
        onSubmit={handleUserFormSubmit}
      />
    </div>
  );
};

export default ResultsStep;
