
import React, { useState, useMemo } from 'react';
import ChordSelector from './components/ChordSelector';
import Piano from './components/Piano';
import Fretboard from './components/Fretboard';
import RelativeChords from './components/RelativeChords';
import ProgressionBuilder from './components/ProgressionBuilder';
import CircleOfFifths from './components/CircleOfFifths';
import { getChordNotes, getAllChordVoicings, getRelativeChords, getRomanNumeral } from './lib/musicTheory';
import { NOTES, CHORD_TYPES, ChordType, Note, Chord as AppChord } from './constants/musicData';

const App: React.FC = () => {
  const [rootNote, setRootNote] = useState<Note>('A');
  const [chordType, setChordType] = useState<ChordType>('minor');
  const [hoveredChord, setHoveredChord] = useState<AppChord | null>(null);
  const [showCircleOfFifths, setShowCircleOfFifths] = useState(false);
  const [selectedVoicingIndex, setSelectedVoicingIndex] = useState(0);
  const [progression, setProgression] = useState<AppChord[]>([
    { root: 'A', type: 'minor' },
    { root: 'F', type: 'Major' },
    { root: 'C', type: 'Major' },
    { root: 'G', type: 'Major' },
  ]);

  const selectedChord = useMemo(() => ({ root: rootNote, type: chordType }), [rootNote, chordType]);
  const chordNotes = useMemo(() => getChordNotes(rootNote, chordType), [rootNote, chordType]);
  const allVoicings = useMemo(() => getAllChordVoicings(rootNote, chordType), [rootNote, chordType]);
  const relativeChords = useMemo(() => getRelativeChords(rootNote, chordType), [rootNote, chordType]);

  // Reset voicing index when chord changes and index would be out of bounds
  const currentVoicingIndex = selectedVoicingIndex >= allVoicings.length ? 0 : selectedVoicingIndex;
  const currentVoicing = allVoicings[currentVoicingIndex];

  // Use hovered chord voicing if available, otherwise use selected chord voicing
  const displayVoicing = useMemo(() => {
    if (hoveredChord) {
      const hoverVoicings = getAllChordVoicings(hoveredChord.root, hoveredChord.type);
      return hoverVoicings[0]?.voicing || [];
    }
    return currentVoicing?.voicing || [];
  }, [hoveredChord, currentVoicing]);

  const handleAddChordToProgression = (chord: AppChord) => {
    if (progression.length < 8) {
      setProgression([...progression, chord]);
    }
  };

  const handleClearProgression = () => {
    setProgression([]);
  };

  const handleSelectChord = (root: Note, type: ChordType) => {
    setRootNote(root);
    setChordType(type);
    setSelectedVoicingIndex(0); // Reset to first voicing when chord changes
  }

  const handleCircleKeySelect = (key: Note, isMinor: boolean) => {
    setRootNote(key);
    setChordType(isMinor ? 'minor' : 'Major');
  }
  
  const TheoryNote: React.FC<{ chord: AppChord }> = ({ chord }) => {
    const roman = getRomanNumeral(chord.root, chord.type);
    const notes = getChordNotes(chord.root, chord.type).map(n => n.note).join(', ');
    return (
      <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 mt-4 text-sm text-[#8b949e]">
        <h3 className="font-bold text-base text-[#c9d1d9] font-mono">{chord.root}{CHORD_TYPES[chord.type].symbol} ({roman})</h3>
        <p className="mt-2">
          The {chord.root} {chord.type} chord consists of the notes: <span className="font-mono text-[#4493f8]">{notes}</span>.
          It serves as the '{roman}' chord in its relative major key.
          This chord has a {chord.type === 'minor' ? 'somber, melancholic' : 'bright, happy'} quality.
        </p>
      </div>
    );
  };

  return (
    <div className="bg-[#0d1117] text-[#c9d1d9] min-h-screen flex flex-col">
      <header className="p-4 border-b border-[#30363d] flex items-center justify-between">
        <div className="w-[140px]"></div>
        <h1 className="text-2xl font-bold font-mono">Chord Explorer</h1>
        <button
          onClick={() => setShowCircleOfFifths(true)}
          className="px-4 py-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-lg text-sm font-mono transition-colors flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
          Circle of Fifths
        </button>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-[200px] flex-shrink-0 bg-[#161b22] border-r border-[#30363d] p-4 overflow-y-auto">
          <ChordSelector
            selectedRoot={rootNote}
            selectedType={chordType}
            onRootChange={(root) => { setRootNote(root); setSelectedVoicingIndex(0); }}
            onTypeChange={(type) => { setChordType(type); setSelectedVoicingIndex(0); }}
          />
        </aside>
        <main className="flex-1 flex flex-col p-4 overflow-y-auto pb-28">
          <div className="w-full max-w-5xl mx-auto">
            <Piano notes={chordNotes} />
            {allVoicings.length > 1 && !hoveredChord && (
              <div className="flex items-center gap-2 mb-3 mt-4">
                <span className="text-sm text-[#8b949e] font-mono">Voicing:</span>
                <div className="flex gap-1">
                  {allVoicings.map((voicing, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedVoicingIndex(index)}
                      className={`px-3 py-1.5 text-sm font-mono rounded-md transition-all ${
                        currentVoicingIndex === index
                          ? 'bg-[#238636] text-white border border-[#238636]'
                          : 'bg-[#21262d] text-[#c9d1d9] border border-[#30363d] hover:bg-[#30363d] hover:border-[#8b949e]'
                      }`}
                    >
                      {voicing.name}
                      {voicing.startFret > 0 && (
                        <span className="ml-1 text-xs opacity-70">({voicing.startFret}fr)</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <Fretboard voicing={displayVoicing} isPreview={hoveredChord !== null} />
            <TheoryNote chord={selectedChord} />
          </div>
        </main>
        <aside className="w-[280px] flex-shrink-0 bg-[#161b22] border-l border-[#30363d] p-4 overflow-y-auto">
          <RelativeChords
            chords={relativeChords}
            selectedChord={selectedChord}
            progression={progression}
            onSelectChord={handleSelectChord}
            onAddToProgression={handleAddChordToProgression}
            onHoverChord={setHoveredChord}
          />
        </aside>
      </div>
      <ProgressionBuilder
        progression={progression}
        onClear={handleClearProgression}
        onRemove={(index) => setProgression(progression.filter((_, i) => i !== index))}
      />
      {showCircleOfFifths && (
        <CircleOfFifths
          selectedKey={rootNote}
          isMinor={chordType === 'minor' || chordType === 'm7'}
          onSelectKey={handleCircleKeySelect}
          onClose={() => setShowCircleOfFifths(false)}
        />
      )}
    </div>
  );
};

export default App;
