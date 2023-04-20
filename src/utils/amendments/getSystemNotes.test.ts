import User from "services/entities/User"
import getSystemNotes from "./getSystemNotes"

describe("getSystemNotes", () => {
  const dummyErrorId = 0
  const user = { username: "Some User" } as User

  it("can generate system notes when the amendment values are strings", () => {
    const expectedAmendmentValue = "newValue"
    expect(
      getSystemNotes(
        {
          asn: expectedAmendmentValue,
          courtPNCIdentifier: expectedAmendmentValue
        },
        user,
        dummyErrorId
      )
    ).toStrictEqual([
      {
        errorId: dummyErrorId,
        noteText: `${user.username}: Portal Action: Update Applied. Element: asn. New Value: ${expectedAmendmentValue}`,
        userId: "System"
      },
      {
        errorId: dummyErrorId,
        noteText: `${user.username}: Portal Action: Update Applied. Element: courtPNCIdentifier. New Value: ${expectedAmendmentValue}`,
        userId: "System"
      }
    ])
  })

  it("can generate system notes when the amendment values are UpdatedOffenceValue types", () => {
    expect(
      getSystemNotes(
        {
          offenceReasonSequence: [
            {
              offenceIndex: 0,
              updatedValue: "newOffenceReasonSequenceValue"
            }
          ],
          courtOffenceSequenceNumber: [
            {
              offenceIndex: 0,
              updatedValue: 12345
            }
          ],
          disposalQualifierCode: [
            {
              offenceIndex: 0,
              updatedValue: "newDisposalQualifierCodeValue",
              resultIndex: 1,
              resultQualifierIndex: 2
            }
          ]
        },
        user,
        dummyErrorId
      )
    ).toStrictEqual([
      {
        errorId: dummyErrorId,
        noteText: `${user.username}: Portal Action: Update Applied. Element: offenceReasonSequence. New Value: newOffenceReasonSequenceValue`,
        userId: "System"
      },
      {
        errorId: dummyErrorId,
        noteText: `${user.username}: Portal Action: Update Applied. Element: courtOffenceSequenceNumber. New Value: 12345`,
        userId: "System"
      },
      {
        errorId: dummyErrorId,
        noteText: `${user.username}: Portal Action: Update Applied. Element: disposalQualifierCode. New Value: newDisposalQualifierCodeValue`,
        userId: "System"
      }
    ])
  })

  it("can generate system notes when the amendment value is UpdatedNextHearingDate type", () => {
    const updatedDate = new Date("2023-01-16")
    expect(
      getSystemNotes(
        {
          nextHearingDate: [
            {
              offenceIndex: 0,
              updatedValue: updatedDate,
              resultIndex: 1
            }
          ]
        },
        user,
        dummyErrorId
      )
    ).toStrictEqual([
      {
        errorId: dummyErrorId,
        noteText: `${user.username}: Portal Action: Update Applied. Element: nextHearingDate. New Value: 16/01/2023`,
        userId: "System"
      }
    ])
  })

  it("can not generate system note when the amended key is noUpdatesResubmit", () => {
    expect(getSystemNotes({ noUpdatesResubmit: true }, user, dummyErrorId)).toStrictEqual([])
  })
})
