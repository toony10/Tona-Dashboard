import "@/styles/HtmlContent.css"

export interface HtmlContentProps {
  content: string
}

export function HtmlContent({ content }: HtmlContentProps) {
  if (!content) return null

  return (
    <div
      className="html-content"
      dangerouslySetInnerHTML={ { __html: content } }
    />
  )
}
