
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

export interface VoicingDefinition {
  name: string;
  frets: number[];
  startFret: number;
}

// A map of common chord voicings with multiple options per chord.
// string indices: 0: high e, 1: B, 2: G, 3: D, 4: A, 5: E
// fret: -1 means muted/not played.
export const GUITAR_VOICINGS: Record<string, VoicingDefinition[]> = {
  'C_Major': [
    { name: 'Open', frets: [-1, 0, 1, 0, 2, 3], startFret: 0 },
    { name: 'Barre 3rd', frets: [3, 5, 5, 5, 3, -1], startFret: 3 },
    { name: 'Barre 8th', frets: [8, 8, 9, 10, 10, 8], startFret: 8 },
  ],
  'G_Major': [
    { name: 'Open', frets: [3, 3, 0, 0, 2, 3], startFret: 0 },
    { name: 'Barre 3rd', frets: [3, 3, 4, 5, 5, 3], startFret: 3 },
    { name: 'Barre 10th', frets: [-1, 12, 12, 12, 10, -1], startFret: 10 },
  ],
  'D_Major': [
    { name: 'Open', frets: [2, 3, 2, 0, -1, -1], startFret: 0 },
    { name: 'Barre 5th', frets: [5, 7, 7, 7, 5, -1], startFret: 5 },
    { name: 'Barre 10th', frets: [10, 10, 11, 12, 12, 10], startFret: 10 },
  ],
  'A_Major': [
    { name: 'Open', frets: [0, 2, 2, 2, 0, -1], startFret: 0 },
    { name: 'Barre 5th', frets: [5, 5, 6, 7, 7, 5], startFret: 5 },
    { name: 'Barre 12th', frets: [-1, 14, 14, 14, 12, -1], startFret: 12 },
  ],
  'E_Major': [
    { name: 'Open', frets: [0, 0, 1, 2, 2, 0], startFret: 0 },
    { name: 'Barre 7th', frets: [7, 9, 9, 9, 7, -1], startFret: 7 },
    { name: 'Barre 12th', frets: [12, 12, 13, 14, 14, 12], startFret: 12 },
  ],
  'F_Major': [
    { name: 'Barre 1st', frets: [1, 1, 2, 3, 3, 1], startFret: 1 },
    { name: 'Barre 8th', frets: [-1, 10, 10, 10, 8, -1], startFret: 8 },
  ],
  'A_minor': [
    { name: 'Open', frets: [0, 1, 2, 2, 0, -1], startFret: 0 },
    { name: 'Barre 5th', frets: [5, 5, 5, 7, 7, 5], startFret: 5 },
    { name: 'Barre 12th', frets: [-1, 13, 14, 14, 12, -1], startFret: 12 },
  ],
  'E_minor': [
    { name: 'Open', frets: [0, 0, 0, 2, 2, 0], startFret: 0 },
    { name: 'Barre 7th', frets: [-1, 8, 9, 9, 7, -1], startFret: 7 },
    { name: 'Barre 12th', frets: [12, 12, 12, 14, 14, 12], startFret: 12 },
  ],
  'D_minor': [
    { name: 'Open', frets: [1, 3, 2, 0, -1, -1], startFret: 0 },
    { name: 'Barre 5th', frets: [5, 6, 7, 7, 5, -1], startFret: 5 },
    { name: 'Barre 10th', frets: [10, 10, 10, 12, 12, 10], startFret: 10 },
  ],
  'G_minor': [
    { name: 'Barre 3rd', frets: [3, 3, 3, 5, 5, 3], startFret: 3 },
    { name: 'Barre 10th', frets: [-1, 11, 12, 12, 10, -1], startFret: 10 },
  ],
  'C_minor': [
    { name: 'Barre 3rd', frets: [3, 4, 5, 5, 3, -1], startFret: 3 },
    { name: 'Barre 8th', frets: [8, 8, 8, 10, 10, 8], startFret: 8 },
  ],
  'F_minor': [
    { name: 'Barre 1st', frets: [1, 1, 1, 3, 3, 1], startFret: 1 },
    { name: 'Barre 8th', frets: [-1, 9, 10, 10, 8, -1], startFret: 8 },
  ],
  'B_minor': [
    { name: 'Barre 2nd', frets: [2, 3, 4, 4, 2, -1], startFret: 2 },
    { name: 'Barre 7th', frets: [7, 7, 7, 9, 9, 7], startFret: 7 },
  ],
  'C_7': [
    { name: 'Open', frets: [-1, 0, 1, 3, 2, 3], startFret: 0 },
    { name: 'Barre 3rd', frets: [3, 5, 3, 5, 3, -1], startFret: 3 },
    { name: 'Barre 8th', frets: [8, 8, 9, 8, 10, 8], startFret: 8 },
  ],
  'G_7': [
    { name: 'Open', frets: [1, 0, 0, 0, 2, 3], startFret: 0 },
    { name: 'Barre 3rd', frets: [3, 3, 4, 3, 5, 3], startFret: 3 },
    { name: 'Barre 10th', frets: [-1, 12, 10, 12, 10, -1], startFret: 10 },
  ],
  'D_7': [
    { name: 'Open', frets: [2, 1, 2, 0, -1, -1], startFret: 0 },
    { name: 'Barre 5th', frets: [5, 7, 5, 7, 5, -1], startFret: 5 },
    { name: 'Barre 10th', frets: [10, 10, 11, 10, 12, 10], startFret: 10 },
  ],
  'A_7': [
    { name: 'Open', frets: [0, 2, 0, 2, 0, -1], startFret: 0 },
    { name: 'Barre 5th', frets: [5, 5, 6, 5, 7, 5], startFret: 5 },
    { name: 'Barre 12th', frets: [-1, 14, 12, 14, 12, -1], startFret: 12 },
  ],
  'E_7': [
    { name: 'Open', frets: [0, 0, 1, 0, 2, 0], startFret: 0 },
    { name: 'Barre 7th', frets: [7, 9, 7, 9, 7, -1], startFret: 7 },
    { name: 'Barre 12th', frets: [12, 12, 13, 12, 14, 12], startFret: 12 },
  ],
  'B_dim': [
    { name: 'Open', frets: [-1, 3, 1, 3, 2, -1], startFret: 0 },
    { name: 'Barre 7th', frets: [7, 8, 7, 8, -1, -1], startFret: 7 },
  ],
  'F#_minor': [
    { name: 'Barre 2nd', frets: [2, 2, 2, 4, 4, 2], startFret: 2 },
    { name: 'Barre 9th', frets: [-1, 10, 11, 11, 9, -1], startFret: 9 },
  ],
  'C#_minor': [
    { name: 'Barre 4th', frets: [4, 4, 5, 6, 6, 4], startFret: 4 },
    { name: 'Barre 9th', frets: [9, 9, 9, 11, 11, 9], startFret: 9 },
  ],
  'G#_minor': [
    { name: 'Barre 4th', frets: [4, 4, 4, 6, 6, 4], startFret: 4 },
    { name: 'Barre 11th', frets: [-1, 12, 13, 13, 11, -1], startFret: 11 },
  ],
  'D#_minor': [
    { name: 'Barre 6th', frets: [6, 6, 6, 8, 8, 6], startFret: 6 },
    { name: 'Barre 11th', frets: [11, 11, 11, 13, 13, 11], startFret: 11 },
  ],
  'A#_minor': [
    { name: 'Barre 1st', frets: [1, 2, 3, 3, 1, -1], startFret: 1 },
    { name: 'Barre 6th', frets: [6, 6, 6, 8, 8, 6], startFret: 6 },
  ],

  // Major 7th (maj7) voicings
  'C_maj7': [
    { name: 'Open', frets: [0, 0, 0, 2, 3, -1], startFret: 0 },
    { name: 'Barre 3rd', frets: [3, 4, 5, 5, 3, -1], startFret: 3 },
    { name: 'Barre 8th', frets: [8, 7, 9, 9, 10, 8], startFret: 7 },
  ],
  'C#_maj7': [
    { name: 'Barre 4th', frets: [4, 5, 6, 6, 4, -1], startFret: 4 },
    { name: 'Barre 9th', frets: [9, 8, 10, 10, 11, 9], startFret: 8 },
  ],
  'D_maj7': [
    { name: 'Open', frets: [2, 2, 2, 0, -1, -1], startFret: 0 },
    { name: 'Barre 5th', frets: [5, 6, 7, 7, 5, -1], startFret: 5 },
    { name: 'Barre 10th', frets: [10, 9, 11, 11, 12, 10], startFret: 9 },
  ],
  'D#_maj7': [
    { name: 'Barre 6th', frets: [6, 7, 8, 8, 6, -1], startFret: 6 },
    { name: 'Barre 11th', frets: [11, 10, 12, 12, 13, 11], startFret: 10 },
  ],
  'E_maj7': [
    { name: 'Open', frets: [0, 0, 1, 1, 2, 0], startFret: 0 },
    { name: 'Barre 7th', frets: [7, 8, 9, 9, 7, -1], startFret: 7 },
    { name: 'Barre 12th', frets: [12, 11, 13, 13, 14, 12], startFret: 11 },
  ],
  'F_maj7': [
    { name: 'Open', frets: [0, 1, 2, 2, -1, -1], startFret: 0 },
    { name: 'Barre 1st', frets: [1, 0, 2, 2, 3, 1], startFret: 0 },
    { name: 'Barre 8th', frets: [8, 9, 10, 10, 8, -1], startFret: 8 },
  ],
  'F#_maj7': [
    { name: 'Barre 2nd', frets: [2, 1, 3, 3, 4, 2], startFret: 1 },
    { name: 'Barre 9th', frets: [9, 10, 11, 11, 9, -1], startFret: 9 },
  ],
  'G_maj7': [
    { name: 'Open', frets: [2, 0, 0, 0, 2, 3], startFret: 0 },
    { name: 'Barre 3rd', frets: [3, 2, 4, 4, 5, 3], startFret: 2 },
    { name: 'Barre 10th', frets: [10, 11, 12, 12, 10, -1], startFret: 10 },
  ],
  'G#_maj7': [
    { name: 'Barre 4th', frets: [4, 3, 5, 5, 6, 4], startFret: 3 },
    { name: 'Barre 11th', frets: [11, 12, 13, 13, 11, -1], startFret: 11 },
  ],
  'A_maj7': [
    { name: 'Open', frets: [0, 2, 1, 2, 0, -1], startFret: 0 },
    { name: 'Barre 5th', frets: [5, 4, 6, 6, 7, 5], startFret: 4 },
    { name: 'Barre 12th', frets: [12, 13, 14, 14, 12, -1], startFret: 12 },
  ],
  'A#_maj7': [
    { name: 'Barre 1st', frets: [1, 3, 2, 3, 1, -1], startFret: 1 },
    { name: 'Barre 6th', frets: [6, 5, 7, 7, 8, 6], startFret: 5 },
  ],
  'B_maj7': [
    { name: 'Barre 2nd', frets: [2, 4, 3, 4, 2, -1], startFret: 2 },
    { name: 'Barre 7th', frets: [7, 6, 8, 8, 9, 7], startFret: 6 },
  ],

  // Minor 7th (m7) voicings
  'C_m7': [
    { name: 'Barre 3rd', frets: [3, 4, 3, 5, 3, -1], startFret: 3 },
    { name: 'Barre 8th', frets: [8, 8, 8, 8, 10, 8], startFret: 8 },
  ],
  'C#_m7': [
    { name: 'Barre 4th', frets: [4, 5, 4, 6, 4, -1], startFret: 4 },
    { name: 'Barre 9th', frets: [9, 9, 9, 9, 11, 9], startFret: 9 },
  ],
  'D_m7': [
    { name: 'Open', frets: [1, 1, 2, 0, -1, -1], startFret: 0 },
    { name: 'Barre 5th', frets: [5, 6, 5, 7, 5, -1], startFret: 5 },
    { name: 'Barre 10th', frets: [10, 10, 10, 10, 12, 10], startFret: 10 },
  ],
  'D#_m7': [
    { name: 'Barre 6th', frets: [6, 7, 6, 8, 6, -1], startFret: 6 },
    { name: 'Barre 11th', frets: [11, 11, 11, 11, 13, 11], startFret: 11 },
  ],
  'E_m7': [
    { name: 'Open', frets: [0, 0, 0, 0, 2, 0], startFret: 0 },
    { name: 'Barre 7th', frets: [7, 8, 7, 9, 7, -1], startFret: 7 },
    { name: 'Barre 12th', frets: [12, 12, 12, 12, 14, 12], startFret: 12 },
  ],
  'F_m7': [
    { name: 'Barre 1st', frets: [1, 1, 1, 1, 3, 1], startFret: 1 },
    { name: 'Barre 8th', frets: [8, 9, 8, 10, 8, -1], startFret: 8 },
  ],
  'F#_m7': [
    { name: 'Barre 2nd', frets: [2, 2, 2, 2, 4, 2], startFret: 2 },
    { name: 'Barre 9th', frets: [9, 10, 9, 11, 9, -1], startFret: 9 },
  ],
  'G_m7': [
    { name: 'Barre 3rd', frets: [3, 3, 3, 3, 5, 3], startFret: 3 },
    { name: 'Barre 10th', frets: [10, 11, 10, 12, 10, -1], startFret: 10 },
  ],
  'G#_m7': [
    { name: 'Barre 4th', frets: [4, 4, 4, 4, 6, 4], startFret: 4 },
    { name: 'Barre 11th', frets: [11, 12, 11, 13, 11, -1], startFret: 11 },
  ],
  'A_m7': [
    { name: 'Open', frets: [0, 1, 0, 2, 0, -1], startFret: 0 },
    { name: 'Barre 5th', frets: [5, 5, 5, 5, 7, 5], startFret: 5 },
    { name: 'Barre 12th', frets: [12, 13, 12, 14, 12, -1], startFret: 12 },
  ],
  'A#_m7': [
    { name: 'Barre 1st', frets: [1, 2, 1, 3, 1, -1], startFret: 1 },
    { name: 'Barre 6th', frets: [6, 6, 6, 6, 8, 6], startFret: 6 },
  ],
  'B_m7': [
    { name: 'Barre 2nd', frets: [2, 3, 2, 4, 2, -1], startFret: 2 },
    { name: 'Barre 7th', frets: [7, 7, 7, 7, 9, 7], startFret: 7 },
  ],

  // Diminished (dim) voicings
  'C_dim': [
    { name: 'Barre 3rd', frets: [2, 4, 2, 4, 3, -1], startFret: 2 },
    { name: 'Barre 8th', frets: [8, 9, 8, 9, -1, -1], startFret: 8 },
  ],
  'C#_dim': [
    { name: 'Barre 4th', frets: [3, 5, 3, 5, 4, -1], startFret: 3 },
    { name: 'Barre 9th', frets: [9, 10, 9, 10, -1, -1], startFret: 9 },
  ],
  'D_dim': [
    { name: 'Open', frets: [1, 0, 1, 0, -1, -1], startFret: 0 },
    { name: 'Barre 5th', frets: [4, 6, 4, 6, 5, -1], startFret: 4 },
    { name: 'Barre 10th', frets: [10, 11, 10, 11, -1, -1], startFret: 10 },
  ],
  'D#_dim': [
    { name: 'Barre 5th', frets: [5, 7, 5, 7, 6, -1], startFret: 5 },
    { name: 'Barre 11th', frets: [11, 12, 11, 12, -1, -1], startFret: 11 },
  ],
  'E_dim': [
    { name: 'Open', frets: [-1, 2, 0, 2, 1, 0], startFret: 0 },
    { name: 'Barre 6th', frets: [6, 8, 6, 8, 7, -1], startFret: 6 },
    { name: 'Barre 12th', frets: [12, 13, 12, 13, -1, -1], startFret: 12 },
  ],
  'F_dim': [
    { name: 'Barre 1st', frets: [-1, 3, 1, 3, 2, 1], startFret: 1 },
    { name: 'Barre 7th', frets: [7, 9, 7, 9, 8, -1], startFret: 7 },
  ],
  'F#_dim': [
    { name: 'Barre 2nd', frets: [-1, 4, 2, 4, 3, 2], startFret: 2 },
    { name: 'Barre 8th', frets: [8, 10, 8, 10, 9, -1], startFret: 8 },
  ],
  'G_dim': [
    { name: 'Barre 3rd', frets: [-1, 5, 3, 5, 4, 3], startFret: 3 },
    { name: 'Barre 9th', frets: [9, 11, 9, 11, 10, -1], startFret: 9 },
  ],
  'G#_dim': [
    { name: 'Barre 4th', frets: [-1, 6, 4, 6, 5, 4], startFret: 4 },
    { name: 'Barre 10th', frets: [10, 12, 10, 12, 11, -1], startFret: 10 },
  ],
  'A_dim': [
    { name: 'Open', frets: [-1, 1, 2, 1, 2, 0], startFret: 0 },
    { name: 'Barre 5th', frets: [-1, 7, 5, 7, 6, 5], startFret: 5 },
    { name: 'Barre 11th', frets: [11, 13, 11, 13, 12, -1], startFret: 11 },
  ],
  'A#_dim': [
    { name: 'Barre 1st', frets: [-1, 2, 3, 2, 3, 1], startFret: 1 },
    { name: 'Barre 6th', frets: [-1, 8, 6, 8, 7, 6], startFret: 6 },
  ],
  // B_dim already exists above

  // Diminished 7th (dim7) voicings
  'C_dim7': [
    { name: 'Barre 3rd', frets: [2, 4, 2, 4, 3, -1], startFret: 2 },
    { name: 'Barre 8th', frets: [8, 9, 8, 9, 8, -1], startFret: 8 },
  ],
  'C#_dim7': [
    { name: 'Barre 4th', frets: [3, 5, 3, 5, 4, -1], startFret: 3 },
    { name: 'Barre 9th', frets: [9, 10, 9, 10, 9, -1], startFret: 9 },
  ],
  'D_dim7': [
    { name: 'Open', frets: [1, 0, 1, 0, -1, -1], startFret: 0 },
    { name: 'Barre 4th', frets: [4, 6, 4, 6, 5, -1], startFret: 4 },
    { name: 'Barre 10th', frets: [10, 11, 10, 11, 10, -1], startFret: 10 },
  ],
  'D#_dim7': [
    { name: 'Barre 5th', frets: [5, 7, 5, 7, 6, -1], startFret: 5 },
    { name: 'Barre 11th', frets: [11, 12, 11, 12, 11, -1], startFret: 11 },
  ],
  'E_dim7': [
    { name: 'Open', frets: [0, 2, 0, 2, 1, 0], startFret: 0 },
    { name: 'Barre 6th', frets: [6, 8, 6, 8, 7, -1], startFret: 6 },
    { name: 'Barre 12th', frets: [12, 13, 12, 13, 12, -1], startFret: 12 },
  ],
  'F_dim7': [
    { name: 'Barre 1st', frets: [1, 3, 1, 3, 2, 1], startFret: 1 },
    { name: 'Barre 7th', frets: [7, 9, 7, 9, 8, -1], startFret: 7 },
  ],
  'F#_dim7': [
    { name: 'Barre 2nd', frets: [2, 4, 2, 4, 3, 2], startFret: 2 },
    { name: 'Barre 8th', frets: [8, 10, 8, 10, 9, -1], startFret: 8 },
  ],
  'G_dim7': [
    { name: 'Barre 3rd', frets: [3, 5, 3, 5, 4, 3], startFret: 3 },
    { name: 'Barre 9th', frets: [9, 11, 9, 11, 10, -1], startFret: 9 },
  ],
  'G#_dim7': [
    { name: 'Barre 4th', frets: [4, 6, 4, 6, 5, 4], startFret: 4 },
    { name: 'Barre 10th', frets: [10, 12, 10, 12, 11, -1], startFret: 10 },
  ],
  'A_dim7': [
    { name: 'Open', frets: [-1, 1, 2, 1, 2, -1], startFret: 0 },
    { name: 'Barre 5th', frets: [5, 7, 5, 7, 6, 5], startFret: 5 },
    { name: 'Barre 11th', frets: [11, 13, 11, 13, 12, -1], startFret: 11 },
  ],
  'A#_dim7': [
    { name: 'Barre 1st', frets: [-1, 2, 3, 2, 3, -1], startFret: 1 },
    { name: 'Barre 6th', frets: [6, 8, 6, 8, 7, 6], startFret: 6 },
  ],
  'B_dim7': [
    { name: 'Barre 1st', frets: [-1, 3, 1, 3, 2, -1], startFret: 1 },
    { name: 'Barre 7th', frets: [7, 9, 7, 9, 8, 7], startFret: 7 },
  ],

  // Augmented (aug) voicings
  'C_aug': [
    { name: 'Open', frets: [0, 1, 1, 2, 3, -1], startFret: 0 },
    { name: 'Barre 8th', frets: [8, 9, 9, 10, -1, 8], startFret: 8 },
  ],
  'C#_aug': [
    { name: 'Barre 1st', frets: [1, 2, 2, 3, 4, -1], startFret: 1 },
    { name: 'Barre 9th', frets: [9, 10, 10, 11, -1, 9], startFret: 9 },
  ],
  'D_aug': [
    { name: 'Open', frets: [2, 3, 3, -1, -1, -1], startFret: 0 },
    { name: 'Barre 2nd', frets: [2, 3, 3, 4, 5, -1], startFret: 2 },
    { name: 'Barre 10th', frets: [10, 11, 11, 12, -1, 10], startFret: 10 },
  ],
  'D#_aug': [
    { name: 'Barre 3rd', frets: [3, 4, 4, 5, 6, -1], startFret: 3 },
    { name: 'Barre 11th', frets: [11, 12, 12, 13, -1, 11], startFret: 11 },
  ],
  'E_aug': [
    { name: 'Open', frets: [0, 0, 1, 2, 2, -1], startFret: 0 },
    { name: 'Barre 4th', frets: [4, 5, 5, 6, 7, -1], startFret: 4 },
    { name: 'Barre 12th', frets: [12, 13, 13, 14, -1, 12], startFret: 12 },
  ],
  'F_aug': [
    { name: 'Barre 1st', frets: [1, 1, 2, 3, 3, -1], startFret: 1 },
    { name: 'Barre 5th', frets: [5, 6, 6, 7, 8, -1], startFret: 5 },
  ],
  'F#_aug': [
    { name: 'Barre 2nd', frets: [2, 2, 3, 4, 4, -1], startFret: 2 },
    { name: 'Barre 6th', frets: [6, 7, 7, 8, 9, -1], startFret: 6 },
  ],
  'G_aug': [
    { name: 'Open', frets: [3, 0, 0, 0, 2, 3], startFret: 0 },
    { name: 'Barre 3rd', frets: [3, 3, 4, 5, 5, -1], startFret: 3 },
    { name: 'Barre 7th', frets: [7, 8, 8, 9, 10, -1], startFret: 7 },
  ],
  'G#_aug': [
    { name: 'Barre 4th', frets: [4, 4, 5, 6, 6, -1], startFret: 4 },
    { name: 'Barre 8th', frets: [8, 9, 9, 10, 11, -1], startFret: 8 },
  ],
  'A_aug': [
    { name: 'Open', frets: [1, 2, 2, 3, 0, -1], startFret: 0 },
    { name: 'Barre 5th', frets: [5, 5, 6, 7, 7, -1], startFret: 5 },
    { name: 'Barre 9th', frets: [9, 10, 10, 11, 12, -1], startFret: 9 },
  ],
  'A#_aug': [
    { name: 'Barre 1st', frets: [2, 3, 3, 4, 1, -1], startFret: 1 },
    { name: 'Barre 6th', frets: [6, 6, 7, 8, 8, -1], startFret: 6 },
  ],
  'B_aug': [
    { name: 'Barre 2nd', frets: [3, 4, 4, 5, 2, -1], startFret: 2 },
    { name: 'Barre 7th', frets: [7, 7, 8, 9, 9, -1], startFret: 7 },
  ],
};
