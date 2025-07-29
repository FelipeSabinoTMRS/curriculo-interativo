import React, { useState } from "react";
import { Edit3, Check, X } from 'lucide-react';

interface EditableFieldProps {
  value: string;
  onSave: (newValue: string) => void;
  isEditing: boolean;
  type?: 'text' | 'textarea' | 'email' | 'tel' | 'date';
  className?: string;
  placeholder?: string;
  isDarkTheme?: boolean;
  style?: React.CSSProperties;
}

export default function EditableField({ 
  value, 
  onSave, 
  isEditing, 
  type = 'text', 
  className = '', 
  placeholder, 
  isDarkTheme,
  style
}: EditableFieldProps) {
  const [editValue, setEditValue] = useState(value);
  const [isFieldEditing, setIsFieldEditing] = useState(false);

  const handleSave = () => {
    console.log('EditableField handleSave chamado com valor:', editValue);
    onSave(editValue);
    setIsFieldEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsFieldEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && type !== 'textarea') {
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // Para evitar renderização se não estiver editando e não tiver conteúdo
  if (!isEditing && !value && !placeholder) {
    return null;
  }

  if (isEditing && isFieldEditing) {
    return (
      <div className="relative group">
        {type === 'textarea' ? (
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${className} border-2 rounded px-2 py-1 w-full resize-none ${
              isDarkTheme 
                ? 'border-yellow-500 bg-gray-800 text-white' 
                : 'border-yellow-300 bg-white text-gray-900'
            }`}
            placeholder={placeholder}
            rows={3}
            autoFocus
            style={style}
          />
        ) : type === 'date' ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${className} border-2 rounded px-2 py-1 w-full ${
              isDarkTheme 
                ? 'border-yellow-500 bg-gray-800 text-white' 
                : 'border-yellow-300 bg-white text-gray-900'
            }`}
            placeholder={placeholder || 'YYYY-MM'}
            autoFocus
            title="Use o formato AAAA-MM (exemplo: 2021-06)"
            style={style}
          />
        ) : (
          <input
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${className} border-2 rounded px-2 py-1 w-full ${
              isDarkTheme 
                ? 'border-yellow-500 bg-gray-800 text-white' 
                : 'border-yellow-300 bg-white text-gray-900'
            }`}
            placeholder={placeholder}
            autoFocus
            style={style}
          />
        )}
        <div className="absolute right-0 top-0 -mt-8 flex space-x-1">
          <button
            onClick={handleSave}
            className="p-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            title="Salvar"
          >
            <Check size={12} />
          </button>
          <button
            onClick={handleCancel}
            className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            title="Cancelar"
          >
            <X size={12} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${className} ${isEditing ? `cursor-pointer relative group rounded px-2 py-1 transition-all ${
        isDarkTheme 
          ? 'hover:bg-gray-700 hover:border hover:border-yellow-500' 
          : 'hover:bg-yellow-50 hover:border hover:border-yellow-300'
      }` : ''}`}
      onClick={() => isEditing && setIsFieldEditing(true)}
      style={style}
    >
      {value || (isEditing ? placeholder : '')}
      {isEditing && (
        <Edit3 size={12} className="absolute right-1 top-1 opacity-0 group-hover:opacity-50 transition-opacity" />
      )}
    </div>
  );
}