import { DatabaseQuery } from "types/DatabaseQuery"
import CourtCase from "../entities/CourtCase"
import { Brackets, In, Like } from "typeorm"

const removeLeadingZeroes = (code: string): string =>
  code.length > 2 && code.startsWith("0") ? code.substring(1) : code

const courtCasesByVisibleForcesQuery = <T extends DatabaseQuery<CourtCase>>(query: T, forces: string[]): T => {
  query.orWhere(
    new Brackets((qb) => {
      if (forces.length < 1) {
        qb.where("FALSE") // prevent returning cases when there are no visible forces
        return query
      }

      forces.forEach((force) => {
        force = removeLeadingZeroes(force)
        if (force.length === 1) {
          const condition = { orgForPoliceFilter: Like(`${force}__%`) }
          qb.where(condition)
        } else {
          const condition = { orgForPoliceFilter: Like(`${force}%`) }
          qb.orWhere(condition)
        }

        if (force.length > 3) {
          const subCodes = Array.from([...force].keys())
            .splice(4)
            .map((index) => force.substring(0, index))
          qb.orWhere({ orgForPoliceFilter: In(subCodes) })
        }
      })
    })
  )

  return query
}

export default courtCasesByVisibleForcesQuery
