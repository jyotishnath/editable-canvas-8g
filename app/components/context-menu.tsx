"use client"

import { useCanvas } from "../context/canvas-context"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown, Trash2 } from "lucide-react"
import { useEffect, useRef } from "react"

interface ContextMenuProps {
  x: number
  y: number
  elementId: string
  onClose: () => void
}

export function ContextMenu({ x, y, elementId, onClose }: ContextMenuProps) {
  const { dispatch } = useCanvas()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  const handleBringForward = () => {
    dispatch({ type: "BRING_FORWARD", id: elementId })
    onClose()
  }

  const handleSendBackward = () => {
    dispatch({ type: "SEND_BACKWARD", id: elementId })
    onClose()
  }

  const handleDelete = () => {
    dispatch({ type: "DELETE_ELEMENT", id: elementId })
    onClose()
  }

  return (
    <div
      ref={menuRef}
      className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
      style={{ left: x, top: y }}
    >
      <Button onClick={handleBringForward} variant="ghost" size="sm" className="w-full justify-start px-4">
        <ChevronUp className="w-4 h-4 mr-2" />
        Bring Forward
      </Button>

      <Button onClick={handleSendBackward} variant="ghost" size="sm" className="w-full justify-start px-4">
        <ChevronDown className="w-4 h-4 mr-2" />
        Send Backward
      </Button>

      <hr className="my-1" />

      <Button
        onClick={handleDelete}
        variant="ghost"
        size="sm"
        className="w-full justify-start px-4 text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Delete
      </Button>
    </div>
  )
}
