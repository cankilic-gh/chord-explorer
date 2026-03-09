
import React, { useState, useEffect, useCallback } from 'react';
import { Play, Square, Trash2, Plus, X, ChevronRight } from 'lucide-react';
import { ProgressionChord, CHORD_TYPES } from '../constants/musicData';
import MiniFretboard from './MiniFretboard';
import { getAllChordVoicings } from '../lib/musicTheory';
import { playProgression, stopPlayback, ensureAudioContext } from '../lib/audioEngine';

interface ProgressionBuilderProps {
  progression: ProgressionChord[];
  onClear: () => void;
  onRemove: (index: number) => void;
  onUpdateVoicing: (index: number, voicingIndex: number) => void;
}

const ProgressionBuilder: React.FC<ProgressionBuilderProps> = ({ progression, onClear, onRemove, onUpdateVoicing }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);

  const handlePlay = useCallback(async () => {
    if (progression.length === 0) return;

    await ensureAudioContext();
    setIsPlaying(true);
    await playProgression(progression, bpm, 'guitar');
  }, [progression, bpm]);

  const handleStop = useCallback(() => {
    stopPlayback();
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    return () => {
      stopPlayback();
    };
  }, []);

  const isDisabled = progression.length === 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-28 bg-bg-dark/95 backdrop-blur-xl border-t border-white/10 flex items-center px-4 md:px-6 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      {/* Chord Blocks */}
      <div className="flex-1 flex items-center gap-2 md:gap-3 overflow-x-auto pr-4 md:pr-6 min-w-0">
        {progression.map((chord, index) => (
          <div key={index} className="flex items-center">
            <ProgressionChordBlock
              chord={chord}
              onRemove={() => onRemove(index)}
              onUpdateVoicing={(voicingIndex) => onUpdateVoicing(index, voicingIndex)}
            />
            {index < progression.length - 1 && (
              <ChevronRight className="w-4 h-4 text-white/20 mx-1 flex-shrink-0" />
            )}
          </div>
        ))}
        {progression.length === 0 && (
          <div className="text-white/40 text-xs md:text-sm whitespace-nowrap">Tap + on chords to add</div>
        )}
      </div>

      {/* Controls */}
      <div className="w-auto md:w-72 border-l border-white/10 pl-4 md:pl-6 flex flex-col justify-center gap-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={isPlaying ? handleStop : handlePlay}
              disabled={isDisabled && !isPlaying}
              className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors ${
                isPlaying
                  ? 'bg-red-600 hover:bg-red-700 animate-pulse text-white'
                  : isDisabled
                    ? 'bg-white/5 cursor-not-allowed opacity-50 text-white/60'
                    : 'bg-green text-black hover:bg-green/80 shadow-[0_0_15px_rgba(34,197,94,0.4)]'
              }`}
            >
              {isPlaying ? <Square className="w-4 h-4" /> : <Play className="w-5 h-5 ml-0.5" fill="currentColor" />}
            </button>
            <button
              onClick={onClear}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 text-white/60 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-xl md:text-2xl font-mono font-bold text-cyan">{bpm}</span>
            <span className="text-xs text-white/50 ml-1 uppercase tracking-widest">BPM</span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <span className="text-[10px] font-mono text-white/40">60</span>
          <input
            type="range"
            min="60"
            max="240"
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan"
          />
          <span className="text-[10px] font-mono text-white/40">240</span>
        </div>
      </div>
    </div>
  );
};

interface ProgressionChordBlockProps {
    chord: ProgressionChord;
    onRemove: () => void;
    onUpdateVoicing: (voicingIndex: number) => void;
}

const ProgressionChordBlock: React.FC<ProgressionChordBlockProps> = ({ chord, onRemove, onUpdateVoicing }) => {
    const [showVoicings, setShowVoicings] = useState(false);
    const allVoicings = getAllChordVoicings(chord.root, chord.type);
    const currentVoicing = allVoicings[chord.voicingIndex] || allVoicings[0];

    return (
        <div
            className="group relative flex-shrink-0 w-20 md:w-24 h-16 md:h-20 bg-white/5 border border-white/10 rounded-lg hover:border-cyan/50 hover:bg-white/10 transition-all cursor-pointer flex flex-col items-center justify-center"
            onClick={() => setShowVoicings(!showVoicings)}
        >
            <span className="font-mono font-bold text-sm md:text-base text-white mb-1">{chord.root}{CHORD_TYPES[chord.type].symbol}</span>
            {allVoicings.length > 1 && (
                <span className="text-[8px] md:text-[10px] text-white/40 font-mono">{currentVoicing?.name}</span>
            )}

            <button
                onClick={(e) => { e.stopPropagation(); onRemove(); }}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
            >
                <X className="w-3 h-3" />
            </button>

            {showVoicings && allVoicings.length > 1 && (
                <div
                    className="absolute bottom-full left-0 mb-2 bg-[#15151a] border border-white/10 rounded-lg p-2 shadow-lg z-50 min-w-[120px]"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="text-xs text-white/40 mb-1 font-mono">Voicing:</div>
                    <div className="flex flex-col gap-1">
                        {allVoicings.map((voicing, index) => (
                            <button
                                key={index}
                                onClick={() => { onUpdateVoicing(index); setShowVoicings(false); }}
                                className={`px-2 py-1 text-xs font-mono rounded transition-colors text-left ${
                                    chord.voicingIndex === index
                                        ? 'bg-cyan/20 text-cyan'
                                        : 'bg-white/5 text-white/70 hover:bg-white/10'
                                }`}
                            >
                                {voicing.name}
                                {voicing.startFret > 0 && (
                                    <span className="ml-1 opacity-70">({voicing.startFret}fr)</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProgressionBuilder;
