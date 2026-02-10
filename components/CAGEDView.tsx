
import React, { useMemo, useState } from 'react';
import { Note, ChordType, CHORD_TYPES } from '../constants/musicData';
import { calculateCAGEDPositions, cagedShapeToVoicing, CAGEDShape } from '../lib/cagedSystem';

interface CAGEDViewProps {
  rootNote: Note;
  chordType: ChordType;
  onSelectShape: (shape: CAGEDShape) => void;
  onClose: () => void;
}

const INTERVAL_COLORS: Record<string, string> = {
  'Root': '#f85149',
  'Minor 3rd': '#58a6ff',
  'Major 3rd': '#58a6ff',
  'Perfect 5th': '#3fb950',
};

const MiniCAGEDFretboard: React.FC<{
  shape: CAGEDShape;
  rootNote: Note;
  isMinor: boolean;
  isSelected: boolean;
  onClick: () => void;
}> = ({ shape, rootNote, isMinor, isSelected, onClick }) => {
  const voicing = useMemo(
    () => cagedShapeToVoicing(shape, rootNote, isMinor),
    [shape, rootNote, isMinor]
  );

  // Show 5 frets starting from shape position
  const startFret = shape.fret;
  const fretCount = 5;

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all hover:scale-105 ${
        isSelected
          ? 'border-[#4493f8] bg-[#4493f8]/10'
          : 'border-[#30363d] bg-[#161b22] hover:border-[#8b949e]'
      }`}
    >
      {/* Shape name */}
      <div
        className="text-2xl font-bold font-mono mb-1"
        style={{ color: shape.color }}
      >
        {shape.name}
      </div>
      <div className="text-xs text-[#8b949e] mb-2 font-mono">
        {shape.fret}. fret
      </div>

      {/* Mini fretboard */}
      <div className="relative w-16 h-20 bg-[#0d1117] rounded border border-[#30363d]">
        {/* Nut if at position 0 */}
        {startFret === 0 && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#8b949e]" />
        )}

        {/* Fret lines */}
        {[1, 2, 3, 4].map(fret => (
          <div
            key={fret}
            className="absolute w-full h-px bg-[#30363d]"
            style={{ top: `${fret * 20}%` }}
          />
        ))}

        {/* String lines */}
        {[0, 1, 2, 3, 4, 5].map(string => (
          <div
            key={string}
            className="absolute h-full bg-[#30363d]"
            style={{
              left: `${(string / 5) * 100}%`,
              width: string === 0 || string === 5 ? '1px' : '1px',
            }}
          />
        ))}

        {/* Notes */}
        {voicing.map((pos, idx) => {
          const relativeFret = pos.fret - startFret;
          if (relativeFret < 0 || relativeFret >= fretCount) return null;

          const x = ((5 - pos.string) / 5) * 100;
          const y = relativeFret === 0 ? 10 : relativeFret * 20 + 10;

          return (
            <div
              key={idx}
              className="absolute w-2.5 h-2.5 rounded-full transform -translate-x-1/2 -translate-y-1/2 border border-white/30"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                backgroundColor: INTERVAL_COLORS[pos.interval] || shape.color,
              }}
            />
          );
        })}

        {/* Muted strings (X) */}
        {shape.pattern.map((fret, stringIdx) => {
          if (fret !== -1) return null;
          const x = (stringIdx / 5) * 100;
          return (
            <div
              key={`mute-${stringIdx}`}
              className="absolute text-[8px] text-[#8b949e] transform -translate-x-1/2"
              style={{ left: `${x}%`, top: '-12px' }}
            >
              ×
            </div>
          );
        })}
      </div>

      {isSelected && (
        <div className="mt-2 text-xs text-[#4493f8] font-mono">Seçili</div>
      )}
    </button>
  );
};

const FullFretboardView: React.FC<{
  shapes: CAGEDShape[];
  selectedShape: CAGEDShape | null;
  onSelectShape: (shape: CAGEDShape) => void;
}> = ({ shapes, selectedShape, onSelectShape }) => {
  const maxFret = 15;

  return (
    <div className="relative h-24 bg-[#0d1117] rounded-lg border border-[#30363d] overflow-hidden">
      {/* Fret markers */}
      {[3, 5, 7, 9, 12, 15].map(fret => (
        <React.Fragment key={fret}>
          <div
            className="absolute top-1/2 w-2 h-2 rounded-full bg-[#30363d] transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${((fret - 0.5) / maxFret) * 100}%` }}
          />
          <div
            className="absolute bottom-1 text-[10px] text-[#8b949e] font-mono transform -translate-x-1/2"
            style={{ left: `${((fret - 0.5) / maxFret) * 100}%` }}
          >
            {fret}
          </div>
        </React.Fragment>
      ))}

      {/* String lines */}
      {[0, 1, 2, 3, 4, 5].map(string => (
        <div
          key={string}
          className="absolute w-full h-px bg-[#30363d]"
          style={{ top: `${15 + string * 12}%` }}
        />
      ))}

      {/* Fret lines */}
      {Array.from({ length: maxFret + 1 }).map((_, fret) => (
        <div
          key={fret}
          className="absolute h-full w-px bg-[#30363d]"
          style={{ left: `${(fret / maxFret) * 100}%` }}
        />
      ))}

      {/* Shape regions */}
      {shapes.map((shape, idx) => {
        const startFret = shape.fret;
        const endFret = Math.min(startFret + 4, maxFret);
        const isSelected = selectedShape?.name === shape.name;

        return (
          <button
            key={shape.name}
            onClick={() => onSelectShape(shape)}
            className={`absolute top-2 bottom-6 rounded transition-all ${
              isSelected ? 'opacity-90' : 'opacity-50 hover:opacity-70'
            }`}
            style={{
              left: `${(startFret / maxFret) * 100}%`,
              width: `${((endFret - startFret) / maxFret) * 100}%`,
              backgroundColor: shape.color,
            }}
          >
            <span className="absolute inset-0 flex items-center justify-center text-white font-bold font-mono text-lg">
              {shape.name}
            </span>
          </button>
        );
      })}

      {/* Nut */}
      <div className="absolute left-0 top-0 bottom-6 w-1 bg-[#8b949e]" />
    </div>
  );
};

const CAGEDView: React.FC<CAGEDViewProps> = ({
  rootNote,
  chordType,
  onSelectShape,
  onClose,
}) => {
  const isMinor = chordType === 'minor' || chordType === 'm7';
  const shapes = useMemo(
    () => calculateCAGEDPositions(rootNote, chordType),
    [rootNote, chordType]
  );

  const [selectedShape, setSelectedShape] = useState<CAGEDShape>(shapes[0]);

  const chordName = `${rootNote}${CHORD_TYPES[chordType].symbol}`;

  const handleSelectAndClose = (shape: CAGEDShape) => {
    onSelectShape(shape);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold font-mono">CAGED System</h2>
            <p className="text-[#8b949e] text-sm mt-1">
              <span className="text-[#c9d1d9] font-mono text-lg">{chordName}</span> akorunun 5 pozisyonu
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#8b949e] hover:text-[#c9d1d9] p-2"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Explanation */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 mb-6">
          <p className="text-sm text-[#8b949e]">
            <span className="text-[#c9d1d9] font-bold">CAGED</span> sistemi, aynı akoru klavyenin 5 farklı bölgesinde
            çalmayı gösterir. Her şekil açık akorlardan (
            <span style={{color: '#3fb950'}}>C</span>,
            <span style={{color: '#58a6ff'}}> A</span>,
            <span style={{color: '#bc8cff'}}> G</span>,
            <span style={{color: '#f85149'}}> E</span>,
            <span style={{color: '#d29922'}}> D</span>
            ) türetilmiştir ve birbirine bağlanarak tüm klavyeyi kaplar.
          </p>
        </div>

        {/* Full fretboard visualization */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-[#8b949e] mb-3 font-mono">
            Klavye Üzerinde {chordName} Pozisyonları
          </h3>
          <FullFretboardView
            shapes={shapes}
            selectedShape={selectedShape}
            onSelectShape={setSelectedShape}
          />
          <p className="text-xs text-[#8b949e] mt-2 text-center">
            Bir bölgeye tıklayarak detayları görün
          </p>
        </div>

        {/* 5 CAGED shapes */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-[#8b949e] mb-3 font-mono">5 Temel Pozisyon</h3>
          <div className="grid grid-cols-5 gap-3">
            {shapes.map((shape) => (
              <MiniCAGEDFretboard
                key={shape.name}
                shape={shape}
                rootNote={rootNote}
                isMinor={isMinor}
                isSelected={selectedShape?.name === shape.name}
                onClick={() => setSelectedShape(shape)}
              />
            ))}
          </div>
        </div>

        {/* Selected shape details */}
        {selectedShape && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold font-mono text-xl text-white"
                    style={{ backgroundColor: selectedShape.color }}
                  >
                    {selectedShape.name}
                  </span>
                  <div>
                    <p className="font-mono text-lg text-[#c9d1d9]">
                      {selectedShape.name} Shape - {selectedShape.fret}. fret
                    </p>
                    <p className="text-sm text-[#8b949e]">{selectedShape.description}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleSelectAndClose(selectedShape)}
                className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg text-sm font-mono transition-colors"
              >
                Bu Pozisyonu Seç
              </button>
            </div>

            {/* Learning tip */}
            <div className="mt-4 p-3 bg-[#0d1117] rounded border border-[#30363d]">
              <p className="text-xs text-[#8b949e]">
                <span className="text-[#d29922] font-bold">İpucu:</span> {selectedShape.name} şeklini öğrenmek için,
                önce açık {selectedShape.name} {isMinor ? 'minor' : 'Major'} akorunu çal, sonra aynı parmak
                pozisyonunu {selectedShape.fret}. frete kaydır. Root nota (kırmızı) her zaman aynı telde kalır.
              </p>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex justify-center gap-6 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f85149' }}></span>
            <span className="text-[#8b949e]">Root</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#58a6ff' }}></span>
            <span className="text-[#8b949e]">3rd</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3fb950' }}></span>
            <span className="text-[#8b949e]">5th</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default CAGEDView;
