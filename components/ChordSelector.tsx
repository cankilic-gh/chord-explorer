
import React from 'react';
import { NOTES, CHORD_TYPES, CHORD_TYPE_IDS, Note, ChordType } from '../constants/musicData';

interface ChordSelectorProps {
  selectedRoot: Note;
  selectedType: ChordType;
  onRootChange: (root: Note) => void;
  onTypeChange: (type: ChordType) => void;
}

const ChordSelector: React.FC<ChordSelectorProps> = ({ selectedRoot, selectedType, onRootChange, onTypeChange }) => {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-bold mb-4 font-mono">Chord Selector</h2>
      
      <div>
        <h3 className="text-sm font-semibold mb-2 text-[#8b949e] font-mono">ROOT NOTE</h3>
        <div className="relative w-52 h-52 mx-auto mb-6">
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
                className={`absolute w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 transform -translate-x-1/2 -translate-y-1/2
                  ${isSelected ? 'bg-[#4493f8] text-white scale-110 shadow-lg shadow-[#4493f8]/30' : 'bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] hover:border-[#8b949e]'} font-mono`}
                style={{ left: `${x}px`, top: `${y}px` }}
              >
                {note}
              </button>
            );
          })}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[#0d1117] rounded-full border-2 border-[#30363d] flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-[#30363d]"></div>
          </div>
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
