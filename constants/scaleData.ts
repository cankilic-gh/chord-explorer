
export const SCALE_TYPE_IDS = [
  'pentatonic_minor',
  'pentatonic_major',
  'blues',
  'natural_minor',
  'major',
  'dorian',
  'mixolydian',
] as const;

export type ScaleType = typeof SCALE_TYPE_IDS[number];

export interface ScaleFormula {
  name: string;
  shortName: string;
  intervals: number[];
  intervalNames: string[];
}

export const SCALE_TYPES: Record<ScaleType, ScaleFormula> = {
  pentatonic_minor: {
    name: 'Minor Pentatonic',
    shortName: 'Pent m',
    intervals: [0, 3, 5, 7, 10],
    intervalNames: ['1', 'b3', '4', '5', 'b7'],
  },
  pentatonic_major: {
    name: 'Major Pentatonic',
    shortName: 'Pent M',
    intervals: [0, 2, 4, 7, 9],
    intervalNames: ['1', '2', '3', '5', '6'],
  },
  blues: {
    name: 'Blues',
    shortName: 'Blues',
    intervals: [0, 3, 5, 6, 7, 10],
    intervalNames: ['1', 'b3', '4', 'b5', '5', 'b7'],
  },
  natural_minor: {
    name: 'Natural Minor',
    shortName: 'Minor',
    intervals: [0, 2, 3, 5, 7, 8, 10],
    intervalNames: ['1', '2', 'b3', '4', '5', 'b6', 'b7'],
  },
  major: {
    name: 'Major',
    shortName: 'Major',
    intervals: [0, 2, 4, 5, 7, 9, 11],
    intervalNames: ['1', '2', '3', '4', '5', '6', '7'],
  },
  dorian: {
    name: 'Dorian',
    shortName: 'Dorian',
    intervals: [0, 2, 3, 5, 7, 9, 10],
    intervalNames: ['1', '2', 'b3', '4', '5', '6', 'b7'],
  },
  mixolydian: {
    name: 'Mixolydian',
    shortName: 'Mixo',
    intervals: [0, 2, 4, 5, 7, 9, 10],
    intervalNames: ['1', '2', '3', '4', '5', '6', 'b7'],
  },
};

export interface ExtensionNote {
  id: string;
  name: string;
  semitones: number;
}

export const EXTENSION_NOTES: ExtensionNote[] = [
  { id: 'b5', name: 'b5', semitones: 6 },
  { id: '9', name: '9th', semitones: 2 },
  { id: 'b9', name: 'b9', semitones: 1 },
  { id: '#9', name: '#9', semitones: 3 },
  { id: '11', name: '11th', semitones: 5 },
  { id: '#11', name: '#11', semitones: 6 },
  { id: '13', name: '13th', semitones: 9 },
  { id: 'b13', name: 'b13', semitones: 8 },
];

// Default scale suggestion based on chord type
export const CHORD_TO_SCALE: Record<string, ScaleType> = {
  'minor': 'pentatonic_minor',
  'm7': 'pentatonic_minor',
  'Major': 'pentatonic_major',
  'maj7': 'pentatonic_major',
  '7': 'mixolydian',
  'dim': 'natural_minor',
  'dim7': 'natural_minor',
  'aug': 'major',
};
