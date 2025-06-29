import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, CheckCircle } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Select from '../components/UI/Select';
import Textarea from '../components/UI/Textarea';
import { IssueType, Priority } from '../types';
import { generateTicketNumber } from '../utils/mockData';

const SubmitTicket: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    appName: '',
    appVersion: '',
    issueType: '' as IssueType | '',
    priority: '' as Priority | '',
    subject: '',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const issueTypes: { value: IssueType; label: string }[] = [
    { value: 'Bug Report', label: 'Bug Report' },
    { value: 'Feature Request', label: 'Feature Request' },
    { value: 'Login Issue', label: 'Login Issue' },
    { value: 'Performance Issue', label: 'Performance Issue' },
    { value: 'Data Issue', label: 'Data Issue' },
    { value: 'General Question', label: 'General Question' },
    { value: 'Other', label: 'Other' },
  ];

  const priorities: { value: Priority; label: string }[] = [
    { value: 'Low', label: 'Low - General inquiry' },
    { value: 'Medium', label: 'Medium - Standard issue' },
    { value: 'High', label: 'High - Impacts functionality' },
    { value: 'Urgent', label: 'Urgent - System down/critical' },
  ];

  const appNames = [
    { value: 'Portfolio Manager', label: 'Portfolio Manager' },
    { value: 'Analytics Dashboard', label: 'Analytics Dashboard' },
    { value: 'Task Manager', label: 'Task Manager' },
    { value: 'Financial Tracker', label: 'Financial Tracker' },
    { value: 'Other', label: 'Other' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      const isValidType = ['image/', 'application/pdf', 'text/', '.log'].some(type => 
        file.type.startsWith(type) || file.name.endsWith('.log')
      );
      return isValidSize && isValidType;
    });
    
    setAttachments(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 files
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.appName) newErrors.appName = 'App name is required';
    if (!formData.issueType) newErrors.issueType = 'Issue type is required';
    if (!formData.priority) newErrors.priority = 'Priority is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newTicketNumber = generateTicketNumber();
    setTicketNumber(newTicketNumber);
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleTrackTicket = () => {
    navigate(`/track-ticket?ticket=${ticketNumber}`);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="text-center">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-success-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Ticket Submitted Successfully!
          </h1>
          <p className="text-gray-600 mb-6">
            Your support ticket has been created with the following details:
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-left space-y-2">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Ticket Number:</span>
                <span className="font-mono text-primary-600">{ticketNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Email:</span>
                <span className="text-gray-900">{formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Priority:</span>
                <span className="text-gray-900">{formData.priority}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              We've sent a confirmation email to <strong>{formData.email}</strong> with your ticket details.
              You can use your ticket number to track progress.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleTrackTicket}>
                Track This Ticket
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    name: '',
                    email: '',
                    appName: '',
                    appVersion: '',
                    issueType: '',
                    priority: '',
                    subject: '',
                    description: '',
                  });
                  setAttachments([]);
                }}
              >
                Submit Another Ticket
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Submit Support Ticket</h1>
        <p className="text-gray-600">
          Please provide as much detail as possible to help us resolve your issue quickly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name *"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={errors.name}
              placeholder="Enter your full name"
            />
            <Input
              label="Email Address *"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              placeholder="Enter your email address"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Application Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Application Name *"
              name="appName"
              value={formData.appName}
              onChange={handleInputChange}
              error={errors.appName}
              options={appNames}
              placeholder="Select the application"
            />
            <Input
              label="Application Version"
              name="appVersion"
              value={formData.appVersion}
              onChange={handleInputChange}
              placeholder="e.g., 2.1.0 (if known)"
              helperText="You can find this in the app's About section"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Issue Details</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Issue Type *"
                name="issueType"
                value={formData.issueType}
                onChange={handleInputChange}
                error={errors.issueType}
                options={issueTypes}
                placeholder="Select issue type"
              />
              <Select
                label="Priority Level *"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                error={errors.priority}
                options={priorities}
                placeholder="Select priority level"
              />
            </div>
            
            <Input
              label="Subject *"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              error={errors.subject}
              placeholder="Brief description of the issue"
            />
            
            <Textarea
              label="Detailed Description *"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              error={errors.description}
              placeholder="Please provide a detailed description of the issue, including steps to reproduce, error messages, and any other relevant information..."
              rows={6}
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Attachments (Optional)</h2>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop files here, or click to select
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Supported: Images, PDFs, text files, logs (Max 10MB each, 5 files total)
              </p>
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.txt,.log"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button type="button" variant="outline" size="sm">
                  Choose Files
                </Button>
              </label>
            </div>
            
            {attachments.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">Attached Files:</h3>
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-gray-400 hover:text-error-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SubmitTicket;