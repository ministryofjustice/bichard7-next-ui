import { Checkbox } from "govuk-react"
import { useRouter } from "next/router"

interface Props {
  checked: boolean
}

const UrgentFilter = (props: Props) => {
  const router = useRouter()
  const getTargetUrl = (checked: boolean) => {
    const params = new URLSearchParams({ ...router.query, ...(!checked && { isUrgent: "true" }) })
    if (checked) {
      params.delete("isUrgent")
    }
    return `?${params}`
  }

  return (
    <>
      <Checkbox
        defaultChecked={props.checked}
        onClick={() => router.push(getTargetUrl(props.checked))}
        id="is-urgent-filter"
      >
        {"Urgent cases only"}
      </Checkbox>
    </>
  )
}

export default UrgentFilter
