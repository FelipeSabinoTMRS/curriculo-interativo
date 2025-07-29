import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import type { DialogConfig } from '~/types';

interface DialogProps {
  config: DialogConfig;
  isOpen: boolean;
  onClose: () => void;
}

export default function Dialog({ config, isOpen, onClose }: DialogProps) {
  const { type, title, message, confirmText, cancelText, onConfirm, onCancel, autoClose } = config;

  // Auto close
  useEffect(() => {
    if (isOpen && autoClose && autoClose > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoClose);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, onClose]);

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      case 'info':
      case 'confirm':
      default:
        return <Info className="w-6 h-6 text-blue-500" />;
    }
  };

  const getColorClasses = () => {
    // Detectar se está em modo escuro baseado na classe do body ou tema atual
    const isDarkMode = document.documentElement.classList.contains('dark') || 
                       document.body.classList.contains('dark-theme') ||
                       window.matchMedia('(prefers-color-scheme: dark)').matches;

    switch (type) {
      case 'success':
        return isDarkMode ? 'border-green-600 bg-green-900' : 'border-green-200 bg-green-50';
      case 'warning':
        return isDarkMode ? 'border-yellow-600 bg-yellow-900' : 'border-yellow-200 bg-yellow-50';
      case 'error':
        return isDarkMode ? 'border-red-600 bg-red-900' : 'border-red-200 bg-red-50';
      case 'info':
      case 'confirm':
      default:
        return isDarkMode ? 'border-blue-600 bg-blue-900' : 'border-blue-200 bg-blue-50';
    }
  };

  const getTextClasses = () => {
    // Detectar se está em modo escuro baseado na classe do body ou tema atual
    const isDarkMode = document.documentElement.classList.contains('dark') || 
                       document.body.classList.contains('dark-theme') ||
                       window.matchMedia('(prefers-color-scheme: dark)').matches;
    return isDarkMode ? 'text-white' : 'text-gray-900';
  };

  const getButtonClasses = () => {
    // Detectar se está em modo escuro baseado na classe do body ou tema atual
    const isDarkMode = document.documentElement.classList.contains('dark') || 
                       document.body.classList.contains('dark-theme') ||
                       window.matchMedia('(prefers-color-scheme: dark)').matches;
    return isDarkMode 
      ? 'bg-gray-700 hover:bg-gray-600 text-white border-gray-600'
      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300';
  };

  const getPrimaryButtonClasses = () => {
    // Detectar se está em modo escuro baseado na classe do body ou tema atual
    const isDarkMode = document.documentElement.classList.contains('dark') || 
                       document.body.classList.contains('dark-theme') ||
                       window.matchMedia('(prefers-color-scheme: dark)').matches;
    return isDarkMode
      ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
      : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600';
  };

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const isDarkMode = document.documentElement.classList.contains('dark') || 
                     document.body.classList.contains('dark-theme') ||
                     window.matchMedia('(prefers-color-scheme: dark)').matches;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div 
        className={`relative w-full max-w-md mx-auto rounded-xl border-2 shadow-2xl transform transition-all duration-300 ${getColorClasses()} ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
        style={{
          animation: isOpen ? 'dialog-in 0.3s ease-out' : 'dialog-out 0.3s ease-in'
        }}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDarkMode ? 'border-gray-600' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            {getIcon()}
            <h3 className={`text-lg font-semibold ${getTextClasses()}`}>{title}</h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-full transition-colors ${
              isDarkMode 
                ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className={`leading-relaxed ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>{message}</p>
        </div>

        {/* Actions */}
        <div className={`flex justify-end space-x-3 p-6 border-t ${
          isDarkMode ? 'border-gray-600' : 'border-gray-200'
        }`}>
          {type === 'confirm' && (
            <>
              <button
                onClick={handleCancel}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${getButtonClasses()}`}
              >
                {cancelText || 'Cancelar'}
              </button>
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${getPrimaryButtonClasses()}`}
              >
                {confirmText || 'Confirmar'}
              </button>
            </>
          )}
          
          {type !== 'confirm' && (
            <button
              onClick={onClose}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${getPrimaryButtonClasses()}`}
            >
              OK
            </button>
          )}
        </div>
      </div>

      <style>
        {`
          @keyframes dialog-in {
            from { opacity: 0; transform: scale(0.95) translateY(-10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes dialog-out {
            from { opacity: 1; transform: scale(1) translateY(0); }
            to { opacity: 0; transform: scale(0.95) translateY(-10px); }
          }
        `}
      </style>
    </div>
  );
}