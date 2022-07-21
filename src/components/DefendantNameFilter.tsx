const DefendantNameFilter = (props: { url: string }) => (
  <div>
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-one-third">
        <form action={props.url} method="get">
          <label htmlFor="defendant">{"Defendant name"}</label>
          <input type="text" id="search-defendant-name" name="defendant" />
          <input type="submit" id="search_button_homepage" />
        </form>
      </div>
    </div>
  </div>
)

export default DefendantNameFilter
