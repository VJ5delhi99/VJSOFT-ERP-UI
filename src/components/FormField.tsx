import { useId, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
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
  const generatedId = useId()
  const fieldId = props.id || registration?.name || generatedId
  const describedBy = error ? `${fieldId}-error` : helperText ? `${fieldId}-helper` : undefined
  const { ref, ...registrationProps } = registration || {}

  return (
    <div className="field">
      <label className="field__label" htmlFor={fieldId}>
        {label}
      </label>
      <input className="input" id={fieldId} aria-invalid={Boolean(error)} aria-describedby={describedBy} ref={ref} {...registrationProps} {...props} />
      {error ? (
        <span className="field__error" id={`${fieldId}-error`}>
          {error}
        </span>
      ) : helperText ? (
        <span className="field__helper" id={`${fieldId}-helper`}>
          {helperText}
        </span>
      ) : null}
    </div>
  )
}

export function SelectField({ label, error, helperText, children, registration, ...props }: SelectFieldProps) {
  const generatedId = useId()
  const fieldId = props.id || registration?.name || generatedId
  const describedBy = error ? `${fieldId}-error` : helperText ? `${fieldId}-helper` : undefined
  const { ref, ...registrationProps } = registration || {}

  return (
    <div className="field">
      <label className="field__label" htmlFor={fieldId}>
        {label}
      </label>
      <select className="select" id={fieldId} aria-invalid={Boolean(error)} aria-describedby={describedBy} ref={ref} {...registrationProps} {...props}>
        {children}
      </select>
      {error ? (
        <span className="field__error" id={`${fieldId}-error`}>
          {error}
        </span>
      ) : helperText ? (
        <span className="field__helper" id={`${fieldId}-helper`}>
          {helperText}
        </span>
      ) : null}
    </div>
  )
}

export function TextAreaField({ label, error, helperText, registration, ...props }: TextareaFieldProps) {
  const generatedId = useId()
  const fieldId = props.id || registration?.name || generatedId
  const describedBy = error ? `${fieldId}-error` : helperText ? `${fieldId}-helper` : undefined
  const { ref, ...registrationProps } = registration || {}

  return (
    <div className="field">
      <label className="field__label" htmlFor={fieldId}>
        {label}
      </label>
      <textarea
        className="textarea"
        id={fieldId}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        ref={ref}
        {...registrationProps}
        {...props}
      />
      {error ? (
        <span className="field__error" id={`${fieldId}-error`}>
          {error}
        </span>
      ) : helperText ? (
        <span className="field__helper" id={`${fieldId}-helper`}>
          {helperText}
        </span>
      ) : null}
    </div>
  )
}
