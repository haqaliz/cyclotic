const firestore = require('firebase/firestore');
const rdService = require('../../../../src/services/recorded-days');

jest.mock('firebase/firestore')

beforeEach(() => {
  jest.clearAllMocks();
});

test('if reference removed return ref', async () => {
  // Arrange
  const recordedDayId = "RECORDED_DAY_ID";
  const context = {
    recorded_day_id: recordedDayId,
  };
  const docResult = {
    getPath: jest.fn(() => recordedDayId),
  };
  firestore.doc.mockResolvedValue(docResult);

  // Act
  const r = await rdService.deleteRecordedDayForUser(context);

  // Assert
  expect(r?.getPath()).toBe(recordedDayId);
});