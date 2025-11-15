import { useState } from 'react';

export interface EmployeeProfile {
  name: string;
  role: string;
  department: string;
  location: string;
  work_arrangement: 'remote' | 'hybrid' | 'in_office';
  employment_type: 'full_time' | 'part_time';
  start_date: string;
}

interface EmployeeFormProps {
  onSubmit: (profile: EmployeeProfile) => void;
  isLoading?: boolean;
}

const departments = [
  'Engineering',
  'Sales',
  'HR',
  'Marketing',
  'Finance',
  'Operations',
  'Other'
];

const locations = [
  'California',
  'Texas',
  'New York',
  'Washington',
  'Florida',
  'Illinois',
  'Other'
];

export default function EmployeeForm({ onSubmit, isLoading = false }: EmployeeFormProps) {
  const [formData, setFormData] = useState<EmployeeProfile>({
    name: '',
    role: '',
    department: 'Engineering',
    location: 'California',
    work_arrangement: 'remote',
    employment_type: 'full_time',
    start_date: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EmployeeProfile, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof EmployeeProfile, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.role.trim()) {
      newErrors.role = 'Role is required';
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof EmployeeProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8 border border-[#F5F7FA]">
      <h2 className="text-2xl font-bold text-[#022043] mb-6">Employee Profile</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#4A5568] mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg text-[#1A1A1A] bg-white focus:ring-2 focus:ring-[#022043] focus:border-transparent placeholder:text-[#718096] disabled:bg-[#F5F7FA] disabled:text-[#718096] disabled:cursor-not-allowed ${
                errors.name ? 'border-red-500' : 'border-[#F5F7FA]'
              }`}
              placeholder="e.g., Sarah Chen"
              disabled={isLoading}
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-[#4A5568] mb-2">
              Role <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="role"
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg text-[#1A1A1A] bg-white focus:ring-2 focus:ring-[#022043] focus:border-transparent placeholder:text-[#718096] disabled:bg-[#F5F7FA] disabled:text-[#718096] disabled:cursor-not-allowed ${
                errors.role ? 'border-red-500' : 'border-[#F5F7FA]'
              }`}
              placeholder="e.g., Senior Software Engineer"
              disabled={isLoading}
            />
            {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role}</p>}
          </div>

          {/* Department */}
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-[#4A5568] mb-2">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              id="department"
              value={formData.department}
              onChange={(e) => handleChange('department', e.target.value)}
              className="w-full px-4 py-2 border border-[#F5F7FA] rounded-lg text-[#1A1A1A] bg-white focus:ring-2 focus:ring-[#022043] focus:border-transparent disabled:bg-[#F5F7FA] disabled:text-[#718096] disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-[#4A5568] mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <select
              id="location"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className="w-full px-4 py-2 border border-[#F5F7FA] rounded-lg text-[#1A1A1A] bg-white focus:ring-2 focus:ring-[#022043] focus:border-transparent disabled:bg-[#F5F7FA] disabled:text-[#718096] disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Work Arrangement */}
          <div>
            <label className="block text-sm font-medium text-[#4A5568] mb-2">
              Work Arrangement <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              {(['remote', 'hybrid', 'in_office'] as const).map(option => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name="work_arrangement"
                    value={option}
                    checked={formData.work_arrangement === option}
                    onChange={(e) => handleChange('work_arrangement', e.target.value as EmployeeProfile['work_arrangement'])}
                    className="mr-2 text-[#022043] focus:ring-[#022043]"
                    disabled={isLoading}
                  />
                  <span className="text-sm text-[#4A5568] capitalize">
                    {option.replace('_', ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Employment Type */}
          <div>
            <label className="block text-sm font-medium text-[#4A5568] mb-2">
              Employment Type <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              {(['full_time', 'part_time'] as const).map(option => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name="employment_type"
                    value={option}
                    checked={formData.employment_type === option}
                    onChange={(e) => handleChange('employment_type', e.target.value as EmployeeProfile['employment_type'])}
                    className="mr-2 text-[#022043] focus:ring-[#022043]"
                    disabled={isLoading}
                  />
                  <span className="text-sm text-[#4A5568] capitalize">
                    {option.replace('_', ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Start Date */}
          <div className="md:col-span-2">
            <label htmlFor="start_date" className="block text-sm font-medium text-[#4A5568] mb-2">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="start_date"
              value={formData.start_date}
              onChange={(e) => handleChange('start_date', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-2 border rounded-lg text-[#1A1A1A] bg-white focus:ring-2 focus:ring-[#022043] focus:border-transparent disabled:bg-[#F5F7FA] disabled:text-[#718096] disabled:cursor-not-allowed ${
                errors.start_date ? 'border-red-500' : 'border-[#F5F7FA]'
              }`}
              disabled={isLoading}
            />
            {errors.start_date && <p className="mt-1 text-sm text-red-500">{errors.start_date}</p>}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
              isLoading
                ? 'bg-[#718096] cursor-not-allowed'
                : 'bg-[#022043] hover:bg-[#022043] focus:outline-none focus:ring-2 focus:ring-[#022043] focus:ring-offset-2'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              ' Run Onboarding'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

