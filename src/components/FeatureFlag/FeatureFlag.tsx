import If from "components/If"
import { ReactNode } from "react"
import KeyValuePair from "types/KeyValuePair"

interface Props {
  featureFlags: KeyValuePair<string, boolean> | undefined
  featureName: string
  children: ReactNode
}

const FeatureFlag: React.FC<Props> = ({ featureFlags, featureName, children }: Props) => {
  return <If condition={featureFlags ? featureFlags[featureName] : false}>{children}</If>
}

export default FeatureFlag
