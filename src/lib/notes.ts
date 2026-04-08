export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const

export type NoteName = (typeof NOTE_NAMES)[number]

export interface NoteInfo {
  name: NoteName
  octave: number
  frequency: number
  cents: number
}

export interface GuitarString {
  name: string
  note: NoteName
  octave: number
  frequency: number
}

export const GUITAR_STANDARD_TUNING: GuitarString[] = [
  { name: '1ª (E agudo)', note: 'E', octave: 4, frequency: 329.63 },
  { name: '2ª (B)', note: 'B', octave: 3, frequency: 246.94 },
  { name: '3ª (G)', note: 'G', octave: 3, frequency: 196.00 },
  { name: '4ª (D)', note: 'D', octave: 3, frequency: 146.83 },
  { name: '5ª (A)', note: 'A', octave: 2, frequency: 110.00 },
  { name: '6ª (E grave)', note: 'E', octave: 2, frequency: 82.41 },
]

const A4_FREQUENCY = 440
const A4_MIDI = 69

export function frequencyToMidi(frequency: number): number {
  return 12 * Math.log2(frequency / A4_FREQUENCY) + A4_MIDI
}

export function midiToFrequency(midi: number): number {
  return A4_FREQUENCY * Math.pow(2, (midi - A4_MIDI) / 12)
}

export function frequencyToNote(frequency: number): NoteInfo {
  if (frequency <= 0) {
    return { name: 'A', octave: 0, frequency: 0, cents: 0 }
  }

  const midi = frequencyToMidi(frequency)
  const roundedMidi = Math.round(midi)
  const cents = Math.round((midi - roundedMidi) * 100)

  const noteIndex = ((roundedMidi % 12) + 12) % 12
  const octave = Math.floor(roundedMidi / 12) - 1

  return {
    name: NOTE_NAMES[noteIndex],
    octave,
    frequency: midiToFrequency(roundedMidi),
    cents,
  }
}

export function findClosestString(frequency: number): GuitarString | null {
  if (frequency <= 0) return null

  let closest: GuitarString | null = null
  let minDiff = Infinity

  for (const string of GUITAR_STANDARD_TUNING) {
    const diff = Math.abs(frequencyToMidi(frequency) - frequencyToMidi(string.frequency))
    if (diff < minDiff) {
      minDiff = diff
      closest = string
    }
  }

  return minDiff <= 3 ? closest : null
}

export function centsFromTarget(detected: number, target: number): number {
  if (detected <= 0 || target <= 0) return 0
  return Math.round(1200 * Math.log2(detected / target))
}
