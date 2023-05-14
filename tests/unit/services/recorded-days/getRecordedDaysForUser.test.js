const firestore = require('firebase/firestore');
const rdService = require('../../../../src/services/recorded-days');

jest.mock('firebase/firestore')

beforeEach(() => {
  jest.clearAllMocks();
});

test('if find result return snapshot array', async () => {
  // Arrange
  const userId = "3PejNdc8yY8awjmR7bbj";
  const getDocsResult = [{
    data: jest.fn(() => ({
        "bleeding_type": "clots",
        "blood_color": "bright red",
        "sex_situation": "protected sex",
        "medications": null,
        "user_id": userId,
        "bleeding_amount": 7,
        "pregnancy_test": "negative",
        "feelings": [
            {
                "value": "calm",
                "intensity": 7
            }
        ],
        "created_at": {
            "seconds": 1682800200,
            "nanoseconds": 0
        },
        "misc": [
            {
                "intensity": 2,
                "value": "yoga"
            }
        ],
        "vaginal_discharge": [
            {
                "value": "creamy",
                "intensity": 2
            }
        ],
        "symptoms": [
            {
                "value": "bloating",
                "intensity": 3
            }
        ]
    })),
  }];
  firestore.getDocs.mockResolvedValue(getDocsResult);

  // Act
  const r = await rdService.getRecordedDaysForUser(userId);

  // Assert
  r.forEach((i) => expect(i?.user_id).toBe(userId));
});

test('if couldn\'t find result return empty array', async () => {
    // Arrange
    const userId = "3PejNdc8yY8awjmR7bbj";
    const getDocsResult = [];
    firestore.getDocs.mockResolvedValue(getDocsResult);
  
    // Act
    const r = await rdService.getRecordedDaysForUser(userId);
  
    // Assert
    expect(r.length).toBe(0);
});