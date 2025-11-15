import type { EmployeeProfile } from '../components/EmployeeForm';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface OnboardingResponse {
  success: boolean;
  message: string;
  execution_time: number;
  output_file: string;
  package_content: string | null;
}

export interface HealthCheckResponse {
  status: string;
  knowledge_base: string;
  api_key_configured: boolean;
}

export async function checkHealth(): Promise<HealthCheckResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    
    if (!response.ok) {
      throw new Error('Health check failed');
    }
    
    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Cannot connect to backend API at ${API_BASE_URL}. Please make sure the backend server is running on port 8000.`);
    }
    throw error;
  }
}

export async function submitOnboarding(profile: EmployeeProfile): Promise<OnboardingResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/onboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Cannot connect to backend API at ${API_BASE_URL}. Please make sure the backend server is running. Start it with: cd backend && python -m uvicorn api:app --reload --port 8000`);
    }
    throw error;
  }
}

export async function downloadPackage(filename: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/output/${filename}`);
  
  if (!response.ok) {
    throw new Error('Failed to download package');
  }
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

