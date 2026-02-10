
import React, { useState, useMemo } from 'react';
import ChordSelector from './components/ChordSelector';
import Piano from './components/Piano';
import Fretboard from './components/Fretboard';
import RelativeChords from './components/RelativeChords';
import ProgressionBuilder from './components/ProgressionBuilder';
import { getChordNotes, getChordVoicing, getRelativeChords, getRomanNumeral } from './lib/musicTheory';
import { NOTES, CHORD_TYPES, ChordType, Note, Chord as AppChord } from './constants/musicData';

const App: React.FC = () => {
  const [rootNote, setRootNote] = useState<Note>('A');
  const [chordType, setChordType] = useState<ChordType>('minor');
  const [hoveredChord, setHoveredChord] = useState<AppChord | null>(null);
  const [progression, setProgression] = useState<AppChord[]>([
    { root: 'A', type: 'minor' },
    { root: 'F', type: 'Major' },
    { root: 'C', type: 'Major' },
    { root: 'G', type: 'Major' },
  ]);

  const selectedChord = useMemo(() => ({ root: rootNote, type: chordType }), [rootNote, chordType]);
  const chordNotes = useMemo(() => getChordNotes(rootNote, chordType), [rootNote, chordType]);
  const chordVoicing = useMemo(() => getChordVoicing(rootNote, chordType), [rootNote, chordType]);
  const relativeChords = useMemo(() => getRelativeChords(rootNote, chordType), [rootNote, chordType]);

  // Use hovered chord voicing if available, otherwise use selected chord voicing
  const displayVoicing = useMemo(() => {
    if (hoveredChord) {
      return getChordVoicing(hoveredChord.root, hoveredChord.type);
    }
    return chordVoicing;
  }, [hoveredChord, chordVoicing]);

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
      <header className="p-4 border-b border-[#30363d] text-center">
        <h1 className="text-2xl font-bold font-mono">Chord Explorer</h1>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-[200px] flex-shrink-0 bg-[#161b22] border-r border-[#30363d] p-4 overflow-y-auto">
          <ChordSelector
            selectedRoot={rootNote}
            selectedType={chordType}
            onRootChange={setRootNote}
            onTypeChange={setChordType}
          />
        </aside>
        <main className="flex-1 flex flex-col p-4 overflow-y-auto pb-28">
          <div className="w-full max-w-5xl mx-auto">
            <Piano notes={chordNotes} />
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
    </div>
  );
};

export default App;
