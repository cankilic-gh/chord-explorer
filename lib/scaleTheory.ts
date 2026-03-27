
import { NOTES, Note } from '../constants/musicData';
import { ScaleType, SCALE_TYPES, EXTENSION_NOTES } from '../constants/scaleData';

export interface ScaleNote {
  note: Note;
  intervalName: string;
  semitones: number;
  isExtension: boolean;
  isChordTone: boolean;
}

export const getScaleNotes = (
  root: Note,
  scaleType: ScaleType,
  activeExtensions: string[],
  chordNoteNames: Note[]
): ScaleNote[] => {
  const rootIndex = NOTES.indexOf(root);
  const formula = SCALE_TYPES[scaleType];

  const notes: ScaleNote[] = formula.intervals.map((interval, i) => ({
    note: NOTES[(rootIndex + interval) % 12] as Note,
    intervalName: formula.intervalNames[i],
    semitones: interval,
    isExtension: false,
    isChordTone: chordNoteNames.includes(NOTES[(rootIndex + interval) % 12] as Note),
  }));

  const existingSemitones = new Set(formula.intervals);
  for (const extId of activeExtensions) {
    const ext = EXTENSION_NOTES.find(e => e.id === extId);
    if (!ext) continue;
    const semitone = ext.semitones % 12;
    if (existingSemitones.has(semitone)) continue;
    existingSemitones.add(semitone);
    notes.push({
      note: NOTES[(rootIndex + semitone) % 12] as Note,
      intervalName: ext.name,
      semitones: semitone,
      isExtension: true,
      isChordTone: chordNoteNames.includes(NOTES[(rootIndex + semitone) % 12] as Note),
    });
  }

  return notes;
};

// Get extensions that are NOT already in the selected scale
export const getAvailableExtensions = (scaleType: ScaleType): typeof EXTENSION_NOTES => {
  const formula = SCALE_TYPES[scaleType];
  const scaleIntervals = new Set(formula.intervals);
  return EXTENSION_NOTES.filter(ext => !scaleIntervals.has(ext.semitones % 12));
};
