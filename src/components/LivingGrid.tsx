import { useEffect, useRef } from 'react'

interface GridItem {
  id: string
  caption: string
  title: string
}

interface Props {
  items: GridItem[]
  onHover: (item: GridItem | null) => void
}

// 3 columns, each with its own scroll speed — creates a parallax depth effect
// matching the reference screenshot where columns scroll at different rates
const COLUMNS = [
  { speed: 38 },  // left column  — slowest
  { speed: 55 },  // middle column — medium
  { speed: 46 },  // right column  — fast
]

// How many tiles to stack per column (enough to fill 3× viewport height for seamless loop)
const TILES_PER_COL = 18

export default function LivingGrid({ items, onHover }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const colRefs = useRef<(HTMLDivElement | null)[]>([null, null, null])
  const rafRef = useRef<number>(0)
  const yRefs = useRef<number[]>([0, 0, 0])
  const lastTRef = useRef<number | null>(null)
  const pausedRef = useRef(false)
  const heightRef = useRef(0)

  // Build tile arrays per column — each column has its own image sequence offset
  const colTiles = COLUMNS.map((_, colIdx) =>
    Array.from({ length: TILES_PER_COL }, (_, i) =>
      items[(i + colIdx * 3) % items.length]
    )
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const measure = () => {
      // Each tile is a square = container width / 3
      const tileSize = container.clientWidth / COLUMNS.length
      heightRef.current = tileSize
    }

    measure()
    window.addEventListener('resize', measure, { passive: true })

    const tick = (ts: number) => {
      if (lastTRef.current === null) lastTRef.current = ts
      const dt = Math.min((ts - lastTRef.current) / 1000, 0.05) // cap dt to avoid jumps
      lastTRef.current = ts

      if (!pausedRef.current && heightRef.current > 0) {
        const tileH = heightRef.current

        COLUMNS.forEach((col, i) => {
          const el = colRefs.current[i]
          if (!el) return

          yRefs.current[i] -= col.speed * dt

          // One loop cycle = enough tiles to fill the seamless wrap point
          const loopAt = -(tileH * (TILES_PER_COL / 2))
          if (yRefs.current[i] <= loopAt) {
            yRefs.current[i] += loopAt * -1
          }

          el.style.transform = `translateY(${yRefs.current[i]}px)`
        })
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', measure)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${COLUMNS.length}, 1fr)`,
      }}
    >
      {COLUMNS.map((_, colIdx) => (
        <div
          key={colIdx}
          ref={(el) => { colRefs.current[colIdx] = el }}
          className="will-change-transform"
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          {colTiles[colIdx].map((item, tileIdx) => (
            <div
              key={`c${colIdx}-t${tileIdx}`}
              style={{
                backgroundImage: `url(/images/${item.id}.jpg)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                // square tiles: 100% of column width = 1/3 of container
                aspectRatio: '1 / 1',
                flexShrink: 0,
                position: 'relative',
                cursor: 'crosshair',
              }}
              onMouseEnter={() => { pausedRef.current = true; onHover(item) }}
              onMouseLeave={() => { pausedRef.current = false; onHover(null) }}
            >
              <span style={{
                position: 'absolute',
                bottom: 6,
                left: 8,
                fontSize: 9,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.65)',
                pointerEvents: 'none',
                textShadow: '0 1px 3px rgba(0,0,0,0.7)',
              }}>
                {item.caption}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
