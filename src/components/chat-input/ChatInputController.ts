// src/components/chat-input/ChatInputController.ts
let setInputValue: ((value: string) => void) | null = null

export function registerInputSetter(setter: (value: string) => void) {
  setInputValue = setter
}

export function updateInputValue(newValue: string) {
  if (setInputValue) {
    setInputValue(newValue)
  } else {
    console.warn("Input setter wurde noch nicht registriert.")
  }
}
