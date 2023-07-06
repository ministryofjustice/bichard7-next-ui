import { EventSubscriber, EntitySubscriberInterface, LoadEvent } from "typeorm"
import Note from "../entities/Note"
import getUser from "../getUser"
import User from "../entities/User"
import { formatUserFullName } from "../../utils/formatUserFullName"

@EventSubscriber()
export class NoteSubscriber implements EntitySubscriberInterface<Note> {
  listenTo() {
    return Note
  }

  async afterLoad(note: Note, event: LoadEvent<Note>) {
    const { manager } = event
    if (note.userId) {
      const user = await getUser(manager, note.userId)

      if (user instanceof User) {
        note.userFullName = formatUserFullName(user.forenames, user.surname)
      }
    }
  }
}
