export const calculateLastPossiblePageNumber = (totalCases: number, maxPageItems: number): number =>
  Math.ceil(totalCases / maxPageItems) || 1
