import { Button } from './Button'

type SectionHeaderProps = {
  title: string
  linkText?: string
  linkHref?: string
  overline?: string
}

export function SectionHeader({ title, linkText, linkHref, overline }: SectionHeaderProps) {
  return (
    <div className="flex justify-between items-end mb-8 lg:mb-12">
      <div>
        {overline && <p className="label-text mb-3">{overline}</p>}
        <h2 className="font-display text-display-md text-umber">{title}</h2>
      </div>
      {linkText && linkHref && (
        <Button variant="text" href={linkHref}>
          {linkText}
        </Button>
      )}
    </div>
  )
}
