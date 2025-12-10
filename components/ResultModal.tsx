import React from 'react';
import { ProtocolExecutionResult } from '../types';
import { CheckCircleIcon, AlertCircleIcon } from './Icons';

interface ResultModalProps {
  result: ProtocolExecutionResult;
  onClose: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ result, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Execution Result</h2>
            <p className="text-sm text-gray-400 mt-1">
              Unit ID: <span className="font-mono text-blue-400">{result.unit_id}</span> • Phone: <span className="font-mono text-blue-400">{result.phone}</span>
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="space-y-4">
            {result.commands.map((cmd, idx) => {
              const isSuccess = cmd.status === 'sent' || cmd.status === 'ok';
              return (
                <div key={idx} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-xs font-mono uppercase">Command</span>
                      <span className="font-mono text-yellow-400 font-semibold">{cmd.command}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                      isSuccess ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {isSuccess ? <CheckCircleIcon className="w-3 h-3" /> : <AlertCircleIcon className="w-3 h-3" />}
                      <span className="uppercase">{cmd.status}</span>
                    </div>
                  </div>
                  
                  {cmd.error && (
                    <div className="mt-2 text-sm text-red-400 font-mono bg-red-950/30 p-2 rounded">
                      Error: {cmd.error}
                    </div>
                  )}
                  
                  {isSuccess && (
                     <div className="mt-1 text-xs text-gray-500 font-mono">
                       Packet payload generated and sent to SMS Gateway.
                     </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-gray-700 bg-gray-800/50 rounded-b-xl flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Close Logs
          </button>
        </div>
      </div>
    </div>
  );
};
