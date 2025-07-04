import React, { useState } from 'react';
import GeometricBackground, { FABRIC_PRESETS } from './components/GeometricBackground';
import SettingsPanel from './components/SettingsPanel';

const App: React.FC = () => {
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [pointerSize, setPointerSize] = useState(150);
  const [fabricId, setFabricId] = useState('geometric');

  const selectedFabric = FABRIC_PRESETS.find(f => f.id === fabricId) || FABRIC_PRESETS[0];

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <GeometricBackground fabric={selectedFabric} pointerSize={pointerSize} />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 pointer-events-none">
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight animate-fade-in-down [text-shadow:0_0_15px_rgba(255,255,255,0.5)]">
          Interactive Geometry
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl animate-fade-in-up [animation-delay:0.5s] [text-shadow:0_0_10px_rgba(0,0,0,0.7)]">
          Move your cursor to warp the fabric of this digital space. Experience the dynamic connection between your actions and the visual world.
        </p>
      </div>

      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setSettingsOpen(true)}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Open settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
        pointerSize={pointerSize}
        onPointerSizeChange={setPointerSize}
        fabricId={fabricId}
        onFabricIdChange={setFabricId}
        fabrics={FABRIC_PRESETS}
      />

       <style>
        {`
          @keyframes fade-in-down {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-down {
            animation: fade-in-down 0.8s ease-out forwards;
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out forwards;
          }
          .custom-range::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            background: #14b8a6;
            cursor: pointer;
            border-radius: 50%;
            border: 2px solid white;
          }

          .custom-range::-moz-range-thumb {
            width: 16px;
            height: 16px;
            background: #14b8a6;
            cursor: pointer;
            border-radius: 50%;
            border: 2px solid white;
          }
        `}
      </style>
    </div>
  );
};

export default App;