import { useState, useCallback } from 'react';
import { submitOnboarding, checkHealth } from '../services/api';
import type { EmployeeProfile } from '../components/EmployeeForm';
import type { OnboardingResponse } from '../services/api';

type StepStatus = 'pending' | 'in_progress' | 'completed' | 'error';

interface OnboardingState {
  isProcessing: boolean;
  currentStep: number;
  steps: Array<{
    id: number;
    name: string;
    description: string;
    status: StepStatus;
  }>;
  result: OnboardingResponse | null;
  error: string | null;
  healthStatus: {
    knowledgeBase: boolean;
    apiKeyConfigured: boolean;
  } | null;
}

const INITIAL_STEPS = [
  {
    id: 1,
    name: 'Policy Researcher',
    description: 'Researching relevant Workday policies...',
    status: 'pending' as StepStatus
  },
  {
    id: 2,
    name: 'Content Writer',
    description: 'Creating personalized onboarding package...',
    status: 'pending' as StepStatus
  }
];

export function useOnboarding() {
  const [state, setState] = useState<OnboardingState>({
    isProcessing: false,
    currentStep: 0,
    steps: INITIAL_STEPS,
    result: null,
    error: null,
    healthStatus: null
  });

  const checkSystemHealth = useCallback(async () => {
    try {
      const health = await checkHealth();
      setState(prev => ({
        ...prev,
        healthStatus: {
          knowledgeBase: health.knowledge_base === 'ready',
          apiKeyConfigured: health.api_key_configured
        }
      }));
      return health;
    } catch (error) {
      console.error('Health check failed:', error);
      return null;
    }
  }, []);

  const startOnboarding = useCallback(async (profile: EmployeeProfile) => {
    setState({
      isProcessing: true,
      currentStep: 0,
      steps: INITIAL_STEPS.map(step => ({ ...step, status: 'pending' })),
      result: null,
      error: null,
      healthStatus: state.healthStatus
    });

    try {
      // Step 1: Research (simulate with progress)
      setState(prev => ({
        ...prev,
        currentStep: 1,
        steps: prev.steps.map((step, index) =>
          index === 0
            ? { ...step, status: 'in_progress' as StepStatus, description: 'Researching policies from knowledge base...' }
            : step
        )
      }));

      // Step 2: Writing
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for UI feedback
      setState(prev => ({
        ...prev,
        steps: prev.steps.map((step, index) =>
          index === 0
            ? { ...step, status: 'completed' as StepStatus }
            : index === 1
            ? { ...step, status: 'in_progress' as StepStatus, description: 'Generating personalized content...' }
            : step
        )
      }));

      // Actual API call
      const result = await submitOnboarding(profile);

      // Mark all steps as completed
      setState(prev => ({
        ...prev,
        isProcessing: false,
        currentStep: 2,
        steps: prev.steps.map(step => ({ ...step, status: 'completed' as StepStatus })),
        result
      }));

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: errorMessage,
        steps: prev.steps.map((step, index) =>
          index === prev.currentStep
            ? { ...step, status: 'error' as StepStatus }
            : step.status === 'in_progress'
            ? { ...step, status: 'error' as StepStatus }
            : step
        )
      }));

      throw error;
    }
  }, [state.healthStatus]);

  const reset = useCallback(() => {
    setState({
      isProcessing: false,
      currentStep: 0,
      steps: INITIAL_STEPS,
      result: null,
      error: null,
      healthStatus: state.healthStatus
    });
  }, [state.healthStatus]);

  return {
    ...state,
    startOnboarding,
    reset,
    checkSystemHealth
  };
}

