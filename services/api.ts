import { API_BASE_URL } from '../constants';
import { HealthResponse, UnitResponse, ProtocolExecutionResult, ManualTriggerRequest } from '../types';

// CONFIGURATION
// Set this to false to connect to the real backend defined in API_BASE_URL
const USE_MOCK_DATA = true;

/**
 * MOCK DATA STORE
 */
const MOCK_UNITS: UnitResponse[] = [
  { 
    unit_id: 27718329, 
    name: "316632", 
    gps_type: "19540384", 
    phone: "+423663940615251" 
  },
  { 
    unit_id: 25357161, 
    name: "M-02 GRT625F", 
    gps_type: "19540374", 
    phone: "+525527283043" 
  },
  { 
    unit_id: 20721452, 
    name: "caja 24", 
    gps_type: "15624596", 
    phone: "+423663920128206" 
  },
  { 
    unit_id: 999999, 
    name: "Demo Unit (No Sim)", 
    gps_type: "GENERIC_V2", 
    phone: null 
  }
];

const simulateDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

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
  getHealth: async (): Promise<HealthResponse> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      return { status: 'ok' };
    }
    return client<HealthResponse>('/health');
  },
  
  getUnits: async (resourceId?: number): Promise<UnitResponse[]> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      return MOCK_UNITS;
    }
    const query = resourceId ? `?resource_id=${resourceId}` : '';
    return client<UnitResponse[]>(`/units/${query}`);
  },

  triggerManual: async (data: ManualTriggerRequest): Promise<ProtocolExecutionResult> => {
    if (USE_MOCK_DATA) {
      await simulateDelay(800); // Slightly longer delay for "action" feeling
      
      // Find the unit to make the mock response realistic
      const unit = MOCK_UNITS.find(u => u.unit_id === data.unit_id);
      
      return {
        unit_id: data.unit_id,
        phone: unit?.phone || "+00000000000",
        commands: [
          { command: "getver", status: "sent" },
          { command: "getstatus", status: "sent" },
          { command: "param_request", status: "ok" }
        ]
      };
    }
    
    return client<ProtocolExecutionResult>('/manual/trigger', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};