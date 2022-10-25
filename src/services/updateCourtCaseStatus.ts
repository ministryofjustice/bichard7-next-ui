import { Brackets, DataSource, EntityManager, UpdateResult } from "typeorm"
import { ResolutionStatus } from "types/ResolutionStatus"
import { RecordType } from "types/RecordType"
import { isError } from "types/Result"
import { UpdateResolutionStatus } from "types/UpdateResolutionStatus"
import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"

const isErrorUpdate = (recordType: RecordType) => recordType === "Error"
const isResolved = (resolutionStatus: ResolutionStatus) => resolutionStatus === "Resolved"

const updateCourtCaseStatus = async (
  dataSource: DataSource | EntityManager,
  courtCaseId: number,
  recordType: RecordType,
  resolutionStatus: ResolutionStatus,
  { username }: User
): Promise<UpdateResult | Error> => {
  const timestamp = new Date()
  let updateResolutionStatus: UpdateResolutionStatus
  let updatedField: string
  const courtCaseRepository = dataSource.getRepository(CourtCase)
  const courtCase = await courtCaseRepository
    .createQueryBuilder("courtCase")
    .andWhere({ errorId: courtCaseId })
    .getOne()

  if (isError(courtCase)) {
    return courtCase
  }

  if (isErrorUpdate(recordType)) {
    updateResolutionStatus = {
      errorStatus: resolutionStatus,
      errorResolvedBy: username,
      ...(isResolved(resolutionStatus) && { errorResolvedTimestamp: timestamp }),
      ...(((isResolved(resolutionStatus) && courtCase?.triggerStatus === undefined) ||
        (courtCase && courtCase.triggerStatus && isResolved(courtCase.triggerStatus))) && {
        resolutionTimestamp: timestamp
      })
    }
    updatedField = "error"
  } else {
    updateResolutionStatus = {
      triggerStatus: resolutionStatus,
      triggerResolvedBy: username,
      ...(isResolved(resolutionStatus) && { triggerResolvedTimestamp: timestamp }),
      ...(((isResolved(resolutionStatus) && courtCase?.errorStatus === undefined) ||
        (courtCase && courtCase.errorStatus && isResolved(courtCase.errorStatus))) && {
        resolutionTimestamp: timestamp
      })
    }
    updatedField = "trigger"
  }

  try {
    const query = courtCaseRepository
      .createQueryBuilder()
      .update(CourtCase)
      .set(updateResolutionStatus)
      .where("error_id = :id", { id: courtCaseId })
      .andWhere(`${updatedField}_status is NOT NULL`)
      .andWhere(
        new Brackets((qb) => {
          qb.where(`${updatedField}_locked_by_id = :user`, { user: username }).orWhere(
            `${updatedField}_locked_by_id is NULL`
          )
        })
      )

    return await query.returning("*").execute()
  } catch (error) {
    return error as Error
  }
}

export default updateCourtCaseStatus
