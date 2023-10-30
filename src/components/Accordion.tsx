import { useState } from "react"

type Props = {
  id: string
  heading: string
  children: React.ReactNode
}

const Accordion = ({ id, heading, children }: Props) => {
  const [isContentVisible, setIsContentVisible] = useState(false)

  const toggleContentVisibility = () => setIsContentVisible((previousValue) => !previousValue)

  return (
    <div className="b7-accordion">
      <div className="b7-accordion__header">
        <h2 className="b7-accordion__heading">
          <button
            type="button"
            aria-controls={`${id}-content`}
            className="b7-accordion__button"
            aria-expanded="false"
            aria-label={heading}
            onClick={toggleContentVisibility}
          >
            <span className="b7-accordion__toggle">
              <span className="b7-accordion__toggle-focus">
                <span
                  className={`b7-accordion-nav__chevron ${!isContentVisible ? "b7-accordion-nav__chevron--down" : ""}`}
                ></span>
                <span className="b7-accordion__toggle-text">{heading}</span>
              </span>
            </span>
          </button>
        </h2>
      </div>
      {isContentVisible && <div className="b7-accordion__content">{children}</div>}
    </div>
  )
}

export default Accordion
