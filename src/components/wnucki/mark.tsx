import { useState } from 'react'
import { personaImageUrl } from '../../services/personaService'
import { stickerColor, variety } from './variety'
import type { WnuckiPersona } from '../../services/personaService'
import './marks.css'

export function WnuckiMark({
  persona,
  size,
  large = false,
}: {
  persona: WnuckiPersona
  size: number
  large?: boolean
}) {
  const [broken, setBroken] = useState(false)
  const tilt = `${(variety(persona.slug, 11) * 10 - 5).toFixed(1)}deg`

  if (!persona.hasImage || broken) {
    return (
      <span
        className={large ? 'wnucki-banner wnucki-banner--large' : 'wnucki-banner'}
        style={{ background: stickerColor(persona.slug), ['--tilt' as string]: tilt }}
      >
        {persona.name}
      </span>
    )
  }

  return (
    <img
      className={large ? 'wnucki-photo wnucki-photo--large' : 'wnucki-photo'}
      src={personaImageUrl(persona.slug)}
      alt=''
      draggable={false}
      style={{ height: size, ['--tilt' as string]: tilt }}
      onError={() => setBroken(true)}
    />
  )
}
