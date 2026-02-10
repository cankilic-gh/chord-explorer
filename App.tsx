
import React, { useState, useMemo } from 'react';
import ChordSelector from './components/ChordSelector';
import Piano from './components/Piano';
import Fretboard from './components/Fretboard';
import RelativeChords from './components/RelativeChords';
import ProgressionBuilder from './components/ProgressionBuilder';
import CircleOfFifths from './components/CircleOfFifths';
import CAGEDView from './components/CAGEDView';
import { getChordNotes, getAllChordVoicings, getRelativeChords, getRomanNumeral } from './lib/musicTheory';
import { NOTES, CHORD_TYPES, ChordType, Note, Chord as AppChord, ProgressionChord } from './constants/musicData';

const App: React.FC = () => {
  const [rootNote, setRootNote] = useState<Note>('A');
  const [chordType, setChordType] = useState<ChordType>('minor');
  const [hoveredChord, setHoveredChord] = useState<AppChord | null>(null);
  const [showCircleOfFifths, setShowCircleOfFifths] = useState(false);
  const [showCAGED, setShowCAGED] = useState(false);
  const [selectedVoicingIndex, setSelectedVoicingIndex] = useState(0);
  const [progression, setProgression] = useState<ProgressionChord[]>([]);
  const [showRelativeChords, setShowRelativeChords] = useState(false);

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
      // Add chord with current voicing index (or 0 if not the selected chord)
      const voicingIdx = (chord.root === rootNote && chord.type === chordType)
        ? currentVoicingIndex
        : 0;
      setProgression([...progression, { ...chord, voicingIndex: voicingIdx }]);
    }
  };

  const handleUpdateProgressionVoicing = (index: number, voicingIndex: number) => {
    setProgression(progression.map((chord, i) =>
      i === index ? { ...chord, voicingIndex } : chord
    ));
  };

  const handleClearProgression = () => {
    setProgression([]);
  };

  const handleChordTypeChange = (newType: ChordType) => {
    const currentVoicingName = currentVoicing?.name;
    const newVoicings = getAllChordVoicings(rootNote, newType);

    // Try to find a voicing with the same name
    const matchingIndex = currentVoicingName
      ? newVoicings.findIndex(v => v.name === currentVoicingName)
      : -1;

    setChordType(newType);
    setSelectedVoicingIndex(matchingIndex >= 0 ? matchingIndex : 0);
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
      <header className="p-3 md:p-4 border-b border-[#30363d] flex items-center justify-between">
        <div className="hidden lg:block w-[140px]"></div>
        <h1 className="text-lg md:text-2xl font-bold font-mono">Chord Explorer</h1>
        <div className="flex gap-1 md:gap-2">
          <button
            onClick={() => setShowCAGED(true)}
            className="p-2 md:px-4 md:py-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-lg text-sm font-mono transition-colors flex items-center gap-1 md:gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
            <span className="hidden md:inline">CAGED</span>
          </button>
          <button
            onClick={() => setShowCircleOfFifths(true)}
            className="p-2 md:px-4 md:py-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-lg text-sm font-mono transition-colors flex items-center gap-1 md:gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
            <span className="hidden md:inline">Circle of Fifths</span>
          </button>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        {/* Left Sidebar - Hidden on mobile, shown on lg */}
        <aside className="hidden lg:block w-[240px] flex-shrink-0 bg-[#161b22] border-r border-[#30363d] p-4 overflow-y-auto">
          <ChordSelector
            selectedRoot={rootNote}
            selectedType={chordType}
            onRootChange={(root) => { setRootNote(root); setSelectedVoicingIndex(0); }}
            onTypeChange={handleChordTypeChange}
          />
        </aside>

        {/* Mobile Chord Selector - Only shown on mobile */}
        <div className="lg:hidden bg-[#161b22] border-b border-[#30363d] p-3">
          <ChordSelector
            selectedRoot={rootNote}
            selectedType={chordType}
            onRootChange={(root) => { setRootNote(root); setSelectedVoicingIndex(0); }}
            onTypeChange={handleChordTypeChange}
            compact
          />
        </div>

        <main className="flex-1 flex flex-col p-3 md:p-4 overflow-y-auto pb-32 lg:pb-28">
          <div className="w-full max-w-5xl mx-auto">
            <Piano notes={chordNotes} />
            <div className={`flex items-center gap-2 mb-3 mt-3 md:mt-4 h-10 transition-opacity overflow-x-auto ${hoveredChord ? 'opacity-40' : ''}`}>
              <span className="text-xs md:text-sm text-[#8b949e] font-mono whitespace-nowrap">Voicing:</span>
              {allVoicings.length > 1 ? (
                <div className="flex gap-1">
                  {allVoicings.map((voicing, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedVoicingIndex(index)}
                      disabled={!!hoveredChord}
                      className={`px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm font-mono rounded-md transition-all whitespace-nowrap ${
                        currentVoicingIndex === index
                          ? 'bg-[#238636] text-white border border-[#238636]'
                          : 'bg-[#21262d] text-[#c9d1d9] border border-[#30363d] hover:bg-[#30363d] hover:border-[#8b949e]'
                      } ${hoveredChord ? 'cursor-not-allowed' : ''}`}
                    >
                      {voicing.name}
                      {voicing.startFret > 0 && (
                        <span className="ml-1 text-xs opacity-70">({voicing.startFret}fr)</span>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <span className="text-xs md:text-sm text-[#8b949e] font-mono">{allVoicings[0]?.name || 'Default'}</span>
              )}
              {hoveredChord && (
                <span className="ml-2 text-xs text-[#8b949e] italic">Preview</span>
              )}
            </div>
            <Fretboard voicing={displayVoicing} isPreview={hoveredChord !== null} />

            {/* Mobile Theory Note - smaller */}
            <div className="hidden md:block">
              <TheoryNote chord={selectedChord} />
            </div>

            {/* Mobile Relative Chords Toggle */}
            <button
              onClick={() => setShowRelativeChords(!showRelativeChords)}
              className="lg:hidden w-full mt-4 p-3 bg-[#161b22] border border-[#30363d] rounded-lg flex items-center justify-between font-mono text-sm"
            >
              <span>Related Chords ({relativeChords.length})</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`transition-transform ${showRelativeChords ? 'rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Mobile Relative Chords - Collapsible */}
            {showRelativeChords && (
              <div className="lg:hidden mt-3 bg-[#161b22] border border-[#30363d] rounded-lg p-3">
                <RelativeChords
                  chords={relativeChords}
                  selectedChord={selectedChord}
                  progression={progression}
                  onSelectChord={handleSelectChord}
                  onAddToProgression={handleAddChordToProgression}
                  onHoverChord={setHoveredChord}
                  compact
                />
              </div>
            )}
          </div>
        </main>

        {/* Right Sidebar - Hidden on mobile */}
        <aside className="hidden lg:block w-[280px] flex-shrink-0 bg-[#161b22] border-l border-[#30363d] p-4 overflow-y-auto">
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
        onUpdateVoicing={handleUpdateProgressionVoicing}
      />
      {showCircleOfFifths && (
        <CircleOfFifths
          selectedKey={rootNote}
          isMinor={chordType === 'minor' || chordType === 'm7'}
          onSelectKey={handleCircleKeySelect}
          onClose={() => setShowCircleOfFifths(false)}
        />
      )}
      {showCAGED && (
        <CAGEDView
          rootNote={rootNote}
          chordType={chordType}
          onSelectShape={(shape) => {
            // CAGED shape selected - for now just close, later can update main voicing
            console.log('Selected CAGED shape:', shape.name, 'at fret', shape.fret);
          }}
          onClose={() => setShowCAGED(false)}
        />
      )}
    </div>
  );
};

export default App;
