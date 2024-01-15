export const hasUpdate = (originalValue?: string | Date | null, updatedValue?: string | Date | null): boolean =>
  !!updatedValue && updatedValue !== originalValue
