import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Building, Hammer, Home, Truck, Wrench, MapPin, IndianRupee, Calendar, CheckCircle } from 'lucide-react';
import { jobsAPI } from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { Briefcase } from "lucide-react";

const PostJob = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    trade: '',
    state: user?.location?.state || '',
    district: user?.location?.district || '',
    workersNeeded: '',
    dailyRate: '',
    duration: '',
    startDate: '',
    endDate: '',
    requiredSkills: [],
    accommodation: 'none',
    languagePreference: '',
  });

  const jobTypes = [
    { value: 'Construction', label: 'Construction', icon: Building, desc: 'Building construction, infrastructure' },
    { value: 'Agriculture', label: 'Agriculture', icon: Hammer, desc: 'Farm work, harvesting' },
    { value: 'Skilled Trade', label: 'Skilled Trade', icon: Wrench, desc: 'Electrician, plumbing, welding' },
    { value: 'Renovation', label: 'Renovation', icon: Home, desc: 'Repair, remodeling work' },
    { value: 'Loading/Shifting', label: 'Loading/Shifting', icon: Truck, desc: 'Material handling, moving' },
    { value: 'Other', label: 'Other', icon: Briefcase, desc: 'Other types of work' },
  ];

  const tradeOptions = [
    { value: '', label: 'Select Trade' },
    { value: 'Masonry', label: 'Masonry' },
    { value: 'Electrician', label: 'Electrician' },
    { value: 'Plumbing', label: 'Plumbing' },
    { value: 'Carpentry', label: 'Carpentry' },
    { value: 'Painting', label: 'Painting' },
    { value: 'Welding', label: 'Welding' },
    { value: 'Farm Labour', label: 'Farm Labour' },
    { value: 'Road & Civil', label: 'Road & Civil' },
  ];

  const stateOptions = [
    { value: '', label: 'Select State' },
    { value: 'Bihar', label: 'Bihar' },
    { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
    { value: 'Jharkhand', label: 'Jharkhand' },
    { value: 'West Bengal', label: 'West Bengal' },
    { value: 'Rajasthan', label: 'Rajasthan' },
    { value: 'Odisha', label: 'Odisha' },
    { value: 'Maharashtra', label: 'Maharashtra' },
  ];

  const skillOptions = [
    'Brick laying', 'Concrete work', 'Plastering', 'Wiring', 'Panel installation',
    'Pipe fitting', 'Water tanks', 'Furniture making', 'Door/Window frames',
    'Interior painting', 'Exterior painting', 'Arc welding', 'MIG welding',
    'Excavation', 'Foundation work', 'Steel structures', 'Troubleshooting',
  ];

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.includes(skill)
        ? prev.requiredSkills.filter((s) => s !== skill)
        : [...prev.requiredSkills, skill],
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await jobsAPI.createJob({
        type: formData.type,
        title: formData.title,
        description: formData.description,
        trade: formData.trade,
        location: {
          state: formData.state,
          district: formData.district,
        },
        workersNeeded: Number(formData.workersNeeded),
        dailyRate: Number(formData.dailyRate),
        duration: formData.duration,
        startDate: formData.startDate,
        endDate: formData.endDate,
        requiredSkills: formData.requiredSkills,
        accommodation: formData.accommodation,
        languagePreference: formData.languagePreference,
      });
      toast.success('Job posted successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Select Job Type</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {jobTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => {
                      updateField('type', type.value);
                      setStep(2);
                    }}
                    className={`p-6 rounded-xl border text-left transition-all ${formData.type === type.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-surface2 hover:border-primary/30'
                      }`}
                  >
                    <Icon className="text-primary mb-3" size={32} />
                    <h4 className="font-semibold mb-1">{type.label}</h4>
                    <p className="text-sm text-text-muted">{type.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Job Details</h3>
            <Input
              label="Job Title"
              placeholder="e.g., House Construction G+2"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              required
            />
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-text focus:outline-none focus:border-primary min-h-[120px]"
                placeholder="Describe the job requirements, work scope, etc."
                required
              />
            </div>
            <Select
              label="Trade Required"
              value={formData.trade}
              onChange={(e) => updateField('trade', e.target.value)}
              options={tradeOptions}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="State"
                value={formData.state}
                onChange={(e) => updateField('state', e.target.value)}
                options={stateOptions}
                required
              />
              <Input
                label="District"
                placeholder="e.g., Patna"
                value={formData.district}
                onChange={(e) => updateField('district', e.target.value)}
                required
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Requirements</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Workers Needed"
                type="number"
                min="1"
                value={formData.workersNeeded}
                onChange={(e) => updateField('workersNeeded', e.target.value)}
              />
              <Input
                label="Daily Rate (₹)"
                type="number"
                min="0"
                value={formData.dailyRate}
                onChange={(e) => updateField('dailyRate', e.target.value)}
              />
            </div>
            <Input
              label="Duration"
              placeholder="e.g., 2 months, 3-4 weeks"
              value={formData.duration}
              onChange={(e) => updateField('duration', e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={(e) => updateField('startDate', e.target.value)}
              />
              <Input
                label="End Date (optional)"
                type="date"
                value={formData.endDate}
                onChange={(e) => updateField('endDate', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Required Skills
              </label>
              <div className="flex flex-wrap gap-2">
                {skillOptions.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${formData.requiredSkills.includes(skill)
                      ? 'bg-primary text-background'
                      : 'bg-surface2 text-text-muted hover:text-text'
                      }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Accommodation
              </label>
              <div className="flex gap-3">
                {[
                  { value: 'none', label: 'Not Provided' },
                  { value: 'partial', label: 'Partial' },
                  { value: 'full', label: 'Fully Provided' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateField('accommodation', opt.value)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${formData.accommodation === opt.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-surface2 text-text-muted'
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <Input
              label="Language Preference"
              placeholder="e.g., Hindi, Bengali"
              value={formData.languagePreference}
              onChange={(e) => updateField('languagePreference', e.target.value)}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Review & Post</h3>
            <div className="bg-surface2 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-text-muted">Job Type</span>
                <span className="font-medium">{formData.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Title</span>
                <span className="font-medium">{formData.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Trade</span>
                <span className="font-medium">{formData.trade}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Location</span>
                <span className="font-medium">{formData.district}, {formData.state}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Workers Needed</span>
                <span className="font-medium">{formData.workersNeeded}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Daily Rate</span>
                <span className="font-medium">₹{formData.dailyRate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Duration</span>
                <span className="font-medium">{formData.duration}</span>
              </div>
              {formData.requiredSkills.length > 0 && (
                <div>
                  <span className="text-text-muted">Skills</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {formData.requiredSkills.map((skill) => (
                      <Badge key={skill} variant="default">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold font-heading mb-2">Post a Job</h1>
        <p className="text-text-muted mb-6">Find skilled workers for your project</p>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${s <= step ? 'bg-primary text-background' : 'bg-surface2 text-text-muted'
                }`}>
                {s}
              </div>
              {s < 4 && (
                <div className={`w-16 md:w-24 h-1 mx-2 ${s < step ? 'bg-primary' : 'bg-surface2'
                  }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-surface border border-border rounded-xl p-6 mb-6">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="secondary"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
          >
            Previous
          </Button>
          {step < 4 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && !formData.type) ||
                (step === 2 && (!formData.title || !formData.trade || !formData.state)) ||
                (step === 3 && (!formData.workersNeeded || !formData.dailyRate))
              }
            >
              Next
            </Button>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setShowPreview(true)}>
                Preview
              </Button>
              <Button onClick={handleSubmit} loading={loading}>
                Post Job
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostJob;
