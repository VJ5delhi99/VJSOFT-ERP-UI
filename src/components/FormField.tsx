import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

interface BaseFieldProps {
  label: string
  error?: string
  helperText?: string
  registration?: UseFormRegisterReturn
}

type InputFieldProps = BaseFieldProps & InputHTMLAttributes<HTMLInputElement>
type SelectFieldProps = BaseFieldProps & SelectHTMLAttributes<HTMLSelectElement>
type TextareaFieldProps = BaseFieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>

export function InputField({ label, error, helperText, registration, ...props }: InputFieldProps) {
  const { ref, ...registrationProps } = registration || {}

  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <input className="input" ref={ref} {...registrationProps} {...props} />
      {error ? <span className="field__error">{error}</span> : helperText ? <span className="field__helper">{helperText}</span> : null}
    </label>
  )
}

export function SelectField({ label, error, helperText, children, registration, ...props }: SelectFieldProps) {
  const { ref, ...registrationProps } = registration || {}

  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <select className="select" ref={ref} {...registrationProps} {...props}>
        {children}
      </select>
      {error ? <span className="field__error">{error}</span> : helperText ? <span className="field__helper">{helperText}</span> : null}
    </label>
  )
}

export function TextAreaField({ label, error, helperText, registration, ...props }: TextareaFieldProps) {
  const { ref, ...registrationProps } = registration || {}

  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <textarea className="textarea" ref={ref} {...registrationProps} {...props} />
      {error ? <span className="field__error">{error}</span> : helperText ? <span className="field__helper">{helperText}</span> : null}
    </label>
  )
}
