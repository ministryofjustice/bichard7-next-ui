import getTestConnection from "../getTestConnection"

const insertCourtCases = <T>(data: T[]): Promise<null[]> => {
  const connection = getTestConnection()

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
        $\{court_name\},
        $\{court_date\},
        $\{ptiurn\},
        $\{defendant_name\},
        $\{error_reason\},
        $\{trigger_reason\},
        $\{error_id\},
        $\{message_id\},
        $\{phase\},
        $\{error_status\},
        $\{trigger_status\},
        $\{error_quality_checked\},
        $\{trigger_quality_checked\},
        $\{trigger_count\},
        $\{error_locked_by_id\},
        $\{trigger_locked_by_id\},
        $\{is_urgent\},
        $\{asn\},
        $\{court_code\},
        $\{annotated_msg\},
        $\{error_report\},
        $\{create_ts\},
        $\{error_count\},
        $\{user_updated_flag\},
        $\{resolution_ts\},
        $\{msg_received_ts\},
        $\{error_resolved_by\},
        $\{trigger_resolved_by\},
        $\{error_resolved_ts\},
        $\{trigger_resolved_ts\},
        $\{org_for_police_filter\},
        $\{court_room\},
        $\{court_reference\},
        $\{error_insert_ts\},
        $\{trigger_insert_ts\},
        $\{pnc_update_enabled\}
  )
  `

  const queries = data.map((datum) => connection.none(insertQuery, { ...datum }))

  return Promise.all(queries)
}

export default insertCourtCases
