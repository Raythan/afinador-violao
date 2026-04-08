import { Mic, MicOff, Guitar, Music } from 'lucide-react'

interface ControlsProps {
  isListening: boolean
  mode: 'guitar' | 'chromatic'
  onToggleListening: () => void
  onToggleMode: () => void
}

export function Controls({ isListening, mode, onToggleListening, onToggleMode }: ControlsProps) {
  return (
    <div className="controls">
      <button
        className={`control-btn primary ${isListening ? 'active' : ''}`}
        onClick={onToggleListening}
        aria-label={isListening ? 'Parar afinador' : 'Iniciar afinador'}
        title={isListening ? 'Parar afinador' : 'Iniciar afinador'}
      >
        {isListening ? <MicOff size={28} /> : <Mic size={28} />}
      </button>

      <button
        className="control-btn secondary"
        onClick={onToggleMode}
        aria-label={mode === 'guitar' ? 'Modo: Violão - Clique para cromático' : 'Modo: Cromático - Clique para violão'}
        title={mode === 'guitar' ? 'Modo: Violão' : 'Modo: Cromático'}
      >
        {mode === 'guitar' ? <Guitar size={24} /> : <Music size={24} />}
      </button>
    </div>
  )
}
