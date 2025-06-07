import type { CanvasElement } from "../../context/canvas-context"

interface ShapeElementProps {
  element: CanvasElement
}

export function ShapeElement({ element }: ShapeElementProps) {
  const { shapeType, backgroundColor, backgroundOpacity = 1, borderColor, borderWidth = 2 } = element.properties

  const renderShape = () => {
    // Convert hex color to rgba for opacity support
    const hexToRgba = (hex: string, opacity: number) => {
      const r = Number.parseInt(hex.slice(1, 3), 16)
      const g = Number.parseInt(hex.slice(3, 5), 16)
      const b = Number.parseInt(hex.slice(5, 7), 16)
      return `rgba(${r}, ${g}, ${b}, ${opacity})`
    }

    const style = {
      backgroundColor:
        backgroundColor === "transparent" ? "transparent" : hexToRgba(backgroundColor, backgroundOpacity),
      border: `${borderWidth}px solid ${borderColor}`,
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
                height: `${borderWidth}px`,
                backgroundColor: borderColor,
                opacity: backgroundOpacity,
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
