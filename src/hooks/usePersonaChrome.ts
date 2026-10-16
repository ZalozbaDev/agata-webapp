import { useEffect, useState } from 'react'
import { DEFAULT_PERSONA_ID, DEFAULT_SPEAKER_ID, getPersonaId } from '../config/persona'
import {
  fetchPersonaAppearance,
  type PersonaDocumentLanguage,
} from '../services/personaService'

/**
 * Upper Sorbian personas keep Agata's mouth, the microphone, and spoken answers.
 * German and Lower Sorbian personas stay silent.
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
    readAnswers: upperSorbian,
    lipsync: upperSorbian,
    showMicrophone: upperSorbian,
    showPuppet: upperSorbian || hasImage,
    showSidebar: isMainPersona,
  }
}
