
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
  'Root': '#ef4444',
  'Minor 3rd': '#3b82f6',
  'Major 3rd': '#3b82f6',
  'Perfect 5th': '#22c55e',
  'Diminished 5th': '#22c55e',
  'Augmented 5th': '#22c55e',
  'Minor 7th': '#f97316',
  'Major 7th': '#f97316',
  '9th': '#a855f7',
  '11th': '#a855f7',
  '13th': '#a855f7',
};

const DEFAULT_DOT_COLOR = '#888888';

const Fretboard: React.FC<FretboardProps> = ({ voicing, isPreview = false }) => {
  return (
    <div className={`bg-[#15151a] border rounded-xl p-3 md:p-6 select-none transition-all duration-200 shadow-2xl ${isPreview ? 'border-cyan ring-1 ring-cyan/30' : 'border-white/10'}`}>
      <div className="relative">
        {/* Nut */}
        <div className="absolute top-0 -left-1 h-full w-1.5 md:w-2 bg-white/40 rounded-sm"></div>

        {/* Frets */}
        <div className="flex justify-between">
          {[...Array(FRET_COUNT + 1)].map((_, i) => (
            <div key={i} className="w-px h-20 md:h-28 bg-white/20"></div>
          ))}
        </div>

        {/* Strings */}
        <div className="absolute top-0 left-0 right-0 flex flex-col justify-between h-full">
          {[...Array(STRING_COUNT)].map((_, i) => (
            <div key={i} className="bg-white/30" style={{ height: `${i*0.2 + 1}px` }}></div>
          ))}
        </div>

        {/* Fret Markers */}
        <div className="absolute -bottom-4 md:-bottom-5 left-0 right-0 flex justify-around">
            {[...Array(FRET_COUNT)].map((_, i) => (
                 <div key={i} className="w-full text-center text-[10px] md:text-xs text-white/30 font-mono">
                    {FRET_MARKERS.includes(i + 1) ? (i + 1) : ''}
                </div>
            ))}
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-around">
            {[...Array(FRET_COUNT)].map((_, i) => (
                 <div key={i} className="w-full text-center">
                    {FRET_MARKERS.includes(i + 1) && (i + 1) !== 12 && <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white/10 mx-auto"></div>}
                    {(i+1) === 12 && <div className="flex justify-center gap-2 md:gap-4"><div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white/10"></div><div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white/10"></div></div>}
                </div>
            ))}
        </div>


        {/* Notes */}
        <div className="absolute top-0 left-0 right-0 bottom-0">
            {voicing.map((pos, i) => {
                const top = `${((STRING_COUNT - 1 - pos.string) / (STRING_COUNT - 1)) * 100}%`;
                const left = pos.fret === 0 ? `-1.5%` : `${((pos.fret - 0.5) / FRET_COUNT) * 100}%`;
                const dotColor = INTERVAL_COLORS[pos.interval] || DEFAULT_DOT_COLOR;

                return (
                    <div
                        key={i}
                        className="absolute w-3.5 h-3.5 md:w-5 md:h-5 rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center border border-white/20"
                        style={{
                            top,
                            left,
                            backgroundColor: dotColor,
                            boxShadow: `0 0 6px ${dotColor}40`
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
