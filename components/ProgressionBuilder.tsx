
import React, { useState, useEffect, useCallback } from 'react';
import { Chord, CHORD_TYPES } from '../constants/musicData';
import MiniFretboard from './MiniFretboard';
import { getChordVoicing } from '../lib/musicTheory';
import { playProgression, stopPlayback } from '../lib/audioEngine';
import { PlayIcon } from './icons/PlayIcon';
import { StopIcon } from './icons/StopIcon';
import { TrashIcon } from './icons/TrashIcon';
import { XIcon } from './icons/XIcon';

interface ProgressionBuilderProps {
  progression: Chord[];
  onClear: () => void;
  onRemove: (index: number) => void;
}

const ProgressionBuilder: React.FC<ProgressionBuilderProps> = ({ progression, onClear, onRemove }) => {
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
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-[#161b22] border-t border-[#30363d] flex items-center px-4 z-50">
      <div className="flex items-center space-x-4">
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
        <div className="flex items-center space-x-2">
          <input
            type="range"
            min="60"
            max="240"
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-24 accent-[#4493f8]"
          />
          <span className="text-sm font-mono w-12 text-center">{bpm} BPM</span>
        </div>
      </div>
      <div className="mx-4 h-12 w-px bg-[#30363d]"></div>
      <div className="flex-1 flex items-center space-x-2 overflow-x-auto">
        {progression.map((chord, index) => (
          <ProgressionChordBlock key={index} chord={chord} onRemove={() => onRemove(index)} />
        ))}
        {progression.length === 0 && (
          <div className="text-[#8b949e]">Add chords from the right panel to build a progression.</div>
        )}
      </div>
    </div>
  );
};

interface ProgressionChordBlockProps {
    chord: Chord;
    onRemove: () => void;
}

const ProgressionChordBlock: React.FC<ProgressionChordBlockProps> = ({ chord, onRemove }) => {
    const voicing = getChordVoicing(chord.root, chord.type);
    return (
        <div className="group relative flex-shrink-0 flex items-center space-x-2 bg-[#0d1117] border border-[#30363d] rounded-lg p-2 h-16">
            <MiniFretboard voicing={voicing} />
            <span className="font-mono font-bold">{chord.root}{CHORD_TYPES[chord.type].symbol}</span>
            <button onClick={onRemove} className="absolute -top-1 -right-1 bg-red-600 rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <XIcon />
            </button>
        </div>
    )
}

export default ProgressionBuilder;
