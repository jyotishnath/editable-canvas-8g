"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"

export interface CanvasElement {
  id: string
  type: "text" | "image" | "arrow" | "shape" | "drawing"
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  opacity: number // Add opacity property
  properties: any
}

interface CanvasState {
  elements: CanvasElement[]
  selectedElementId: string | null
  canvasBackground: {
    type: "color" | "image"
    value: string
  }
  nextZIndex: number
  history: CanvasElement[][]
  historyIndex: number
}

type CanvasAction =
  | { type: "ADD_ELEMENT"; element: CanvasElement }
  | { type: "UPDATE_ELEMENT"; id: string; updates: Partial<CanvasElement> }
  | { type: "DELETE_ELEMENT"; id: string }
  | { type: "SELECT_ELEMENT"; id: string | null }
  | { type: "MOVE_ELEMENT"; id: string; x: number; y: number }
  | { type: "RESIZE_ELEMENT"; id: string; width: number; height: number }
  | { type: "BRING_FORWARD"; id: string }
  | { type: "SEND_BACKWARD"; id: string }
  | { type: "SET_CANVAS_BACKGROUND"; background: { type: "color" | "image"; value: string } }
  | { type: "UNDO" }
  | { type: "ADD_MULTIPLE_ELEMENTS"; elements: CanvasElement[] }

const initialState: CanvasState = {
  elements: [],
  selectedElementId: null,
  canvasBackground: { type: "color", value: "#ffffff" },
  nextZIndex: 1,
  history: [[]],
  historyIndex: 0,
}

function saveToHistory(state: CanvasState): CanvasState {
  const newHistory = state.history.slice(0, state.historyIndex + 1)
  newHistory.push([...state.elements])
  return {
    ...state,
    history: newHistory.slice(-50), // Keep last 50 states
    historyIndex: Math.min(newHistory.length - 1, 49),
  }
}

function canvasReducer(state: CanvasState, action: CanvasAction): CanvasState {
  switch (action.type) {
    case "ADD_ELEMENT":
      const newStateAdd = saveToHistory(state)
      return {
        ...newStateAdd,
        elements: [...newStateAdd.elements, { ...action.element, zIndex: newStateAdd.nextZIndex, opacity: 1 }],
        nextZIndex: newStateAdd.nextZIndex + 1,
      }

    case "ADD_MULTIPLE_ELEMENTS":
      const newStateMultiple = saveToHistory(state)
      const elementsWithZIndex = action.elements.map((el, index) => ({
        ...el,
        zIndex: newStateMultiple.nextZIndex + index,
        opacity: 1,
      }))
      return {
        ...newStateMultiple,
        elements: [...newStateMultiple.elements, ...elementsWithZIndex],
        nextZIndex: newStateMultiple.nextZIndex + action.elements.length,
      }

    case "UPDATE_ELEMENT":
      return {
        ...state,
        elements: state.elements.map((el) => (el.id === action.id ? { ...el, ...action.updates } : el)),
      }

    case "DELETE_ELEMENT":
      const newStateDelete = saveToHistory(state)
      return {
        ...newStateDelete,
        elements: newStateDelete.elements.filter((el) => el.id !== action.id),
        selectedElementId: newStateDelete.selectedElementId === action.id ? null : newStateDelete.selectedElementId,
      }

    case "SELECT_ELEMENT":
      return { ...state, selectedElementId: action.id }

    case "MOVE_ELEMENT":
      return {
        ...state,
        elements: state.elements.map((el) => (el.id === action.id ? { ...el, x: action.x, y: action.y } : el)),
      }

    case "RESIZE_ELEMENT":
      return {
        ...state,
        elements: state.elements.map((el) =>
          el.id === action.id ? { ...el, width: action.width, height: action.height } : el,
        ),
      }

    case "BRING_FORWARD":
      const maxZ = Math.max(...state.elements.map((el) => el.zIndex))
      return {
        ...state,
        elements: state.elements.map((el) => (el.id === action.id ? { ...el, zIndex: maxZ + 1 } : el)),
        nextZIndex: Math.max(state.nextZIndex, maxZ + 2),
      }

    case "SEND_BACKWARD":
      const minZ = Math.min(...state.elements.map((el) => el.zIndex))
      return {
        ...state,
        elements: state.elements.map((el) => (el.id === action.id ? { ...el, zIndex: Math.max(0, minZ - 1) } : el)),
      }

    case "SET_CANVAS_BACKGROUND":
      return { ...state, canvasBackground: action.background }

    case "UNDO":
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1
        return {
          ...state,
          elements: [...state.history[newIndex]],
          historyIndex: newIndex,
          selectedElementId: null,
        }
      }
      return state

    default:
      return state
  }
}

const CanvasContext = createContext<{
  state: CanvasState
  dispatch: React.Dispatch<CanvasAction>
} | null>(null)

export function CanvasProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(canvasReducer, initialState)

  return <CanvasContext.Provider value={{ state, dispatch }}>{children}</CanvasContext.Provider>
}

export function useCanvas() {
  const context = useContext(CanvasContext)
  if (!context) {
    throw new Error("useCanvas must be used within a CanvasProvider")
  }
  return context
}
