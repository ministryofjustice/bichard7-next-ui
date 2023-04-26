import type { KeyValuePair } from "./KeyValuePair"
import type NavigationLocation from "./NavigationLocation"

type NavigationOptions = {
  location: NavigationLocation
  args?: KeyValuePair<string, unknown>
}

type NavigationHandler = (options: NavigationOptions) => void

export { NavigationLocation }
export default NavigationHandler
