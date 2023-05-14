const firestore = require('firebase/firestore');
const rdService = require('../../../../src/services/recorded-days');

jest.mock('firebase/firestore')

beforeEach(() => {
  jest.clearAllMocks();
});

test('if reference doesn\'t exist return undefined', async () => {
  // Arrange
  const recordedDayId = "RECORDED_DAY_ID";
  const context = {};
  const getDocResult = {
    exists: jest.fn(() => false),
  };
  firestore.getDoc.mockResolvedValue(getDocResult);

  // Act
  const r = await rdService.updateRecordedDayForUser(recordedDayId, context);

  // Assert
  expect(r).toBe(undefined);
});

test('if reference exists return ref', async () => {
  // Arrange
  const recordedDayId = "RECORDED_DAY_ID";
  const context = {};
  const docResult = {
    getPath: jest.fn(() => recordedDayId),
  };
  const getDocResult = {
    exists: jest.fn(() => true),
    // use line below if you were using data method
    // data: jest.fn(),
  };
  firestore.doc.mockResolvedValue(docResult);
  firestore.getDoc.mockResolvedValue(getDocResult);

  // Act
  const r = await rdService.updateRecordedDayForUser(context);

  // Assert
  expect(r?.getPath()).toBe(recordedDayId);
});