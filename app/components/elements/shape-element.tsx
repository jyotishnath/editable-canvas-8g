import type { CanvasElement } from "../../context/canvas-context"

interface ShapeElementProps {
  element: CanvasElement
}

export function ShapeElement({ element }: ShapeElementProps) {
  const { shapeType, backgroundColor, borderColor } = element.properties

  const renderShape = () => {
    const style = {
      backgroundColor,
      border: `2px solid ${borderColor}`,
      width: "100%",
      height: "100%",
    }

    switch (shapeType) {
      case "circle":
        return <div className="rounded-full" style={style} />
      case "square":
        return <div style={style} />
      case "oval":
        return <div className="rounded-full" style={{ ...style, borderRadius: "50%" }} />
      case "line":
        return (
          <div className="w-full h-full flex items-center">
            <div
              style={{
                width: "100%",
                height: "2px",
                backgroundColor: borderColor,
              }}
            />
          </div>
        )
      default:
        return <div style={style} />
    }
  }

  return renderShape()
}
