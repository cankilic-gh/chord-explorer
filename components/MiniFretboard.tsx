
import React from 'react';
import { ChordVoicing } from '../constants/musicData';

interface MiniFretboardProps {
  voicing: ChordVoicing;
}

const FRET_COUNT = 4;
const STRING_COUNT = 6;

const MiniFretboard: React.FC<MiniFretboardProps> = ({ voicing }) => {
  const hasOpenStrings = voicing.some(pos => pos.fret === 0);

  return (
    <div className="w-10 h-12 bg-[#21262d] p-1 rounded-sm">
      <div className="relative w-full h-full">
        {/* Nut/Fret 0 line */}
        <div className={`absolute -top-1 left-0 right-0 h-0.5 ${hasOpenStrings ? 'bg-white' : 'bg-gray-500'}`}></div>

        {/* Frets */}
        <div className="flex flex-col justify-between h-full">
          {[...Array(FRET_COUNT + 1)].map((_, i) => (
            <div key={i} className="w-full h-px bg-gray-600"></div>
          ))}
        </div>

        {/* Strings */}
        <div className="absolute top-0 left-0 bottom-0 flex justify-between w-full">
          {[...Array(STRING_COUNT)].map((_, i) => (
            <div key={i} className="w-px h-full bg-gray-600"></div>
          ))}
        </div>

        {/* Notes */}
        {/* String order: 0=high e (right), 5=low E (left) - standard chord diagram */}
        <div className="absolute top-0 left-0 right-0 bottom-0">
          {voicing.filter(pos => pos.fret <= FRET_COUNT).map((pos, i) => {
            const top = pos.fret === 0 ? '-15%' : `${((pos.fret - 0.5) / FRET_COUNT) * 100}%`;
            // Flip string order: string 0 (high e) at right, string 5 (low E) at left
            const left = `${((STRING_COUNT - 1 - pos.string) / (STRING_COUNT - 1)) * 100}%`;
            
            return (
              <div
                key={i}
                className={`absolute w-[0.3rem] h-[0.3rem] rounded-full ${pos.fret === 0 ? 'border border-white' : 'bg-white'} transform -translate-x-1/2 -translate-y-1/2`}
                style={{ top, left }}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MiniFretboard;
