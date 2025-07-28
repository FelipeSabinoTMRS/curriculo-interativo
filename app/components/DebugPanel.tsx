import React, { useState } from 'react';
import { Database, CheckCircle, XCircle, AlertCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import type { DatabaseConnection } from '~/types';

interface DebugPanelProps {
  connectionStatus: DatabaseConnection;
  onRefreshConnection: () => void;
}

export default function DebugPanel({ connectionStatus, onRefreshConnection }: DebugPanelProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

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
      <div className="bg-white/25 backdrop-blur-lg border border-gray-400/50 rounded-xl p-4 shadow-xl hover:bg-white/30 hover:border-gray-400/70 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-ai-blue-600 flex items-center gap-2">
            <Database className="w-4 h-4 text-ai-blue-600" />
            Debug
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-1.5 hover:bg-gray-200/60 rounded transition-colors"
              title="Atualizar status"
            >
              <RefreshCw className={`w-3 h-3 text-gray-700 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 hover:bg-gray-200/60 rounded transition-colors"
              title={isMinimized ? 'Expandir' : 'Minimizar'}
            >
              {isMinimized ? <ChevronDown className="w-3 h-3 text-gray-700" /> : <ChevronUp className="w-3 h-3 text-gray-700" />}
            </button>
          </div>
        </div>

              {!isMinimized && (
          <div className="space-y-2">
            <div className="bg-white/40 backdrop-blur-sm rounded-lg p-3 border border-gray-300/50 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-800">Banco D1</span>
                {getStatusIcon()}
              </div>
              <div className="text-xs">
                <span className={connectionStatus.connected ? 'text-green-600 font-medium' : 'text-red-600 font-semibold'}>
                  {getStatusText()}
                </span>
              </div>
              <div className="text-xs text-gray-600 mt-1 font-medium">
                {new Date(connectionStatus.lastCheck).toLocaleTimeString('pt-BR')}
              </div>
              {connectionStatus.error && (
                <div className="mt-2 p-3 bg-red-50/95 border border-red-400/70 rounded-lg text-xs shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="font-semibold text-red-700">Erro</span>
                  </div>
                  <div className="text-red-800 text-xs break-words font-medium leading-relaxed">{connectionStatus.error}</div>
                </div>
              )}
            </div>


          </div>
        )}
      </div>
    </div>
  );
} 