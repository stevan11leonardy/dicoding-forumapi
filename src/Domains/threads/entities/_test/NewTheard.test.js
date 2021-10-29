const NewThread = require('../NewThread');

describe('NewThread entities', () => {
  it('should throw error when not contain owner id', () => {
    // Arrange
    const payload = {
      title: 'title',
    };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_LOGIN');
  });
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'title',
      ownerId: 'ownerId',
    };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 'title',
      ownerId: 'ownerId',
      body: 123,
    };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewThread entities correctly', () => {
    // Arrange
    const payload = {
      title: 'title',
      body: 'body',
      ownerId: 'ownerId',
    };

    // Action
    const newThread = new NewThread(payload);

    // Assert
    expect(newThread).toBeInstanceOf(NewThread);
    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
    expect(newThread.ownerId).toEqual(payload.ownerId);
  });
});
