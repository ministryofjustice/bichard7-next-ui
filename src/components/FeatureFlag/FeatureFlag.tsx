import If from "components/If"
import { ReactNode } from "react"
import User from "services/entities/User"

interface Props {
  user: User
  featureName: string
  children: ReactNode
}

const FeatureFlag: React.FC<Props> = ({ user, featureName, children }: Props) => {
  return <If condition={user.hasAccessToFeature(featureName)}>{children}</If>
}

export default FeatureFlag
