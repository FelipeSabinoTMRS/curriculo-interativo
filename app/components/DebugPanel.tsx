import React, { useState, useEffect } from 'react';
import { RefreshCw, Minimize2, Maximize2, Database, Image, Wifi, WifiOff } from 'lucide-react';

interface DebugPanelProps {
  isDarkTheme?: boolean;
}

export default function DebugPanel({ isDarkTheme = false }: DebugPanelProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [clientTime, setClientTime] = useState<string>('');
  
  // Estados para D1 e R2
  const [d1Status, setD1Status] = useState<'connected' | 'disconnected' | 'loading'>('disconnected');
  const [r2Status, setR2Status] = useState<'connected' | 'disconnected' | 'loading'>('disconnected');
  const [d1Enabled, setD1Enabled] = useState(false);
  const [r2Enabled, setR2Enabled] = useState(false);

  useEffect(() => {
    setClientTime(new Date().toLocaleTimeString());
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simular verificação de conectividade
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsConnected(Math.random() > 0.3);
      setClientTime(new Date().toLocaleTimeString());
    } catch (err) {
      setError('Erro ao verificar conectividade');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleD1 = async () => {
    setD1Status('loading');
    try {
      // Simular conexão/desconexão do D1
      await new Promise(resolve => setTimeout(resolve, 1500));
      const newStatus = d1Enabled ? 'disconnected' : 'connected';
      setD1Status(newStatus);
      setD1Enabled(!d1Enabled);
    } catch (err) {
      setD1Status('disconnected');
      setError('Erro ao conectar com D1');
    }
  };

  const toggleR2 = async () => {
    setR2Status('loading');
    try {
      // Simular conexão/desconexão do R2
      await new Promise(resolve => setTimeout(resolve, 1500));
      const newStatus = r2Enabled ? 'disconnected' : 'connected';
      setR2Status(newStatus);
      setR2Enabled(!r2Enabled);
    } catch (err) {
      setR2Status('disconnected');
      setError('Erro ao conectar com R2');
    }
  };

  return (
    <div className={`bg-opacity-95 backdrop-blur-sm border rounded-lg shadow-xl transition-all duration-300 ${
      isDarkTheme 
        ? 'bg-gray-800 border-gray-700 text-white' 
        : 'bg-white border-gray-200 text-gray-900'
    } ${isMinimized ? 'w-12 h-12' : 'w-full max-w-sm'}`}>
      
      {/* Header */}
      <div className={`flex items-center justify-between p-3 border-b ${
        isDarkTheme ? 'border-gray-700' : 'border-gray-200'
      }`}>
        {!isMinimized && (
          <>
            <h3 className="font-semibold text-sm">Debug Panel</h3>
            <div className="flex space-x-2">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className={`p-1 rounded transition-colors ${
                  isDarkTheme 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600'
                } ${isLoading ? 'animate-spin' : ''}`}
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </>
        )}
        
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className={`p-1 rounded transition-colors ${
            isDarkTheme 
              ? 'hover:bg-gray-700 text-gray-300' 
              : 'hover:bg-gray-100 text-gray-600'
          } ${isMinimized ? 'mx-auto' : ''} hidden lg:block`}
        >
          {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
        </button>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div className="p-3 space-y-3">
          {/* Status da Conectividade */}
          <div className={`p-2 rounded text-xs ${
            isConnected 
              ? (isDarkTheme ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800')
              : (isDarkTheme ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800')
          }`}>
            <div className="flex items-center space-x-2">
              {isConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
              <span>Status: {isConnected ? 'Conectado' : 'Desconectado'}</span>
            </div>
            <div className="mt-1">Último update: {clientTime || '...'}</div>
          </div>

          {/* Controles D1 Database */}
          <div className={`p-2 rounded border ${
            isDarkTheme ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Database size={14} />
                <span className="text-xs font-medium">D1 Database</span>
              </div>
              <div className={`text-xs px-2 py-1 rounded ${
                d1Status === 'connected' 
                  ? (isDarkTheme ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800')
                  : d1Status === 'loading'
                  ? (isDarkTheme ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800')
                  : (isDarkTheme ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800')
              }`}>
                {d1Status === 'loading' ? 'Conectando...' : d1Status === 'connected' ? 'Online' : 'Offline'}
              </div>
            </div>
            <button
              onClick={toggleD1}
              disabled={d1Status === 'loading'}
              className={`w-full text-xs py-2 px-3 rounded transition-all ${
                d1Enabled
                  ? (isDarkTheme ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white')
                  : (isDarkTheme ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white')
              } ${d1Status === 'loading' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {d1Status === 'loading' ? 'Conectando...' : d1Enabled ? 'Desconectar' : 'Conectar'}
            </button>
          </div>

          {/* Controles R2 Storage */}
          <div className={`p-2 rounded border ${
            isDarkTheme ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Image size={14} />
                <span className="text-xs font-medium">R2 Storage</span>
              </div>
              <div className={`text-xs px-2 py-1 rounded ${
                r2Status === 'connected' 
                  ? (isDarkTheme ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800')
                  : r2Status === 'loading'
                  ? (isDarkTheme ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800')
                  : (isDarkTheme ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800')
              }`}>
                {r2Status === 'loading' ? 'Conectando...' : r2Status === 'connected' ? 'Online' : 'Offline'}
              </div>
            </div>
            <button
              onClick={toggleR2}
              disabled={r2Status === 'loading'}
              className={`w-full text-xs py-2 px-3 rounded transition-all ${
                r2Enabled
                  ? (isDarkTheme ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white')
                  : (isDarkTheme ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white')
              } ${r2Status === 'loading' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {r2Status === 'loading' ? 'Conectando...' : r2Enabled ? 'Desconectar' : 'Conectar'}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className={`p-2 rounded text-xs ${
              isDarkTheme ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
            }`}>
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 