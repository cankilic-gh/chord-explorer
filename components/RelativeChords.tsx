
import React, { useMemo } from 'react';
import { Chord, CHORD_TYPES, Note, ChordType } from '../constants/musicData';
import { getChordVoicing, getRomanNumeral, getChordCompatibilityScore, detectProgressionPattern, findCompatibleKeys, ChordCompatibility, CommonProgression, Key } from '../lib/musicTheory';
import { playChordFromChord, ensureAudioContext } from '../lib/audioEngine';
import MiniFretboard from './MiniFretboard';
import { Plus } from 'lucide-react';

interface RelativeChordsProps {
  chords: Chord[];
  selectedChord: Chord;
  progression: Chord[];
  onSelectChord: (root: Note, type: ChordType) => void;
  onAddToProgression: (chord: Chord) => void;
  onHoverChord?: (chord: Chord | null) => void;
  compact?: boolean;
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
  <div className="mb-4 p-3 bg-green/10 border border-green/20 rounded-lg flex items-center gap-3">
    <div className="w-7 h-7 rounded-full bg-green/20 flex items-center justify-center flex-shrink-0">
      <span className="text-xs">&#10024;</span>
    </div>
    <div>
      <p className="text-sm font-semibold text-green">{pattern.name}</p>
      <p className="text-xs text-green/60 font-mono">
        {pattern.pattern.join(' - ')}
      </p>
    </div>
  </div>
);

const CompatibleKeysBadge: React.FC<{ keys: Key[] }> = ({ keys }) => {
  if (keys.length === 0) return null;

  const displayKeys = keys.slice(0, 4);
  const remaining = keys.length - displayKeys.length;

  return (
    <div className="mb-4 p-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg">
      <p className="text-[10px] text-white/40 mb-1.5 uppercase tracking-wider">Compatible keys</p>
      <div className="flex flex-wrap gap-1.5">
        {displayKeys.map((key, i) => (
          <span key={i} className="text-xs px-2 py-0.5 bg-white/[0.06] text-white/70 rounded font-mono">
            {key.root} {key.mode}
          </span>
        ))}
        {remaining > 0 && (
          <span className="text-xs px-2 py-0.5 text-white/30 font-mono">+{remaining}</span>
        )}
      </div>
    </div>
  );
};

const RelativeChords: React.FC<RelativeChordsProps> = ({ chords, selectedChord, progression, onSelectChord, onAddToProgression, onHoverChord, compact = false }) => {
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
      {detectedPattern && !compact && (
        <ProgressionPatternBadge pattern={detectedPattern} />
      )}

      {!compact && <h2 className="text-lg font-bold mb-4 font-mono">Relative Chords</h2>}

      {hasMultipleChords && compatibleKeys.length > 0 && !compact && (
        <CompatibleKeysBadge keys={compatibleKeys} />
      )}

      <div className={compact ? "grid grid-cols-2 gap-2" : "space-y-2"}>
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
              compact={compact}
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
    compact?: boolean;
}

const ChordCard: React.FC<ChordCardProps> = ({ chord, isSelected, isInProgression, compatibilityRank, matchingKeysCount, onSelect, onAdd, onHover, compact = false }) => {
    const voicing = getChordVoicing(chord.root, chord.type);
    const romanNumeral = getRomanNumeral(chord.root, chord.type);

    const handlePlay = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await ensureAudioContext();
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

    const opacityClass = isDimmed ? 'opacity-35' : '';

    // Compact mobile layout
    if (compact) {
        return (
            <div
                className={`group bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5 transition-all duration-150 active:bg-white/[0.06] relative ${opacityClass} ${isSelected ? 'bg-cyan/5 border-l-2 border-l-cyan' : ''}`}
                onClick={onSelect}
            >
                {isInProgression && (
                    <div className="absolute top-1.5 right-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green" />
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                            <p className={`font-bold font-mono text-sm ${isSelected ? 'text-cyan' : 'text-white'}`}>{chord.root}{CHORD_TYPES[chord.type].symbol}</p>
                            {isGold && <span className="text-gold text-[10px]">&#9733;</span>}
                        </div>
                        <p className="text-[11px] text-white/40 font-mono">{romanNumeral}</p>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); onAdd(); }}
                        className="w-7 h-7 flex items-center justify-center rounded bg-white/[0.06] hover:bg-white/10 active:scale-95 transition-all text-white/40 hover:text-white/70"
                        title="Add to progression"
                    >
                        <Plus className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        );
    }

    // Desktop layout: MiniFretboard | name + roman | hover actions
    return (
        <div
            className={`group relative rounded-lg transition-all duration-150 cursor-pointer ${opacityClass} ${
              isSelected
                ? 'bg-cyan/5 border-l-2 border-l-cyan pl-2.5 pr-3 py-2.5'
                : 'hover:bg-white/[0.04] px-3 py-2.5'
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onSelect}
        >
            {/* Gold star indicator */}
            {isGold && (
                <div className="absolute top-1.5 right-1.5 text-gold text-[10px]">&#9733;</div>
            )}

            {/* Progression indicator */}
            {isInProgression && !isSelected && (
                <div className="absolute top-1.5 right-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green" />
                </div>
            )}

            <div className="flex items-center">
                <MiniFretboard voicing={voicing} />
                <div className="flex-1 ml-3 min-w-0">
                    <p className={`font-bold font-mono ${isSelected ? 'text-cyan' : 'text-white'}`}>
                      {chord.root}{CHORD_TYPES[chord.type].symbol}
                    </p>
                    <div className="flex items-center gap-2">
                        <p className="text-xs text-white/40 font-mono">{romanNumeral}</p>
                        {matchingKeysCount !== undefined && matchingKeysCount > 0 && (
                            <p className="text-[10px] text-white/25 font-mono">
                                {matchingKeysCount} key{matchingKeysCount > 1 ? 's' : ''}
                            </p>
                        )}
                    </div>
                </div>

                {/* Hover actions */}
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handlePlay}
                        className="w-7 h-7 flex items-center justify-center rounded bg-white/[0.06] hover:bg-white/10 transition-colors text-white/50 hover:text-white"
                        title="Play chord"
                    >
                        <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                            <path d="M0 0V12L10 6L0 0Z" fill="currentColor" />
                        </svg>
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onAdd(); }}
                        className="w-7 h-7 flex items-center justify-center rounded bg-white/[0.06] hover:bg-white/10 transition-colors text-white/50 hover:text-white"
                        title="Add to progression"
                    >
                        <Plus className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RelativeChords;
