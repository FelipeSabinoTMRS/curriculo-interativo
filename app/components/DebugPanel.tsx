import React, { useState, useEffect } from 'react';
import { Database, CheckCircle, XCircle, AlertCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import type { DatabaseConnection } from '~/types';

interface DebugPanelProps {
  connectionStatus: DatabaseConnection;
  onRefreshConnection: () => void;
  isDarkTheme?: boolean;
}

export default function DebugPanel({ connectionStatus, onRefreshConnection, isDarkTheme = false }: DebugPanelProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [clientTime, setClientTime] = useState<string>('');

  // Fix hydration error by rendering time only on client
  useEffect(() => {
    setClientTime(new Date(connectionStatus.lastCheck).toLocaleTimeString('pt-BR'));
  }, [connectionStatus.lastCheck]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefreshConnection();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getStatusIcon = () => {
    if (connectionStatus.connected) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    } else {
      return <XCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusText = () => {
    if (connectionStatus.connected) {
      return "Conectado";
    } else {
      return "Desconectado";
    }
  };

  return (
    <div className="fixed top-20 right-4 z-40 no-print max-w-[280px] w-full debug-panel-container">
      <div className={`backdrop-blur-lg border rounded-xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 ${isDarkTheme ? 'bg-gray-800/90 border-gray-600/50 hover:bg-gray-700/90 hover:border-gray-500/70' : 'bg-white/25 border-gray-400/50 hover:bg-white/30 hover:border-gray-400/70'}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-sm font-semibold flex items-center gap-2 ${isDarkTheme ? 'text-blue-300' : 'text-ai-blue-600'}`}>
            <Database className={`w-4 h-4 ${isDarkTheme ? 'text-blue-300' : 'text-ai-blue-600'}`} />
            Debug
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`p-1.5 rounded transition-colors ${isDarkTheme ? 'hover:bg-gray-600/60' : 'hover:bg-gray-200/60'}`}
              title="Atualizar status"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''} ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`} />
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className={`p-1.5 rounded transition-colors ${isDarkTheme ? 'hover:bg-gray-600/60' : 'hover:bg-gray-200/60'}`}
              title={isMinimized ? 'Expandir' : 'Minimizar'}
            >
              {isMinimized ? <ChevronDown className={`w-3 h-3 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`} /> : <ChevronUp className={`w-3 h-3 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`} />}
            </button>
          </div>
        </div>

              {!isMinimized && (
          <div className="space-y-2">
            <div className={`backdrop-blur-sm rounded-lg p-3 border shadow-sm ${isDarkTheme ? 'bg-gray-700/40 border-gray-500/50' : 'bg-white/40 border-gray-300/50'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-semibold ${isDarkTheme ? 'text-gray-200' : 'text-gray-800'}`}>Banco D1</span>
                {getStatusIcon()}
              </div>
              <div className="text-xs">
                <span className={connectionStatus.connected ? 'text-green-600 font-medium' : 'text-red-600 font-semibold'}>
                  {getStatusText()}
                </span>
              </div>
              <div className={`text-xs mt-1 font-medium ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                {clientTime || '...'}
              </div>
              {connectionStatus.error && (
                <div className={`mt-2 p-3 border rounded-lg text-xs shadow-sm ${isDarkTheme ? 'bg-red-900/50 border-red-600/70' : 'bg-red-50/95 border-red-400/70'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className={`font-semibold ${isDarkTheme ? 'text-red-300' : 'text-red-700'}`}>Erro</span>
                  </div>
                  <div className={`text-xs break-words font-medium leading-relaxed ${isDarkTheme ? 'text-red-200' : 'text-red-800'}`}>{connectionStatus.error}</div>
                </div>
              )}
            </div>


          </div>
        )}
      </div>
    </div>
  );
} 