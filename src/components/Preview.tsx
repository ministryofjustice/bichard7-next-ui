import { ReactNode } from "react"
import styled from "styled-components"
import { gdsMidGrey } from "utils/colours"

const CustomPreview = styled.div`
  border-color: ${gdsMidGrey};
  background-color: white;
  border: 1px solid;
  border-left: 5px solid;
  padding: 15px 20px;
`

interface PreviewProps {
  children: ReactNode
  className?: string
}

export const Preview = ({ children, className }: PreviewProps) => {
  if (className) {
    return <div className={className}>{children}</div>
  }

  return <CustomPreview>{children}</CustomPreview>
}
