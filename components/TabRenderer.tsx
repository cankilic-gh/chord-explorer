
import React, { useMemo, useRef, useEffect, useState } from 'react';

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

// Processed beat: positions of fret numbers on strings
interface ProcessedBeat {
  frets: Map<number, number>; // string index -> fret number
  isRest: boolean;
  type: number; // note duration type
}

interface ProcessedMeasure {
  beats: ProcessedBeat[];
  marker?: string;
  measureNumber: number;
  signature?: [number, number];
}

interface TabRow {
  measures: ProcessedMeasure[];
  marker?: string;
}

const STRING_LABELS_6 = ['e', 'B', 'G', 'D', 'A', 'E'];
const STRING_LABELS_4 = ['G', 'D', 'A', 'E'];

const MEASURES_PER_ROW = 4;

// How wide each beat column should be based on note type
const beatWidth = (type: number): number => {
  if (type <= 1) return 64;   // whole
  if (type <= 2) return 48;   // half
  if (type <= 4) return 36;   // quarter
  if (type <= 8) return 28;   // eighth
  return 24;                  // sixteenth+
};

const STRING_SPACING = 22; // px between strings
const LABEL_WIDTH = 24;    // left label column

const processMeasures = (data: TabData): ProcessedMeasure[] => {
  return data.measures.map((measure, idx) => {
    const beats: ProcessedBeat[] = [];

    if (measure.rest || !measure.voices?.[0]?.beats?.length) {
      // Empty/rest measure: single rest beat spanning the whole measure
      beats.push({ frets: new Map(), isRest: true, type: 1 });
    } else {
      for (const beat of measure.voices[0].beats) {
        const frets = new Map<number, number>();
        if (!beat.rest && beat.notes) {
          for (const note of beat.notes) {
            if (note.fret !== undefined && note.string !== undefined && !note.rest) {
              frets.set(note.string, note.fret);
            }
          }
        }
        beats.push({
          frets,
          isRest: !!beat.rest || frets.size === 0,
          type: beat.type || 4,
        });
      }
    }

    return {
      beats,
      marker: measure.marker?.text,
      measureNumber: idx + 1,
      signature: measure.signature,
    };
  });
};

// A single fret number displayed on a string line
const FretNumber: React.FC<{ fret: number }> = ({ fret }) => {
  const text = fret.toString();
  const isWide = text.length > 1;
  return (
    <span
      className={`absolute text-bone font-mono font-bold leading-none select-none ${
        isWide ? 'text-[11px]' : 'text-xs'
      }`}
      style={{
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2,
      }}
    >
      {text}
    </span>
  );
};

// Background pill behind fret numbers to occlude the line
const FretBg: React.FC<{ fret: number }> = ({ fret }) => {
  const w = fret.toString().length > 1 ? 18 : 12;
  return (
    <span
      className="absolute bg-bg-steel rounded-sm"
      style={{
        width: `${w}px`,
        height: '14px',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1,
      }}
    />
  );
};

// Single beat column
const BeatColumn: React.FC<{
  beat: ProcessedBeat;
  numStrings: number;
  width: number;
}> = ({ beat, numStrings, width }) => {
  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: `${width}px`, height: `${(numStrings - 1) * STRING_SPACING}px` }}
    >
      {/* Fret numbers positioned on each string */}
      {Array.from({ length: numStrings }, (_, sIdx) => {
        const fret = beat.frets.get(sIdx);
        if (fret === undefined) return null;
        return (
          <div
            key={sIdx}
            className="absolute"
            style={{
              top: `${sIdx * STRING_SPACING}px`,
              left: '50%',
              width: '20px',
              height: '1px',
              transform: 'translateX(-50%)',
            }}
          >
            <FretBg fret={fret} />
            <FretNumber fret={fret} />
          </div>
        );
      })}
    </div>
  );
};

// A single measure block
const MeasureBlock: React.FC<{
  measure: ProcessedMeasure;
  numStrings: number;
  isLast: boolean;
}> = ({ measure, numStrings, isLast }) => {
  // Calculate total width for this measure
  const totalBeatWidth = measure.beats.reduce((sum, b) => sum + beatWidth(b.type), 0);
  const minWidth = 60;
  const measWidth = Math.max(totalBeatWidth + 16, minWidth); // 16px padding

  return (
    <div className="relative flex-shrink-0" style={{ width: `${measWidth}px` }}>
      {/* Measure number */}
      <div
        className="absolute text-bone/20 font-mono select-none"
        style={{ top: '-16px', left: '2px', fontSize: '9px', lineHeight: '1' }}
      >
        {measure.measureNumber}
      </div>

      {/* Beat area with string lines behind */}
      <div
        className="relative"
        style={{ height: `${(numStrings - 1) * STRING_SPACING}px` }}
      >
        {/* String lines */}
        {Array.from({ length: numStrings }, (_, sIdx) => (
          <div
            key={sIdx}
            className="absolute w-full border-b border-bone/20"
            style={{ top: `${sIdx * STRING_SPACING}px`, left: 0 }}
          />
        ))}

        {/* Beats laid out horizontally */}
        <div className="relative flex items-start justify-evenly h-full">
          {measure.beats.map((beat, bIdx) => (
            <BeatColumn
              key={bIdx}
              beat={beat}
              numStrings={numStrings}
              width={beatWidth(beat.type)}
            />
          ))}
        </div>
      </div>

      {/* Right bar line */}
      {!isLast && (
        <div
          className="absolute top-0 right-0 border-r border-bone/15"
          style={{ height: `${(numStrings - 1) * STRING_SPACING}px` }}
        />
      )}
    </div>
  );
};

// A complete row of measures (one "line" of tablature)
const TabRowView: React.FC<{
  row: TabRow;
  numStrings: number;
  stringLabels: string[];
}> = ({ row, numStrings, stringLabels }) => {
  const staffHeight = (numStrings - 1) * STRING_SPACING;

  return (
    <div className="mb-8">
      {/* Section marker */}
      {row.marker && (
        <div className="text-crimson font-metal text-sm tracking-wide mb-1 select-none">
          {row.marker}
        </div>
      )}

      <div className="flex items-start">
        {/* String labels column */}
        <div
          className="flex-shrink-0 relative"
          style={{ width: `${LABEL_WIDTH}px`, height: `${staffHeight}px` }}
        >
          {stringLabels.map((label, sIdx) => (
            <div
              key={sIdx}
              className="absolute text-bone/30 font-mono text-[11px] select-none"
              style={{
                top: `${sIdx * STRING_SPACING - 7}px`,
                right: '4px',
                lineHeight: '14px',
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Opening bar line */}
        <div
          className="flex-shrink-0 border-r border-bone/30"
          style={{ height: `${staffHeight}px` }}
        />

        {/* Measures */}
        <div className="flex items-start">
          {row.measures.map((measure, mIdx) => (
            <MeasureBlock
              key={measure.measureNumber}
              measure={measure}
              numStrings={numStrings}
              isLast={mIdx === row.measures.length - 1}
            />
          ))}
        </div>

        {/* Closing bar line */}
        <div
          className="flex-shrink-0 border-r border-bone/30"
          style={{ height: `${staffHeight}px` }}
        />
      </div>
    </div>
  );
};

const TabRenderer: React.FC<TabRendererProps> = ({ data }) => {
  const numStrings = data.strings || 6;
  const stringLabels = numStrings === 4 ? STRING_LABELS_4 : STRING_LABELS_6;
  const containerRef = useRef<HTMLDivElement>(null);
  const [measuresPerRow, setMeasuresPerRow] = useState(MEASURES_PER_ROW);

  // Responsive: recalculate measures per row based on container width
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 800;
      // Estimate: each measure ~120-180px, label col ~24px, bar lines ~4px
      const available = width - LABEL_WIDTH - 8;
      const perRow = Math.max(1, Math.min(8, Math.floor(available / 140)));
      setMeasuresPerRow(perRow);
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const rows = useMemo(() => {
    const processed = processMeasures(data);

    // Build rows respecting measuresPerRow and section markers
    const result: TabRow[] = [];
    let currentRow: ProcessedMeasure[] = [];
    let pendingMarker: string | undefined;

    for (const measure of processed) {
      if (measure.marker && currentRow.length === 0) {
        pendingMarker = measure.marker;
      } else if (measure.marker && currentRow.length > 0) {
        result.push({ measures: currentRow, marker: pendingMarker });
        currentRow = [];
        pendingMarker = measure.marker;
      }

      currentRow.push(measure);

      if (currentRow.length >= measuresPerRow) {
        result.push({ measures: currentRow, marker: pendingMarker });
        currentRow = [];
        pendingMarker = undefined;
      }
    }

    if (currentRow.length > 0) {
      result.push({ measures: currentRow, marker: pendingMarker });
    }

    return result;
  }, [data, measuresPerRow]);

  const tempo = data.automations?.tempo?.[0]?.value;

  return (
    <div ref={containerRef} className="w-full">
      {/* Track info header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-bone text-sm font-medium">{data.name}</h4>
          <p className="text-bone/30 text-xs font-mono">
            {data.instrument} | {data.strings} strings
          </p>
        </div>
        {tempo && (
          <span className="text-xs font-mono text-ember">{tempo} BPM</span>
        )}
      </div>

      {/* Tab staff rows */}
      <div
        className="overflow-x-auto pb-4"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(220,20,60,0.3) transparent' }}
      >
        {rows.map((row, rIdx) => (
          <TabRowView
            key={rIdx}
            row={row}
            numStrings={numStrings}
            stringLabels={stringLabels}
          />
        ))}
      </div>
    </div>
  );
};

export default TabRenderer;
