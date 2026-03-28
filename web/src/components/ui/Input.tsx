type InputProps = {
  label?: string
  error?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id || props.name
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="label-text block">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full bg-transparent border-0 border-b border-umber/20 font-body text-body text-umber py-3 placeholder:text-taupe focus:border-terracotta focus:outline-none transition-colors duration-200 ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-terracotta">{error}</p>}
    </div>
  )
}
