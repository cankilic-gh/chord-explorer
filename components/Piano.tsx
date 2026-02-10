
import React from 'react';
import { NoteWithInterval, Note } from '../constants/musicData';

interface PianoProps {
  notes: NoteWithInterval[];
}

const PIANO_KEYS = [
  { note: 'C', type: 'white', octave: 4 }, { note: 'C#', type: 'black', octave: 4 },
  { note: 'D', type: 'white', octave: 4 }, { note: 'D#', type: 'black', octave: 4 },
  { note: 'E', type: 'white', octave: 4 }, { note: 'F', type: 'white', octave: 4 },
  { note: 'F#', type: 'black', octave: 4 }, { note: 'G', type: 'white', octave: 4 },
  { note: 'G#', type: 'black', octave: 4 }, { note: 'A', type: 'white', octave: 4 },
  { note: 'A#', type: 'black', octave: 4 }, { note: 'B', type: 'white', octave: 4 },
  { note: 'C', type: 'white', octave: 5 }, { note: 'C#', type: 'black', octave: 5 },
  { note: 'D', type: 'white', octave: 5 }, { note: 'D#', type: 'black', octave: 5 },
  { note: 'E', type: 'white', octave: 5 }, { note: 'F', type: 'white', octave: 5 },
  { note: 'F#', type: 'black', octave: 5 }, { note: 'G', type: 'white', octave: 5 },
  { note: 'G#', type: 'black', octave: 5 }, { note: 'A', type: 'white', octave: 5 },
  { note: 'A#', type: 'black', octave: 5 }, { note: 'B', type: 'white', octave: 5 },
  { note: 'C', type: 'white', octave: 6 }, { note: 'D', type: 'white', octave: 6 }, 
  { note: 'E', type: 'white', octave: 6 }, { note: 'F', type: 'white', octave: 6 },
  { note: 'G', type: 'white', octave: 6 },
];

const INTERVAL_COLORS: Record<string, string> = {
  'Root': '#FF4444',           // Red - Root (1)
  'Minor 3rd': '#4488FF',      // Blue - 3rd (b3)
  'Major 3rd': '#4488FF',      // Blue - 3rd (3)
  'Perfect 5th': '#44CC44',    // Green - 5th
  'Diminished 5th': '#44CC44', // Green - 5th (b5)
  'Augmented 5th': '#44CC44',  // Green - 5th (#5)
  'Minor 7th': '#FF8800',      // Orange - 7th (b7)
  'Major 7th': '#FF8800',      // Orange - 7th (7)
};

const Piano: React.FC<PianoProps> = ({ notes }) => {
  const noteMap = new Map<Note, NoteWithInterval>();
  notes.forEach(n => noteMap.set(n.note, n));

  const whiteKeys = PIANO_KEYS.filter(k => k.type === 'white');
  const blackKeys = PIANO_KEYS.filter(k => k.type === 'black');

  const getIntervalColor = (interval: string): string => {
    return INTERVAL_COLORS[interval] || '#888888';
  };

  return (
    <div className="relative w-full h-40 bg-[#161b22] border border-[#30363d] rounded-lg p-4 select-none">
      <div className="relative h-full flex">
        {whiteKeys.map((key, index) => {
          const noteInfo = noteMap.get(key.note as Note);
          const color = noteInfo ? getIntervalColor(noteInfo.interval) : '';
          return (
            <div key={`${key.note}${key.octave}-${index}`} className="relative h-full flex-1 border border-[#30363d] bg-[#c9d1d9] rounded-b-md flex items-end justify-center pb-2">
              {noteInfo && (
                <div
                  className="w-6 h-6 rounded-full shadow-lg"
                  style={{ backgroundColor: color, borderColor: color, borderWidth: '2px' }}
                ></div>
              )}
              <span className="absolute bottom-2 text-xs text-black font-mono font-bold">{key.note === 'C' ? `${key.note}${key.octave}` : key.note}</span>
            </div>
          );
        })}
        {blackKeys.map((key, index) => {
          const noteInfo = noteMap.get(key.note as Note);
          const color = noteInfo ? getIntervalColor(noteInfo.interval) : '';
          let leftPosition = 0;
          switch (key.note) {
              case 'C#': leftPosition = (1/whiteKeys.length)*100 * 0.7; break;
              case 'D#': leftPosition = (1/whiteKeys.length)*100 * 1.7; break;
              case 'F#': leftPosition = (1/whiteKeys.length)*100 * 3.7; break;
              case 'G#': leftPosition = (1/whiteKeys.length)*100 * 4.7; break;
              case 'A#': leftPosition = (1/whiteKeys.length)*100 * 5.7; break;
              case 'C#': if(key.octave===5) leftPosition = (1/whiteKeys.length)*100 * 7.7; break;
              case 'D#': if(key.octave===5) leftPosition = (1/whiteKeys.length)*100 * 8.7; break;
              case 'F#': if(key.octave===5) leftPosition = (1/whiteKeys.length)*100 * 10.7; break;
              case 'G#': if(key.octave===5) leftPosition = (1/whiteKeys.length)*100 * 11.7; break;
              case 'A#': if(key.octave===5) leftPosition = (1/whiteKeys.length)*100 * 12.7; break;
              default: leftPosition = (index * (100/17)) + 2.5;
          }

          if (key.note.endsWith('#') && key.octave === 5) {
             switch (key.note) {
              case 'C#': leftPosition = (1/whiteKeys.length)*100 * 7.7; break;
              case 'D#': leftPosition = (1/whiteKeys.length)*100 * 8.7; break;
              case 'F#': leftPosition = (1/whiteKeys.length)*100 * 10.7; break;
              case 'G#': leftPosition = (1/whiteKeys.length)*100 * 11.7; break;
              case 'A#': leftPosition = (1/whiteKeys.length)*100 * 12.7; break;
            }
          }

          return (
            <div key={`${key.note}${key.octave}-${index}`}
                 style={{ left: `${leftPosition}%`}}
                 className="absolute top-0 w-[5%] h-2/3 bg-[#21262d] border border-[#30363d] rounded-b-md z-10 flex items-end justify-center pb-2">
              {noteInfo && (
                <div
                  className="w-5 h-5 rounded-full shadow-lg"
                  style={{ backgroundColor: color, borderColor: color, borderWidth: '2px' }}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Piano;
