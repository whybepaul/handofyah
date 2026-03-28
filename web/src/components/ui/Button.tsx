import Link from 'next/link'

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'text'
  href?: string
  children: React.ReactNode
  className?: string
  fullWidth?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export function Button({
  variant = 'primary',
  href,
  children,
  className = '',
  fullWidth,
  ...props
}: ButtonProps) {
  const base =
    variant === 'primary'
      ? 'btn-primary'
      : variant === 'secondary'
        ? 'btn-secondary'
        : 'btn-text'

  const widthClass = fullWidth ? 'w-full text-center' : ''
  const classes = `${base} ${widthClass} ${className}`.trim()

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
