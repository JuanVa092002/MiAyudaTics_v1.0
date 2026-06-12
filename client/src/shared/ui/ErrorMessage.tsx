interface ErrorMessageProps {
  message?: string
}

export default function ErrorMessage({ message }: ErrorMessageProps): React.ReactNode {
  if (!message) return null
  return (
    <span className="field-error" role="alert">
      <svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
        <path d="M6 0a6 6 0 1 0 0 12A6 6 0 0 0 6 0zm.75 8.5h-1.5v-1.5h1.5v1.5zm0-3h-1.5v-3h1.5v3z" />
      </svg>
      {message}
    </span>
  )
}
