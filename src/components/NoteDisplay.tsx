interface NoteDisplayProps {
  note: string
  octave: number
  frequency: number
  isActive: boolean
}

export function NoteDisplay({ note, octave, frequency, isActive }: NoteDisplayProps) {
  return (
    <div className="note-display">
      <div className="note-main">
        {isActive ? (
          <>
            <span className="note-name">{note}</span>
            <span className="note-octave">{octave}</span>
          </>
        ) : (
          <span className="note-name">-</span>
        )}
      </div>
      <div className="frequency">
        {isActive ? `${frequency.toFixed(1)} Hz` : '--- Hz'}
      </div>
    </div>
  )
}
