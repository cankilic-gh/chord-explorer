
import React, { useMemo } from 'react';

interface TabNote {
  fret: number;
  string: number;
  rest?: boolean;
}

interface TabBeat {
  notes: TabNote[];
  type: number;
  rest?: boolean;
  duration: [number, number];
}

interface TabVoice {
  beats: TabBeat[];
  rest?: boolean;
}

interface TabMeasure {
  voices: TabVoice[];
  signature?: [number, number];
  rest?: boolean;
  marker?: { text: string };
}

export interface TabData {
  name: string;
  measures: TabMeasure[];
  tuning: number[];
  strings: number;
  instrument: string;
  automations?: { tempo?: Array<{ value: number; position: number }> };
}

interface TabRendererProps {
  data: TabData;
}

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const STRING_NAMES_6 = ['e', 'B', 'G', 'D', 'A', 'E'];
const STRING_NAMES_4 = ['G', 'D', 'A', 'E'];

const TabRenderer: React.FC<TabRendererProps> = ({ data }) => {
  const stringNames = data.strings === 4 ? STRING_NAMES_4 : STRING_NAMES_6;

  const tabLines = useMemo(() => {
    const lines: Array<{ measures: string[][]; marker?: string }> = [];
    let currentLine: { measures: string[][]; marker?: string } = { measures: [] };
    let measuresInLine = 0;
    const maxMeasuresPerLine = 4;

    for (const measure of data.measures) {
      if (measuresInLine >= maxMeasuresPerLine) {
        lines.push(currentLine);
        currentLine = { measures: [], marker: measure.marker?.text };
        measuresInLine = 0;
      }

      if (measure.marker?.text && measuresInLine === 0) {
        currentLine.marker = measure.marker.text;
      }

      // Build strings for this measure
      const numStrings = data.strings || 6;
      const measureStrings: string[] = Array(numStrings).fill('');

      if (measure.rest || !measure.voices?.[0]?.beats) {
        // Rest measure
        for (let s = 0; s < numStrings; s++) {
          measureStrings[s] = '--------';
        }
      } else {
        const beats = measure.voices[0].beats;
        for (const beat of beats) {
          if (beat.rest || !beat.notes) {
            // Rest beat - add dashes based on duration
            const dashes = beat.type <= 2 ? 4 : beat.type <= 4 ? 3 : 2;
            for (let s = 0; s < numStrings; s++) {
              measureStrings[s] += '-'.repeat(dashes);
            }
          } else {
            // Note positions: collect frets per string
            const fretMap = new Map<number, string>();
            for (const note of beat.notes) {
              if (note.fret !== undefined && note.string !== undefined) {
                fretMap.set(note.string, note.fret.toString());
              }
            }

            // Width based on max fret digits
            const maxDigits = Math.max(1, ...Array.from(fretMap.values()).map(f => f.length));
            const cellWidth = maxDigits + 1;

            for (let s = 0; s < numStrings; s++) {
              const fretStr = fretMap.get(s);
              if (fretStr) {
                measureStrings[s] += fretStr.padEnd(cellWidth, '-');
              } else {
                measureStrings[s] += '-'.repeat(cellWidth);
              }
            }
          }
        }
      }

      currentLine.measures.push(measureStrings);
      measuresInLine++;
    }

    if (currentLine.measures.length > 0) {
      lines.push(currentLine);
    }

    return lines;
  }, [data]);

  const tempo = data.automations?.tempo?.[0]?.value;

  return (
    <div className="w-full">
      {/* Track info */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-bone text-sm font-medium">{data.name}</h4>
          <p className="text-bone/30 text-xs font-mono">{data.instrument} | {data.strings} strings</p>
        </div>
        {tempo && (
          <span className="text-xs font-mono text-ember">{tempo} BPM</span>
        )}
      </div>

      {/* Tab notation */}
      <div className="overflow-x-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(220,20,60,0.3) transparent' }}>
        {tabLines.map((line, lineIdx) => (
          <div key={lineIdx} className="mb-6">
            {line.marker && (
              <div className="text-xs font-mono text-crimson mb-1">{line.marker}</div>
            )}
            <pre className="text-[11px] md:text-xs font-mono leading-[1.4] text-bone/70 whitespace-pre">
              {stringNames.map((name, sIdx) => {
                const prefix = `${name}|`;
                const measureStrs = line.measures.map(m => m[sIdx] || '').join('|');
                return `${prefix}${measureStrs}|\n`;
              }).join('')}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabRenderer;
