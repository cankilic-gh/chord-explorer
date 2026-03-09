import React, { useMemo } from 'react';
import { X, Circle as CircleIcon } from 'lucide-react';
import { Note, ChordType, CHORD_TYPES } from '../constants/musicData';

interface CircleOfFifthsProps {
  selectedKey: Note;
  isMinor: boolean;
  onSelectKey: (key: Note, isMinor: boolean) => void;
  onClose?: () => void;
}

const MAJOR_KEYS: Note[] = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];
const MINOR_KEYS: Note[] = ['A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F', 'C', 'G', 'D'];

const MAJOR_DISPLAY: Record<Note, string> = {
  'C': 'C', 'G': 'G', 'D': 'D', 'A': 'A', 'E': 'E', 'B': 'B',
  'F#': 'F#/Gb', 'C#': 'Db', 'G#': 'Ab', 'D#': 'Eb', 'A#': 'Bb', 'F': 'F'
};

const MINOR_DISPLAY: Record<Note, string> = {
  'A': 'Am', 'E': 'Em', 'B': 'Bm', 'F#': 'F#m', 'C#': 'C#m', 'G#': 'G#m',
  'D#': 'D#m/Ebm', 'A#': 'Bbm', 'F': 'Fm', 'C': 'Cm', 'G': 'Gm', 'D': 'Dm'
};

const getDiatonicChords = (key: Note, isMinor: boolean): { root: Note; type: ChordType; numeral: string }[] => {
  const NOTES: Note[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const rootIndex = NOTES.indexOf(key);

  if (isMinor) {
    const intervals = [0, 2, 3, 5, 7, 8, 10];
    const types: ChordType[] = ['minor', 'dim', 'Major', 'minor', 'minor', 'Major', 'Major'];
    const numerals = ['i', 'ii\u00B0', 'III', 'iv', 'v', 'VI', 'VII'];

    return intervals.map((interval, i) => ({
      root: NOTES[(rootIndex + interval) % 12],
      type: types[i],
      numeral: numerals[i]
    }));
  } else {
    const intervals = [0, 2, 4, 5, 7, 9, 11];
    const types: ChordType[] = ['Major', 'minor', 'minor', 'Major', 'Major', 'minor', 'dim'];
    const numerals = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii\u00B0'];

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
  const innerRadius = 110;
  const keyRadius = 20;
  const innerKeyRadius = 16;

  const selectedMajorIndex = MAJOR_KEYS.indexOf(selectedKey);
  const selectedMinorIndex = MINOR_KEYS.indexOf(selectedKey);
  const selectedIndex = isMinor ? selectedMinorIndex : selectedMajorIndex;

  const adjacentIndices = useMemo(() => {
    if (selectedIndex === -1) return [];
    return [
      (selectedIndex - 1 + 12) % 12,
      (selectedIndex + 1) % 12
    ];
  }, [selectedIndex]);

  const diatonicChords = useMemo(() => {
    return getDiatonicChords(selectedKey, isMinor);
  }, [selectedKey, isMinor]);

  const getKeyPosition = (index: number, radius: number) => {
    const angle = (index * 30 - 90) * (Math.PI / 180);
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };

  const isAdjacentKey = (index: number) => adjacentIndices.includes(index);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#15151a] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <CircleIcon className="w-6 h-6 text-purple" />
            <h2 className="text-xl font-bold text-white">Circle of Fifths</h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-8 flex flex-col items-center">
          <div className="relative w-[400px] h-[400px] mb-12">
            <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_0_30px_rgba(168,85,247,0.2)]">
              {/* Background circles */}
              <circle cx={centerX} cy={centerY} r={outerRadius + 30} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="40" />
              <circle cx={centerX} cy={centerY} r={innerRadius - 10} fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="40" />

              {/* Radial lines */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30 - 75) * (Math.PI / 180);
                const x2 = centerX + (outerRadius + 40) * Math.cos(angle);
                const y2 = centerY + (outerRadius + 40) * Math.sin(angle);
                return (
                  <line
                    key={`line-${i}`}
                    x1={centerX}
                    y1={centerY}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(255,255,255,0.1)"
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
                  <g key={`major-${key}`} className="cursor-pointer">
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={keyRadius}
                      fill={isSelected ? '#00D4FF' : isAdjacent ? 'rgba(0,212,255,0.2)' : 'transparent'}
                      stroke={isSelected ? '#00D4FF' : isAdjacent ? 'rgba(0,212,255,0.5)' : 'rgba(255,255,255,0.1)'}
                      strokeWidth={isSelected ? 3 : 1.5}
                      className="transition-all duration-200 hover:fill-white/5"
                      onClick={() => onSelectKey(key, false)}
                    />
                    <text
                      x={pos.x}
                      y={pos.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={isSelected ? '#000' : '#fff'}
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
                  <g key={`minor-${key}`} className="cursor-pointer">
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={innerKeyRadius}
                      fill={isSelected ? '#a855f7' : isAdjacent ? 'rgba(168,85,247,0.2)' : 'transparent'}
                      stroke={isSelected ? '#a855f7' : isAdjacent ? 'rgba(168,85,247,0.5)' : 'rgba(255,255,255,0.1)'}
                      strokeWidth={isSelected ? 3 : 1}
                      className="transition-all duration-200 hover:fill-white/5"
                      onClick={() => onSelectKey(key, true)}
                    />
                    <text
                      x={pos.x}
                      y={pos.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={isSelected ? '#ffffff' : 'rgba(255,255,255,0.6)'}
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

              {/* Center */}
              <circle cx={centerX} cy={centerY} r="60" fill="#0a0a0f" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
              <text
                x={centerX}
                y={centerY - 8}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="18"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {selectedKey}{isMinor ? 'm' : ''}
              </text>
              <text
                x={centerX}
                y={centerY + 14}
                textAnchor="middle"
                fill={isMinor ? '#a855f7' : '#00D4FF'}
                fontSize="11"
                fontFamily="monospace"
              >
                {isMinor ? 'minor' : 'Major'}
              </text>
            </svg>
          </div>

          {/* Diatonic chords section */}
          <div className="w-full max-w-3xl bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-4">
              Diatonic Chords in {selectedKey} {isMinor ? 'minor' : 'Major'}
            </h3>
            <div className="grid grid-cols-7 gap-2">
              {diatonicChords.map((chord, index) => (
                <div
                  key={`diatonic-${index}`}
                  className="bg-bg-dark border border-white/10 rounded-lg px-2 py-3 text-center hover:border-cyan/50 transition-colors cursor-pointer"
                  onClick={() => onSelectKey(chord.root, chord.type === 'minor')}
                >
                  <div className="text-xs text-white/50 font-mono mb-1">{chord.numeral}</div>
                  <div className="text-sm text-white font-mono font-bold">
                    {chord.root}{CHORD_TYPES[chord.type].symbol}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="px-8 pb-6 flex flex-wrap gap-4 justify-center text-xs text-white/50">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-cyan"></div>
            <span>Selected Key</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-cyan/20 border border-cyan/50"></div>
            <span>Easy Modulation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border border-white/10"></div>
            <span>Major Keys (outer)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-purple"></div>
            <span>Minor Keys (inner)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CircleOfFifths };
export default CircleOfFifths;
