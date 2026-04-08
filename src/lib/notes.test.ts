import { describe, it, expect } from 'vitest'
import {
  frequencyToMidi,
  midiToFrequency,
  frequencyToNote,
  findClosestString,
  centsFromTarget,
  GUITAR_STANDARD_TUNING,
} from './notes'

describe('frequencyToMidi', () => {
  it('retorna 69 para A4 (440Hz)', () => {
    expect(frequencyToMidi(440)).toBeCloseTo(69, 5)
  })

  it('retorna 60 para C4 (261.63Hz)', () => {
    expect(frequencyToMidi(261.63)).toBeCloseTo(60, 1)
  })

  it('retorna 57 para A3 (220Hz)', () => {
    expect(frequencyToMidi(220)).toBeCloseTo(57, 5)
  })
})

describe('midiToFrequency', () => {
  it('retorna 440 para MIDI 69', () => {
    expect(midiToFrequency(69)).toBeCloseTo(440, 2)
  })

  it('retorna 261.63 para MIDI 60 (C4)', () => {
    expect(midiToFrequency(60)).toBeCloseTo(261.63, 1)
  })

  it('retorna 82.41 para MIDI 40 (E2)', () => {
    expect(midiToFrequency(40)).toBeCloseTo(82.41, 1)
  })
})

describe('frequencyToNote', () => {
  it('identifica A4 corretamente', () => {
    const note = frequencyToNote(440)
    expect(note.name).toBe('A')
    expect(note.octave).toBe(4)
    expect(note.cents).toBe(0)
  })

  it('identifica E2 (corda grave do violão)', () => {
    const note = frequencyToNote(82.41)
    expect(note.name).toBe('E')
    expect(note.octave).toBe(2)
    expect(Math.abs(note.cents)).toBeLessThanOrEqual(1)
  })

  it('identifica E4 (corda aguda do violão)', () => {
    const note = frequencyToNote(329.63)
    expect(note.name).toBe('E')
    expect(note.octave).toBe(4)
    expect(Math.abs(note.cents)).toBeLessThanOrEqual(1)
  })

  it('calcula cents positivos para frequência acima da nota', () => {
    const note = frequencyToNote(445)
    expect(note.name).toBe('A')
    expect(note.octave).toBe(4)
    expect(note.cents).toBeGreaterThan(0)
  })

  it('calcula cents negativos para frequência abaixo da nota', () => {
    const note = frequencyToNote(435)
    expect(note.name).toBe('A')
    expect(note.octave).toBe(4)
    expect(note.cents).toBeLessThan(0)
  })
})

describe('findClosestString', () => {
  it('encontra a 6ª corda (E2) para ~82Hz', () => {
    const string = findClosestString(82)
    expect(string).not.toBeNull()
    expect(string!.note).toBe('E')
    expect(string!.octave).toBe(2)
  })

  it('encontra a 5ª corda (A2) para ~110Hz', () => {
    const string = findClosestString(112)
    expect(string).not.toBeNull()
    expect(string!.note).toBe('A')
    expect(string!.octave).toBe(2)
  })

  it('encontra a 1ª corda (E4) para ~330Hz', () => {
    const string = findClosestString(328)
    expect(string).not.toBeNull()
    expect(string!.note).toBe('E')
    expect(string!.octave).toBe(4)
  })

  it('retorna null para frequência muito distante das cordas', () => {
    const string = findClosestString(1000)
    expect(string).toBeNull()
  })

  it('retorna null para frequência zero ou negativa', () => {
    expect(findClosestString(0)).toBeNull()
    expect(findClosestString(-100)).toBeNull()
  })
})

describe('centsFromTarget', () => {
  it('retorna 0 para frequências iguais', () => {
    expect(centsFromTarget(440, 440)).toBe(0)
  })

  it('retorna ~100 cents para um semitom acima', () => {
    const cents = centsFromTarget(466.16, 440)
    expect(cents).toBeCloseTo(100, 0)
  })

  it('retorna ~-100 cents para um semitom abaixo', () => {
    const cents = centsFromTarget(415.3, 440)
    expect(cents).toBeCloseTo(-100, 0)
  })

  it('retorna 0 para frequências inválidas', () => {
    expect(centsFromTarget(0, 440)).toBe(0)
    expect(centsFromTarget(440, 0)).toBe(0)
  })
})

describe('GUITAR_STANDARD_TUNING', () => {
  it('tem 6 cordas', () => {
    expect(GUITAR_STANDARD_TUNING).toHaveLength(6)
  })

  it('cordas estão em ordem decrescente de frequência', () => {
    for (let i = 0; i < GUITAR_STANDARD_TUNING.length - 1; i++) {
      expect(GUITAR_STANDARD_TUNING[i].frequency).toBeGreaterThan(
        GUITAR_STANDARD_TUNING[i + 1].frequency
      )
    }
  })

  it('1ª corda é E4, 6ª corda é E2', () => {
    expect(GUITAR_STANDARD_TUNING[0].note).toBe('E')
    expect(GUITAR_STANDARD_TUNING[0].octave).toBe(4)
    expect(GUITAR_STANDARD_TUNING[5].note).toBe('E')
    expect(GUITAR_STANDARD_TUNING[5].octave).toBe(2)
  })
})
