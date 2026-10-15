import { useEffect, useState } from 'react'
import { DEFAULT_PERSONA_ID, getPersonaId } from '../config/persona'
import {
  fetchPersonaAppearance,
  type PersonaDocumentLanguage,
} from '../services/personaService'

/**
 * Upper Sorbian personas keep Agata, speech, and the microphone.
 * Any other language hides those, unless a custom image should stand in
 * for Agata. The left image sidebar belongs only to the main persona.
 */
export function usePersonaChrome() {
  const personaId = getPersonaId()
  const isMainPersona = personaId.trim().toLowerCase() === DEFAULT_PERSONA_ID
  const [language, setLanguage] = useState<PersonaDocumentLanguage | null>(
    isMainPersona ? 'hsb' : null,
  )
  const [hasImage, setHasImage] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchPersonaAppearance(personaId).then(appearance => {
      if (cancelled || !appearance) return
      setLanguage(appearance.language)
      setHasImage(appearance.hasImage)
    })
    return () => {
      cancelled = true
    }
  }, [personaId])

  const upperSorbian = language === 'hsb'
  return {
    isMainPersona,
    hasImage,
    speak: upperSorbian,
    showMicrophone: upperSorbian,
    showPuppet: upperSorbian || hasImage,
    showSidebar: isMainPersona,
  }
}
