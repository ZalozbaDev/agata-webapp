import { useEffect, useState } from 'react'
import { DEFAULT_PERSONA_ID, DEFAULT_SPEAKER_ID, getPersonaId } from '../config/persona'
import {
  fetchPersonaAppearance,
  type PersonaDocumentLanguage,
} from '../services/personaService'

/**
 * Upper Sorbian personas keep Agata's mouth and the microphone.
 * Every persona reads its answers aloud with its own Bamborak speaker.
 * The left image sidebar belongs only to the main persona.
 */
export function usePersonaChrome() {
  const personaId = getPersonaId()
  const isMainPersona = personaId.trim().toLowerCase() === DEFAULT_PERSONA_ID
  const [language, setLanguage] = useState<PersonaDocumentLanguage | null>(
    isMainPersona ? 'hsb' : null,
  )
  const [hasImage, setHasImage] = useState(false)
  const [speakerId, setSpeakerId] = useState(DEFAULT_SPEAKER_ID)

  useEffect(() => {
    let cancelled = false
    fetchPersonaAppearance(personaId).then(appearance => {
      if (cancelled || !appearance) return
      setLanguage(appearance.language)
      setHasImage(appearance.hasImage)
      setSpeakerId(appearance.speakerId?.trim() || DEFAULT_SPEAKER_ID)
    })
    return () => {
      cancelled = true
    }
  }, [personaId])

  const upperSorbian = language === 'hsb'
  return {
    isMainPersona,
    hasImage,
    speakerId,
    readAnswers: true,
    lipsync: upperSorbian,
    showMicrophone: upperSorbian,
    showPuppet: upperSorbian || hasImage,
    showSidebar: isMainPersona,
  }
}
