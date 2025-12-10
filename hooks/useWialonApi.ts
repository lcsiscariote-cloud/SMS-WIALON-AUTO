import { useState, useCallback } from 'react';
import { api } from '../services/api';
import { UnitResponse, ProtocolExecutionResult } from '../types';

interface UseWialonReturn {
  units: UnitResponse[];
  loading: boolean;
  error: string | null;
  serverStatus: 'unknown' | 'ok' | 'error';
  executionResult: ProtocolExecutionResult | null;
  checkServerHealth: () => Promise<void>;
  fetchUnits: () => Promise<void>;
  triggerTest: (unitId: number) => Promise<void>;
  clearResult: () => void;
}

export const useWialonApi = (): UseWialonReturn => {
  const [units, setUnits] = useState<UnitResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<'unknown' | 'ok' | 'error'>('unknown');
  const [executionResult, setExecutionResult] = useState<ProtocolExecutionResult | null>(null);

  const checkServerHealth = useCallback(async () => {
    try {
      const res = await api.getHealth();
      if (res.status === 'ok') {
        setServerStatus('ok');
      } else {
        setServerStatus('error');
      }
    } catch (err) {
      setServerStatus('error');
    }
  }, []);

  const fetchUnits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getUnits();
      setUnits(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch units');
    } finally {
      setLoading(false);
    }
  }, []);

  const triggerTest = useCallback(async (unitId: number) => {
    setLoading(true);
    setError(null);
    setExecutionResult(null);
    try {
      const result = await api.triggerManual({ unit_id: unitId, operator: 'ui-dashboard' });
      setExecutionResult(result);
    } catch (err: any) {
      setError(err.message || 'Failed to trigger manual test');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setExecutionResult(null);
    setError(null);
  }, []);

  return {
    units,
    loading,
    error,
    serverStatus,
    executionResult,
    checkServerHealth,
    fetchUnits,
    triggerTest,
    clearResult
  };
};
