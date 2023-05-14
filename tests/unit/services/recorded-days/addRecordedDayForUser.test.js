const firestore = require('firebase/firestore');
const rdService = require('../../../../src/services/recorded-days');

jest.mock('firebase/firestore')

beforeEach(() => {
  jest.clearAllMocks();
});

test('if we have submitted before return false', async () => {
  // Arrange
  const userId = "USER_ID";
  const context = {
    user_id: userId,
  };
  const getCountResult = {
    data: jest.fn(() => ({
        count: 1,
    })),
  };
  firestore.getCountFromServer.mockResolvedValue(getCountResult);

  // Act
  const r = await rdService.addRecordedDayForUser(context);

  // Assert
  expect(r).toBe(false);
});

test('if we have not submitted before return reference', async () => {
  // Arrange
  const userId = "USER_ID";
  const ref = "REFERENCE_ID";
  const context = {
    user_id: userId,
  };
  const getCountResult = {
    data: jest.fn(() => ({
        count: 0,
    })),
  };
  const docResult = {
    getPath: jest.fn(() => ref),
  };
  firestore.getCountFromServer.mockResolvedValue(getCountResult);
  firestore.doc.mockResolvedValue(docResult);

  // Act
  const r = await rdService.addRecordedDayForUser(context);

  // Assert
  expect(r?.getPath()).toBe(ref);
});