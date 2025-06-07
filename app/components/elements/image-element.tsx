import type { CanvasElement } from "../../context/canvas-context"

interface ImageElementProps {
  element: CanvasElement
}

export function ImageElement({ element }: ImageElementProps) {
  const { src } = element.properties

  return (
    <img
      src={src || "/placeholder.svg"}
      alt="Canvas element"
      className="w-full h-full object-cover rounded"
      draggable={false}
    />
  )
}
