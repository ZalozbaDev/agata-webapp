import React, { useRef } from 'react'
import { Box } from '@mui/material'

interface SpellCheckedInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  placeholder?: string
  disabled?: boolean
  autoFocus?: boolean
  style?: React.CSSProperties
}

export const SpellCheckedInput: React.FC<SpellCheckedInputProps> = ({
  value,
  onChange,
  onKeyDown,
  placeholder = 'Zapodaj tule swoje prašenje ...',
  disabled = false,
  autoFocus = false,
  style,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const renderInputWithSpellChecking = () => {
    return (
      <Box sx={{ position: 'relative', width: '100%' }}>
        <input
          ref={inputRef}
          type='text'
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          autoComplete='off'
          style={{
            ...style,
            width: '100%',
            boxSizing: 'border-box',
          }}
        />
      </Box>
    )
  }

  return <>{renderInputWithSpellChecking()}</>
}
