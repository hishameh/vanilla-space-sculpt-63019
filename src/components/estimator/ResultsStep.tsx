import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Share2, Download, ArrowLeft, Calculator, Phone, Mail, MessageSquare, CheckCircle2, Clock, Users, ChevronRight } from 'lucide-react';
import { ProjectEstimate } from '@/types/estimator';
import { calculateArchitectFee } from '@/utils/architectFeeCalculations';
import { formatCurrency } from '@/utils/formatters';
import { generateEstimatePDF } from '@/utils/pdfExport';
import { useToast } from '@/hooks/use-toast';

interface ResultsStepProps {
  estimate: ProjectEstimate;
  onReset: () => void;
  onSave: () => void;
}

interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  preferredContact: "phone" | "email" | "whatsapp";
  preferredTime: string;
  message: string;
}

const ResultsStep: React.FC<ResultsStepProps> = ({ estimate, onReset, onSave }) => {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    phone: "",
    email: "",
    preferredContact: "phone",
    preferredTime: "morning",
    message: "",
  });

  // Calculate architect fee
  const architectFee = calculateArchitectFee(
    estimate.projectType,
    estimate.totalCost,
    estimate.area,
    'Individual',
    estimate.complexity > 7 ? 'Premium' : 'Standard',
    true,
    true,
    'Standard',
    false,
    'INR'
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.email) {
      toast({
        title: "Required fields missing",
        description: "Please fill in your name, phone, and email.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log("Contact request:", {
      ...formData,
      estimate: {
        totalCost: estimate.totalCost,
        area: estimate.area,
        location: `${estimate.city}, ${estimate.state}`,
        projectType: estimate.projectType,
      }
    });

    setIsSubmitting(false);
    setShowForm(false);

    toast({
      title: "Request Received!",
      description: "Our team will contact you within 24 hours with a detailed quote.",
    });
  };

  const handleDownloadPDF = () => {
    try {
      generateEstimatePDF(estimate);
      toast({
        title: "PDF Downloaded!",
        description: "Your estimate summary has been downloaded."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Project Estimate',
        text: generateShareText(estimate, architectFee),
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const generateShareText = (estimate: ProjectEstimate, architectFee: any) => {
    return `Project Estimate for ${estimate.projectType}\n` +
           `Area: ${estimate.area} ${estimate.areaUnit}\n` +
           `Construction Cost: ₹${estimate.totalCost.toLocaleString()}\n` +
           `Professional Fee: ₹${architectFee.totalFee.toLocaleString()}`;
  };

  const formatCost = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount).replace('₹', '₹ ');
  };

  const pricingList = [
    { label: 'Civil Quality', value: estimate.civilQuality },
    { label: 'Plumbing', value: estimate.plumbing },
    { label: 'Electrical', value: estimate.electrical },
    { label: 'AC', value: estimate.ac },
    { label: 'Elevator', value: estimate.elevator },
    { label: 'Building Envelope', value: estimate.buildingEnvelope },
    { label: 'Lighting', value: estimate.lighting },
    { label: 'Windows', value: estimate.windows },
    { label: 'Ceiling', value: estimate.ceiling },
    { label: 'Surfaces', value: estimate.surfaces },
    { label: 'Fixed Furniture', value: estimate.fixedFurniture },
    { label: 'Loose Furniture', value: estimate.looseFurniture },
    { label: 'Furnishings', value: estimate.furnishings },
    { label: 'Appliances', value: estimate.appliances },
    { label: 'Artefacts', value: estimate.artefacts },
  ].filter(item => item.value !== 'none');

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
          <h3 className="text-sm text-vs-dark/70 mb-2">Estimated Construction Cost</h3>
          <p className="text-4xl font-bold text-vs mb-2">
            {formatCost(estimate.totalCost)}
          </p>
          <p className="text-sm text-vs-dark/70">
            {formatCost(Math.round(estimate.totalCost / estimate.area))} per {estimate.areaUnit}
          </p>
        </div>

        {/* Professional Fee */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-xl text-center mt-4">
          <h3 className="text-sm text-vs-dark/70 mb-2">Estimated Professional Fee (Rough)</h3>
          <p className="text-4xl font-bold text-primary mb-2">
            {formatCost(architectFee.totalFee)}
          </p>
          <div className="text-xs text-vs-dark/70 space-y-1 mt-3">
            <p>This is an indicative professional fee estimate.</p>
            <Link 
              to="/architect-fee" 
              className="inline-flex items-center gap-2 text-vs hover:text-vs-light mt-2 font-medium"
            >
              <Calculator size={14} />
              Calculate Detailed Fee Breakdown →
            </Link>
          </div>
        </div>
      </div>

      {/* Contact CTA Section */}
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-vs/5 to-vs/10 p-4 rounded-xl border border-vs/20">
          <h3 className="text-base font-bold text-vs-dark mb-3">Get Your Detailed Quote</h3>
          
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-white p-2 rounded-lg text-center">
              <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <p className="text-[10px] text-gray-700 font-medium">Accurate Pricing</p>
            </div>
            <div className="bg-white p-2 rounded-lg text-center">
              <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <p className="text-[10px] text-gray-700 font-medium">24hr Response</p>
            </div>
            <div className="bg-white p-2 rounded-lg text-center">
              <Users className="w-5 h-5 text-purple-600 mx-auto mb-1" />
              <p className="text-[10px] text-gray-700 font-medium">Expert Advice</p>
            </div>
          </div>

          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-vs hover:bg-vs-light text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 group"
            >
              <span>Get Detailed Quote</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : null}
        </div>

        {/* Contact Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl border border-gray-200 space-y-3">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">Share Your Details</h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vs/30 focus:border-vs"
                    placeholder="Your name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vs/30 focus:border-vs"
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vs/30 focus:border-vs"
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Preferred Contact
                  </label>
                  <select
                    name="preferredContact"
                    value={formData.preferredContact}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vs/30 focus:border-vs"
                  >
                    <option value="phone">Phone Call</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="email">Email</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Best Time
                  </label>
                  <select
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vs/30 focus:border-vs"
                  >
                    <option value="morning">Morning (9-12)</option>
                    <option value="afternoon">Afternoon (12-5)</option>
                    <option value="evening">Evening (5-8)</option>
                    <option value="anytime">Anytime</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Additional Details (Optional)
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vs/30 focus:border-vs resize-none"
                  placeholder="Any specific requirements or questions..."
                />
              </div>
              
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-vs hover:bg-vs-light text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    "Request Detailed Quote"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Quick Contact Options */}
        <div className="grid grid-cols-3 gap-2">
          <a
            href="tel:+919876543210"
            className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:border-vs hover:bg-vs/5 transition-colors group"
          >
            <Phone className="w-5 h-5 text-vs mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-medium text-gray-700">Call Us</span>
          </a>
          
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group"
          >
            <MessageSquare className="w-5 h-5 text-green-600 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-medium text-gray-700">WhatsApp</span>
          </a>
          
          <a
            href="mailto:hello@vanillasometh.in"
            className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
          >
            <Mail className="w-5 h-5 text-blue-600 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-medium text-gray-700">Email</span>
          </a>
        </div>

        {/* Download Option */}
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-gray-600" />
              <div>
                <p className="text-xs font-medium text-gray-800">Download Summary</p>
                <p className="text-[10px] text-gray-600">Get PDF estimate</p>
              </div>
            </div>
            <button 
              onClick={handleDownloadPDF}
              className="px-3 py-1 text-xs bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
            >
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="glass-card border border-primary/5 rounded-2xl p-6">
        <h3 className="text-base font-semibold text-vs-dark mb-4">Cost Distribution</h3>
        <div className="space-y-4">
          {Object.entries(estimate.categoryBreakdown).map(([category, amount]) => (
            <div key={category} className="relative">
              <div className="flex justify-between mb-1">
                <span className="text-sm capitalize">{category}</span>
                <span className="text-sm font-semibold">{formatCost(amount)}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div 
                  className="h-full bg-vs rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(amount / estimate.totalCost * 100).toFixed(1)}%` 
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="glass-card border border-primary/5 rounded-2xl p-6">
        <h3 className="text-base font-semibold text-vs-dark mb-4">Project Timeline</h3>
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="text-center">
              <p className="text-sm font-semibold">{estimate.timeline.phases.planning} months</p>
              <p className="text-xs text-vs-dark/70">Planning</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold">{estimate.timeline.phases.construction} months</p>
              <p className="text-xs text-vs-dark/70">Construction</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold">{estimate.timeline.phases.interiors} months</p>
              <p className="text-xs text-vs-dark/70">Interiors</p>
            </div>
          </div>
          <div className="h-2 bg-gray-100 rounded-full relative overflow-hidden">
            <div className="absolute inset-0 flex">
              <div 
                className="h-full bg-blue-400 rounded-l-full transition-all duration-500"
                style={{ 
                  width: `${(estimate.timeline.phases.planning / estimate.timeline.totalMonths * 100)}%` 
                }}
              />
              <div 
                className="h-full bg-vs transition-all duration-500"
                style={{ 
                  width: `${(estimate.timeline.phases.construction / estimate.timeline.totalMonths * 100)}%` 
                }}
              />
              <div 
                className="h-full bg-green-400 rounded-r-full transition-all duration-500"
                style={{ 
                  width: `${(estimate.timeline.phases.interiors / estimate.timeline.totalMonths * 100)}%` 
                }}
              />
            </div>
          </div>
          <p className="text-center mt-4 text-sm font-semibold">
            Total Duration: {estimate.timeline.totalMonths} months
          </p>
        </div>
      </div>

      {/* Selected Components */}
      <div className="glass-card border border-primary/5 rounded-2xl p-6">
        <h3 className="text-base font-semibold text-vs-dark mb-4">Selected Components</h3>
        <div className="grid grid-cols-2 gap-4">
          {pricingList.map((item, index) => (
            <div 
              key={index}
              className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm"
            >
              <span className="text-sm">{item.label}</span>
              <span className="text-sm font-semibold capitalize">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm text-gray-700">
        <p className="font-medium text-orange-800 mb-2">Important Notes:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>This is an indicative estimate based on standard inputs and market rates for {estimate.city}</li>
          <li>Final costs may vary based on site conditions and specific requirements</li>
          <li>Professional fees are rough estimates - use detailed calculator for accurate quotation</li>
          <li>Timeline may vary based on approval processes and site conditions</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default ResultsStep;
