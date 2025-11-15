import React from 'react';
import { EstimatorProvider, useEstimator } from './contexts/EstimatorContext';
import ProjectTypeSelector from './components/ProjectTypeSelector';
import ComponentSelector from './components/ComponentSelector';
import DetailedBreakdown from './components/DetailedBreakdown';
import ContactMeeting from './components/ContactMeeting';
import './styles/global-cursor.css';

const EstimatorFlow = () => {
  const { step } = useEstimator();

  return (
    <div className="min-h-screen">
      {step === 1 && <ProjectTypeSelector />}
      {step === 2 && <ProjectTypeSelector />}
      {step === 3 && <ComponentSelector />}
      {step === 4 && <DetailedBreakdown />}
      {step === 5 && <ContactMeeting />}
    </div>
  );
};

function App() {
  return (
    <EstimatorProvider>
      <EstimatorFlow />
    </EstimatorProvider>
  );
}

export default App;
