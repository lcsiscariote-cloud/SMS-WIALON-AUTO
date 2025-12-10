import React, { useEffect } from 'react';
import { useWialonApi } from './hooks/useWialonApi';
import { UnitList } from './components/UnitList';
import { ResultModal } from './components/ResultModal';
import { ServerIcon } from './components/Icons';

function App() {
  const { 
    units, 
    loading, 
    error, 
    serverStatus, 
    executionResult, 
    checkServerHealth, 
    fetchUnits, 
    triggerTest, 
    clearResult 
  } = useWialonApi();

  useEffect(() => {
    checkServerHealth();
    fetchUnits();
  }, [checkServerHealth, fetchUnits]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
              <span className="font-bold text-white text-lg">W</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Wialon <span className="text-blue-500">SMS Bridge</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-full border border-gray-700">
              <ServerIcon className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-300">System Status:</span>
              <div className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  serverStatus === 'ok' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 
                  serverStatus === 'error' ? 'bg-red-500' : 'bg-gray-500'
                }`}></span>
                <span className={`text-xs uppercase font-bold ${
                   serverStatus === 'ok' ? 'text-green-500' : 
                   serverStatus === 'error' ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {serverStatus === 'unknown' ? 'Checking...' : serverStatus}
                </span>
              </div>
            </div>
            <button 
              onClick={() => { checkServerHealth(); fetchUnits(); }} 
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
              title="Refresh Data"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Connected Units</h2>
          <p className="text-gray-400 max-w-2xl">
            Select a unit with a configured phone number to manually test the SMS protocol execution. 
            This bypasses the Wialon webhook system.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg flex items-start gap-3">
             <div className="p-1 bg-red-900/50 rounded-full text-red-200">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
             </div>
             <div>
               <h3 className="text-sm font-bold text-red-200">Error Detected</h3>
               <p className="text-sm text-red-300 mt-0.5">{error}</p>
             </div>
          </div>
        )}

        <UnitList 
          units={units} 
          loading={loading && units.length === 0} // Only show skeleton if no data
          onTrigger={triggerTest}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          Wialon SMS Microservice Bridge Dashboard &copy; {new Date().getFullYear()}
        </div>
      </footer>

      {/* Modals */}
      {executionResult && (
        <ResultModal result={executionResult} onClose={clearResult} />
      )}
      
      {/* Global Loading Overlay (for Trigger Action) */}
      {loading && units.length > 0 && (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px] flex items-center justify-center cursor-wait">
          <div className="bg-gray-800 rounded-lg p-4 shadow-xl flex items-center gap-3 border border-gray-700">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
            <span className="text-sm font-medium">Processing request...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
