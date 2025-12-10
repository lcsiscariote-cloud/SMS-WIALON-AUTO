import { API_BASE_URL } from '../constants';
import { HealthResponse, UnitResponse, ProtocolExecutionResult, ManualTriggerRequest } from '../types';

/**
 * Generic fetch wrapper with error handling
 */
async function client<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorMessage = `API Error: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }

  return response.json();
}

export const api = {
  getHealth: () => client<HealthResponse>('/health'),
  
  getUnits: (resourceId?: number) => {
    const query = resourceId ? `?resource_id=${resourceId}` : '';
    return client<UnitResponse[]>(`/units/${query}`);
  },

  triggerManual: (data: ManualTriggerRequest) => {
    return client<ProtocolExecutionResult>('/manual/trigger', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
