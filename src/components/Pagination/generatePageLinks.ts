export type PageLabel = "Previous" | number | "Ellipsis" | "Next"
export type PageLink = { label: PageLabel; destinationPage?: number; bold: boolean }

// Returns an list of elements to display in the pagination widget
// Page numbers are 1-indexed
// totalPages should be >= 0 and currentPage should be >=0 and <= totalPages
export const generatePageLinks = (currentPage: number, totalPages: number): PageLink[] => {
  const labels: PageLink[] = []

  // Previous page arrow
  if (currentPage > 1) {
    labels.push({ label: "Previous", destinationPage: currentPage - 1, bold: false })
  }

  // First page
  if (currentPage > 2) {
    labels.push({ label: 1, destinationPage: 1, bold: false })
  }

  // Abridged gap between first page and previous page
  if (currentPage > 3) {
    labels.push({ label: "Ellipsis", bold: true })
  }

  // Previous page
  if (currentPage > 1) {
    labels.push({ label: currentPage - 1, destinationPage: currentPage - 1, bold: false })
  }

  // Current page
  if (currentPage > 0) {
    labels.push({ label: currentPage, bold: true })
  }

  // Next page
  if (currentPage < totalPages) {
    labels.push({ label: currentPage + 1, destinationPage: currentPage + 1, bold: false })
  }

  // Abridged gap between next and last page
  if (currentPage < totalPages - 2) {
    labels.push({ label: "Ellipsis", bold: true })
  }

  // Last page
  if (currentPage < totalPages - 1) {
    labels.push({ label: totalPages, destinationPage: totalPages, bold: false })
  }

  // Next page arrow
  if (currentPage < totalPages) {
    labels.push({ label: "Next", destinationPage: currentPage + 1, bold: false })
  }
  return labels
}
