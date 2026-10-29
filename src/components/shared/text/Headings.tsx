import { cn } from "@/lib/utils"

export interface HeadingProps {
  title: string
  description?: string
  className?: string
}

export function MainH({ title, description, className }: HeadingProps) {
  return (
    <div className={ cn("space-y-1 text-center", className) }>
      <h1 className="font-heading text-[1.625rem] leading-tight font-semibold tracking-tight">
        { title }
      </h1>
      { description ? (
        <p className="text-sm text-muted-foreground">{ description }</p>
      ) : null }
    </div>
  )
}

export function SectionH({ title, description, className }: HeadingProps) {
  return (
    <div className={ cn("space-y-1 text-start", className) }>
      <h2 className="font-heading text-lg font-semibold tracking-tight">
        { title }
      </h2>
      { description ? (
        <p className="text-sm text-muted-foreground">{ description }</p>
      ) : null }
    </div>
  )
}
