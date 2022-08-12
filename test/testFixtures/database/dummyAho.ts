import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"

export default {
  AnnotatedHearingOutcome: {
    HearingOutcome: {
      Hearing: {
        CourtHearingLocation: {
          TopLevelCode: "B",
          SecondLevelCode: "41",
          ThirdLevelCode: "ME",
          BottomLevelCode: "00",
          OrganisationUnitCode: "B41ME00"
        },
        DateOfHearing: new Date("2008-01-11T00:00:00.000Z"),
        TimeOfHearing: "13:30",
        HearingLanguage: "D",
        HearingDocumentationLanguage: "D",
        DefendantPresentAtHearing: "Y",
        CourtHouseCode: 1892,
        SourceReference: {
          DocumentName: "SPI Dean Rigout",
          UniqueID: "http://www.altova.com",
          DocumentType: "SPI Case Result"
        },
        CourtType: "MCA",
        CourtHouseName: "Magistrates' Courts Hertfordshire St Albans"
      },
      Case: {
        PTIURN: "41BP0510007",
        RecordableOnPNCindicator: true,
        PreChargeDecisionIndicator: false,
        ForceOwner: {
          SecondLevelCode: "04",
          ThirdLevelCode: "CA",
          BottomLevelCode: "00",
          OrganisationUnitCode: "04CA00"
        },
        CourtReference: { MagistratesCourtReference: "41BP0510007" },
        HearingDefendant: {
          ArrestSummonsNumber: "9625UC0000000118191Z",
          DefendantDetail: {
            PersonName: { Title: "Mr", GivenName: ["Dean"], FamilyName: "Rigout" },
            GeneratedPNCFilename: "RIGOUT/DEAN",
            BirthDate: new Date("1949-10-29T00:00:00.000Z"),
            Gender: 1
          },
          Address: { AddressLine1: "112 Letsbeavenue", AddressLine2: "Frimley,Camberley, Surrey" },
          RemandStatus: "CB",
          CourtPNCIdentifier: "2706/1234567P",
          BailConditions: ["give to the court any passport held"],
          ReasonForBailConditions: "to ensure appearance;",
          Offence: [
            {
              CriminalProsecutionReference: {
                DefendantOrOffender: {
                  Year: "96",
                  OrganisationUnitIdentifierCode: {
                    SecondLevelCode: "25",
                    ThirdLevelCode: "UC",
                    BottomLevelCode: "00",
                    OrganisationUnitCode: "25UC00"
                  },
                  DefendantOrOffenderSequenceNumber: "00000118191",
                  CheckDigit: "Z"
                },
                OffenceReason: {
                  __type: "NationalOffenceReason",
                  OffenceCode: {
                    __type: "NonMatchingOffenceCode",
                    ActOrSource: "TH",
                    Year: "68",
                    Reason: "027",
                    FullCode: "TH68027"
                  }
                }
              },
              OffenceCategory: "CE",
              OffenceTitle: "Burglary other than dwelling with intent to steal",
              ArrestDate: new Date("2007-09-15T00:00:00.000Z"),
              ChargeDate: new Date("2007-09-15T00:00:00.000Z"),
              ActualOffenceDateCode: "1",
              ActualOffenceStartDate: { StartDate: new Date("2007-09-15T00:00:00.000Z") },
              LocationOfOffence: "Woolwich Common London",
              ActualOffenceWording: "Burglary (with intent to steal - other than in dwelling)",
              ConvictionDate: new Date("2007-04-29T00:00:00.000Z"),
              CommittedOnBail: "D",
              CourtOffenceSequenceNumber: 1,
              AddedByTheCourt: true,
              Result: [
                {
                  CJSresultCode: 4023,
                  OffenceRemandStatus: "CB",
                  SourceOrganisation: {
                    TopLevelCode: "B",
                    SecondLevelCode: "41",
                    ThirdLevelCode: "ME",
                    BottomLevelCode: "00",
                    OrganisationUnitCode: "B41ME00"
                  },
                  CourtType: "MCA",
                  ConvictingCourt: "2723",
                  ResultHearingType: "OTHER",
                  ResultHearingDate: new Date("2007-04-29T00:00:00.000Z"),
                  BailCondition: [],
                  NextResultSourceOrganisation: {
                    TopLevelCode: "B",
                    SecondLevelCode: "41",
                    ThirdLevelCode: "ME",
                    BottomLevelCode: "00",
                    OrganisationUnitCode: "B41ME00"
                  },
                  Duration: [],
                  NextCourtType: "MCA",
                  NextHearingDate: new Date("2008-02-01T00:00:00.000Z"),
                  NextHearingTime: "13:30",
                  PleaStatus: "NG",
                  Verdict: "G",
                  ResultVariableText: "Remittal for Sentence on Adjournment",
                  ModeOfTrialReason: "EST",
                  PNCDisposalType: 4023,
                  ResultClass: "Adjournment post Judgement",
                  ReasonForOffenceBailConditions: "to ensure appearance;",
                  ResultQualifierVariable: [],
                  ResultHalfLifeHours: 72,
                  ResultApplicableQualifierCode: []
                }
              ],
              RecordableOnPNCindicator: true,
              NotifiableToHOindicator: true,
              HomeOfficeClassification: "030/02"
            }
          ]
        }
      }
    }
  },
  PncQuery: {
    forceStationCode: "04CA",
    checkName: "MIDDLETONN",
    pncId: "2000/0459646G",
    courtCases: [
      {
        courtCaseReference: "97/1626/008395Q",
        offences: [
          {
            offence: {
              acpoOffenceCode: "12:15:24:1",
              cjsOffenceCode: "TH68006",
              title: "Theft of pedal cycle",
              sequenceNumber: 1,
              qualifier1: "",
              qualifier2: "",
              startDate: new Date("2010-11-28T00:00:00.000Z"),
              startTime: "22:20"
            }
          }
        ]
      }
    ]
  },
  PncQueryDate: new Date("2022-07-27T00:00:00.000Z"),
  Exceptions: [
    {
      code: "HO100304",
      path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"]
    }
  ]
} as AnnotatedHearingOutcome
