import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

const StyledSvg = styled("svg")({
  display: "block"
})

const SVG = ({ children, fill, title, className, ...rest }) => (
  <StyledSvg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    className={className}
    fill={fill}
    {...rest}
  >
    <title>{title}</title>
    {children}
  </StyledSvg>
)

SVG.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  title: PropTypes.string,
  fill: PropTypes.string
}

SVG.defaultProps = {
  className: undefined,
  title: undefined,
  fill: "currentColor"
}

export default SVG
