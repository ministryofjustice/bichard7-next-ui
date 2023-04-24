import CourtCase from "./entities/CourtCase"
import Note from "./entities/Note"
import getDataSource from "./getDataSource"

const main = async () => {
  const connection = await getDataSource()
  const r = await connection
    .getRepository(CourtCase)
    .createQueryBuilder()
    .addSelect(`(SELECT count(*) FROM br7own.error_list_notes)`, "note_count")
    .orderBy("note_count", "ASC")
    .getManyAndCount()
  console.log(r)
  //   const [query, parameters] = connection.driver.escapeQueryWithParameters(
  //     "SELECT * FROM br7own.users WHERE username = :username",
  //     { username: "Bichard01" },
  //     {}
  //   )

  //   const result = await connection.getRepository(CourtCase).manager.query(query, parameters)
  //   console.log(query, parameters)
}

main()

/*

selectn *, (select count(*) from ...) from ...
*/
