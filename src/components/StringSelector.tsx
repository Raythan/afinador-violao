import { GUITAR_STANDARD_TUNING, type GuitarString } from '../lib/notes'

interface StringSelectorProps {
  activeString: GuitarString | null
  detectedString: GuitarString | null
}

export function StringSelector({ activeString, detectedString }: StringSelectorProps) {
  return (
    <div className="string-selector">
      {GUITAR_STANDARD_TUNING.map((string, index) => {
        const isDetected = detectedString?.note === string.note && detectedString?.octave === string.octave
        const isActive = activeString?.note === string.note && activeString?.octave === string.octave

        return (
          <div
            key={index}
            className={`string-item ${isDetected ? 'detected' : ''} ${isActive ? 'active' : ''}`}
          >
            <span className="string-note">{string.note}{string.octave}</span>
            <span className="string-label">{string.name.split(' ')[0]}</span>
          </div>
        )
      })}
    </div>
  )
}
