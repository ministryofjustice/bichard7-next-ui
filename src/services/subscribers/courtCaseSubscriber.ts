import { EventSubscriber, EntitySubscriberInterface, LoadEvent } from "typeorm"
import CourtCase from "services/entities/CourtCase"
import getUser from "services/getUser"
import User from "services/entities/User"
import { formatUserFullName } from "utils/formatUserFullName"

@EventSubscriber()
export class CourtCaseSubscriber implements EntitySubscriberInterface<CourtCase> {
  listenTo() {
    return CourtCase
  }

  async afterLoad(courtCase: CourtCase, event: LoadEvent<CourtCase>) {
    const { manager } = event

    if (courtCase.errorLockedByUsername) {
      const user = await getUser(manager, courtCase.errorLockedByUsername)

      if (user instanceof User) {
        courtCase.errorLockedByUserFullName = formatUserFullName(user.forenames, user.surname)
      }
    }

    if (courtCase.triggerLockedByUsername) {
      const user = await getUser(manager, courtCase.triggerLockedByUsername)

      if (user instanceof User) {
        courtCase.triggerLockedByUserFullName = formatUserFullName(user.forenames, user.surname)
      }
    }
  }
}
