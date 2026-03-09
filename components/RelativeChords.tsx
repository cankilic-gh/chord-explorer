
import React, { useMemo } from 'react';
import { Chord, CHORD_TYPES, Note, ChordType } from '../constants/musicData';
import { getChordVoicing, getRomanNumeral, getChordCompatibilityScore, detectProgressionPattern, findCompatibleKeys, ChordCompatibility, CommonProgression, Key } from '../lib/musicTheory';
import { playChordFromChord, ensureAudioContext } from '../lib/audioEngine';
import MiniFretboard from './MiniFretboard';
import { Volume2, Plus } from 'lucide-react';

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
  <div className="mb-4 p-3 bg-green/10 border border-green/30 rounded-lg flex items-center gap-3">
    <div className="w-8 h-8 rounded-full bg-green/20 flex items-center justify-center flex-shrink-0">
      <span className="text-sm">&#10024;</span>
    </div>
    <div>
      <p className="text-sm font-bold text-green">{pattern.name}</p>
      <p className="text-xs text-green/70 font-mono">
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
    <div className="mb-4">
      <h2 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">Compatible Keys</h2>
      <div className="flex flex-wrap gap-2">
        {displayKeys.map((key, i) => (
          <span key={i} className="text-xs px-2 py-1 bg-white/10 text-white/80 rounded font-mono">
            {key.root} {key.mode}
          </span>
        ))}
        {remaining > 0 && (
          <span className="text-xs px-2 py-1 bg-transparent border border-white/10 text-white/40 rounded font-mono">+{remaining} more</span>
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

      {!compact && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold text-white/50 uppercase tracking-widest">Related Chords</h2>
        </div>
      )}

      {hasMultipleChords && compatibleKeys.length > 0 && !compact && (
        <CompatibleKeysBadge keys={compatibleKeys} />
      )}

      <div className={compact ? "grid grid-cols-2 gap-2" : "flex flex-col gap-3"}>
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

const PlayButton: React.FC<{ onClick: (e: React.MouseEvent) => void; size?: 'sm' | 'md' }> = ({ onClick, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'w-7 h-7' : 'w-7 h-7';

  return (
    <button
      onClick={onClick}
      className={`${sizeClasses} flex items-center justify-center rounded bg-white/10 hover:bg-cyan hover:text-black transition-colors`}
      title="Play chord"
    >
      <Volume2 className="w-3.5 h-3.5" />
    </button>
  );
};

const GoldBadge: React.FC = () => (
    <span className="text-gold text-xs ml-1" title="Strong fit">&#9733;</span>
);

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

    const borderClass = isSelected
        ? 'border-cyan/50 bg-cyan/5'
        : isGold
        ? 'border-gold/50'
        : isInProgression
        ? 'border-green/30'
        : 'border-white/10';

    const opacityClass = isDimmed ? 'opacity-35' : '';

    // Compact mobile layout
    if (compact) {
        return (
            <div
                className={`group bg-white/5 border ${borderClass} rounded-xl p-2 transition-all duration-200 active:border-cyan relative ${opacityClass}`}
                onClick={onSelect}
            >
                {isInProgression && !isSelected && (
                    <div className="absolute top-1 right-1">
                        <div className="w-2 h-2 rounded-full bg-green" title="In progression" />
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                        <p className={`font-bold font-mono text-sm truncate flex items-center gap-1 ${isSelected ? 'text-cyan' : ''}`}>
                          {chord.root}{CHORD_TYPES[chord.type].symbol}
                          {isGold && <GoldBadge />}
                        </p>
                        <p className="text-xs text-white/50 font-mono">{romanNumeral}</p>
                    </div>
                    <div className="flex items-center gap-1">
                        <PlayButton onClick={handlePlay} size="sm" />
                        <button
                            onClick={(e) => { e.stopPropagation(); onAdd(); }}
                            className="w-7 h-7 flex items-center justify-center rounded bg-white/10 hover:bg-green hover:text-black active:scale-95 transition-all"
                            title="Add to progression"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Desktop full layout
    return (
        <div
            className={`group bg-white/5 border ${borderClass} rounded-xl p-3 transition-all duration-200 hover:bg-white/10 cursor-pointer relative ${opacityClass}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="flex items-center justify-between mb-2" onClick={onSelect}>
                <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold font-mono ${isSelected ? 'text-cyan' : 'text-white'}`}>
                      {chord.root}{CHORD_TYPES[chord.type].symbol}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-white/60 font-mono">{romanNumeral}</span>
                    {isGold && <GoldBadge />}
                    {isInProgression && !isSelected && (
                        <div className="w-2 h-2 rounded-full bg-green" title="In progression" />
                    )}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayButton onClick={handlePlay} />
                    <button
                        onClick={(e) => { e.stopPropagation(); onAdd(); }}
                        className="w-7 h-7 flex items-center justify-center rounded bg-white/10 hover:bg-green hover:text-black transition-colors"
                        title="Add to progression"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Mini Fretboard */}
            <div className="h-10 w-full bg-black/30 rounded border border-white/5 relative overflow-hidden cursor-pointer" onClick={onSelect}>
                {/* 6 strings */}
                {Array.from({length: 6}).map((_, idx) => (
                  <div key={idx} className="absolute left-0 right-0 h-px bg-white/20" style={{ top: `${(idx + 1) * (100/7)}%` }}></div>
                ))}
                {/* 4 frets */}
                {Array.from({length: 5}).map((_, idx) => (
                  <div key={idx} className="absolute top-0 bottom-0 w-px bg-white/20" style={{ left: `${idx * 25}%` }}></div>
                ))}
                {/* Dots */}
                {voicing.slice(0, 4).map((pos, idx) => {
                  const x = pos.fret === 0 ? 5 : Math.min(95, ((pos.fret - 0.5) / 4) * 100);
                  const y = ((pos.string + 1) * (100 / 7));
                  return (
                    <div
                      key={idx}
                      className="absolute w-2 h-2 rounded-full bg-cyan shadow-[0_0_4px_#00D4FF]"
                      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                    ></div>
                  );
                })}
            </div>

            {compatibilityRank && matchingKeysCount !== undefined && matchingKeysCount > 0 && (
                <p className="text-xs text-white/30 font-mono mt-2">
                    {matchingKeysCount} key{matchingKeysCount > 1 ? 's' : ''}
                </p>
            )}
        </div>
    );
}

export default RelativeChords;
