import React from 'react';
import type { FabricConfig } from '../types';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  pointerSize: number;
  onPointerSizeChange: (size: number) => void;
  fabricId: string;
  onFabricIdChange: (id: string) => void;
  fabrics: FabricConfig[];
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  pointerSize,
  onPointerSizeChange,
  fabricId,
  onFabricIdChange,
  fabrics,
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-30 flex items-center justify-center animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div
        className="bg-gray-800 text-white rounded-lg shadow-2xl p-6 w-full max-w-sm m-4"
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 id="settings-title" className="text-2xl font-bold">Settings</h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
            aria-label="Close settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Pointer Size Setting */}
        <div className="mb-8">
          <label htmlFor="pointerSize" className="block mb-3 text-sm font-medium text-gray-300">
            Pointer Size <span className="text-gray-400 font-normal">({pointerSize}px)</span>
          </label>
          <input
            id="pointerSize"
            type="range"
            min="50"
            max="300"
            value={pointerSize}
            onChange={(e) => onPointerSizeChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer custom-range"
          />
        </div>

        {/* Fabric Type Setting */}
        <div>
          <h3 className="mb-3 text-sm font-medium text-gray-300">Fabric Type</h3>
          <div className="grid grid-cols-2 gap-3">
            {fabrics.map((fabric) => (
              <label key={fabric.id} className={`p-3 rounded-md cursor-pointer text-center transition-all duration-200 text-sm ${
                  fabricId === fabric.id 
                  ? 'bg-teal-500 text-white font-semibold ring-2 ring-teal-400 shadow-lg' 
                  : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <input
                  type="radio"
                  name="fabricType"
                  value={fabric.id}
                  checked={fabricId === fabric.id}
                  onChange={() => onFabricIdChange(fabric.id)}
                  className="sr-only"
                />
                {fabric.name}
              </label>
            ))}
          </div>
        </div>
      </div>
       <style>
        {`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in {
            animation: fade-in 0.2s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default SettingsPanel;
