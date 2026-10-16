import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { WnuckiMark } from '../../components/wnucki/mark'
import { variety } from '../../components/wnucki/variety'
import { fetchWnucki, type WnuckiPersona } from '../../services/personaService'
import './page.css'

export default function WnuckiPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [personas, setPersonas] = useState<WnuckiPersona[] | null>(null)
  const [failed, setFailed] = useState(false)
  const current = params.get('persona')?.trim().toLowerCase() ?? ''
  const focus = params.get('focus')?.trim().toLowerCase() ?? ''

  useEffect(() => {
    let cancelled = false
    fetchWnucki()
      .then(list => {
        if (!cancelled) setPersonas(list)
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!focus || !personas) return
    document
      .getElementById(`wnuck-${focus}`)
      ?.scrollIntoView({ block: 'center' })
  }, [focus, personas])

  const choose = (slug: string) => {
    navigate(`/?persona=${encodeURIComponent(slug)}`)
  }

  return (
    <div className='wnucki-page'>
      <h1>wnučki</h1>
      <p className='wnucki-lead'>
        Wuzwol sej jednoho. Potom móžeš z nim rěčeć.
      </p>
      {failed ? (
        <p className='wnucki-status'>Wnučki njedadźa so pokazać.</p>
      ) : null}
      {personas && personas.length === 0 ? (
        <p className='wnucki-status'>Žane wnučki.</p>
      ) : null}
      <div className='wnucki-pile'>
        {personas?.map(persona => {
          const tilt = (variety(persona.slug, 2) * 16 - 8).toFixed(1)
          const rise = Math.round(variety(persona.slug, 8) * 28)
          const active = persona.slug === current
          return (
            <button
              key={persona.slug}
              id={`wnuck-${persona.slug}`}
              type='button'
              className={active ? 'wnucki-card is-active' : 'wnucki-card'}
              style={{
                ['--tilt' as string]: `${tilt}deg`,
                ['--rise' as string]: `${rise}px`,
              }}
              onClick={() => choose(persona.slug)}
            >
              <WnuckiMark persona={persona} size={108} large />
              {persona.hasImage ? (
                <span className='wnucki-card-name'>
                  {persona.name}
                  {active ? ' · aktiwny' : ''}
                </span>
              ) : active ? (
                <span className='wnucki-card-name'>aktiwny</span>
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}
