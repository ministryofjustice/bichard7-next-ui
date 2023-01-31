import { generatePageLabels } from "./generatePageLinks"

describe.each([
  [0, 0, []],
  [1, 1, [{ label: 1, bold: true }]],
  [
    1,
    2,
    [
      { label: 1, bold: true },
      { label: 2, destinationPage: 2, bold: false },
      { label: "Next", destinationPage: 2, bold: false }
    ]
  ],
  [
    2,
    2,
    [
      { label: "Previous", destinationPage: 1, bold: false },
      { label: 1, destinationPage: 1, bold: false },
      { label: 2, bold: true }
    ]
  ],
  [
    1,
    5,
    [
      { label: 1, bold: true },
      { label: 2, bold: false, destinationPage: 2 },
      { label: "Ellipsis", bold: true },
      { label: 5, bold: false, destinationPage: 5 },
      { label: "Next", bold: false, destinationPage: 2 }
    ]
  ],
  [
    2,
    5,
    [
      { label: "Previous", bold: false, destinationPage: 1 },
      { label: 1, bold: false, destinationPage: 1 },
      { label: 2, bold: true },
      { label: 3, bold: false, destinationPage: 3 },
      { label: "Ellipsis", bold: true },
      { label: 5, bold: false, destinationPage: 5 },
      { label: "Next", bold: false, destinationPage: 3 }
    ]
  ],
  [
    3,
    5,
    [
      { label: "Previous", bold: false, destinationPage: 2 },
      { label: 1, bold: false, destinationPage: 1 },
      { label: 2, bold: false, destinationPage: 2 },
      { label: 3, bold: true },
      { label: 4, bold: false, destinationPage: 4 },
      { label: 5, bold: false, destinationPage: 5 },
      { label: "Next", bold: false, destinationPage: 4 }
    ]
  ],
  [
    7,
    9,
    [
      { label: "Previous", bold: false, destinationPage: 6 },
      { label: 1, bold: false, destinationPage: 1 },
      { label: "Ellipsis", bold: true },
      { label: 6, bold: false, destinationPage: 6 },
      { label: 7, bold: true },
      { label: 8, bold: false, destinationPage: 8 },
      { label: 9, bold: false, destinationPage: 9 },
      { label: "Next", bold: false, destinationPage: 8 }
    ]
  ],
  [
    6,
    9,
    [
      { label: "Previous", bold: false, destinationPage: 5 },
      { label: 1, bold: false, destinationPage: 1 },
      { label: "Ellipsis", bold: true },
      { label: 5, bold: false, destinationPage: 5 },
      { label: 6, bold: true },
      { label: 7, bold: false, destinationPage: 7 },
      { label: "Ellipsis", bold: true },
      { label: 9, bold: false, destinationPage: 9 },
      { label: "Next", bold: false, destinationPage: 7 }
    ]
  ]
])("generatePageLabels(%i, %i)", (currentPage, totalPages, expected) => {
  test("returns correct labels", () => {
    expect(generatePageLabels(currentPage, totalPages)).toStrictEqual(expected)
  })
})
