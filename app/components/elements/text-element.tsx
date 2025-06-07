import type { CanvasElement } from "../../context/canvas-context"

interface TextElementProps {
  element: CanvasElement
}

export function TextElement({ element }: TextElementProps) {
  const { text, fontSize, fontWeight, color, fontFamily } = element.properties

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{
        fontSize: `${fontSize}px`,
        fontWeight,
        color,
        fontFamily,
      }}
    >
      {text}
    </div>
  )
}
