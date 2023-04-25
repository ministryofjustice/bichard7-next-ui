import type { KeyValuePair } from "./KeyValuePair"
import type NavigationLocations from "./NavigationLocations"

type NavigationOptions = {
  location: NavigationLocations
  args?: KeyValuePair<string, unknown>
}

type NavigationHandler = (options: NavigationOptions) => void

export { NavigationLocations }
export default NavigationHandler
