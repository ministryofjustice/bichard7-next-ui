import styled, { css } from "styled-components"

const hover = css`
  white-space: unset;
  overflow: visible;
`

const CheckboxWrapper = styled.div`
  .govuk-checkboxes__input:hover + .govuk-checkboxes__label,
  .govuk-checkboxes__input:focus + .govuk-checkboxes__label {
    .trigger-description {
      ${hover}
    }
  }
`

const TriggerCheckboxLabel = styled.label`
  padding-right: 0;
  display: flex;
  flex-direction: row;

  .trigger-description {
    margin-right: 5px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    &:hover {
      ${hover}
    }
  }
`

export { CheckboxWrapper, TriggerCheckboxLabel }
