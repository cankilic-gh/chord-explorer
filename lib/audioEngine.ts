import * as Tone from 'tone';
import type { Chord } from '../constants/musicData';
import { NOTES, CHORD_TYPES } from '../constants/musicData';

let pianoSynth: Tone.PolySynth | null = null;
let guitarSynth: Tone.PluckSynth | null = null;
let reverb: Tone.Reverb | null = null;
let isInitialized = false;
let currentSequence: Tone.Part | null = null;

const initializeAudio = async (): Promise<void> => {
  if (isInitialized) return;

  await Tone.start();

  reverb = new Tone.Reverb({
    decay: 2.5,
    wet: 0.3,
    preDelay: 0.01,
  }).toDestination();

  await reverb.generate();

  pianoSynth = new Tone.PolySynth(Tone.Synth, {
    oscillator: {
      type: 'triangle8',
    },
    envelope: {
      attack: 0.02,
      decay: 0.3,
      sustain: 0.4,
      release: 1.2,
    },
  }).connect(reverb);
  pianoSynth.volume.value = -6;

  guitarSynth = new Tone.PluckSynth({
    attackNoise: 1.2,
    dampening: 3500,
    resonance: 0.96,
    release: 1.5,
  }).connect(reverb);
  guitarSynth.volume.value = -3;

  isInitialized = true;
};

const noteToFrequency = (note: string, octave: number): string => {
  return `${note}${octave}`;
};

const getChordNotesForPlayback = (chord: Chord, baseOctave: number = 4): string[] => {
  const rootIndex = NOTES.indexOf(chord.root);
  const formula = CHORD_TYPES[chord.type];
  if (!formula) return [];

  return formula.intervals.map((interval) => {
    const noteIndex = (rootIndex + interval) % 12;
    const octaveOffset = Math.floor((rootIndex + interval) / 12);
    const note = NOTES[noteIndex];
    return noteToFrequency(note, baseOctave + octaveOffset);
  });
};

export const playChord = async (
  notes: string[],
  instrument: 'piano' | 'guitar'
): Promise<void> => {
  await initializeAudio();

  if (instrument === 'piano' && pianoSynth) {
    pianoSynth.triggerAttackRelease(notes, '2n');
  } else if (instrument === 'guitar' && guitarSynth) {
    notes.forEach((note, index) => {
      setTimeout(() => {
        guitarSynth?.triggerAttackRelease(note, '2n');
      }, index * 30);
    });
  }
};

export const playProgression = async (
  chords: Chord[],
  bpm: number,
  instrument: 'piano' | 'guitar'
): Promise<void> => {
  await initializeAudio();

  stopPlayback();

  Tone.getTransport().bpm.value = bpm;

  const events = chords.map((chord, index) => {
    const notes = getChordNotesForPlayback(chord);
    return {
      time: `${index}:0:0`,
      notes,
      chord,
    };
  });

  currentSequence = new Tone.Part((time, event) => {
    if (instrument === 'piano' && pianoSynth) {
      pianoSynth.triggerAttackRelease(event.notes, '2n', time);
    } else if (instrument === 'guitar' && guitarSynth) {
      event.notes.forEach((note: string, i: number) => {
        guitarSynth?.triggerAttackRelease(note, '2n', time + i * 0.03);
      });
    }
  }, events);

  currentSequence.start(0);
  currentSequence.loop = false;

  Tone.getTransport().start();
};

export const stopPlayback = (): void => {
  if (currentSequence) {
    currentSequence.stop();
    currentSequence.dispose();
    currentSequence = null;
  }

  Tone.getTransport().stop();
  Tone.getTransport().position = 0;

  if (pianoSynth) {
    pianoSynth.releaseAll();
  }
};

export const ensureAudioContext = async (): Promise<void> => {
  await initializeAudio();
};

export const playChordFromChord = async (
  chord: Chord,
  instrument: 'piano' | 'guitar' = 'guitar'
): Promise<void> => {
  const notes = getChordNotesForPlayback(chord);
  await playChord(notes, instrument);
};

export const playNote = async (
  note: string,
  octave: number,
  duration: string = '8n'
): Promise<void> => {
  await initializeAudio();

  if (pianoSynth) {
    const noteWithOctave = `${note}${octave}`;
    pianoSynth.triggerAttackRelease(noteWithOctave, duration);
  }
};
