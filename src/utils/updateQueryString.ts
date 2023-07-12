import type KeyValuePair from "@moj-bichard7-developers/bichard7-next-core/dist/types/KeyValuePair"

const updateQueryString = (params: KeyValuePair<string, unknown>) => {
  const searchParams = new URLSearchParams(window.location.search)
  Object.entries(params).map(([key, value]) => {
    if (value === null) {
      searchParams.delete(key)
    } else {
      searchParams.set(key, String(value))
    }
  })
  const newRelativePathQuery = window.location.pathname + "?" + searchParams.toString()
  history.pushState(null, "", newRelativePathQuery)
}

export default updateQueryString
