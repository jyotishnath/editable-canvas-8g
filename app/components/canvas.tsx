"use client"

import type React from "react"

import { useRef, useState, useCallback, useEffect } from "react"
import { useCanvas } from "../context/canvas-context"
import { DraggableElement } from "./draggable-element"
import { ContextMenu } from "./context-menu"
import { DrawingCanvas } from "./drawing-canvas"

export function Canvas() {
  const { state, dispatch } = useCanvas()
  const canvasRef = useRef<HTMLDivElement>(null)
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    elementId: string
  } | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  // Keyboard event handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete selected element
      if (e.key === "Delete" && state.selectedElementId) {
        dispatch({ type: "DELETE_ELEMENT", id: state.selectedElementId })
        return
      }

      // Undo
      if (e.ctrlKey && e.key === "z") {
        e.preventDefault()
        dispatch({ type: "UNDO" })
        return
      }

      // Move selected element with arrow keys
      if (state.selectedElementId && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault()
        const selectedElement = state.elements.find((el) => el.id === state.selectedElementId)
        if (selectedElement) {
          const moveDistance = e.shiftKey ? 10 : 1
          let newX = selectedElement.x
          let newY = selectedElement.y

          switch (e.key) {
            case "ArrowUp":
              newY = Math.max(0, selectedElement.y - moveDistance)
              break
            case "ArrowDown":
              newY = selectedElement.y + moveDistance
              break
            case "ArrowLeft":
              newX = Math.max(0, selectedElement.x - moveDistance)
              break
            case "ArrowRight":
              newX = selectedElement.x + moveDistance
              break
          }

          dispatch({ type: "MOVE_ELEMENT", id: state.selectedElementId, x: newX, y: newY })
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [state.selectedElementId, state.elements, dispatch])

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === canvasRef.current) {
        dispatch({ type: "SELECT_ELEMENT", id: null })
      }
      setContextMenu(null)
    },
    [dispatch],
  )

  const handleContextMenu = useCallback((e: React.MouseEvent, elementId: string) => {
    e.preventDefault()
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      elementId,
    })
  }, [])

  const backgroundStyle =
    state.canvasBackground.type === "image"
      ? {
          backgroundImage: `url(${state.canvasBackground.value})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : { backgroundColor: state.canvasBackground.value }

  return (
    <div className="flex-1 p-4 overflow-auto">
      <div
        ref={canvasRef}
        className="relative w-full h-full min-h-[600px] border-2 border-dashed border-gray-300 rounded-lg"
        style={backgroundStyle}
        onClick={handleCanvasClick}
        tabIndex={0} // Make canvas focusable for keyboard events
      >
        {/* Drawing Canvas Layer */}
        {isDrawing && <DrawingCanvas />}

        {state.elements
          .sort((a, b) => a.zIndex - b.zIndex)
          .map((element) => (
            <DraggableElement
              key={element.id}
              element={element}
              isSelected={state.selectedElementId === element.id}
              onContextMenu={(e) => handleContextMenu(e, element.id)}
            />
          ))}

        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            elementId={contextMenu.elementId}
            onClose={() => setContextMenu(null)}
          />
        )}
      </div>

      {/* Drawing Mode Toggle */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setIsDrawing(!isDrawing)}
          className={`px-4 py-2 rounded-lg ${isDrawing ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
        >
          {isDrawing ? "Exit Drawing Mode" : "Enter Drawing Mode"}
        </button>
      </div>
    </div>
  )
}
