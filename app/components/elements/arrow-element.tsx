import type { CanvasElement } from "../../context/canvas-context"

interface ArrowElementProps {
  element: CanvasElement
}

export function ArrowElement({ element }: ArrowElementProps) {
  const { borderColor, backgroundColor, direction } = element.properties

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg width="100%" height="100%" viewBox="0 0 100 100" className="max-w-full max-h-full">
        <defs>
          <marker id={`arrowhead-${element.id}`} markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill={borderColor} />
          </marker>
        </defs>
        <line
          x1="10"
          y1="50"
          x2="90"
          y2="50"
          stroke={borderColor}
          strokeWidth="3"
          markerEnd={`url(#arrowhead-${element.id})`}
        />
        {backgroundColor !== "transparent" && <rect x="10" y="47" width="80" height="6" fill={backgroundColor} />}
      </svg>
    </div>
  )
}
