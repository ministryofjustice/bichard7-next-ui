import { GetServerSideProps } from "next"

type WithServerSidePropsItem<Props extends { [key: string]: any }> = (
  item: GetServerSideProps<Props>
) => GetServerSideProps<Props>

export default <Props extends { [key: string]: any }>(
  ...serverSideProps: (GetServerSideProps<Props> | WithServerSidePropsItem<Props>)[]
): GetServerSideProps<Props> => {
  const items = serverSideProps.reverse()
  let result = items.shift() as GetServerSideProps<Props>
  items.forEach((item) => {
    result = (item as WithServerSidePropsItem<Props>)(result)
  })

  return result
}
