
import React, { useState, useMemo } from 'react';
import { Play, LayoutGrid, Circle as CircleIcon, Volume2, Info } from 'lucide-react';
import ChordSelector from './components/ChordSelector';
import Piano from './components/Piano';
import Fretboard from './components/Fretboard';
import RelativeChords from './components/RelativeChords';
import ProgressionBuilder from './components/ProgressionBuilder';
import CircleOfFifths from './components/CircleOfFifths';
import CAGEDView from './components/CAGEDView';
import { getChordNotes, getAllChordVoicings, getRelativeChords, getRomanNumeral } from './lib/musicTheory';
import { NOTES, CHORD_TYPES, ChordType, Note, Chord as AppChord, ProgressionChord } from './constants/musicData';
import { playChordFromChord, ensureAudioContext } from './lib/audioEngine';

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

  const handlePlayChord = async () => {
    await ensureAudioContext();
    playChordFromChord(selectedChord, 'guitar');
  };

  const TheoryNote: React.FC<{ chord: AppChord }> = ({ chord }) => {
    const roman = getRomanNumeral(chord.root, chord.type);
    const notes = getChordNotes(chord.root, chord.type).map(n => n.note).join(', ');
    return (
      <div className="bg-purple/10 border border-purple/20 rounded-lg p-5 mt-6 flex gap-4">
        <div className="mt-0.5">
          <Info className="w-5 h-5 text-purple" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-purple mb-1">Theory Note</h4>
          <p className="text-sm text-white/70 leading-relaxed">
            <span className="font-mono text-cyan">{chord.root}{CHORD_TYPES[chord.type].symbol}</span> ({roman}) consists of the notes: <span className="font-mono text-cyan">{notes}</span>.
            It serves as the '{roman}' chord in its relative major key.
            This chord has a {chord.type === 'minor' ? 'somber, melancholic' : 'bright, happy'} quality.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-bg-dark text-white min-h-screen flex flex-col">
      <header className="h-16 border-b border-white/10 bg-bg-dark/80 backdrop-blur-md flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan to-purple flex items-center justify-center shadow-[0_0_15px_rgba(0,212,255,0.3)]">
            <Play className="w-4 h-4 text-white ml-0.5" fill="currentColor" />
          </div>
          <h1 className="text-lg md:text-xl font-bold tracking-wider text-white">CHORD EXPLORER</h1>
        </div>
        <div className="flex gap-2 md:gap-3">
          <button
            onClick={() => setShowCAGED(true)}
            className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-medium"
          >
            <LayoutGrid className="w-4 h-4 text-cyan" />
            <span className="hidden md:inline">CAGED</span>
          </button>
          <button
            onClick={() => setShowCircleOfFifths(true)}
            className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-medium"
          >
            <CircleIcon className="w-4 h-4 text-purple" />
            <span className="hidden md:inline">Circle of Fifths</span>
          </button>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        {/* Left Sidebar - Hidden on mobile, shown on lg */}
        <aside className="hidden lg:block w-72 flex-shrink-0 border-r border-white/10 p-6 overflow-y-auto bg-bg-dark/50">
          <ChordSelector
            selectedRoot={rootNote}
            selectedType={chordType}
            onRootChange={(root) => { setRootNote(root); setSelectedVoicingIndex(0); }}
            onTypeChange={handleChordTypeChange}
          />
        </aside>

        {/* Mobile Chord Selector - Only shown on mobile */}
        <div className="lg:hidden border-b border-white/10 p-3 bg-bg-dark/50">
          <ChordSelector
            selectedRoot={rootNote}
            selectedType={chordType}
            onRootChange={(root) => { setRootNote(root); setSelectedVoicingIndex(0); }}
            onTypeChange={handleChordTypeChange}
            compact
          />
        </div>

        <main className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto pb-36 lg:pb-32 bg-bg-dark">
          <div className="w-full max-w-5xl mx-auto">
            {/* Chord Title Area */}
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight flex items-center gap-3">
                  {rootNote}{CHORD_TYPES[chordType].symbol}
                  <span className="text-lg md:text-xl font-normal text-white/50 font-mono">
                    ({rootNote} {chordType})
                  </span>
                </h2>
                <p className="text-white/60 mt-2 text-sm">
                  {chordType === 'minor' ? 'A minor chord with a somber, melancholic quality.' :
                   chordType === 'Major' ? 'A major chord with a bright, uplifting quality.' :
                   chordType === 'm7' ? 'A minor chord with an added minor seventh.' :
                   chordType === 'M7' ? 'A major chord with an added major seventh.' :
                   chordType === '7' ? 'A dominant seventh chord with a strong pull to resolve.' :
                   chordType === 'dim' ? 'A diminished chord with a tense, unstable quality.' :
                   chordType === 'aug' ? 'An augmented chord with a bright, suspended quality.' :
                   `The ${rootNote} ${chordType} chord.`}
                </p>
              </div>
              <button
                onClick={handlePlayChord}
                className="w-12 h-12 rounded-full bg-cyan/10 text-cyan border border-cyan/30 flex items-center justify-center hover:bg-cyan/20 transition-colors"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Piano */}
            <div className="mb-10">
              <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-4">Piano View</h3>
              <Piano notes={chordNotes} />
            </div>

            {/* Voicing Selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest">Guitar Voicings</h3>
                <span className="text-xs text-white/40 font-mono">{allVoicings.length} variation{allVoicings.length !== 1 ? 's' : ''} found</span>
              </div>
              <div className={`flex gap-2 overflow-x-auto pb-2 transition-opacity ${hoveredChord ? 'opacity-40' : ''}`}>
                {allVoicings.length > 1 ? (
                  allVoicings.map((voicing, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedVoicingIndex(index)}
                      disabled={!!hoveredChord}
                      className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all border ${
                        currentVoicingIndex === index
                          ? 'bg-cyan/20 border-cyan text-cyan shadow-[0_0_10px_rgba(0,212,255,0.2)]'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                      } ${hoveredChord ? 'cursor-not-allowed' : ''}`}
                    >
                      {voicing.name}
                      {voicing.startFret > 0 && (
                        <span className="ml-1 text-xs opacity-70">({voicing.startFret}fr)</span>
                      )}
                    </button>
                  ))
                ) : (
                  <span className="text-sm text-white/50 font-mono">{allVoicings[0]?.name || 'Default'}</span>
                )}
                {hoveredChord && (
                  <span className="ml-2 text-xs text-white/50 italic self-center">Preview</span>
                )}
              </div>
            </div>

            {/* Fretboard */}
            <Fretboard voicing={displayVoicing} isPreview={hoveredChord !== null} />

            {/* Theory Note - hidden on small mobile */}
            <div className="hidden md:block">
              <TheoryNote chord={selectedChord} />
            </div>

            {/* Mobile Relative Chords Toggle */}
            <button
              onClick={() => setShowRelativeChords(!showRelativeChords)}
              className="lg:hidden w-full mt-6 p-3 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between font-mono text-sm hover:bg-white/10 transition-colors"
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
              <div className="lg:hidden mt-3 bg-white/5 border border-white/10 rounded-lg p-3">
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
        <aside className="hidden lg:block w-80 flex-shrink-0 border-l border-white/10 bg-bg-dark/80 backdrop-blur-md p-6 overflow-y-auto pb-32">
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
            console.log('Selected CAGED shape:', shape.name, 'at fret', shape.fret);
          }}
          onClose={() => setShowCAGED(false)}
        />
      )}
    </div>
  );
};

export default App;
