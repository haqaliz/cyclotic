const auth = require('firebase/auth');
const authService = require('../../../../src/services/auth');

jest.mock('firebase/auth')

beforeEach(() => {
  jest.clearAllMocks();
});

test('login done successfully', async () => {
  // Arrange
  const uid = 'UNIQUE_UID';
  const context = {
    email: 'test@example.com',
    password: '12345678',
  };
  const result = new Promise((resolve) => resolve({
    uid,
  }));
  auth.signInWithEmailAndPassword.mockResolvedValue(result);

  // Act
  const r = await authService.login(context.email, context.password);

  // Assert
  expect(r?.uid).toBe(uid);
});

test('login failed', async () => {
  // Arrange
  const code = 'ERROR_CODE';
  const context = {
    email: 'test@example.com',
  };
  const result = new Promise((_, reject) => reject({
    code,
  }));
  auth.signInWithEmailAndPassword.mockResolvedValue(result);

  // Act
  const r = await authService.login(context.email, context.password);

  // Assert
  expect(r).toBe(undefined);
});