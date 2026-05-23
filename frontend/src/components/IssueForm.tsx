import React, { useState, useEffect } from 'react';
import { Issue } from '../types';
import { 
  MdTitle, 
  MdDescription, 
  MdPriorityHigh, 
  MdBugReport,
  MdClose,
  MdSave,
  MdRefresh,
  MdWarning,
  MdInfo,
  MdCheckCircle,
  MdTimeline
} from 'react-icons/md';
import { FiAlertTriangle, FiFlag } from 'react-icons/fi';
import { GiCancel } from 'react-icons/gi';

interface IssueFormProps {
  initialData?: Partial<Issue>;
  onSubmit: (data: Partial<Issue>) => void;
  onCancel: () => void;
}

const IssueForm: React.FC<IssueFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || 'Open',
    priority: initialData?.priority || 'Medium',
    severity: initialData?.severity || 'Minor',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(formData.description.length);

  // Priority configuration
  const priorityConfig = {
    Low: { color: 'bg-green-100 text-green-800 border-green-200', icon: <MdCheckCircle className="text-green-600" />, gradient: 'from-green-50 to-green-100' },
    Medium: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <MdInfo className="text-yellow-600" />, gradient: 'from-yellow-50 to-yellow-100' },
    High: { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: <MdWarning className="text-orange-600" />, gradient: 'from-orange-50 to-orange-100' },
    Critical: { color: 'bg-red-100 text-red-800 border-red-200', icon: <FiAlertTriangle className="text-red-600" />, gradient: 'from-red-50 to-red-100' },
  };

  // Status configuration
  const statusConfig = {
    Open: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: <MdInfo className="text-blue-600" /> },
    'In Progress': { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: <MdTimeline className="text-purple-600" /> },
    Resolved: { color: 'bg-green-100 text-green-800 border-green-200', icon: <MdCheckCircle className="text-green-600" /> },
    Closed: { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: <MdClose className="text-gray-600" /> },
  };

  // Severity configuration
  const severityConfig = {
    Minor: { color: 'bg-gray-100 text-gray-800', icon: <MdInfo className="text-gray-600" /> },
    Major: { color: 'bg-orange-100 text-orange-800', icon: <MdWarning className="text-orange-600" /> },
    Critical: { color: 'bg-red-100 text-red-800', icon: <FiAlertTriangle className="text-red-600" /> },
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'title':
        if (!value.trim()) return 'Title is required';
        if (value.length < 5) return 'Title must be at least 5 characters';
        if (value.length > 100) return 'Title cannot exceed 100 characters';
        return '';
      case 'description':
        if (!value.trim()) return 'Description is required';
        if (value.length < 10) return 'Description must be at least 10 characters';
        if (value.length > 1000) return 'Description cannot exceed 1000 characters';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'description') {
      setCharCount(value.length);
    }
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    Object.keys(formData).forEach(key => {
      if (key === 'title' || key === 'description') {
        const error = validateField(key, formData[key as keyof typeof formData] as string);
        if (error) {
          newErrors[key] = error;
          isValid = false;
        }
      }
    });
    
    setErrors(newErrors);
    setTouched({ title: true, description: true });
    
    if (isValid) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getCharacterColor = () => {
    if (charCount < 100) return 'text-green-600';
    if (charCount < 500) return 'text-yellow-600';
    if (charCount < 800) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {initialData ? 'Edit Issue' : 'Create New Issue'}
              </h2>
              <p className="text-blue-100 text-sm">
                {initialData 
                  ? 'Update the issue details below' 
                  : 'Fill in the details to create a new issue'}
              </p>
            </div>
            <div className="bg-white/20 rounded-full p-3 backdrop-blur-sm">
              <MdBugReport className="text-3xl" />
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              <span className="flex items-center gap-2">
                <MdTitle className="text-blue-500" />
                Issue Title
                <span className="text-red-500 text-xs">*</span>
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 pl-11 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                  touched.title && errors.title 
                    ? 'border-red-500 focus:border-red-500' 
                    : touched.title && !errors.title
                    ? 'border-green-500'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                placeholder="Enter a descriptive title for the issue"
              />
              <MdTitle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {touched.title && errors.title && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <FiAlertTriangle className="h-3 w-3" />
                {errors.title}
              </p>
            )}
            {touched.title && !errors.title && formData.title && (
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <MdCheckCircle className="h-3 w-3" />
                Looks good!
              </p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              <span className="flex items-center gap-2">
                <MdDescription className="text-blue-500" />
                Description
                <span className="text-red-500 text-xs">*</span>
              </span>
            </label>
            <div className="relative">
              <textarea
                name="description"
                required
                rows={6}
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 pl-11 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none ${
                  touched.description && errors.description 
                    ? 'border-red-500 focus:border-red-500' 
                    : touched.description && !errors.description
                    ? 'border-green-500'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                placeholder="Describe the issue in detail. Include steps to reproduce, expected behavior, etc."
              />
              <MdDescription className="absolute left-3 top-3 text-gray-400" />
            </div>
            
            {/* Character Counter */}
            <div className="flex justify-between items-center mt-1">
              {touched.description && errors.description && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <FiAlertTriangle className="h-3 w-3" />
                  {errors.description}
                </p>
              )}
              <div className={`text-xs ml-auto flex items-center gap-2 ${getCharacterColor()}`}>
                <span>{charCount} / 1000 characters</span>
                <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      charCount < 100 ? 'bg-green-500' : 
                      charCount < 500 ? 'bg-yellow-500' : 
                      charCount < 800 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${(charCount / 1000) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Status, Priority, Severity Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Status Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                <span className="flex items-center gap-2">
                  <MdTimeline className="text-purple-500" />
                  Status
                </span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 cursor-pointer hover:border-purple-300"
              >
                {Object.entries(statusConfig).map(([key, config]) => (
                  <option key={key} value={key} className="py-2">
                    {key}
                  </option>
                ))}
              </select>
              <div className={`mt-2 p-2 rounded-lg ${statusConfig[formData.status as keyof typeof statusConfig]?.color} flex items-center gap-2 text-xs`}>
                {statusConfig[formData.status as keyof typeof statusConfig]?.icon}
                <span>Current status: {formData.status}</span>
              </div>
            </div>

            {/* Priority Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                <span className="flex items-center gap-2">
                  <MdPriorityHigh className="text-orange-500" />
                  Priority
                </span>
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 cursor-pointer hover:border-orange-300"
              >
                {Object.keys(priorityConfig).map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
              <div className={`mt-2 p-2 rounded-lg ${priorityConfig[formData.priority as keyof typeof priorityConfig]?.color} flex items-center gap-2 text-xs`}>
                {priorityConfig[formData.priority as keyof typeof priorityConfig]?.icon}
                <span>{formData.priority} priority level</span>
              </div>
            </div>

            {/* Severity Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                <span className="flex items-center gap-2">
                  <FiFlag className="text-red-500" />
                  Severity
                </span>
              </label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 cursor-pointer hover:border-red-300"
              >
                {Object.keys(severityConfig).map((severity) => (
                  <option key={severity} value={severity}>
                    {severity}
                  </option>
                ))}
              </select>
              <div className={`mt-2 p-2 rounded-lg ${severityConfig[formData.severity as keyof typeof severityConfig]?.color} flex items-center gap-2 text-xs`}>
                {severityConfig[formData.severity as keyof typeof severityConfig]?.icon}
                <span>{formData.severity} severity level</span>
              </div>
            </div>
          </div>

          {/* Preview Card */}
          {(formData.title || formData.description) && (
            <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <MdInfo className="text-blue-500" />
                Preview
              </h4>
              <div className="space-y-2">
                {formData.title && (
                  <div className="bg-white rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Title</p>
                        <p className="text-sm font-medium text-gray-900">{formData.title}</p>
                      </div>
                      <div className="flex gap-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${priorityConfig[formData.priority as keyof typeof priorityConfig]?.color}`}>
                          {formData.priority}
                        </span>
                      </div>
                    </div>
                    {formData.description && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Description</p>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {formData.description}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center gap-2 font-medium"
          >
            <GiCancel className="text-lg" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg flex items-center gap-2 font-medium"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {initialData ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <MdSave className="text-lg" />
                {initialData ? 'Update Issue' : 'Create Issue'}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Add Tailwind CSS line-clamp if not available */}
      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default IssueForm;