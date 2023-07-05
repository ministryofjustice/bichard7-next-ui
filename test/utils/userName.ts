export const formatForenames = (forenames: string) => {
  if (forenames) {
    return forenames
      .split(" ")
      .map((name) => name.charAt(0).toLocaleUpperCase() + name.slice(1))
      .join(" ")
  }

  return forenames
}

export const formatSurname = (surname: string) => {
  if (surname) {
    return surname.charAt(0).toLocaleUpperCase() + surname.slice(1)
  }

  return surname
}
