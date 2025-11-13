import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Share2, Download, ArrowLeft, Calculator, 
  Info, ChevronDown, ChevronUp, Phone, Mail, MessageSquare 
} from 'lucide-react';
import { ProjectEstimate } from '@/types/estimator';
import { generateEstimatePDF } from '@/utils/pdfExport';
import { useToast } from '@/hooks/use-toast';

interface ResultsStepProps {
  estimate: ProjectEstimate;
  onReset: () => void;
  onSave: () => void;
}

const ResultsStep: React.FC<ResultsStepProps> = ({ estimate, onReset, onSave }) => {
  const { toast } = useToast();
  const [expandedSections, setExpandedSections] = useState({
    breakdown: true,
    architect: false,
  });
  const [nextStep, setNextStep] = useState<'options' | 'contact' | 'schedule' | 'success'>('options');
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredContact: 'phone'
  });
  const [meetingData, setMeetingData] = useState({
    date: '',
    time: '',
    mode: 'video',
    message: ''
  });

  // Calculate COA-compliant architect fee
  const calculateArchitectFee = () => {
    const constructionCost = estimate.totalCost;
    let feePercentage = 0;
    
    if (estimate.projectType === 'residential') {
      if (constructionCost < 5000000) {
        feePercentage = 0.08; // 8% for smaller projects
      } else if (constructionCost < 10000000) {
        feePercentage = 0.07; // 7% for medium projects
      } else {
        feePercentage = 0.06; // 6% for larger projects
      }
    } else {
      if (constructionCost < 10000000) {
        feePercentage = 0.06; // 6% for smaller commercial
      } else {
        feePercentage = 0.05; // 5% for larger commercial
      }
    }
    
    const fee = constructionCost * feePercentage;
    return {
      fee: Math.max(fee, 50000), // COA minimum: ₹50,000
      percentage: feePercentage * 100
    };
  };

  const architectFee = calculateArchitectFee();

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    return `₹${Math.round(amount).toLocaleString('en-IN')}`;
  };

  const toggleSection = (section: 'breakdown' | 'architect') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleDownloadPDF = () => {
    try {
      generateEstimatePDF(estimate);
      toast({
        title: "PDF Downloaded!",
        description: "Your estimate has been saved."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF.",
        variant: "destructive"
      });
    }
  };

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(
      `Hi! I got an estimate of ${formatCurrency(estimate.totalCost)} for my ${estimate.area} ${estimate.areaUnit} ${estimate.projectType} project in ${estimate.city}. I'd like to discuss this further.`
    );
    window.open(`https://wa.me/919876543210?text=${message}`, '_blank');
  };

  // Generate available dates (next 14 business days)
  const getAvailableDates = () => {
    const dates: string[] = [];
    const today = new Date();
    let addedDays = 0;
    let daysChecked = 0;
    
    while (addedDays < 14 && daysChecked < 30) {
      const date = new Date(today);
      date.setDate(today.getDate() + daysChecked + 1);
      
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date.toISOString().split('T')[0]);
        addedDays++;
      }
      daysChecked++;
    }
    return dates;
  };

  const timeSlots = [
    '10:00 AM', '11:00 AM', '12:00 PM', 
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const handleContactSubmit = () => {
    if (!contactData.name || !contactData.email || !contactData.phone) {
      toast({
        title: "Required fields missing",
        description: "Please fill all contact details.",
        variant: "destructive"
      });
      return;
    }
    setNextStep('schedule');
  };

  const handleMeetingSubmit = () => {
    if (!meetingData.date || !meetingData.time) {
      toast({
        title: "Missing information",
        description: "Please select date and time.",
        variant: "destructive"
      });
      return;
    }
    
    // Send to backend/calendar system
    console.log('Meeting scheduled:', {
      ...contactData,
      ...meetingData,
      projectValue: estimate.totalCost,
      projectType: estimate.projectType
    });
    
    toast({
      title: "Meeting Confirmed! 🎉",
      description: `Consultation scheduled for ${meetingData.date} at ${meetingData.time}`
    });
    
    setNextStep('success');
  };

  const ratePerSqft = Math.round(estimate.totalCost / estimate.area);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Project Overview */}
      <div className="glass-card border border-primary/5 rounded-2xl p-6">
        <div className="grid grid-cols-3 gap-4 pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-xs text-vs-dark/70 mb-1">Location</h3>
            <p className="font-semibold text-sm">{estimate.city}, {estimate.state}</p>
          </div>
          <div>
            <h3 className="text-xs text-vs-dark/70 mb-1">Project Type</h3>
            <p className="font-semibold text-sm capitalize">{estimate.projectType}</p>
          </div>
          <div>
            <h3 className="text-xs text-vs-dark/70 mb-1">Area</h3>
            <p className="font-semibold text-sm">{estimate.area.toLocaleString()} {estimate.areaUnit}</p>
          </div>
        </div>

        {/* Construction Cost */}
        <div className="bg-gradient-to-br from-vs/10 to-vs/5 p-6 rounded-xl text-center mt-4">
          <h3 className="text-sm text-vs-dark/70 mb-2">Construction Cost</h3>
          <p className="text-4xl font-bold text-vs mb-2">
            {formatCurrency(estimate.totalCost)}
          </p>
          <p className="text-sm text-vs-dark/70">
            {formatCurrency(ratePerSqft)} per {estimate.areaUnit}
          </p>
        </div>

        {/* Architect Fee - COA Guidelines */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl text-center mt-4">
          <h3 className="text-sm text-gray-700 mb-2">Professional Fee (COA Guidelines)</h3>
          <p className="text-3xl font-bold text-indigo-600 mb-1">
            {formatCurrency(architectFee.fee)}
          </p>
          <p className="text-xs text-gray-600">
            {architectFee.percentage.toFixed(1)}% of construction cost
          </p>
          <button
            onClick={() => toggleSection('architect')}
            className="mt-3 text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mx-auto"
          >
            <Info className="w-3 h-3" />
            View COA Guidelines
          </button>
        </div>
      </div>

      {/* COA Guidelines Explanation */}
      {expandedSections.architect && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-blue-50 rounded-lg p-4 text-sm"
        >
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium mb-2 text-gray-800">Council of Architecture (COA) Fee Structure:</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Residential: 6-8% of construction cost (sliding scale)</li>
                <li>Commercial: 4-6% of construction cost</li>
                <li>Minimum professional fee: ₹50,000</li>
                <li>Includes: Concept, Design Development, Working Drawings, Tender Documents</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Cost Breakdown */}
      <div className="glass-card border border-primary/5 rounded-2xl overflow-hidden">
        <button
          onClick={() => toggleSection('breakdown')}
          className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100"
        >
          <h3 className="font-semibold text-lg">Detailed Cost Breakdown</h3>
          {expandedSections.breakdown ? <ChevronUp /> : <ChevronDown />}
        </button>
        
        {expandedSections.breakdown && (
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(estimate.categoryBreakdown).map(([category, amount]) => (
                <div key={category}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm capitalize">{category}</span>
                    <span className="text-sm font-semibold">{formatCurrency(amount)}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div 
                      className="h-full bg-vs rounded-full"
                      style={{ width: `${(amount / estimate.totalCost * 100).toFixed(1)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Important Notes */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-gray-700">
            <p className="font-medium mb-2">Important Notes:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Costs based on current market rates for {estimate.city}</li>
              <li>Actual costs may vary ±10-15% based on site conditions</li>
              <li>Professional fees follow COA guidelines</li>
              <li>GST applicable as per current rates</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Next Steps Section */}
      {nextStep === 'options' && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
          <h3 className="text-2xl font-bold mb-2">Love This Estimate? Let's Make It Real! 🎉</h3>
          <p className="text-gray-600 mb-6">Choose how you'd like to move forward:</p>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <button 
              onClick={handleWhatsAppContact}
              className="bg-green-600 text-white p-6 rounded-xl hover:bg-green-700 transition-all transform hover:scale-105"
            >
              <MessageSquare className="w-12 h-12 mb-3 mx-auto" />
              <h4 className="font-bold text-lg mb-2">Quick WhatsApp Chat</h4>
              <p className="text-sm text-green-100">Get instant response now</p>
            </button>

            <button 
              onClick={() => setNextStep('contact')}
              className="bg-indigo-600 text-white p-6 rounded-xl hover:bg-indigo-700 transition-all transform hover:scale-105"
            >
              <Calendar className="w-12 h-12 mb-3 mx-auto" />
              <h4 className="font-bold text-lg mb-2">Schedule Consultation</h4>
              <p className="text-sm text-indigo-100">Book free 30-min discussion</p>
            </button>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={handleDownloadPDF}
              className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
            
            <button 
              onClick={onReset}
              className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50"
            >
              New Estimate
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">500+</div>
              <div className="text-xs text-gray-600">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">24hrs</div>
              <div className="text-xs text-gray-600">Response</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">4.8★</div>
              <div className="text-xs text-gray-600">Rating</div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Form */}
      {nextStep === 'contact' && (
        <div className="bg-white rounded-lg p-6 border-2 border-indigo-200">
          <button 
            onClick={() => setNextStep('options')}
            className="text-gray-600 hover:text-gray-800 mb-4 flex items-center gap-2"
          >
            ← Back
          </button>

          <h3 className="text-2xl font-bold mb-4">Your Contact Details</h3>
          <p className="text-gray-600 mb-6">We'll send confirmation and meeting details here</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name *</label>
              <input
                type="text"
                value={contactData.name}
                onChange={(e) => setContactData({...contactData, name: e.target.value})}
                className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input
                type="email"
                value={contactData.email}
                onChange={(e) => setContactData({...contactData, email: e.target.value})}
                className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone *</label>
              <input
                type="tel"
                value={contactData.phone}
                onChange={(e) => setContactData({...contactData, phone: e.target.value})}
                className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="+91 98765 43210"
              />
            </div>

            <button
              onClick={handleContactSubmit}
              className="w-full bg-indigo-600 text-white py-4 rounded-lg font-bold hover:bg-indigo-700"
            >
              Continue to Schedule →
            </button>
          </div>
        </div>
      )}

      {/* Meeting Scheduler */}
      {nextStep === 'schedule' && (
        <div className="bg-white rounded-lg p-6 border-2 border-indigo-200">
          <button 
            onClick={() => setNextStep('contact')}
            className="text-gray-600 hover:text-gray-800 mb-4 flex items-center gap-2"
          >
            ← Back
          </button>

          <h3 className="text-2xl font-bold mb-2">Schedule Free Consultation</h3>
          <p className="text-gray-600 mb-6">30-minute design discussion with our architects</p>

          <div className="space-y-6">
            {/* Meeting Type */}
            <div>
              <label className="block text-sm font-medium mb-3">Meeting Type</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'office', label: '🏢 Office', desc: 'Mangalore' },
                  { value: 'video', label: '💻 Video', desc: 'Google Meet' },
                  { value: 'site', label: '🏗️ Site', desc: 'Your Location' }
                ].map(mode => (
                  <button
                    key={mode.value}
                    onClick={() => setMeetingData({...meetingData, mode: mode.value})}
                    className={`p-4 border-2 rounded-lg ${
                      meetingData.mode === mode.value 
                        ? 'border-indigo-600 bg-indigo-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="font-medium text-sm">{mode.label}</div>
                    <div className="text-xs text-gray-500">{mode.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">Select Date</label>
              <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                {getAvailableDates().map(date => {
                  const d = new Date(date);
                  return (
                    <button
                      key={date}
                      onClick={() => setMeetingData({...meetingData, date})}
                      className={`p-3 border-2 rounded-lg ${
                        meetingData.date === date 
                          ? 'border-indigo-600 bg-indigo-50' 
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="text-xs">{d.toLocaleDateString('en-US', {weekday: 'short'})}</div>
                      <div className="font-bold">{d.getDate()}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">Select Time</label>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map(time => (
                  <button
                    key={time}
                    onClick={() => setMeetingData({...meetingData, time})}
                    className={`p-3 border-2 rounded-lg ${
                      meetingData.time === time 
                        ? 'border-indigo-600 bg-indigo-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleMeetingSubmit}
              disabled={!meetingData.date || !meetingData.time}
              className="w-full bg-indigo-600 text-white py-4 rounded-lg font-bold hover:bg-indigo-700 disabled:bg-gray-300"
            >
              Confirm Meeting 🎯
            </button>
          </div>
        </div>
      )}

      {/* Success State */}
      {nextStep === 'success' && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-3xl font-bold mb-3">You're All Set!</h3>
          <p className="text-lg text-gray-600 mb-6">Meeting confirmed with our team</p>

          <div className="bg-white rounded-lg p-6 mb-6 max-w-md mx-auto">
            <h4 className="font-bold mb-4">Meeting Details:</h4>
            <div className="space-y-2 text-sm text-left">
              <div className="flex justify-between">
                <span>Date:</span>
                <span className="font-medium">{meetingData.date}</span>
              </div>
              <div className="flex justify-between">
                <span>Time:</span>
                <span className="font-medium">{meetingData.time}</span>
              </div>
              <div className="flex justify-between">
                <span>Type:</span>
                <span className="font-medium capitalize">{meetingData.mode}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 max-w-md mx-auto">
            <button
              onClick={handleDownloadPDF}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700"
            >
              Download PDF
            </button>
            
            <button
              onClick={onReset}
              className="flex-1 border-2 border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50"
            >
              New Estimate
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Missing Calendar import
const Calendar = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export default ResultsStep;
