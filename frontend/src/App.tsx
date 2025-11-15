import { useEffect } from 'react';
import EmployeeForm, { type EmployeeProfile } from './components/EmployeeForm';
import ProgressTracker from './components/ProgressTracker';
import ResultsDisplay from './components/ResultsDisplay';
import StatusCard from './components/StatusCard';
import { useOnboarding } from './hooks/useOnboarding';
import './App.css';

function App() {
  const {
    isProcessing,
    currentStep,
    steps,
    result,
    error,
    healthStatus,
    startOnboarding,
    reset,
    checkSystemHealth
  } = useOnboarding();

  useEffect(() => {
    // Check system health on mount
    checkSystemHealth();
  }, [checkSystemHealth]);

  const handleSubmit = async (profile: EmployeeProfile) => {
    try {
      await startOnboarding(profile);
    } catch (error) {
      // Error is handled in the hook
      console.error('Onboarding failed:', error);
    }
  };

  const showForm = !isProcessing && !result;
  const showProgress = isProcessing;
  const showResults = result && !isProcessing;
  const showError = error && !isProcessing;

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <header className="bg-[#022043] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Workday Logo */}
              <img 
                src="/workday.png" 
                alt="Workday" 
                className="h-12 w-12 object-contain shrink-0"
              />
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-white leading-tight">OnBoard AI</h1>
                <p className="text-xs text-white/90 mt-0.5">Autonomous Employee Onboarding System</p>
              </div>
            </div>
            {healthStatus && (
              <div className="flex items-center space-x-4 text-sm">
                <div className={`flex items-center space-x-2 ${healthStatus.knowledgeBase ? 'text-white' : 'text-white/70'}`}>
                 
                </div>
                <div className={`flex items-center space-x-2 ${healthStatus.apiKeyConfigured ? 'text-white' : 'text-white/70'}`}>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* System Status Warnings */}
          {healthStatus && !healthStatus.knowledgeBase && (
            <StatusCard
              type="warning"
              title="Knowledge Base Not Found"
              message="Please run 'python backend/setup_pdfs.py' first to initialize the knowledge base."
            />
          )}
          {healthStatus && !healthStatus.apiKeyConfigured && (
            <StatusCard
              type="error"
              title="OpenAI API Key Not Configured"
              message="Please add OPENAI_API_KEY to your .env file."
            />
          )}

          {/* Error Message */}
          {showError && (
            <StatusCard
              type="error"
              title="Onboarding Failed"
              message={error || 'An unexpected error occurred. Please try again.'}
            />
          )}

          {/* Employee Form */}
          {showForm && (
            <>
              <div className="bg-white border border-[#F5F7FA] rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="shrink-0 text-[#022043]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-[#022043] mb-1">About This Process</h3>
                    <p className="text-sm text-[#4A5568]">
                      This process typically takes 30-90 seconds as AI agents research policies and create personalized content. 
                      This is normal for each new employee profile.
                    </p>
                  </div>
                </div>
              </div>
              <EmployeeForm onSubmit={handleSubmit} isLoading={false} />
            </>
          )}

          {/* Progress Tracker */}
          {showProgress && (
            <>
              <ProgressTracker
                currentStep={currentStep}
                steps={steps}
                executionTime={undefined}
              />
              <div className="bg-white border border-[#F5F7FA] rounded-lg p-4">
                <p className="text-sm text-[#4A5568]">
                  ⏱️ <strong>Note:</strong> This may take 30-90 seconds. Please wait while the AI agents process the onboarding package.
                </p>
              </div>
            </>
          )}

          {/* Results Display */}
          {showResults && result && (
            <>
              <ProgressTracker
                currentStep={steps.length}
                steps={steps}
                executionTime={result.execution_time}
              />
              <ResultsDisplay
                packageContent={result.package_content || 'No content available'}
                outputFile={result.output_file}
                employeeName={result.message.match(/for (.+?)$/)?.[1] || 'Employee'}
                executionTime={result.execution_time}
                onReset={reset}
              />
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#F5F7FA] mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-[#4A5568]">
            <p>OnBoard AI - Autonomous Employee Onboarding System</p>
            <p className="mt-1">Powered by CrewAI multi-agent system</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
