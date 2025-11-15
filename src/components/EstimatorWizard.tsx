import { EstimatorProvider } from "@/context/EstimatorContext";
import StepIndicator from "@/components/estimator/StepIndicator";
import CurrentEstimateDisplay from "@/components/estimator/CurrentEstimateDisplay";
import StepContent from "@/components/estimator/StepContent";
import StepNavigation from "@/components/estimator/StepNavigation";
import { ComponentOption } from "@/types/estimator";

export type { ComponentOption };

const EstimatorWizard = () => {
  return (
    <EstimatorProvider>
      <div className="glass-card border border-primary/5 rounded-2xl p-6 md:p-8 shadow-lg bg-white/80 backdrop-blur-sm">
        <StepIndicator />
        <CurrentEstimateDisplay />
        
        <div className="my-8">
          <StepContent />
        </div>
        
        <StepNavigation />
      </div>
    </EstimatorProvider>
  );
};

export default EstimatorWizard;
