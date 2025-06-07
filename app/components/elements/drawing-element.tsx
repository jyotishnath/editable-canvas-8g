import type { CanvasElement } from "../../context/canvas-context"

interface DrawingElementProps {
  element: CanvasElement
}

export function DrawingElement({ element }: DrawingElementProps) {
  const { pathData, strokeColor, strokeWidth, drawingTool, opacity = 1 } = element.properties

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${element.width} ${element.height}`}>
      <path
        d={pathData}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacity}
        filter={drawingTool === "brush" ? `drop-shadow(0 0 ${strokeWidth / 2}px ${strokeColor})` : "none"}
      />
    </svg>
  )
}
