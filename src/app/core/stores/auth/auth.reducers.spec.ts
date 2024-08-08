import { Action } from '@ngrx/store';
import { authReducer, initialState, State } from './auth.reducers';
import { AuthActions } from '.';

describe('authReducer', () => {
  const initialStateMock: State = initialState;

  it('should return the default state', () => {
    // Arrange
    const action = {} as Action;

    // Act
    const result = authReducer(undefined, action);

    // Assert
    expect(result).toEqual({
      ids: [],
      entities: {},
      currentUserId: null,
    });
  });

  describe('login', () => {
    it('should return the current state', () => {
      // Arrange
      const action = AuthActions.login();

      // Act
      const result = authReducer(initialStateMock, action);

      // Assert
      expect(result).toEqual(initialStateMock);
    });

    it('should return the current state on success', () => {
      // Arrange
      const action = AuthActions.loginSuccess();

      // Act
      const result = authReducer(initialStateMock, action);

      // Assert
      expect(result).toEqual(initialStateMock);
    });

    it('should return the current state on failure', () => {
      // Arrange
      const action = AuthActions.loginFailure({ error: {} as any });

      // Act
      const result = authReducer(initialStateMock, action);

      // Assert
      expect(result).toEqual(initialStateMock);
    });
  });

  describe('logout', () => {
    it('should return the current state', () => {
      // Arrange
      const action = AuthActions.logout();

      // Act
      const result = authReducer(initialStateMock, action);

      // Assert
      expect(result).toEqual(initialStateMock);
    });

    it('should return the current state on success', () => {
      // Arrange
      const action = AuthActions.logoutSuccess();

      // Act
      const result = authReducer(initialStateMock, action);

      // Assert
      expect(result).toEqual(initialStateMock);
    });

    it('should return the current state on failure', () => {
      // Arrange
      const action = AuthActions.logoutFailure({ error: {} as any });

      // Act
      const result = authReducer(initialStateMock, action);

      // Assert
      expect(result).toEqual(initialStateMock);
    });
  });

  describe('getUserProfile', () => {
    it('should return the current state', () => {
      // Arrange
      const action = AuthActions.getUserProfile();

      // Act
      const result = authReducer(initialStateMock, action);

      // Assert
      expect(result).toEqual(initialStateMock);
    });

    it('should return the current state on success', () => {
      // Arrange
      const user = {
        id: '1',
        name: 'John Doe',
        email: '',
        groupIds: [],
        settledDebts: {},
      };
      const action = AuthActions.getUserProfileSuccess({ user });

      // Act
      const result = authReducer(initialStateMock, action);

      // Assert
      expect(result).toEqual({
        ids: ['1'],
        entities: { 1: user },
        currentUserId: '1',
      });
    });

    it('should return the current state on failure', () => {
      // Arrange
      const action = AuthActions.getUserProfileFailure({ error: {} as any });

      // Act
      const result = authReducer(initialStateMock, action);

      // Assert
      expect(result).toEqual(initialStateMock);
    });
  });
});
