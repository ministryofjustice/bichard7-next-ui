import type { Boarding } from "boarding.js"
import { createContext } from "react"

export interface BoardingContextType {
  boarding: Boarding
}

const BoardingContext = createContext<BoardingContextType | null>(null)

export default BoardingContext
