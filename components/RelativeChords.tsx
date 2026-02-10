
import React, { useMemo } from 'react';
import { Chord, CHORD_TYPES, Note, ChordType } from '../constants/musicData';
import { getChordVoicing, getRomanNumeral, getChordCompatibilityScore, detectProgressionPattern, findCompatibleKeys, ChordCompatibility, CommonProgression, Key } from '../lib/musicTheory';
import { playChordFromChord } from '../lib/audioEngine';
import MiniFretboard from './MiniFretboard';
import { PlusCircleIcon } from './icons/PlusCircleIcon';

interface RelativeChordsProps {
  chords: Chord[];
  selectedChord: Chord;
  progression: Chord[];
  onSelectChord: (root: Note, type: ChordType) => void;
  onAddToProgression: (chord: Chord) => void;
  onHoverChord?: (chord: Chord | null) => void;
}

const isChordEqual = (a: Chord, b: Chord): boolean => a.root === b.root && a.type === b.type;

type CompatibilityRank = 'gold' | 'default' | 'dimmed';

const getCompatibilityRank = (score: number): CompatibilityRank => {
  if (score >= 1) return 'gold';
  if (score >= 0.5) return 'default';
  return 'dimmed';
};

interface ChordWithCompatibility {
  chord: Chord;
  compatibility: ChordCompatibility;
  rank: CompatibilityRank;
}

const ProgressionPatternBadge: React.FC<{ pattern: CommonProgression }> = ({ pattern }) => (
  <div className="mb-4 p-3 bg-gradient-to-r from-[#238636]/20 to-[#1f6feb]/20 border border-[#238636]/50 rounded-lg">
    <div className="flex items-center gap-2">
      <span className="text-[#3fb950] text-sm font-semibold">{pattern.name}</span>
      <span className="text-[#8b949e] text-xs px-2 py-0.5 bg-[#30363d] rounded-full">{pattern.genre}</span>
    </div>
    <p className="text-[#8b949e] text-xs mt-1">
      Pattern: {pattern.pattern.join(' - ')}
    </p>
  </div>
);

const CompatibleKeysBadge: React.FC<{ keys: Key[] }> = ({ keys }) => {
  if (keys.length === 0) return null;

  const displayKeys = keys.slice(0, 4);
  const remaining = keys.length - displayKeys.length;

  return (
    <div className="mb-4 p-2 bg-[#161b22] border border-[#30363d] rounded-lg">
      <p className="text-[#8b949e] text-xs mb-1">Compatible keys:</p>
      <div className="flex flex-wrap gap-1">
        {displayKeys.map((key, i) => (
          <span key={i} className="text-xs px-2 py-0.5 bg-[#21262d] text-[#c9d1d9] rounded">
            {key.root} {key.mode}
          </span>
        ))}
        {remaining > 0 && (
          <span className="text-xs px-2 py-0.5 text-[#8b949e]">+{remaining} more</span>
        )}
      </div>
    </div>
  );
};

const RelativeChords: React.FC<RelativeChordsProps> = ({ chords, selectedChord, progression, onSelectChord, onAddToProgression, onHoverChord }) => {
  const hasMultipleChords = progression.length > 1;

  const detectedPattern = useMemo(() => {
    return detectProgressionPattern(progression);
  }, [progression]);

  const compatibleKeys = useMemo(() => {
    if (!hasMultipleChords) return [];
    return findCompatibleKeys(progression);
  }, [progression, hasMultipleChords]);

  const chordsWithCompatibility: ChordWithCompatibility[] = useMemo(() => {
    return chords.map(chord => {
      const compatibility = hasMultipleChords
        ? getChordCompatibilityScore(chord, progression)
        : { score: 1, matchingKeys: [], totalMatchingKeys: 0 };
      const rank = hasMultipleChords ? getCompatibilityRank(compatibility.score) : 'default';
      return { chord, compatibility, rank };
    });
  }, [chords, progression, hasMultipleChords]);

  const sortedChords = useMemo(() => {
    if (!hasMultipleChords) return chordsWithCompatibility;

    return [...chordsWithCompatibility].sort((a, b) => {
      const rankOrder = { gold: 0, default: 1, dimmed: 2 };
      return rankOrder[a.rank] - rankOrder[b.rank];
    });
  }, [chordsWithCompatibility, hasMultipleChords]);

  return (
    <div>
      <h2 className="text-lg font-bold mb-4 font-mono">Relative Chords</h2>

      {detectedPattern && (
        <ProgressionPatternBadge pattern={detectedPattern} />
      )}

      {hasMultipleChords && compatibleKeys.length > 0 && (
        <CompatibleKeysBadge keys={compatibleKeys} />
      )}

      <div className="space-y-3">
        {sortedChords.map(({ chord, compatibility, rank }, index) => {
          const isSelected = isChordEqual(chord, selectedChord);
          const isInProgression = progression.some(p => isChordEqual(p, chord));
          return (
            <ChordCard
              key={`${chord.root}-${chord.type}-${index}`}
              chord={chord}
              isSelected={isSelected}
              isInProgression={isInProgression}
              compatibilityRank={hasMultipleChords ? rank : undefined}
              matchingKeysCount={compatibility.totalMatchingKeys}
              onSelect={() => onSelectChord(chord.root, chord.type)}
              onAdd={() => onAddToProgression(chord)}
              onHover={onHoverChord}
            />
          );
        })}
      </div>
    </div>
  );
};

interface ChordCardProps {
    chord: Chord;
    isSelected: boolean;
    isInProgression: boolean;
    compatibilityRank?: CompatibilityRank;
    matchingKeysCount?: number;
    onSelect: () => void;
    onAdd: () => void;
    onHover?: (chord: Chord | null) => void;
}

const PlayButton: React.FC<{ onClick: (e: React.MouseEvent) => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-6 h-6 flex items-center justify-center rounded-full bg-[#3fb950] hover:bg-green-600 transition-colors"
    title="Play chord"
  >
    <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0V12L10 6L0 0Z" fill="white" />
    </svg>
  </button>
);

const CheckIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 3L4.5 8.5L2 6" stroke="#4493f8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ProgressionDot: React.FC = () => (
  <div className="w-2 h-2 rounded-full bg-[#3fb950]" title="In progression" />
);

const GoldBadge: React.FC = () => (
    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg" title="Appears in all compatible keys">
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 0L5.09 2.76L8 3.09L5.82 5.09L6.47 8L4 6.5L1.53 8L2.18 5.09L0 3.09L2.91 2.76L4 0Z" fill="white" />
        </svg>
    </div>
);

const ChordCard: React.FC<ChordCardProps> = ({ chord, isSelected, isInProgression, compatibilityRank, matchingKeysCount, onSelect, onAdd, onHover }) => {
    const voicing = getChordVoicing(chord.root, chord.type);
    const romanNumeral = getRomanNumeral(chord.root, chord.type);

    const handlePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        playChordFromChord(chord, 'guitar');
    };

    const handleMouseEnter = () => {
        onHover?.(chord);
    };

    const handleMouseLeave = () => {
        onHover?.(null);
    };

    const isGold = compatibilityRank === 'gold';
    const isDimmed = compatibilityRank === 'dimmed';

    const borderClass = isGold
        ? 'border-yellow-500/70'
        : isSelected
        ? 'border-[#4493f8]'
        : isInProgression
        ? 'border-[#3fb950]/50'
        : 'border-[#30363d]';

    const bgClass = isGold
        ? 'bg-gradient-to-r from-yellow-900/10 to-[#0d1117]'
        : isSelected
        ? 'bg-[#161b22]'
        : 'bg-[#0d1117]';

    const opacityClass = isDimmed ? 'opacity-35' : '';

    return (
        <div
            className={`group ${bgClass} border ${borderClass} rounded-lg p-3 transition-all duration-200 hover:border-[#4493f8] hover:shadow-lg hover:bg-[#161b22] relative ${opacityClass}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {isGold && <GoldBadge />}
            {isSelected && (
                <div className="absolute top-2 left-2 flex items-center justify-center w-5 h-5 rounded-full bg-[#4493f8]/20">
                    <CheckIcon />
                </div>
            )}
            {isInProgression && !isSelected && (
                <div className="absolute top-2 left-2">
                    <ProgressionDot />
                </div>
            )}
            <div className="flex items-center space-x-4 cursor-pointer" onClick={onSelect}>
                <MiniFretboard voicing={voicing} />
                <div className="flex items-center space-x-2">
                    <div>
                        <p className="font-bold font-mono text-lg">{chord.root}{CHORD_TYPES[chord.type].symbol}</p>
                        <p className="text-sm text-[#8b949e] font-mono">{romanNumeral}</p>
                        {compatibilityRank && matchingKeysCount !== undefined && matchingKeysCount > 0 && (
                            <p className="text-xs text-[#8b949e]/70 font-mono">
                                {matchingKeysCount} key{matchingKeysCount > 1 ? 's' : ''}
                            </p>
                        )}
                    </div>
                    <PlayButton onClick={handlePlay} />
                </div>
            </div>
            <button
                onClick={(e) => { e.stopPropagation(); onAdd(); }}
                className="absolute top-2 right-2 text-[#8b949e] opacity-0 group-hover:opacity-100 transition-opacity hover:text-[#4493f8]"
                title="Add to progression"
            >
                <PlusCircleIcon />
            </button>
        </div>
    );
}

export default RelativeChords;
