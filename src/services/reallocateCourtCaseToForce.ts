import { DataSource, EntityManager, UpdateQueryBuilder, UpdateResult } from "typeorm/"
import { isError } from "types/Result"
import { DEFAULT_STATION_CODE } from "utils/amendments/amendForceOwner/defaultStationCode"
import amendCourtCase from "./amendCourtCase"
import CourtCase from "./entities/CourtCase"
import User from "./entities/User"
import insertNotes from "./insertNotes"
import courtCasesByOrganisationUnitQuery from "./queries/courtCasesByOrganisationUnitQuery"
import updateLockStatusToUnlocked from "./updateLockStatusToUnlocked"
import UnlockReason from "types/UnlockReason"
import {
  AuditLogEvent,
  AuditLogEventOptions
} from "@moj-bichard7-developers/bichard7-next-core/dist/types/AuditLogEvent"
import storeAuditLogEvents from "./storeAuditLogEvents"
import getAuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/dist/lib/auditLog/getAuditLogEvent"
import EventCategory from "@moj-bichard7-developers/bichard7-next-core/dist/types/EventCategory"
import { AUDIT_LOG_EVENT_SOURCE } from "../config"
import getCourtCaseByOrganisationUnit from "./getCourtCaseByOrganisationUnit"
import {
  AnnotatedHearingOutcome,
  OffenceReason
} from "@moj-bichard7-developers/bichard7-next-core/dist/types/AnnotatedHearingOutcome"
import { parseAhoXml } from "@moj-bichard7-developers/bichard7-next-core/dist/parse/parseAhoXml"
import KeyValuePair from "@moj-bichard7-developers/bichard7-next-core/dist/types/KeyValuePair"
import excludedTriggers from "@moj-bichard7-developers/bichard7-next-data/data/excluded-trigger-config.json"
import Trigger from "./entities/Trigger"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { CjsPlea } from "@moj-bichard7-developers/bichard7-next-core/dist/types/Plea"
import { CjsVerdict } from "@moj-bichard7-developers/bichard7-next-core/dist/types/Verdict"

const baseOffenceCodeLength = 8
const enum recordableIndicatorOptions {
  NON_RECORDABLE = "N",
  RECORDABLE = "R",
  BOTH = "B"
}

const enum triggerLevelIndicator {
  OFFENCE_LEVEL = "O",
  CASE_LEVEL = "C"
}

const reopenedCaseTriggerCode = TriggerCode.TRPR0025
const reopenedCaseTriggerCodeA = "TRPR0025A"
const defendantBreachedBailCode = TriggerCode.TRPR0008

// prettier-ignore
const triggerOffenceCodes: KeyValuePair<string, string[]> = {
  TRPS0008: ["BA76004", "BA76005"],
  TRPR0004: ["SX56001", "SX56005", "SX56006", "SX56010", "SX56013", "SX56014", "SX56015", "SX56021", "SX56022", "SX56023", "SX56024", "SX56025", "SX56026", "SX56027", 
            "SX56028", "SX56029", "SX56030", "SX56031", "SX56047", "SX56048", "SX56049", "SX56050", "IC60005", "IC60006", "IC60007", "IC60008", "CL77015", "PK78001", 
            "PK78002", "PK78003", "PK78004", "PK78005", "PK78006", "PK78007", "PK78008", "CJ88115", "CJ09001", "SA00001", "SA00002", "SX03001", "SX03002", "SX03003", 
            "SX03004", "SX03005", "SX03006", "SX03007", "SX03008", "SX03009", "SX03010", "SX03011", "SX03012", "SX03013", "SX03014", "SX03015", "SX03016", "SX03017", 
            "SX03018", "SX03019", "SX03020", "SX03021", "SX03022", "SX03023", "SX03024", "SX03025", "SX03026", "SX03027", "SX03028", "SX03029", "SX03030", "SX03031", 
            "SX03032", "SX03033", "SX03034", "SX03035", "SX03036", "SX03037", "SX03038", "SX03039", "SX03040", "SX03041", "SX03042", "SX03043", "SX03044", "SX03045", 
            "SX03046", "SX03047", "SX03048", "SX03049", "SX03050", "SX03051", "SX03052", "SX03053", "SX03054", "SX03055", "SX03056", "SX03057", "SX03058", "SX03059", 
            "SX03060", "SX03061", "SX03062", "SX03063", "SX03064", "SX03065", "SX03066", "SX03067", "SX03068", "SX03069", "SX03070", "SX03071", "SX03072", "SX03073", 
            "SX03074", "SX03075", "SX03076", "SX03077", "SX03078", "SX03079", "SX03080", "SX03081", "SX03082", "SX03083", "SX03084", "SX03085", "SX03086", "SX03087", 
            "SX03088", "SX03089", "SX03090", "SX03091", "SX03092", "SX03093", "SX03094", "SX03095", "SX03096", "SX03097", "SX03098", "SX03099", "SX03100", "SX03101", 
            "SX03102", "SX03103", "SX03104", "SX03105", "SX03106", "SX03107", "SX03108", "SX03109", "SX03110", "SX03111", "SX03123", "SX03124", "SX03125", "SX03126", 
            "SX03127", "SX03128", "SX03129", "SX03130", "SX03131", "SX03132", "SX03133", "SX03134", "SX03135", "SX03136", "SX03137", "SX03156", "SX03157", "SX03158", 
            "SX03159", "SX03160", "SX03161", "SX03162", "SX03163", "SX03164", "SX03165", "SX03166", "SX03167", "SX03168", "SX03169", "SX03170", "SX03171", "SX03172", 
            "SX03173", "SX03174", "SX03175", "SX03176", "SX03177", "SX03178", "SX03179", "SX03181", "SX03182", "SX03183", "SX03184", "SX03185", "SX03186", "SX03187", 
            "SX03188", "SX03189", "SX03190", "SX03191", "SX03192", "SX03193", "SX03194", "SX03195", "SX03196", "SX03197", "SX03198", "SX03199", "SX03200", "SX03201", 
            "SX03208", "SX03209", "SX03224", "SX03225", "SX03226", "SX03227", "SX03228", "SX03229", "SX03230", "SX03231", "SX03232", "SX03233", "SX03234", "CE79180", 
            "CE79161", "CD98001", "CD98055", "CD98056"],
  TRPR0020: ["CD98001", "CD98019", "CD98020", "CD98021", "CD98058", "CJ03506", "CJ03507", "CJ03510", "CJ03511", "CJ03522", "CJ03523", "CJ08507", "CJ08512", "CJ08519", 
             "CJ08521", "CJ08526", "CJ91001", "CJ91002", "CJ91028", "CJ91029", "CJ91031", "CJ91039", "CS97001", "FB89004", "LP80001", "MC80002", "MC80508", "MC80601", 
             "PC00003", "PC00004", "PC00005", "PC00006", "PC00007", "PC00008", "PC00009", "PC00010", "PC00501", "PC00502", "PC00504", "PC00505", "PC00515", "PC00525", 
             "PC00535", "PC00545", "PC00555", "PC00565", "PC00575", "PC00585", "PC00595", "PC00605", "PC00615", "PC00625", "PC00635", "PC00645", "PC00655", "PC00665", 
             "PC00700", "PC00702", "PC73003", "PU86051", "PU86089", "PU86118", "SC07001", "SE20501", "SE20502", "SE20511", "SE20512", "SE20516", "SE20517", "SE20518", 
             "SE20521", "SE20525", "SE20532", "SE20537", "SE20538", "SE20540", "SE20542", "SE20546", "SE20547", "SE20552", "SO59501", "ST19001", "SX03202", "SX03220", 
             "SX03221", "SX03222", "SX03223"],
  TRPR0025: ["MC80524"],
  TRPR0025A: ["MC80527","MC80528"],
  TRPR0029: ["AS14504", "AS14509", "AS14511", "CD98501", "CD98502", "CD98503", "CD98517", "CD98519", "CD98525", "CJ08503", "CJ08504", "CJ08505", "CS10501", "CS10502", 
             "FB89501", "FB89506", "MC80530", "MS15501", "MS15502", "MS15503", "MS15504", "PC00503", "PC00506", "PC09504", "PC09505", "PC09510", "PH97503", "SE20503", 
             "SE20505", "SE20506", "SE20513", "SE20529", "SE20541", "SE20545", "ST19501"],
  TRPR0029A: ["AS14501", "AS14502", "AS14503", "AS14505", "AS14506", "AS14507", "AS14508", "AS14510", "AS14512", "AS14513", "AW06502", "CC81501", "CD98510", "CD98516", 
              "CD98518", "CD98527", "CD98528", "CJ03509", "CJ03513", "CJ03519", "CJ03520", "CJ08506", "CJ08508", "CJ08522", "FB89502", "FB89503", "MC80515", "PC09501", 
              "PC09502", "PC09503", "PC09506", "PC09507", "PC09508", "PC09509", "PC09511", "PH97501", "PH97502", "PL84503", "RO88504", "RO88505", "ST19502", "ST19503", 
              "ST19504", "ST19505", "ST19506", "ST19507", "SX03505", "SX03506", "SX03507", "SX03508", "SX03509", "SX03510", "SX03511", "SX03512", "SX03513", "SX03514", 
              "SX03515", "SX03516", "SX03517", "SX03518", "SX03519", "SX03520", "SX03521", "SX03522", "SX03523", "SX03524", "SX03525", "SX03526", "SX03527", "SX03528", 
              "SX03529", "SX03530", "SX03531", "SX03532", "SX03540", "SX03541", "SX03542", "SX03543", "SX03544", "SX03545", "SX03546", "SX03547", "SX03548", "SX03549", 
              "TR08500", "TR08501", "TR08502", "TR08503", "VC06501", "VC06502", "VC06503", "VC06504", "VC06505", "YJ99501", "YJ99503"],
  TRPR0030: ["PL84504","PL84505","PL84506"]
}

const preTriggers: KeyValuePair<
  string,
  {
    recordableIndicator: recordableIndicatorOptions
    triggerLevelIndicator: triggerLevelIndicator
    resultCodes: (string | number)[]
  }
> = {
  TRPR0001: {
    recordableIndicator: recordableIndicatorOptions.BOTH,
    triggerLevelIndicator: triggerLevelIndicator.OFFENCE_LEVEL,
    resultCodes: [3007, 3028, 3030, 3050, 3051, 3070, 3071, 3072, 3073, 3074, 3094, 3095, 3096]
  },
  TRPR0005: {
    recordableIndicator: recordableIndicatorOptions.BOTH,
    triggerLevelIndicator: triggerLevelIndicator.CASE_LEVEL,
    resultCodes: [4012, 4016, 4028, 4032, 4049, 4050, 4051, 4053, 4054, 4056, 4057, 4058, 4541, 4560, 4564, 4588]
  },
  TRPR0006: {
    recordableIndicator: recordableIndicatorOptions.BOTH,
    triggerLevelIndicator: triggerLevelIndicator.CASE_LEVEL,
    resultCodes: [
      1002, 1003, 1004, 1007, 1008, 1024, 1055, 1056, 1058, 1073, 1074, 1075, 1077, 1080, 1081, 1088, 1091, 1092, 1093,
      1110, 1111, 1121, 1126, 1133, 3132, 3053, 1507
    ]
  },
  TRPR0007: {
    recordableIndicator: recordableIndicatorOptions.BOTH,
    triggerLevelIndicator: triggerLevelIndicator.CASE_LEVEL,
    resultCodes: [2065]
  },
  TRPR0012: {
    recordableIndicator: recordableIndicatorOptions.BOTH,
    triggerLevelIndicator: triggerLevelIndicator.CASE_LEVEL,
    resultCodes: [2509]
  },
  TRPR0017: {
    recordableIndicator: recordableIndicatorOptions.RECORDABLE,
    triggerLevelIndicator: triggerLevelIndicator.OFFENCE_LEVEL,
    resultCodes: [2007]
  },
  TRPR0019: {
    recordableIndicator: recordableIndicatorOptions.BOTH,
    triggerLevelIndicator: triggerLevelIndicator.CASE_LEVEL,
    resultCodes: [4017, 4046, 4055, 4561]
  },
  TRPR0021: {
    recordableIndicator: recordableIndicatorOptions.BOTH,
    triggerLevelIndicator: triggerLevelIndicator.OFFENCE_LEVEL,
    resultCodes: [3002, 3022, 3023, 3025, 3035, 3115]
  },
  TRPR0026: {
    recordableIndicator: recordableIndicatorOptions.BOTH,
    triggerLevelIndicator: triggerLevelIndicator.OFFENCE_LEVEL,
    resultCodes: [3075, 3076]
  },
  TRPS0002: {
    recordableIndicator: recordableIndicatorOptions.RECORDABLE,
    triggerLevelIndicator: triggerLevelIndicator.CASE_LEVEL,
    resultCodes: [3107]
  },
  TRPS0008: {
    recordableIndicator: recordableIndicatorOptions.RECORDABLE,
    triggerLevelIndicator: triggerLevelIndicator.OFFENCE_LEVEL,
    resultCodes: [3105]
  },
  TRPR0022: {
    recordableIndicator: recordableIndicatorOptions.BOTH,
    triggerLevelIndicator: triggerLevelIndicator.CASE_LEVEL,
    resultCodes: [4022, 4067, 4068]
  },
  TRPR0016: {
    recordableIndicator: recordableIndicatorOptions.RECORDABLE,
    triggerLevelIndicator: triggerLevelIndicator.OFFENCE_LEVEL,
    resultCodes: [3055, 3056, 3134, 3135, 3136, 3137, 3138]
  },
  TRPR0030: {
    recordableIndicator: recordableIndicatorOptions.NON_RECORDABLE,
    triggerLevelIndicator: triggerLevelIndicator.CASE_LEVEL,
    resultCodes: ["PL84504", "PL84505", "PL84506"]
  }
}

const getUpdateTriggersMap = () => {
  return Object.keys(preTriggers).reduce((acc: KeyValuePair<number | string, string[]>, trigger) => {
    preTriggers[trigger].resultCodes.forEach((resultCode) => {
      acc[resultCode] = acc[resultCode] ?? []
      acc[resultCode].push(trigger)
    })
    return acc
  }, {})
}

const convertHOOffenceCodeToPNCFormat = (offenceReason: OffenceReason): string => {
  let offenceResonResult = ""
  if (offenceReason.__type === "NationalOffenceReason") {
    if (offenceReason.OffenceCode.__type === "NonMatchingOffenceCode") {
      offenceResonResult = offenceReason.OffenceCode.ActOrSource + offenceReason.OffenceCode.Year
    } else if (offenceReason.OffenceCode.__type === "IndictmentOffenceCode") {
      offenceResonResult = offenceReason.OffenceCode.Indictment
    } else if (offenceReason.OffenceCode.__type === "CommonLawOffenceCode") {
      offenceResonResult = offenceReason.OffenceCode.CommonLawOffence
    }
    offenceResonResult = offenceResonResult.concat(offenceReason.OffenceCode.Reason)

    if (offenceReason.OffenceCode.Qualifier) {
      offenceResonResult = offenceResonResult.concat(offenceReason.OffenceCode.Qualifier)
    }
  } else {
    offenceResonResult = offenceReason.LocalOffenceCode.OffenceCode
  }

  return offenceResonResult
}

const shouldGenerateTriggerForForce = (aho: AnnotatedHearingOutcome, triggerCode: string) => {
  const forceCode = aho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner?.SecondLevelCode

  if (!forceCode || !Object.keys(excludedTriggers).includes(forceCode)) {
    return true
  }

  const excludedTriggersForForce = (excludedTriggers as KeyValuePair<string, string[]>)[forceCode]
  return !excludedTriggersForForce.includes(triggerCode)
}

const shouldGenerateTriggerForCourt = (aho: AnnotatedHearingOutcome, triggerCode: string) => {
  const courtCode = aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHearingLocation?.OrganisationUnitCode

  if (!courtCode) {
    return true
  }

  for (let index = 0; index < courtCode.length - 2; index++) {
    const partialCourtCode = courtCode.substring(0, courtCode.length - index)
    if (!Object.keys(excludedTriggers).includes(partialCourtCode)) {
      continue
    }

    const excludedTriggersForCourt = (excludedTriggers as KeyValuePair<string, string[]>)[partialCourtCode]
    return !excludedTriggersForCourt.includes(triggerCode)
  }

  return true
}

type TriggerDetails = Pick<Trigger, "triggerCode" | "triggerItemIdentity">

const createTriggerIfNecessary = (
  triggers: Set<TriggerDetails>,
  triggerCode: string,
  offenceSequenceNumber: number | undefined,
  aho: AnnotatedHearingOutcome
) => {
  const shouldGenerateTrigger =
    shouldGenerateTriggerForForce(aho, triggerCode) || shouldGenerateTriggerForCourt(aho, triggerCode)

  if (shouldGenerateTrigger) {
    triggers.add({ triggerCode: triggerCode, triggerItemIdentity: offenceSequenceNumber })
  } else {
    const courtCode = aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHearingLocation?.OrganisationUnitCode
    const forceCode = aho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner?.SecondLevelCode
    if (forceCode && courtCode && forceCode !== courtCode) {
      const outOfAreaTrigger = TriggerCode.TRPR0027
      triggers.add({ triggerCode: outOfAreaTrigger })
    }
  }
}

const isOffenceOrBaseOffenceInTriggerOffenceCodes = (triggerCode: string, offenceCode: string) => {
  const offenceCodes = triggerOffenceCodes[triggerCode]
  return (
    offenceCodes.includes(offenceCode) ||
    (!!offenceCode && offenceCode.length == 8 && offenceCodes.includes(offenceCode.substring(0, 7)))
  )
}

const populatePreUpdateTriggers = (aho: AnnotatedHearingOutcome) => {
  const triggers = new Set<TriggerDetails>()
  const caseIsRecordable = !!aho.AnnotatedHearingOutcome.HearingOutcome.Case.RecordableOnPNCindicator
  const offences = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence
  let personalDetailsChangeResultCodeDetected = false
  let bailConditionsVariedTriggerGenerated = false
  let domesticViolenceTriggerGenerated = false
  let intimidatedVictimOrWitnessTriggerGenerated = false
  let attemptReopenedOrStatDecCaseCheck = true
  let defendantBreachedBailTriggerGenerated = false
  let attemptCivilProceedingsCheck = true

  const preUpdateTriggers = getUpdateTriggersMap()

  for (let index = -1; index < offences.length; index += 1) {
    const offence = offences[index]
    const offenceSequenceNumber = offence?.CourtOffenceSequenceNumber
    const appealAllowed = false
    const checkResultsForCivilProceedings = false
    const offenceCode =
      offence.CriminalProsecutionReference.OffenceReason &&
      convertHOOffenceCodeToPNCFormat(offence.CriminalProsecutionReference.OffenceReason)
    let reopenedCaseOffence = false
    let statutoryDeclarationOffence = false

    if (offence) {
      let offenceTriggerCodes = offenceCode && preUpdateTriggers[offenceCode]

      if (offenceCode && offenceCode.length === baseOffenceCodeLength) {
        const baseOffenceTriggerCodes = preUpdateTriggers[offenceCode.substring(0, 7)]

        if (!offenceTriggerCodes) {
          offenceTriggerCodes = baseOffenceTriggerCodes
        } else {
          if (baseOffenceTriggerCodes) {
            offenceTriggerCodes = offenceTriggerCodes.concat(baseOffenceTriggerCodes)
          }
        }
      }

      if (offenceTriggerCodes) {
        offenceTriggerCodes.forEach((triggerCode) => {
          const recordableIndicator = preTriggers[triggerCode].recordableIndicator
          if (
            (caseIsRecordable && recordableIndicator !== recordableIndicatorOptions.NON_RECORDABLE) ||
            (!caseIsRecordable && recordableIndicator !== recordableIndicatorOptions.RECORDABLE)
          ) {
            if (preTriggers[triggerCode].triggerLevelIndicator === triggerLevelIndicator.OFFENCE_LEVEL) {
              createTriggerIfNecessary(triggers, triggerCode, offenceSequenceNumber, aho)
            } else {
              createTriggerIfNecessary(triggers, triggerCode, undefined, aho)
            }
          }
        })
      }

      reopenedCaseOffence =
        attemptReopenedOrStatDecCaseCheck &&
        !!offenceCode &&
        isOffenceOrBaseOffenceInTriggerOffenceCodes(reopenedCaseTriggerCode, offenceCode)
      statutoryDeclarationOffence =
        attemptReopenedOrStatDecCaseCheck &&
        !!offenceCode &&
        isOffenceOrBaseOffenceInTriggerOffenceCodes(reopenedCaseTriggerCodeA, offenceCode)

      const firstResult = offence.Result[0]
      if (!defendantBreachedBailTriggerGenerated
            && (offenceCode && firstResult && isOffenceOrBaseOffenceInTriggerOffenceCodes(
                    defendantBreachedBailCode, offenceCode)
                && (firstResult.PleaStatus == CjsPlea.Admits || firstResult.Verdict == CjsVerdict.Guilty))) {
          createTriggerIfNecessary(triggers, defendantBreachedBailCode, undefined, aho);
          defendantBreachedBailTriggerGenerated = true
    }
  }
}

const reallocateCourtCaseToForce = async (
  dataSource: DataSource | EntityManager,
  courtCaseId: number,
  user: User,
  forceCode: string,
  note?: string
): Promise<UpdateResult | Error> => {
  // TODO:
  // - Generate TRPR0028 if necessary
  // - Reset triggers on reallocate
  return dataSource.transaction("SERIALIZABLE", async (entityManager): Promise<UpdateResult | Error> => {
    const events: AuditLogEvent[] = []

    const courtCase = await getCourtCaseByOrganisationUnit(entityManager, courtCaseId, user)

    if (isError(courtCase)) {
      throw courtCase
    }

    if (!courtCase) {
      throw new Error("Failed to reallocate: Case not found")
    }

    const aho = parseAhoXml(courtCase.hearingOutcome)

    if (isError(aho)) {
      return aho
    }

    const preUpdatePNCTrigger = populatePreUpdateTriggers(aho)
    const courtCaseRepository = entityManager.getRepository(CourtCase)
    let query = courtCaseRepository.createQueryBuilder().update(CourtCase)
    const newForceCode = `${forceCode}${DEFAULT_STATION_CODE}`
    query.set({ orgForPoliceFilter: newForceCode })
    query = courtCasesByOrganisationUnitQuery(query, user) as UpdateQueryBuilder<CourtCase>
    query.andWhere("error_id = :id", { id: courtCaseId })

    const amendResult = await amendCourtCase(entityManager, { forceOwner: forceCode }, courtCase, user)

    if (isError(amendResult)) {
      throw amendResult
    }

    const addNoteResult = await insertNotes(entityManager, [
      {
        noteText: `${user.username}: Case reallocated to new force owner: ${newForceCode}00`,
        errorId: courtCaseId,
        userId: "System"
      }
    ])

    if (isError(addNoteResult)) {
      throw addNoteResult
    }

    if (note) {
      const addUserNoteResult = await insertNotes(entityManager, [
        {
          noteText: note,
          errorId: courtCaseId,
          userId: user.username
        }
      ])

      if (isError(addUserNoteResult)) {
        throw addUserNoteResult
      }
    }

    events.push(
      getAuditLogEvent(
        AuditLogEventOptions.hearingOutcomeReallocated,
        EventCategory.information,
        AUDIT_LOG_EVENT_SOURCE,
        {
          user: user.username,
          auditLogVersion: 2,
          "New Force Owner": `${newForceCode}00`
        }
      )
    )

    const unlockResult = await updateLockStatusToUnlocked(
      entityManager,
      courtCase,
      user,
      UnlockReason.TriggerAndException,
      events
    )

    if (isError(unlockResult)) {
      throw unlockResult
    }

    const queryResult = await query.execute()?.catch((error: Error) => error)

    if (isError(queryResult)) {
      throw queryResult
    }

    if (!queryResult.affected || queryResult.affected === 0) {
      throw Error("Failed to reallocate case")
    }

    const storeAuditLogResponse = await storeAuditLogEvents(courtCase.messageId, events).catch((error) => error)

    if (isError(storeAuditLogResponse)) {
      throw storeAuditLogResponse
    }

    return queryResult
  })
}

export default reallocateCourtCaseToForce
