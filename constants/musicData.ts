
export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
export type Note = typeof NOTES[number];

export const CHORD_TYPE_IDS = ['Major', 'minor', 'dim', 'aug', '7', 'm7', 'maj7', 'dim7'] as const;
export type ChordType = typeof CHORD_TYPE_IDS[number];

export type ChordFormula = {
  name: string;
  symbol: string;
  intervals: number[];
};

export const CHORD_TYPES: Record<ChordType, ChordFormula> = {
  'Major': { name: 'Major', symbol: '', intervals: [0, 4, 7] },
  'minor': { name: 'minor', symbol: 'm', intervals: [0, 3, 7] },
  'dim': { name: 'diminished', symbol: 'dim', intervals: [0, 3, 6] },
  'aug': { name: 'augmented', symbol: 'aug', intervals: [0, 4, 8] },
  '7': { name: 'Dominant 7th', symbol: '7', intervals: [0, 4, 7, 10] },
  'm7': { name: 'minor 7th', symbol: 'm7', intervals: [0, 3, 7, 10] },
  'maj7': { name: 'Major 7th', symbol: 'maj7', intervals: [0, 4, 7, 11] },
  'dim7': { name: 'diminished 7th', symbol: 'dim7', intervals: [0, 3, 6, 9] },
};

export interface Chord {
  root: Note;
  type: ChordType;
}

export type Interval = 'Root' | 'Minor 3rd' | 'Major 3rd' | 'Perfect 5th' | 'Diminished 5th' | 'Augmented 5th' | 'Minor 7th' | 'Major 7th';

export interface NoteWithInterval {
  note: Note;
  octave: number;
  interval: Interval;
  midi: number;
}

export interface FretPosition {
  string: number; // 0=High E, 5=Low E
  fret: number; // 0 for open string
  interval: Interval;
}

export type ChordVoicing = FretPosition[];

// A simplified map of common open or first-position chord voicings.
// string indices: 0: high e, 1: B, 2: G, 3: D, 4: A, 5: E
// fret: -1 means muted/not played.
export const GUITAR_VOICINGS: Record<string, number[]> = {
  'C_Major': [-1, 0, 1, 0, 2, 3],
  'G_Major': [3, 3, 0, 0, 2, 3],
  'D_Major': [2, 3, 2, 0, -1, -1],
  'A_Major': [0, 2, 2, 2, 0, -1],
  'E_Major': [0, 0, 1, 2, 2, 0],
  'F_Major': [1, 1, 2, 3, 3, 1], // Barre chord
  'A_minor': [0, 1, 2, 2, 0, -1],
  'E_minor': [0, 0, 0, 2, 2, 0],
  'D_minor': [1, 3, 2, 0, -1, -1],
  'C_7': [-1, 0, 1, 3, 2, 3],
  'G_7': [1, 0, 0, 0, 2, 3],
  'D_7': [2, 1, 2, 0, -1, -1],
  'A_7': [0, 2, 0, 2, 0, -1],
  'E_7': [0, 0, 1, 0, 2, 0],
  'B_dim': [-1, 3, 1, 3, 2, -1],
};
