import ConditionalRender from "components/ConditionalRender"
import { ReactNode } from "react"
import type { KeyValuePair } from "types/KeyValuePair"

interface Props {
  featureFlags: KeyValuePair<string, boolean> | undefined
  featureName: string
  children: ReactNode
}

const FeatureFlag: React.FC<Props> = ({ featureFlags, featureName, children }: Props) => {
  return <ConditionalRender isRendered={featureFlags ? featureFlags[featureName] : false}>{children}</ConditionalRender>
}

export default FeatureFlag
