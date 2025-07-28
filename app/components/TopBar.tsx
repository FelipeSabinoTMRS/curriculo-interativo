import { Printer, Edit3, Save, Upload, Github, ExternalLink } from 'lucide-react';

interface TopBarProps {
  onPrint: () => void;
  onEdit: () => void;
  onSave: () => void;
  onImageUpload: () => void;
  isEditing?: boolean;
  isSaving?: boolean;
}

export default function TopBar({ 
  onPrint, 
  onEdit, 
  onSave, 
  onImageUpload,
  isEditing = false,
  isSaving = false 
}: TopBarProps) {
  return (
    <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50 no-print">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo/Title */}
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold text-white">
              Currículo Interativo
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Image Upload */}
            <button
              onClick={onImageUpload}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 text-sm"
              title="Carregar Imagens"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Imagens</span>
            </button>

            {/* Edit Button */}
            <button
              onClick={onEdit}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 text-sm ${
                isEditing 
                  ? 'bg-ai-gradient text-white shadow-lg' 
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span className="hidden sm:inline">{isEditing ? 'Editando' : 'Editar'}</span>
            </button>

            {/* Save Button */}
            <button
              onClick={onSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 text-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">{isSaving ? 'Salvando...' : 'Salvar'}</span>
            </button>

            {/* Print Button */}
            <button
              onClick={onPrint}
              className="flex items-center gap-2 px-4 py-2 bg-ai-gradient text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm font-medium"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>

            {/* GitHub Link */}
            <a
              href="https://github.com/FelipeSabinoTMRS/curriculo-interativo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 bg-gray-900/50 hover:bg-gray-900/70 text-white rounded-lg transition-all duration-300 text-sm"
              title="Ver código no GitHub"
            >
              <Github className="w-4 h-4" />
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 