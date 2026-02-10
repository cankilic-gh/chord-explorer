
import React from 'react';
import { ChordVoicing, FretPosition } from '../constants/musicData';

interface FretboardProps {
  voicing: ChordVoicing;
  isPreview?: boolean;
}

const FRET_COUNT = 15;
const STRING_COUNT = 6;
const FRET_MARKERS = [3, 5, 7, 9, 12, 15];

const INTERVAL_COLORS: Record<string, string> = {
  'Root': '#FF4444',           // Red - Root (1)
  'Minor 3rd': '#4488FF',      // Blue - 3rd (b3)
  'Major 3rd': '#4488FF',      // Blue - 3rd (3)
  'Perfect 5th': '#44CC44',    // Green - 5th (5)
  'Diminished 5th': '#44CC44', // Green - 5th (b5)
  'Augmented 5th': '#44CC44',  // Green - 5th (#5)
  'Minor 7th': '#FF8800',      // Orange - 7th (b7)
  'Major 7th': '#FF8800',      // Orange - 7th (7)
  '9th': '#AA44FF',            // Purple - Extensions
  '11th': '#AA44FF',           // Purple - Extensions
  '13th': '#AA44FF',           // Purple - Extensions
};

const DEFAULT_DOT_COLOR = '#888888';

const Fretboard: React.FC<FretboardProps> = ({ voicing, isPreview = false }) => {
  return (
    <div className={`bg-[#161b22] border rounded-lg p-6 mt-4 select-none transition-all duration-200 ${isPreview ? 'border-[#4493f8] ring-1 ring-[#4493f8]/30' : 'border-[#30363d]'}`}>
      <div className="relative">
        {/* Nut */}
        <div className="absolute top-0 -left-1 h-full w-2 bg-[#c9d1d9] rounded-sm"></div>

        {/* Frets */}
        <div className="flex justify-between">
          {[...Array(FRET_COUNT + 1)].map((_, i) => (
            <div key={i} className="w-px h-28 bg-[#30363d]"></div>
          ))}
        </div>

        {/* Strings */}
        <div className="absolute top-0 left-0 right-0 flex flex-col justify-between h-full">
          {[...Array(STRING_COUNT)].map((_, i) => (
            <div key={i} className="h-px bg-gray-500" style={{ height: `${i*0.2 + 1}px` }}></div>
          ))}
        </div>

        {/* Fret Markers */}
        <div className="absolute -bottom-5 left-0 right-0 flex justify-around">
            {[...Array(FRET_COUNT)].map((_, i) => (
                 <div key={i} className="w-full text-center text-xs text-[#8b949e] font-mono">
                    {FRET_MARKERS.includes(i + 1) ? (i + 1) : ''}
                </div>
            ))}
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-around">
            {[...Array(FRET_COUNT)].map((_, i) => (
                 <div key={i} className="w-full text-center">
                    {FRET_MARKERS.includes(i + 1) && (i + 1) !== 12 && <div className="w-2 h-2 rounded-full bg-[#30363d] mx-auto"></div>}
                    {(i+1) === 12 && <div className="flex justify-center gap-4"><div className="w-2 h-2 rounded-full bg-[#30363d]"></div><div className="w-2 h-2 rounded-full bg-[#30363d]"></div></div>}
                </div>
            ))}
        </div>


        {/* Notes */}
        {/* String order: 0=high e (bottom), 5=low E (top) - standard guitar diagram */}
        <div className="absolute top-0 left-0 right-0 bottom-0">
            {voicing.map((pos, i) => {
                // Flip string order: string 0 (high e) at bottom, string 5 (low E) at top
                const top = `${((STRING_COUNT - 1 - pos.string) / (STRING_COUNT - 1)) * 100}%`;
                const left = pos.fret === 0 ? `-1.5%` : `${((pos.fret - 0.5) / FRET_COUNT) * 100}%`;
                const dotColor = INTERVAL_COLORS[pos.interval] || DEFAULT_DOT_COLOR;

                return (
                    <div
                        key={i}
                        className="absolute w-6 h-6 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg flex items-center justify-center border-2"
                        style={{
                            top,
                            left,
                            backgroundColor: dotColor,
                            borderColor: dotColor,
                            boxShadow: `0 0 8px ${dotColor}40`
                        }}
                    >
                    </div>
                )
            })}
        </div>
      </div>
    </div>
  );
};

export default Fretboard;
