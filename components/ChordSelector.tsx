
import React from 'react';
import { NOTES, CHORD_TYPES, CHORD_TYPE_IDS, Note, ChordType } from '../constants/musicData';

interface ChordSelectorProps {
  selectedRoot: Note;
  selectedType: ChordType;
  onRootChange: (root: Note) => void;
  onTypeChange: (type: ChordType) => void;
  compact?: boolean;
}

const ChordSelector: React.FC<ChordSelectorProps> = ({ selectedRoot, selectedType, onRootChange, onTypeChange, compact = false }) => {
  const selectedIndex = NOTES.indexOf(selectedRoot);
  const fifthIndex = (selectedIndex + 7) % 12; // Perfect 5th
  const fourthIndex = (selectedIndex + 5) % 12; // Perfect 4th

  const getNoteStyle = (noteIndex: number, isSelected: boolean) => {
    if (isSelected) {
      return 'bg-[#4493f8] text-white scale-110 shadow-lg shadow-[#4493f8]/30';
    }
    if (noteIndex === fifthIndex) {
      return 'bg-[#21262d] border-2 border-[#3fb950] text-[#3fb950] hover:bg-[#238636]/20';
    }
    if (noteIndex === fourthIndex) {
      return 'bg-[#21262d] border-2 border-[#d29922] text-[#d29922] hover:bg-[#d29922]/20';
    }
    return 'bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] hover:border-[#8b949e]';
  };

  // Compact mobile layout
  if (compact) {
    return (
      <div className="flex flex-col gap-3">
        {/* Root Note - Horizontal scroll */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xs font-semibold text-[#8b949e] font-mono">ROOT</h3>
            <div className="flex gap-1 text-[10px] font-mono">
              <span className="flex items-center gap-0.5">
                <span className="w-2 h-2 rounded-full border border-[#3fb950]"></span>
                <span className="text-[#8b949e]">5th</span>
              </span>
              <span className="flex items-center gap-0.5">
                <span className="w-2 h-2 rounded-full border border-[#d29922]"></span>
                <span className="text-[#8b949e]">4th</span>
              </span>
            </div>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
            {NOTES.map((note, i) => {
              const isSelected = note === selectedRoot;
              return (
                <button
                  key={note}
                  onClick={() => onRootChange(note)}
                  className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 font-mono
                    ${getNoteStyle(i, isSelected)}`}
                  title={i === fifthIndex ? '5th' : i === fourthIndex ? '4th' : undefined}
                >
                  {note}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chord Type - Horizontal scroll */}
        <div>
          <h3 className="text-xs font-semibold mb-2 text-[#8b949e] font-mono">TYPE</h3>
          <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
            {CHORD_TYPE_IDS.map(type => {
              const isSelected = type === selectedType;
              return (
                <button
                  key={type}
                  onClick={() => onTypeChange(type)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-md text-center text-xs transition-colors duration-200
                    ${isSelected ? 'bg-[#4493f8] text-white' : 'bg-[#21262d] border border-[#30363d] hover:bg-[#30363d]'} font-mono`}
                >
                  {CHORD_TYPES[type].symbol || type}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Desktop circular layout
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-bold mb-4 font-mono">Chord Selector</h2>

      <div>
        <h3 className="text-sm font-semibold mb-2 text-[#8b949e] font-mono">ROOT NOTE</h3>
        <div className="relative w-52 h-52 mx-auto mb-4">
          {NOTES.map((note, i) => {
            const angle = (i / NOTES.length) * 2 * Math.PI - Math.PI / 2;
            const radius = 85;
            const center = 104;
            const x = Math.cos(angle) * radius + center;
            const y = Math.sin(angle) * radius + center;
            const isSelected = note === selectedRoot;
            return (
              <button
                key={note}
                onClick={() => onRootChange(note)}
                className={`absolute w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 transform -translate-x-1/2 -translate-y-1/2 font-mono
                  ${getNoteStyle(i, isSelected)}`}
                style={{ left: `${x}px`, top: `${y}px` }}
                title={i === fifthIndex ? '5th' : i === fourthIndex ? '4th' : undefined}
              >
                {note}
              </button>
            );
          })}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[#0d1117] rounded-full border-2 border-[#30363d] flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-[#30363d]"></div>
          </div>
        </div>
        <div className="flex justify-center gap-4 text-xs font-mono mb-4">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full border-2 border-[#3fb950]"></span>
            <span className="text-[#8b949e]">5th</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full border-2 border-[#d29922]"></span>
            <span className="text-[#8b949e]">4th</span>
          </span>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2 text-[#8b949e] font-mono">CHORD TYPE</h3>
        <div className="grid grid-cols-2 gap-2">
          {CHORD_TYPE_IDS.map(type => {
            const isSelected = type === selectedType;
            return (
              <button
                key={type}
                onClick={() => onTypeChange(type)}
                className={`p-2 rounded-md text-center transition-colors duration-200
                  ${isSelected ? 'bg-[#4493f8] text-white' : 'bg-[#21262d] border border-[#30363d] hover:bg-[#30363d]'} font-mono`}
              >
                {CHORD_TYPES[type].symbol || type}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChordSelector;
