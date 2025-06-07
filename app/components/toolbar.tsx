"use client"

import { useCanvas } from "../context/canvas-context"
import { Button } from "@/components/ui/button"
import { Type, ArrowRight, Circle, Square, Minus, Undo, Upload } from "lucide-react"

export function Toolbar() {
  const { state, dispatch } = useCanvas()

  const addTextElement = () => {
    const element = {
      id: `text-${Date.now()}`,
      type: "text" as const,
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      zIndex: 0,
      properties: {
        text: "New Text",
        fontSize: 16,
        fontWeight: "normal",
        color: "#000000",
        fontFamily: "Arial",
      },
    }
    dispatch({ type: "ADD_ELEMENT", element })
  }

  const addMultipleImages = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.multiple = true // Enable multiple file selection
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || [])
      if (files.length > 0) {
        const elements: any[] = []
        let processedCount = 0

        files.forEach((file, index) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            const element = {
              id: `image-${Date.now()}-${index}`,
              type: "image" as const,
              x: 100 + index * 20, // Offset each image slightly
              y: 100 + index * 20,
              width: 200,
              height: 150,
              zIndex: 0,
              properties: {
                src: e.target?.result as string,
              },
            }
            elements.push(element)
            processedCount++

            // When all files are processed, add them all at once
            if (processedCount === files.length) {
              dispatch({ type: "ADD_MULTIPLE_ELEMENTS", elements })
            }
          }
          reader.readAsDataURL(file)
        })
      }
    }
    input.click()
  }

  const addArrowElement = () => {
    const element = {
      id: `arrow-${Date.now()}`,
      type: "arrow" as const,
      x: 100,
      y: 100,
      width: 100,
      height: 50,
      zIndex: 0,
      properties: {
        borderColor: "#000000",
        backgroundColor: "transparent",
        direction: "right",
      },
    }
    dispatch({ type: "ADD_ELEMENT", element })
  }

  const addShapeElement = (shapeType: string) => {
    const element = {
      id: `shape-${Date.now()}`,
      type: "shape" as const,
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      zIndex: 0,
      properties: {
        shapeType,
        backgroundColor: "#ffffff",
        borderColor: "#000000",
      },
    }
    dispatch({ type: "ADD_ELEMENT", element })
  }

  const handleUndo = () => {
    dispatch({ type: "UNDO" })
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Elements</h2>

      {/* Undo Button */}
      <Button
        onClick={handleUndo}
        className="w-full justify-start"
        variant="outline"
        disabled={state.historyIndex <= 0}
      >
        <Undo className="w-4 h-4 mr-2" />
        Undo (Ctrl+Z)
      </Button>

      <div className="space-y-2">
        <Button onClick={addTextElement} className="w-full justify-start" variant="outline">
          <Type className="w-4 h-4 mr-2" />
          Add Text
        </Button>

        <Button onClick={addMultipleImages} className="w-full justify-start" variant="outline">
          <Upload className="w-4 h-4 mr-2" />
          Upload Images
        </Button>

        <Button onClick={addArrowElement} className="w-full justify-start" variant="outline">
          <ArrowRight className="w-4 h-4 mr-2" />
          Add Arrow
        </Button>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Shapes</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={() => addShapeElement("circle")} variant="outline" size="sm">
            <Circle className="w-4 h-4" />
          </Button>
          <Button onClick={() => addShapeElement("square")} variant="outline" size="sm">
            <Square className="w-4 h-4" />
          </Button>
          <Button onClick={() => addShapeElement("oval")} variant="outline" size="sm">
            <Circle className="w-4 h-4" />
          </Button>
          <Button onClick={() => addShapeElement("line")} variant="outline" size="sm">
            <Minus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="text-xs text-gray-500 space-y-1">
        <p>
          <strong>Keyboard Shortcuts:</strong>
        </p>
        <p>• Delete: Remove selected element</p>
        <p>• Arrow keys: Move selected element</p>
        <p>• Shift + Arrow: Move faster</p>
        <p>• Ctrl + Z: Undo</p>
      </div>
    </div>
  )
}
