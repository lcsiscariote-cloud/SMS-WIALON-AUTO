/**
 * Schema definitions based on openapi.yaml
 */

export interface UnitResponse {
  unit_id: number;
  name: string;
  gps_type: string;
  phone?: string | null;
}

export interface ManualTriggerRequest {
  unit_id: number;
  operator?: string;
}

export interface CommandResult {
  command: string;
  status: string;
  error?: string;
}

export interface ProtocolExecutionResult {
  unit_id: number;
  phone: string;
  commands: CommandResult[];
}

export interface HealthResponse {
  status: string;
}
