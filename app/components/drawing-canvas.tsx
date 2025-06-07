"use client"

import type React from "react"

import { useRef, useState, useCallback } from "react"
import { useCanvas } from "../context/canvas-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Palette, Edit3 } from "lucide-react"

export function DrawingCanvas() {
  const { dispatch } = useCanvas()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([])
  const [drawingTool, setDrawingTool] = useState<"pencil" | "brush">("pencil")
  const [strokeColor, setStrokeColor] = useState("#000000")
  const [strokeWidth, setStrokeWidth] = useState(2)
  const [brushOpacity, setBrushOpacity] = useState(1)

  const startDrawing = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
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
        ctx.strokeStyle = strokeColor
        ctx.lineWidth = strokeWidth
        ctx.lineCap = drawingTool === "brush" ? "round" : "round"
        ctx.lineJoin = "round"
        ctx.globalAlpha = brushOpacity

        // Different drawing styles for pencil vs brush
        if (drawingTool === "brush") {
          ctx.shadowColor = strokeColor
          ctx.shadowBlur = strokeWidth / 2
        } else {
          ctx.shadowBlur = 0
        }
      }
    },
    [strokeColor, strokeWidth, drawingTool, brushOpacity],
  )

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
      opacity: brushOpacity,
      properties: {
        pathData,
        strokeColor,
        strokeWidth,
        drawingTool,
        opacity: brushOpacity,
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
  }, [isDrawing, currentPath, dispatch, strokeColor, strokeWidth, drawingTool, brushOpacity])

  return (
    <div className="absolute inset-0 w-full h-full">
      {/* Drawing Controls */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 z-10 space-y-4">
        <div className="flex items-center space-x-2">
          <Edit3 className="w-4 h-4" />
          <span className="font-medium">Drawing Tools</span>
        </div>

        <div>
          <Label htmlFor="drawing-tool">Tool</Label>
          <Select value={drawingTool} onValueChange={(value: "pencil" | "brush") => setDrawingTool(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pencil">Pencil</SelectItem>
              <SelectItem value="brush">Brush</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="stroke-color">Color</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="stroke-color"
              type="color"
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
              className="w-12 h-8 p-1"
            />
            <Palette className="w-4 h-4 text-gray-500" />
          </div>
        </div>

        <div>
          <Label htmlFor="stroke-width">Size: {strokeWidth}px</Label>
          <Input
            id="stroke-width"
            type="range"
            min="1"
            max="50"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="brush-opacity">Opacity: {Math.round(brushOpacity * 100)}%</Label>
          <Input
            id="brush-opacity"
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={brushOpacity}
            onChange={(e) => setBrushOpacity(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="text-xs text-gray-500">
          <p>
            <strong>{drawingTool === "pencil" ? "Pencil" : "Brush"}:</strong>
          </p>
          <p>{drawingTool === "pencil" ? "Sharp, precise lines" : "Soft, blended strokes"}</p>
        </div>
      </div>

      {/* Drawing Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-auto"
        width={800}
        height={600}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{
          cursor:
            drawingTool === "pencil"
              ? "crosshair"
              : 'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="none" stroke="black" strokeWidth="2"/></svg>\') 10 10, auto',
        }}
      />
    </div>
  )
}
