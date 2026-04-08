import { useState, useEffect, useCallback, useRef } from 'react'
import { Meter } from './components/Meter'
import { NoteDisplay } from './components/NoteDisplay'
import { StringSelector } from './components/StringSelector'
import { Controls } from './components/Controls'
import { startAudio, stopAudio, detectPitch, isAudioActive } from './audio/pitch'
import {
  frequencyToNote,
  findClosestString,
  centsFromTarget,
  type NoteInfo,
  type GuitarString,
} from './lib/notes'
import './App.css'

function App() {
  const [isListening, setIsListening] = useState(false)
  const [mode, setMode] = useState<'guitar' | 'chromatic'>('guitar')
  const [currentNote, setCurrentNote] = useState<NoteInfo | null>(null)
  const [detectedString, setDetectedString] = useState<GuitarString | null>(null)
  const [cents, setCents] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const animationRef = useRef<number | null>(null)

  const processAudio = useCallback(() => {
    if (!isAudioActive()) return

    const result = detectPitch()

    if (result) {
      const note = frequencyToNote(result.frequency)
      setCurrentNote(note)

      if (mode === 'guitar') {
        const closest = findClosestString(result.frequency)
        setDetectedString(closest)
        if (closest) {
          setCents(centsFromTarget(result.frequency, closest.frequency))
        } else {
          setCents(note.cents)
        }
      } else {
        setDetectedString(null)
        setCents(note.cents)
      }
    } else {
      setCurrentNote(null)
      setDetectedString(null)
      setCents(0)
    }

    animationRef.current = requestAnimationFrame(processAudio)
  }, [mode])

  const toggleListening = async () => {
    if (isListening) {
      stopAudio()
      setIsListening(false)
      setCurrentNote(null)
      setDetectedString(null)
      setCents(0)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    } else {
      try {
        setError(null)
        await startAudio()
        setIsListening(true)
        animationRef.current = requestAnimationFrame(processAudio)
      } catch (err) {
        setError('Não foi possível acessar o microfone. Verifique as permissões do navegador.')
        console.error(err)
      }
    }
  }

  const toggleMode = () => {
    setMode((prev) => (prev === 'guitar' ? 'chromatic' : 'guitar'))
  }

  useEffect(() => {
    return () => {
      stopAudio()
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (isListening && animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = requestAnimationFrame(processAudio)
    }
  }, [isListening, processAudio])

  return (
    <div className="app">
      <header className="header">
        <h1>Afinador</h1>
        <span className="mode-badge">{mode === 'guitar' ? 'Violão' : 'Cromático'}</span>
      </header>

      <main className="main">
        <NoteDisplay
          note={currentNote?.name ?? '-'}
          octave={currentNote?.octave ?? 0}
          frequency={currentNote ? currentNote.frequency : 0}
          isActive={isListening && currentNote !== null}
        />

        <Meter cents={cents} isActive={isListening && currentNote !== null} />

        {mode === 'guitar' && (
          <StringSelector
            activeString={null}
            detectedString={detectedString}
          />
        )}

        {error && <div className="error">{error}</div>}
      </main>

      <footer className="footer">
        <Controls
          isListening={isListening}
          mode={mode}
          onToggleListening={toggleListening}
          onToggleMode={toggleMode}
        />
        <p className="privacy">100% local · Nenhum dado é enviado</p>
      </footer>
    </div>
  )
}

export default App
