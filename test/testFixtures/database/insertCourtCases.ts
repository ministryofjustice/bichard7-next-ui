import getDataSource from "../../../src/services/getDataSource"
import CourtCaseCase from "./data/error_list.json"
import CourtCaseAho from "./data/error_list_aho.json"

const insertCourtCases = async <T>(data: T[]): Promise<null[]> => {
  const dataSource = await getDataSource()

  const insertQuery = `
    INSERT INTO
      br7own.error_list(
        court_name,
        court_date,
        ptiurn,
        defendant_name,
        error_reason,
        trigger_reason,
        error_id,
        message_id,
        phase,
        error_status,
        trigger_status,
        error_quality_checked,
        trigger_quality_checked,
        trigger_count,
        error_locked_by_id,
        trigger_locked_by_id,
        is_urgent,
        asn,
        court_code,
        annotated_msg,
        error_report,
        create_ts,
        error_count,
        user_updated_flag,
        resolution_ts,
        msg_received_ts,
        error_resolved_by,
        trigger_resolved_by,
        error_resolved_ts,
        trigger_resolved_ts,
        org_for_police_filter,
        court_room,
        court_reference,
        error_insert_ts,
        trigger_insert_ts,
        pnc_update_enabled
      ) VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11,
        $12,
        $13,
        $14,
        $15,
        $16,
        $17,
        $18,
        $19,
        $20,
        $21,
        $22,
        $23,
        $24,
        $25,
        $26,
        $27,
        $28,
        $29,
        $30,
        $31,
        $32,
        $33,
        $34,
        $35,
        $36
  )
  `

  return Promise.all(data.map((datum) => dataSource.manager.query(insertQuery, Object.values(datum))))
}

const insertCourtCasesWithOrgCodes = (orgsCodes: string[]) => {
  const existingCourtCases = orgsCodes.map((code, i) => {
    return {
      ...CourtCaseCase,
      annotated_msg: CourtCaseAho.annotated_msg,
      org_for_police_filter: code.padEnd(6, " "),
      error_id: i,
      message_id: String(i).padStart(5, "x"),
      ptiurn: "Case" + String(i).padStart(5, "0")
    }
  })

  return insertCourtCases(existingCourtCases)
}

const insertCourtCasesWithCourtNames = (courtNames: string[], orgCode: string) => {
  const existingCourtCases = courtNames.map((name, i) => {
    return {
      ...CourtCaseCase,
      annotated_msg: CourtCaseAho.annotated_msg,
      org_for_police_filter: orgCode,
      error_id: i,
      message_id: String(i).padStart(5, "x"),
      ptiurn: "Case" + String(i).padStart(5, "0"),
      court_name: name,
      defendant_name: CourtCaseCase.defendant_name + i,
      court_date: new Date("2" + String(i).padStart(3, "0") + "-01-01")
    }
  })

  return insertCourtCases(existingCourtCases)
}

const insertCourtCasesWithCourtDates = (courtDates: string[], orgCode: string) => {
  const existingCourtCases = courtDates.map((date, i) => {
    return {
      ...CourtCaseCase,
      annotated_msg: CourtCaseAho.annotated_msg,
      org_for_police_filter: orgCode,
      error_id: i,
      message_id: String(i).padStart(5, "x"),
      ptiurn: "Case" + String(i).padStart(5, "0"),
      court_date: date
    }
  })

  return insertCourtCases(existingCourtCases)
}

const insertCourtCasesWithDefendantNames = (defendantNames: string[], orgCode: string) => {
  const existingCourtCases = defendantNames.map((name, i) => {
    return {
      ...CourtCaseCase,
      annotated_msg: CourtCaseAho.annotated_msg,
      org_for_police_filter: orgCode,
      error_id: i,
      message_id: String(i).padStart(5, "x"),
      ptiurn: "Case" + String(i).padStart(5, "0"),
      defendant_name: name,
      court_date: new Date("2" + String(i).padStart(3, "0") + "-01-01")
    }
  })

  return insertCourtCases(existingCourtCases)
}

const insertMultipleDummyCourtCases = (numToInsert: number, orgCode: string) => {
  const existingCourtCases = [...Array(numToInsert).fill(CourtCaseCase)].map((elem, i: number) => {
    return {
      ...elem,
      org_for_police_filter: orgCode,
      message_id: String(i).padStart(5, "x"),
      error_id: i,
      ptiurn: "Case" + String(i).padStart(5, "0")
    }
  })

  return insertCourtCases(existingCourtCases)
}

export {
  insertCourtCases,
  insertCourtCasesWithOrgCodes,
  insertCourtCasesWithCourtNames,
  insertCourtCasesWithCourtDates,
  insertCourtCasesWithDefendantNames,
  insertMultipleDummyCourtCases
}
