"use client"
import { Canvas } from "./components/canvas"
import { Toolbar } from "./components/toolbar"
import { PropertyPanel } from "./components/property-panel"
import { CanvasProvider } from "./context/canvas-context"

export default function CanvasEditor() {
  return (
    <CanvasProvider>
      <div className="h-screen flex flex-col bg-gray-50">
        <header className="bg-white border-b border-gray-200 p-4">
          <h1 className="text-2xl font-bold text-gray-900">Canvas Editor</h1>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <Toolbar />
          <div className="flex-1 flex">
            <Canvas />
            <PropertyPanel />
          </div>
        </div>
      </div>
    </CanvasProvider>
  )
}
