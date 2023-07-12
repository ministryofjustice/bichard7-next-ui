import type KeyValuePair from "@moj-bichard7-developers/bichard7-next-core/dist/types/KeyValuePair"
import type NavigationLocation from "./NavigationLocation"

type NavigationOptions = {
  location: NavigationLocation
  args?: KeyValuePair<string, unknown>
}

type NavigationHandler = (options: NavigationOptions) => void

export { NavigationLocation }
export default NavigationHandler
