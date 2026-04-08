import { useEffect, useRef } from 'react'

interface MeterProps {
  cents: number
  isActive: boolean
}

export function Meter({ cents, isActive }: MeterProps) {
  const needleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (needleRef.current) {
      const clampedCents = Math.max(-50, Math.min(50, cents))
      const rotation = (clampedCents / 50) * 45
      needleRef.current.style.transform = `translateX(-50%) rotate(${rotation}deg)`
    }
  }, [cents])

  const getStatusColor = () => {
    if (!isActive) return 'var(--color-inactive)'
    const absCents = Math.abs(cents)
    if (absCents <= 5) return 'var(--color-tuned)'
    if (absCents <= 15) return 'var(--color-close)'
    return 'var(--color-off)'
  }

  return (
    <div className="meter">
      <div className="meter-arc">
        <div className="meter-markers">
          <span className="marker marker-left">-50</span>
          <span className="marker marker-center">0</span>
          <span className="marker marker-right">+50</span>
        </div>
        <div className="meter-scale">
          {[-40, -30, -20, -10, 0, 10, 20, 30, 40].map((tick) => (
            <div
              key={tick}
              className={`tick ${tick === 0 ? 'tick-center' : ''}`}
              style={{
                transform: `rotate(${(tick / 50) * 45}deg)`,
              }}
            />
          ))}
        </div>
        <div
          ref={needleRef}
          className="needle"
          style={{ backgroundColor: getStatusColor() }}
        />
        <div className="needle-pivot" style={{ backgroundColor: getStatusColor() }} />
      </div>
      <div className="cents-display" style={{ color: getStatusColor() }}>
        {isActive ? `${cents > 0 ? '+' : ''}${cents} cents` : '---'}
      </div>
    </div>
  )
}
