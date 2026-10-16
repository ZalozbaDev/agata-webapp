import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchWnucki, type WnuckiPersona } from '../../services/personaService'
import { WnuckiMark } from './mark'
import {
  WNUCKI_HEADER_LIMIT,
  pickerHref,
  variety,
  walkDuration,
} from './variety'
import './parade.css'

function useContentWidth<T extends HTMLElement>(
  active: boolean,
): [React.RefObject<T | null>, number] {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const element = ref.current
    if (!active || !element) return
    const measure = () => {
      const next = Math.round(element.offsetWidth)
      setWidth(current => (current === next ? current : next))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [active])

  return [ref, width]
}

export function WnuckiParade() {
  const [params] = useSearchParams()
  const [personas, setPersonas] = useState<WnuckiPersona[] | null>(null)
  const ready = Boolean(personas && personas.length > 0)
  const [laneRef, laneWidth] = useContentWidth<HTMLDivElement>(ready)

  useEffect(() => {
    let cancelled = false
    fetchWnucki()
      .then(list => {
        if (!cancelled) setPersonas(list)
      })
      .catch(() => {
        if (!cancelled) setPersonas([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (!personas || personas.length === 0) return null

  const shown = personas
    .filter(persona => persona.showOnMain)
    .slice(0, WNUCKI_HEADER_LIMIT)
  const hasMore = personas.length > shown.length
  const current = params.get('persona')

  if (shown.length === 0 && !hasMore) return null

  return (
    <>
      {shown.length > 0 ? (
        <div className='wnucki-lane' ref={laneRef}>
          {shown.map((persona, index) => (
            <WnuckiWalker
              key={persona.slug}
              persona={persona}
              laneWidth={laneWidth}
              href={pickerHref(current, persona.slug)}
              pace={shown.length <= 1 ? 0.5 : index / (shown.length - 1)}
            />
          ))}
        </div>
      ) : null}
      {hasMore ? (
        <Link
          className='wnucki-all'
          to={pickerHref(current)}
          aria-label='wjace wnučki'
        >
          wnučki
        </Link>
      ) : null}
    </>
  )
}

function WnuckiWalker({
  persona,
  laneWidth,
  href,
  pace,
}: {
  persona: WnuckiPersona
  laneWidth: number
  href: string
  pace: number
}) {
  const [walkerRef, walkerWidth] = useContentWidth<HTMLAnchorElement>(true)
  const ground = variety(persona.slug, 7)
  const size = 30 + Math.round(variety(persona.slug, 5) * 16)
  const travel = Math.max(laneWidth - walkerWidth, 0)
  const measured = laneWidth > 0 && walkerWidth > 0 && travel > 0
  const duration = measured ? walkDuration(travel, pace) : 0

  return (
    <Link
      ref={walkerRef}
      to={href}
      className={measured ? 'wnucki-walker is-walking' : 'wnucki-walker'}
      aria-label={persona.name}
      title={persona.name}
      style={{
        ['--dur' as string]: `${duration.toFixed(2)}s`,
        ['--delay' as string]: `${(-variety(persona.slug, 1) * duration).toFixed(2)}s`,
        ['--bob' as string]: `${(0.48 + pace * 0.36).toFixed(2)}s`,
        ['--ground' as string]: `${Math.round(ground * 14)}px`,
        ['--layer' as string]: String(
          1 + Math.floor(variety(persona.slug, 4) * 2),
        ),
        ['--rest' as string]: `${Math.round(8 + variety(persona.slug, 6) * 70)}%`,
      }}
    >
      <span className='wnucki-bob'>
        <WnuckiMark persona={persona} size={size} />
      </span>
    </Link>
  )
}
