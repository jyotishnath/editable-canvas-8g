"use client"

import { useCanvas } from "../context/canvas-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Palette } from "lucide-react"

export function PropertyPanel() {
  const { state, dispatch } = useCanvas()
  const selectedElement = state.elements.find((el) => el.id === state.selectedElementId)

  const updateElementProperty = (property: string, value: any) => {
    if (!selectedElement) return
    dispatch({
      type: "UPDATE_ELEMENT",
      id: selectedElement.id,
      updates: {
        properties: {
          ...selectedElement.properties,
          [property]: value,
        },
      },
    })
  }

  const updateElementOpacity = (opacity: number) => {
    if (!selectedElement) return
    dispatch({
      type: "UPDATE_ELEMENT",
      id: selectedElement.id,
      updates: { opacity },
    })
  }

  const deleteElement = () => {
    if (!selectedElement) return
    dispatch({ type: "DELETE_ELEMENT", id: selectedElement.id })
  }

  const handleCanvasBackgroundChange = (type: "color" | "image", value: string) => {
    dispatch({ type: "SET_CANVAS_BACKGROUND", background: { type, value } })
  }

  const handleImageUpload = (callback: (url: string) => void) => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          callback(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 space-y-6 overflow-y-auto">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Canvas Settings</h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="canvas-bg-color">Background Color</Label>
            <Input
              id="canvas-bg-color"
              type="color"
              value={state.canvasBackground.type === "color" ? state.canvasBackground.value : "#ffffff"}
              onChange={(e) => handleCanvasBackgroundChange("color", e.target.value)}
              className="w-full h-10"
            />
          </div>

          <div>
            <Label>Background Image</Label>
            <Button
              onClick={() => handleImageUpload((url) => handleCanvasBackgroundChange("image", url))}
              variant="outline"
              className="w-full"
            >
              Upload Image
            </Button>
          </div>
        </div>
      </div>

      {selectedElement && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Element Properties</h2>
            <Button onClick={deleteElement} variant="destructive" size="sm">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Universal Opacity Control */}
            <div>
              <Label htmlFor="element-opacity">Opacity: {Math.round((selectedElement.opacity || 1) * 100)}%</Label>
              <Input
                id="element-opacity"
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={selectedElement.opacity || 1}
                onChange={(e) => updateElementOpacity(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {selectedElement.type === "text" && (
              <>
                <div>
                  <Label htmlFor="text-content">Text</Label>
                  <Input
                    id="text-content"
                    value={selectedElement.properties.text}
                    onChange={(e) => updateElementProperty("text", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="font-size">Font Size</Label>
                  <Input
                    id="font-size"
                    type="number"
                    value={selectedElement.properties.fontSize}
                    onChange={(e) => updateElementProperty("fontSize", Number.parseInt(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="font-weight">Font Weight</Label>
                  <Select
                    value={selectedElement.properties.fontWeight}
                    onValueChange={(value) => updateElementProperty("fontWeight", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                      <SelectItem value="lighter">Light</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="text-color">Color</Label>
                  <Input
                    id="text-color"
                    type="color"
                    value={selectedElement.properties.color}
                    onChange={(e) => updateElementProperty("color", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="font-family">Font Family</Label>
                  <Select
                    value={selectedElement.properties.fontFamily}
                    onValueChange={(value) => updateElementProperty("fontFamily", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Verdana">Verdana</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {selectedElement.type === "arrow" && (
              <>
                <div>
                  <Label htmlFor="arrow-border-color">Border Color</Label>
                  <Input
                    id="arrow-border-color"
                    type="color"
                    value={selectedElement.properties.borderColor}
                    onChange={(e) => updateElementProperty("borderColor", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="arrow-bg-color">Background Color</Label>
                  <Input
                    id="arrow-bg-color"
                    type="color"
                    value={selectedElement.properties.backgroundColor}
                    onChange={(e) => updateElementProperty("backgroundColor", e.target.value)}
                  />
                </div>
              </>
            )}

            {selectedElement.type === "shape" && (
              <>
                <div>
                  <Label htmlFor="shape-bg-color">Background Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="shape-bg-color"
                      type="color"
                      value={selectedElement.properties.backgroundColor}
                      onChange={(e) => updateElementProperty("backgroundColor", e.target.value)}
                      className="flex-1"
                    />
                    <Palette className="w-4 h-4 text-gray-500" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="shape-bg-opacity">
                    Background Opacity: {Math.round((selectedElement.properties.backgroundOpacity || 1) * 100)}%
                  </Label>
                  <Input
                    id="shape-bg-opacity"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={selectedElement.properties.backgroundOpacity || 1}
                    onChange={(e) => updateElementProperty("backgroundOpacity", Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label htmlFor="shape-border-color">Border Color</Label>
                  <Input
                    id="shape-border-color"
                    type="color"
                    value={selectedElement.properties.borderColor}
                    onChange={(e) => updateElementProperty("borderColor", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="shape-border-width">
                    Border Width: {selectedElement.properties.borderWidth || 2}px
                  </Label>
                  <Input
                    id="shape-border-width"
                    type="range"
                    min="0"
                    max="20"
                    value={selectedElement.properties.borderWidth || 2}
                    onChange={(e) => updateElementProperty("borderWidth", Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </>
            )}

            {selectedElement.type === "drawing" && (
              <>
                <div>
                  <Label htmlFor="stroke-color">Stroke Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="stroke-color"
                      type="color"
                      value={selectedElement.properties.strokeColor}
                      onChange={(e) => updateElementProperty("strokeColor", e.target.value)}
                      className="flex-1"
                    />
                    <Palette className="w-4 h-4 text-gray-500" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="stroke-width">Stroke Width: {selectedElement.properties.strokeWidth}px</Label>
                  <Input
                    id="stroke-width"
                    type="range"
                    min="1"
                    max="50"
                    value={selectedElement.properties.strokeWidth}
                    onChange={(e) => updateElementProperty("strokeWidth", Number.parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  <strong>Tool:</strong> {selectedElement.properties.drawingTool === "pencil" ? "Pencil" : "Brush"}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
