import styled from "styled-components"
import { darkGrey } from "utils/colours"

const Button = styled.button``
const ButtonAlt = styled.button`
  background: ${darkGrey};
  color: white;
  &:visited {
    color: white;
  }
  &:after {
    background-image: url(/bichard/moj_assets/images/icon-tag-remove-cross-white.svg);
  }
  &:link {
    color: white;
  }
`

export { Button, ButtonAlt }
