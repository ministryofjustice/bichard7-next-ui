import { EventSubscriber, EntitySubscriberInterface } from "typeorm"
import CourtCase from "../entities/CourtCase"
// import getUser from "../getUser"
// import User from "../entities/User"
// import { formatUserFullName } from "../../utils/formatUserFullName"

@EventSubscriber()
export class CourtCaseSubscriber implements EntitySubscriberInterface<CourtCase> {
  listenTo() {
    return CourtCase
  }

  async afterLoad(courtCase: CourtCase) {
    if (courtCase.errorLockedByUsername) {
      // TODO:
      // courtCase.errorLockedByUserFullName = formatUserFullName(user.forenames, user.surname)
      courtCase.errorLockedByUserFullName = courtCase.errorLockedByUsername
    }

    if (courtCase.triggerLockedByUsername) {
      courtCase.triggerLockedByUserFullName = courtCase.triggerLockedByUsername
      // courtCase.triggerLockedByUserFullName = formatUserFullName(user.forenames, user.surname)
    }
  }
}
