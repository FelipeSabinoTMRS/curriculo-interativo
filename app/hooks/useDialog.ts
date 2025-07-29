import { useState, useCallback } from 'react';
import type { DialogConfig } from '~/types';

interface UseDialogReturn {
  isOpen: boolean;
  config: DialogConfig | null;
  showDialog: (config: DialogConfig) => void;
  showSuccess: (title: string, message: string, autoClose?: number) => void;
  showError: (title: string, message: string, autoClose?: number) => void;
  showWarning: (title: string, message: string, autoClose?: number) => void;
  showInfo: (title: string, message: string, autoClose?: number) => void;
  showConfirm: (title: string, message: string, onConfirm?: () => void, onCancel?: () => void) => void;
  closeDialog: () => void;
}

export function useDialog(): UseDialogReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<DialogConfig | null>(null);

  const showDialog = useCallback((dialogConfig: DialogConfig) => {
    setConfig(dialogConfig);
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    // Aguardar animação antes de limpar config
    setTimeout(() => setConfig(null), 300);
  }, []);

  const showSuccess = useCallback((title: string, message: string, autoClose: number = 3000) => {
    showDialog({
      type: 'success',
      title,
      message,
      autoClose
    });
  }, [showDialog]);

  const showError = useCallback((title: string, message: string, autoClose?: number) => {
    showDialog({
      type: 'error',
      title,
      message,
      autoClose
    });
  }, [showDialog]);

  const showWarning = useCallback((title: string, message: string, autoClose?: number) => {
    showDialog({
      type: 'warning',
      title,
      message,
      autoClose
    });
  }, [showDialog]);

  const showInfo = useCallback((title: string, message: string, autoClose?: number) => {
    showDialog({
      type: 'info',
      title,
      message,
      autoClose
    });
  }, [showDialog]);

  const showConfirm = useCallback((
    title: string, 
    message: string, 
    onConfirm?: () => void, 
    onCancel?: () => void
  ) => {
    showDialog({
      type: 'confirm',
      title,
      message,
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      onConfirm,
      onCancel
    });
  }, [showDialog]);

  return {
    isOpen,
    config,
    showDialog,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
    closeDialog
  };
}