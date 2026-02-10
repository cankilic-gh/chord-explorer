
import React, { useState, useEffect, useCallback } from 'react';
import { ProgressionChord, CHORD_TYPES } from '../constants/musicData';
import MiniFretboard from './MiniFretboard';
import { getAllChordVoicings } from '../lib/musicTheory';
import { playProgression, stopPlayback } from '../lib/audioEngine';
import { PlayIcon } from './icons/PlayIcon';
import { StopIcon } from './icons/StopIcon';
import { TrashIcon } from './icons/TrashIcon';
import { XIcon } from './icons/XIcon';

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

    setIsPlaying(true);
    await playProgression(progression, bpm, 'guitar');

    // Calculate total duration based on BPM and number of chords
    const beatsPerChord = 4;
    const totalBeats = progression.length * beatsPerChord;
    const durationMs = (totalBeats / bpm) * 60 * 1000;

    setTimeout(() => {
      setIsPlaying(false);
    }, durationMs);
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
    <div className="fixed bottom-0 left-0 right-0 h-20 md:h-24 bg-[#161b22] border-t border-[#30363d] flex items-center px-2 md:px-4 z-50">
      <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
        <button
          onClick={isPlaying ? handleStop : handlePlay}
          disabled={isDisabled && !isPlaying}
          className={`p-2 rounded-full transition-colors ${
            isPlaying
              ? 'bg-red-600 hover:bg-red-700 animate-pulse'
              : isDisabled
                ? 'bg-[#30363d] cursor-not-allowed opacity-50'
                : 'bg-[#3fb950] hover:bg-green-600'
          }`}
        >
          {isPlaying ? <StopIcon /> : <PlayIcon />}
        </button>
        <button onClick={onClear} className="p-2 rounded-full bg-[#30363d] hover:bg-red-600 transition-colors">
          <TrashIcon />
        </button>
        <div className="hidden sm:flex items-center space-x-2">
          <input
            type="range"
            min="60"
            max="240"
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-16 md:w-24 accent-[#4493f8]"
          />
          <span className="text-xs md:text-sm font-mono w-10 md:w-12 text-center">{bpm}</span>
        </div>
      </div>
      <div className="mx-2 md:mx-4 h-10 md:h-12 w-px bg-[#30363d] flex-shrink-0"></div>
      <div className="flex-1 flex items-center space-x-2 overflow-x-auto min-w-0">
        {progression.map((chord, index) => (
          <ProgressionChordBlock
            key={index}
            chord={chord}
            onRemove={() => onRemove(index)}
            onUpdateVoicing={(voicingIndex) => onUpdateVoicing(index, voicingIndex)}
          />
        ))}
        {progression.length === 0 && (
          <div className="text-[#8b949e] text-xs md:text-base whitespace-nowrap">Tap + on chords to add</div>
        )}
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
            className="group relative flex-shrink-0 flex items-center space-x-1 md:space-x-2 bg-[#0d1117] border border-[#30363d] rounded-lg p-1.5 md:p-2 h-12 md:h-16 cursor-pointer hover:border-[#4493f8] active:border-[#4493f8] transition-colors"
            onClick={() => setShowVoicings(!showVoicings)}
        >
            <div className="hidden md:block">
                <MiniFretboard voicing={currentVoicing?.voicing || []} />
            </div>
            <div className="flex flex-col">
                <span className="font-mono font-bold text-sm md:text-base">{chord.root}{CHORD_TYPES[chord.type].symbol}</span>
                {allVoicings.length > 1 && (
                    <span className="text-[8px] md:text-[10px] text-[#8b949e] font-mono">{currentVoicing?.name}</span>
                )}
            </div>
            <button
                onClick={(e) => { e.stopPropagation(); onRemove(); }}
                className="absolute -top-1 -right-1 bg-red-600 rounded-full w-4 h-4 flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            >
                <XIcon />
            </button>

            {showVoicings && allVoicings.length > 1 && (
                <div
                    className="absolute bottom-full left-0 mb-2 bg-[#161b22] border border-[#30363d] rounded-lg p-2 shadow-lg z-50 min-w-[120px]"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="text-xs text-[#8b949e] mb-1 font-mono">Voicing:</div>
                    <div className="flex flex-col gap-1">
                        {allVoicings.map((voicing, index) => (
                            <button
                                key={index}
                                onClick={() => { onUpdateVoicing(index); setShowVoicings(false); }}
                                className={`px-2 py-1 text-xs font-mono rounded transition-colors text-left ${
                                    chord.voicingIndex === index
                                        ? 'bg-[#238636] text-white'
                                        : 'bg-[#21262d] text-[#c9d1d9] hover:bg-[#30363d]'
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
