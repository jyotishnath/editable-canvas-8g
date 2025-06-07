"use client"

import React from "react"

import { useRef, useState, useCallback } from "react"
import { useCanvas, type CanvasElement } from "../context/canvas-context"
import { TextElement } from "./elements/text-element"
import { ImageElement } from "./elements/image-element"
import { ArrowElement } from "./elements/arrow-element"
import { ShapeElement } from "./elements/shape-element"
import { DrawingElement } from "./elements/drawing-element"

interface DraggableElementProps {
  element: CanvasElement
  isSelected: boolean
  onContextMenu: (e: React.MouseEvent) => void
}

export function DraggableElement({ element, isSelected, onContextMenu }: DraggableElementProps) {
  const { dispatch } = useCanvas()
  const elementRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return // Only left click

      e.preventDefault()
      e.stopPropagation()

      dispatch({ type: "SELECT_ELEMENT", id: element.id })

      const rect = elementRef.current?.getBoundingClientRect()
      if (!rect) return

      const isResizeHandle = (e.target as HTMLElement).classList.contains("resize-handle")

      if (isResizeHandle) {
        setIsResizing(true)
      } else {
        setIsDragging(true)
        setDragStart({
          x: e.clientX - element.x,
          y: e.clientY - element.y,
        })
      }
    },
    [dispatch, element.id, element.x, element.y],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.x
        const newY = e.clientY - dragStart.y
        dispatch({ type: "MOVE_ELEMENT", id: element.id, x: Math.max(0, newX), y: Math.max(0, newY) })
      } else if (isResizing) {
        const rect = elementRef.current?.getBoundingClientRect()
        if (rect) {
          const newWidth = Math.max(20, e.clientX - rect.left)
          const newHeight = Math.max(20, e.clientY - rect.top)
          dispatch({ type: "RESIZE_ELEMENT", id: element.id, width: newWidth, height: newHeight })
        }
      }
    },
    [isDragging, isResizing, dragStart, dispatch, element.id],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsResizing(false)
  }, [])

  // Add event listeners
  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp])

  const renderElement = () => {
    switch (element.type) {
      case "text":
        return <TextElement element={element} />
      case "image":
        return <ImageElement element={element} />
      case "arrow":
        return <ArrowElement element={element} />
      case "shape":
        return <ShapeElement element={element} />
      case "drawing":
        return <DrawingElement element={element} />
      default:
        return null
    }
  }

  return (
    <div
      ref={elementRef}
      className={`absolute cursor-move select-none ${isSelected ? "ring-2 ring-blue-500" : ""}`}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        zIndex: element.zIndex,
        opacity: element.opacity, // Add opacity styling
      }}
      onMouseDown={handleMouseDown}
      onContextMenu={onContextMenu}
    >
      {renderElement()}

      {isSelected && (
        <>
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full cursor-nw-resize resize-handle" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full cursor-ne-resize resize-handle" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 rounded-full cursor-sw-resize resize-handle" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full cursor-se-resize resize-handle" />
        </>
      )}
    </div>
  )
}
