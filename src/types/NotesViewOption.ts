const NOTES_VIEW_OPTIONS = ["View user notes", "View system notes", "View all notes"] as const
type NotesViewOption = (typeof NOTES_VIEW_OPTIONS)[number]

export { NOTES_VIEW_OPTIONS }
export default NotesViewOption
