
import React from 'react';
import { Chord, CHORD_TYPES, Note, ChordType } from '../constants/musicData';
import { getChordVoicing, getRomanNumeral } from '../lib/musicTheory';
import { playChordFromChord } from '../lib/audioEngine';
import MiniFretboard from './MiniFretboard';
import { PlusCircleIcon } from './icons/PlusCircleIcon';

interface RelativeChordsProps {
  chords: Chord[];
  selectedChord: Chord;
  progression: Chord[];
  onSelectChord: (root: Note, type: ChordType) => void;
  onAddToProgression: (chord: Chord) => void;
  onHoverChord?: (chord: Chord | null) => void;
}

const isChordEqual = (a: Chord, b: Chord): boolean => a.root === b.root && a.type === b.type;

const RelativeChords: React.FC<RelativeChordsProps> = ({ chords, selectedChord, progression, onSelectChord, onAddToProgression, onHoverChord }) => {
  return (
    <div>
      <h2 className="text-lg font-bold mb-4 font-mono">Relative Chords</h2>
      <div className="space-y-3">
        {chords.map((chord, index) => {
          const isSelected = isChordEqual(chord, selectedChord);
          const isInProgression = progression.some(p => isChordEqual(p, chord));
          return (
            <ChordCard
              key={`${chord.root}-${chord.type}-${index}`}
              chord={chord}
              isSelected={isSelected}
              isInProgression={isInProgression}
              onSelect={() => onSelectChord(chord.root, chord.type)}
              onAdd={() => onAddToProgression(chord)}
              onHover={onHoverChord}
            />
          );
        })}
      </div>
    </div>
  );
};

interface ChordCardProps {
    chord: Chord;
    isSelected: boolean;
    isInProgression: boolean;
    onSelect: () => void;
    onAdd: () => void;
    onHover?: (chord: Chord | null) => void;
}

const PlayButton: React.FC<{ onClick: (e: React.MouseEvent) => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-6 h-6 flex items-center justify-center rounded-full bg-[#3fb950] hover:bg-green-600 transition-colors"
    title="Play chord"
  >
    <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0V12L10 6L0 0Z" fill="white" />
    </svg>
  </button>
);

const CheckIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 3L4.5 8.5L2 6" stroke="#4493f8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ProgressionDot: React.FC = () => (
  <div className="w-2 h-2 rounded-full bg-[#3fb950]" title="In progression" />
);

const ChordCard: React.FC<ChordCardProps> = ({ chord, isSelected, isInProgression, onSelect, onAdd, onHover }) => {
    const voicing = getChordVoicing(chord.root, chord.type);
    const romanNumeral = getRomanNumeral(chord.root, chord.type);

    const handlePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        playChordFromChord(chord, 'guitar');
    };

    const handleMouseEnter = () => {
        onHover?.(chord);
    };

    const handleMouseLeave = () => {
        onHover?.(null);
    };

    const borderClass = isSelected
        ? 'border-[#4493f8]'
        : isInProgression
        ? 'border-[#3fb950]/50'
        : 'border-[#30363d]';

    const bgClass = isSelected
        ? 'bg-[#161b22]'
        : 'bg-[#0d1117]';

    return (
        <div
            className={`group ${bgClass} border ${borderClass} rounded-lg p-3 transition-all duration-200 hover:border-[#4493f8] hover:shadow-lg hover:bg-[#161b22] relative`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {isSelected && (
                <div className="absolute top-2 left-2 flex items-center justify-center w-5 h-5 rounded-full bg-[#4493f8]/20">
                    <CheckIcon />
                </div>
            )}
            {isInProgression && !isSelected && (
                <div className="absolute top-2 left-2">
                    <ProgressionDot />
                </div>
            )}
            <div className="flex items-center space-x-4 cursor-pointer" onClick={onSelect}>
                <MiniFretboard voicing={voicing} />
                <div className="flex items-center space-x-2">
                    <div>
                        <p className="font-bold font-mono text-lg">{chord.root}{CHORD_TYPES[chord.type].symbol}</p>
                        <p className="text-sm text-[#8b949e] font-mono">{romanNumeral}</p>
                    </div>
                    <PlayButton onClick={handlePlay} />
                </div>
            </div>
            <button
                onClick={(e) => { e.stopPropagation(); onAdd(); }}
                className="absolute top-2 right-2 text-[#8b949e] opacity-0 group-hover:opacity-100 transition-opacity hover:text-[#4493f8]"
                title="Add to progression"
            >
                <PlusCircleIcon />
            </button>
        </div>
    );
}

export default RelativeChords;
