import React, { useMemo } from 'react';
import { Note, ChordType, CHORD_TYPES } from '../constants/musicData';

interface CircleOfFifthsProps {
  selectedKey: Note;
  isMinor: boolean;
  onSelectKey: (key: Note, isMinor: boolean) => void;
  onClose?: () => void;
}

// Circle of fifths order for major keys (clockwise from top)
const MAJOR_KEYS: Note[] = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];
// Relative minor keys (same positions)
const MINOR_KEYS: Note[] = ['A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F', 'C', 'G', 'D'];

// Display names for enharmonic equivalents
const MAJOR_DISPLAY: Record<Note, string> = {
  'C': 'C', 'G': 'G', 'D': 'D', 'A': 'A', 'E': 'E', 'B': 'B',
  'F#': 'F#/Gb', 'C#': 'Db', 'G#': 'Ab', 'D#': 'Eb', 'A#': 'Bb', 'F': 'F'
};

const MINOR_DISPLAY: Record<Note, string> = {
  'A': 'Am', 'E': 'Em', 'B': 'Bm', 'F#': 'F#m', 'C#': 'C#m', 'G#': 'G#m',
  'D#': 'D#m/Ebm', 'A#': 'Bbm', 'F': 'Fm', 'C': 'Cm', 'G': 'Gm', 'D': 'Dm'
};

// Diatonic chords for major keys
const getDiatonicChords = (key: Note, isMinor: boolean): { root: Note; type: ChordType; numeral: string }[] => {
  const NOTES: Note[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const rootIndex = NOTES.indexOf(key);

  if (isMinor) {
    // Natural minor scale intervals and chord qualities
    const intervals = [0, 2, 3, 5, 7, 8, 10];
    const types: ChordType[] = ['minor', 'dim', 'Major', 'minor', 'minor', 'Major', 'Major'];
    const numerals = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];

    return intervals.map((interval, i) => ({
      root: NOTES[(rootIndex + interval) % 12],
      type: types[i],
      numeral: numerals[i]
    }));
  } else {
    // Major scale intervals and chord qualities
    const intervals = [0, 2, 4, 5, 7, 9, 11];
    const types: ChordType[] = ['Major', 'minor', 'minor', 'Major', 'Major', 'minor', 'dim'];
    const numerals = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];

    return intervals.map((interval, i) => ({
      root: NOTES[(rootIndex + interval) % 12],
      type: types[i],
      numeral: numerals[i]
    }));
  }
};

const CircleOfFifths: React.FC<CircleOfFifthsProps> = ({
  selectedKey,
  isMinor,
  onSelectKey,
  onClose
}) => {
  const centerX = 200;
  const centerY = 200;
  const outerRadius = 160;
  const innerRadius = 105;
  const keyRadius = 24;
  const innerKeyRadius = 18;

  // Find selected index in circle
  const selectedMajorIndex = MAJOR_KEYS.indexOf(selectedKey);
  const selectedMinorIndex = MINOR_KEYS.indexOf(selectedKey);
  const selectedIndex = isMinor ? selectedMinorIndex : selectedMajorIndex;

  // Adjacent keys for easy modulation highlighting
  const adjacentIndices = useMemo(() => {
    if (selectedIndex === -1) return [];
    return [
      (selectedIndex - 1 + 12) % 12,
      (selectedIndex + 1) % 12
    ];
  }, [selectedIndex]);

  // Get diatonic chords for selected key
  const diatonicChords = useMemo(() => {
    return getDiatonicChords(selectedKey, isMinor);
  }, [selectedKey, isMinor]);

  const getKeyPosition = (index: number, radius: number) => {
    // Start from top (-90 degrees) and go clockwise
    const angle = (index * 30 - 90) * (Math.PI / 180);
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };

  const isAdjacentKey = (index: number) => adjacentIndices.includes(index);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold font-mono text-[#c9d1d9]">Circle of Fifths</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-[#8b949e] hover:text-[#c9d1d9] transition-colors p-2"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        <div className="flex justify-center mb-6">
          <svg width="400" height="400" viewBox="0 0 400 400">
            {/* Background circles */}
            <circle cx={centerX} cy={centerY} r={outerRadius + 30} fill="none" stroke="#30363d" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx={centerX} cy={centerY} r={innerRadius - 10} fill="none" stroke="#30363d" strokeWidth="1" strokeDasharray="4 4" />

            {/* Connection lines from center */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 - 90) * (Math.PI / 180);
              const x2 = centerX + (outerRadius + 20) * Math.cos(angle);
              const y2 = centerY + (outerRadius + 20) * Math.sin(angle);
              return (
                <line
                  key={`line-${i}`}
                  x1={centerX}
                  y1={centerY}
                  x2={x2}
                  y2={y2}
                  stroke="#21262d"
                  strokeWidth="1"
                />
              );
            })}

            {/* Outer ring - Major keys */}
            {MAJOR_KEYS.map((key, index) => {
              const pos = getKeyPosition(index, outerRadius);
              const isSelected = !isMinor && selectedKey === key;
              const isAdjacent = !isMinor && isAdjacentKey(index);

              return (
                <g key={`major-${key}`}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={keyRadius}
                    fill={isSelected ? '#2563eb' : isAdjacent ? '#1e3a5f' : '#21262d'}
                    stroke={isSelected ? '#3b82f6' : isAdjacent ? '#2563eb' : '#30363d'}
                    strokeWidth={isSelected ? 3 : 2}
                    className="cursor-pointer transition-all duration-200 hover:fill-[#30363d]"
                    onClick={() => onSelectKey(key, false)}
                  />
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isSelected ? '#ffffff' : '#c9d1d9'}
                    fontSize="12"
                    fontFamily="monospace"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    className="pointer-events-none select-none"
                  >
                    {MAJOR_DISPLAY[key]}
                  </text>
                </g>
              );
            })}

            {/* Inner ring - Minor keys */}
            {MINOR_KEYS.map((key, index) => {
              const pos = getKeyPosition(index, innerRadius);
              const isSelected = isMinor && selectedKey === key;
              const isAdjacent = isMinor && isAdjacentKey(index);

              return (
                <g key={`minor-${key}`}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={innerKeyRadius}
                    fill={isSelected ? '#2563eb' : isAdjacent ? '#1e3a5f' : '#161b22'}
                    stroke={isSelected ? '#3b82f6' : isAdjacent ? '#2563eb' : '#30363d'}
                    strokeWidth={isSelected ? 3 : 1.5}
                    className="cursor-pointer transition-all duration-200 hover:fill-[#21262d]"
                    onClick={() => onSelectKey(key, true)}
                  />
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isSelected ? '#ffffff' : '#8b949e'}
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    className="pointer-events-none select-none"
                  >
                    {MINOR_DISPLAY[key]}
                  </text>
                </g>
              );
            })}

            {/* Center label */}
            <text
              x={centerX}
              y={centerY - 8}
              textAnchor="middle"
              fill="#8b949e"
              fontSize="10"
              fontFamily="monospace"
            >
              Selected
            </text>
            <text
              x={centerX}
              y={centerY + 10}
              textAnchor="middle"
              fill="#c9d1d9"
              fontSize="14"
              fontFamily="monospace"
              fontWeight="bold"
            >
              {selectedKey}{isMinor ? 'm' : ''}
            </text>
          </svg>
        </div>

        {/* Diatonic chords section */}
        <div className="border-t border-[#30363d] pt-4">
          <h3 className="text-sm font-bold text-[#8b949e] mb-3 font-mono">
            Diatonic Chords in {selectedKey} {isMinor ? 'minor' : 'Major'}
          </h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {diatonicChords.map((chord, index) => (
              <div
                key={`diatonic-${index}`}
                className="bg-[#21262d] border border-[#30363d] rounded-lg px-3 py-2 text-center min-w-[60px] hover:bg-[#30363d] transition-colors cursor-pointer"
                onClick={() => onSelectKey(chord.root, chord.type === 'minor')}
              >
                <div className="text-xs text-[#8b949e] font-mono">{chord.numeral}</div>
                <div className="text-sm text-[#c9d1d9] font-mono font-bold">
                  {chord.root}{CHORD_TYPES[chord.type].symbol}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-[#30363d] flex flex-wrap gap-4 justify-center text-xs text-[#8b949e]">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#2563eb] border-2 border-[#3b82f6]"></div>
            <span>Selected Key</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#1e3a5f] border-2 border-[#2563eb]"></div>
            <span>Easy Modulation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#21262d] border-2 border-[#30363d]"></div>
            <span>Major Keys (outer)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#161b22] border border-[#30363d]"></div>
            <span>Minor Keys (inner)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CircleOfFifths };
export default CircleOfFifths;
