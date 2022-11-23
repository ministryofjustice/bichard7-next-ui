import { validateQueryParams } from "./validateQueryParams"

const lockedFilterOptions = ["Locked", "Unlocked"]

export const validateLockFilter = (lockFilter: string | string[] | undefined): boolean =>
  validateQueryParams(lockFilter) && lockedFilterOptions.includes(lockFilter)

export const mapLockFilter = (lockFilter: string | string[] | undefined): boolean | undefined =>
  validateLockFilter(lockFilter) ? lockFilter === "Locked" : undefined
