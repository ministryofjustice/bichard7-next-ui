import Note from "services/entities/Note"
import { OtherUser } from "./Users"

export type DisplayNote = Pick<Note, "noteText" | "userId" | "userFullName"> & {
  user?: OtherUser
  createdAt: string
}
