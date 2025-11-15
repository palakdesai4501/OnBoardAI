interface ProgressTrackerProps {
  currentStep: number;
  steps: Array<{
    id: number;
    name: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed' | 'error';
  }>;
  executionTime?: number;
}

export default function ProgressTracker({ currentStep, steps, executionTime }: ProgressTrackerProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'in_progress':
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-[#022043] rounded-full flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-[#F5F7FA] rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-[#E8EBF0] rounded-full"></div>
          </div>
        );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-500';
      case 'in_progress':
        return 'border-[#022043]';
      case 'error':
        return 'border-red-500';
      default:
        return 'border-[#F5F7FA]';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8 border border-[#F5F7FA]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#022043]">Progress</h2>
        {executionTime !== undefined && (
          <div className="text-sm text-[#4A5568]">
            ⏱️ {executionTime.toFixed(1)}s
          </div>
        )}
      </div>

      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={step.id} className="relative">
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className={`absolute left-4 top-8 w-0.5 h-full ${
                step.status === 'completed' ? 'bg-green-500' : 
                step.status === 'in_progress' ? 'bg-[#022043]' : 
                'bg-[#F5F7FA]'
              }`}></div>
            )}

            <div className="flex items-start space-x-4">
              {getStatusIcon(step.status)}
              
              <div className={`flex-1 pb-6 ${
                index === steps.length - 1 ? 'pb-0' : ''
              }`}>
                <div className={`border-l-4 pl-4 ${getStatusColor(step.status)}`}>
                  <h3 className={`text-lg font-semibold ${
                    step.status === 'completed' ? 'text-green-700' :
                    step.status === 'in_progress' ? 'text-[#022043]' :
                    step.status === 'error' ? 'text-red-700' :
                    'text-[#4A5568]'
                  }`}>
                    {step.name}
                  </h3>
                  <p className="text-sm text-[#4A5568] mt-1">{step.description}</p>
                  
                  {step.status === 'in_progress' && (
                    <div className="mt-2">
                      <div className="w-full bg-[#F5F7FA] rounded-full h-2">
                        <div className="bg-[#022043] h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

