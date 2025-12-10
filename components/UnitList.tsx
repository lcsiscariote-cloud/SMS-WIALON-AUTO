import React from 'react';
import { UnitResponse } from '../types';
import { SatelliteIcon, PhoneIcon, PhoneOffIcon, ZapIcon } from './Icons';

interface UnitListProps {
  units: UnitResponse[];
  loading: boolean;
  onTrigger: (unitId: number) => void;
}

export const UnitList: React.FC<UnitListProps> = ({ units, loading, onTrigger }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-40 bg-gray-800 rounded-xl border border-gray-700"></div>
        ))}
      </div>
    );
  }

  if (units.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-800/30 rounded-xl border border-gray-800 border-dashed">
        <SatelliteIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-300">No units found</h3>
        <p className="text-gray-500 mt-2">Ensure Wialon is connected or try refreshing.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {units.map((unit) => {
        const hasPhone = Boolean(unit.phone);
        
        return (
          <div 
            key={unit.unit_id} 
            className="group relative bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-blue-500/50 transition-all duration-200 rounded-xl overflow-hidden shadow-lg"
          >
            {/* Status Bar */}
            <div className={`absolute top-0 left-0 w-1 h-full ${hasPhone ? 'bg-blue-500' : 'bg-red-500'}`}></div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${hasPhone ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-400'}`}>
                    <SatelliteIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white group-hover:text-blue-200 transition-colors">
                      {unit.name}
                    </h3>
                    <span className="text-xs font-mono text-gray-500">ID: {unit.unit_id}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Device Type</span>
                  <span className="text-gray-200 font-medium">{unit.gps_type}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Connection</span>
                  {hasPhone ? (
                    <div className="flex items-center gap-1.5 text-green-400">
                      <PhoneIcon className="w-3.5 h-3.5" />
                      <span className="font-mono">{unit.phone}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-red-400 bg-red-500/10 px-2 py-0.5 rounded">
                      <PhoneOffIcon className="w-3.5 h-3.5" />
                      <span className="font-semibold">No Phone</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => onTrigger(unit.unit_id)}
                disabled={!hasPhone}
                className={`w-full py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                  hasPhone 
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20' 
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                }`}
              >
                <ZapIcon className="w-4 h-4" />
                <span>{hasPhone ? 'Test SMS Protocol' : 'SMS Unavailable'}</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
