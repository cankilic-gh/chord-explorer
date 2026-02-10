
import { NOTES, CHORD_TYPES, GUITAR_VOICINGS, ChordType, Note, NoteWithInterval, Interval, ChordVoicing, FretPosition, Chord } from '../constants/musicData';

const getIntervalName = (semitones: number): Interval => {
  switch (semitones) {
    case 0: return 'Root';
    case 3: return 'Minor 3rd';
    case 4: return 'Major 3rd';
    case 6: return 'Diminished 5th';
    case 7: return 'Perfect 5th';
    case 8: return 'Augmented 5th';
    case 9: return 'Diminished 5th'; // dim7 chord uses this
    case 10: return 'Minor 7th';
    case 11: return 'Major 7th';
    default: return 'Root';
  }
};

export const getChordNotes = (rootNote: Note, chordType: ChordType): NoteWithInterval[] => {
  const rootIndex = NOTES.indexOf(rootNote);
  const formula = CHORD_TYPES[chordType];
  if (!formula) return [];

  return formula.intervals.map(interval => {
    const noteIndex = (rootIndex + interval) % 12;
    const note = NOTES[noteIndex];
    return {
      note: note,
      octave: 4, // Default octave
      interval: getIntervalName(interval),
      midi: 60 + rootIndex + interval,
    };
  });
};

export const getChordVoicing = (rootNote: Note, chordType: ChordType): ChordVoicing => {
    const key = `${rootNote}_${chordType}`;
    const voicingFrets = GUITAR_VOICINGS[key];
    
    if (!voicingFrets) {
        // Fallback for non-defined voicings - just show roots
        return [{string: 5, fret: NOTES.indexOf(rootNote) % 12, interval: 'Root'}];
    }

    const chordNotes = getChordNotes(rootNote, chordType).map(n => n.note);
    const rootIndex = NOTES.indexOf(rootNote);
    const openStringNotes = ['E', 'A', 'D', 'G', 'B', 'E'].reverse(); // low E to high e

    const voicing: ChordVoicing = [];
    voicingFrets.forEach((fret, stringIndex) => {
        if (fret > -1) {
            const openStringIndex = NOTES.indexOf(openStringNotes[stringIndex] as Note);
            const noteIndex = (openStringIndex + fret) % 12;
            const note = NOTES[noteIndex];
            
            const noteInChordIndex = chordNotes.indexOf(note);
            if(noteInChordIndex !== -1) {
                const formula = CHORD_TYPES[chordType];
                const intervalSemitones = formula.intervals[noteInChordIndex];
                
                // This is a simplification, true interval depends on distance from root
                const rootDist = (noteIndex - rootIndex + 12) % 12;
                const interval = getIntervalName(rootDist);
                 
                voicing.push({
                    string: 5 - stringIndex, // 0 for high E, 5 for low E
                    fret: fret,
                    interval: interval,
                });
            }
        }
    });

    return voicing;
};

const MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
const MAJOR_SCALE_CHORD_TYPES: ChordType[] = ['Major', 'minor', 'minor', 'Major', 'Major', 'minor', 'dim'];
const ROMAN_NUMERALS_MAJOR = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];

const MINOR_SCALE_INTERVALS = [0, 2, 3, 5, 7, 8, 10];
const MINOR_SCALE_CHORD_TYPES: ChordType[] = ['minor', 'dim', 'Major', 'minor', 'minor', 'Major', 'Major'];
const ROMAN_NUMERALS_MINOR = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];


export const getRelativeChords = (rootNote: Note, chordType: ChordType): Chord[] => {
    const rootIndex = NOTES.indexOf(rootNote);
    let scaleIntervals: number[];
    let chordTypes: ChordType[];

    if (chordType.includes('minor') || chordType.includes('dim')) {
        // Use natural minor scale
        scaleIntervals = MINOR_SCALE_INTERVALS;
        chordTypes = MINOR_SCALE_CHORD_TYPES;
    } else {
        // Use major scale
        scaleIntervals = MAJOR_SCALE_INTERVALS;
        chordTypes = MAJOR_SCALE_CHORD_TYPES;
    }

    return scaleIntervals.map((interval, index) => {
        const noteIndex = (rootIndex + interval) % 12;
        return {
            root: NOTES[noteIndex],
            type: chordTypes[index],
        };
    });
};

export const getRomanNumeral = (rootNote: Note, chordType: ChordType): string => {
    // This is a simplified version. It assumes the rootNote is the tonic of the key.
    const keyRootNote = rootNote; 
    const keyRootIndex = NOTES.indexOf(keyRootNote);
    let scaleIntervals: number[];
    let numerals: string[];
    
    if (chordType.includes('minor') || chordType.includes('dim')) {
        scaleIntervals = MINOR_SCALE_INTERVALS;
        numerals = ROMAN_NUMERALS_MINOR;
    } else {
        scaleIntervals = MAJOR_SCALE_INTERVALS;
        numerals = ROMAN_NUMERALS_MAJOR;
    }
    
    // Find what degree the current chord is in its OWN key
    const currentRootIndex = NOTES.indexOf(rootNote);
    const degreeIndex = scaleIntervals.indexOf((currentRootIndex - keyRootIndex + 12) % 12);
    
    return degreeIndex > -1 ? numerals[degreeIndex] : '?';
};
