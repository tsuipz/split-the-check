import { selectCurrentUserId } from './auth.selectors';

describe('Auth Selectors', () => {
  describe('selectCurrentUserId', () => {
    it('should return the current user id', () => {
      // Arrange
      const state = {
        currentUserId: '123',
      } as any;
      const result = '123';

      // Act
      const currentUserId = selectCurrentUserId.projector(state);

      // Assert
      expect(currentUserId).toEqual(result);
    });
  });
});
