/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import If from "components/If"
import { Tag } from "govuk-react"
import { useState } from "react"
import Note from "services/entities/Note"

const TempDetails: React.FC = () => {
  const [labelText, setLabelText] = useState(true)
  const ShowNotes = () => {
    return (
      <>
        <span className="govuk-accordion-nav__chevron govuk-accordion-nav__chevron--down"></span>
        <span className="govuk-accordion__section-toggle-text">{"Show"}</span>
      </>
    )
  }

  const HideNotes = () => {
    return (
      <>
        <span className="govuk-accordion-nav__chevron govuk-accordion-nav__chevron--up"></span>
        <span className="govuk-accordion__section-toggle-text">{"Hide"}</span>
      </>
    )
  }

  return (
    <>
      <div className="govuk-accordion__section">
        <div className="govuk-accordion__section-header">
          <h2 className="govuk-accordion__section-heading">
            <button
              type="button"
              aria-controls="accordion-default-content-1"
              className="govuk-accordion__section-button"
              aria-expanded="false"
              aria-label="Writing well for the web , Show this section"
            >
              <span className="govuk-accordion__section-heading-text" id="accordion-default-heading-1">
                <span className="govuk-accordion__section-heading-text-focus">{"Text"}</span>
              </span>
              <span className="govuk-visually-hidden govuk-accordion__section-heading-divider">, </span>
              <span className="govuk-accordion__section-toggle" data-nosnippet="">
                <span className="govuk-accordion__section-toggle-focus" onClick={() => setLabelText(!labelText)}>
                  {labelText ? <ShowNotes /> : <HideNotes />}
                </span>
              </span>
            </button>
          </h2>
        </div>
        <div
          id="accordion-default-content-1"
          class="govuk-accordion__section-content"
          aria-labelledby="accordion-default-heading-1"
          hidden="until-found"
        >
          <p className="govuk-body">This is the content for Writing well for the web.</p>
        </div>
      </div>

      {/* <details className="govuk-details" data-module="govuk-details">
        <summary className="govuk-details__summary">
          <span className="govuk-accordion__section-toggle-focus" onClick={() => setLabelText(!labelText)}>
            {labelText ? "Show" : "Hide"}
          </span>
        </summary>
        <div className="govuk-details__text">{"random details"}</div>
      </details> */}
    </>
  )
}
const NotePreview: React.FC<{ notes: Note[] }> = (props: { notes: Note[] }) => {
  const userNotes = props.notes ? props.notes.filter((note) => note.userId !== "System").length : 0

  return (
    // Modify componenet to use gds accordion and details pattern
    // Number of notes(userNotes)
    // Accordion button
    // Preview 100 lines with elipse ... props.notes.noteText.splice(0,100)
    // Preview box needs stylings to have z-index to span 2 columns
    <If condition={!!userNotes}>
      {userNotes > 1 ? `${userNotes} notes` : `${userNotes} note`}
      <TempDetails />
    </If>
  )
}

export default NotePreview
