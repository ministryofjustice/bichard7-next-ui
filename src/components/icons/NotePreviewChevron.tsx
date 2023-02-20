import { createUseStyles } from "react-jss"

const useStyles = createUseStyles({
  defaultDownChevron: {}
})

export const DefaultDownChevron = () => {
  const classes = useStyles()

  return (
    <div>
      <svg
        className={classes.defaultDownChevron}
        width={20}
        height={20}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <circle cx={10} cy={10} r={9.5} fill="#1D70B8" stroke="#1D70B8" />
          <g>
            <path d="M6.94 7.71997L10 10.78L13.06 7.71997L14 8.66664L10 12.6666L6 8.66664L6.94 7.71997Z" fill="white" />
          </g>
        </g>
      </svg>
    </div>
  )
}

export const DefaultUpChevron = () => (
  <svg width={20} height={21} viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx={10} cy={10.5} r={9.5} transform="rotate(-180 10 10.5)" fill="#1D70B8" stroke="#1D70B8" />
    <g>
      <path d="M13.06 12.78L10 9.72003L6.94 12.78L6 11.8334L10 7.83336L14 11.8334L13.06 12.78Z" fill="white" />
    </g>
  </svg>
)

export const HoverDownChevron = () => (
  <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx={10} cy={10} r={9.5} fill="#003078" stroke="#003078" />
    <g>
      <path d="M6.94 7.71997L10 10.78L13.06 7.71997L14 8.66664L10 12.6666L6 8.66664L6.94 7.71997Z" fill="white" />
    </g>
  </svg>
)

export const HoverUpChevron = () => (
  <svg width={20} height={21} viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx={10} cy={10.5} r={9.5} transform="rotate(180 10 10.5)" fill="#003078" stroke="#003078" />
    <g>
      <path d="M13.06 12.78L10 9.72003L6.94 12.78L6 11.8334L10 7.83336L14 11.8334L13.06 12.78Z" fill="white" />
    </g>
  </svg>
)

export const ActiveUpChevron = () => (
  <svg width={22} height={22} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx={10} cy={10} r={9.5} fill="#0B0C0C" stroke="#0B0C0C" />
    <g>
      <path d="M13.06 12.28L10 9.22003L6.94 12.28L6 11.3334L10 7.33336L14 11.3334L13.06 12.28Z" fill="white" />
    </g>
  </svg>
)

export const ActiveDownChevron = () => (
  <svg width={22} height={22} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx={10} cy={10} r={9.5} transform="rotate(-180 10 10)" fill="#0B0C0C" stroke="#0B0C0C" />
    <g>
      <path d="M6.94 7.71997L10 10.78L13.06 7.71997L14 8.66664L10 12.6666L6 8.66664L6.94 7.71997Z" fill="white" />
    </g>
  </svg>
)
