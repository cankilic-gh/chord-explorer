
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Search, Music, Loader2, ExternalLink } from 'lucide-react';
import { searchSongs, SongResult } from '../lib/songsterrApi';

interface SongTabViewerProps {
  onClose: () => void;
}

const SongTabViewer: React.FC<SongTabViewerProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SongResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSong, setSelectedSong] = useState<SongResult | null>(null);
  const [error, setError] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    setError('');

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const songs = await searchSongs(value);
        setResults(songs);
      } catch {
        setError('Search failed. Try again.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  const handleSelectSong = (song: SongResult) => {
    setSelectedSong(song);
  };

  const handleBack = () => {
    setSelectedSong(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="bg-bg-steel border border-crimson/20 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-[0_0_60px_rgba(220,20,60,0.15)] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-crimson/15 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Music className="w-6 h-6 text-ember" />
            <h2 className="text-xl font-bold text-bone font-metal tracking-wider">
              {selectedSong ? selectedSong.title : 'Song Tabs'}
            </h2>
            {selectedSong && (
              <span className="text-sm text-bone/40 font-mono">{selectedSong.artist}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {selectedSong && (
              <button
                onClick={handleBack}
                className="px-3 py-1.5 rounded-md text-xs font-mono text-bone/50 hover:text-bone hover:bg-bone/10 transition-colors"
              >
                Back to Search
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-crimson/10 text-bone/40 hover:text-crimson transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        {selectedSong ? (
          // Tab View (placeholder for alphaTab)
          <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
            <div className="w-full max-w-2xl text-center">
              <div className="w-20 h-20 rounded-full bg-crimson/10 border border-crimson/20 flex items-center justify-center mx-auto mb-6">
                <Music className="w-10 h-10 text-crimson/50" />
              </div>
              <h3 className="text-2xl font-gothic text-bone mb-2">{selectedSong.title}</h3>
              <p className="text-bone/40 font-mono mb-8">{selectedSong.artist}</p>

              <div className="bg-bg-abyss/50 border border-crimson/10 rounded-xl p-8 mb-6">
                <p className="text-bone/30 text-sm font-mono mb-4">
                  Tab renderer will be integrated here with alphaTab.
                </p>
                <p className="text-bone/20 text-xs font-mono">
                  Song ID: {selectedSong.songId}
                </p>
              </div>

              <a
                href={`https://www.songsterr.com/a/wsa/${selectedSong.artist.toLowerCase().replace(/\s+/g, '-')}-${selectedSong.title.toLowerCase().replace(/\s+/g, '-')}-tab-s${selectedSong.songId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-crimson/10 border border-crimson/20 text-crimson text-sm font-mono hover:bg-crimson/20 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View on Songsterr
              </a>
            </div>
          </div>
        ) : (
          // Search View
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search Input */}
            <div className="p-4 border-b border-crimson/10 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bone/30" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search songs or artists..."
                  className="w-full pl-10 pr-4 py-3 bg-bg-abyss/50 border border-crimson/15 rounded-lg text-bone font-mono text-sm placeholder:text-bone/20 focus:outline-none focus:border-crimson/40 focus:shadow-[0_0_15px_rgba(220,20,60,0.1)] transition-all"
                />
                {loading && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-crimson animate-spin" />
                )}
              </div>
              {error && <p className="text-crimson/70 text-xs font-mono mt-2">{error}</p>}
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto p-4" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(220,20,60,0.3) transparent' }}>
              {results.length > 0 ? (
                <div className="space-y-2">
                  {results.map((song) => (
                    <button
                      key={song.songId}
                      onClick={() => handleSelectSong(song)}
                      className="w-full text-left p-4 bg-bone/[0.03] border border-bone/[0.06] rounded-lg hover:border-crimson/30 hover:bg-crimson/5 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-bone font-medium text-sm group-hover:text-crimson transition-colors">
                            {song.title}
                          </h4>
                          <p className="text-bone/40 text-xs font-mono mt-0.5">
                            {song.artist}
                          </p>
                        </div>
                        <Music className="w-4 h-4 text-bone/10 group-hover:text-crimson/30 transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : query && !loading ? (
                <div className="flex flex-col items-center justify-center py-16 text-bone/20">
                  <Search className="w-8 h-8 mb-3" />
                  <p className="text-sm font-mono">No songs found</p>
                </div>
              ) : !query ? (
                <div className="flex flex-col items-center justify-center py-16 text-bone/20">
                  <Music className="w-8 h-8 mb-3" />
                  <p className="text-sm font-mono">Search for a song to view its tab</p>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default SongTabViewer;
