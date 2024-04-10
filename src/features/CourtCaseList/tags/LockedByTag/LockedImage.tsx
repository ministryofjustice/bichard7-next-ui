import Image from "next/image"
import styled from "styled-components"
import { LOCKED_ICON_URL } from "utils/icons"

// Change colour from black to GDS text-blue (#144e81) with CSS filters
const LockedIcon = styled(Image)`
  filter: invert(12%) sepia(70%) saturate(4629%) hue-rotate(197deg) brightness(97%) contrast(84%);
`

interface LockedImageProps {
  unlockPath?: string
}

const LockedImage = ({ unlockPath }: LockedImageProps) => {
  let image
  if (unlockPath) {
    image = <LockedIcon src={LOCKED_ICON_URL} priority width={18} height={18} alt="Lock icon" />
  } else {
    image = <Image src={LOCKED_ICON_URL} priority width={18} height={18} alt="Lock icon" />
  }

  return image
}

export default LockedImage
