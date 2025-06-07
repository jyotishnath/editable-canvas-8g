"use client"

import type React from "react"

import { useRef, useState, useCallback } from "react"
import { useCanvas } from "../context/canvas-context"

export function DrawingCanvas() {
  const { dispatch } = useCanvas()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([])

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDrawing(true)
    setCurrentPath([{ x, y }])

    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.beginPath()
      ctx.moveTo(x, y)
    }
  }, [])

  const draw = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return

      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      setCurrentPath((prev) => [...prev, { x, y }])

      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.lineTo(x, y)
        ctx.stroke()
      }
    },
    [isDrawing],
  )

  const stopDrawing = useCallback(() => {
    if (!isDrawing || currentPath.length < 2) return

    // Convert drawing to SVG path and add as element
    const pathData = currentPath.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ")

    const minX = Math.min(...currentPath.map((p) => p.x))
    const minY = Math.min(...currentPath.map((p) => p.y))
    const maxX = Math.max(...currentPath.map((p) => p.x))
    const maxY = Math.max(...currentPath.map((p) => p.y))

    const element = {
      id: `drawing-${Date.now()}`,
      type: "drawing" as const,
      x: minX,
      y: minY,
      width: maxX - minX + 10,
      height: maxY - minY + 10,
      zIndex: 0,
      properties: {
        pathData,
        strokeColor: "#000000",
        strokeWidth: 2,
      },
    }

    dispatch({ type: "ADD_ELEMENT", element })

    // Clear canvas
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }

    setIsDrawing(false)
    setCurrentPath([])
  }, [isDrawing, currentPath, dispatch])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      width={800}
      height={600}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      style={{ cursor: "crosshair" }}
    />
  )
}
