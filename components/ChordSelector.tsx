
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
      return 'border-cyan bg-cyan/20 text-cyan shadow-[0_0_8px_rgba(0,212,255,0.3)]';
    }
    if (noteIndex === fifthIndex) {
      return 'border-green bg-green/10 text-green';
    }
    if (noteIndex === fourthIndex) {
      return 'border-gold bg-gold/10 text-gold';
    }
    return 'border-white/10 bg-bg-dark text-white/70 hover:border-white/30 hover:text-white';
  };

  // Compact mobile layout
  if (compact) {
    return (
      <div className="flex flex-col gap-3">
        {/* Root Note - Horizontal scroll */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xs font-semibold text-white/50 font-mono uppercase tracking-widest">Root</h3>
            <div className="flex gap-1 text-[10px] font-mono">
              <span className="flex items-center gap-0.5">
                <span className="w-2 h-2 rounded-full border border-green"></span>
                <span className="text-white/50">5th</span>
              </span>
              <span className="flex items-center gap-0.5">
                <span className="w-2 h-2 rounded-full border border-gold"></span>
                <span className="text-white/50">4th</span>
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
                  className={`flex-shrink-0 w-9 h-9 rounded-full border flex items-center justify-center text-xs font-bold transition-all duration-200 font-mono
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
          <h3 className="text-xs font-semibold mb-2 text-white/50 font-mono uppercase tracking-widest">Type</h3>
          <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
            {CHORD_TYPE_IDS.map(type => {
              const isSelected = type === selectedType;
              return (
                <button
                  key={type}
                  onClick={() => onTypeChange(type)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-md text-center text-xs transition-colors duration-200 border
                    ${isSelected
                      ? 'bg-purple/20 border-purple text-purple shadow-[0_0_6px_rgba(168,85,247,0.2)]'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                    } font-mono`}
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
    <div className="flex flex-col h-full gap-8">
      <div>
        <h2 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-6">Root Note</h2>
        <div className="relative w-[220px] h-[220px] mx-auto mb-4">
          {NOTES.map((note, i) => {
            const angle = (i / NOTES.length) * 2 * Math.PI - Math.PI / 2;
            const radius = 90;
            const center = 110;
            const x = Math.cos(angle) * radius + center;
            const y = Math.sin(angle) * radius + center;
            const isSelected = note === selectedRoot;
            return (
              <button
                key={note}
                onClick={() => onRootChange(note)}
                className={`absolute w-9 h-9 rounded-full border flex items-center justify-center text-xs font-medium transition-all duration-200 transform -translate-x-1/2 -translate-y-1/2 font-mono
                  ${getNoteStyle(i, isSelected)}`}
                style={{ left: `${x}px`, top: `${y}px` }}
                title={i === fifthIndex ? '5th' : i === fourthIndex ? '4th' : undefined}
              >
                {note}
              </button>
            );
          })}
          <svg className="absolute inset-0 w-full h-full -z-10 pointer-events-none opacity-20">
            <circle cx="110" cy="110" r="90" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          </svg>
        </div>
        <div className="flex justify-center gap-4 text-xs font-mono mb-4">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full border-2 border-green"></span>
            <span className="text-white/50">5th</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full border-2 border-gold"></span>
            <span className="text-white/50">4th</span>
          </span>
        </div>
      </div>

      <div>
        <h2 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-4">Chord Type</h2>
        <div className="grid grid-cols-2 gap-2">
          {CHORD_TYPE_IDS.map(type => {
            const isSelected = type === selectedType;
            return (
              <button
                key={type}
                onClick={() => onTypeChange(type)}
                className={`py-2 px-3 rounded-md text-center text-sm transition-colors duration-200 border
                  ${isSelected
                    ? 'bg-purple/20 border-purple text-purple shadow-[0_0_6px_rgba(168,85,247,0.2)]'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                  } font-mono`}
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
